import React from "react";
import { useMui } from "../../hooks/Hooks";

const CustomExport = ({ data, BtnName, disabled, handleExport }) => {
  const { Button, FileDownloadOutlinedIcon, Backdrop, CircularProgress } =
    useMui();

  const [ShowBackdrop, setShowBackdrop] = React.useState(false);

  const handleExportLeads = () => {
    {
      /* Author: Shubham Sonkar
        Date: 20-09-2023
        Show the Backdrop when exporting begins 
        */
    }
    setShowBackdrop(true);
    {
      /* Author: Shubham Sonkar
        Date: 20-09-2023
        Function to format date and time string
        */
    }
    const formatDateAndTime = (dateTimeString) => {
      if (dateTimeString === "0000-00-00 00:00:00") {
        return ""; // Handle empty date and time strings
      }
      const date = new Date(dateTimeString.replace(" ", "T")); // Convert to ISO format
      return date.toLocaleString(); // Adjust the formatting as needed
    };
    {
      /* Author: Shubham Sonkar
        Date: 20-09-2023
        Simulate an asynchronous export process 
        */
    }
    setTimeout(() => {
      {
        /* Author: Shubham Sonkar
          Date: 20-09-2023
          Create a CSV content string from the data
          */
      }
      const csvContent =
        "data:text/csv;charset=utf-8," +
        encodeURIComponent(
          /* Author: Shubham Sonkar
              Date: 20-09-2023
              Create the header row
              */
          Object.keys(data[0]).join(",") +
            "\n" +
            // Create data rows
            data
              .map((row) => {
                /* Author: Shubham Sonkar
              Date: 20-09-2023
              Map each value, formatting date and time if it's a date and time field
              */
                return Object.values(row)
                  .map((value) => {
                    return value instanceof Date
                      ? formatDateAndTime(value.toISOString())
                      : value;
                  })
                  .join(",");
              })
              .join("\n")
        );
      /* Author: Shubham Sonkar
              Date: 20-09-2023
              Create a data URI and trigger download
              */
      const link = document.createElement("a");
      link.setAttribute("href", csvContent);
      link.setAttribute("download", "data.csv");
      document.body.appendChild(link);
      link.click();
      /* Author: Shubham Sonkar
              Date: 20-09-2023
              Hide the Backdrop after exporting is done
              */
      setShowBackdrop(false);
      /* Author: Shubham Sonkar
        Date: 20-09-2023
        Simulated export duration (replace with your actual export duration)
        */
    }, 2000);
  };

  React.useEffect(() => {
    if (disabled) {
      handleExportLeads();
      setShowBackdrop(true);
    } else {
      setShowBackdrop(false);
    }
  }, [disabled]);

  return (
    <>
      <Button
        variant="contained"
        className="mx-2"
        startIcon={<FileDownloadOutlinedIcon />}
        onClick={handleExport}
        disabled={disabled}
      >
        {BtnName}
      </Button>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={ShowBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default CustomExport;
