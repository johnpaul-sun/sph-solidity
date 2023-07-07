import * as z from "zod";

const customErrorMap: z.ZodErrorMap = (error, ctx) => {
  switch (error.code) {
    case z.ZodIssueCode.too_small:
      return {
        message: `Amount should be greater that 0`,
      };
    case z.ZodIssueCode.invalid_type:
      return {
        message: `Invalid input`,
      };
    default:
      return { message: ctx.defaultError };
  }
};

export const FundCampaignRequestSchema = z.object({
  amount: z
    .number({
      errorMap: customErrorMap,
    })
    .gt(0),
});

export type FundCampaignRequest = z.infer<typeof FundCampaignRequestSchema>;
