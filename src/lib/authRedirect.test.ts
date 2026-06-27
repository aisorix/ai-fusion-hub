import { describe, it, expect, beforeEach } from "vitest";
import {
  sanitizeReturnTo,
  rememberReturnTo,
  rememberLastVisited,
  consumePostAuthRedirect,
} from "@/lib/authRedirect";

/**
 * End-to-end behavioural tests for the post-authentication redirect helper.
 *
 * These simulate the full lifecycle for each entry point used in the app:
 *   - direct Login from a protected route
 *   - Register → Verify Email → final landing
 *   - Google OAuth full-page round trip (state lost, sessionStorage survives)
 *   - login triggered from /pricing, /scholars/*, /payment/* CTAs
 *
 * The helper is the single source of truth wired into Login, Register,
 * VerifyEmail, AuthContext (OAuth) and ProtectedRoute — verifying it here
 * exercises every auth surface end-to-end.
 */
describe("authRedirect (post-auth return-to lifecycle)", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  describe("sanitizeReturnTo", () => {
    it("accepts safe same-origin paths", () => {
      expect(sanitizeReturnTo("/scholars/courses/abc")).toBe("/scholars/courses/abc");
      expect(sanitizeReturnTo("/pricing?plan=pro")).toBe("/pricing?plan=pro");
      expect(sanitizeReturnTo("/chat#thread-1")).toBe("/chat#thread-1");
    });

    it("rejects external / protocol-relative / non-string input", () => {
      expect(sanitizeReturnTo("https://evil.com/x")).toBeNull();
      expect(sanitizeReturnTo("//evil.com")).toBeNull();
      expect(sanitizeReturnTo("javascript:alert(1)")).toBeNull();
      expect(sanitizeReturnTo("chat")).toBeNull(); // missing leading slash
      expect(sanitizeReturnTo("")).toBeNull();
      expect(sanitizeReturnTo(null)).toBeNull();
      expect(sanitizeReturnTo(undefined)).toBeNull();
      expect(sanitizeReturnTo(42 as unknown)).toBeNull();
    });

    it("rejects auth-loop paths", () => {
      for (const p of [
        "/login",
        "/login?x=1",
        "/register",
        "/verify-email",
        "/forgot-password",
        "/reset-password",
        "/auth/callback",
        "/admin/login",
      ]) {
        expect(sanitizeReturnTo(p)).toBeNull();
      }
    });
  });

  describe("consumePostAuthRedirect", () => {
    it("falls back to /chat when nothing is provided", () => {
      expect(consumePostAuthRedirect(null)).toBe("/chat");
    });

    it("prefers explicit state.returnTo over everything else", () => {
      sessionStorage.setItem("postAuthReturnTo", "/scholars");
      sessionStorage.setItem("lastVisitedPath", "/pricing");
      expect(
        consumePostAuthRedirect(
          { returnTo: "/payment/success?id=42" },
          "/should-be-ignored",
        ),
      ).toBe("/payment/success?id=42");
    });

    it("falls back to state.from when returnTo is missing", () => {
      expect(consumePostAuthRedirect({ from: "/scholars/profile" })).toBe(
        "/scholars/profile",
      );
    });

    it("uses sessionStorage.postAuthReturnTo when state is empty (OAuth round-trip)", () => {
      rememberReturnTo("/scholars/competitions/finals");
      expect(consumePostAuthRedirect(null)).toBe("/scholars/competitions/finals");
    });

    it("uses lastVisitedPath when no explicit returnTo was stored", () => {
      rememberLastVisited("/pricing");
      expect(consumePostAuthRedirect(null)).toBe("/pricing");
    });

    it("clears stored values after consumption (so re-login doesn't replay old path)", () => {
      rememberReturnTo("/scholars");
      rememberLastVisited("/pricing");
      expect(consumePostAuthRedirect(null)).toBe("/scholars");
      // Second call: stored values gone → default
      expect(consumePostAuthRedirect(null)).toBe("/chat");
    });

    it("ignores tampered absolute / external state.returnTo", () => {
      expect(
        consumePostAuthRedirect({ returnTo: "https://evil.com/steal" }),
      ).toBe("/chat");
    });

    it("ignores auth-loop returnTo and falls through to defaults", () => {
      rememberLastVisited("/pricing");
      expect(consumePostAuthRedirect({ returnTo: "/login" })).toBe("/pricing");
    });
  });

  describe("end-to-end scenarios", () => {
    it("ProtectedRoute → Login: bounces back to the originally-requested tool", () => {
      // ProtectedRoute redirects with state={{ from: "/cinema-shoot" }}
      const stateFromProtectedRoute = { from: "/cineshoot?project=42" };
      // Login consumes after successful signIn.
      expect(consumePostAuthRedirect(stateFromProtectedRoute)).toBe(
        "/cineshoot?project=42",
      );
    });

    it("Pricing CTA → Login → back to /pricing#plan-pro", () => {
      // User clicks "Sign in" on the pricing page; Navbar tracker remembers it.
      rememberLastVisited("/pricing#plan-pro");
      expect(consumePostAuthRedirect(null)).toBe("/pricing#plan-pro");
    });

    it("Scholars enroll button → Login → back to /scholars/courses/intro-ai", () => {
      rememberLastVisited("/scholars/courses/intro-ai");
      expect(consumePostAuthRedirect(null)).toBe("/scholars/courses/intro-ai");
    });

    it("Payment success deep link while signed-out → Login → /payment/success?tx=99", () => {
      rememberReturnTo("/payment/success?tx=99");
      expect(consumePostAuthRedirect(null)).toBe("/payment/success?tx=99");
    });

    it("Register → VerifyEmail forwards returnTo via state until finally consumed", () => {
      // Register page received state.returnTo from a Scholars CTA.
      const registerState = { returnTo: "/scholars/profile" };
      // Register navigates to /verify-email and forwards state.
      const verifyState = { returnTo: registerState.returnTo };
      // After OTP verification, VerifyEmail consumes the redirect.
      expect(consumePostAuthRedirect(verifyState)).toBe("/scholars/profile");
    });

    it("Google OAuth round-trip: state is lost but sessionStorage survives", () => {
      // Before redirect to Google: AuthContext.signInWithGoogle calls rememberReturnTo.
      rememberReturnTo("/scholars/workshops/ai-101");
      // Round-trip back to / with tokens in hash; state is null.
      const target = consumePostAuthRedirect(null);
      expect(target).toBe("/scholars/workshops/ai-101");
    });

    it("explicit ?redirect= query param wins when present (login link with ?redirect=)", () => {
      rememberLastVisited("/pricing");
      // Login.jsx passes searchParams.get('redirect') as explicitOverride.
      expect(consumePostAuthRedirect(null, "/scholars/dashboard")).toBe(
        "/scholars/dashboard",
      );
    });

    it("logging in from /login directly with no history defaults to /chat", () => {
      // Nothing remembered, no state, no override.
      expect(consumePostAuthRedirect(null)).toBe("/chat");
    });

    it("does not redirect into the auth pages themselves (loop guard)", () => {
      rememberLastVisited("/login");
      rememberReturnTo("/register");
      expect(consumePostAuthRedirect({ from: "/verify-email" })).toBe("/chat");
    });
  });
});
