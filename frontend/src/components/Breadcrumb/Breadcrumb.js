import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import { useBootstrap, useMui } from "../../hooks/Hooks";
import Cookies from "js-cookie";
import "./Breadcrumb.css";
import { getDispatchDashboard } from "../../hooks/Function";
/* Date :- 25-09-2023 
    Author name :- shubham sonkar
   Define a functional component named Breadcrumb that takes props as input
  */
const Breadcrumb = (props) => {
  /* Date :- 25-09-2023 
    Author name :- shubham sonkar
   Destructure Material-UI components from custom hooks
  */
  const { Button, Typography } = useMui();
  /* Date :- 25-09-2023 
    Author name :- shubham sonkar
   Destructure Bootstrap components from custom hooks
  */
  const { Row, Col } = useBootstrap();

  const handleHomeIcon = () => {
    let getDispatch = getDispatchDashboard();
    localStorage.setItem("sidebarScroll",0);
    getDispatch({event: "dashboard"});
  }

  let ActionPrevilege;

  if (props.actionModulePrevilege) {
    ActionPrevilege = {
      Add: props.actionModulePrevilege?.hasOwnProperty("Add")
        ? props.actionModulePrevilege["Add"]
        : Cookies.get("role") === "Master",

      Delete: props.actionModulePrevilege?.hasOwnProperty("Delete")
        ? props.actionModulePrevilege["Delete"]
        : Cookies.get("role") === "Master",

      Assign: props?.actionModulePrevilege?.hasOwnProperty("Assign")
        ? props.actionModulePrevilege["Assign"]
        : Cookies.get("role") === "Master",

      Import: props.actionModulePrevilege?.hasOwnProperty("Import")
        ? props.actionModulePrevilege["Import"]
        : Cookies.get("role") === "Master",

      Export: props.actionModulePrevilege?.hasOwnProperty("Export")
        ? props.actionModulePrevilege["Export"]
        : Cookies.get("role") === "Master",
    };
  }

  return (
    /* Date :- 25-09-2023 
    Author name :- shubham sonkar
   Create a Bootstrap Row to structure the breadcrumb UI
  */
    <Row className="align-items-center">
      {/* Date :- 25-09-2023 
      Author name :- shubham sonkar 
     First Column: Displays the page name and a home icon */}
      <Col xs={12} md={3}>
        {/* Date :- 25-09-2023 
      Author name :- shubham sonkar 
     Display the page name with a home icon and a separator */}
        <Typography variant="h6" className="hometext">
          <HomeIcon onClick={handleHomeIcon} sx={{cursor: "pointer"}} />
          <span className="separator">/</span>
          {/* Date :- 25-09-2023 
          Author name :- shubham sonkar 
          Display the page name from props */}
          {props.PageName}
        </Typography>
        <Typography variant="h2" className="page-title">
          {props.PageName}
        </Typography>
      </Col>
      <Col
        xs={12}
        md={9}
        style={{ textAlign: "right" }}
        className="breadcrumb-btn-group"
      >
        {props.BackButton && props.BackButton[0] === true ? (
          <Button
            variant="contained"
            startIcon={props.BackButton[2]}
            onClick={props.BackButton[3]}
            className="mx-2"
            aria-label="small button"
          >
            {props.BackButton[1]}
          </Button>
        ) : null}
        {/* {Cookies.get("role") === "Master" || Cookies.get("role") === "Admin" ? (
          <> */}
        {props.AddButton && props.AddButton[0] === true ? (
          <Button
            variant="contained"
            startIcon={props.AddButton[2]}
            onClick={props.AddButton[3]}
            className="mx-2"
          >
            {props.AddButton[1]}
          </Button>
        ) : null}
        {/* </>
        ) : null} */}
        {Cookies.get("role") === "Master" || Cookies.get("role") === "Admin" ||
        (props.actionModulePrevilege &&
          ActionPrevilege.Delete) ? (
          <>
            {localStorage.getItem("currScreen") !== "userlead" ? (
              <>
                {props.DeleteAll && props.DeleteAll[0] === true ? (
                  <Button
                    variant="contained"
                    startIcon={props.DeleteAll[3]}
                    onClick={props.DeleteAll[2]}
                    className="mx-2"
                    disabled={props.DeleteAll[4]}
                  >
                    {props.DeleteAll[1]}
                  </Button>
                ) : null}
              </>
            ) : null}
          </>
        ) : null}
        {props.ImportLeads && props.ImportLeads[0] === true ? (
          <Button
            variant="contained"
            startIcon={props.ImportLeads[3]}
            onClick={props.ImportLeads[2]}
            className="mx-2"
          >
            {props.ImportLeads[1]}
          </Button>
        ) : null}
        {props.AssignButton && props.AssignButton[0] === true ? (
          <Button
            variant="contained"
            startIcon={props.AssignButton[3]}
            onClick={props.AssignButton[2]}
            disabled={props.AssignButton[4]}
            className="mx-2"
          >
            {props.AssignButton[1]}
          </Button>
        ) : null}
        {Cookies.get("role") === "Master" || Cookies.get("role") === "Admin" || (props.actionModulePrevilege &&
          ActionPrevilege.Export)
          ? props.AddMoreBtn
          : null}
        {props.otherBtn}
      </Col>
    </Row>
  );
};

export default Breadcrumb;
