import { z } from "zod";
import { JAKARTA_INPUT_PATTERN, parseJakartaInputValue } from "@/lib/time";
import { Constants, type Tables } from "@/lib/supabase/database.types";

export const TITLE_MAX_LENGTH = 200;

export const urgencySchema = z.enum(Constants.public.Enums.task_urgency);
export const taskStatusSchema = z.enum(Constants.public.Enums.task_status);
export const taskIdSchema = z.uuid({ error: "Tugas tidak dikenali." });

export type Urgency = z.infer<typeof urgencySchema>;
export type TaskStatus = z.infer<typeof taskStatusSchema>;

export const URGENCY_OPTIONS = urgencySchema.options;
export const DEFAULT_URGENCY: Urgency = "sedang";

const deadlineFieldSchema = z
  .union([
    z.literal(""),
    z.string().regex(JAKARTA_INPUT_PATTERN, { error: "Format deadline tidak valid." }),
  ])
  .optional()
  .transform((value) => (value ? parseJakartaInputValue(value).toISOString() : null));

export const taskInputSchema = z.object({
  title: z
    .string({ error: "Nama tugas wajib diisi." })
    .trim()
    .min(1, { error: "Nama tugas wajib diisi." })
    .max(TITLE_MAX_LENGTH, { error: `Nama tugas maksimal ${TITLE_MAX_LENGTH} karakter.` }),
  urgency: urgencySchema.default(DEFAULT_URGENCY),
  deadline: deadlineFieldSchema,
});

export type TaskInput = z.infer<typeof taskInputSchema>;

export type Task = Pick<
  Tables<"tasks">,
  "id" | "short_id" | "title" | "urgency" | "deadline" | "status" | "created_at" | "completed_at"
>;
