// import React from "react";
// import SearchIcon from "@mui/icons-material/Search";
// import { styled, alpha } from "@mui/material/styles";
// import { MobileView, isMobile } from "react-device-detect";
// import InputBase from "@mui/material/InputBase";
// import { AttendanceTiming } from "../../hooks/Function";
// import Cookies from "js-cookie";
// import { UseBackToOldCrm } from "../../hooks/Users/UseUsersAnalystHook";
// import NotificationMenu from "../NotificationMenu/NotificationMenu";
// import { logout } from "../../hooks/Auth/Authentication";
// import { useBootstrap, useMui } from "../../hooks/Hooks";
// import Logo from "../../assets/Image/logo.png";
// import UserImg from "../../assets/Image/user.png";
// import "./Header.css";

// const Search = styled("div")(({ theme }) => ({
//   position: "relative",
//   borderRadius: theme.shape.borderRadius,
//   display: "flex",
//   height: "40px",
//   alignItems: "center",
//   margin: "auto",
//   justifyContent: "space-between",
//   backgroundColor: "#cccccc5c",
//   marginLeft: 0,
//   width: "100%",
//   [theme.breakpoints.up("sm")]: {
//     marginLeft: theme.spacing(1),
//     width: "auto",
//   },
// }));

// const SearchIconWrapper = styled("div")(({ theme }) => ({
//   padding: theme.spacing(0, 2),
//   height: "100%",
//   position: "absolute",
//   pointerEvents: "none",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
// }));

// const StyledInputBase = styled(InputBase)(({ theme }) => ({
//   color: "inherit",
//   width: "100%",
//   "& .MuiInputBase-input": {
//     padding: theme.spacing(1, 1, 1, 0),
//     // vertical padding + font size from searchIcon
//     paddingLeft: `calc(1em + ${theme.spacing(4)})`,
//     transition: theme.transitions.create("width"),
//     [theme.breakpoints.up("sm")]: {
//       width: "14ch",
//       "&:focus": {
//         width: "22ch",
//       },
//     },
//   },
// }));

// const Header = ({
//   myglobalData,
//   dispatch,
//   drawerWidth,
//   showTiming,
//   imageExists,
//   image,
//   open,
//   setOpen,
// }) => {
//   const { Dropdown, DropdownButton } = useBootstrap();
//   const {
//     Toolbar,
//     MuiAppBar,
//     Typography,
//     Tooltip,
//     Box,
//     Avatar,
//     IconButton,
//     MenuIcon,
//     FingerprintIcon,
//     AccountCircleOutlinedIcon,
//     LogoutIcon,
//     SettingsIcon,
//     LoadingButton,
//   } = useMui();

//   const AppBar = styled(MuiAppBar, {
//     shouldForwardProp: (prop) => prop !== "open",
//   })(({ theme, open }) => ({
//     zIndex: theme.zIndex.drawer + 1,
//     ...(open && {
//       width: `calc(100% - ${drawerWidth}px)`,
//     }),
//   }));

//   const { mutate, isLoading } = UseBackToOldCrm();
//   const BackToOldCRM = () => {
//     mutate(Cookies.get("previous_user"), {
//       onSuccess: (data) => {
//         if (data.status === "Back to CRM Process Done") {
//           Cookies.set("username", data.username, {
//             domain: myglobalData.URL,
//             path: "/",
//             expires: 365,
//           });
//           Cookies.set("role", data.role, {
//             domain: myglobalData.URL,
//             path: "/",
//             expires: 365,
//           });
//           Cookies.set("type", data.utype, {
//             domain: myglobalData.URL,
//             path: "/",
//             expires: 365,
//           });
//           Cookies.set("module_privilege", data.module_privilege, {
//             domain: myglobalData.URL,
//             path: "/",
//             expires: 365,
//           });
//           Cookies.remove("previous_user", {
//             path: "/",
//             domain: myglobalData.URL,
//           });
//           setTimeout(() => {
//             dispatch({ event: "loader" });
//           }, 50);
//         }
//       },
//     });
//   };

