<template>
  <div>
    <div
      class="h-[560px] grid grid-cols-3 grid-rows-1 gap-4 text-center bg-gradient-container"
    >
      <div class="flex flex-col justify-center items-center">
        <IconsBlocksLeft />
      </div>
      <div class="flex flex-col justify-center items-center gap-8">
        <h1
          class="text-[40px] bg-gradient text-transparent bg-clip-text font-bold text-4xl leading-[125%]"
        >
          WELCOME TO SUNBLOCK
        </h1>
        <p
          class="font-bold text-base max-w-[480px] text-center leading-[125%] text-lg"
        >
          Contribute to projects and innovations that matter using Blockchain
          technology.
        </p>
        <div class="flex flex-col justify-center items-center">
          <p class="text-base mb-2">Want to make a project?</p>
          <BaseButton class="btn-gradient h-10 px-4 font-bold text-sm uppercase"
            >Start a campaign</BaseButton
          >
        </div>
      </div>
      <div class="flex flex-col justify-center items-center">
        <IconsBlocksRight />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
