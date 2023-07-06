# sph-solidity

A simulation project about blockchain technology.

## About

SPH_Solidity is decentralized system for starting a campaign to support indie/startup projects using tokens in the blockchain.

It highlights transparency, accountability, and reliability in making sure that the donations are going to the right individuals and organizations.

## Team

- Chevy
- John
- Jason
- Wylen
- Arden
- Keno
- Kent

## Setup

_Note: Make sure to have `yarn` installed globally. If not, run:_

```
npm install --global yarn
yarn --version
```

1. Clone repository

```
git@github.com:framgia/sph-solidity.git
```

2. Create .env file

```
cp .env.example fe/.env
cp .env.example smart_contract/.env
```

3. Update .env files

```
API_URL =
CONTRACT_ADDRESS =
```

4. Install dependencies

- In root directory:

```
npm install
```

- In `fe` directory:

```
npm install
```

- In `smart_contract` directory:

```
npm install
```

## Local Development

Nuxt: http://localhost:3000

```
npm run nuxt:dev
```

Hardhat: http://127.0.0.1:8545/

```
npm run hardhat:compile
npm run hardhat:node
```

In another terminal, run this command:

```
npm run hardhat:deploy-local
```

Set the returned contract address to environment variable `CONTRACT_ADDRESS`

```
npm run hardhat:interact-local
```

Hardhat + Alchemy: https://eth-sepolia.g.alchemy.com/v2/KPjBlFd432ifoUNi8UKzGcq-uL1OhX31

```
npm run hardhat:compile
```

Update smart_contract/.env file

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

Nuxt

```
npm run nuxt:eslint
npm run nuxt:prettier
```

Hardhat

```
npm run hardhat:solhint
npm run hardhat:prettier
```

## Production

Nuxt

- Build the application for production:
  ```
  npm run build
  ```
- Locally preview production build:
  ```
  npm run preview
  ```

## Wallet Setup

### Install MetaMask for Chrome to access features

- Download Link -> https://metamask.io/download/
- Once installed, create an account.

### Enable Testnet

- Click the MetaMask extension then click the `Show/hide` link. (See image below)
  - ![image](https://github.com/framgia/sph-solidity/assets/104751512/436bb9fe-717f-4a5f-9516-14e753d04636)

- After that, make sure to turn on the `Show test networks`. (See image below)
  - ![image](https://github.com/framgia/sph-solidity/assets/104751512/768e9f85-a170-4e0b-a1d2-2c2539e9396f)

- Once done, Click again the MetaMask extension and select from `Ethereum Mainnet` to `Sepolia test network`. (See image below)
  - ![image](https://github.com/framgia/sph-solidity/assets/104751512/303fc528-4d8f-4aef-b9dc-503218ec26bc)

### Fund your Sepolia Wallet

- Go to Sepolia Faucet -> https://sepoliafaucet.com/

- Log in using your Alchemy account, you can use your Google account when you sign up at Alchemy
  - ![image](https://github.com/framgia/sph-solidity/assets/104751512/dd399335-c2b0-414b-908f-3ae06c2e020b)

- Once you logged in, copy your Sepolia Address in your MetaMask wallet and paste it into the Sepoli Faucet then click `Send Me ETH` to claim your `0.5` ETH
  - ![image](https://github.com/framgia/sph-solidity/assets/104751512/5f569dbb-34d4-4913-9331-0499e3130222)

## Once all is done, you can now explore the features of this Decentralized Crowdfunding Application

- Local -> http://localhost:3000/
- Hosted -> https://sph-solidity-fe.vercel.app/
