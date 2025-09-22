import React from "react";
import "./Common.css";

export const CustomHeading = (props) => {
  return (
    <h3 className="custom-heading text-capitalize" {...props}>
      {props.Heading}
    </h3>
  );
};

export const CustomDescriptionWithViewMore = (props) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const maxLength = 319;

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="align-items-center">
      <p className="custom-description" {...props}>
        {props.description.length > maxLength ? (
          <>
            {isExpanded
              ? props.description
              : props.description.substring(0, maxLength) + "..."}
          </>
        ) : (
          props.description
        )}
      </p>
      {props.description.length > maxLength && (
        <span
          onClick={handleToggle}
          className="custom-description"
          style={{ color: "#333", cursor: "pointer" }}
        >
          <b>{isExpanded ? " View Less" : " View More"}</b>
        </span>
      )}
    </div>
  );
};

export default CustomDescriptionWithViewMore;

export const CustomSubTitle = (props) => {
  return <h6 className="custom-subtitle fw-500">{props.SubTitle}</h6>;
};

export const CustomDescription = ({ startIcon, Description, ...props }) => {
  return (
    <p className="custom-description" {...props}>
      {startIcon && <span className="start-icon">{startIcon}</span>}
      <span className="description-text" title={Description}>
        {Description}
      </span>
    </p>
  );
};


export const ApiCusomDescription = (props) => {
  return (
    // <h3 className="apidetaildescription" {...props}>
    //    {props.ApiDetailDescription1 } <span className="apidetailhighlightdescription">{props.ApihighlightDescription }</span> {props.ApiDetailDescription2 }
    // </h3>
    <h4 className="apidetaildescription" style={props.styleProps}>
      {props.ApiDetailDescription1}
      <span className="apidetailhighlightdescription" style={props.styleProps}>
        {props.ApihighlightDescription}
      </span>
      {props.ApiDetailDescription2}
    </h4>
  );
};

export const CusomHighLightDescription = (props) => {
  return (
    // <h3 className="apidetaildescription" {...props}>
    //    {props.ApiDetailDescription1 } <span className="apidetailhighlightdescription">{props.ApihighlightDescription }</span> {props.ApiDetailDescription2 }
    // </h3>
    <h4 className="apidetaildescription" style={props.styleProps}>
      {props.ApiDetailDescription1}
      <span className="apidetailhighlightdescription" style={props.styleProps}>
        {props.ApihighlightDescription}
      </span>
      {props.ApiDetailDescription2}
    </h4>
  );
};
