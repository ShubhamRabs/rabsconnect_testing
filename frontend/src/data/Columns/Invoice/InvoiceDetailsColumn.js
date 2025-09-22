import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CheckIcon from "@mui/icons-material/Check";
import BalanceIcon from "@mui/icons-material/Balance";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export let InvoiceDetailsColumn = [];

InvoiceDetailsColumn = [
  {
    Header: "#ID",
    accessor: "inv_id",
  },
  {
    Header: <TrendingUpIcon />,
    accessor: "partially_amount",
    Cell: ({ row }) => {
      const { payment_status, total_due, partially_amount } = row.original;
      let icon;
      let color;

      if (payment_status === "Unpaid") {
        icon = <ErrorOutlineIcon />;
        color = "#ff3d1c";
      } else if (payment_status === "Paid") {
        icon = <CheckIcon />;
        color = "#71dd37";
      } else if (payment_status === "Partially Paid") {
        const balance = total_due - partially_amount;
        icon = <BalanceIcon />;
        color = "#ffab00";
      }

      return <span style={{ color }}>{icon}</span>;
    }
  },

  // {
  //   Header: <TrendingUpIcon />,
  //   accessor: "icon",
  // },
  {
    Header: "CLIENT",
    accessor: "inv_to",
  },

  {
    Header: "Created DATE",
    accessor: "create_dt",
  },
  {
    Header: "Due DATE",
    accessor: "due_date",
  },
  {
    Header: "TOTAL",
    accessor: "total_due",
    Cell: ({ value }) => `Rs. ${value}` // Custom cell rendering to add "Rs." before the value
  },
  {
    Header: "BALANCE",
    accessor: "",
    Cell: ({ row }) => {
      const { payment_status, total_due, partially_amount } = row.original;
      let content;
      let backgroundColor;

      if (payment_status === "Unpaid") {
        content = `Rs. ${total_due}`;
        backgroundColor = "#ff3d1c";
      } else if (payment_status === "Paid") {
        content = "Paid";
        backgroundColor = "#71dd37";
      } else if (payment_status === "Partially Paid") {
        const balance = total_due - partially_amount;
        content = `Rs. ${balance}`;
        backgroundColor = "#ffab00";
      }

      return (
        <div style={{ backgroundColor, padding: "5px", border:"1px solid transparent", borderRadius:'20px', color:"#fff", }}>
          {content}
        </div>
      );
    }
  }


];