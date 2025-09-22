// Importing necessary dependencies and styles
import React from "react";
import "./Loader.css";

// React functional component named Loader
const Loader = ({ dispatch }) => {
  // useEffect hook to dispatch an event after a delay (simulating a loading animation)
  React.useEffect(() => {
    // Set a timeout to dispatch the "dashboard" event after 2000 milliseconds (2 seconds)
    setTimeout(() => {
      dispatch({ event: "dashboard" });
    }, 2000);
  });

  // Render the loader component with a circular loading animation
  return (
    <div className="loader-body">
      <div className="circle"></div>
    </div>
  );
};

// Exporting the Loader component as the default export
export default Loader;
