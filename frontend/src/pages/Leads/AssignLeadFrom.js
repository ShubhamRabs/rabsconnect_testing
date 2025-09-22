// Import necessary modules and components from React and other libraries
import React from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { useBootstrap, useMui, useSetting } from "../../hooks/Hooks";
import { Formik, Form } from "formik";
import { AssignLeadFormSchema } from "../../schema/Leads/AssignLeadFormSchema";
import {
  CustomFormGroup,
  CustomSelectField,
  CustomMultipleSelectField,
} from "../../components/FormUtility/FormUtility";
import { UserRole } from "../../data/UserData";
import { useQuery } from "react-query";
import { getAllUsers } from "../../hooks/Users/useAllUsersHook";
import { CreateLabelValueArray, groupBy } from "./../../hooks/Function";
import { GetAllLeadStatus } from "./../../hooks/DynamicFields/UseLeadStatusHook";
import {
  useSetDeleteAndAssignLead,
  useSetKeepAndAssignLead,
} from "../../hooks/Leads/UseLeadsHook";
import { useQueryClient } from "react-query";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";

// Define the AssignLeadFrom functional component
const AssignLeadFrom = ({ dispatch }) => {
  // Destructure Bootstrap, Material-UI, and custom hooks
  const { Card, Row } = useBootstrap();
  const { Divider, LoadingButton, ArrowBackIosIcon } = useMui();
  const { globalData } = useSetting();

  // State variables
  const [allUserArr, setAllUserArr] = React.useState([]);
  const [clickedButtonValue, setClickedButtonValue] = React.useState(null);

  const queryClient = useQueryClient();

  // React Query hook for fetching all users
  const AllUsers = useQuery("all_users", getAllUsers, {
    onSuccess: (data) => {
      setAllUserArr(
        groupBy(
          data.data.map((users) => ({
            label: users.username,
            value: users.id,
            urole: users.urole,
          })),
          "urole"
        )
      );
    },
  });

  // React Query hook for fetching all lead statuses
  const LeadStatusList = useQuery("AllLeadStatus", () => {
    return GetAllLeadStatus(["status"]);
  });

  // Decrypt user data from localStorage
  let CryptoJSKey = globalData.CompanyName + "@" + globalData.Version;
  const bytes = CryptoJS.AES.decrypt(
    localStorage.getItem("updateglobal_userdata"),
    CryptoJSKey
  );
  var user_data = bytes.toString(CryptoJS.enc.Utf8);



  // Initial form values
  let initialValues = {
    urole: "",
    users: [],
    lstatus: "",
    lid: JSON.parse(user_data),
  };

  console.log(initialValues, "initialValuesASSSIGN FORM");

  const dBranchAdmin =
    (allUserArr["Branch Admin"] ? allUserArr["Branch Admin"].length : 0) <= 0
      ? "Branch Admin"
      : null;
  const dTeamLeader =
    (allUserArr["Team Leader"] ? allUserArr["Team Leader"].length : 0) <= 0
      ? "Team Leader"
      : null;
  const dSalesManger =
    (allUserArr["Sales Manager"] ? allUserArr["Sales Manager"].length : 0) <= 0
      ? "Sales Manager"
      : null;
  const dTeleCaller =
    (allUserArr["Tele Caller"] ? allUserArr["Tele Caller"].length : 0) <= 0
      ? "Tele Caller"
      : null;
  // Array of disabled user roles
  const DisabledUserRole = [
    dBranchAdmin,
    dTeamLeader,
    dSalesManger,
    dTeleCaller,
  ];

  // Custom hooks for handling lead assignment mutations
  const { mutate: DeleteAndAssignMutate, isLoading: DeleteAndAssignisLoading } =
    useSetDeleteAndAssignLead();

  const { mutate: KeepAndAssignMutate, isLoading: KeepAndAssignisLoading } =
    useSetKeepAndAssignLead();

  // Handle form submission
  const HandleSubmit = (values) => {
    if (clickedButtonValue === "delete_assign") {
      // Mutate for Delete & Assign operation
      DeleteAndAssignMutate(values, {
        onSuccess: (data) => {
          localStorage.setItem("successMessage", data.data);
          // Dispatch an event based on the previous screen
          dispatch({
            event:
              localStorage.getItem("previousScreen") ===
              localStorage.getItem("currScreen")
                ? "totalleads"
                : localStorage.getItem("previousScreen"),
          });
        },
      });
    } else {
      // Mutate for Keep & Assign operation
      KeepAndAssignMutate(values, {
        onSuccess: (data) => {
          localStorage.setItem("successMessage", data.data);
          // Dispatch an event based on the previous screen
          dispatch({
            event:
              localStorage.getItem("previousScreen") ===
              localStorage.getItem("currScreen")
                ? "totalleads"
                : localStorage.getItem("previousScreen"),
          });
        },
      });
    }
    // Invalidate and refetch related queries
    queryClient.invalidateQueries("SubMenuLeadCount");
  };

  // Conditional rendering of Delete & Assign button
  let DeleteAssignBtn;
  if (localStorage.getItem("previousScreen") !== "userlead") {
    DeleteAssignBtn = true;
  } else {
    DeleteAssignBtn = true;
  }

  // Render the component
  return (
    <>
      {/* Breadcrumb component for navigation */}
      <Breadcrumb
        PageName="Assign Lead"
        BackButton={[
          true,
          "Back",
          <ArrowBackIosIcon />,
          () =>
            dispatch({
              event:
                localStorage.getItem("previousScreen") ===
                localStorage.getItem("currScreen")
                  ? "totalleads"
                  : localStorage.getItem("previousScreen"),
            }),
        ]}
      />
      {/* Card component for organizing content */}
      <Card className="mt-3">
        <Card.Body>
          {/* Card Title for assigning lead to a user */}
          <Card.Title style={{ fontSize: "18px" }}>
            Assign Selected Lead To User
          </Card.Title>
          {/* Divider for visual separation */}
          <Divider />
          {/* Formik wrapper for managing form state */}
          <Formik
            initialValues={initialValues}
            validationSchema={AssignLeadFormSchema}
            onSubmit={HandleSubmit}
          >
            {({ values, setFieldValue }) => (
              // Form component for handling form submissions
              <Form className="mt-3">
                {/* Row for form fields */}
                <Row>
                  {/* Form group for selecting user role */}
                  <CustomFormGroup
                    formlabel="User Role"
                    star="*"
                    FormField={
                      <CustomSelectField
                        name="urole"
                        isLabelValue={true}
                        FieldValue={setFieldValue}
                        placeholder="Select a User Role to Assign"
                        options={UserRole}
                        disabledOptions={DisabledUserRole}
                      />
                    }
                  />
                  {/* Conditional rendering of user selection based on user role */}
                  {!AllUsers.isLoading ? (
                    values.urole !== "" &&
                    values.urole !== null &&
                    values.urole !== undefined ? (
                      <CustomFormGroup
                        formlabel={values.urole}
                        star="*"
                        FormField={
                          <CustomMultipleSelectField
                            name="users"
                            placeholder="Select assign user"
                            options={
                              allUserArr[values.urole] === undefined
                                ? []
                                : allUserArr[values.urole]
                            }
                            isLabelValue={true}
                            FieldValue={setFieldValue}
                            values={values}
                          />
                        }
                      />
                    ) : null
                  ) : null}
                  {/* Form group for selecting lead status */}
                  <CustomFormGroup
                    formlabel="Lead Status"
                    star=""
                    FormField={
                      <CustomSelectField
                        name="lstatus"
                        isLabelValue={true}
                        FieldValue={setFieldValue}
                        placeholder="Select a Lead Status"
                        options={CreateLabelValueArray(
                          LeadStatusList.data,
                          "status"
                        )}
                      />
                    }
                  />
                  {/* Buttons for Delete & Assign and Keep & Assign operations */}
                  <div className="my-2 d-flex align-center justify-content-between">
                    {DeleteAssignBtn ? (
                      <>
                        {Cookies.get("role") === "Master" ||
                        Cookies.get("role") === "Admin" ? (
                          <LoadingButton
                            type="submit"
                            variant="contained"
                            loading={DeleteAndAssignisLoading}
                            onClick={() =>
                              setClickedButtonValue("delete_assign")
                            }
                          >
                            Transfer
                          </LoadingButton>
                        ) : null}
                      </>
                    ) : null}
                    <LoadingButton
                      type="submit"
                      loading={KeepAndAssignisLoading}
                      variant="contained"
                      onClick={() => setClickedButtonValue("keep_assign")}
                    >
                      Clone
                    </LoadingButton>
                    ;
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

// Export the AssignLeadFrom component
export default AssignLeadFrom;
