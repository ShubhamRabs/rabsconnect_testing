import React from "react";
import { Formik, Form, useFormikContext } from "formik";
import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";
import { useBootstrap, useMui } from "../../../hooks/Hooks";
import ChangePasswordSchema from "./../../../schema/Auth/ChangePasswordSchema";
import {
  CustomFormGroup,
  CustomInputField,
} from "../../../components/FormUtility/FormUtility";
import { useChangePassword } from "../../../hooks/Auth/Authentication";

const ChangePassword = ({ dispatch, myglobalData }) => {
  const { Card, Row, Col, Alert } = useBootstrap();
  const { Divider, LoadingButton, IconButton, Visibility, VisibilityOff } =
    useMui();

  const [showMsg, setshowMsg] = React.useState("");
  const [showPassword, setShowPassword] = React.useState({
    currpassword: false,
    newpassword: false,
    confirmpassword: false,
  });

  const initialValues = {
    current_password: "",
    new_password: "",
    confirm_password: "",
  };

  const { mutate: MutateChangePassword } = useChangePassword();

  const onSubmit = (values) => {
    MutateChangePassword(values, {
      onSuccess: (data) => {
        setshowMsg(data);
        if (data === "Password Updated Successfully") {
          setTimeout(() => {
            dispatch({ event: "dashboard" });
          }, 600);
        }
      },
    });
  };

  const toggleShowPassword = (objkey) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [objkey]: !prevState[objkey],
    }));
  };

  return (
    <>
      <Breadcrumb PageName="Change Password" />
      <Card className="my-3">
        <Card.Body>
          <Card.Title>Change Password :-</Card.Title>
          <Divider />
          <Formik
            initialValues={initialValues}
            validationSchema={ChangePasswordSchema}
            onSubmit={onSubmit}
          >
            {(formikProps) => {
              return (
              <Form>
                {showMsg && (
                  <Alert
                    variant={
                      showMsg === "Password Updated Successfully"
                        ? "primary"
                        : "danger"
                    }
                  >
                    {showMsg}
                  </Alert>
                )}

                <Row className="mt-3 align-items-baseline flex-nowrap">
                  <CustomFormGroup
                    formlabel="Current Password"
                    md={8}
                    star="*"
                    FormField={
                      <CustomInputField
                        type={showPassword.currpassword ? "text" : "password"}
                        name="current_password"
                        placeholder="Enter Current Password..."
                      />
                    }
                  />
                  <IconButton
                    className="p-0 w-auto position-relative"
                    sx={{
                      right: "50px",
                      top: (formikProps?.errors?.current_password && formikProps?.touched?.current_password)
                        ? "0"
                        : "0.65rem",
                    }}
                    onClick={() => toggleShowPassword("currpassword")}
                  >
                    {showPassword.currpassword ? (
                      <Visibility />
                    ) : (
                      <VisibilityOff />
                    )}
                  </IconButton>
                </Row>
                <Row className="align-items-baseline flex-nowrap">
                  <CustomFormGroup
                    formlabel="New Password"
                    md={8}
                    star="*"
                    FormField={
                      <CustomInputField
                        type={showPassword.newpassword ? "text" : "password"}
                        name="new_password"
                        placeholder="Enter New Password..."
                      />
                    }
                  />
                  <IconButton
                    className="p-0 w-auto position-relative"
                    sx={{
                      right: "50px",
                      top: formikProps?.errors?.new_password && formikProps?.touched?.new_password ? "0" : "0.65rem",
                    }}
                    onClick={() => toggleShowPassword("newpassword")}
                  >
                    {showPassword.newpassword ? (
                      <Visibility />
                    ) : (
                      <VisibilityOff />
                    )}
                  </IconButton>
                </Row>
                <Row className="align-items-baseline flex-nowrap">
                  <CustomFormGroup
                    formlabel="Confirm Password"
                    md={8}
                    star="*"
                    FormField={
                      <CustomInputField
                        type={
                          showPassword.confirmpassword ? "text" : "password"
                        }
                        name="confirm_password"
                        placeholder="Confirm Password..."
                      />
                    }
                  />
                  <IconButton
                    className="p-0 w-auto position-relative"
                    sx={{
                      right: "50px",
                      top: formikProps?.errors?.confirm_password && formikProps?.touched?.confirm_password
                        ? "0"
                        : "0.65rem",
                    }}
                    onClick={() => toggleShowPassword("confirmpassword")}
                  >
                    {showPassword.confirmpassword ? (
                      <Visibility />
                    ) : (
                      <VisibilityOff />
                    )}
                  </IconButton>
                </Row>
                <Row>
                  <Col xs={12} md={12}>
                    <LoadingButton
                      type="submit"
                      // loading={isLoading}
                      variant="contained"
                      disableElevation
                    >
                      Change Password
                    </LoadingButton>
                  </Col>
                </Row>
              </Form>
            )}}
          </Formik>
        </Card.Body>
      </Card>
    </>
  );
};

export default ChangePassword;
