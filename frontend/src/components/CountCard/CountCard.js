import React from "react";
import { useMui } from "../../hooks/Hooks";
import "./CountCard.css";

export default function CountCard(props) {
  const { Card, CardContent, Divider, Skeleton, Box } = useMui();

  const renderContent = () => {
    if (props.Loading) {
      return (
        <>
          <Skeleton
            className="loading-sravatar"
            animation="wave"
            variant="circular"
          />
          <span style={{ float: "right", marginTop: "-30px" }}>
            <Skeleton
              animation="wave"
              height={25}
              width={100}
              style={{ marginBottom: 6 }}
            />
            <Skeleton
              animation="wave"
              height={25}
              width="40%"
              style={{ marginBottom: 6, float: "right" }}
            />
          </span>
        </>
      );
    }

    return (
      <>
        {props.cardRole === "usercard" ? (
          <button
            className="sravatar"
            style={{ background: props.SourceColor }}
          >
            {props.SourceImg}
          </button>
        ) : props.cardRole === "leadcount" ? (
          <Box className={`icon-box${props.index} icon-box`}>
            {props.SourceImg}
          </Box>
        ) : (
          <img
            src={props.SourceImg}
            alt={props.SourceName}
            className="srcimg"
          />
        )}

        <span>
          <span className="srcname" style={{ float: "right" }}>
            {props.SourceName}
          </span>

          <div
            className={
              props.UserCount !== undefined
                ? "d-flex justify-content-between align-items-center mt-2"
                : null
            }
          >
            <span className="text-center">
              {props.UserCount !== undefined && (
                <small className="srcname">Master</small>
              )}
              <h4
                className={
                  props.UserCount !== undefined
                    ? "srccount text-center"
                    : props.cardRole === "leadcount"
                    ? "srccount mb-0"
                    : "srccount"
                }
              >
                {props.LeadCount}
              </h4>
            </span>
            {props.UserCount !== undefined && (
              <span>
                <small className="srcname">User</small>
                <h4 className="srccount text-center">{props.UserCount}</h4>
              </span>
            )}
          </div>
        </span>

        {props.cardRole === "usercard" &&
          props.Percent !== "" &&
          props.Description !== "" && (
            <>
              <Divider className="bxdivider" />
              <div className="srcpercent">
                <span style={{ color: "green", fontWeight: "500" }}>
                  {props.Percent}
                </span>
                <div style={{ width: "100%", textAlign: "right" }}>
                  {props.Description}
                </div>
              </div>
            </>
          )}
      </>
    );
  };

  return (
    <Card className="source-card" onClick={props.onClick}>
      <CardContent
        style={{ paddingBottom: "16px" }}
        className={
          props.cardRole === "leadcount"
            ? "d-flex align-items-center justify-content-between"
            : ""
        }
      >
        {renderContent()}
      </CardContent>
    </Card>
  );
}
