import promptSync from "prompt-sync";

import createCampaign from "./createCampaign";
import getUserDonations from "./getUserDonations";
import getCampaign from "./getCampaign";
import getUserCampaigns from "./getUserCampaigns";
import editCampaign from "./editCampaign";
import sendDonation from "./sendDonation";
import getCampaignDonations from "./getCampaignDonations";
import getDonatorsByWalletAddress from "./getDonatorsByWalletAddress";
import getRecentCampaigns from "./getRecentCampaigns";

async function main() {
  const prompt = promptSync();
  let input = "";
  let address, id, name, title, story, deadline, amount, pageSize, pageNumber, size;

  while (input !== "q") {
    console.log("-----------------MENU-----------------");
    console.log("[1] - Create campaign");
    console.log("[2] - Edit campaign");
    console.log("[3] - Get specific campaign");
    console.log("[4] - Get user's campaigns");
    console.log("[5] - Send donation to a campaign");
    console.log("[6] - Get user's donations");
    console.log("[7] - Get campaign's donations");
    console.log("[8] - Get donators by wallet address");
    console.log("[9] - Get recent campaigns");
    console.log("[q] - Quit");
    console.log("--------------------------------------");

    input = prompt("Choice: ");

    switch (input) {
      case "1":
        name = prompt("Full Name: ");
        title = prompt("Campaign Title: ");
        story = prompt("Story: ");
        amount = prompt("Goal: ");
        deadline = prompt("Date: ");

        await createCampaign(name, title, story, amount, deadline);

        break;
      case "2":
        id = prompt("Campaign ID: ");
        name = prompt("Full Name: ");
        title = prompt("Campaign Title: ");
        story = prompt("Story: ");
        amount = prompt("Goal: ");
        deadline = prompt("Date: ");

        await editCampaign(id, name, title, story, amount, deadline);

        break;
      case "3":
        id = prompt("Campaign ID: ");

        await getCampaign(id);

        break;
      case "4":
        pageSize = prompt("Page size: ");
        pageNumber = prompt("Page number: ");

        await getUserCampaigns(pageSize, pageNumber);

        break;
      case "5":
        id = prompt("Campaign ID: ");
        amount = prompt("Amount in ETH: ");

        await sendDonation(id, amount);

        break;
      case "6":
        address = prompt("User Address: ");
        pageSize = Number(prompt("Page Size: "));
        pageNumber = Number(prompt("Page Number: "));

        await getUserDonations(address, pageSize, pageNumber);
        break;
      case "7":
        id = prompt("Campaign ID: ");

        await getCampaignDonations(id);

        break;
      case "8":
        address = prompt("User Address: ");
        pageSize = prompt("Page size: ");
        pageNumber = prompt("Page number: ");

        await getDonatorsByWalletAddress(address, pageSize, pageNumber);

        break;
      case "9":
        size = prompt("Number of campaigns: ");

        await getRecentCampaigns(size);

        break;
      case "q":
        console.log("Exiting...");
        process.exit();
      default:
        console.log("Invalid input. Please try again.");
        break;
    }
  }
}

main();
