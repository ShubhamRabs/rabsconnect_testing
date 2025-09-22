import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Cookies from "js-cookie";
import Axios from "../../setting/axios";
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
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { useBootstrap } from "../../hooks/Hooks";
import "./Settings.css";

// Extracted TabPanel Component
const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`vertical-tabpanel-${index}`}
    aria-labelledby={`vertical-tab-${index}`}
    {...other}
  >
    {value === index && (
      <Box sx={{ p: 5 }}>
        <Typography>{children}</Typography>
      </Box>
    )}
  </div>
);

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

// Helper Function for a11y Props
const a11yProps = (index) => ({
  id: `vertical-tab-${index}`,
  "aria-controls": `vertical-tabpanel-${index}`,
});

// Extracted DraggableItem Component
const DraggableItem = ({ id, children }) => {
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
    backgroundColor: "#d8d8d8f5",
    border: "1px solid lightgray",
    cursor: "move",
    padding: "8px 15px",
    display: "flex",
    boxShadow: "0 0.25rem 1.125rem rgba(75, 70, 92, 0.1)",
    justifyContent: "space-between",
    alignItems: "center",
  };

  return (
    <Col xs={12} md={6}>
      <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
        {children}
      </div>
    </Col>
  );
};

const Settings = () => {
  const [value, setValue] = useState(0);
  const { Card, Row } = useBootstrap();
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Fetch data from the server using Axios
  const getData = useMemo(
    () => async () => {
      try {
        setLoading(true);
        const response = await Axios.get(`/items${Cookies.get("u_id")}`);
        setHeaders(response.data[Cookies.get("u_id")]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    getData();
  }, [getData]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Update data on the server
  const updateData = useMemo(
    () => async (updatedHeaders) => {
      try {
        const response = await Axios.put(`/items/${Cookies.get("u_id")}`, {
          headers: updatedHeaders,
        });
        console.log("Response status:", response.status);
        console.log("Response data:", response.data);
      } catch (error) {
        console.error("Error updating data:", error);
      }
    },
    []
  );

  // Handle drag end event
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = headers.findIndex((item) => item.accessor === active.id);
    const newIndex = headers.findIndex((item) => item.accessor === over.id);

    const updatedHeaders = arrayMove(headers, oldIndex, newIndex);
    setHeaders(updatedHeaders);
    updateData(updatedHeaders);
  };

  // Toggle column visibility
  const handleToggleLead = (accessor) => {
    const updatedHeaders = headers.map((header) =>
      header.accessor === accessor
        ? { ...header, visible: !header.visible }
        : header
    );

    setHeaders(updatedHeaders);
    updateData(updatedHeaders);
  };

  const draggableItems = useMemo(
    () =>
      headers.map((headerItem, index) => (
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
            onChange={() => handleToggleLead(headerItem.accessor)}
          />
        </DraggableItem>
      )),
    [headers, handleToggleLead]
  );

  return (
    <div>
      <Breadcrumb PageName="Settings" />
      <Box sx={{ flexGrow: 1, display: "flex", height: "" }}>
        <Tabs
          className="setting-taps"
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{ "& .MuiTabs-indicator": { display: "none" } }}
        >
          <Tab label="Leads" {...a11yProps(0)} />
          <Tab label="Human Resource" {...a11yProps(1)} />
          <Tab label="Broker" {...a11yProps(2)} />
          <Tab label="Pay Slip" {...a11yProps(3)} />
        </Tabs>
        <TabPanel
          className="setting-tabpanel custom-card"
          value={value}
          index={0}
        >
          <Card.Title>Leads Setting</Card.Title>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={headers.map((header) => header.accessor)}>
                <div className="column-setting">
                  <Row>{draggableItems}</Row>
                </div>
              </SortableContext>
            </DndContext>
          )}
        </TabPanel>
        <TabPanel
          className="setting-tabpanel custom-card"
          value={value}
          index={1}
        >
          <Card.Title>HR Setting</Card.Title>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={headers.map((header) => header.accessor)}>
                <div className="column-setting">
                  {" "}
                  <Row>{draggableItems}</Row>
                </div>
              </SortableContext>
            </DndContext>
          )}
        </TabPanel>
        <TabPanel
          className="setting-tabpanel custom-card"
          value={value}
          index={2}
        >
          <Card.Title>Broker Setting</Card.Title>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={headers.map((header) => header.accessor)}>
                <div className="column-setting">{draggableItems}</div>
              </SortableContext>
            </DndContext>
          )}
        </TabPanel>
        <TabPanel
          className="setting-tabpanel custom-card"
          value={value}
          index={3}
        >
          <Card.Title>PaySlip Setting</Card.Title>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={headers.map((header) => header.accessor)}>
                <div className="column-setting">{draggableItems}</div>
              </SortableContext>
            </DndContext>
          )}
        </TabPanel>
      </Box>
    </div>
  );
};

