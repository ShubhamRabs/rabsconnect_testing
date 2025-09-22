import * as Yup from "yup";
import { getAllUsers } from "../../hooks/Users/useAllUsersHook";

export const AddUserSchema = Yup.object().shape({
  username: Yup.string()
    .test(
      "no-leading-trailing-spaces",
      "Spaces and underscores are not allowed at the beginning or the end",
      (value) => {
        return !value.startsWith(" ");
        //  && !value.endsWith("_");
      }
    )
    .required("Username is required")
    .test(
      "username-exists",
      "Username already exists please try another username",
      async function (value) {
        try {
          const AllUser = await getAllUsers();
          if (AllUser.data?.length > 0) {
            let users = AllUser?.data;
            return !users.some(
              (user) => user.username.toLowerCase() === value.toLowerCase()
            );
          }
        } catch (error) {
          console.error("Error checking username:", error);
          return true; // Assume username exists if there's an error
        }
      }
    ),

  password: Yup.string().required("Password is required"),
  user_type: Yup.string().required("User Type is required"),
  user_role: Yup.string().typeError("").required("User Type is required"),
  // team_leader_id: Yup.string().typeError().when("user_role", {
  //   is: ["Sales Manager", "Tele Caller"],
  //   then: (schema) => schema.required("Team Leader is required"),
  // })
  // team_leader_id: Yup.string().when("user_role", {
  //   is: (value) => ["Sales Manager", "Tele Caller"].includes(value),
  //   then: (schema) => schema.required("Team Leader is required"),
  // }),

  // branch_location: Yup.string()
  //   .typeError()
  //   .when("user_role", {
  //     is: "Branch Admin",
  //     then: (schema) => schema.required("Branch Location is required"),
  //   }),
  // branch_admin_id: Yup.string()
  //   .typeError()
  //   .when(["user_role"], {
  //     is: (userRole) => {
  //       return (
  //         userRole === "Team Leader" ||
  //         userRole === "Sales Manager" ||
  //         userRole === "Tele Caller"
  //       );
  //     },
  //     then: (schema) => schema.required("Branch Admin is required"),
  //   }),
  // team_leader_id: Yup.string()
  //   .typeError()
  //   .when(["user_role"], {
  //     is: (userRole) => {
  //       return userRole === "Sales Manager" || userRole === "Tele Caller";
  //     },
  //     then: (schema) => schema.required("Team Leader is required"),
  //   }),
  // sales_manager_id: Yup.string()
  //   .typeError()
  //   .when(["user_role"], {
  //     is: (userRole) => {
  //       return userRole === "Tele Caller";
  //     },
  //     then: (schema) => schema.required("Sales Manager is required"),
  //   }),
});
