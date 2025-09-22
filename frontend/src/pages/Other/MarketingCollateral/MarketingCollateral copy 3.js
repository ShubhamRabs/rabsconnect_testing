import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Grid,
  Modal,
  FormControl,
  Input,
} from "@mui/material";
import { CloudUpload, Close, PhotoCamera } from "@mui/icons-material";
import { useQuery } from "react-query";
import { Formik, Form, Field } from "formik";
import {
  GetAllProjectName,
  uploadProjectDocuments,
} from "../../../hooks/DynamicFields/useProjectNameHook";

const FileUpload = ({
  onFileSelect,
  selectedFiles,
  onRemoveFile,
  setFieldValue,
  name,
}) => {
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files); // Ensure you get an array of files
    setFieldValue(name, files); // Set Formik's state with the selected files
    onFileSelect(files); // Update the parent component's state
    files.forEach((file) => console.log(file.name, file.size, "file details"));
  };

  return (
    <FormControl fullWidth>
      <Box
        sx={{
          border: "2px dashed #ccc",
          borderRadius: "8px",
          padding: "20px",
          textAlign: "center",
          backgroundColor: "#f9f9f9",
          cursor: "pointer",
        }}
        onClick={() => document.getElementById("file-input").click()}
      >
        <Input
          id="file-input"
          type="file"
          multiple
          onChange={handleFileSelect}
          sx={{ display: "none" }}
        />
        <IconButton color="primary" component="span">
          <PhotoCamera />
        </IconButton>
        <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
          {selectedFiles.length > 0
            ? `${selectedFiles.length} files selected`
            : "Click to upload files"}
        </Typography>
      </Box>
      <Box mt={2}>
        {selectedFiles.map((file, index) => (
          <Box key={index} display="flex" alignItems="center" mt={1}>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {file.name}
            </Typography>
            <IconButton size="small" onClick={() => onRemoveFile(index)}>
              <Close color="error" />
            </IconButton>
          </Box>
        ))}
      </Box>
    </FormControl>
  );
};

const MarketingCollateral = () => {
  const { data: projects = [] } = useQuery(
    "GetAllProjectName",
    GetAllProjectName
  );
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [openModal, setOpenModal] = useState(null);

  const handleFileUpload = (files, projectId) => {
    setUploadedFiles((prevFiles) => ({
      ...prevFiles,
      [projectId]: [...(prevFiles[projectId] || []), ...files],
    }));
  };

  const handleRemoveFile = (projectId, index) => {
    setUploadedFiles((prevFiles) => {
      const newFiles = [...(prevFiles[projectId] || [])];
      newFiles.splice(index, 1);
      return { ...prevFiles, [projectId]: newFiles };
    });
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      console.log("Form Values Submitted:", values);

      if (values.files.length === 0) {
        alert("Please select at least one file.");
        return;
      }

      const formData = new FormData();

      // Ensure that all files are appended correctly
      values.files.forEach((file) => formData.append("files", file));

      formData.append("projectId", values.projectId);

      // Make sure you're calling the correct upload function
      await uploadProjectDocuments(formData);

      resetForm();
      alert("Files uploaded successfully!");
    } catch (error) {
      if (error.response) {
        console.error("Error uploading files:", error.response.data);
        alert(
          `Error uploading files: ${
            error.response.data.message || "Unknown error"
          }`
        );
      } else {
        console.error("Network or Axios error:", error.message);
        alert(`Network error: ${error.message}`);
      }
    }
  };

  return (
    <>
      <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
        Marketing Collateral
      </h3>
      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <Box sx={{ boxShadow: 1, borderRadius: 1, p: 3 }}>
              <Typography variant="h6">{project.pname}</Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {project.bname}
              </Typography>
              <Button
                variant="contained"
                startIcon={<CloudUpload />}
                onClick={() => setOpenModal(project.id)}
              >
                Upload
              </Button>
            </Box>
          </Grid>
        ))}
        {projects.map((project) => (
          <Modal
            key={project.id}
            open={openModal === project.id}
            onClose={() => setOpenModal(null)}
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
              }}
            >
              <Formik
                initialValues={{ files: [], projectId: project.id }}
                onSubmit={handleSubmit}
              >
                {({ setFieldValue, values }) => (
                  <Form>
                    <Typography variant="h6" gutterBottom>
                      Upload Files for {project.pname}
                    </Typography>
                    <FileUpload
                      setFieldValue={setFieldValue} // Pass setFieldValue to FileUpload
                      name="files" // This ensures Formik's field is updated
                      onFileSelect={(files) =>
                        handleFileUpload(files, project.id)
                      }
                      selectedFiles={uploadedFiles[project.id] || []}
                      onRemoveFile={(index) =>
                        handleRemoveFile(project.id, index)
                      }
                    />
                    <Box mt={2} textAlign="right">
                      <Button type="submit" variant="contained">
                        Submit
                      </Button>
                      <Button
                        onClick={() => setOpenModal(null)}
                        color="error"
                        sx={{ ml: 2 }}
                      >
                        Close
                      </Button>
                    </Box>
                  </Form>
                )}
              </Formik>
            </Box>
          </Modal>
        ))}
      </Grid>
    </>
  );
};