export default Settings;
// import React, { useState, useEffect, useMemo } from "react";
// import PropTypes from "prop-types";
// import Tabs from "@mui/material/Tabs";
// import Tab from "@mui/material/Tab";
// import Typography from "@mui/material/Typography";
// import Box from "@mui/material/Box";
// import Cookies from "js-cookie";
// import Axios from "../../setting/axios";
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
// } from "@dnd-kit/core";
// import {
//   SortableContext,
//   sortableKeyboardCoordinates,
//   useSortable,
//   arrayMove,
// } from "@dnd-kit/sortable";
// import { Grip } from "lucide-react";
// import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
// import { useBootstrap } from "../../hooks/Hooks";
// import "./Settings.css";

// // Extracted TabPanel Component
// const TabPanel = ({ children, value, index, ...other }) => (
//   <div
//     role="tabpanel"
//     hidden={value !== index}
//     id={`vertical-tabpanel-${index}`}
//     aria-labelledby={`vertical-tab-${index}`}
//     {...other}
//   >
//     {value === index && (
//       <Box sx={{ p: 5 }}>
//         <Typography>{children}</Typography>
//       </Box>
//     )}
//   </div>
// );

// TabPanel.propTypes = {
//   children: PropTypes.node,
//   index: PropTypes.number.isRequired,
//   value: PropTypes.number.isRequired,
// };

// // Helper Function for a11y Props
// const a11yProps = (index) => ({
//   id: `vertical-tab-${index}`,
//   "aria-controls": `vertical-tabpanel-${index}`,
// });

// // Extracted DraggableItem Component
// const DraggableItem = ({ id, children, isDisabled }) => {
//   const { Col } = useBootstrap();
//   const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

//   const style = {
//     transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
//     transition,
//     width: "100%",
//     margin: "8px 0",
//     backgroundColor: isDisabled ? "#e0e0e0" : "#d8d8d8f5",
//     border: "1px solid lightgray",
//     cursor: isDisabled ? "default" : "move",
//     padding: "8px 15px",
//     display: "flex",
//     boxShadow: "0 0.25rem 1.125rem rgba(75, 70, 92, 0.1)",
//     justifyContent: "space-between",
//     alignItems: "center",
//   };

//   return (
//     <Col xs={12} md={6}>
//       <div ref={setNodeRef} style={style} {...(isDisabled ? {} : { ...listeners, ...attributes })}>
//         {children}
//       </div>
//     </Col>
//   );
// };

// const Settings = () => {
//   const [value, setValue] = useState(0);
//   const { Card, Row } = useBootstrap();
//   const [headers, setHeaders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const sensors = useSensors(
//     useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
//     useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
//   );

//   // Fetch data from the server using Axios
//   const getData = useMemo(
//     () => async () => {
//       try {
//         setLoading(true);
//         const masterResponse = await Axios.get("/itemsmaster");
//         const response = await Axios.get(`/items${Cookies.get("u_id")}`);

//         const masterData = masterResponse.data.master;
//         const userHeaders = response.data[Cookies.get("u_id")];

//         if (!Array.isArray(masterData)) {
//           throw new Error("masterData is not an array");
//         }

//         const masterMap = new Map(masterData.map(header => [header.accessor, header]));

//         const visibleHeaders = userHeaders.visible.map(accessor => ({
//           ...masterMap.get(accessor),
//           visible: true
//         })).filter(header => header);

//         const hiddenHeaders = userHeaders.hidden.map(accessor => ({
//           ...masterMap.get(accessor),
//           visible: false
//         })).filter(header => header);

//         setHeaders([...visibleHeaders, ...hiddenHeaders]);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     },
//     []
//   );

//   useEffect(() => {
//     getData();
//   }, [getData]);

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   // Update data on the server
//   const updateData = useMemo(
//     () => async (updatedHeaders) => {
//       try {
//         console.log("Updating data with:", updatedHeaders);

//         const visible = updatedHeaders.visible || headers.filter(header => header.visible).map(header => header.accessor);
//         const hidden = updatedHeaders.hidden || headers.filter(header => !header.visible).map(header => header.accessor);

//         // Ensure `visible` and `hidden` are correctly defined
//         console.log("Visible:", visible);
//         console.log("Hidden:", hidden);

//         const response = await Axios.put(`/items/${Cookies.get("u_id")}`, { visible, hidden });
//         console.log("Response status:", response.status);
//         console.log("Response data:", response.data);
//       } catch (error) {
//         console.error("Error updating data:", error);
//       }
//     },
//     [headers]
//   );

//   // Handle drag end event
//   const handleToggleLead = async (accessor) => {
//     try {
//       const updatedHeaders = headers.map((header) =>
//         header.accessor === accessor
//           ? { ...header, visible: !header.visible }
//           : header
//       );

//       const visible = updatedHeaders.filter((header) => header.visible).map((header) => header.accessor);
//       const hidden = updatedHeaders.filter((header) => !header.visible).map((header) => header.accessor);

