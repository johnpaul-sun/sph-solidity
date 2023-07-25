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
  imageUrl: z.string().url({ message: "Invalid image url" }),
  goal: z
    .number({
      required_error: "Goal is required",
      invalid_type_error: "Invalid input",
    })
    .min(0)
    .max(10000000000),
  date: z.string(),
});

export type CreateCampaignRequest = z.infer<typeof CreateCampaignRequestSchema>;
