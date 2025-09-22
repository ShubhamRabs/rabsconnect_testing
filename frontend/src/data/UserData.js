import Cookies from "js-cookie";

export let UserRole = [
  {
    value: "Tele Caller",
    label: "Tele Caller",
  },
];

if (
  Cookies.get("role").includes("Admin") ||
  Cookies.get("role").includes("Master") ||
  Cookies.get("role").includes("Branch Admin")
) {
  UserRole.push(
    ...[
      {
        value: "Branch Admin",
        label: "Branch Admin",
      },
      {
        value: "Team Leader",
        label: "Team Leader",
      },
      {
        value: "Sales Manager",
        label: "Sales Manager",
      },
    ]
  );
} else if (Cookies.get("role").includes("Team Leader")) {
  UserRole.push(
    ...[
      {
        value: "Sales Manager",
        label: "Sales Manager",
      },
    ]
  );
}
