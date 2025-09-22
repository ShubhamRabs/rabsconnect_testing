// Importing necessary dependencies and styles
import React from "react";
import Papa from "papaparse";
import { extractRecordsValue } from "../hooks/Function";
import { useQueryClient } from "react-query";
import { useMui } from "../hooks/Hooks";
import Cookies from "js-cookie";
import "./../assets/css/Import.css";
import { Spinner } from "react-bootstrap";
 
// ImportHandler component
const ImportHandler = ({
  ImportType,
  HandleImport,
  downloadCSV,
  ImportAPIUrl,
  SideBarInvalidateQueries,
  ImportMsg,
}) => {
  // Destructuring Material-UI components and icons from custom hook
  const { Button, ImageIcon, LinearProgress, CloudDownloadIcon, Alert } = useMui();
  // Creating a query client from react-query
  const queryClient = useQueryClient();

  // State to manage progress bar visibility and value
  const [progressVisibility, setProgressVisibility] = React.useState(false);
  const [progress, setProgress] = React.useState(10);
  // State to manage uploaded file and file text visibility
  const [uploadedFile, setUploadedFile] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [fileTextVisible, setFileTextVisible] = React.useState(false);
  const [importErrorMsg, setImportErrorMsg] = React.useState("");

  // Function to handle file upload
  const setFileUpload = async (event) => {
    setUploadedFile(event.target.files[0]);
    setProgressVisibility(true);

    // Simulating progress with a timeout
    setTimeout(() => {
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            setProgressVisibility(false);
            setFileTextVisible(true);
            return 0;
          }
          const diff = Math.random() * 10;
          return Math.min(oldProgress + diff, 100);
        });
      }, 200);

      // Clearing the interval when the progress reaches 100%
      return () => {
        clearInterval(timer);
      };
    }, 500);
  };

  const handleCancle = () => {
    setUploadedFile(null);
    setImportErrorMsg("");
  }

  // Function to handle file upload
  const handleFileUpload = async () => {
    if (uploadedFile && loading===false) {
      setLoading(true);
      const fileType = uploadedFile.type;

      // Checking if the uploaded file is of a valid type
      if (fileType === "text/csv" || fileType === "application/vnd.ms-excel") {
        // Parsing CSV file using PapaParse library
        Papa.parse(uploadedFile, {
          header: true,
          complete: (results) => {
            // Extracting data from the parsed results
            const dataResult = results.data;
            let data = {data:dataResult.splice(0, dataResult.length - 1), login_u_id:Cookies.get("u_id"), login_type:Cookies.get("type")}; 
            // Creating request options for the API call
            const requestOptions = {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            };

            // Making a fetch call to the import API based on the file type
            fetch(ImportAPIUrl, requestOptions)
              .then((response) => response.json())
              .then((data) => {
                if(data.message && data.error){
                  // alert(data.message);
                  setImportErrorMsg(data.message);
                  setLoading(false);
                  return;
                } 
                // Invalidating the related query in the react-query cache
                queryClient.invalidateQueries(SideBarInvalidateQueries);
                // console.log(data.affectedRows);
                setImportErrorMsg("");
                // Handling the imported data using the provided HandleImport function
                HandleImport(data.affectedRows);
                setTimeout(() => {
                  setLoading(false);
                }, 3000);
              });
          },
        });
      } else {
        alert("Please upload a CSV or Excel file.");
      }
    }
  };

  // JSX structure of the component
  return (
    <>
      {/* Button to trigger CSV download */}
      <Button
        onClick={downloadCSV}
        style={{
          right: "3rem",
        }}
        className="download-csv-btn"
        startIcon={<CloudDownloadIcon />}
      >
        {ImportType} CSV
      </Button>

      {/* Displaying file upload container if no file is uploaded */}
      {!uploadedFile && (
        <Button className="upload-file-container">
          <ImageIcon sx={{ height: "35px", width: "35px", mb: 2 }} />
          {ImportMsg}
          {/* Input for file selection */}
          <input
            type="file"
            className="upload-file-input"
            accept=".csv, application/vnd.ms-excel"
            onChange={setFileUpload}
          />
        </Button>
      )}

      {/* Displaying uploaded file information */}
      {uploadedFile && (
        <Button className="upload-file-container">
          <ImageIcon sx={{ height: "35px", width: "35px", mb: 2 }} />
          <h5 className="upload-file-content">{uploadedFile.name}</h5>
        </Button>
      )}

      {/* Displaying alert if an error occurs while uploading */}
      {importErrorMsg && <Alert severity="error">{importErrorMsg}</Alert>}

      {/* Displaying progress bar while uploading */}
      <div
        className="progress-container"
        style={{ display: progressVisibility ? "flex" : "none" }}
      >
        <div style={{ alignItems: "center", width: "100%" }}>
          <LinearProgress variant="determinate" value={progress} />
        </div>
        <div style={{ minWidth: 35 }}>
          <span>{`${Math.round(progress)}%`}</span>
        </div>
      </div>

      {/* Displaying import buttons after uploading a file */}
      {uploadedFile && (
        <div className="import-button-container">
          {loading ? <Spinner animation="border" variant="secondary" /> : 
          <Button
            variant="outlined"
            disabled={!fileTextVisible ? true : false}
            onClick={handleFileUpload}>
            Import CSV
          </Button>}
          <Button
            variant="outlined"
            onClick={handleCancle}
            disabled={!fileTextVisible ? true : false}
          >
            Cancel
          </Button>
        </div>
      )}
    </>
  );
};

export default ImportHandler;