//       // Send updated headers to the backend
//       await Axios.put(`/items/${Cookies.get("u_id")}`, { visible, hidden });

//       setHeaders(updatedHeaders);
//     } catch (error) {
//       console.error("Error updating data:", error);
//     }
//   };

//   const handleDragEnd = (event) => {
//     const { active, over } = event;
//     if (!over || active.id === over.id) return;

//     const oldIndex = headers.findIndex((item) => item.accessor === active.id);
//     const newIndex = headers.findIndex((item) => item.accessor === over.id);

//     if (oldIndex === -1 || newIndex === -1) return;

//     const updatedHeaders = arrayMove(headers, oldIndex, newIndex);
//     setHeaders(updatedHeaders);

//     // Update the backend with the new order
//     const visible = updatedHeaders.filter(header => header.visible).map(header => header.accessor);
//    // const hidden = updatedHeaders.filter(header => !header.visible).map(header => header.accessor);

//     // Logging the updated headers
//     console.log("Updated Headers:", updatedHeaders);
//     console.log("Visible:", visible);
//    // console.log("Hidden:", hidden);

//     updateData({ visible });
//   };

//   const visibleItems = useMemo(
//     () =>
//       headers.filter(header => header.visible).map((headerItem, index) => (
//         <DraggableItem key={headerItem.accessor} id={headerItem.accessor}>
//           <span
//             style={{
//               fontWeight: "bold",
//               justifyContent: "space-between",
//               alignItems: "center",
//             }}
//           >
//             {index + 1}.
//             <Grip
//               size={20}
//               color="#333"
//               style={{ marginRight: "8px", marginLeft: "8px" }}
//             />
//             {headerItem.header}
//           </span>
//           <input
//             type="checkbox"
//             style={{ cursor: "pointer" }}
//             checked={headerItem.visible}
//             onChange={() => handleToggleLead(headerItem.accessor)}
//           />
//         </DraggableItem>
//       )),
//     [headers, handleToggleLead]
//   );

//   const hiddenItems = useMemo(
//     () =>
//       headers.filter(header => !header.visible).map((headerItem, index) => (
//         <DraggableItem key={headerItem.accessor} id={headerItem.accessor} isDisabled>
//           <span
//             style={{
//               fontWeight: "bold",
//               justifyContent: "space-between",
//               alignItems: "center",
//             }}
//           >
//             {index + 1}.

//             {headerItem.header}
//           </span>
//           <input
//             type="checkbox"
//             style={{ cursor: "pointer" }}
//             checked={headerItem.visible}
//             onChange={() => handleToggleLead(headerItem.accessor)}
//           />
//         </DraggableItem>
//       )),
//     [headers, handleToggleLead]
//   );

//   return (
//     <div>
//       <Breadcrumb PageName="Settings" />
//       <Box sx={{ flexGrow: 1, display: "flex", height: "" }}>
//         <Tabs
//           className="setting-tabs"
//           orientation="vertical"
//           variant="scrollable"
//           value={value}
//           onChange={handleChange}
//           aria-label="Vertical tabs example"
//           sx={{ "& .MuiTabs-indicator": { display: "none" } }}
//         >
//           <Tab label="Leads" {...a11yProps(0)} />
//           <Tab label="Human Resource" {...a11yProps(1)} />
//           <Tab label="Broker" {...a11yProps(2)} />
//           <Tab label="Payslips" {...a11yProps(3)} />
//         </Tabs>
//         <TabPanel className="setting-tabpanel custom-card" value={value} index={0}>
//           <Card.Title>Leads Setting</Card.Title>
//           {loading ? (
//             <p>Loading...</p>
//           ) : (
//             <DndContext
//               sensors={sensors}
//               collisionDetection={closestCenter}
//               onDragEnd={handleDragEnd}
//             >
//               <SortableContext items={headers.filter(header => header.visible).map((header) => header.accessor)}>
//                 <div className="column-setting">
//                   <Row>{visibleItems}</Row>
//                 </div>
//               </SortableContext>
//             </DndContext>
//           )}
//           <div className="hidden-headers" style={{ marginTop: "20px" }}>
//           <Card.Title>Hidden Headers</Card.Title>
//           <div  style={{ marginTop: "20px" }}><Row>{hiddenItems}</Row></div>
//           </div>
//         </TabPanel>
//         <TabPanel className="setting-tabpanel custom-card" value={value} index={1}>
//           <Card.Title>Human Resource Setting</Card.Title>
//         </TabPanel>
//         <TabPanel className="setting-tabpanel custom-card" value={value} index={2}>
//           <Card.Title>Broker Setting</Card.Title>
//         </TabPanel>
//         <TabPanel className="setting-tabpanel custom-card" value={value} index={3}>
//           <Card.Title>Payslips Setting</Card.Title>
//         </TabPanel>
//       </Box>
//     </div>
//   );
// };

// export default Settings;