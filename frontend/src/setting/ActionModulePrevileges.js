import Cookies from "js-cookie"; 

export const getActionPrevilege = (module) => {
  let ActionPrevilege = {
    View:
      Cookies.get("role") === "Master" ||
      Cookies.get("module_privilege").includes(`${module} View`),

    Add:
      Cookies.get("role") === "Master" ||
      Cookies.get("module_privilege").includes(`${module} Add`),

    Edit:
      Cookies.get("role") === "Master" ||
      Cookies.get("module_privilege").includes(`${module} Edit`),

    "Quick Edit":
      Cookies.get("role") === "Master" ||
      Cookies.get("module_privilege").includes(`${module} Quick Edit`),

    Call:
      Cookies.get("role") === "Master" ||
      Cookies.get("module_privilege").includes(`${module} Call`),

    WhatsApp:
      Cookies.get("role") === "Master" ||
      Cookies.get("module_privilege").includes(`${module} Whatsapp`),

    Email:
      Cookies.get("role") === "Master" ||
      Cookies.get("module_privilege").includes(`${module} Email`),

    Delete:
      Cookies.get("role") === "Master" ||
      Cookies.get("module_privilege").includes(`${module} Delete`),

    Assign:
      Cookies.get("role") === "Master" ||
      Cookies.get("module_privilege").includes(`${module} Assign`),

    Import:
      Cookies.get("role") === "Master" ||
      Cookies.get("module_privilege").includes(`${module} Import`),

    Export:
      Cookies.get("role") === "Master" ||
      Cookies.get("module_privilege").includes(`${module} Export`),

    "View Crm":
      Cookies.get("role") === "Master" ||
      Cookies.get("module_privilege").includes(`${module} View CRM`),
    
    "View Location": Cookies.get("role") === "Master" ||
      Cookies.get("module_privilege").includes(`${module} View Location`),
      
    "View Statistics": Cookies.get("role") === "Master" ||
    Cookies.get("module_privilege").includes(`${module} View Statistics`),  
  };
  return ActionPrevilege;
}; 