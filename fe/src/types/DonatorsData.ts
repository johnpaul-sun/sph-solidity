export default interface DonatorsData {
  donatorsList: {
    id: number;
    donator: string;
    campaignTitle: string;
    donationAmount: number;
  }[];
  totalDonators: number;
  totalPages: number;
  nextPage: number;
  previousPage: number;
}
