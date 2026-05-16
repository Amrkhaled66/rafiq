import type { ReactNode } from "react";
import type { TableColumn } from "react-data-table-component";

import Table from "@/shared/components/Table";

const DEFAULT_ROWS_PER_PAGE_OPTIONS = [10, 20, 50, 100] as const;

export default function AdminServerTable<T>({
  columns,
  data,
  isLoading,
  loadingText,
  noDataText,
  currentPage,
  rowsPerPage,
  totalRows,
  onPageChange,
  onRowsPerPageChange,
}: {
  columns: TableColumn<T>[];
  data: T[];
  isLoading: boolean;
  loadingText: ReactNode;
  noDataText: ReactNode;
  currentPage: number;
  rowsPerPage: number;
  totalRows: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number, page: number) => void;
}) {
  return (
    <Table
      columns={columns}
      data={data}
      progressPending={isLoading}
      progressComponent={<div className="py-6 text-sm text-subTitle">{loadingText}</div>}
      noDataComponent={<div className="py-6 text-sm text-subTitle">{noDataText}</div>}
      pagination
      paginationDefaultPage={currentPage}
      paginationPerPage={rowsPerPage}
      paginationRowsPerPageOptions={[...DEFAULT_ROWS_PER_PAGE_OPTIONS]}
      paginationServer
      paginationTotalRows={totalRows}
      onChangePage={onPageChange}
      onChangeRowsPerPage={onRowsPerPageChange}
      responsive
      highlightOnHover
      persistTableHead
    />
  );
}

