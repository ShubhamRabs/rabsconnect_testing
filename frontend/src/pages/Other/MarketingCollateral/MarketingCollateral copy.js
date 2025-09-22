import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Container,
  Card,
  CardContent,
  Button,
  Grid,
  Modal,
  FormControl,
  FormHelperText,
  Input,
} from "@mui/material";
import { PhotoCamera, CloudUpload, Close } from "@mui/icons-material";
import { useQuery } from "react-query";
import { GetAllProjectName } from "../../../hooks/DynamicFields/useProjectNameHook";

// const FileUpload = ({ onFileSelect, selectedFiles, onRemoveFile }) => {
//   const handleFileSelect = (event) => {
//     const files = Array.from(event.target.files);
//     onFileSelect(files);
//   };

//   return (
//     <FormControl fullWidth>
//       <Box
//         sx={{
//           border: "2px dashed #ccc",
//           borderRadius: "8px",
//           padding: "20px",
//           textAlign: "center",
//           backgroundColor: "#f9f9f9",
//           cursor: "pointer",
//         }}
//         onClick={() => document.getElementById("file-input").click()}
//       >
//         <Input
//           id="file-input"
//           type="file"
//           multiple
//           onChange={handleFileSelect}
//           sx={{ display: "none" }}
//         />
//         <IconButton color="primary" component="span">
//           <PhotoCamera />
//         </IconButton>
//         <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
//           {selectedFiles.length > 0
//             ? `${selectedFiles.length} files selected`
//             : "Click to upload files"}
//         </Typography>
//       </Box>
//       <Box mt={2}>
//         {selectedFiles.map((file, index) => (
//           <Box key={index} display="flex" alignItems="center" mt={1}>
//             <Typography variant="body2" sx={{ flexGrow: 1 }}>
//               {file.name}
//             </Typography>
//             <IconButton size="small" onClick={() => onRemoveFile(index)}>
//               <Close color="error" />
//             </IconButton>
//           </Box>
//         ))}
//       </Box>
//     </FormControl>
//   );
// };

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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Marketing Collateral
      </Typography>
      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {project.pname}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {project.bname}
                </Typography>
                <Box mt={2}>
                  <Button
                    variant="contained"
                    startIcon={<CloudUpload />}
                    onClick={() => setOpenModal(project.id)}
                  >
                    Upload
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
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
            <Typography variant="h6" gutterBottom>
              Upload Files for {project.pname}
            </Typography>
            <FileUpload
              onFileSelect={(files) => handleFileUpload(files, project.id)}
              selectedFiles={uploadedFiles[project.id] || []}
              onRemoveFile={(index) => handleRemoveFile(project.id, index)}
            />
            <Box mt={2} textAlign="right">
                <Button>submit</Button>
              <Button onClick={() => setOpenModal(null)} color="error">
                Close
              </Button>
            </Box>
          </Box>
        </Modal>
      ))}
    </Container>
  );
};

export default MarketingCollateral;



<FileUpload
onFileSelect={(files) => handleFileUpload(files, project.id)}
selectedFiles={uploadedFiles[project.id] || []}
onRemoveFile={(index) => handleRemoveFile(project.id, index)}
/>


const FileUpload = ({ onFileSelect, selectedFiles, onRemoveFile }) => {
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    onFileSelect(files);
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