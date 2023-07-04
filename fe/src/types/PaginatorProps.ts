interface PaginatorProps {
  currentPage: number;
  lastPage: number;
  itemPerPage: number;
  onPageChange: (itemPerPage: number, pageNumber: number) => void;
}

export default PaginatorProps;
