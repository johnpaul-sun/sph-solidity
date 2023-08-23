interface CampaignCardProps {
  id?: number;
  imageUrl?: string;
  title: string;
  description: string;
  additionalClass?: string;
  ethValue: number | string;
  daysLeft: number | string;
  deadline: string;
  toLink?: string;
}

export default CampaignCardProps;
