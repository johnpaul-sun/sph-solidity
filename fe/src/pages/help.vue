<template>
  <div class="flex-grow bg-linear-gradient-white-to-light">
    <div class="max-w-[960px] mx-auto space-y-6 py-6">
      <div class="flex items-center">
        <BaseButton @click="handleBack">
          <Icon
            name="material-symbols:chevron-left"
            class="h-6 w-10 hover:text-primary-400"
          />
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
            <ul>
              <li>- Download the metamask extension via the button below.</li>
              <li>- Once installed, create an account.</li>
              <li>
                - After creating an account, pin the metamask extension in your
                browser.
              </li>
            </ul>
          </div>
          <NuxtLink
            to="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
            class="flex w-fit text-sm btn-gradient justify-center items-center"
            target="_blank"
            >Install Metamask</NuxtLink
          >
          <div>
            If metamask is already installed in your browser, kindly proceed to
            the next step.
          </div>
        </HelpSetup>
        <HelpSetup
          :active-step="activeStep"
          :total-steps="totalSteps"
          step-number="2"
          step-title="Enable Testnet"
        >
          <div>
            <ul>
              <li>
                - First Click the Metamask extension, then click the the
                dropdown besides the Account name.
              </li>
              <li>- Then Enable the <u>Show test networks</u> toggle.</li>
              <li>- Finally, select the Sepolia network.</li>
            </ul>
          </div>
          <img src="../assets/img/first-step.png" alt="testnet" class="w-72" />
        </HelpSetup>
        <HelpSetup
          :active-step="activeStep"
          :total-steps="totalSteps"
          step-number="3"
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
            <img
              src="../assets/img/third-step.png"
              alt="testnet"
              class="w-100"
            />
          </div>
        </HelpSetup>
        <HelpSetup
          :active-step="activeStep"
          :total-steps="totalSteps"
          step-number="4"
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
              src="../assets/img/second-step.png"
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
      <div class="flex justify-between flex-row-reverse">
        <BaseButton
          v-if="activeStep < totalSteps"
          class="h-10 w-24 py-2 text-sm rounded-md bg-primary-400 text-white hover:bg-primary-500"
          @click="handleNext"
          >Next</BaseButton
        >
        <BaseButton
          v-if="activeStep == totalSteps"
          class="h-10 px-10 py-2 text-sm rounded-md bg-primary-400 text-white hover:bg-primary-500"
          @click="handleNext"
          >Go to dashboard</BaseButton
        >
        <BaseButton
          v-if="activeStep > 1"
          class="h-10 px-4 py-2 text-sm border border-1 border-primary-400 rounded-md text-primary-400 hover:border-primary-500 hover:text-primary-500"
          @click="handlePrevious"
          >Previous</BaseButton
        >
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const router = useRouter();
const activeStep = ref(1);
const totalSteps = ref(4);

const handleNext = (): void => {
  if (activeStep.value < totalSteps.value) {
    activeStep.value = activeStep.value + 1;
  } else {
    router.push("/");
  }
};

const handlePrevious = (): void => {
  if (activeStep.value > 1) {
    activeStep.value = activeStep.value - 1;
  }
};

const handleBack = () => router.back();
</script>
