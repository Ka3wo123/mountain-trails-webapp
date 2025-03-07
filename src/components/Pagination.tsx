import { Pagination } from 'react-bootstrap';

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const CustomPagination = ({ currentPage, totalPages, onPageChange }: CustomPaginationProps) => {
  const getPaginationItems = () => {
    const paginationItems: React.ReactNode[] = [];

    paginationItems.push(<Pagination.First key="first" onClick={() => onPageChange(1)} />);

    paginationItems.push(
      <Pagination.Prev
        key="prev"
        onClick={() => onPageChange(currentPage > 1 ? currentPage - 1 : 1)}
      />
    );

    if (totalPages > 10) {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          paginationItems.push(
            <Pagination.Item key={i} active={i === currentPage} onClick={() => onPageChange(i)}>
              {i}
            </Pagination.Item>
          );
        }
        paginationItems.push(<Pagination.Ellipsis key="ellipsis-1" />);
        paginationItems.push(
          <Pagination.Item key={totalPages} onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </Pagination.Item>
        );
      } else if (currentPage >= totalPages - 3) {
        paginationItems.push(
          <Pagination.Item key={1} onClick={() => onPageChange(1)}>
            1
          </Pagination.Item>
        );
        paginationItems.push(<Pagination.Ellipsis key="ellipsis-2" />);
        for (let i = totalPages - 4; i <= totalPages; i++) {
          paginationItems.push(
            <Pagination.Item key={i} active={i === currentPage} onClick={() => onPageChange(i)}>
              {i}
            </Pagination.Item>
          );
        }
      } else {
        paginationItems.push(
          <Pagination.Item key={1} onClick={() => onPageChange(1)}>
            1
          </Pagination.Item>
        );
        paginationItems.push(<Pagination.Ellipsis key="ellipsis-3" />);
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          paginationItems.push(
            <Pagination.Item key={i} active={i === currentPage} onClick={() => onPageChange(i)}>
              {i}
            </Pagination.Item>
          );
        }
        paginationItems.push(<Pagination.Ellipsis key="ellipsis-4" />);
        paginationItems.push(
          <Pagination.Item key={totalPages} onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </Pagination.Item>
        );
      }
    } else {
      for (let i = 1; i <= totalPages; i++) {
        paginationItems.push(
          <Pagination.Item key={i} active={i === currentPage} onClick={() => onPageChange(i)}>
            {i}
          </Pagination.Item>
        );
      }
    }
    paginationItems.push(
      <Pagination.Next
        key="next"
        onClick={() => onPageChange(currentPage < totalPages ? currentPage + 1 : totalPages)}
      />
    );

    paginationItems.push(<Pagination.Last key="last" onClick={() => onPageChange(totalPages)} />);

    return paginationItems;
  };

  return <Pagination>{getPaginationItems()}</Pagination>;
};

export default CustomPagination;
