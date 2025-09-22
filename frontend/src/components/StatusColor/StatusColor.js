import React, { useState, useEffect } from "react";
import CheckIcon from "@mui/icons-material/Check";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import "./StatusColor.css";
import { GetAllLeadStatus } from "../../hooks/DynamicFields/UseLeadStatusHook";
import { useQuery } from "react-query";
import { useMui } from "../../hooks/Hooks";

// StatusColor component for selecting lead status colors
export default function StatusColor({ sendDataToParent, defaultColor }) {
  const [selected, setSelected] = useState(null);
  const [colors, setColors] = React.useState([]);
  const { CheckIcon } = useMui();

  // Fetch all lead status colors using a React Query hook
  const AllLeadStatus = useQuery(
    "AllLeadStatusColor",
    () => {
      return GetAllLeadStatus();
    },
    {
      onSuccess: (data) => {
        // Extract colors from lead status data and set in the component state
        data.map((status) => {
          setColors((arr) => [...arr, status.color]);
        });
      },
    }
  );

  // Function to toggle selected color and send it to the parent component
  const toggle = (color) => {
    setSelected(color);
    sendDataToParent(color);
  };

  // useEffect to select defaultColor when fetched
  useEffect(() => {
    if (colors.includes(defaultColor)) {
      setSelected(defaultColor);
    }
  }, [defaultColor, colors]);

  return (
    <>
      {/* Map through the predefined colors and render color buttons */}
      {data.map((color, id) =>
        // Check if the color is part of the fetched lead status colors
        colors.includes(color.color_code) === true ? (
          // Render a disabled button for existing colors
          <button
            key={id}
            type="button"
            className="status-color-card"
            style={{
              pointerEvents: "none",
              cursor: "none",
              background: color.color_code,
              opacity: color.color_code === defaultColor ? 0.8 : 0.3,
            }}
          >
            {color.color_code === defaultColor ? <CheckIcon sx={{ color: "white" }} /> :
              <NotInterestedIcon sx={{ color: "red" }} />
            }
          </button>
        ) : (
          // Render an interactive button for non-existing colors
          <button
            key={id}
            type="button"
            className="status-color-card"
            style={{ background: color.color_code }}
            onClick={() => toggle(color)}
          >
            {selected === color ? <CheckIcon /> : null}
          </button>
        )
      )}
    </>
  );
}
// Predefined list of colors for lead status
const data = [
  {
    color_code: "#006398",
  },
  {
    color_code: "#13a764",
  },
  {
    color_code: "#fdac64",
  },
  {
    color_code: "#f678c3",
  },
  {
    color_code: "#fa4e64",
  },
  {
    color_code: "#43516c",
  },
  {
    color_code: "#3d7a44",
  },
  {
    color_code: "#c47933",
  },
  {
    color_code: "#ab408b",
  },
  {
    color_code: "#ab4040",
  },
  {
    color_code: "#333333",
  },
  {
    color_code: "darkblue",
  },
  {
    color_code: "yellow",
  },
  {
    color_code: "orange",
  },
  {
    color_code: "purple",
  },
];
