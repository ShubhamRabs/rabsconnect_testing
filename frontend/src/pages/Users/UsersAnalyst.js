// Importing necessary dependencies and components from React and other files
import React, { useMemo } from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { useBootstrap, useMui, useSetting } from "../../hooks/Hooks";
import SmallDataTable from "./../../components/SmallDataTable/SmallDataTable";
import { CRMAnalystColumns } from "../../data/Columns/User/CrmAnalystColumns";
import { Formik, Form } from "formik";
import { CustomInputField } from "../../components/FormUtility/FormUtility";
import * as Yup from "yup";
import { CustomModal } from "../../components/CustomModal/CustomModal";
import {
  UseGetUserLastLocation,
  UseRedirectToUserCrm,
  useUpdateUserDetails,
} from "../../hooks/Users/UseUsersAnalystHook";
import { useQuery } from "react-query";
import { getAllRoleWiseUsers } from "../../hooks/Users/useAllUsersHook";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import "./../../assets/css/Users.css";
import MapComponent from "../../Handler/MapComponent";
import { CustomHeading } from "../../components/Common/Common";
import { getActionPrevilege } from "../../setting/ActionModulePrevileges";
// import MapComponent from "../../Handler/MapComponent";

// Validation schema using Yup for Formik form
const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string(),
});

