import {
  getSubMenuLeadCount,
  getSubMenuCandidateCount,
  getSubMenuLoanCount,
  getSubMenuBrokerCount,
} from "../hooks/Other/UseLeftSidebarHook";
import Cookies from "js-cookie";
import { useQuery } from "react-query";
import { getNewUndefinedCount } from "../hooks/Leads/UseAssignLeadHook";
import { GetBrokerLeadCount } from "../hooks/Leads/useBrokerLeadHook";
import { TotalImportLeadTableDataCount } from "../hooks/Leads/UseImportLeadHook";

// SubMenu component responsible for organizing sub-menu items
const SubMenu = () => {
  // Use queries to fetch sub-menu item counts
  const SubMenuLeadCount = useQuery("SubMenuLeadCount", getSubMenuLeadCount, {
    enabled:
      Cookies.get("role") === "Master" ||
      Cookies.get("module_privilege").includes("Leads View"),
  });

  // console.log(SubMenuLeadCount.data, "SubMenuLeadCount.data");

  const SubMenuFreshLeadCount = useQuery(
    "SubMenuFreshLeadCount",
    getNewUndefinedCount,
    {
      enabled:
        Cookies.get("role") === "Master" ||
        Cookies.get("module_privilege").includes("Leads View"),
    }
  );

  const SubMenuLoanCount = useQuery("SubMenuLoanCount", getSubMenuLoanCount, {
    enabled:
      Cookies.get("role") === "Master" ||
      Cookies.get("module_privilege").includes("Loan View"),
  });

  const SubMenuCandidateCount = useQuery(
    "SubMenuCandidateCount",
    getSubMenuCandidateCount,
    {
      enabled:
        Cookies.get("role") === "Master" ||
        Cookies.get("module_privilege").includes("Human Resource View"),
    }
  );

  const SubMenuBrokerCount = useQuery(
    "SubMenuBrokerCount",
    getSubMenuBrokerCount,
    {
      enabled:
        Cookies.get("role") === "Master" ||
        Cookies.get("module_privilege").includes("Broker View"),
    }
  );

  const SubMenuBrokerLeadCount = useQuery(
    "SubMenuBrokerLeadCount",
    GetBrokerLeadCount,
    {
      enabled:
        Cookies.get("role") === "Master" ||
        Cookies.get("module_privilege").includes("Broker Leads"),
    }
  );

  // Define sub-menu items for Leads based on user role and privileges
  let LeadSubMenu = [];

  if (
    Cookies.get("role") === "Master" ||
    Cookies.get("module_privilege").includes("Leads View")
  ) {
    LeadSubMenu.push(
      ...[
        {
          SubMenuName: "All Leads",
          dispatch: "totalleads",
          loading: SubMenuLeadCount.isLoading,
          count: !SubMenuLeadCount.isLoading
            ? SubMenuLeadCount.data?.data[0].totallead
            : 0,
        },
        {
          SubMenuName: "Fresh Leads",
          dispatch: "freshlead",
          loading: SubMenuLeadCount.isLoading,
          count: !SubMenuLeadCount.isLoading
            ? SubMenuLeadCount.data?.data[0].freshlead
            : 0,
        },
        {
          SubMenuName: "Import Leads",
          dispatch: "importleads",
          loading: SubMenuLeadCount.isLoading,
          count: !SubMenuLeadCount.isLoading
            ? SubMenuLeadCount.data?.data[0].importlead
            : 0,
        },
        {
          SubMenuName: "Status",
          dispatch: "allstatus",
          count: null,
        },
        // {
        //   SubMenuName: "Unknown Leads",
        //   dispatch: "unknownlead",
        //   loading: SubMenuFreshLeadCount.isLoading,
        //   count: !SubMenuFreshLeadCount.isLoading
        //     ? SubMenuFreshLeadCount?.data?.undefinedcount
        //     : 0,
        // },
      ]
    );
  }

  if (
    (Cookies.get("role") === "Master" ||
      Cookies.get("module_privilege").includes("Leads Assign")) &&
    !Cookies.get("role").includes("Tele Caller")
  ) {
    LeadSubMenu.push(
      ...[
        {
          SubMenuName: "Assign Lead",
          dispatch: "assignlead",
          loading: SubMenuLeadCount.isLoading,
          count: !SubMenuLeadCount.isLoading
            ? SubMenuLeadCount.data?.data[0].assign_lead
            : 0,
        },
        {
          SubMenuName: "Non Assign Lead",
          dispatch: "nonassignlead",
          loading: SubMenuLeadCount.isLoading,
          count: !SubMenuLeadCount.isLoading
            ? SubMenuLeadCount.data?.data[0].nonassignlead
            : 0,
        },
        
        {
          SubMenuName: "Lead Scheduling",
          dispatch: "leadscheduling",
          loading: SubMenuLeadCount.isLoading,
          // count: !SubMenuLeadCount.isLoading
          //   ? SubMenuLeadCount.data?.data[0].assign_lead
          //   : 0,
          count: null,
        },
        {
          SubMenuName: "Lead Assign Report",
          dispatch: "leadassignreport",
          loading: SubMenuLeadCount.isLoading,
          // count: !SubMenuLeadCount.isLoading
          //   ? SubMenuLeadCount.data?.data[0].assign_lead
          //   : 0,
          count: null,
        },
      ]
    );
  }

  if (
    (Cookies.get("role") === "Master" ||
      Cookies.get("module_privilege").includes("Leads Assign")) &&
    !Cookies.get("role").includes("Tele Caller")
  ) {
    LeadSubMenu
      .push
      // ...[{ SubMenuName: "User Lead", dispatch: "userlead", count: null }]
      ();
  }

  if (
    Cookies.get("role") === "Master" ||
    Cookies.get("module_privilege").includes("Leads Add")
  ) {
    LeadSubMenu.push(
      ...[{ SubMenuName: "Add Lead", dispatch: "addlead", count: null }]
    );
  }

  if (
    Cookies.get("role") === "Master" ||
    Cookies.get("module_privilege").includes("Leads View")
  ) {
    LeadSubMenu.push(
      ...[{ SubMenuName: "Lead Report", dispatch: "leadreport", count: null }]
    );
  }

  let StatusSubMenu = [];

  if (
    Cookies.get("role") === "Master" ||
    Cookies.get("module_privilege").includes("Status View")
  ) {
    StatusSubMenu.push(
      ...[
        {
          SubMenuName: "Today's Followup",
          dispatch: "presentlead",
          loading: SubMenuLeadCount.isLoading,
          count: !SubMenuLeadCount.isLoading
            ? SubMenuLeadCount.data?.data[0].persentlead
            : 0,
        },
        {
          SubMenuName: "Missed Followup",
          dispatch: "missedlead",
          loading: SubMenuLeadCount.isLoading,
          count: !SubMenuLeadCount.isLoading
            ? SubMenuLeadCount.data?.data[0].missedlead
            : 0,
        },
        {
          SubMenuName: "Upcoming Followup",
          dispatch: "upcominglead",
          loading: SubMenuLeadCount.isLoading,
          count: !SubMenuLeadCount.isLoading
            ? SubMenuLeadCount.data?.data[0].upcominglead
            : 0,
        },
      ]
    );
  }

  // Define sub-menu items for Loan based on user role and privileges
  let LoanSubMenu = [];

  if (
    Cookies.get("role") === "Master" ||
    Cookies.get("module_privilege").includes("Loan Add")
  ) {
    LoanSubMenu.push(
      ...[{ SubMenuName: "Add Loan", dispatch: "addloan", count: null }]
    );
  }

  if (
    Cookies.get("role") === "Master" ||
    Cookies.get("module_privilege").includes("Loan View")
  ) {
    LoanSubMenu.push(
      ...[
        {
          SubMenuName: "Loan Details",
          dispatch: "loandetails",
          loading: SubMenuLoanCount.isLoading,
          count: !SubMenuLoanCount.isLoading
            ? SubMenuLoanCount.data?.data[0].totalloan
            : 0,
        },
      ]
    );
  }

  let AttendanceSubMenu = [
    { SubMenuName: "User Attendance", dispatch: "userattendance", count: null },
  ];

  // Define sub-menu items for All Broker based on user role and privileges
  let BrokerSubMenu = [];

  if (
    Cookies.get("role") === "Master" ||
    Cookies.get("module_privilege").includes("All Broker Add")
  ) {
    BrokerSubMenu.push(
      ...[{ SubMenuName: "Add Broker", dispatch: "addbroker", count: null }]
    );
  }

  if (
    Cookies.get("role") === "Master" ||
    Cookies.get("module_privilege").includes("All Broker View")
  ) {
    BrokerSubMenu.push(
      ...[
        {
          SubMenuName: "Broker Details",
          dispatch: "brokerdetails",
          loading: SubMenuBrokerCount.isLoading,
          count: !SubMenuBrokerCount.isLoading
            ? SubMenuBrokerCount.data?.data[0].totalbroker
            : 0,
        },
      ]
    );
  }

  if (
    Cookies.get("role") === "Master" ||
    Cookies.get("module_privilege").includes("All Broker View")
  ) {
    BrokerSubMenu.push(
      ...[
        {
          SubMenuName: "Broker's Lead",
          dispatch: "brokerallleads",
          loading: SubMenuBrokerLeadCount.isLoading,
          // count: null
          count: !SubMenuBrokerLeadCount.isLoading
            ? SubMenuBrokerLeadCount?.data?.data
            : 0,
        },
      ]
    );
  }

  // Define sub-menu items for Human Resources based on user role
  let HumanResourcesSubMenu = [];

  if (
    Cookies.get("role") === "Master" ||
    Cookies.get("module_privilege").includes("Human Resource Add")
  ) {
    HumanResourcesSubMenu.push(
      ...[
        { SubMenuName: "Add Candidate", dispatch: "addcandidate", count: null },
      ]
    );
  }

  if (
    Cookies.get("role") === "Master" ||
    Cookies.get("module_privilege").includes("Human Resource View")
  ) {
    HumanResourcesSubMenu.push(
      ...[
        {
          SubMenuName: "Candidate By Status",
          dispatch: "allcandidatestatus",
          count: null,
        },
        {
          SubMenuName: "All Candidate",
          dispatch: "allcandidate",
          count: !SubMenuCandidateCount.isLoading
            ? SubMenuCandidateCount.data?.data[0]?.totalcandidate
            : 0,
        },
      ]
    );
  }

  if (
    Cookies.get("role") === "Master" ||
    Cookies.get("module_privilege").includes("Human Resource Assign")
  ) {
    HumanResourcesSubMenu.push(
      ...[
        {
          SubMenuName: "Assign Candidate",
          dispatch: "assigncandidate",
          count: !SubMenuCandidateCount.isLoading
            ? SubMenuCandidateCount.data?.data[0]?.assigncandidate
            : 0,
        },
        {
          SubMenuName: "Non Assign Candidate",
          dispatch: "nonassigncandidate",
          count: !SubMenuCandidateCount.isLoading
            ? SubMenuCandidateCount.data?.data[0]?.nonassigncandidate
            : 0,
        },
      ]
    );
  }

  // Define sub-menu items for Invoice based on user role
  let InvoiceSubMenu = [
    {
      SubMenuName: "Invoice Details",
      dispatch: "invoicedetails",
      count: null,
    },
    { SubMenuName: "Add Invoice", dispatch: "addinvoice", count: null },
    // {
    //   SubMenuName: "Configuration",
    //   dispatch: "configuration",
    //   count: null,
    // },
    // {
    //   SubMenuName: "Lead Status",
    //   dispatch: "leadstatus",
    //   count: null,
    // },
  ];

  // Define sub-menu items for Users based on user role and privileges
  const UserSubMenu = [];

  if (
    Cookies.get("role") === "Master" ||
    Cookies.get("module_privilege").includes("Users View")
  ) {
    UserSubMenu.push(
      ...[{ SubMenuName: "All Users", dispatch: "allusers", count: null }]
    );
  }

  if (
    Cookies.get("role") === "Master" ||
    Cookies.get("module_privilege").includes("Users Add")
  ) {
    UserSubMenu.push(
      ...[{ SubMenuName: "Add User", dispatch: "adduser", count: null }]
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
    { SubMenuName: "Payment Plan", dispatch: "paymentplan", count: null },
    {
      SubMenuName: "Configuration",
      dispatch: "configuration",
      count: null,
    },
    {
      SubMenuName: "Location",
      dispatch: "locality",
      count: null,
    },
    {
      SubMenuName: "Handover Year",
      dispatch: "Handoveryear",
      count: null,
    },
    {
      SubMenuName: "Lead Priority",
      dispatch: "leadpriority",
      count: null,
    },
    {
      SubMenuName: "Lead Status",
      dispatch: "leadstatus",
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

  let DynamicFieldsInvoiceSubMenu = [
    {
      SubMenuName: "Bank Name",
      dispatch: "bankname",
      count: null,
    },
  ];

  let DynamicFieldsAttendanceSubMenu = [
    {
      SubMenuName: "Attendance Policy",
      dispatch: "attendancepolicy",
      count: null,
    },
  ];

  let DynamicFieldsSubMenu = [];

  if (
    Cookies.get("role") === "Master" ||
    Cookies.get("module_privilege").includes("Leads View")
  ) {
    DynamicFieldsSubMenu.push(...DynamicFieldsLeadSubMenu);
  }

  if (
    Cookies.get("role") === "Master" ||
    Cookies.get("module_privilege").includes("Loan View")
  ) {
    DynamicFieldsSubMenu.push(...DynamicFieldsLoanSubMenu);
  }

  if (
    Cookies.get("role") === "Master" ||
    Cookies.get("module_privilege").includes("Human Resource View")
  ) {
    DynamicFieldsSubMenu.push(...DynamicFieldsCandidateSubMenu);
  }

  if (
    Cookies.get("role") === "Master" ||
    Cookies.get("module_privilege").includes("Users View")
  ) {
    DynamicFieldsSubMenu.push(...DynamicFieldsAttendanceSubMenu);
  }

  if (
    Cookies.get("role") === "Master" ||
    Cookies.get("module_privilege").includes("Users View")
  ) {
    DynamicFieldsSubMenu.push(...DynamicFieldsInvoiceSubMenu);
  }

  return {
    LeadSubMenu,
    LoanSubMenu,
    BrokerSubMenu,
    AttendanceSubMenu,
    HumanResourcesSubMenu,
    InvoiceSubMenu,
    UserSubMenu,
    DynamicFieldsSubMenu,
    StatusSubMenu,
  };
};

export default SubMenu;
