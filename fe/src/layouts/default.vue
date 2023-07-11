<template>
  <div class="relative flex flex-col min-h-screen">
    <Navbar class="sticky top-0 z-50 backdrop-blur-md" />
    <slot class="z-50" />
    <Footer />
  </div>
</template>
