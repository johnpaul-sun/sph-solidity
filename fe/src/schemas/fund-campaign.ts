import * as z from "zod";

export const FundCampaignRequestSchema = z.object({
  amount: z.number({
    required_error: "Amount is required",
    invalid_type_error: "Invalid input",
  }),
});

export type FundCampaignRequest = z.infer<typeof FundCampaignRequestSchema>;
