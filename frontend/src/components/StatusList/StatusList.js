import React from "react";
import { useMui } from "../../hooks/Hooks";
import "./StatusList.css";

// StatusList component for displaying lead status information
const StatusList = (props) => {
  // Destructuring MUI components from the custom hook
  const { ListItem, ListItemAvatar, Box, ListItemText } = useMui();

  return (
    <ListItem className="lead-status-list-item" sx={{ px: 0 }}>
      {/* Display a colored box representing the lead status */}
      <ListItemAvatar>
        <Box
          sx={{
            width: "35px",
            height: "35px",
            borderRadius: "2px",
            opacity: ".8",
            boxShadow: "0 0 2px 0 #ccc",
            backgroundColor: props.StatusColor, // Use the provided status color
            "&:hover": {
              opacity: [0.9, 0.8, 0.7],
            },
          }}
        />
      </ListItemAvatar>
      {/* Display lead status title and count */}
      <ListItemText primary={props.Title} secondary={"Total: " + props.Count} />
    </ListItem>
  );
};

export default StatusList;