//   const logout_User = () => {
//     logout(Cookies.get("token"))
//       .then((response) => {
//         if (response.data === "Logout Done") {
//           Cookies.remove("user", { path: "/", domain: myglobalData.URL });
//           Cookies.remove("type", { path: "/", domain: myglobalData.URL });
//           Cookies.remove("role", { path: "/", domain: myglobalData.URL });
//           Cookies.remove("username", { path: "/", domain: myglobalData.URL });
//           Cookies.remove("module_privilege", {
//             path: "/",
//             domain: myglobalData.URL,
//           });
//           dispatch({ event: "Login" });
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   return (
//     <AppBar position="fixed" open={open}>
//       <Toolbar>
//         <IconButton
//           color="inherit"
//           aria-label="open drawer"
//           onClick={() => setOpen(true)}
//           edge="start"
//           sx={{
//             marginRight: 5,
//             borderRadius: 0,
//             ...(open && { display: "none" }),
//           }}
//         >
//           {!(isMobile && MobileView) && (
//             <img
//               src={Logo}
//               alt="logo"
//               style={{ width: "100px", marginLeft: "50px" }}
//             />
//           )}
//           <MenuIcon sx={{ ml: isMobile && MobileView && "50px" }} />
//         </IconButton>
//         <Typography
//           variant="h6"
//           noWrap
//           component="div"
//           className="CrmId"
//           sx={{
//             display: { xs: "none", md: "flex" },
//             flexGrow: { xs: 0, md: 1 },
//           }}
//         >
//           Client Code: {document.getElementById("client_id").value}
//         </Typography>
//         <Box sx={{ flexGrow: 1 }} />
//         <Box sx={{ display: "flex" }}>
//           {/* <div style={{ position: "relative" }}>
//             <Search>
//               <SearchIconWrapper>
//                 <SearchIcon />
//               </SearchIconWrapper>
//               <StyledInputBase
//                 placeholder="Search…"
//                 inputProps={{ "aria-label": "search" }}
//               />
//             </Search>
//             <div className="global-search-result">
//               <h1>Global Search</h1>
//             </div>
//           </div> */}
//           {Cookies.get("previous_user") !== undefined ? (
//             <div className="d-flex align-items-center">
//               <LoadingButton
//                 variant="outlined"
//                 onClick={BackToOldCRM}
//                 loading={isLoading}
//               >
//                 Back to Old CRM
//               </LoadingButton>
//             </div>
//           ) : null}
//           <h3 className="Attandancetime">
//             {showTiming ? <AttendanceTiming InTime={InTime} /> : null}
//           </h3>
//           {Cookies.get("previous_user") === undefined ? (
//             <Tooltip title="Attendance" onClick={() => setModalShow(true)}>
//               <IconButton
//                 color="inherit"
//                 size="large"
//                 sx={{ ml: { xs: 0, md: 1 } }}
//               >
//                 <FingerprintIcon
//                   sx={{
//                     color: showTiming ? "green" : "red",
//                   }}
//                 />
//               </IconButton>
//             </Tooltip>
//           ) : null}
//           <NotificationMenu dispatch={dispatch} />
//           <DropdownButton
//             className="profile-dropdown-btn"
//             title={
//               <IconButton
//                 component={Box}
//                 size="small"
//                 sx={{ ml: { xs: 0, md: 0 }, justifyContent: "start" }}
//               >
//                 <Avatar
//                   sx={{
//                     // bgcolor: deepOrange[500],
//                     // border: "1px solid #111",
//                     // width: 35,
//                     // height: 28,
//                     height: 30,
//                     width: "auto",
//                   }}
//                   className="avatar-profile-img"
//                   src={imageExists === false ? UserImg : image}
//                   alt={Cookies.get("username")}
//                 />
//               </IconButton>
//             }
//           >
//             {Cookies.get("previous_user") === undefined ? (
//               <>
//                 <Dropdown.Item
//                   as="button"
//                   className="dropdown-list"
//                   onClick={() => dispatch({ event: "settings" })}
//                 >
//                   <SettingsIcon sx={{ mr: 1, fontSize: "1.375rem" }} /> Settings
//                 </Dropdown.Item>
//                 <Dropdown.Item
//                   as="button"
//                   className="dropdown-list"
//                   onClick={() => dispatch({ event: "profile" })}
//                 >
//                   <AccountCircleOutlinedIcon sx={{ mr: 1 }} />
//                   Profile
//                 </Dropdown.Item>
//                 <Dropdown.Item
//                   as="button"
//                   className="dropdown-list"
//                   onClick={logout_User}
//                 >
//                   <LogoutIcon sx={{ mr: 1, fontSize: "1.375rem" }} /> Log Out
//                 </Dropdown.Item>
//               </>
//             ) : null}
//           </DropdownButton>
//         </Box>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Header;
