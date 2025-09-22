import React from "react";
import dayjs from "dayjs";
import { SettingContext } from "./Context";
import Cookies from "js-cookie";

const MyGlobalData = ({ children }) => {
  let globalData = {
    URL: window.location.hostname,
    API_URL: "http://localhost:3003",
    variable: {
      DateTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    },
    CompanyName: window.location.hostname,
    Version: "0.5",
    currScreen: "",
    login: {
      path: React.lazy(() => import("../pages/Auth/Login/Login")),
    },
    forgetpassword: {
      path: React.lazy(() =>
        import("../pages/Auth/ForgotPassword/ForgotPassword")
      ),
    },
    module_privilege: "",
    user_data: "",
    data_array: [],
    pages: {
      components: {
        leftsidebar: React.lazy(() =>
          import("../components/Leftsidebar/Leftsidebar")
        ),
      },
      dashboard:
        Cookies.get("role") === "HR Head" || Cookies.get("role") === "HR"
          ? React.lazy(() => import("../pages/Dashboard/HRDashboard"))
          : React.lazy(() => import("../pages/Dashboard/Dashboard")),
      hrdashboard: React.lazy(() => import("../pages/Dashboard/HRDashboard")),
      forgotpassword: React.lazy(() =>
        import("../pages/Auth/ForgotPassword/ForgotPassword")
      ),
      changepassword: React.lazy(() =>
        import("../pages/Auth/ChangePassword/ChangePassword")
      ),
      leads: {
        totalleads: React.lazy(() => import("../pages/Leads/TotalLead")),
        addlead: React.lazy(() => import("../pages/Leads/AddLead")),
        viewleaddetails: React.lazy(() =>
          import("../pages/Leads/ViewLeadDetails")
        ),
        quickeditlead: React.lazy(() => import("../pages/Leads/QuickEditLead")),
        editlead: React.lazy(() => import("../pages/Leads/EditLead")),
        allstatus: React.lazy(() => import("../pages/Leads/AllStatus")),
        freshlead: React.lazy(() => import("../pages/Leads/FreshLead")),
        importleads: React.lazy(() => import("../pages/Leads/ImportLead")),
        unknownlead: React.lazy(() => import("../pages/Leads/UnknownLead")),
        nonassignlead: React.lazy(() => import("../pages/Leads/NonAssignLead")),
        assignlead: React.lazy(() => import("../pages/Leads/AssignLead")),
        presentlead: React.lazy(() => import("../pages/Leads/PresentLead")),
        leadbystatus: React.lazy(() => import("../pages/Leads/LeadByStatus")),
        leadbysource: React.lazy(() => import("../pages/Leads/LeadBySource")),
        userlead: React.lazy(() => import("../pages/Leads/UserLead")),
        missedlead: React.lazy(() => import("../pages/Leads/MissedLead")),
        upcominglead: React.lazy(() => import("../pages/Leads/UpcomingLead")),
        assignleadfrom: React.lazy(() =>
          import("../pages/Leads/AssignLeadFrom")
        ),
        leadscheduling: React.lazy(() =>
          import("../pages/Leads/LeadScheduling")
        ),
        addleadscheduling: React.lazy(() =>
          import("../pages/Leads/AddLeadScheduling")
        ),
        viewleadscheduling: React.lazy(() =>
          import("../pages/Leads/ViewLeadScheduling")
        ),
        leadassignreport: React.lazy(() =>
          import("../pages/Leads/LeadAssignReport")
        ),
      },
      user: {
        adduser: React.lazy(() => import("../pages/Users/AddUsers")),
        allusers: React.lazy(() => import("../pages/Users/AllUsers")),
        useranalyst: React.lazy(() => import("../pages/Users/UsersAnalyst")),
      },
      report: {
        callingreport: React.lazy(() =>
          import("../pages/Report/CallingReport")
        ),
        leadreport: React.lazy(() => import("../pages/Report/LeadReport")),
        userstatistics: React.lazy(() =>
          import("../pages/Report/UserStatistics")
        ),
      },
      dynamicfields: {
        source: React.lazy(() => import("../pages/DynamicFields/Source")),
        paymentplan: React.lazy(() =>
          import("../pages/DynamicFields/PaymentPlan")
        ),
        projectname: React.lazy(() =>
          import("../pages/DynamicFields/ProjectName")
        ),
        configuration: React.lazy(() =>
          import("../pages/DynamicFields/Configuration")
        ),
        locality: React.lazy(() => import("../pages/DynamicFields/Locality")),
        Handoveryear: React.lazy(() =>
          import("../pages/DynamicFields/Handoveryear")
        ),
        leadpriority: React.lazy(() =>
          import("../pages/DynamicFields/LeadPriority")
        ),
        leadstatus: React.lazy(() =>
          import("../pages/DynamicFields/LeadStatus")
        ),
        loanstatus: React.lazy(() =>
          import("../pages/DynamicFields/LoanStatus")
        ),
        loansalesmanager: React.lazy(() =>
          import("../pages/DynamicFields/LoanSalesManager")
        ),
        candidatessource: React.lazy(() =>
          import("../pages/DynamicFields/CandidatesSource")
        ),
        candidatestatus: React.lazy(() =>
          import("../pages/DynamicFields/CandidateStatus")
        ),
        candidatepost: React.lazy(() =>
          import("../pages/DynamicFields/CandidatePost")
        ),
        attendancepolicy: React.lazy(() =>
          import("../pages/DynamicFields/AttendancePolicy")
        ),
        bankname: React.lazy(() => import("../pages/DynamicFields/BankName")),
      },
      humanresource: {
        addcandidate: React.lazy(() =>
          import("../pages/HumanResource/AddCandidate")
        ),
        allcandidate: React.lazy(() =>
          import("../pages/HumanResource/AllCandidate")
        ),
        quickeditcandidate: React.lazy(() =>
          import("../pages/HumanResource/QuickEditCandidate")
        ),
        editcandidate: React.lazy(() =>
          import("../pages/HumanResource/EditCandidate")
        ),
        assigncandidatefrom: React.lazy(() =>
          import("../pages/HumanResource/AssignCandidateFrom")
        ),
        assigncandidate: React.lazy(() =>
          import("../pages/HumanResource/AssignCandidate")
        ),
        nonassigncandidate: React.lazy(() =>
          import("../pages/HumanResource/NonAssignCandidate")
        ),
        viewcandidate: React.lazy(() =>
          import("../pages/HumanResource/ViewCandidate")
        ),
        candidatebystatus: React.lazy(() =>
          import("../pages/HumanResource/CandidateByStatus")
        ),
        allcandidatestatus: React.lazy(() =>
          import("../pages/HumanResource/AllCandidateStatus")
        ),
      },
      invoice: {
        invoicedetails: React.lazy(() => import("../pages/Invoice/Invoice")),
        addinvoice: React.lazy(() => import("../pages/Invoice/AddInvoice")),
        editinvoice: React.lazy(() => import("../pages/Invoice/EditInvoice")),
        viewinvoice: React.lazy(() => import("../pages/Invoice/viewInvoice")),
      },
      payslip: {
        payslip: React.lazy(() => import("../pages/PaySlip/PaySlip")),
        addpayslip: React.lazy(() => import("../pages/PaySlip/AddPayslip")),
        viewpayslip: React.lazy(() => import("../pages/PaySlip/PayslipDetail")),
        updatepayslip: React.lazy(() =>
          import("../pages/PaySlip/UpdatePayslip.js")
        ),
      },
      loan: {
        addloan: React.lazy(() => import("../pages/Loan/AddLoan")),
        loandetails: React.lazy(() => import("../pages/Loan/LoanDetails")),
        editloan: React.lazy(() => import("../pages/Loan/EditLoan")),
        viewloan: React.lazy(() => import("../pages/Loan/ViewLoan")),
      },
      broker: {
        addbroker: React.lazy(() => import("../pages/Broker/AddBroker")),
        brokerdetails: React.lazy(() =>
          import("../pages/Broker/BrokerDetails")
        ),
        viewbrokerlead: React.lazy(() =>
          import("../pages/Broker/ViewBrokerLead.js")
        ),
        editbroker: React.lazy(() => import("../pages/Broker/EditBroker")),
        viewbroker: React.lazy(() => import("../pages/Broker/ViewBroker")),
        brokerallleads: React.lazy(() =>
          import("../pages/Broker/BrokerAllLead.js")
        ),
      },
      attendance: {
        userattendance: React.lazy(() =>
          import("../pages/Attendance/UserAttendance")
        ),
      },
      settings: {
        settings: React.lazy(() => import("../pages/Settings/Settings")),
      },
      other: {
        loader: React.lazy(() => import("../pages/Other/Loader")),
        profile: React.lazy(() => import("../pages/Other/Profile/Profile")),
        marketingcollateral: React.lazy(() =>
          import("../pages/Other/MarketingCollateral/MarketingCollateral")
        ),
        apiintegration: React.lazy(() =>
          import("../pages/Other/ApiIntegration/ApiIntegration")
        ),
        integrationdetails: React.lazy(() =>
          import("../pages/Other/ApiIntegration/Integrationdetails")
        ),
      },
      // broker: {
      //   allbroker: React.lazy(() => import("../pages/Broker/AllBroker")),
      // },
    },
  };

  return (
    <SettingContext.Provider value={{ globalData }}>
      {children}
    </SettingContext.Provider>
  );
};

export default MyGlobalData;
