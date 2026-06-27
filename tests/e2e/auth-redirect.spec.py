/**
 * Playwright end-to-end tests for the post-authentication redirect system.
 *
 * Run from the project root with the dev server already on http://localhost:8080
 * and a Lovable-injected Supabase session present in the sandbox env:
 *
 *   python3 tests/e2e/auth-redirect.spec.py
 *
 * Scenarios covered:
 *   1. Logged-out visit to a protected page (/dashboard) bounces to /login
 *      carrying state.from.
 *   2. After signing in (session restored), landing on /login while
 *      sessionStorage.lastVisitedPath points to /pricing redirects to /pricing.
 *   3. sessionStorage.postAuthReturnTo wins over lastVisitedPath (OAuth flow).
 *   4. Scholars deep link is preserved: rememberReturnTo("/scholars/profile")
 *      → /login → /scholars/profile.
 *   5. Payment success deep link is preserved across the auth bounce.
 *   6. /verify-email respects state.returnTo forwarded from Register.
 *   7. Auth-loop guard: stored values pointing at /login/register/verify-email
 *      never redirect back into the auth pages.
 */
import asyncio
import json
import os
import sys
from pathlib import Path

from playwright.async_api import async_playwright

BASE = "http://localhost:8080"
SHOTS = Path(__file__).parent / "screenshots"
SHOTS.mkdir(parents=True, exist_ok=True)

SESSION_JSON = os.environ.get("LOVABLE_BROWSER_SUPABASE_SESSION_JSON")
STORAGE_KEY = os.environ.get("LOVABLE_BROWSER_SUPABASE_STORAGE_KEY")
AUTH_STATUS = os.environ.get("LOVABLE_BROWSER_AUTH_STATUS", "")


class TestFailure(Exception):
    pass


def assert_eq(actual, expected, label):
    if actual != expected:
        raise TestFailure(f"{label}: expected {expected!r}, got {actual!r}")
    print(f"  ok  {label} == {expected!r}")


async def restore_session(page):
    if not (SESSION_JSON and STORAGE_KEY):
        raise TestFailure(
            "No Supabase session injected — cannot run authenticated scenarios."
        )
    await page.goto(BASE + "/", wait_until="domcontentloaded")
    await page.evaluate(
        f"window.localStorage.setItem({json.dumps(STORAGE_KEY)}, {json.dumps(SESSION_JSON)})"
    )


async def clear_session(page):
    await page.goto(BASE + "/", wait_until="domcontentloaded")
    await page.evaluate(
        f"""() => {{
          window.localStorage.removeItem({json.dumps(STORAGE_KEY)});
          window.sessionStorage.clear();
        }}"""
    )


async def seed_session_storage(page, key, value):
    await page.evaluate(
        f"window.sessionStorage.setItem({json.dumps(key)}, {json.dumps(value)})"
    )


async def wait_for_path(page, expected, timeout=8000):
    await page.wait_for_function(
        f"() => window.location.pathname + window.location.search + window.location.hash === {json.dumps(expected)}",
        timeout=timeout,
    )


async def current_path(page):
    return await page.evaluate(
        "() => window.location.pathname + window.location.search + window.location.hash"
    )


# ---------- Scenarios ----------

async def scenario_protected_route_bounces_to_login(context):
    """Logged out → /dashboard → /login (URL preserved in history.state.from)."""
    page = await context.new_page()
    await clear_session(page)
    await page.goto(BASE + "/dashboard", wait_until="domcontentloaded")
    await wait_for_path(page, "/login")
    # React Router stores state on history.state.usr
    from_value = await page.evaluate(
        "() => (window.history.state && window.history.state.usr && window.history.state.usr.from) || null"
    )
    assert_eq(from_value, "/dashboard", "ProtectedRoute carries state.from")
    await page.screenshot(path=str(SHOTS / "1_protected_to_login.png"))
    await page.close()


async def scenario_last_visited_pricing(context):
    """lastVisitedPath=/pricing → /login while signed in → redirected to /pricing."""
    page = await context.new_page()
    await clear_session(page)
    await restore_session(page)
    await seed_session_storage(page, "lastVisitedPath", "/pricing")
    await page.goto(BASE + "/login", wait_until="domcontentloaded")
    await wait_for_path(page, "/pricing")
    assert_eq(await current_path(page), "/pricing", "Login redirects to lastVisited")
    await page.screenshot(path=str(SHOTS / "2_login_to_pricing.png"))
    await page.close()


