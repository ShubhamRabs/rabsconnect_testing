// Import necessary dependencies and components
import React, { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Cookies from "js-cookie";
import { setLogin } from "../../../hooks/Auth/Authentication";
import { useMui } from "../../../hooks/Hooks";
import Logoimg from "../../../assets/Image/logo.png";
import Loginbg from "../../../assets/Image/login-bg.jpg";
import AppDownloadimg from "../../../assets/Image/appdownload.png";

// Define the Login component
export default function Login({ dispatch, myglobalData, token }) {
  // Destructure MUI components from custom hook
  const {
    LoadingButton,
    Alert,
    CssBaseline,
    Link,
    Paper,
    Box,
    Grid,
    Typography,
    IconButton,
    Input,
    InputLabel,
    InputAdornment,
    FormControl,
    Visibility,
    VisibilityOff,
    ListItem,
    Button,
  } = useMui();

  // Create MUI theme
  const theme = createTheme();
  // State variables
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState(null);

  // Toggle password visibility
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  // Set cookie with specific configurations
  const setCookie = (name, value) => {
    Cookies.set(name, value, {
      domain: myglobalData.URL,
      path: "/",
      expires: 365,
    });
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // alert("login" + document.getElementById("crm_countries").value);
    setLoading(true);
    setLoginStatus(null);
    const data = new FormData(event.currentTarget);
    setLogin(data, token)
      .then((response) => {
        if (response.data.status === "login done") {
          setCookie("u_id", response.data.u_id);
          setCookie(
            "crm_country",
            document.getElementById("crm_countries").value
          );
          setCookie("username", response.data.username);
          setCookie("role", response.data.role);
          setCookie("type", response.data.utype);
          setCookie("token", token);
          setCookie("module_privilege", response.data.module_privilege);
          setLoading(false);
          setLoginStatus("User Verified");
          // Redirect to dashboard after successful login
          setTimeout(() => {
            const roleName = response.data.role;
            const isHR = roleName === "HR Head" || roleName === "HR";
            dispatch({ event: isHR ? "hrdashboard" : "dashboard" });
          }, 50);
        } else {
          setLoading(false);
          setLoginStatus("Invalid Username or Password");
        }
      })
      .catch((err) => {
        setLoading(false);
        setLoginStatus("Something went wrong, Please try again later");
        console.log(err);
      });
  };

  // Return JSX for the Login component
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Grid
        container
        component="main"
        sx={{ height: "100vh", overflow: "hidden" }}
      >
        <Grid
          item
          px={{ xs: 0, sm: 0, md: 3 }}
          xs={12}
          sm={8}
          md={4}
          component={Paper}
          elevation={6}
          square
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {token === "notificationblocked" && (
              <Alert
                severity="warning"
                className="d-flex justify-content-center align-items-center mb-3"
              >
                Due to blocked notifications, you won't be able to receive any
                CRM notifications.
              </Alert>
            )}
            {/* Logo image */}
            <ListItem
              button
              style={{
                justifyContent: "center",
                textDecoration: "none!important",
              }}
            >
              <img
                src={Logoimg}
                alt="logo"
                style={{ width: "80%", height: "auto" }}
              />
            </ListItem>
            {/* Title */}
            <Typography
              color="inherit"
              component="h1"
              variant="h5"
              sx={{ pt: 1, px: 0 }}
            >
              Login, to see it in action.
            </Typography>
            <Box
              component="form"
              // noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 2 }}
            >
              {/* Display login status messages */}
              {loginStatus === "User Verified" ? (
                <Alert severity="success" icon={false}>
                  User Verified
                </Alert>
              ) : loginStatus !== null ? (
                <Alert severity="error" icon={false}>
                  {loginStatus}
                </Alert>
              ) : null}
              {/* Username input field */}
              <FormControl
                margin="normal"
                variant="standard"
                style={{ width: "100%", height: "auto" }}
              >
                <InputLabel htmlFor="standard-adornment-username">
                  Username
                </InputLabel>
                <Input
                  id="standard-adornment-username"
                  name="username"
                  type="text"
                  autoComplete="email"
                  autoFocus
                  required
                />
              </FormControl>
              {/* Password input field with visibility toggle */}
              <FormControl
                margin="normal"
                variant="standard"
                style={{ width: "100%", height: "auto" }}
              >
                <InputLabel htmlFor="standard-adornment-password">
                  Password
                </InputLabel>
                <Input
                  id="standard-adornment-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              {/* Submit button with loading state */}
              <LoadingButton
                type="submit"
                fullWidth
                loading={loading}
                variant="contained"
                sx={{ mt: 4, mb: 2 }}
              >
                Log In
              </LoadingButton>
              <p style={{ color: "blue" }}>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => dispatch({ event: "forgotpassword" })}
                >
                  Forgot Password?
                </span>
              </p>
              {/* Powered By */}
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ mt: 4 }}
              >
                Powered By
                <br />
                <Link
                  color="inherit"
                  href="https://rabsnetsolutions.com/"
                  target={"blank"}
                  sx={{ textDecoration: "none" }}
                >
                  RABS Net Solutions PVT. LTD.
                </Link>
              </Typography>
            </Box>

            {/* <a
              href="https://rabsconnect.in/androidapp/rabs_connect.apk"
              rel="noreferrer"
              target="_blank"
              className="mt-1 border-0 bg-transparent d-flex justify-content-center"
            >
              <img src={AppDownloadimg} alt="Download" className="w-50" />
            </a> */}
          </Box>
        </Grid>
        {/* Background image */}
        <Grid
          item
          xs={false}
          sm={4}
          md={8}
          display={{ xs: "none", sm: "block" }}
        >
          <img
            src={Loginbg}
            alt="img"
            style={{ width: "100%", height: "100vh" }}
          />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
