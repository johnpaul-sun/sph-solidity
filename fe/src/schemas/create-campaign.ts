import * as z from "zod";

export const CreateCampaignRequestSchema = z.object({
  fullname: z
    .string()
    .min(5, { message: "Minimum character requirement is 5" })
    .max(30, { message: "Maximum character limit is 30" }),
  campaign: z
    .string()
    .min(5, { message: "Minimum character requirement is 5" })
    .max(30, { message: "Maximum character limit is 30" }),
  story: z
    .string()
    .min(20, { message: "Minimum character requirement is 20 " })
    .max(250, { message: "Maximum character limit is 250" }),
  upload: z.string().optional(),
  goal: z.number({
    required_error: "Goal is required",
    invalid_type_error: "Invalid input",
  }),
  date: z.string({ required_error: "Date is required" }),
});

export type CreateCampaignRequest = z.infer<typeof CreateCampaignRequestSchema>;
