<template>
  <nav aria-label="Page navigation example">
    <ul class="flex justify-center text-lg font-semibold">
      <li class="flex items-center">
        <div
          :class="`items-center justify-center rounded-md border border-transparent leading-tight ${leftIconsStatus} ml-1 flex h-4 w-4`"
          @click="onClickStart"
        >
          <Icon name="heroicons:chevron-double-left" class="h-full w-full" />
        </div>
      </li>
      <li class="flex items-center">
        <div
          :class="`items-center justify-center rounded-md border border-transparent leading-tight ${leftIconsStatus} ml-1 flex h-4 w-4`"
          @click="onClickPrevious"
        >
          <Icon name="heroicons:chevron-left" class="h-full w-full" />
        </div>
      </li>
      <li>
        <div
          :class="`items-center justify-center rounded-md border border-transparent leading-tight ${leftEllipsisStatus} `"
        >
          <Icon name="heroicons:ellipsis-horizontal" class="text-sm" />
        </div>
      </li>
      <li v-for="number in pageNumbers" :key="number">
        <div
          :class="`ml-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border border-transparent text-center text-sm leading-tight  hover:border-dark ${pageStatus(
            number,
          )} `"
          @click="setPage(number)"
        >
          {{ number }}
        </div>
      </li>
      <li>
        <div
          :class="`items-center justify-center rounded-md border border-transparent leading-tight ${rightEllipsisStatus} `"
        >
          <Icon name="heroicons:ellipsis-horizontal" class="text-sm" />
        </div>
      </li>
      <li class="flex items-center">
        <div
          :class="`items-center justify-center rounded-md border border-transparent leading-tight ${rightIconsStatus} ml-1 flex h-4 w-4`"
          @click="onClickNext"
        >
          <Icon name="heroicons:chevron-right" class="h-full w-full" />
        </div>
      </li>
      <li class="flex items-center">
        <div
          :class="`items-center justify-center rounded-md border border-transparent leading-tight ${rightIconsStatus} ml-1 flex h-4 w-4`"
          @click="onClickEnd"
        >
          <Icon name="heroicons:chevron-double-right" class="h-full w-full" />
        </div>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import PaginatorProps from "@/types/PaginatorProps";

const paginationProps = defineProps<PaginatorProps>();
const { itemsPerPage, lastPage, currentPage, onPageChange } =
  toRefs(paginationProps);

const numberToGenerate = lastPage.value <= 5 ? lastPage.value : 5;
const pageNumbers = ref<number[]>(
  Array.from(Array(numberToGenerate), (_, x) => x + 1),
);

const generatePageNumbers = (page: number): void => {
  const pageNumbersCopy = [...pageNumbers.value];

  if (lastPage.value > 5) {
    if (!pageNumbersCopy.includes(page)) {
      if (page < currentPage.value) {
        pageNumbersCopy.pop();
        pageNumbersCopy.unshift(page);
      } else if (page > currentPage.value) {
        pageNumbersCopy.shift();
        pageNumbersCopy.push(page);
      }
      pageNumbers.value = pageNumbersCopy;
    }
  }
};

const onClickStart = (): void => {
  if (currentPage.value - 1 < 1) return;

  onPageChange.value(itemsPerPage.value, 1);
  if (lastPage.value > 5) {
    pageNumbers.value = Array.from(Array(5), (_, x) => x + 1);
  }
};

const onClickPrevious = (): void => {
  const previousValue = currentPage.value - 1;
  if (previousValue < 1) return;

  onPageChange.value(itemsPerPage.value, previousValue);
  generatePageNumbers(previousValue);
};

const onClickNext = (): void => {
  const nextValue = currentPage.value + 1;
  if (nextValue > lastPage.value) return;

  onPageChange.value(itemsPerPage.value, nextValue);
  generatePageNumbers(nextValue);
};

const onClickEnd = (): void => {
  if (currentPage.value + 1 > lastPage.value) return;

  onPageChange.value(itemsPerPage.value, lastPage.value);

  if (lastPage.value > 5) {
    pageNumbers.value = Array.from(
      { length: lastPage.value - (lastPage.value - 5) + 1 },
      (_, i) => i + (lastPage.value - 5),
    );
  }
};

const setPage = (page: number): void => {
  if (page === currentPage.value) return;

  onPageChange.value(itemsPerPage.value, page);
};

const leftIconsStatus = computed(() => {
  return currentPage.value === 1
    ? "cursor-not-allowed text-disable"
    : "cursor-pointer hover:text-primary-10";
});

const rightIconsStatus = computed(() => {
  return currentPage.value === lastPage.value
    ? "cursor-not-allowed text-disable"
    : "cursor-pointer hover:text-primary-10";
});

const rightEllipsisStatus = computed(() => {
  return pageNumbers.value[pageNumbers.value.length - 1] < lastPage.value
    ? "ml-2 flex h-6 w-6"
    : "hidden";
});

const leftEllipsisStatus = computed(() => {
  return pageNumbers.value[0] > 1 ? "ml-2 flex h-6 w-6" : "hidden";
});

const pageStatus = (number: number) => {
  return number === currentPage.value
    ? "bg-dark text-white"
    : "text-primary-10 hover:text-dark";
};
</script>
