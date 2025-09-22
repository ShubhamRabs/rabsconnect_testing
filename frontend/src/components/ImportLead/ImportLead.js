import React from "react";
import Cookies from "js-cookie";
import MasterCSV from "../../csvfile/masterCSV.csv"
import MasterUserCSV from "../../csvfile/master_usersCSV.csv";
import UsersCSV from "../../csvfile/usersCSV.csv";
import { useMui, useSetting } from "../../hooks/Hooks";
import ImportHandler from "../../Handler/ImportHandler";
import { CustomDownload } from "../../hooks/Function";

// ImportLead component
const ImportLead = ({ HandleImport }) => {
  // Destructuring Material-UI components and icons from custom hook
  const { TabContext, Tab, TabPanel, TabList } = useMui();

  const { globalData } = useSetting();

  const isMaster = Cookies.get("type") === "Admin";

  // State to manage selected tab (Master or Users)
  const [importTabs, setImportTabs] = React.useState(isMaster ? "Master" : "Users");

  // Function to trigger CSV download based on the role (master or users)
  const CSVDownload = (role) => {
    if (role === "master") {
      CustomDownload(MasterCSV, "masterCSV.csv");
    } else if (role === "users") {
      if(Cookies.get("type") === "Admin"){
        CustomDownload(MasterUserCSV, "master_usersCSV.csv");
      }else{
        CustomDownload(UsersCSV, "usersCSV.csv");
      }
    }
  };

  // JSX structure of the component
  return (
    <TabContext value={importTabs}>
      <div style={{ borderBottom: 1, borderColor: "divider" }}>
        <TabList onChange={(event, newValue) => setImportTabs(newValue)}>
          {/* Tabs for Master and Users CSV */}
          {isMaster && (
            <Tab
              style={{ textTransform: "capitalize", padding: 0, width: "50%" }}
              label="Master CSV"
              value="Master"
            />
          )}
          <Tab
            style={{ textTransform: "capitalize", padding: 0, width: "50%" }}
            label="Users CSV"
            value="Users"
          />
        </TabList>
      </div>
      {/* TabPanel for Master CSV */}
      <TabPanel value="Master">
        {/* ImportHandler for Master CSV */}
        <ImportHandler
          ImportType="Master"
          HandleImport={HandleImport}
          downloadCSV={() => CSVDownload("master")}
          ImportAPIUrl={`${globalData.API_URL}/import-lead/import-master-lead`}
          SideBarInvalidateQueries="SubMenuLeadCount"
          ImportMsg="Select a file from your computer,
                      accept's: .csv file
                      (working with approx 2,000 leads CSV)"
        />
      </TabPanel>
      {/* TabPanel for Users CSV */}
      <TabPanel value="Users">
        {/* ImportHandler for Users CSV */}
        <ImportHandler
          ImportType="Users"
          HandleImport={HandleImport}
          downloadCSV={() => CSVDownload("users")}
          ImportAPIUrl={`${globalData.API_URL}/import-lead/import-user-lead`}
          SideBarInvalidateQueries="SubMenuLeadCount"
          ImportMsg="Select a file from your computer,
          accept's: .csv file
          assignto_id : SM id in which you want to assign leads,
          assignby_id : fixed master id for all leads
          (working with approx 2,000 leads CSV)"
        />
      </TabPanel>
    </TabContext>
  );
};

export default ImportLead;
