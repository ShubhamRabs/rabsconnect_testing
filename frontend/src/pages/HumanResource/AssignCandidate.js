import React from "react";
import { Formik, Form } from "formik";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { useBootstrap, useMui, useSetting } from "../../hooks/Hooks";
import {
  CustomFormGroup,
  CustomSelectField,
} from "../../components/FormUtility/FormUtility";
import { getAllUsers } from "../../hooks/Users/useAllUsersHook";
import { useQuery } from "react-query";
import { CreateLabelValueArray, groupBy } from "../../hooks/Function";
import { GetAllCandidatesStatus } from "../../hooks/DynamicFields/UseCandidatesStatusHook";
import CryptoJS from "crypto-js";
import { useAssignCandidate } from "../../hooks/HumanResources/UseCandidateHook";
import { useQueryClient } from "react-query";

// Define the AssignCandidateFrom functional component
const AssignCandidateFrom = ({ dispatch }) => {
  const { Card, Row } = useBootstrap();
  const { Divider, LoadingButton, ArrowBackIosIcon } = useMui();
  const { globalData } = useSetting();

  // Retrieve user data from local storage and decrypt it
  let CryptoJSKey = globalData.CompanyName + "@" + globalData.Version;
  const bytes = CryptoJS.AES.decrypt(
    localStorage.getItem("updateglobal_userdata"),
    CryptoJSKey
  );
  var user_data = bytes.toString(CryptoJS.enc.Utf8);

  // Initial form values
  let initialValues = {
    user: "",
    c_status: "",
    c_id: JSON.parse(user_data),
  };

  // Initialize the React Query client
  const queryClient = useQueryClient();

  // State to store grouped users by role
  const [allUserArr, setAllUserArr] = React.useState([]);

  // Query to fetch all users
  const AllUsers = useQuery("all_users", getAllUsers, {
    onSuccess: (data) => {
      // Group users by role and update state
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

  // Query to fetch candidate status options
  const CandidatesStatusDropDown = useQuery("CandidatesStatusDropDown", () => {
    return GetAllCandidatesStatus(["candidate_status"]);
  });

  // Mutation hook for assigning a candidate
  const { mutate, isLoading } = useAssignCandidate();

  // Form submission handler
  const HandleSubmit = (values) => {
    mutate(values, {
      onSuccess: (data) => {
        // Update success message in local storage
        localStorage.setItem("successMessage", data.data);
        // Invalidate the "SubMenuCandidateCount" query
        queryClient.invalidateQueries("SubMenuCandidateCount");
        // Dispatch an event based on the previous screen
        dispatch({
          event:
            localStorage.getItem("previousScreen") ===
            localStorage.getItem("currScreen")
              ? "allcandidate"
              : localStorage.getItem("previousScreen"),
        });
      },
    });
  };

  return (
    <>
      {/* Breadcrumb component */}
      <Breadcrumb
        PageName="Assign Candidate"
        BackButton={[
          true,
          "Back",
          <ArrowBackIosIcon />,
          () =>
            dispatch({
              event:
                localStorage.getItem("previousScreen") ===
                localStorage.getItem("currScreen")
                  ? "allcandidate"
                  : localStorage.getItem("previousScreen"),
            }),
        ]}
      />
      {/* Card component for the form */}
      <Card className="mt-3">
        <Card.Body>
          <Card.Title style={{ fontSize: "18px" }}>
            Assign Selected Candidate To User
          </Card.Title>
          {/* Divider component */}
          <Divider />
          {/* Formik component for form handling */}
          <Formik
            initialValues={initialValues}
            // validationSchema={AssignLeadFormSchema}
            onSubmit={HandleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form className="mt-3">
                <Row>
                  {/* CustomFormGroup for selecting a user */}
                  <CustomFormGroup
                    formlabel="Users"
                    star="*"
                    FormField={
                      <CustomSelectField
                        name="user"
                        isLabelValue={true}
                        FieldValue={setFieldValue}
                        placeholder="Select assign user"
                        options={allUserArr["HR"]}
                      />
                    }
                  />
                  {/* CustomFormGroup for selecting candidate status */}
                  <CustomFormGroup
                    formlabel="Candidate Status"
                    star="*"
                    FormField={
                      <CustomSelectField
                        name="c_status"
                        placeholder="Select Candidate Status"
                        FieldValue={setFieldValue}
                        isLabelValue={true}
                        options={CreateLabelValueArray(
                          CandidatesStatusDropDown?.data,
                          "candidate_status"
                        )}
                      />
                    }
                  />
                  {/* LoadingButton component for form submission */}
                  <div>
                    <LoadingButton
                      type="submit"
                      loading={isLoading}
                      variant="contained"
                    >
                      Assign Candidate
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

// Export the AssignCandidateFrom component
export default AssignCandidateFrom;