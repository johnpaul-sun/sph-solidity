import * as z from "zod";

export const CreateCampaignRequestSchema = z.object({
  fullname: z
    .string()
    .min(5, { message: "Must be 5 or more characters long " }),
  campaign: z
    .string()
    .min(5, { message: "Must be 5 or more characters long " }),
  story: z.string().min(20, { message: "Must be 20 or more characters long " }),
  upload: z.string().optional(),
  goal: z.number({
    required_error: "Goal is required",
    invalid_type_error: "Invalid input"
  }),
  date: z.string()
});

export type CreateCampaignRequest = z.infer<typeof CreateCampaignRequestSchema>;