// React functional component named UsersAnalyst
const UsersAnalyst = ({ myglobalData, dispatch }) => {
  // Destructuring utility functions and components from custom hooks and libraries
  const { Card, Row, Col } = useBootstrap();
  const {
    Divider,
    LoadingButton,
    Alert,
    FormControlLabel,
    Checkbox,
    CloseIcon,
  } = useMui();
  const { globalData } = useSetting();

  // State variables for managing modal visibility, success message, and form values
  const [userLocation, setUserLocation] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);
  const [LocationModal, setLocationModal] = React.useState(false);
  const [moduleAccess, setModuleAccess] = React.useState([]);
  const [checkAllAction, setCheckAllAction] = React.useState({});
  const [selectAllModule, setSelectAllModule] = React.useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(null); // New state for success message
  const [initialValues, setInitialValues] = React.useState({
    id: "",
    username: "",
    password: "",
    previous_pass: "",
  });

  // Decrypting user role from cookies
  let CryptoJSKey = globalData.CompanyName + "@" + globalData.Version;
  const bytes = CryptoJS.AES.decrypt(
    localStorage.getItem("updateglobal_userdata"),
    CryptoJSKey
  );
  const UserRole = bytes.toString(CryptoJS.enc.Utf8);

  // Get broker action previlege
  const memoizedUserActionPrevilege = useMemo(
    () => getActionPrevilege("Users"),
    []
  );

  const UserActionPrevilege = memoizedUserActionPrevilege;

  // Query for fetching all users based on user role
  const AllUsers = useQuery("AllUsers", () => {
    return getAllRoleWiseUsers(UserRole);
  });

  const { mutate: MutateLastLocation, isLoading: isLoadingLastLocation } =
    UseGetUserLastLocation();

  React.useEffect(() => {
    if (!AllUsers.isLoading) {
      setModuleAccess(AllUsers.data?.data[0].module_privilege?.split(","));
    }
  }, [AllUsers.isLoading, AllUsers.data]);

  // Mutations for updating user details and redirecting to CRM
  const { mutate, isLoading } = useUpdateUserDetails();
  const { mutate: ViewCrmmutate } = UseRedirectToUserCrm();

  // Event handler for editing user details
  const handleEditFun = (data) => {
    // console.log(data)
    setShowModal(true);
    setInitialValues({
      id: data.u_id,
      username: data.username,
      password: "",
      previous_pass: data.password,
      utype: data.utype,
      urole: data.urole,
    });

    // Check if the user data contains module_privilege information
    if (data.module_privilege) {
      const previousModuleAccess = data.module_privilege.split(",");
      setModuleAccess(previousModuleAccess);
    } else {
      // If module_privilege is not available, set the default state or fetch it from AllUsers data
      if (!AllUsers.isLoading) {
        setModuleAccess(
          AllUsers.data?.data[0].module_privilege?.split(",") || []
        );
      }
    }
  };

  // Event handler for submitting the form and updating user details
  const HandleSubmit = (values) => {
    let data = [values, moduleAccess];
    console.log("data", data);
    mutate(data, {
      onSuccess: (data) => {
        AllUsers.refetch();
        setShowModal(false);
        setShowSuccessMessage(data.data);
        setTimeout(() => {
          setShowSuccessMessage(null);
          // Reset checkbox states after form is submitted
          setModuleAccess([]);
          setCheckAllAction({});
          setSelectAllModule(false);
        }, 3000);
      },
    });
  };

  // Event handler for viewing CRM details
  const handleViewCRMFun = (data) => {
    ViewCrmmutate(data, {
      onSuccess: (data) => {
        // Setting cookies for user details
        Cookies.set("role", data.urole, {
          domain: myglobalData.URL,
          path: "/",
          expires: 365,
        });
        Cookies.set("type", data.utype, {
          domain: myglobalData.URL,
          path: "/",
          expires: 365,
        });
        Cookies.set("username", data.username, {
          domain: myglobalData.URL,
          path: "/",
          expires: 365,
        });
        Cookies.set("previous_user", data.previous_user_id, {
          domain: myglobalData.URL,
          path: "/",
          expires: 365,
        });
        Cookies.set("module_privilege", data.module_privilege, {
          domain: myglobalData.URL,
          path: "/",
          expires: 365,
        });
        // Triggering loader event after a short delay
        setTimeout(() => {
          dispatch({ event: "loader" });
        }, 50);
      },
    });
  };

  const handleCheckboxChange = (moduleName, action) => {
    // If "Master Access" is selected, toggle all modules and actions
    if (moduleName === "Master Access") {
      setSelectAllModule(!selectAllModule);

      // Update module access based on the "Master Access" state
      const updatedModuleAccess = selectAllModule
        ? []
        : [
            "Leads View",
            "Leads Add",
            "Leads Edit",
            "Leads Quick Edit",
            "Leads Call",
            "Leads Whatsapp",
            "Leads Email",
            "Leads Delete",
            "Leads Assign",
            "Leads Import",
            "Leads Export",
            "All Broker View",
            "All Broker Add",
            "All Broker Edit",
            "All Broker Call",
            "All Broker Whatsapp",
            "All Broker Delete",
            "All Broker Assign",
            "All Broker Import",
            "All Broker Export",
            "Loan View",
            "Loan Add",
            "Loan Edit",
            "Loan Call",
            "Loan Whatsapp",
            "Loan Delete",
            "Loan Assign",
            "Loan Import",
            "Loan Export",
            "Human Resource View",
            "Human Resource Add",
            "Human Resource Edit",
            "Human Resource Quick Edit",
            "Human Resource Call",
            "Human Resource Whatsapp",
            "Human Resource Email",
            "Human Resource Delete",
            "Human Resource Assign",
            "Human Resource Import",
            "Human Resource Export",
            "Users View",
            "Users Add",
            "Users Edit",
            "Users View CRM",
            "Users View Location",
            "Users View Statistics",
            "Dynamic Fields View",
            "Dynamic Fields Add",
            "Dynamic Fields Edit",
            "Dynamic Fields Delete",
            "Change Password Edit",
          ];
      setModuleAccess(updatedModuleAccess);

      // Update the checkAllAction for all modules
      setCheckAllAction({});
      return;
    }

    // Handle "Check All" option for each module
    if (action === "Check All") {
      setCheckAllAction((prevCheckAllAction) => {
        const newState = !prevCheckAllAction[moduleName];
        const updatedState = { ...prevCheckAllAction, [moduleName]: newState };

        // Update module access based on the "Check All" state
        const allActionsForModule = getActionsForModule(moduleName); // Helper function to get relevant actions for the module
        const updatedModuleAccess = moduleAccess.filter(
          (access) => !access.startsWith(moduleName + " ")
        );
        if (newState) {
          updatedModuleAccess.push(
            ...allActionsForModule.map((action) => `${moduleName} ${action}`)
          );
        }

        setModuleAccess(updatedModuleAccess);
        return updatedState;
      });
    } else {
      // Handle individual action
      setModuleAccess((prevSelectedRows) => {
        const isSelected = prevSelectedRows.includes(moduleName + " " + action);
        if (isSelected) {
          if (action === "View") {
            const countModules = prevSelectedRows.reduce((count, item) => {
              if (count > 1) {
                return count;
              }
              if (item.includes(moduleName)) {
                return count + 1;
              }
              return count;
            }, 0);
            if (countModules > 1) {
              // alert(`Please uncheck all module of ${moduleName}`);
              return [...prevSelectedRows];
            }
          }
          return prevSelectedRows.filter(
            (id) => id !== moduleName + " " + action
          );
        } else if (prevSelectedRows.includes(moduleName + " " + "View")) {
          return [...prevSelectedRows, moduleName + " " + action];
        } else {
          return [
            ...prevSelectedRows,
            moduleName + " " + action,
            moduleName + " " + "View",
          ];
        }
      });
      // Update the checkAllAction for the module
      setCheckAllAction((prevCheckAllAction) => {
        return { ...prevCheckAllAction, [moduleName]: false };
      });
    }
  };
  // Helper function to get relevant actions for the module
  const getActionsForModule = (moduleName) => {
    switch (moduleName) {
      case "Leads":
        return [
          "View",
          "Add",
          "Edit",
          "Quick Edit",
          "Call",
          "Whatsapp",
          "Email",
          "Delete",
          "Assign",
          "Import",
          "Export",
        ];
      case "All Broker":
        return [
          "View",
          "Add",
          "Edit",
          "Call",
          "Whatsapp",
          "Delete",
          "Import",
          "Export",
        ];
      case "Loan":
        return [
          "View",
          "Add",
          "Edit",
          "Call",
          "Whatsapp",
          "Delete",
          "Import",
          "Export",
        ];
      case "Human Resource":
        return [
          "View",
          "Add",
          "Edit",
          "Quick Edit",
          "Call",
          "Whatsapp",
          "Email",
          "Delete",
          "Assign",
          "Import",
          "Export",
        ];
      case "Users":
        return [
          "View",
          "Add",
          "Edit",
          "View CRM",
          "View Location",
          "View Statistics",
        ];
      case "Dynamic Fields":
        return ["View", "Add", "Edit", "Delete"];
      case "Change Password":
        return ["Edit"];
      default:
        return [];
    }
  };

  // Event handler for opening location modal
  const handleLocationFun = (data) => {
    MutateLastLocation(data, {
      onSuccess: (data) => {
        setUserLocation(data.data[0]);
        setLocationModal(true);
      },
    });
    // setLocationModal(true);
  };

  const handleStatisticsFun = (data) => {
    dispatch({
      event: "store_new_data",
      data: JSON.stringify(data),
    });
    // Delayed navigation to the user analyst page after updating global user data
    setTimeout(() => {
      dispatch({ event: "userstatistics" });
    }, 100);
  };

  // Render component with breadcrumb, small data table, and modals
  return (
    <>
      {/* Breadcrumb component for page navigation */}
      <Breadcrumb PageName="CRM Analyst" />
      <Card className="mt-3">
        <Card.Body>
          <Card.Title>All User's</Card.Title>
          <Divider />
          {/* Display success message if available */}
          {showSuccessMessage && (
            <Alert severity="info">{showSuccessMessage}</Alert>
          )}
          {/* Render small data table with user details */}
          {!AllUsers.isLoading && (
            <SmallDataTable
              columns={CRMAnalystColumns}
              data={AllUsers.data.data}
              handleViewCRM={handleViewCRMFun}
              handleEdit={handleEditFun}
              handleLocationBtn={handleLocationFun}
              handleStatistics={handleStatisticsFun}
              actionModulePrevilege={UserActionPrevilege}
            />
          )}
        </Card.Body>
      </Card>
      {/* Custom modal for updating user details */}
      <CustomModal
        ModalSize={initialValues.urole !== "Master" && "xl"}
        show={showModal}
        onHide={() => setShowModal(false)}
        ModalTitle="Update User Details"
        ModalBody={
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={HandleSubmit}
          >
            <Form>
              <Row>
                <Col md={initialValues.urole !== "Master" ? 6 : 12}>
                  <h3 className="custom-form-label">
                    Username <span className="required-label">*</span>
                  </h3>
                  <CustomInputField
                    type="text"
                    name="username"
                    placeholder="Enter Username"
                  />
                </Col>
                <Col
                  md={initialValues.urole !== "Master" ? 6 : 12}
                  className="mt-0"
                >
                  <h3 className="custom-form-label">Password</h3>
                  <CustomInputField
                    type="text"
                    name="password"
                    placeholder="Enter Password"
                  />
                  <small>
                    * Note: Leave this field blank if you don't want to change
                    the password
                  </small>
                </Col>
                <Col md={initialValues.urole !== "Master" ? 6 : 12}>
                  <h3 className="custom-form-label">
                    UserRole <span className="required-label"></span>
                  </h3>
                  <CustomInputField
                    as="select" // Change input type to a dropdown
                    name="urole"
                    placeholder="Select Role"
                  >
                    <option value="">Select Role</option>
                    <option value="Team Leader">Team Leader</option>
                    <option value="Sales Manager">Sales Manager</option>
                    <option value="Tele Caller">Tele Caller</option>
                    <option value="Admin">Admin</option>
                  </CustomInputField>
                </Col>

                <Col
                  md={initialValues.urole !== "Master" ? 6 : 12}
                  className="mt-0"
                ></Col>

                {initialValues.urole !== "Master" && (
                  <Col>
                    <table className="mt-3 add-user-table">
                      {/* <thead>
                        <tr>
                          <th>Module</th>
                          <th>Access</th>
                        </tr>
                      </thead> */}
                      <tbody>
                        {/* Mapping through module names and rendering checkboxes */}
                        {[
                          "Master Access",
                          "Leads",
                          "All Broker",
                          "Loan",
                          "Human Resource",
                          "Users",
                          "Dynamic Fields",
                          "Change Password",
                        ].map((module, i) => (
                          <tr key={i}>
                            <td style={{ width: "18%" }}>{module}</td>
                            <td style={{ width: "18%" }}>
                              {/* Checkbox for "Master Access" option */}
                              {module === "Master Access" ? (
                                <FormControlLabel
                                  label="Select All"
                                  control={
                                    <Checkbox
                                      checked={selectAllModule}
                                      onChange={() =>
                                        handleCheckboxChange("Master Access")
                                      }
                                    />
                                  }
                                />
                              ) : null}
                              {/* Checkbox for "Check All" option */}
                              {module !== "Master Access" &&
                                module !== "Change Password" && (
                                  <FormControlLabel
                                    label="Full Access"
                                    control={
                                      <Checkbox
                                        checked={
                                          checkAllAction[module] || false
                                        }
                                        onChange={() =>
                                          handleCheckboxChange(
                                            module,
                                            "Check All"
                                          )
                                        }
                                      />
                                    }
                                  />
                                )}
                            </td>
                            <td>
                              {/* Checkboxes for individual actions */}
                              {(module === "Leads"
                                ? [
                                    "View",
                                    "Add",
                                    "Edit",
                                    "Quick Edit",
                                    "Call",
                                    "Whatsapp",
                                    "Email",
                                    "Delete",
                                    "Assign",
                                    "Import",
                                    "Export",
                                  ]
                                : module === "All Broker"
                                ? [
                                    "View",
                                    "Add",
                                    "Edit",
                                    "Call",
                                    "Whatsapp",
                                    "Delete",
                                    "Import",
                                    "Export",
                                  ]
                                : module === "Loan"
                                ? [
                                    "View",
                                    "Add",
                                    "Edit",
                                    "Call",
                                    "Whatsapp",
                                    "Delete",
                                    "Import",
                                    "Export",
                                  ]
                                : module === "Human Resource"
                                ? [
                                    "View",
                                    "Add",
                                    "Edit",
                                    "Quick Edit",
                                    "Call",
                                    "Whatsapp",
                                    "Email",
                                    "Delete",
                                    "Assign",
                                    "Import",
                                    "Export",
                                  ]
                                : module === "Users"
                                ? [
                                    "View",
                                    "Add",
                                    "Edit",
                                    "View CRM",
                                    "View Location",
                                    "View Statistics",
                                  ]
                                : module === "Dynamic Fields"
                                ? ["View", "Add", "Edit", "Delete"]
                                : module === "Change Password"
                                ? ["Edit"]
                                : []
                              ).map((action, index) => (
                                <FormControlLabel
                                  style={{
                                    width: "25%",
                                    marginLeft: 0,
                                    marginRight: 0,
                                  }}
                                  key={index}
                                  label={action}
                                  control={
                                    <Checkbox
                                      checked={moduleAccess.includes(
                                        module + " " + action
                                      )}
                                      onChange={() =>
                                        handleCheckboxChange(module, action)
                                      }
                                    />
                                  }
                                />
                              ))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Col>
                )}
                {/* Submit button for updating user details */}
                <div className="text-left mt-3">
                  <LoadingButton
                    variant="contained"
                    type="submit"
                    loading={isLoading}
                  >
                    Update User
                  </LoadingButton>
                </div>
              </Row>
            </Form>
          </Formik>
        }
      />
      {/* Location modal (commented out for now) */}
      <CustomModal
        show={LocationModal}
        onHide={() => setLocationModal(false)}
        showHeader={false}
        ModalSize={"lg"}
        ModalBody={
          <div>
            <div className="d-flex align-items-center justify-content-between">
              <CustomHeading
                Heading="Last Location of user"
                style={{
                  paddingBottom: "1rem",
                  fontSize: "1.1rem",
                  borderBottom: "1px solid #e2e5ec",
                }}
              />
              {/* <CloseIcon onClick={() => setLocationModal(false)} /> */}
            </div>
            <div
              style={{
                boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
              }}
            >
              <MapComponent selectedLocation={userLocation} />
            </div>
          </div>
        }
      />
    </>
  );
};

// Exporting the UsersAnalyst component as the default export
export default UsersAnalyst;
