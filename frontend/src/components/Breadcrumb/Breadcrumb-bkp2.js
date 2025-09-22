import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import { useBootstrap, useMui } from "../../hooks/Hooks";
import Cookies from "js-cookie";
import "./Breadcrumb.css";
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
          <HomeIcon />
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
      <Col xs={12} md={9} style={{ textAlign: "right" }}>
        {props.BackButton && props.BackButton[0] === true ? (
          <Button
            variant="contained"
            startIcon={props.BackButton[2]}
            onClick={props.BackButton[3]}
            className="mx-2"
          >
            {props.BackButton[1]}
          </Button>
        ) : null}
        {Cookies.get("role") === "Master" || Cookies.get("role") === "Admin" ? (
          <>
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
          </>
        ) : null}
        {Cookies.get("role") === "Master" || Cookies.get("role") === "Admin" ? (
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
        {Cookies.get("role") === "Master" || Cookies.get("role") === "Admin" ? (
          <>
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
            {Cookies.get("role") === "Master" || Cookies.get("role") === "Admin"
              ? props.AddMoreBtn
              : null}
          </>
        ) : null}
      </Col>
    </Row>
  );
};

export default Breadcrumb;
