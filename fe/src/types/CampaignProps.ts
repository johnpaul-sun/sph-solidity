interface Creator {
  address: string;
  totalCampaigns: number | string;
  imgSrc: string;
}

interface Donator {
  address: string;
  amount: number | string;
}

interface CampaignProps {
  id: number;
  creator: Creator;
  title: string;
  imgSrc: string;
  story: string;
  daysLeft: number;
  donations: number | string;
  totalBackers: number;
  donators: Donator[];
}

export default CampaignProps;