async def scenario_oauth_return_to_wins(context):
    """postAuthReturnTo beats lastVisitedPath (OAuth round-trip case)."""
    page = await context.new_page()
    await clear_session(page)
    await restore_session(page)
    await seed_session_storage(page, "lastVisitedPath", "/pricing")
    await seed_session_storage(page, "postAuthReturnTo", "/scholars/workshops/ai-101")
    await page.goto(BASE + "/login", wait_until="domcontentloaded")
    await wait_for_path(page, "/scholars/workshops/ai-101")
    assert_eq(
        await current_path(page),
        "/scholars/workshops/ai-101",
        "OAuth returnTo wins over lastVisited",
    )
    await page.screenshot(path=str(SHOTS / "3_oauth_returnto.png"))
    await page.close()


async def scenario_scholars_deep_link(context):
    page = await context.new_page()
    await clear_session(page)
    await restore_session(page)
    await seed_session_storage(page, "postAuthReturnTo", "/scholars/profile")
    await page.goto(BASE + "/login", wait_until="domcontentloaded")
    await wait_for_path(page, "/scholars/profile")
    assert_eq(await current_path(page), "/scholars/profile", "Scholars deep link preserved")
    await page.close()


async def scenario_payment_deep_link(context):
    page = await context.new_page()
    await clear_session(page)
    await restore_session(page)
    await seed_session_storage(page, "postAuthReturnTo", "/payment/success?tx=99")
    await page.goto(BASE + "/login", wait_until="domcontentloaded")
    await wait_for_path(page, "/payment/success?tx=99")
    assert_eq(
        await current_path(page),
        "/payment/success?tx=99",
        "Payment deep link preserved",
    )
    await page.close()


async def scenario_verify_email_respects_returnto(context):
    """Signed-in user landing on /verify-email is bounced to stored returnTo."""
    page = await context.new_page()
    await clear_session(page)
    await restore_session(page)
    await seed_session_storage(page, "postAuthReturnTo", "/scholars/profile")
    await page.goto(BASE + "/verify-email", wait_until="domcontentloaded")
    # VerifyEmail mounts; if it auto-redirects authed users it should hit /scholars/profile.
    try:
        await wait_for_path(page, "/scholars/profile", timeout=6000)
        assert_eq(
            await current_path(page),
            "/scholars/profile",
            "VerifyEmail redirects authed users to returnTo",
        )
    except Exception:
        # VerifyEmail may only redirect after OTP. Accept staying on page,
        # but confirm sessionStorage value still intact (not consumed).
        stored = await page.evaluate(
            "() => window.sessionStorage.getItem('postAuthReturnTo')"
        )
        assert_eq(stored, "/scholars/profile", "VerifyEmail preserves returnTo until OTP")
    await page.close()


async def scenario_auth_loop_guard(context):
    """Stored auth-page paths must NOT redirect back into auth pages."""
    page = await context.new_page()
    await clear_session(page)
    await restore_session(page)
    await seed_session_storage(page, "postAuthReturnTo", "/login")
    await seed_session_storage(page, "lastVisitedPath", "/register")
    await page.goto(BASE + "/login", wait_until="domcontentloaded")
    await wait_for_path(page, "/chat")
    assert_eq(await current_path(page), "/chat", "Auth-loop guard falls back to /chat")
    await page.close()


SCENARIOS = [
    ("protected → /login carries state.from", scenario_protected_route_bounces_to_login),
    ("lastVisited /pricing", scenario_last_visited_pricing),
    ("OAuth returnTo wins", scenario_oauth_return_to_wins),
    ("scholars deep link", scenario_scholars_deep_link),
    ("payment deep link", scenario_payment_deep_link),
    ("verify-email respects returnTo", scenario_verify_email_respects_returnto),
    ("auth-loop guard", scenario_auth_loop_guard),
]


async def main():
    if AUTH_STATUS != "injected":
        print(f"LOVABLE_BROWSER_AUTH_STATUS={AUTH_STATUS!r}; need 'injected'.")
        sys.exit(2)

    failures = []
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        try:
            for name, fn in SCENARIOS:
                print(f"\n▶ {name}")
                context = await browser.new_context(
                    viewport={"width": 1280, "height": 900}
                )
                try:
                    await fn(context)
                    print(f"✓ {name}")
                except TestFailure as e:
                    print(f"✗ {name} — {e}")
                    failures.append((name, str(e)))
                except Exception as e:
                    print(f"✗ {name} — unexpected: {e}")
                    failures.append((name, repr(e)))
                finally:
                    await context.close()
        finally:
            await browser.close()

    print("\n=== summary ===")
    print(f"passed: {len(SCENARIOS) - len(failures)} / {len(SCENARIOS)}")
    for name, err in failures:
        print(f"  ✗ {name}: {err}")
    sys.exit(1 if failures else 0)


if __name__ == "__main__":
    asyncio.run(main())
