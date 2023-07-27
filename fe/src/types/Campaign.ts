export interface Creator {
  address: string;
  fullName: string;
  imageUrl: string;
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
  imageUrl: string;
  story: string;
  daysLeft: number;
  totalDonation: number;
  totalBackers: number;
  donations?: Donation[];
}
