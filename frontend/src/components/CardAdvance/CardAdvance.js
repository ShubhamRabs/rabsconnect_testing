import React from "react";
import { useBootstrap, useMui } from "../../hooks/Hooks";
import "./CardAdvance.css";

const CardAdvance = (props) => {
  const { Card, Dropdown } = useBootstrap();
  const { Divider, IconButton, MoreVertOutlinedIcon } = useMui();

  const DropdownMenuItem = ["Over All", "Today", "Last Week", "Last Month"];

  return (
    <Card className="card-advance border-0">
      <Card.Header className="bg-white border-0 p-3 d-flex justify-content-between">
        <Card.Title style={{ margin: 0, color: "#5d596c" }}>
          <h5 className="m-0 me-2">{props.title}</h5>
          <small className="text-muted">{props.desc}</small>
        </Card.Title>
        {props.fliterDropdown && (
          <Dropdown>
            <Dropdown.Toggle id="dropdown-basic" className="crad-dropdown-btn">
              <IconButton size="small">
                <MoreVertOutlinedIcon />
              </IconButton>
            </Dropdown.Toggle>

            <Dropdown.Menu className="crad-dropdown-menu">
              {DropdownMenuItem.map((item) => (
                <Dropdown.Item
                  onClick={() => {
                    props.filterData(item);
                  }}
                  key={item}
                >
                  {item}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        )}
        {/*  */}
      </Card.Header>
      <Divider />
      <Card.Body style={{ padding: "0 1.5rem" }}>{props.children}</Card.Body>
    </Card>
  );
};

export default CardAdvance;
