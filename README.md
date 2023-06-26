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
