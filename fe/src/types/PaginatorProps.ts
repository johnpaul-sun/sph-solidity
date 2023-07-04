interface PaginatorProps {
  currentPage: number;
  lastPage: number;
  itemsPerPage: number;
  onPageChange: (itemsPerPage: number, pageNumber: number) => void;
}

export default PaginatorProps;
