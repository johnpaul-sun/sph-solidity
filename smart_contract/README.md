# Hardhat

Look at the [Hardhat documentation](https://hardhat.org/hardhat-runner/docs/getting-started) to learn more.

## Setup

Make sure to install the dependencies:

```
npm install
```

## Local Development

Start the development server on `http://127.0.0.1:8545/`

```
npm run compile
npm run run-node
```

In another terminal, run this command:

```
npm run deploy-local
```

Set the returned contract address to environment variable `CONTRACT_ADDRESS`

```
npm run interact-local
```

Hardhat + Alchemy: https://eth-sepolia.g.alchemy.com/v2/KPjBlFd432ifoUNi8UKzGcq-uL1OhX31

```
npm run hardhat:compile
```

Update env file

```
API_URL = "https://eth-sepolia.g.alchemy.com/v2/KPjBlFd432ifoUNi8UKzGcq-uL1OhX31"
USER_KEY = <your metamask private key>
```

Deploy in Sepolia test network

```
npm run hardhat:deploy-sepolia
```

Set the returned contract address to environment variable `CONTRACT_ADDRESS`

```
npm run hardhat:interact-local
```

## Linting

```
npm run lint:solhint
npm run lint:prettier
```

## Other commands

```
npx hardhat help
REPORT_GAS=true npx hardhat test
```

## Crowdfunding App Commands

- Create campaign

  ```
  npx ts-node scripts/createCampaign.ts <name> <title> <story> <goal> <deadline>

  # Example
  npx ts-node scripts/createCampaign.ts "sample name" "sample title" "sample story" 36510000000 1701360000
  ```

- Get user's created campaigns

  ```
  npx ts-node scripts/getUserCampaigns.ts <page size> <page number>

  # Example
  npx ts-node scripts/getUserCampaigns.ts 1 1
  ```

- Update a specific campaign

  ```
  npx ts-node scripts/editCampaign.ts <campaign id> <name> <title> <story> <goal> <deadline>

  # Example
  npx ts-node scripts/editCampaign.ts "updated sample name" "updated sample title" "updated sample story" 36510000001 1701360001
  ```

- Send ETH to a selected campaign

  ```
  npx ts-node scripts/sendDonation.ts <campaign id> <donation in eth>

  # Example
  npx ts-node scripts/sendDonation.ts 0 0.0000025
  ```

- Get specific campaign

  ```
  npx ts-node scripts/getCampaign.ts <campaign id>

  # Example
  npx ts-node scripts/getCampaign.ts 0
  ```

- Get campaign donation list by campaign ID

  ```bash
  npx ts-node scripts/getCampaignDonations.ts <campaign id>

  # Example
  npx ts-node scripts/getCampaignDonations.ts  0
  ```

- Get donator list by campaign owner wallet address

  ```
  npx ts-node scripts/getDonatorsByWalletAddress.ts <campaign owner wallet address> <page size> <page number>

  # Example
  npx ts-node scripts/getDonatorsByWalletAddress.ts <campaign owner wallet address> 5 1
  ```

- Get user's donations list

  ```
  npx ts-node scripts/getUserDonations.ts <user address> <page size> <page number>

  # Example
  npx ts-node scripts/getUserDonations.ts 0xE5c5f1C02F62EeEB4F135161Fd9Af7b7BA1af4B8 2 1
  ```

- Get recent campaigns

  ```bash
  npx ts-node scripts/getRecentCampaigns.ts <size>

  # Example
  npx ts-node scripts/getRecentCampaigns.ts 6
  ```

- Search campaigns by title

  ```bash
  npx ts-node scripts/searchByTitle.ts <search string> <page size> <start index>

  # Example
  npx ts-node scripts/searchByTitle.ts "i am" 6 0
  ```
