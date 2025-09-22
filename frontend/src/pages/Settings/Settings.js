import React, { useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import SettingHandler from "../../Handler/SettingHandler";
import { useBootstrap } from "../../hooks/Hooks";
import Cookies from "js-cookie";
import "./Settings.css";
import Axios from "../../setting/axios";

const role = Cookies.get("role");

// Extracted TabPanel Component
const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`vertical-tabpanel-${index}`}
    aria-labelledby={`vertical-tab-${index}`}
    {...other}
  >
    {value === index && (
      <Box sx={{ p: 5 }}>
        <Typography>{children}</Typography>
      </Box>
    )}
  </div>
);

const a11yProps = (index) => ({
  id: `vertical-tab-${index}`,
  "aria-controls": `vertical-tabpanel-${index}`,
});

const Settings = () => {
  const [value, setValue] = useState(0);
  const [visibilityData, setVisibilityData] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get("/dmn");
        console.log("Settings:", response.data); // Replace with your actual endpoint
        setVisibilityData(response.data.lead); // Assuming response structure is as mentioned
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Define the headers based on your visibility data keys
  const handleToggle = async (key) => {
    const updatedVisibility = {
      ...visibilityData,
      [key]: !visibilityData[key], // Toggle the checkbox state
    };

    setVisibilityData(updatedVisibility); // Update local state

    // Send the updated visibility data to the server
    try {
      await Axios.put("/dmn", { lead: updatedVisibility });
      console.log("Visibility settings updated successfully.");
    } catch (error) {
      console.error("Error updating visibility settings:", error);
      // Optionally, revert the state if the update fails
      setVisibilityData(visibilityData);
    }
  };

  const headerItems = [
    { accessor: "showTypeOfBuyer", header: "Type of Buyer" },
    { accessor: "showInvestmentType", header: "Investment Type" },
    { accessor: "showPostHandover", header: "Post Handover" },
    { accessor: "showLeadPriority", header: "Lead Priority" } // Add new entry here
  ];
  

  return (
    <div>
      <Breadcrumb PageName="Settings" />
      <Box sx={{ flexGrow: 1, display: "flex", height: "" }}>
        <Tabs
          className="setting-tabs"
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{ "& .MuiTabs-indicator": { display: "none" } }}
        >
          <Tab label="Leads" {...a11yProps(0)} />
          <Tab label="Human Resource" {...a11yProps(1)} />
          <Tab label="Broker" {...a11yProps(2)} />
        </Tabs>
        <TabPanel
          value={value}
          index={0}
          className="setting-tabpanel custom-card"
        >
          <SettingHandler
            apiEndpoint="/lead"
            title="Leads Setting"
            master={"master"}
          />
          {role === "Master" || role === "Admin" ? (
            <>
              <h5>Dynamic Fields In Add Lead</h5>
              <div>
                {headerItems.map((headerItem) => (
                  <div key={headerItem.accessor}>
                    <label className="toggle-container">
                      <input
                        type="checkbox"
                        checked={visibilityData[headerItem.accessor]} // Check if the current item is visible
                        onChange={() => handleToggle(headerItem.accessor)} // Toggle the visibility state
                        className="toggle-checkbox"
                      />
                      <span className="toggle-slider" />
                      {headerItem.header}
                    </label>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </TabPanel>
        <TabPanel
          value={value}
          index={1}
          className="setting-tabpanel custom-card"
        >
          <SettingHandler apiEndpoint="/hr" title="Human Resource Setting" />
        </TabPanel>
        <TabPanel
          value={value}
          index={2}
          className="setting-tabpanel custom-card"
        >
          <SettingHandler apiEndpoint="/br" title="Broker Setting" />
        </TabPanel>
        <TabPanel
          value={value}
          index={3}
          className="setting-tabpanel custom-card"
        >
          <SettingHandler apiEndpoint="/ps" title="Payslips Setting" />
        </TabPanel>
      </Box>
    </div>
  );
};

export default Settings;
