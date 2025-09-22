import React from "react";
import CryptoJS from "crypto-js";

import HumanResourceHandler from "../../Handler/HumanResourceHandler";
import {
  GetTotalCandidatesByStatusTableData,
  TotalCandidatesByStatusTableDataCount,
  useSearchCandidatesByStatus,
} from "../../hooks/HumanResources/UseCandidateByStatusHook";
import { useSetting } from "../../hooks/Hooks";

const CandidateByStatus = ({ dispatch, myglobalData }) => {
  const breadcrumbValues = {
    pageName: "Candidate By Status", // Displayed page name in the breadcrumb
    addButton: true, // Display an 'Add' button in the breadcrumb
    assignButton: false, // Do not display an 'Assign' button in the breadcrumb
  };

  let CryptoJSKey = myglobalData.CompanyName + "@" + myglobalData.Version;
  const bytes = CryptoJS.AES.decrypt(
    localStorage.getItem("updateglobal_userdata"),
    CryptoJSKey
  );
  let user_data = bytes.toString(CryptoJS.enc.Utf8);
  user_data = JSON.parse(user_data);

  let status = user_data.status;
  let teamPage = user_data.teamPage;

  // Return the LeadHandler component with necessary props
  return (
    <HumanResourceHandler
      tableDataFunction={GetTotalCandidatesByStatusTableData} // Function to fetch candidate data
      tableDataCountFunction={TotalCandidatesByStatusTableDataCount([
        user_data,
      ])} // Function to fetch total count of candidates
      tableDataFunctionParams={user_data}
      dispatch={dispatch} // Function for dispatching actions
      myglobalData={myglobalData} // Global data used within the component
      breadcrumbValues={breadcrumbValues} // Breadcrumb configuration
      FetchCounting={true} // Flag indicating whether counting information should be fetched
      useSearchCandidate={useSearchCandidatesByStatus}
      isCandidateByStatus={true}
      isTeamPage={teamPage}
      CandidateByStatus={status}
    />
  );
};

export default CandidateByStatus;