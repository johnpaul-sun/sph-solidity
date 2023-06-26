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
