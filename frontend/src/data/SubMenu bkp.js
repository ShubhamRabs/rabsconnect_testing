import {
  getSubMenuLeadCount,
  getSubMenuCandidateCount,
  getSubMenuLoanCount,
  getSubMenuBrokerCount, 
} from "../hooks/Other/UseLeftSidebarHook"; 
import Cookies from "js-cookie";
import { useQuery } from "react-query";
// SubMenu component responsible for organizing sub-menu items
const SubMenu = () => {
  // Use queries to fetch sub-menu item counts
  const SubMenuLeadCount = useQuery("SubMenuLeadCount", getSubMenuLeadCount, {
    enabled: Cookies.get("role") === "Master" || Cookies.get("module_privilege").includes("Leads"),
  });

  const SubMenuCandidateCount = useQuery(
    "SubMenuCandidateCount",
    getSubMenuCandidateCount,
    {
      enabled: Cookies.get("role") === "Master" ||Cookies.get("module_privilege").includes("Human Resource"),
    }
  );

  const SubMenuLoanCount = useQuery("SubMenuLoanCount", getSubMenuLoanCount, {
    enabled: Cookies.get("role") === "Master" || Cookies.get("module_privilege").includes("Loan"),
  });

  const SubMenuBrokerCount = useQuery(
    "SubMenuBrokerCount",
    getSubMenuBrokerCount,
    {
      enabled: Cookies.get("role") === "Master" || Cookies.get("module_privilege").includes("Broker"),
    }
  );

  // Define sub-menu items for Leads based on user role and privileges
  let LeadSubMenu = [
    {
      SubMenuName: "Total Leads",
      dispatch: "totalleads",
      loading: SubMenuLeadCount.isLoading,
      count: !SubMenuLeadCount.isLoading
        ? SubMenuLeadCount.data?.data[0].totallead
        : 0,
    },
    {
      SubMenuName: "Leads By Status",
      dispatch: "allstatus",
      count: null,
    },
    {
      SubMenuName: "Present Lead",
      dispatch: "presentlead",
      loading: SubMenuLeadCount.isLoading,
      count: !SubMenuLeadCount.isLoading
        ? SubMenuLeadCount.data?.data[0].persentlead
        : 0,
    },
    {
      SubMenuName: "Missed Lead",
      dispatch: "missedlead",
      loading: SubMenuLeadCount.isLoading,
      count: !SubMenuLeadCount.isLoading
        ? SubMenuLeadCount.data?.data[0].missedlead
        : 0,
    },
  ];
  // Define sub-menu items for Users
  if ((Cookies.get("role") === "Master" || Cookies.get("module_privilege").includes("Leads Assign")) && !Cookies.get("role").includes("Tele Caller")) {
    LeadSubMenu.push(
      ...[
        {
          SubMenuName: "Non Assign Lead",
          dispatch: "nonassignlead",
          loading: SubMenuLeadCount.isLoading,
          count: !SubMenuLeadCount.isLoading
            ? SubMenuLeadCount.data?.data[0].nonassignlead
            : 0,
        },
        {
          SubMenuName: "Assign Lead",
          dispatch: "assignlead",
          loading: SubMenuLeadCount.isLoading,
          count: !SubMenuLeadCount.isLoading
            ? SubMenuLeadCount.data?.data[0].assign_lead
            : 0,
        },
      ]
    );
  }

  if ((Cookies.get("role") === "Master" || Cookies.get("module_privilege").includes("Leads Assign")) && !Cookies.get("role").includes("Tele Caller")) {
    LeadSubMenu.push(
      ...[{ SubMenuName: "User Lead", dispatch: "userlead", count: null }]
    );
  }

  if (Cookies.get("role") === "Master" || Cookies.get("module_privilege").includes("Leads Add")) {
    LeadSubMenu.push(
      ...[{ SubMenuName: "Add Lead", dispatch: "addlead", count: null }]
    );
  }

  LeadSubMenu.push(
    ...[{ SubMenuName: "Lead Report", dispatch: "leadreport", count: null }]
  );

  const UserSubMenu = [
    { SubMenuName: "All Users", dispatch: "allusers", count: null },
  ];
  if (Cookies.get("role") === "Master" || Cookies.get("role") === "Admin") {
    UserSubMenu.push(
      ...[{ SubMenuName: "Add User", dispatch: "adduser", count: null }]
    );
  }

  // Define sub-menu items for Human Resources based on user role
  let HumanResourcesSubMenu = [
    { SubMenuName: "Add Candidate", dispatch: "addcandidate", count: null },
    {
      SubMenuName: "Candidate By Status",
      dispatch: "allcandidatestatus",
      count: null,
    },
    {
      SubMenuName: "All Candidate",
      dispatch: "allcandidate",
      count: !SubMenuCandidateCount.isLoading
        ? SubMenuCandidateCount.data?.data[0].totalcandidate
        : 0,
    },
  ];

  if (Cookies.get("role").includes("HR Head")) {
    HumanResourcesSubMenu.push(
      ...[
        {
          SubMenuName: "Assign Candidate",
          dispatch: "assigncandidate",
          count: !SubMenuCandidateCount.isLoading
            ? SubMenuCandidateCount.data?.data[0].assigncandidate
            : 0,
        },
        {
          SubMenuName: "Non Assign Candidate",
          dispatch: "nonassigncandidate",
          count: !SubMenuCandidateCount.isLoading
            ? SubMenuCandidateCount.data?.data[0].nonassigncandidate
            : 0,
        },
      ]
    );
  }
  // Define sub-menu items for Dynamic Fields based on module privileges
  let DynamicFieldsLeadSubMenu = [
    {
      SubMenuName: "Project Name",
      dispatch: "projectname",
      count: null,
    },
    { SubMenuName: "Source", dispatch: "source", count: null },
    {
      SubMenuName: "Configuration",
      dispatch: "configuration",
      count: null,
    },
    {
      SubMenuName: "Lead Status",
      dispatch: "leadstatus",
      count: null,
    },
  ];

  let DynamicFieldsCandidateSubMenu = [
    {
      SubMenuName: "Candidates Source",
      dispatch: "candidatessource",
      count: null,
    },
    {
      SubMenuName: "Candidates Status",
      dispatch: "candidatestatus",
      count: null,
    },
    {
      SubMenuName: "Candidates Post",
      dispatch: "candidatepost",
      count: null,
    },
  ];

  let DynamicFieldsLoanSubMenu = [
    {
      SubMenuName: "Loan status",
      dispatch: "loanstatus",
      count: null,
    },
    {
      SubMenuName: "Loan Sales Manager",
      dispatch: "loansalesmanager",
      count: null,
    },
  ];

  let DynamicFieldsSubMenu = [];

  if (Cookies.get("module_privilege").includes("Human Resource")) {
    if (Cookies.get("role") === "HR Head" || Cookies.get("role") === "HR") {
      DynamicFieldsSubMenu.push(...DynamicFieldsCandidateSubMenu);
    } else if (
      Cookies.get("role") === "Master" ||
      Cookies.get("role") === "Admin"
    ) {
      DynamicFieldsSubMenu.push(
        ...DynamicFieldsLeadSubMenu,
        ...DynamicFieldsCandidateSubMenu
      );
    } else {
      DynamicFieldsSubMenu.push(...DynamicFieldsLeadSubMenu);
    }
  } else {
    DynamicFieldsSubMenu.push(...DynamicFieldsLeadSubMenu);
  }

  if (Cookies.get("module_privilege").includes("Loan")) {
    DynamicFieldsSubMenu.push(...DynamicFieldsLoanSubMenu);
  }

  let DashboardSubMenu = [
    {
      SubMenuName: "Dashboard",
      dispatch: "dashboard",
      count: null,
    },
    {
      SubMenuName: "HR Dashboard",
      dispatch: "hrdashboard",
      count: null,
    },
  ];

  let LoanSubMenu = [
    { SubMenuName: "Add Loan", dispatch: "addloan", count: null },
    {
      SubMenuName: "Loan Details",
      dispatch: "loandetails",
      loading: SubMenuLoanCount.isLoading,
      count: !SubMenuLoanCount.isLoading
        ? SubMenuLoanCount.data?.data[0].totalloan
        : 0,
    },
  ];

  let BrokerSubMenu = [
    { SubMenuName: "Add Broker", dispatch: "addbroker", count: null },
    {
      SubMenuName: "Broker Details",
      dispatch: "brokerdetails",
      loading: SubMenuBrokerCount.isLoading,
      count: !SubMenuBrokerCount.isLoading
        ? SubMenuBrokerCount.data?.data[0].totalbroker
        : 0,
    },
  ];

  return {
    LoanSubMenu,
    BrokerSubMenu,
    DashboardSubMenu,
    DynamicFieldsLoanSubMenu,
    LeadSubMenu,
    UserSubMenu,
    DynamicFieldsSubMenu,
    HumanResourcesSubMenu,
  };
};

export default SubMenu;
