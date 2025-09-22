// Import necessary dependencies and components
import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  forgotPass,
  updateForgotPass,
} from "../../../hooks/Auth/Authentication";
import { useMui } from "../../../hooks/Hooks";
import Logoimg from "../../../assets/Image/logo.png";
import Loginbg from "../../../assets/Image/login-bg.jpg";

// Define the ForgotPassword component
export default function ForgotPassword({ dispatch, myglobalData, token }) {
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
  const [showOTP, setShowOTP] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotPassStatus, setForgotPassStatus] = useState(null);
  const [alertClass, setAlertClass] = useState(null);
  const [prevInputEmail, setPrevInputEmail] = useState(null);
  const [randomOTP, setRandomOTP] = useState(null);
  const [forgetPassUID, setForgetPassUID] = useState(null);

  const [remainingTime, setRemainingTime] = useState(180); // Initial time in seconds (3 minutes)
  const [timerRunning, setTimerRunning] = useState(false);

  console.log(prevInputEmail);

  useEffect(() => {
    let intervalId;

    if (timerRunning && remainingTime > 0) {
      intervalId = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (remainingTime === 0) {
      // Stop the timer and perform any action needed (e.g., enable resend OTP button)
      clearInterval(intervalId);
      setTimerRunning(false);
    }

    return () => clearInterval(intervalId);
  }, [timerRunning, remainingTime]);

  const startTimer = () => {
    setRemainingTime(180); // Reset timer to 3 minutes
    setTimerRunning(true);
  };

  const handleResendOTP = () => {
    let data = new FormData();
    data.append("email", prevInputEmail);
    forgotPass(data)
      .then((response) => {
        if (
          response.data.status === "OTP Sent Successfully On Given Email Id"
        ) {
          setLoading(false);
          setForgotPassStatus("OTP Sent Successfully On Given Email Id");
          setAlertClass("success");
          setTimeout(() => {
            setForgotPassStatus("Enter OTP Received On Given Email Id");
            setAlertClass("warning");
            startTimer();
          }, 1000);
          setRandomOTP(response.data.random_otp);
          setForgetPassUID(response.data.u_id);
        } else {
          setLoading(false);
          setForgotPassStatus(response.data.status);
          setAlertClass("error");
        }
      })
      .catch((err) => {
        setLoading(false);
        setForgotPassStatus("Something went wrong, Please try again later");
        console.log(err);
      });
    startTimer();
  };

  // Toggle password visibility
  const handleClickShowOTP = () => setShowOTP(!showOTP);
  const handleMouseDownShowOTP = (event) => event.preventDefault();
  const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const handleMouseDownShowNewPassword = (event) => event.preventDefault();
  const handleClickShowConfirmNewPassword = () =>
    setShowConfirmNewPassword(!showConfirmNewPassword);
  const handleMouseDownShowConfirmNewPassword = (event) =>
    event.preventDefault();

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    
    const data = new FormData(event.currentTarget);
    if (
      forgotPassStatus === null ||
      forgotPassStatus === "Email Not Found" ||
      forgotPassStatus === "Please Enter Valid Email Id"
    ) {
      // console.log(prevInputEmail,data.get("email"));
      if (prevInputEmail !== data.get("email")) {
        forgotPass(data)
          .then((response) => {
            if (
              response.data.status === "OTP Sent Successfully On Given Email Id"
            ) {
              setLoading(false);
              setForgotPassStatus("OTP Sent Successfully On Given Email Id");
              setAlertClass("success");
              setTimeout(() => {
                setForgotPassStatus("Enter OTP Received On Given Email Id");
                setAlertClass("warning");
                startTimer();
              }, 1000);
              setRandomOTP(response.data.random_otp);
              setForgetPassUID(response.data.u_id);
              setPrevInputEmail(response.data.email_id);
            } else {
              setLoading(false);
              setForgotPassStatus(response.data.status);
              setAlertClass("error");
              setPrevInputEmail(data.get("email"));
            }
          })
          .catch((err) => {
            setLoading(false);
            setForgotPassStatus("Something went wrong, Please try again later");
            console.log(err);
          });
      } else {
        setLoading(false);
        setAlertClass("error");
        setForgotPassStatus("Please Enter Valid Email Id");
      }
    } else if (
      forgotPassStatus === "Enter OTP Received On Given Email Id" ||
      forgotPassStatus === "Invalid OTP. Please try again"
    ) {
      setLoading(false);
      const data = new FormData(event.currentTarget);
      // console.log(randomOTP,data.get("form_otp"));
      if (Number(randomOTP) === Number(data.get("form_otp"))) {
        setForgotPassStatus(
          "OTP Verified Successfully. Please Enter New Password"
        );
        setAlertClass("success");
        setRandomOTP(null);
      } else {
        setForgotPassStatus("Invalid OTP. Please try again");
        setAlertClass("warning");
      }
    } else if (
      forgotPassStatus ===
        "OTP Verified Successfully. Please Enter New Password" ||
      forgotPassStatus === "New Password must match with Confirm Password"
    ) {
      setLoading(false);
      const data = new FormData(event.currentTarget);
      if (
        data.get("form_new_password") === data.get("form_confirm_new_password")
      ) {
        data.append("u_id", forgetPassUID);
        updateForgotPass(data)
          .then((response) => {
            if (response.data === "Password Updated Successfully") {
              setLoading(false);
              setForgotPassStatus("Password Updated Successfully");
              setAlertClass("success");
              setForgetPassUID(null);
              setTimeout(() => {
                dispatch({ event: "Login" });
              }, 500);
            }
          })
          .catch((err) => {
            setLoading(false);
            setForgotPassStatus("Something went wrong, Please try again later");
            setAlertClass("error");
            console.log(err);
          });
      } else {
        setForgotPassStatus("New Password must match with Confirm Password");
        setAlertClass("warning");
      }
    }
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
              display: "block",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
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
              sx={{ pt: 2, px: 0 }}
            >
              {forgotPassStatus === null ||
              forgotPassStatus === "Email Not Found" ||
              forgotPassStatus === "Please Enter Valid Email Id"
                ? "Forgot Password"
                : forgotPassStatus === "Enter OTP Received On Given Email Id" ||
                  forgotPassStatus === "Invalid OTP. Please try again"
                ? "Verify OTP"
                : forgotPassStatus ===
                    "OTP Verified Successfully. Please Enter New Password" ||
                  forgotPassStatus ===
                    "New Password must match with Confirm Password"
                ? "Reset Password"
                : "Forgot Password"}
            </Typography>
            <p className="text-center mt-2">
              {forgotPassStatus === null ||
              forgotPassStatus === "Email Not Found" ||
              forgotPassStatus === "Please Enter Valid Email Id"
                ? "Enter your email id to reset your password"
                : forgotPassStatus === "Enter OTP Received On Given Email Id" ||
                  forgotPassStatus === "Invalid OTP. Please try again"
                ? "Enter OTP received on your email id"
                : forgotPassStatus ===
                    "OTP Verified Successfully. Please Enter New Password" ||
                  forgotPassStatus ===
                    "New Password must match with Confirm Password"
                ? "Enter new password"
                : "Enter your email id to reset your password"}
            </p>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 0 }}>
              {/* Display login status messages */}
              {forgotPassStatus !== null ? (
                <Alert severity={alertClass} icon={false}>
                  {forgotPassStatus}
                </Alert>
              ) : null}

              {/* email input field */}
              {(forgotPassStatus === null ||
                forgotPassStatus === "Email Not Found" ||
                forgotPassStatus === "Please Enter Valid Email Id") &&
                forgotPassStatus !==
                  "OTP Verified Successfully. Please Enter New Password" && (
                  <FormControl
                    margin="normal"
                    variant="standard"
                    style={{ width: "100%", height: "auto" }}
                  >
                    <InputLabel htmlFor="standard-adornment-email">
                      Email
                    </InputLabel>
                    <Input
                      id="standard-adornment-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      autoFocus
                      required
                    />
                  </FormControl>
                )}

              {/* otp input field with visibility toggle */}
              {(forgotPassStatus === "Enter OTP Received On Given Email Id" ||
                forgotPassStatus === "Invalid OTP. Please try again" ||
                forgotPassStatus ===
                  "OTP Sent Successfully On Given Email Id") &&
                forgotPassStatus !==
                  "OTP Verified Successfully. Please Enter New Password" && (
                  <FormControl
                    margin="normal"
                    variant="standard"
                    style={{ width: "100%", height: "auto" }}
                  >
                    <InputLabel htmlFor="standard-adornment-form-otp">
                      Enter OTP
                    </InputLabel>
                    <Input
                      id="standard-adornment-form-otp"
                      name="form_otp"
                      type={showOTP ? "text" : "password"}
                      autoComplete="current-form-otp"
                      required
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle OTP visibility"
                            onClick={handleClickShowOTP}
                            onMouseDown={handleMouseDownShowOTP}
                          >
                            {showOTP ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                )}

              {/* new password and confirm new password input field with visibility toggle */}
              {(forgotPassStatus ===
                "OTP Verified Successfully. Please Enter New Password" ||
                forgotPassStatus ===
                  "New Password must match with Confirm Password") && (
                <>
                  <FormControl
                    margin="normal"
                    variant="standard"
                    style={{ width: "100%", height: "auto" }}
                  >
                    <InputLabel htmlFor="standard-adornment-new-password">
                      New Password
                    </InputLabel>
                    <Input
                      id="standard-adornment-new-password"
                      name="form_new_password"
                      type={showNewPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle new password visibility"
                            onClick={handleClickShowNewPassword}
                            onMouseDown={handleMouseDownShowNewPassword}
                          >
                            {showNewPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>

                  <FormControl
                    margin="normal"
                    variant="standard"
                    style={{ width: "100%", height: "auto" }}
                  >
                    <InputLabel htmlFor="standard-adornment-confirm-new-password">
                      Confirm New Password
                    </InputLabel>
                    <Input
                      id="standard-adornment-confirm-new-password"
                      name="form_confirm_new_password"
                      type={showConfirmNewPassword ? "text" : "password"}
                      autoComplete="confirm-new-password"
                      required
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle confirm new password visibility"
                            onClick={handleClickShowConfirmNewPassword}
                            onMouseDown={handleMouseDownShowConfirmNewPassword}
                          >
                            {showConfirmNewPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </>
              )}

              {(remainingTime > 0 ||
                forgotPassStatus ===
                  "OTP Sent Successfully On Given Email Id") &&
                forgotPassStatus !== null &&
                forgotPassStatus !== "Email Not Found" &&
                forgotPassStatus !== "Please Enter Valid Email Id" && (
                  <p style={{ textAlign: "right", marginBottom: "0rem" }}>
                    Resend OTP in: {Math.floor(remainingTime / 60)}:
                    {remainingTime % 60 < 10
                      ? "0" + (remainingTime % 60)
                      : remainingTime % 60}
                  </p>
                )}
              {remainingTime === 0 &&
                forgotPassStatus !==
                  "OTP Verified Successfully. Please Enter New Password" &&
                forgotPassStatus !==
                  "New Password must match with Confirm Password" && (
                  <p
                    style={{
                      color: "blue",
                      cursor: "pointer",
                      textAlign: "right",
                      marginBottom: "0rem",
                    }}
                    onClick={handleResendOTP}
                  >
                    Resend OTP
                  </p>
                )}

              {/* Submit button with loading state */}
              {forgotPassStatus !== "Password Updated Successfully" && (
                <LoadingButton
                  type="submit"
                  fullWidth
                  loading={loading}
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  {forgotPassStatus === null
                    ? "Send OTP"
                    : forgotPassStatus ===
                        "Enter OTP Received On Given Email Id" ||
                      forgotPassStatus === "Invalid OTP. Please try again"
                    ? "Verify OTP"
                    : forgotPassStatus ===
                        "OTP Verified Successfully. Please Enter New Password" ||
                      forgotPassStatus ===
                        "New Password must match with Confirm Password"
                    ? "Update Password"
                    : "Send OTP"}
                </LoadingButton>
              )}

              <p style={{ color: "blue", textAlign: "right" }}>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => dispatch({ event: "Login" })}
                >
                  Login?
                </span>
              </p>

              {/* Powered By */}
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ mt: 10 }}
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
