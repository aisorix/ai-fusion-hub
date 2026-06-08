import type { UserPlan } from "@/stores/chatStore";

export const PLAN_RANK: Record<string, number> = {
  free: 0,
  basic: 1,
  pro: 2,
  premium: 3,
  premium_plus: 4,
  max: 5,
  enterprise: 6,
};

export type RequiredPlan = keyof typeof PLAN_RANK;

export const meetsPlan = (plan: UserPlan | string | undefined | null, required: RequiredPlan): boolean => {
  const have = PLAN_RANK[(plan as string) ?? "free"] ?? 0;
  const need = PLAN_RANK[required] ?? 0;
  return have >= need;
};

export const PLAN_DISPLAY_NAMES: Record<string, string> = {
  free: "Free Trial",
  basic: "Sorix Basic",
  pro: "Sorix Pro",
  premium: "Sorix Premium",
  premium_plus: "Sorix Premium Plus",
  max: "Sorix Max",
  enterprise: "Enterprise",
};
