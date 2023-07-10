<template>
  <div class="flex-grow bg-linear-gradient-white-to-light">
    <div class="max-w-[960px] mx-auto space-y-6 py-6">
      <div class="flex items-center space-x-2">
        <BaseButton @click="handleBack">
          <Icon name="material-symbols:chevron-left" class="h-6 w-6" />
        </BaseButton>
        <div class="font-bold text-2xl text-dark">METAMASK WALLET SETUP</div>
      </div>
      <div class="text-sm space-y-2">
        <HelpSetup
          :active-step="activeStep"
          :total-steps="totalSteps"
          step-number="1"
          step-title="Install metamask"
        >
          <div>
            Download the metamask extension via the button below. Once
            installed, create an account.
          </div>
          <NuxtLink
            to="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
            class="flex w-fit text-sm btn-gradient justify-center items-center"
            target="_blank"
            >Install Metamask</NuxtLink
          >
          <div>If metamask is already installed, proceed to the next step.</div>
        </HelpSetup>
        <HelpSetup
          :active-step="activeStep"
          :total-steps="totalSteps"
          step-number="2"
          step-title="Enable Testnet"
        >
          <div>
            Click the Metamask extension, then click the <u>Show/Hide</u> link
          </div>
          <img
            src="../assets/img/metamask-extension.png"
            alt="testnet"
            class="w-72"
          />
        </HelpSetup>
        <HelpSetup
          :active-step="activeStep"
          :total-steps="totalSteps"
          step-number="3"
          step-title="Enable Testnet"
        >
          <div>Make sure to toggle <u>Show test networks</u></div>
          <img
            src="../assets/img/toggle-test-networks.png"
            alt="testnet"
            class="w-72"
          />
        </HelpSetup>
        <HelpSetup
          :active-step="activeStep"
          :total-steps="totalSteps"
          step-number="4"
          step-title="Network Selection"
        >
          <div>
            Click on the Metamask extension and select
            <u>Sepolia test network</u>
          </div>
          <img
            src="../assets/img/select-sepolia-test-network.png"
            alt="testnet"
            class="w-72"
          />
        </HelpSetup>
        <HelpSetup
          :active-step="activeStep"
          :total-steps="totalSteps"
          step-number="5"
          step-title="Fund your Sepolia wallet"
        >
          <div class="space-y-2">
            <div>
              Go and login to the
              <NuxtLink
                to="https://sepoliafaucet.com"
                class="text-primary-400"
                target="_blank"
                >Sepolia Faucet</NuxtLink
              >
              website using your Alchemy account.
            </div>
            <div>
              If you don't have an account, you can go and sign up at
              <NuxtLink
                to="https://auth.alchemy.com/signup/"
                class="text-primary-400"
                target="_blank"
                >Alchemy</NuxtLink
              >
              using Google and continue to the wallet setup.
            </div>
          </div>
        </HelpSetup>
        <HelpSetup
          :active-step="activeStep"
          :total-steps="totalSteps"
          step-number="6"
          step-title="Fund your Sepolia wallet"
        >
          <div class="space-y-2">
            <div>
              Once your logged in, copy your Sepolia Address in your Metamask
              wallet and paste it into the Sepolia Faucet, then click
              <span class="text-primary-400">Send me ETH</span> to claim your
              <span class="text-primary-400">0.5 ETH</span>.
            </div>
            <img
              src="../assets/img/fund-sepolia-wallet.png"
              alt="testnet"
              class="w-72"
            />
          </div>
          <div>
            Setup is now complete! Go and connect your wallet to explore the
            features of this Decentralized Crowdfunding Application.
          </div>
        </HelpSetup>
      </div>
      <div class="flex space-x-2">
        <BaseButton
          v-if="activeStep > 1"
          class="h-10 px-4 py-2 text-sm font-bold border border-1 text-primary-10 border-primary-10 rounded-md"
          @click="handlePrevious"
          >Previous Step</BaseButton
        >
        <BaseButton
          v-if="activeStep < totalSteps"
          class="h-10 px-4 py-2 bg-clip-text text-sm font-bold text-transparent border border-1 border-primary-400 rounded-md bg-linear-gradient-primary"
          @click="handleNext"
          >Next Step</BaseButton
        >
        <BaseButton
          v-if="activeStep == totalSteps"
          class="h-10 px-4 py-2 text-sm font-bold btn-gradient"
          @click="handleNext"
          >Go to dashboard</BaseButton
        >
      </div>
    </div>
  </div>
</template>
<script setup>
const router = useRouter();
const activeStep = ref(1);
const totalSteps = ref(6);
const handleNext = () => {
  if (activeStep.value < totalSteps.value) {
    activeStep.value = activeStep.value + 1;
  } else {
    router.push("/");
  }
};

const handlePrevious = () => {
  if (activeStep.value > 1) {
    activeStep.value = activeStep.value - 1;
  }
};

const handleBack = () => {
  router.back();
};
</script>
