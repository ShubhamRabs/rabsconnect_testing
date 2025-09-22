import * as Yup from "yup";

export const LeadFormSchema = Yup.object().shape({
  source_type: Yup.string().typeError().required(),
  source: Yup.string()
    .typeError("You must select a source")
    .when("source_type", {
      is: "Direct",
      then: (schema) => schema.required("Source is required"),
    }),
  brk_id: Yup.number()
    .typeError("You must select a broker")
    .when("source_type", {
      is: "Broker",
      then: (schema) => schema.required("Broker is required"),
    }),
  ref_name: Yup.string()
    .typeError("You must specify a string")
    .when("source_type", {
      is: "Reference",
      then: (schema) => schema.required("Reference Name is required"),
    }),

  ref_email: Yup.string().when("source_type", {
    is: "Reference",
    then: (schema) => schema.required("Reference Email is required"),
  }),
  // lemail: Yup.string()
  //   .email("Invalid email")
  //   .test("contains-at", "Email must contain '@'", (value) =>
  //     value ? value.includes("@") : false
  //   ),
  lname: Yup.string().required("Lead Name is required"),
  min_area: Yup.number()
    .positive()
    .lessThan(Yup.ref("max_area"), "Min area cannot be greater than max area.")
    .integer(),
  max_area: Yup.number()
    .positive()
    .moreThan(Yup.ref("min_area"), "Max area cannot be lower than min area.")
    .integer(),
  area_unit: Yup.string().when(["min_area", "max_area"], {
    is: (min_area, max_area) =>
      min_area !== 0 &&
      max_area !== undefined &&
      max_area !== 0 &&
      min_area !== undefined,
    then: (schema) => schema.required("Area Unit is required"),
  }),
  min_price: Yup.number()
    .positive()
    .lessThan(
      Yup.ref("max_price"),
      "Min Price cannot be greater than max price."
    )
    .integer(),
  max_price: Yup.number()
    .positive()
    .moreThan(Yup.ref("min_price"), "Max Price cannot be lower than min price.")
    .integer(),
  price_unit: Yup.string().when(["min_price", "max_price"], {
    is: (min_price, max_price) =>
      min_price !== 0 &&
      max_price !== undefined &&
      max_price !== 0 &&
      min_price !== undefined,
    then: (schema) => schema.required("Price Unit is required"),
  }),
});
