import dayjs from "dayjs";
import * as Yup from "yup";

export const LeadSchedulerFormSchema = Yup.object().shape({
  schedule_type: Yup.string().required("Schedule Type is required"),
  user_role: Yup.string().required("User Role is required"),
  branch_admin_id: Yup.string().when("user_role", {
    is: "Branch Admin",
    then: (schema) => schema.required("Branch Admin is required"),
  }),
  // user_id: Yup.string().when("user_role", {
  //   is: (userRole) => userRole === "Tele Caller" || userRole === "Team Leader" || userRole === "Sales Manager",
  //   then: (schema) => schema.when("schedule_type", {
  //     is: "Round Robin Scheduler",
  //     then: (schema) => Yup.array().min(1, "Please select at least one User").required("Username is required"),
  //     otherwise: (schema) => schema.required("Username is required"),
  //   }),
  // }),
  team_leader_id: Yup.string().when("user_role", {
    is: "Team Leader",
    then: (schema) =>
      schema.when("schedule_type", {
        is: "Round Robin Scheduler",
        then: (schema) =>
          Yup.array()
            .min(1, "Please select at least one Team Leader")
            .required("Team Leader is required"),
        otherwise: (schema) => schema.required("Team Leader is required"),
      }),
  }),
  sales_manager_id: Yup.string().when("user_role", {
    is: "Sales Manager",
    then: (schema) =>
      schema.when("schedule_type", {
        is: "Round Robin Scheduler",
        then: (schema) =>
          Yup.array()
            .min(1, "Please select at least one Sales Manager")
            .required("Sales Manager is required"),
        otherwise: (schema) => schema.required("Sales Manager is required"),
      }),
  }),
  // sales_manager_id: Yup.string().when("user_role", {
  //   is: "Sales Manager",
  //   then: (schema) => schema.required("Sales Manager is required"),
  // }),
  tele_caller_id: Yup.string().when("user_role", {
    is: "Tele Caller",
    then: (schema) =>
      schema.when("schedule_type", {
        is: "Round Robin Scheduler",
        then: (schema) =>
          Yup.array()
            .min(1, "Please select at least one Tele Caller")
            .required("Tele Caller is required"),
        otherwise: (schema) => schema.required("Tele Caller is required"),
      }),
  }),
  ldate_from: Yup.date(),
  ldate_to: Yup.string().when('ldate_from', (ldate_from, schema) => {
    if (!ldate_from[0]) {
      return schema;
    }
    return ldate_from && schema.test('Lead Date To', 'Lead Date To must be greater than Lead Date From', function(value) {
      return dayjs(value).isAfter(ldate_from);
    }).required('Lead Date To is required');
  }),
  source: Yup.array(),
  service_type: Yup.array(),
  pname: Yup.array(),
  city: Yup.array(),
  locality: Yup.array(),

  // input1Validation: Yup.string().when(["source", "service_type", "pname", "city", "locality"], {
  //   is: (source, service_type, pname, city, locality) =>
  //     !source && !service_type && !pname && !city && !locality, // None of the inputs are valid
  //   then: Yup.string().required("At least one input is required"), // Validate if none of the inputs are valid
  //   otherwise: Yup.string()
  // }),
  input1Validation: Yup.string().when(
    ["source", "service_type", "pname", "city", "locality", "ldate_from"],
    {
      is: (source, service_type, pname, city, locality, ldate_from) => {
        if (
          (Array.isArray(source) && source.length > 0) ||
          (Array.isArray(service_type) && service_type.length > 0) ||
          (Array.isArray(pname) && pname.length > 0) ||
          (Array.isArray(city) && city.length > 0) ||
          (Array.isArray(locality) && locality.length > 0) ||
          (dayjs(ldate_from).isValid() && ldate_from !== undefined)
        ) {
          return false;
        }
        return true;
      },
      then: (schema) =>
        schema.required(
          "At Least one input must be selected from Lead DateFrom, source, Service Type, Project Name, City, Locality"
        ),
      // otherwise: Yup.string().notRequired()
    }
  ),
  // no_of_leads: Yup.string().when("schedule_type", {
  //   is: "Round Robin Scheduler",
  //   then: (schema) => schema.required("Number of leads is required"),
  // }),
  status: Yup.string().required("Status is required"),
});
