import DataTableImport, {
  type TableColumn,
  type TableProps,
  type TableStyles,
} from "react-data-table-component";

const DataTable =
  (
    DataTableImport as typeof DataTableImport & {
      default?: typeof DataTableImport;
    }
  ).default ?? DataTableImport;

type SharedTableProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
} & Omit<TableProps<T>, "columns" | "data">;

export default function Table<T>({
  columns,
  data,
  ...props
}: SharedTableProps<T>) {
  return (
    <DataTable
      customStyles={customStyles}
      columns={columns}
      data={data}
      {...props}
    />
  );
}
/* -------------------------------------------------------------------------- */
/* Custom Styles                                                              */
/* -------------------------------------------------------------------------- */
const customStyles: TableStyles = {
  table: {
    style: {
      backgroundColor: "transparent",
    },
  },

  headRow: {
    style: {
      background: "linear-gradient(to right, #F9FAFB, #F3F4F6)",
      borderRadius: "12px",
      minHeight: "56px",
      borderBottom: "1px solid #E5E7EB",
    },
  },

  headCells: {
    style: {
      fontWeight: 700,
      fontSize: "13px",
      color: "#111827",
      padding: "16px",
      textTransform: "uppercase",
      letterSpacing: "0.4px",
    },
  },

  rows: {
    style: {
      maxHeight: "70px !important",
      fontSize: "14px",
      backgroundColor: "#FFFFFF",
      borderBottom: "1px solid #F1F5F9",
      transition: "background-color 0.2s ease",
      // "&:nth-of-type(even)": {
      //   background: "linear-gradient(to right, #F9FAFB, #F3F4F6)",
      // },
    },

    highlightOnHoverStyle: {
      backgroundColor: "#F8FAFC",
      boxShadow: "inset -5px 0px 0px 0px var(--brand-primary)",
      cursor: "pointer",
    },
  },

  cells: {
    style: {
      padding: "16px",
      whiteSpace: "normal",
      wordBreak: "break-word",
      alignItems: "center",
    },
  },

  pagination: {
    style: {
      borderTop: "1px solid #E5E7EB",
      padding: "14px",
      background: "#FAFAFA",
      borderBottomLeftRadius: "16px",
      borderBottomRightRadius: "16px",
    },

    pageButtonsStyle: {
      borderRadius: "8px",
      height: "36px",
      width: "36px",
      margin: "0 4px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      backgroundColor: "transparent",
      fill: "#6B7280",

      "&:hover:not(:disabled)": {
        backgroundColor: "#EFF6FF",
        fill: "#3B82F6",
      },

      "&:disabled": {
        cursor: "not-allowed",
        fill: "#D1D5DB",
      },
    },
  },
};
