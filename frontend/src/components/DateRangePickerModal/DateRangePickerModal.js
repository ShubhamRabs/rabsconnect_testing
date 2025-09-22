// import React from "react";
// import { Box, Button } from "@mui/material";
// import Modal from "react-bootstrap/Modal";

// // import classes from "./Modal.module.css";
// import { DateRangePicker } from "react-date-range";

// export default function DateRangePickerModal(props) {
//   const [selectionRange, setSelectionRange] = React.useState({
//     startDate: new Date(),
//     endDate: new Date(),
//     key: "selection",
//   });

//   const handleDatePicker = (ranges) => {
//     const { startDate, endDate } = ranges.selection;
//     // console.log(ranges);
//     setSelectionRange(ranges.selection);
//   };
//   return (
//     <Modal
//       {...props}
//       // size="xl"
//       // fullscreen="xl-down"
//     //   dialogClassName={classes["modal-dates-dialog"]}
//       aria-labelledby="contained-modal-title-vcenter"
//       centered
//     >
//       <Modal.Header closeButton >
//         <Modal.Title
//           id="contained-modal-title-vcenter"
//           style={{ width: "90%" }}
//         >
//           <Box className="d-flex justify-content-between w-100">
//             <Box>
//               3 nights
//               <Box>
//                 <p className="text-muted" style={{ fontSize: "16px" }}>
//                   3 beds 1 bath
//                 </p>
//               </Box>
//             </Box>
//             <Box>
//               <p className="text-muted" style={{ fontSize: "16px" }}>
//                 Check in - Check out
//               </p>
//             </Box>
//           </Box>
//         </Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <DateRangePicker
//           onChange={handleDatePicker}
//           ranges={[selectionRange]}
//           minDate={new Date()}
//           months={2}
//           direction="horizontal"
//           rangeColors={["#bd8535"]}
//           showDateDisplay={false}
//           showMonthArrows={false}
//           staticRanges={[]}
//           initialDate={new Date()}
//           inputRanges={[]}
//         />
//       </Modal.Body>
//       <Modal.Footer>
//         <Button
//           sx={{
//             background: "#d0a13e",
//             color: "#fff",
//             "&:hover": { color: "#fff", background: "#d0a13e" },
//           }}
//           onClick={props.onHide}
//         >
//           Close
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// }
