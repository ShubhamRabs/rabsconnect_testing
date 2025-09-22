// Importing necessary dependencies and components from React and custom hooks
import React, { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { useQuery } from "react-query";
import { Formik, Form } from "formik";
import { useBootstrap, useMui } from "../../hooks/Hooks";
import { getAllUsers } from "../../hooks/Users/useAllUsersHook";
import { GetAllCRMDetails } from "../../hooks/Other/UseCRMDetailsHook";
import { CreateLabelValueArray, groupBy } from "../../hooks/Function";
import { AddUserSchema } from "../../schema/Users/AddUserSchema";
import {
  CustomFormGroup,
  CustomInputField,
  CustomSelectField,
} from "../../components/FormUtility/FormUtility";
import { useAddUser } from "../../hooks/Users/UseUserHook";
import "./../../assets/css/Users.css";

// The main AddUsers component
const AddUsers = () => {
  // Destructuring components and functions from custom hooks and libraries
  const { LoadingButton, Divider, Alert, FormControlLabel, Checkbox } =
    useMui();
  const { Row, Card } = useBootstrap();

  // State variables for managing success message, module access, and errors
  const [showSuccessMessage, setShowSuccessMessage] = useState(null); // New state for success message
  const [moduleAccess, setModuleAccess] = useState([]);
  const [error, setError] = useState(null);

  const [checkAllAction, setCheckAllAction] = useState({});
  const [selectAllModule, setSelectAllModule] = useState(false);

  // Initial form values
  const initialValues = {
    username: "",
    password: "",
    user_type: "",
    user_role: "",
    branch_location: "",
    branch_admin_id: "",
    team_leader_id: "",
    sales_manager_id: "",
  };

  // State variables for tracking the number of users in different roles
  const [noOfAdmin, setNoOfAdmin] = useState(0);
  const [noOfBranchAdmin, setNoOfBranchAdmin] = useState(0);
  const [noOfTeamLeader, setNoOfTeamLeader] = useState(0);
  const [noOfSalesManager, setNoOfSalesManager] = useState(0);
  const [noOfTeleCaller, setNoOfTeleCaller] = useState(0);
  const [noOfHrHead, setNoOfHrHead] = useState(0);
  const [noOfHr, setNoOfHr] = useState(0);
  // State variable for grouping users based on their roles
  const [groupByUsersCreated, setGroupByUsersCreated] = useState([]);
  // Queries to fetch data using custom hooks
  const AllUser = useQuery("AllUser", getAllUsers, {
    onSuccess: (data) => {
      // Grouping users based on their roles
      setGroupByUsersCreated(
        groupBy(
          data?.data.map((users) => ({
            label: users.username,
            value: users.id,
            urole: users.urole,
            branch_id: users.branch_id,
            tl_id: users.tl_id,
            sm_id: users.sm_id,
          })),
          "urole"
        )
      );
    },
  });

  const AllCRMDetails = useQuery("AllCRMDetails", GetAllCRMDetails, {
    onSuccess: (data) => {
      // Setting the number of users for each role based on CRM details
      setNoOfAdmin(data.data[0].admin === "Yes" ? data.data[0].no_of_admin : 0);
      setNoOfBranchAdmin(
        data.data[0].branch === "Yes" ? data.data[0].no_of_branch : 0
      );
      setNoOfTeamLeader(
        data.data[0].team_leader === "Yes" ? data.data[0].no_of_tl : 0
      );
      setNoOfSalesManager(
        data.data[0].sales_manager === "Yes" ? data.data[0].no_of_sm : 0
      );
      setNoOfTeleCaller(
        data.data[0].tele_caller === "Yes" ? data.data[0].no_of_tc : 0
      );
      setNoOfHrHead(
        data.data[0].hr_head === "Yes" ? data.data[0].no_of_hr_head : 0
      );
      setNoOfHr(data.data[0].hr === "Yes" ? data.data[0].no_of_hr : 0);
    },
  });
  // Arrays defining user roles
  const AdminUserRole = [
    { label: "Admin", value: "Admin" },
    { label: "Branch Admin", value: "Branch Admin" },
  ];

  const EmployeeUserRole = [
    { label: "Team Leader", value: "Team Leader" },
    { label: "Sales Manager", value: "Sales Manager" },
    { label: "Tele Caller", value: "Tele Caller" },
    { label: "HR Head", value: "HR Head" },
    { label: "HR", value: "HR" },
  ];
  // Calculating disabled user roles based on the number of users
  const dAdmin =
    noOfAdmin -
      (groupByUsersCreated["Admin"]
        ? groupByUsersCreated["Admin"].length
        : 0) <=
    0
      ? "Admin"
      : null;
  const dBranchAdmin =
    noOfBranchAdmin -
      (groupByUsersCreated["Branch Admin"]
        ? groupByUsersCreated["Branch Admin"].length
        : 0) <=
    0
      ? "Branch Admin"
      : null;
  const dTeamLeader =
    noOfTeamLeader -
      (groupByUsersCreated["Team Leader"]
        ? groupByUsersCreated["Team Leader"].length
        : 0) <=
    0
      ? "Team Leader"
      : null;
  const dSalesManger =
    noOfSalesManager -
      (groupByUsersCreated["Sales Manager"]
        ? groupByUsersCreated["Sales Manager"].length
        : 0) <=
    0
      ? "Sales Manager"
      : null;
  const dTeleCaller =
    noOfTeleCaller -
      (groupByUsersCreated["Tele Caller"]
        ? groupByUsersCreated["Tele Caller"].length
        : 0) <=
    0
      ? "Tele Caller"
      : null;
  const dHRHead =
    noOfHrHead -
      (groupByUsersCreated["HR Head"]
        ? groupByUsersCreated["HR Head"].length
        : 0) <=
    0
      ? "HR Head"
      : null;
  const dHR =
    noOfHr -
      (groupByUsersCreated["HR"] ? groupByUsersCreated["HR"].length : 0) <=
    0
      ? "HR"
      : null;
  // Array of disabled user roles
  const DisabledUserRole = [
    dAdmin,
    dBranchAdmin,
    dTeamLeader,
    dSalesManger,
    dTeleCaller,
    dHRHead,
    dHR,
  ];
  
  
  // Function to handle checkbox changes for module access
  const handleCheckboxChange = (moduleName, action) => {
    // If "Master Access" is selected, toggle all modules and actions
    if (moduleName === "Master Access") {
      setSelectAllModule(!selectAllModule);

      // Update module access based on the "Master Access" state
      const allActions = ["View", "Add", "Edit", "Quick Edit", "Call", "Whatsapp", "Email", "Delete", "Assign", "Import", "Export", "View CRM"];
      const updatedModuleAccess = selectAllModule ? [] : allActions.flatMap(action => ["Leads", "All Broker", "Loan", "Human Resource", "Users", "Dynamic Fields", "Change Password"].map(module => `${module} ${action}`));
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
        const allActions = ["View", "Add", "Edit", "Quick Edit", "Call", "Whatsapp", "Email", "Delete", "Assign", "Import", "Export", "View CRM"];
        const updatedModuleAccess = moduleAccess.filter(access => !access.startsWith(moduleName + " "));
        if (newState) {
          updatedModuleAccess.push(...allActions.map(action => `${moduleName} ${action}`));
        }

        setModuleAccess(updatedModuleAccess);
        return updatedState;
      });
    } else {
      // Handle individual action
      setModuleAccess((prevSelectedRows) => {
        const isSelected = prevSelectedRows.includes(moduleName + " " + action);
        if (isSelected) {
          return prevSelectedRows.filter((id) => id !== moduleName + " " + action);
        } else {
          return [...prevSelectedRows, moduleName + " " + action];
        }
      });
      
      // Update the checkAllAction for the module
      setCheckAllAction((prevCheckAllAction) => {
        return { ...prevCheckAllAction, [moduleName]: false };
      });
    }
  };
  
  // Custom hook for adding a user
  const { mutate, isLoading } = useAddUser();
  // Function to handle form submission
  const HandleAddSubmit = (values, { resetForm }) => {
    setError(null);
    if (moduleAccess.length !== 0) {
      // If module access is selected, call the add user mutation
      let data = [values, moduleAccess];
      mutate(data, {
        onSuccess: (data) => {
          // On success, refetch user and CRM details, reset form, and display success message
          AllUser.refetch();
          AllCRMDetails.refetch();
          resetForm();
          setShowSuccessMessage(data);
          setTimeout(() => {
            setShowSuccessMessage(null);
            // Reset checkbox states after form is submitted
            setModuleAccess([]);
            setCheckAllAction({});
            setSelectAllModule(false);
          }, 3000);
        },
      });
    } else {
      setError("Please Selecet the Module for User");
    }
  };
  // Rendering JSX
  return (
    <>
      {/* Breadcrumb component */}
      <Breadcrumb PageName="Add User" />
      {/* Bootstrap Card component */}
      <Card>
        <Card.Body>
          <Card.Title>
            {/* Displaying available user creation options */}
            <span style={{ fontSize: "16px" }}>You can create,</span>
            <br />
            <span style={{ fontSize: "16px" }}>
              {/* Displaying the remaining number of users that can be created */}
              {/* (similar display for other roles) */}
              {noOfAdmin -
                (groupByUsersCreated["Admin"]
                  ? groupByUsersCreated["Admin"].length
                  : 0) >
              0
                ? noOfAdmin -
                  (groupByUsersCreated["Admin"]
                    ? groupByUsersCreated["Admin"].length
                    : 0) +
                  " Admin, "
                : null}
              {noOfBranchAdmin -
                (groupByUsersCreated["Branch Admin"]
                  ? groupByUsersCreated["Branch Admin"].length
                  : 0) >
              0
                ? noOfBranchAdmin -
                  (groupByUsersCreated["Branch Admin"]
                    ? groupByUsersCreated["Branch Admin"].length
                    : 0) +
                  " Branch Admin, "
                : null}
              {noOfTeamLeader -
                (groupByUsersCreated["Team Leader"]
                  ? groupByUsersCreated["Team Leader"].length
                  : 0) >
              0
                ? noOfTeamLeader -
                  (groupByUsersCreated["Team Leader"]
                    ? groupByUsersCreated["Team Leader"].length
                    : 0) +
                  " Team Leader, "
                : null}
              {noOfSalesManager -
                (groupByUsersCreated["Sales Manager"]
                  ? groupByUsersCreated["Sales Manager"].length
                  : 0) >
              0
                ? noOfSalesManager -
                  (groupByUsersCreated["Sales Manager"]
                    ? groupByUsersCreated["Sales Manager"].length
                    : 0) +
                  " Sales Manager, "
                : null}
              {noOfTeleCaller -
                (groupByUsersCreated["Tele Caller"]
                  ? groupByUsersCreated["Tele Caller"].length
                  : 0) >
              0
                ? noOfTeleCaller -
                  (groupByUsersCreated["Tele Caller"]
                    ? groupByUsersCreated["Tele Caller"].length
                    : 0) +
                  " Tele Caller, "
                : null}
              {noOfHrHead -
                (groupByUsersCreated["HR Head"]
                  ? groupByUsersCreated["HR Head"].length
                  : 0) >
              0
                ? noOfHrHead -
                  (groupByUsersCreated["HR Head"]
                    ? groupByUsersCreated["HR Head"].length
                    : 0) +
                  " HR Head, "
                : null}
              {noOfHr -
                (groupByUsersCreated["HR"]
                  ? groupByUsersCreated["HR"].length
                  : 0) >
              0
                ? noOfHr -
                  (groupByUsersCreated["HR"]
                    ? groupByUsersCreated["HR"].length
                    : 0) +
                  " HR, "
                : null}
            </span>
            <span className="user-create-details">
              {/* Displaying total user limit and total user count */}
              Total User Limit:- {AllCRMDetails.data?.data[0].total_users},
              &nbsp; Total User Created:- {AllUser.data?.data.length}
            </span>
          </Card.Title>
          {/* Divider component */}
          <Divider />
          {/* Displaying success message if exists */}
          {showSuccessMessage && (
            <Alert severity="info">{showSuccessMessage}</Alert>
          )}
          {/* Formik form for adding a user */}
          <Formik
            initialValues={initialValues}
            validationSchema={AddUserSchema}
            onSubmit={HandleAddSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form>
                {/* Form fields */}
                <Row className="mt-3">
                  {/* Custom form components for various fields */}
                  <CustomFormGroup
                    formlabel="username"
                    star="*"
                    FormField={
                      <CustomInputField
                        type="text"
                        name="username"
                        placeholder="Enter username"
                      />
                    }
                  />
                  <CustomFormGroup
                    formlabel="password"
                    star="*"
                    FormField={
                      <CustomInputField
                        type="password"
                        name="password"
                        placeholder="Enter password"
                      />
                    }
                  />
                  <CustomFormGroup
                    formlabel="User Type"
                    star="*"
                    FormField={
                      <CustomSelectField
                        name="user_type"
                        isLabelValue={true}
                        FieldValue={setFieldValue}
                        placeholder="Select a User Type"
                        options={[
                          { label: "Admin", value: "Admin" },
                          { label: "Employee", value: "Employee" },
                        ]}
                      />
                    }
                  />
                  <CustomFormGroup
                    formlabel="User Role"
                    star="*"
                    FormField={
                      <CustomSelectField
                        name="user_role"
                        isLabelValue={true}
                        FieldValue={setFieldValue}
                        placeholder="Select a User Role"
                        options={
                          values.user_type === "Admin"
                            ? AdminUserRole
                            : values.user_type === "Employee"
                            ? EmployeeUserRole
                            : null
                        }
                        disabledOptions={DisabledUserRole}
                      />
                    }
                  />
                  {values.user_role === "Branch Admin" ? (
                    <CustomFormGroup
                      formlabel="Branch Location"
                      star="*"
                      FormField={
                        <CustomSelectField
                          name="branch_location"
                          FieldValue={setFieldValue}
                          placeholder="Select a User Location"
                          options={["Mumbai", "Pune", "Goa"]}
                        />
                      }
                    />
                  ) : null}
                  {values.user_role === "Tele Caller" ||
                  values.user_role === "Sales Manager" ||
                  values.user_role === "Team Leader" ? (
                    <>
                      {groupByUsersCreated["Branch Admin"] &&
                      groupByUsersCreated["Branch Admin"].length > 0 ? (
                        <CustomFormGroup
                          formlabel="Branch Admin"
                          star="*"
                          FormField={
                            <CustomSelectField
                              name="branch_admin_id"
                              isLabelValue={true}
                              FieldValue={(name, value) =>
                                setFieldValue(name, value)
                              }
                              placeholder="Select a Branch Admin"
                              options={groupByUsersCreated["Branch Admin"]}
                            />
                          }
                        />
                      ) : null}
                      {groupByUsersCreated["Team Leader"] &&
                      groupByUsersCreated["Team Leader"].length > 0 &&
                      values.user_role !== "Team Leader" ? (
                        <CustomFormGroup
                          formlabel="Team Leader"
                          star="*"
                          FormField={
                            <CustomSelectField
                              name="team_leader_id"
                              isLabelValue={true}
                              FieldValue={(name, value) =>
                                setFieldValue(name, value)
                              }
                              placeholder="Select a Team Leader"
                              options={CreateLabelValueArray(
                                groupByUsersCreated["Team Leader"],
                                "label",
                                "value"
                              )}
                            />
                          }
                        />
                      ) : null}
                      {groupByUsersCreated["Sales Manager"] &&
                      groupByUsersCreated["Sales Manager"].length > 0 &&
                      values.user_role !== "Sales Manager" &&
                      values.user_role !== "Team Leader" ? (
                        <CustomFormGroup
                          formlabel="Sales Manager"
                          star="*"
                          FormField={
                            <CustomSelectField
                              name="sales_manager_id"
                              isLabelValue={true}
                              FieldValue={(name, value) =>
                                setFieldValue(name, value)
                              }
                              placeholder="Select a Sales Manager"
                              options={CreateLabelValueArray(
                                groupByUsersCreated["Sales Manager"],
                                "label",
                                "value"
                              )}
                            />
                          }
                        />
                      ) : null}
                    </>
                  ) : null}
                  {/* Displaying module access checkboxes in a table */}
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
                        "Change Password"
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
                                  onChange={() => handleCheckboxChange("Master Access")}
                                />
                              }
                            />
                            ): null}
                            {/* Checkbox for "Check All" option */}
                            {module !== "Master Access" && module !== "Change Password" && (
                              <FormControlLabel
                                label="Full Access"
                                control={
                                  <Checkbox
                                    checked={checkAllAction[module] || false}
                                    onChange={() => handleCheckboxChange(module, "Check All")}
                                  />
                                }
                              />
                            )}
                          </td>
                          <td>
                            {/* Checkboxes for individual actions */}
                            {(module==="Leads" ? ["View","Add","Edit","Quick Edit","Call","Whatsapp","Email","Delete","Assign","Import","Export"] : module==="All Broker" ? ["View","Add","Edit","Call","Whatsapp","Delete","Import","Export"] : module==="Loan" ? ["View","Add","Edit","Call","Whatsapp","Delete","Import","Export"] : module==="Human Resource" ? ["View","Add","Edit","Quick Edit","Call","Whatsapp","Email","Delete","Assign","Import","Export"] : module==="Users" ? ["View","Add","Edit","View CRM"] : module==="Dynamic Fields" ? ["View","Add","Edit","Delete",] : module==="Change Password" ? ["Edit"] : []).map((action, index) => (
                              <FormControlLabel
                                style={{ width: "20%" }}
                                key={index}
                                label={action}
                                control={
                                  <Checkbox
                                    checked={moduleAccess.includes(module + " " + action)}
                                    onChange={() => handleCheckboxChange(module, action)}
                                  />
                                }
                              />
                            ))}
                          </td>
                        </tr>
                      ))}

                    </tbody>
                  </table>
                  {/* Displaying error message if exists */}
                  {error ? <span className="error">{error}</span> : null}
                  {/* LoadingButton for submitting the form */}
                  <div className="mt-3">
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      loading={isLoading}
                    >
                      Add User
                    </LoadingButton>
                  </div>
                </Row>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </>
  );
};

export default AddUsers;
