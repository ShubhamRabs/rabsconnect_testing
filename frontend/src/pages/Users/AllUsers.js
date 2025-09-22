// Importing necessary dependencies and components from React and other files
import React from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { useBootstrap, useMui } from "../../hooks/Hooks";
import { useQuery } from "react-query";
import { getAllUsers } from "../../hooks/Users/useAllUsersHook";
import { groupBy } from "../../hooks/Function";
import CountCard from "../../components/CountCard/CountCard";

// React functional component named AllUsers
const AllUsers = ({ dispatch }) => {
  // Destructuring utility functions and components from custom hooks and libraries
  const { Row, Col } = useBootstrap();
  const { Alert } = useMui();

  // State variable to store grouped user data based on roles
  const [allUsersData, setAllUsers] = React.useState([]);

  // Query for fetching all users and grouping them by role
  const GroupUsersWithRole = useQuery(
    "GroupUsersWithRole",
    () => {
      return getAllUsers();
    },
    {
      // On successful query execution, group the users by role and set the state
      onSuccess: (data) => {
        setAllUsers(
          groupBy(
            data?.data?.map((users) => ({
              label: users.username,
              urole: users.urole,
            })),
            "urole"
          )
        );
      },
    }
  );

  // Render component with breadcrumb, count cards, and alert message
  return (
    <>
      {/* Breadcrumb component for page navigation */}
      <Breadcrumb PageName="All Users" />
      {/* Row component for organizing content in a grid */}
      <Row>
        {/* Check if user data is loaded */}
        {!allUsersData.isLoading
          ? // If loaded, map over the grouped user data and render CountCard for each role
            Object.entries(allUsersData).map(([arrayKey, arrayValue]) => {
              return (
                <Col xs={12} md={3} key={arrayKey} className="my-3">
                  {/* CountCard component displaying user count for a specific role */}
                  <CountCard
                    Loading={GroupUsersWithRole.isLoading}
                    SourceImg={arrayKey.charAt(0)}
                    SourceName={arrayKey}
                    LeadCount={arrayValue.length}
                    cardRole="usercard"
                    // Event handler for clicking on a CountCard
                    onClick={() => {
                      dispatch({
                        event: "updateglobal_userdata",
                        data: arrayKey,
                      });
                      // Delayed navigation to the user analyst page after updating global user data
                      setTimeout(() => {
                        dispatch({ event: "useranalyst" });
                      }, 600);
                    }}
                  />
                </Col>
              );
            })
          : // If user data is not loaded, display placeholder CountCard components
            [1, 2, 3, 4, 5, 6].map((id) => {
              return (
                <Col xs={12} md={3} sm={4} key={id} className="mb-4">
                  {/* Placeholder CountCard component for loading state */}
                  <CountCard Loading={GroupUsersWithRole.isLoading} />
                </Col>
              );
            })}
        {/* Display an info alert if there are no assigned users */}
        {GroupUsersWithRole.data?.data?.length === 0 && (
          <Alert severity="info">No User has been assigned</Alert>
        )}
      </Row>
    </>
  );
};

// Exporting the AllUsers component as the default export
export default AllUsers;
