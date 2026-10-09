import type { Urgency } from "@/tasks/schema";

export const URGENCY_LABELS: Record<Urgency, string> = {
  banget: "Banget",
  sedang: "Sedang",
  ringan: "Ringan",
};

export const URGENCY_BADGE_CLASSES: Record<Urgency, string> = {
  banget: "bg-urgency-banget-soft text-urgency-banget",
  sedang: "bg-urgency-sedang-soft text-urgency-sedang",
  ringan: "bg-urgency-ringan-soft text-urgency-ringan",
};

export const URGENCY_DOT_CLASSES: Record<Urgency, string> = {
  banget: "bg-urgency-banget",
  sedang: "bg-urgency-sedang",
  ringan: "bg-urgency-ringan",
};

export const URGENCY_PICKER_CHECKED_CLASSES: Record<Urgency, string> = {
  banget: "peer-checked:border-urgency-banget peer-checked:bg-urgency-banget-soft peer-checked:text-urgency-banget",
  sedang: "peer-checked:border-urgency-sedang peer-checked:bg-urgency-sedang-soft peer-checked:text-urgency-sedang",
  ringan: "peer-checked:border-urgency-ringan peer-checked:bg-urgency-ringan-soft peer-checked:text-urgency-ringan",
};
