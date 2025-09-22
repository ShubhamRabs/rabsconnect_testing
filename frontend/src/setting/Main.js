// Author: Shubham Sonkar

// Import necessary dependencies and styles
import React, { useState, useReducer, Suspense } from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { useSetting } from "../hooks/Hooks";
import Skeleton from "@mui/material/Skeleton";
import CryptoJS from "crypto-js";
import { IdleTimerProvider } from "react-idle-timer";
import { useQuery } from "react-query";
import { CheckUserLogin, logout } from "../hooks/Auth/Authentication";
import { CustomModal } from "../components/CustomModal/CustomModal";
import IdleImg from "./../assets/Image/idle.png";
import { Button } from "@mui/material";
import Cookies from "js-cookie";
import { onMessageListener, messaging } from "./firebase";
import { getToken } from "firebase/messaging";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CustomDescription, CustomHeading } from "../components/Common/Common";
import { setDispatchDashboard } from "../hooks/Function";

// Define the Main component
const Main = () => {
  // Retrieve globalData from useSetting hook
  const { globalData } = useSetting();

  const [idleModal, setIdleModal] = useState(false);
  const [leadModal, setLeadModal] = useState(false);

  // Set initial state for myglobalData
  const [myglobalData, setMyglobalData] = React.useState(globalData);
  // Styled component for DrawerHeader
  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    ...theme.mixins.toolbar,
  }));

  // ======================================================================================================
  // Notification
  const [token, setToken] = React.useState("");
  const [notification, setNotification] = React.useState({
    title: "",
    body: "",
  });

  const requestForToken = async () => {
    try {
      const currentToken = await getToken(messaging, {
        vapidKey: process.env.REACT_APP_VAPID_KEY,
      });
      if (currentToken) {
        console.log("current token for client: ", currentToken);
        setToken(currentToken);
      } else {
        // Show permission request UI
        console.log(
          "No registration token available. Request permission to generate one."
        );
      }
      // const res = undefined;
      // console.log(res);
    } catch (err) {
      setToken("notificationblocked");
    }
  };

  React.useEffect(() => {
    if (!notification?.title) {
      requestForToken();
    } else {
      console.log("Background Message");
    }
  }, []);

  onMessageListener()
    .then((payload) => {
      toast.success(
        <div>
          <CustomHeading
            Heading={payload.notification.title}
            style={{ fontSize: "14px" }}
          />
          <CustomDescription Description={payload.notification.body} />
        </div>,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          icon: false,
        }
      );
      // const { data: { icon } } = payload;
      setNotification({
        title: payload?.notification?.title,
        body: payload?.notification?.body,
      });
      // new Notification(title, { body, icon: CRMLogo });
    })
    .catch((err) => console.log("failed: ", err));
  // ======================================================================================================

  // State for app startup and loading
  const [appInitialised, setAppInitialised] = useState(false);
  const [loading, setLoading] = React.useState(true);

  // Function to load default screen on app startup
  function loadDefault() {
    console.log("load default");
    if (appInitialised === false) {
      // check last active screen from local storage
      if (localStorage.getItem("currScreen") !== null) {
        // Set default screen to Login if not found
        if (
          localStorage.getItem("currScreen").length === 0 ||
          localStorage.getItem("currScreen") === ""
        ) {
          localStorage.setItem("currScreen", "Login");
        }
        let currScreen = localStorage.getItem("currScreen");
        dispatch({ event: currScreen });
      } else {
        // Set default screen to Login if no previous screen found
        dispatch({ event: "Login" });
      }
    }
  }

  // Function to encrypt and set data in local storage
  function setLocalData(key, value) {
    let CryptoJSKey = globalData.CompanyName + "@" + globalData.Version;
    var user_data = CryptoJS.AES.encrypt(value, CryptoJSKey).toString();
    localStorage.setItem(key, user_data);
  }

  // const LoginCheck = useQuery("logincheck", () => {
  //   return CheckUserLogin();
  // });

  // Mapping of event names to corresponding components
  const componentConfig = {
    // Map event names to their corresponding components
    Login: myglobalData.login.path,
    changepassword: myglobalData.pages.changepassword,
    forgotpassword: myglobalData.pages.forgotpassword,

    dashboard: myglobalData.pages.dashboard,
    hrdashboard: myglobalData.pages.hrdashboard,

    projectname: myglobalData.pages.dynamicfields.projectname,
    paymentplan: myglobalData.pages.dynamicfields.paymentplan,
    source: myglobalData.pages.dynamicfields.source,
    configuration: myglobalData.pages.dynamicfields.configuration,
    locality: myglobalData.pages.dynamicfields.locality,
    Handoveryear: myglobalData.pages.dynamicfields.Handoveryear,
    leadpriority: myglobalData.pages.dynamicfields.leadpriority,
    leadstatus: myglobalData.pages.dynamicfields.leadstatus,
    loanstatus: myglobalData.pages.dynamicfields.loanstatus,
    loansalesmanager: myglobalData.pages.dynamicfields.loansalesmanager,
    candidatessource: myglobalData.pages.dynamicfields.candidatessource,
    candidatestatus: myglobalData.pages.dynamicfields.candidatestatus,
    candidatepost: myglobalData.pages.dynamicfields.candidatepost,
    attendancepolicy: myglobalData.pages.dynamicfields.attendancepolicy,
    bankname: myglobalData.pages.dynamicfields.bankname,
    
    allusers: myglobalData.pages.user.allusers,
    useranalyst: myglobalData.pages.user.useranalyst,
    adduser: myglobalData.pages.user.adduser,

    addlead: myglobalData.pages.leads.addlead,
    editlead: myglobalData.pages.leads.editlead,
    totalleads: myglobalData.pages.leads.totalleads,
    quickeditlead: myglobalData.pages.leads.quickeditlead,
    nonassignlead: myglobalData.pages.leads.nonassignlead,
    assignleadfrom: myglobalData.pages.leads.assignleadfrom,
    assignlead: myglobalData.pages.leads.assignlead,
    missedlead: myglobalData.pages.leads.missedlead,
    leadbystatus: myglobalData.pages.leads.leadbystatus,
    leadbysource: myglobalData.pages.leads.leadbysource,
    presentlead: myglobalData.pages.leads.presentlead,
    upcominglead: myglobalData.pages.leads.upcominglead,
    allstatus: myglobalData.pages.leads.allstatus,
    freshlead : myglobalData.pages.leads.freshlead,
    importleads : myglobalData.pages.leads.importleads,
    unknownlead : myglobalData.pages.leads.unknownlead,
    viewleaddetails: myglobalData.pages.leads.viewleaddetails,
    userlead: myglobalData.pages.leads.userlead,
    leadscheduling: myglobalData.pages.leads.leadscheduling,
    addleadscheduling: myglobalData.pages.leads.addleadscheduling,
    viewleadscheduling: myglobalData.pages.leads.viewleadscheduling,
    leadassignreport: myglobalData.pages.leads.leadassignreport,

    addloan: myglobalData.pages.loan.addloan,
    editloan: myglobalData.pages.loan.editloan,
    viewloan: myglobalData.pages.loan.viewloan,
    loandetails: myglobalData.pages.loan.loandetails,

    invoicedetails: myglobalData.pages.invoice.invoicedetails,
    addinvoice: myglobalData.pages.invoice.addinvoice,
    editinvoice: myglobalData.pages.invoice.editinvoice,
    viewinvoice: myglobalData.pages.invoice.viewinvoice,



    payslip: myglobalData.pages.payslip.payslip,
    addpayslip:myglobalData.pages.payslip.addpayslip,
    viewpayslip:myglobalData.pages.payslip.viewpayslip,
    updatepayslip:myglobalData.pages.payslip.updatepayslip,

    addbroker: myglobalData.pages.broker.addbroker,
    editbroker: myglobalData.pages.broker.editbroker,
    viewbroker: myglobalData.pages.broker.viewbroker,
    brokerdetails: myglobalData.pages.broker.brokerdetails,
    viewbrokerlead: myglobalData.pages.broker.viewbrokerlead,
    brokerallleads : myglobalData.pages.broker.brokerallleads,

    addcandidate: myglobalData.pages.humanresource.addcandidate,
    allcandidate: myglobalData.pages.humanresource.allcandidate,
    quickeditcandidate: myglobalData.pages.humanresource.quickeditcandidate,
    editcandidate: myglobalData.pages.humanresource.editcandidate,
    assigncandidatefrom: myglobalData.pages.humanresource.assigncandidatefrom,
    viewcandidate: myglobalData.pages.humanresource.viewcandidate,
    assigncandidate: myglobalData.pages.humanresource.assigncandidate,
    nonassigncandidate: myglobalData.pages.humanresource.nonassigncandidate,
    allcandidatestatus: myglobalData.pages.humanresource.allcandidatestatus,
    candidatebystatus: myglobalData.pages.humanresource.candidatebystatus,

    callingreport: myglobalData.pages.report.callingreport,
    leadreport: myglobalData.pages.report.leadreport,
    userstatistics: myglobalData.pages.report.userstatistics,

    userattendance: myglobalData.pages.attendance.userattendance,

    profile: myglobalData.pages.other.profile,
    settings: myglobalData.pages.settings.settings,
    crmsetting: myglobalData.pages.other.crmsetting,
    marketingcollateral: myglobalData.pages.other.marketingcollateral,
    apiintegration: myglobalData.pages.other.apiintegration,
    integrationdetails: myglobalData.pages.other.integrationdetails,
    loader: myglobalData.pages.other.loader,
  };

  // Reducer for navigation state
  function navReducer(state, action) {
    const tempData = { ...myglobalData };
    // Handle special events and update global data accordingly
    if (action.event === "sotre_search_data") {
      setLocalData("sotre_search_data", action.data);
    } else if (action.event === "updateglobal_userdata") {
      setLocalData("updateglobal_userdata", action.data);
      tempData.user_data = action.data;
      setMyglobalData(tempData);
    } else if (action.event === "store_new_data") {
      setLocalData("store_new_data", action.data);
    } else if (action.event === "setlocaldata") {
      setLocalData(action.key, action.value);
    } else {
      // Handle regular navigation events
      const component = componentConfig[action.event];
      if (component) {
        // Update current and previous screen in local storage
        localStorage.setItem(
          "previousScreen",
          localStorage.getItem("currScreen")
        );
        setTimeout(() => {
          localStorage.setItem("currScreen", action.event);
          tempData.currScreen = component;
          setMyglobalData(tempData);
        }, 1);
      } else {
        console.log("No action");
      }
    }
  }
  // UseReducer hook for navigation
  const [state, dispatch] = useReducer(navReducer);

  React.useEffect(() => {
    setDispatchDashboard(dispatch);
    // Perform initialization on app startup
    if (appInitialised === false) {
      setAppInitialised(true);
      // if (!LoginCheck.isLoading) {
      //   if (LoginCheck.data?.data == "Session found") {
      loadDefault();
      // } else {
      //   dispatch({ event: "Login" });
      // }
      // }
    }
    // Set loading to false after a short delay
    setTimeout(() => {
      setLoading(false);
    }, 10);
  }, []);

  const logout_User = () => {
    logout(Cookies.get("token"))
      .then((response) => {
        if (response.data === "Logout Done") {
          dispatch({ event: "Login" });
          setIdleModal(false);
          setTimeout(() => {
            Cookies.remove("user", { path: "/", domain: globalData.URL });
            Cookies.remove("type", { path: "/", domain: globalData.URL });
            Cookies.remove("role", { path: "/", domain: globalData.URL });
            Cookies.remove("username", { path: "/", domain: globalData.URL });
            Cookies.remove("module_privilege", {
              path: "/",
              domain: globalData.URL,
            });
          }, 10);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return !loading ? (
    <>
      {appInitialised && (
        <Suspense
          callback={console.log("Loading...")}
          fallback={
              localStorage.getItem("currScreen") === "Login" ? null : localStorage.getItem("currScreen") ===
              "forgotpassword" ? null : (
              <Box sx={{ display: "flex" }}>
                <myglobalData.pages.components.leftsidebar
                  dispatch={dispatch}
                  myglobalData={myglobalData}
                />
                <DrawerHeader />
                <Box component="main" sx={{ flexGrow: 1, px: 3, py: 10 }}>
                  <Skeleton variant="rectangular" width="100%" height={30} />
                  <Skeleton
                    variant="rounded"
                    width="100%"
                    height={300}
                    sx={{ mt: 3 }}
                  />
                  <Skeleton
                    variant="rounded"
                    width="100%"
                    height={300}
                    sx={{ mt: 3 }}
                  />
                </Box>
              </Box>
            )
          }
        >
          {/* <button onClick={notify}>Notify!</button> */}
          <ToastContainer />
          <CustomModal
            show={idleModal}
            hideCloseIcon={true}
            ModalBody={
              <Box className="text-center p-3">
                <img src={IdleImg} alt="Idle Image" className="w-75 mb-3" />
                <h5 className="text-danger mb-2" style={{ fontSize: "22px" }}>
                  You have been idle for too long time!
                </h5>
                <p
                  className="text-muted w-75 m-auto"
                  style={{ fontSize: "13px" }}
                >
                  would you like to stay logged in? Please respond with a Leave
                  or continue to use the application.
                </p>
                <div className="mt-3">
                  <Button onClick={logout_User} className="idle-leave-btn">
                    Leave
                  </Button>
                  <Button
                    onClick={() => setIdleModal(false)}
                    className="idle-continue-btn"
                  >
                    continue
                  </Button>
                </div>
              </Box>
            }
          />
          <CustomModal
            show={leadModal}
            ModalSize="lg"
            onHide={() => setLeadModal(false)}
            showHeader={true}
            ModalTitle="Update Lead Status"
            ModalBody={<h1>hello world</h1>}
            // ModalBody={<LeadDeatils data={leadData} />}
          />
          {localStorage.getItem("currScreen") === "Login" ? (
            <myglobalData.currScreen
              dispatch={dispatch}
              myglobalData={myglobalData}
              token={token}
            />
          ) : localStorage.getItem("currScreen") === "forgotpassword" ? (
              <myglobalData.currScreen
                dispatch={dispatch}
                myglobalData={myglobalData}
                token={token}
              />
          ) : localStorage.getItem("currScreen") === "loader" ? (
            <myglobalData.currScreen
              dispatch={dispatch}
              myglobalData={myglobalData}
            />
          ) : (
            <IdleTimerProvider
              // timeout={1000 * 15}
              timeout={1000 * 60 * 15}
              onIdle={() => setIdleModal(true)}
            >
              <Box style={{ display: "flex" }}>
                <myglobalData.pages.components.leftsidebar
                  dispatch={dispatch}
                  myglobalData={myglobalData}
                />
                <DrawerHeader />
                <Box
                  component="main"
                  sx={{ flexGrow: 1, px: 3, py: 10, overflowX: "hidden" }}
                >
                  <myglobalData.currScreen
                    dispatch={dispatch}
                    myglobalData={myglobalData}
                  />
                </Box>
              </Box>
            </IdleTimerProvider>
          )}
        </Suspense>
      )}
    </>
  ) : (
    <h1>Loading...</h1>
  );
};

export default Main;
