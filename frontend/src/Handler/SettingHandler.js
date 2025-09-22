import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import Axios from "../setting/axios";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { Grip } from "lucide-react";
import { useBootstrap } from "../hooks/Hooks";
import { CircularProgress, Skeleton } from "@mui/material";

// Extracted DraggableItem Component
const DraggableItem = ({ id, children, isDisabled }) => {
  const { Col } = useBootstrap();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    width: "100%",
    margin: "8px 0",
    backgroundColor: isDisabled ? "#e0e0e0" : "#d8d8d8f5",
    border: "1px solid lightgray",
    cursor: isDisabled ? "default" : "move",
    padding: "8px 15px",
    display: "flex",
    boxShadow: "0 0.25rem 1.125rem rgba(75, 70, 92, 0.1)",
    justifyContent: "space-between",
    alignItems: "center",
  };

  return (
    <Col xs={12} md={6}>
      <div
        ref={setNodeRef}
        style={style}
        {...(isDisabled ? {} : { ...listeners, ...attributes })}
      >
        {children}
      </div>
    </Col>
  );
};

const SettingsHandler = ({ apiEndpoint, title, master }) => {
  const { Card, Row } = useBootstrap();
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [localHeaders, setLocalHeaders] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Fetch data from the server using Axios
  const getData = useMemo(
    () => async () => {
      try {
        setLoading(true);
        const masterResponse = await Axios.get(`${apiEndpoint}${master}`);
        const response = await Axios.get(
          `${apiEndpoint}${Cookies.get("u_id")}`
        );

        const masterData = masterResponse.data.master;
        const userHeaders = response.data[Cookies.get("u_id")];

        if (!Array.isArray(masterData)) {
          throw new Error("masterData is not an array");
        }

        const masterMap = new Map(
          masterData.map((header) => [header.accessor, header])
        );

        const visibleHeaders = userHeaders.visible
          .map((accessor) => ({
            ...masterMap.get(accessor),
            visible: true,
          }))
          .filter((header) => header);

        const hiddenHeaders = userHeaders.hidden
          .map((accessor) => ({
            ...masterMap.get(accessor),
            visible: false,
          }))
          .filter((header) => header);

        const combinedHeaders = [...visibleHeaders, ...hiddenHeaders];
        setHeaders(combinedHeaders);
        setLocalHeaders(combinedHeaders);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    },
    [apiEndpoint]
  );

  useEffect(() => {
    getData();
  }, [getData]);

  const handleToggle = (accessor) => {
    const updatedHeaders = localHeaders.map((header) =>
      header.accessor === accessor
        ? { ...header, visible: !header.visible }
        : header
    );
    setLocalHeaders(updatedHeaders);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = localHeaders.findIndex(
      (item) => item.accessor === active.id
    );
    const newIndex = localHeaders.findIndex(
      (item) => item.accessor === over.id
    );

    if (oldIndex === -1 || newIndex === -1) return;

    const updatedHeaders = arrayMove(localHeaders, oldIndex, newIndex);
    setLocalHeaders(updatedHeaders);
  };

  const handleSave = async () => {
    try {
      const visible = localHeaders
        .filter((header) => header.visible)
        .map((header) => header.accessor);
      const hidden = localHeaders
        .filter((header) => !header.visible)
        .map((header) => header.accessor);

      // Start loading
      setLoading(true);

      // Make the API request
      await Axios.put(`${apiEndpoint}/${Cookies.get("u_id")}`, {
        visible,
        hidden,
      });

      // Set success message
      setSuccessMessage("Settings saved successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      // Update headers state with the latest changes
      setHeaders(localHeaders);
    } catch (error) {
      // Set error message in case of failure
      setSuccessMessage("Failed to save settings. Please try again.");
      console.error("Error updating data:", error);

      // Automatically clear error message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } finally {
      // Stop loading
      setLoading(false);
    }
  };

  // const handleSave = async () => {
  //   try {
  //     const visible = localHeaders
  //       .filter((header) => header.visible)
  //       .map((header) => header.accessor);
  //     const hidden = localHeaders
  //       .filter((header) => !header.visible)
  //       .map((header) => header.accessor);

  //     await Axios.put(`${apiEndpoint}/${Cookies.get("u_id")}`, {
  //       visible,
  //       hidden,
  //     });
  //     setSuccessMessage("Settings saved successfully!");

  //     setTimeout(() => {
  //       setSuccessMessage("");
  //     }, 3000);
  //     setHeaders(localHeaders);
  //   } catch (error) {
  //     console.error("Error updating data:", error);
  //   }
  // };

  const visibleItems = useMemo(
    () =>
      localHeaders
        .filter((header) => header.visible)
        .map((headerItem, index) => (
          <DraggableItem key={headerItem.accessor} id={headerItem.accessor}>
            <span
              style={{
                fontWeight: "bold",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {index + 1}.
              <Grip
                size={20}
                color="#333"
                style={{ marginRight: "8px", marginLeft: "8px" }}
              />
              {headerItem.header}
            </span>
            <input
              type="checkbox"
              style={{ cursor: "pointer" }}
              checked={headerItem.visible}
              onChange={() => handleToggle(headerItem.accessor)}
            />
          </DraggableItem>
        )),
    [localHeaders]
  );

  const hiddenItems = useMemo(
    () =>
      localHeaders
        .filter((header) => !header.visible)
        .map((headerItem) => (
          <DraggableItem
            key={headerItem.accessor}
            id={headerItem.accessor}
            isDisabled
          >
            <span
              style={{
                fontWeight: "bold",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {headerItem.header}
            </span>
            <input
              type="checkbox"
              style={{ cursor: "pointer" }}
              checked={headerItem.visible}
              onChange={() => handleToggle(headerItem.accessor)}
            />
          </DraggableItem>
        )),
    [localHeaders]
  );

  return (
    <div>
      {successMessage && (
        <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>
      )}
      <Card.Title
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {title}
        <button
          onClick={handleSave}
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <CircularProgress size={20} color="inherit" />
              Saving...
            </>
          ) : (
            "Save"
          )}
        </button>
      </Card.Title>

      {loading ? (
        <>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="rectangular" width="100%" height={118} />
          <Skeleton
            variant="rectangular"
            width="100%"
            height={60}
            style={{ marginTop: "20px" }}
          />
        </>
      ) : (
        <>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={localHeaders
                .filter((header) => header.visible)
                .map((header) => header.accessor)}
            >
              <Row style={{ marginTop: "20px" }}>{visibleItems}</Row>
            </SortableContext>
          </DndContext>
          <div className="hidden-headers" style={{ marginTop: "20px" }}>
            <Card.Title>Hidden Fields</Card.Title>
            <div style={{ marginTop: "20px" }}>
              <Row>{hiddenItems}</Row>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

SettingsHandler.propTypes = {
  apiEndpoint: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default SettingsHandler;
