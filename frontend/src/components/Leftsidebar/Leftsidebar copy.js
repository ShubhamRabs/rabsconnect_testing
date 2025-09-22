import React, { useState, useEffect, useRef, useCallback } from "react";
import { MobileView, isMobile } from "react-device-detect";
import Cookies from "js-cookie";
import { useMui } from "../../hooks/Hooks";
import { useBootstrap } from "../../hooks/Hooks";
import Logo from "../../assets/Image/logo.png";
import subMenu from "../../data/SubMenu";
import "./Leftsidebar.css";
import { logout } from "../../hooks/Auth/Authentication";
import { CustomModal } from "../CustomModal/CustomModal";
import Attendance from "../Attendance/Attendance";
import { getAttendanceStatus } from "../../hooks/Attendance/UseAttendanceHook";
import { UseBackToOldCrm } from "../../hooks/Users/UseUsersAnalystHook";
import { AttendanceTiming } from "../../hooks/Function";
import NotificationMenu from "../NotificationMenu/NotificationMenu";
import UserImg from "../../assets/Image/user.png";
import { CustomSubTitle } from "../Common/Common";
import { GetUserDetails } from "../../hooks/Other/UseProfileHook";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const Leftsidebar = ({ dispatch, myglobalData }) => {
  const {
    MuiDrawer,
    styled,
    MuiAppBar,
    Skeleton,
    Toolbar,
    CssBaseline,
    List,
    Divider,
    Typography,
    ListItemButton,
    Tooltip,
    ListItemText,
    Box,
    Avatar,
    ListItemIcon,
    IconButton,
    ListItem,
    MenuIcon,
    FingerprintIcon,
    ManageAccountsOutlinedIcon,
    AccountCircleOutlinedIcon,
    LogoutIcon,
    Chip,
    DashboardIcon,
    SwitchAccountIcon,
    ManageAccountsIcon,
    AccountTreeIcon,
    DisplaySettingsIcon,
    KeyboardArrowDownIcon,
    CheckBoxIcon,
    Collapse,
    ChevronLeftIcon,
    CreditScoreIcon,
    LoadingButton,
    SummarizeIcon,
    IntegrationInstructionsOutlinedIcon,
    ReceiptIcon,
  } = useMui();

  const {
    LeadSubMenu,
    UserSubMenu,
    StatusSubMenu,
    DynamicFieldsSubMenu,
    HumanResourcesSubMenu,
    LoanSubMenu,
    BrokerSubMenu,
    AttendanceSubMenu,
  } = subMenu();

  const { Dropdown, DropdownButton } = useBootstrap();

  // ============= left side bar handler ===================
  const drawerRef = useRef(null);
  const rendersNo = useRef(0);

  rendersNo.current = rendersNo.current + 1;

  const [topScroll, setTopScroll] = useState(
    Number(localStorage.getItem("sidebarScroll")) || 0
  );

  const handleDrawer = () => {
    if (drawerRef.current) {
      const firstChild = drawerRef.current?.firstElementChild;
      const newTopScroll = Number(firstChild.scrollTop);
      setTopScroll(newTopScroll);
      localStorage.setItem("sidebarScroll", newTopScroll);
    }
  };

  React.useEffect(() => {
    if (drawerRef.current) {
      const firstChild = drawerRef.current?.firstElementChild;
      firstChild.scrollTop = topScroll;
    }
  }, [topScroll, rendersNo.current]);

  // ============= left side bar handler ===================
  const drawerWidth = 290;

  const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
  });

  const closedMixin = (theme) => ({
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
  });

  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    ...theme.mixins.toolbar,
  }));

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
    }),
  }));

  const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    whiteSpace: "nowrap",
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme),
    }),
  }));

  const dispatchFun = (val) => {
    const page = val.toLowerCase().replace(/ /g, "");
    const currPage = localStorage.getItem("currScreen");
    dispatch({ event: page === currPage ? currPage : page });
  };

  const [imageExists, setImageExists] = React.useState(true); // To track if the image exists
  const [image, setImage] = React.useState(true);
  // Check if the image exists when the component mounts
  React.useEffect(() => {
    const checkImageExists = async () => {
      // try {
      //   const response = await fetch(image, {
      //     method: "HEAD",
      //   });
      //   setImageExists(response.ok);
      // } catch (error) {
      //   setImageExists(false);
      // }
      // const img = new Image();
      // img.onload = () => setImageExists(true); // Image loaded successfully
      // img.onerror = () => setImageExists(false); // Image failed to load
      // img.src = image;
      try {
        const response = await GetUserDetails();
        if (
          response.status.toString() === "200" &&
          Array.isArray(response.data) &&
          response.data.length > 0 &&
          response.data[0].profile_image.includes(".png")
        ) {
          setImageExists(response.data[0].profile_image.includes(".png"));
          setImage(
            `${myglobalData.API_URL}/uploads/profile/${Cookies.get("u_id")}/${
              response.data[0].profile_image
            }`
          );
          // return;
        } else {
          setImageExists(false);
        }
      } catch (error) {
        setImageExists(false);
      }
    };
    if (image === true) {
      checkImageExists();
    }
    // checkImageExists();
  }, [image]);

  const [open, setOpen] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [AttendanceStatus, setAttendanceStatus] = useState(null);
  const [showTiming, setShowTiming] = useState(false);
  const [InTime, setInTime] = useState("00:00:00");

  useEffect(() => {
    if (isMobile && MobileView) {
      setOpen(false);
    }
  }, []);

  const currScreen = localStorage.getItem("currScreen");

  const isLoanPage = currScreen === "loandetails" || currScreen === "addloan";

  const isAttendancePage = currScreen === "userattendance";

  const isBroker =
    currScreen === "brokerdetails" ||
    currScreen === "addbroker" ||
    currScreen === "brokerallleads";

  const isStatus =
    currScreen === "presentlead" ||
    currScreen === "missedlead" ||
    currScreen === "upcominglead";

  const isLead =
    currScreen === "totalleads" ||
    currScreen === "allstatus" ||
    currScreen === "freshlead" ||
    // currScreen === "presentlead" ||
    // currScreen === "missedlead" ||
    // currScreen === "upcominglead" ||
    currScreen === "nonassignlead" ||
    currScreen === "assignlead" ||
    currScreen === "leadscheduling" ||
    currScreen === "leadassignreport" ||
    currScreen === "userlead" ||
    currScreen === "addlead" ||
    currScreen === "leadreport";

  const isHr =
    currScreen === "addcandidate" ||
    currScreen === "allcandidatestatus" ||
    currScreen === "assigncandidate" ||
    currScreen === "nonassigncandidate";

  const isInvoice =
    currScreen === "invoicedetails" || currScreen === "addinvoice";

  const isUserPage = currScreen === "allusers" || currScreen === "adduser";

  const isDynamicField =
    currScreen === "projectname" ||
    currScreen === "source" ||
    currScreen === "configuration" ||
    currScreen === "leadstatus" ||
    currScreen === "loanstatus" ||
    currScreen === "loansalesmanager" ||
    currScreen === "candidatessource" ||
    currScreen === "candidatestatus" ||
    currScreen === "candidatepost" ||
    currScreen === "attendancepolicy" ||
    currScreen === "bankname";

  const [ShowLoan, setShowLoan] = useState(isLoanPage);
  const [ShowAttendance, setShowAttendance] = useState(isAttendancePage);
  const [ShowBroker, setShowBroker] = useState(isBroker);
  const [showStatus, setShowStatus] = useState(isStatus);
  const [ShowLead, setShowLead] = useState(isLead);
  const [ShowHumanResources, setShowHumanResources] = useState(isHr);
  const [ShowInvoice, setShowInvoice] = useState(isInvoice);
  const [ShowUser, setShowUser] = useState(isUserPage);
  const [ShowDynamicField, setDynamicField] = useState(isDynamicField);

  const handleClickLoan = () => {
    setShowLoan(!ShowLoan);
    setShowUser(false);
    setShowStatus(false);
    setDynamicField(false);
    setShowLead(false);
    setShowAttendance(false);
    setShowHumanResources(false);
    setShowBroker(false);
    setShowInvoice(false);
  };
  const handleClickAttendance = () => {
    setShowAttendance(!ShowAttendance);
    setShowUser(false);
    setShowStatus(false);
    setDynamicField(false);
    setShowLoan(false);
    setShowLead(false);
    setShowHumanResources(false);
    setShowBroker(false);
    setShowInvoice(false);
  };
  const handleClickBroker = () => {
    setShowBroker(!ShowBroker);
    setShowUser(false);
    setShowStatus(false);
    setDynamicField(false);
    setShowLoan(false);
    setShowLead(false);
    setShowAttendance(false);
    setShowHumanResources(false);
    setShowInvoice(false);
  };
  const handleClickLead = () => {
    setShowLead(!ShowLead);
    setShowStatus(false);
    setShowAttendance(false);
    setShowBroker(false);
    setShowInvoice(false);
    setShowHumanResources(false);
    setShowUser(false);
    setDynamicField(false);
    setShowLoan(false);
  };
  const handleClickStatus = () => {
    setShowStatus(!showStatus);
    setShowLead(false);
    setShowAttendance(false);
    setShowBroker(false);
    setShowInvoice(false);
    setShowHumanResources(false);
    setShowUser(false);
    setDynamicField(false);
    setShowLoan(false);
  };
  const handleClickHumanResources = () => {
    setShowHumanResources(!ShowHumanResources);
    setShowLead(false);
    setShowAttendance(false);
    setShowStatus(false);
    setShowBroker(false);
    setShowInvoice(false);
    setShowUser(false);
    setDynamicField(false);
    setShowLoan(false);
  };
  const handleClickInvoice = () => {
    setShowInvoice(!ShowInvoice);
    setShowLead(false);
    setShowAttendance(false);
    setShowStatus(false);
    setShowBroker(false);
    setShowHumanResources(false);
    setShowUser(false);
    setDynamicField(false);
    setShowLoan(false);
  };
  const handleClickUser = () => {
    setShowUser(!ShowUser);
    setDynamicField(false);
    setShowLoan(false);
    setShowStatus(false);
    setShowLead(false);
    setShowAttendance(false);
    setShowHumanResources(false);
    setShowBroker(false);
    setShowInvoice(false);
  };
  const handleClickDynamicField = () => {
    setDynamicField(!ShowDynamicField);
    setShowUser(false);
    setShowLoan(false);
    setShowStatus(false);
    setShowLead(false);
    setShowAttendance(false);
    setShowBroker(false);
    setShowInvoice(false);
    setShowHumanResources(false);
  };
  const handleSingleMenuClick = () => {
    setDynamicField(false);
    setShowUser(false);
    setShowStatus(false);
    setShowLoan(false);
    setShowLead(false);
    setShowAttendance(false);
    setShowBroker(false);
    setShowInvoice(false);
    setShowHumanResources(false);
  };

  const SideMenuList = [
    {
      icon: <DashboardIcon />,
      MenuName: "Dashboard",
      submenu: "No",
      Link:
        Cookies.get("role") === "HR Head" || Cookies.get("role") === "HR"
          ? "/hrdashboard"
          : "/dashboard",
      MapFunction: "",
      setFunction: "",
      onclickFunction: "",
      display: true,
    },
    {
      icon: <SwitchAccountIcon />,
      MenuName: "Leads",
      Link: null,
      submenu: "Yes",
      MapFunction: LeadSubMenu,
      setFunction: ShowLead,
      onclickFunction: handleClickLead,
      display:
        Cookies.get("role") === "Master" ||
        Cookies.get("module_privilege").includes("Leads View"),
    },
    {
      icon: <SwitchAccountIcon />,
      MenuName: "Follow up",
      Link: null,
      submenu: "Yes",
      MapFunction: StatusSubMenu,
      setFunction: showStatus,
      onclickFunction: handleClickStatus,
      display:
        Cookies.get("role") === "Master" ||
        Cookies.get("module_privilege").includes("followup View"),
    },
    {
      icon: <CreditScoreIcon />,
      MenuName: "Loan",
      Link: null,
      submenu: "Yes",
      MapFunction: LoanSubMenu,
      setFunction: ShowLoan,
      onclickFunction: handleClickLoan,
      display:
        Cookies.get("role") === "Master" ||
        Cookies.get("module_privilege").includes("Loan View"),
    },
    {
      icon: <ManageAccountsOutlinedIcon />,
      MenuName: "All Broker",
      Link: null,
      submenu: "Yes",
      MapFunction: BrokerSubMenu,
      setFunction: ShowBroker,
      onclickFunction: handleClickBroker,
      display:
        Cookies.get("role") === "Master" ||
        Cookies.get("module_privilege").includes("Broker View"),
    },
    {
      icon: <SwitchAccountIcon />,
      MenuName: "Human Resources",
      Link: null,
      submenu: "Yes",
      MapFunction: HumanResourcesSubMenu,
      setFunction: ShowHumanResources,
      onclickFunction: handleClickHumanResources,
      display:
        Cookies.get("role") === "Master" ||
        Cookies.get("module_privilege").includes("Human Resource View"),
    },
    // {
    //   icon: <ReceiptIcon />,
    //   MenuName: "Invoice",
    //   Link: null,
    //   submenu: "Yes",
    //   MapFunction: InvoiceSubMenu,
    //   setFunction: ShowInvoice,
    //   onclickFunction: handleClickInvoice,
    //   display: Cookies.get("role") === "Master" || Cookies.get("module_privilege").includes("Change Password"),
    // },
    {
      icon: <SummarizeIcon />,
      MenuName: "Attendance Report",
      Link: null,
      submenu: "Yes",
      MapFunction: AttendanceSubMenu,
      setFunction: ShowAttendance,
      onclickFunction: handleClickAttendance,
      display:
        Cookies.get("role") === "Master" ||
        Cookies.get("module_privilege").includes("Users View"),
    },
    {
      icon: <ManageAccountsIcon />,
      MenuName: "Users",
      Link: null,
      submenu: "Yes",
      MapFunction: UserSubMenu,
      setFunction: ShowUser,
      onclickFunction: handleClickUser,
      display:
        Cookies.get("role") === "Master" ||
        Cookies.get("module_privilege").includes("Users View"),
    },
    {
      icon: <AccountTreeIcon />,
      MenuName: "Dynamic Fields",
      Link: null,
      submenu: "Yes",
      MapFunction: DynamicFieldsSubMenu,
      setFunction: ShowDynamicField,
      onclickFunction: handleClickDynamicField,
      display:
        Cookies.get("role") === "Master" ||
        Cookies.get("module_privilege").includes("Dynamic Fields View"),
    },
    {
      icon: <DisplaySettingsIcon />,
      MenuName: "PaySlip",
      Link: "/payslip",
      submenu: "No",
      MapFunction: "",
      setFunction: "",
      onclickFunction: "",
      display:
        Cookies.get("role") === "Master" ||
        Cookies.get("module_privilege").includes("Change Password"),
    },
    {
      icon: <IntegrationInstructionsOutlinedIcon />,
      MenuName: "API Integration",
      Link: "/api-integration",
      submenu: "No",
      MapFunction: "",
      setFunction: "",
      onclickFunction: "",
      display:
        Cookies.get("role") === "Master" || Cookies.get("role") === "Admin",
    },
    // {
    //   icon: <DisplaySettingsIcon />,
    //   MenuName: "PaySlip",
    //   Link: "/payslip",
    //   submenu: "No",
    //   MapFunction: "",
    //   setFunction: "",
    //   onclickFunction: "",
    //   display: Cookies.get("role") === "Master" || Cookies.get("module_privilege").includes("Change Password"),
    // },
    {
      icon: <DisplaySettingsIcon />,
      MenuName: "Change Password",
      Link: "/change-password",
      submenu: "No",
      MapFunction: "",
      setFunction: "",
      onclickFunction: "",
      display:
        Cookies.get("role") === "Master" ||
        Cookies.get("module_privilege").includes("Change Password Edit"),
    },
  ];

  const logout_User = () => {
    logout(Cookies.get("token"))
      .then((response) => {
        if (response.data === "Logout Done") {
          Cookies.remove("user", { path: "/", domain: myglobalData.URL });
          Cookies.remove("type", { path: "/", domain: myglobalData.URL });
          Cookies.remove("role", { path: "/", domain: myglobalData.URL });
          Cookies.remove("username", { path: "/", domain: myglobalData.URL });
          Cookies.remove("module_privilege", {
            path: "/",
            domain: myglobalData.URL,
          });
          dispatch({ event: "Login" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getAttendanceStatus()
      .then((response) => {
        if (response.status === 200) {
          setAttendanceStatus(response.data);
          if (
            Array.isArray(response.data) &&
            response.data[0].hasOwnProperty("totalTime")
          ) {
            setShowTiming(true);
            setInTime(response.data[0].totalTime);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleAttendance = (data) => {
    setModalShow(false);
    setAttendanceStatus(data);
    setShowTiming(!showTiming);
  };

  const { mutate, isLoading } = UseBackToOldCrm();

  const BackToOldCRM = () => {
    mutate(Cookies.get("previous_user"), {
      onSuccess: (data) => {
        if (data.status === "Back to CRM Process Done") {
          Cookies.set("username", data.username, {
            domain: myglobalData.URL,
            path: "/",
            expires: 365,
          });
          Cookies.set("role", data.role, {
            domain: myglobalData.URL,
            path: "/",
            expires: 365,
          });
          Cookies.set("type", data.utype, {
            domain: myglobalData.URL,
            path: "/",
            expires: 365,
          });
          Cookies.set("module_privilege", data.module_privilege, {
            domain: myglobalData.URL,
            path: "/",
            expires: 365,
          });
          Cookies.remove("previous_user", {
            path: "/",
            domain: myglobalData.URL,
          });
          setTimeout(() => {
            dispatch({ event: "loader" });
          }, 50);
        }
      },
    });
  };

  const currDate = new Date();

  const currYear = currDate.getFullYear();

  return (
    <React.Fragment>
      <CssBaseline />
      <Box>
        {/* <h3
          className="Attandancetime position-absolute"
          style={{ zIndex: 100, right: "230px", top: "24px" }}
        >
          {showTiming ? <AttendanceTiming InTime={InTime} /> : null}
        </h3> */}
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => setOpen(true)}
              edge="start"
              sx={{
                marginRight: 5,
                borderRadius: 0,
                ...(open && { display: "none" }),
              }}
            >
              {!(isMobile && MobileView) && (
                <img
                  src={Logo}
                  alt="logo"
                  style={{ width: "100px", marginLeft: "50px" }}
                />
              )}
              <MenuIcon sx={{ ml: isMobile && MobileView && "50px" }} />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              className="CrmId"
              sx={{
                display: { xs: "none", md: "flex" },
                flexGrow: { xs: 0, md: 1 },
              }}
            >
              Client Code: {document.getElementById("client_id").value}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: "flex" }}>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ "aria-label": "search" }}
                />
              </Search>
              {Cookies.get("previous_user") !== undefined ? (
                <div className="d-flex align-items-center">
                  <LoadingButton
                    variant="outlined"
                    onClick={BackToOldCRM}
                    loading={isLoading}
                  >
                    Back to Old CRM
                  </LoadingButton>
                </div>
              ) : null}
              <h3 className="Attandancetime">
                {showTiming ? <AttendanceTiming InTime={InTime} /> : null}
              </h3>
              {Cookies.get("previous_user") === undefined ? (
                <Tooltip title="Attendance" onClick={() => setModalShow(true)}>
                  <IconButton
                    color="inherit"
                    size="large"
                    sx={{ ml: { xs: 0, md: 1 } }}
                  >
                    <FingerprintIcon
                      sx={{
                        color: showTiming ? "green" : "red",
                      }}
                    />
                  </IconButton>
                </Tooltip>
              ) : null}
              <NotificationMenu dispatch={dispatch} />
              <DropdownButton
                className="profile-dropdown-btn"
                title={
                  <IconButton
                    component={Box}
                    size="small"
                    sx={{ ml: { xs: 0, md: 0 }, justifyContent: "start" }}
                  >
                    <Avatar
                      sx={{
                        // bgcolor: deepOrange[500],
                        // border: "1px solid #111",
                        // width: 35,
                        // height: 28,
                        height: 30,
                        width: "auto",
                      }}
                      className="avatar-profile-img"
                      src={imageExists === false ? UserImg : image}
                      alt={Cookies.get("username")}
                    />
                  </IconButton>
                }
              >
                {Cookies.get("previous_user") === undefined ? (
                  <>
                    <Dropdown.Item
                      as="button"
                      className="dropdown-list"
                      onClick={() => dispatch({ event: "profile" })}
                    >
                      <AccountCircleOutlinedIcon sx={{ mr: 1 }} />
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Item
                      as="button"
                      className="dropdown-list"
                      onClick={logout_User}
                    >
                      <LogoutIcon sx={{ mr: 1, fontSize: "1.375rem" }} /> Log
                      Out
                    </Dropdown.Item>
                  </>
                ) : null}
              </DropdownButton>
            </Box>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          open={open}
          className="leftsidenav"
          ref={drawerRef}
          onClick={handleDrawer}
        >
          <DrawerHeader>
            <ListItem disablePadding sx={{ display: "block" }}>
              <div
                className={
                  open
                    ? "d-flex align-items-center px-3"
                    : "d-flex align-items-center"
                }
              >
                <Avatar
                  sx={{
                    // bgcolor: deepOrange[500],
                    width: 50,
                    height: 50,
                    objectFit: "contain",
                    borderRadius: "50%",
                  }}
                  src={imageExists === false ? UserImg : image}
                  alt={Cookies.get("username")}
                  className="avatar-profile-img"
                />
                {open && (
                  <>
                    <ListItemText
                      primary={Cookies.get("username")}
                      secondary={Cookies.get("role")}
                      className="user-details"
                    />
                    <IconButton onClick={() => setOpen(false)}>
                      <MenuIcon sx={{ fontSize: "1.3rem !important" }} />
                    </IconButton>
                  </>
                )}
              </div>
            </ListItem>
          </DrawerHeader>
          <Divider />
          <List>
            {SideMenuList.map((Menu, id) => {
              return (
                Menu.display && (
                  <ListItem key={id} disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}
                      onClick={
                        Menu.Link === null
                          ? Menu.onclickFunction
                          : () => {
                              handleSingleMenuClick();
                              dispatchFun(Menu.MenuName);
                            }
                      }
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 1 : "auto",
                          justifyContent: "center",
                        }}
                        style={{
                          color:
                            currScreen ===
                            Menu.MenuName.toLowerCase().replace(/ /g, "")
                              ? "white"
                              : null,
                        }}
                      >
                        {Menu.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={Menu.MenuName}
                        sx={{ opacity: open ? 1 : 0 }}
                        style={{
                          color:
                            currScreen ===
                            Menu.MenuName.toLowerCase().replace(/ /g, "")
                              ? "white"
                              : null,
                        }}
                      />
                      {open ? (
                        Menu.submenu === "Yes" ? (
                          Menu.setFunction ? (
                            <KeyboardArrowDownIcon />
                          ) : (
                            <ChevronLeftIcon />
                          )
                        ) : null
                      ) : null}
                    </ListItemButton>
                    {Menu.submenu === "Yes" ? (
                      <Collapse
                        timeout="auto"
                        in={Menu.setFunction}
                        unmountOnExit
                      >
                        {Menu.MapFunction.map((row, subid) => {
                          return (
                            <Box key={subid}>
                              <List component="div" disablePadding>
                                <ListItemButton
                                  sx={{ pl: open ? 5 : 2.5 }}
                                  onClick={() =>
                                    dispatch({ event: row.dispatch })
                                  }
                                >
                                  <ListItemIcon
                                    sx={{
                                      minWidth: 0,
                                      mr: open ? 1 : "auto",
                                      justifyContent: "center",
                                    }}
                                    style={{
                                      color:
                                        currScreen ===
                                        row.SubMenuName.toLowerCase().replace(
                                          / /g,
                                          ""
                                        )
                                          ? "white"
                                          : null,
                                    }}
                                  >
                                    <CheckBoxIcon />
                                  </ListItemIcon>
                                  {open ? (
                                    <>
                                      <ListItemText
                                        primary={row.SubMenuName}
                                        style={{
                                          color:
                                            currScreen ===
                                            row.SubMenuName.toLowerCase().replace(
                                              / /g,
                                              ""
                                            )
                                              ? "white"
                                              : null,
                                        }}
                                      />
                                      {row.count !== null ? (
                                        !row.loading ? (
                                          <Chip
                                            label={row.count}
                                            variant="outlined"
                                            size="small"
                                            className="counting-chip"
                                          />
                                        ) : (
                                          <Skeleton
                                            variant="rectangular"
                                            width={35}
                                            height={24}
                                          />
                                        )
                                      ) : null}
                                    </>
                                  ) : null}
                                </ListItemButton>
                              </List>
                              <Divider />
                            </Box>
                          );
                        })}
                      </Collapse>
                    ) : null}
                  </ListItem>
                )
              );
            })}
          </List>
        </Drawer>
        <footer className="footer">
          <CustomSubTitle
            SubTitle={`RABS Connect Powered by RABS Net Solutions Pvt. Ltd. | Copyright © ${currYear} All Rights Reserved.`}
          />
        </footer>
      </Box>
      <CustomModal
        ModalSize="md"
        show={modalShow}
        onHide={() => setModalShow(false)}
        ModalBody={
          <Attendance
            AttendanceStatus={AttendanceStatus}
            onData={handleAttendance}
            showTiming={showTiming}
          />
        }
      />
    </React.Fragment>
  );
};

export default Leftsidebar;
