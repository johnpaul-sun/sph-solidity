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