export default MarketingCollateral;


// import React, { useState } from 'react';
// import { useQuery } from 'react-query';
// import Cookies from 'js-cookie';
// import { GetUserDetails } from '../../../hooks/Other/UseProfileHook';

// const MarketingCollateral = ({myglobalData}) => {
//   const [image, setImage] = useState('');

//   // Fetch user details using useQuery hook
//   const { data, isLoading, error } = useQuery(
//     "UserDetails",
//     () => {
//       return GetUserDetails(); // Assuming this function fetches user details from an API
//     },
//     {
//       onSuccess: (data) => {
//         if (data.data.length !== 0) {
//           setImage(
//             `${myglobalData.API_URL}/uploads/profile/${Cookies.get("u_id")}/${data.data[0].profile_image}`
//           );
//         }
//       },
//       refetchOnWindowFocus: false,
//       enabled: true,
//     }
//   );

//   // Handle loading and error states
//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error loading user data.</div>;
//   }

//   return (
//     <div>
//       <h3>Marketing Collateral</h3>
//       {image ? (
//         <img src={image} alt="Profile" />
//       ) : (
//         <p>No profile image available</p>
//       )}
//     </div>
//   );
// }

// export default MarketingCollateral;



// import React, { useState } from "react";
// import { useQuery } from "react-query";
// import Cookies from "js-cookie";
// import { GetUserDetails } from "../../../hooks/Other/UseProfileHook";
// import { Button, TextField } from "@mui/material";

// const MarketingCollateral = ({ myglobalData }) => {
//   const [image, setImage] = useState("");
//   const [mobileNumber, setMobileNumber] = useState(""); // state for mobile number input

//   // Fetch user details using useQuery hook
//   const { data, isLoading, error } = useQuery(
//     "UserDetails",
//     () => {
//       return GetUserDetails(); // Assuming this function fetches user details from an API
//     },
//     {
//       onSuccess: (data) => {
//         if (data.data.length !== 0) {
//           setImage(
//             `${myglobalData.API_URL}/uploads/profile/${Cookies.get("u_id")}/${
//               data.data[0].profile_image
//             }`
//           );
//         }
//       },
//       refetchOnWindowFocus: false,
//       enabled: true,
//     }
//   );

//   // Handle loading and error states
//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error loading user data.</div>;
//   }

//   // Function to handle "Share on WhatsApp" click
//   const handleShareClick = () => {
//     if (!mobileNumber || !image) {
//       alert("Please provide a valid mobile number and ensure an image is available.");
//       return;
//     }
  
//     // WhatsApp API URL with phone number and image link as part of the message
//     const message = `Check out this profile image: ${image}`;
//     const encodedMessage = encodeURIComponent(message);
//     const whatsappUrl = `https://wa.me/${mobileNumber}?text=${encodedMessage}`;
  
//     // Open WhatsApp Web with the constructed URL
//     window.open(whatsappUrl, "_blank");
//   };
  

//   return (
//     <>
//       <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
//         <div>
//           <h3>Marketing Collateral</h3>
//           {image ? (
//             <img src={image} alt="Profile" style={{ width: "200px", height: "200px", objectFit: "cover" }} />
//           ) : (
//             <p>No profile image available</p>
//           )}
//         </div>
//         <div style={{ width: "280px" }}>
//           <TextField
//             label="Enter Mobile Number"
//             variant="outlined"
//             fullWidth
//             value={mobileNumber}
//             onChange={(e) => setMobileNumber(e.target.value)} // handle input change
//             type="tel"
//             inputProps={{ pattern: "[0-9]{10}" }} // optional: regex to ensure valid mobile number format
//           />
//         </div>
//         <div>
//           <Button onClick={handleShareClick} variant="contained">
//             Share on WhatsApp
//           </Button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default MarketingCollateral;