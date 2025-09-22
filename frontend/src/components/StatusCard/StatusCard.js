import React from "react";
import { useBootstrap } from "../../hooks/Hooks";
import "./StatusCard.css";
import Cookies from "js-cookie";

// StatusCard component for displaying status-related information
const StatusCard = (props) => {
  const { Card } = useBootstrap();

  return (
    // Card container with rounded borders and shadow
    <Card className="shadow bg-white rounded border-0 status-card">
      {/* Status bar with dynamic background and text color */}
      <div
        className="text-center py-4 px-3 rounded-top"
        style={{
          background: props.bgcolor,
          color: props.bgcolor === "yellow" ? "#000" : "#fff",
        }}
      >
        <Card.Title>{props.status}</Card.Title>
      </div>
      {/* Card body containing user-related information */}
      <Card.Body>
        <div
          className={
            props.NoUser
              ? "d-flex align-items-center justify-content-between"
              : "d-flex align-items-center justify-content-center"
          }
        >
          {/* Individual user information */}
          <div className="text-center cursor-pointer" onClick={props.SelfClick}>
            <p className="mb-0 counting-text-num">{props.SelfCount}</p>
            <Card.Text className="mb-0 text-muted counting-text">
              {Cookies.get("username")}
            </Card.Text>
          </div>
          {/* Divider and team-related information if applicable */}
          {props.NoUser ? (
            <>
              <span
                style={{
                  width: 1,
                  height: 48,
                  backgroundColor: "#ccc",
                  opacity: 0.5,
                }}
              ></span>
              {/* Team-related information */}
              {props.isHrCandidateStatus &&
                (Cookies.get("role") == "Master" || Cookies.get("role") == "Admin" ||
                  Cookies.get("role") == "HR Head") && (
                  <div className="text-center" onClick={props.TeamClick}>
                    <p className="mb-0 counting-text-num">{props.TeamCount}</p>
                    <Card.Text className="mb-0 text-muted counting-text">
                      Team
                    </Card.Text>
                  </div>
                )}
              {!props.isHrCandidateStatus && (
                <div className="text-center" onClick={props.TeamClick}>
                  <p className="mb-0 counting-text-num">{props.TeamCount}</p>
                  <Card.Text className="mb-0 text-muted counting-text">
                    Team
                  </Card.Text>
                </div>
              )}
            </>
          ) : null}
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatusCard;
