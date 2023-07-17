export interface Creator {
  address: string;
  fullName: string;
  imgSrc: string;
}

export interface Donation {
  donationId: number;
  address: string;
  amount: number;
}

export default interface Campaign {
  campaignId: number;
  creator: Creator;
  title: string;
  imgSrc: string;
  story: string;
  daysLeft: number;
  totalDonation: number;
  totalBackers: number;
  donations: Donation[];
}
