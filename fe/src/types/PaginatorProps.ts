interface PaginatorProps {
  currentPage: number;
  lastPage: number;
  perPage: number;
  onPageChange: (first: number, page: number) => void;
}

export default PaginatorProps;
