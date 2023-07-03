export interface Creator {
  address: string;
  totalCampaigns: number;
  imgSrc: string;
}

export interface Donator {
  address: string;
  amount: number;
}

export default interface CampaignProps {
  id: number;
  creator: Creator;
  title: string;
  imgSrc: string;
  story: string;
  daysLeft: number;
  donations: number;
  totalBackers: number;
  donators: Donator[];
}
