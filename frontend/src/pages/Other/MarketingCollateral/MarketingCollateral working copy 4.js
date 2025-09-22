import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Grid,
  Modal,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  CloudUpload,
  Close,
  AttachFile,
  RemoveRedEye,
  Image,
  PictureAsPdf,
  Description,
  WhatsApp,
} from "@mui/icons-material";
import { useQuery } from "react-query";
import { Formik, Form } from "formik";
import {
  GetAllProjectName,
  uploadProjectDocuments,
} from "../../../hooks/DynamicFields/useProjectNameHook";
import { CustomModal } from "../../../components/CustomModal/CustomModal";
import { useSetting } from "../../../hooks/Hooks";

// Function to check if the file is an image
const isImage = (file) => /\.(jpeg|jpg|gif|png)$/i.test(file);

// Function to check if the file is a PDF
const isPDF = (file) => /\.pdf$/i.test(file);

// Function to check if the file is a text file
const isTextFile = (file) => /\.txt$/i.test(file);

const MarketingCollateral = () => {
  const { data: projects = [] } = useQuery(
    "GetAllProjectName",
    GetAllProjectName
  );
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [openUploadModal, setOpenUploadModal] = useState(null);
  const [openPreviewModal, setOpenPreviewModal] = useState(null);
  const [selectedProjectDocs, setSelectedProjectDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const { globalData } = useSetting();

  // Handle file change and update the files for the specific project
  const handleFileChange = (event, projectId, setFieldValue) => {
    const files = Array.from(event.target.files);
    setFieldValue("files", files);
    setUploadedFiles((prevFiles) => ({
      ...prevFiles,
      [projectId]: [...(prevFiles[projectId] || []), ...files],
    }));
  };

  // Remove file from the list
  const removeFile = (projectId, index) => {
    setUploadedFiles((prevFiles) => {
      const newFiles = [...(prevFiles[projectId] || [])];
      newFiles.splice(index, 1);
      return { ...prevFiles, [projectId]: newFiles };
    });
  };

  // Handle file upload on form submit
  const handleSubmit = async (values, { resetForm }) => {
    try {
      if (!values.files || values.files.length === 0) {
        alert("Please select at least one file.");
        return;
      }

      const formData = new FormData();
      values.files.forEach((file) => formData.append("files", file));
      formData.append("projectId", values.projectId);

      await uploadProjectDocuments(formData);
      setUploadedFiles((prevFiles) => ({
        ...prevFiles,
        [values.projectId]: [],
      }));
      setOpenUploadModal(null);
      resetForm();
      alert("Files uploaded successfully!");
    } catch (error) {
      console.error("Error uploading files:", error);
      alert(`Error uploading files: ${error.message || "Unknown error"}`);
    }
  };

  // Open modal to preview documents for a specific project
  const openPreviewModalHandler = (projectId, documents) => {
    const docsArray = documents ? documents.split(",") : [];
    setSelectedProjectDocs(docsArray);
    setOpenPreviewModal(projectId);
  };

  // Close the preview modal
  const closePreviewModal = () => {
    setOpenPreviewModal(null);
    setSelectedProjectDocs([]);
  };

  const renderDocumentPreview = (doc) => {
    const fixedDocPath = doc.replace(/\\/g, "/");
    if (isImage(doc)) {
      return (
        <img
          src={`${globalData.API_URL}/${fixedDocPath}`}
          alt="Document Preview"
          style={{ maxWidth: "100%", maxHeight: "500px" }}
        />
      );
    } else if (isPDF(doc)) {
      return (
        <div style={{ width: "100%", height: "500px", overflow: "auto" }}>
          <embed
            src={`${globalData.API_URL}/${fixedDocPath}`}
            type="application/pdf"
            width="100%"
            height="600px"
          />
        </div>
      );
    } else if (isTextFile(doc)) {
      return (
        <div style={{ width: "100%", height: "500px", overflowY: "auto" }}>
          <iframe
            src={`${globalData.API_URL}/${fixedDocPath}`}
            title="Text file preview"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      );
    } else {
      return (
        <Typography variant="body1">Unsupported file type: {doc}</Typography>
      );
    }
  };

  const getFileName = (filePath) => {
    const pathParts = filePath.split("\\"); // Split by backslash
    return pathParts[pathParts.length - 1]; // Get the last part (filename)
  };

  return (
    <>
      <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
        Marketing Collateral
      </h3>
      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "stretch",
                boxShadow: 2,
                borderRadius: 2,
                p: 3,
                bgcolor: "background.default",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  boxShadow: 4,
                  transform: "translateY(-3px)",
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "text.primary" }}
              >
                {project.pname}
              </Typography>
              <Typography
                variant="subtitle1"
                color="textSecondary"
                sx={{ mb: 1 }}
              >
                {project.bname}
              </Typography>

              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Documents:{" "}
                <span style={{ fontWeight: "bold" }}>
                  {project.document ? project.document.split(",").length : 0}
                </span>
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/* Upload Button */}
                <Button
                  variant="contained"
                  startIcon={<CloudUpload />}
                  onClick={() => setOpenUploadModal(project.id)}
                  sx={{
                    backgroundColor: "primary.main",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                    textTransform: "none",
                    borderRadius: "20px",
                    padding: "8px 16px",
                  }}
                >
                  Upload
                </Button>

                {/* Preview Icon Button */}
                {project.document && project.document.split(",").length > 0 && (
                  <IconButton
                    onClick={() =>
                      openPreviewModalHandler(project.id, project.document)
                    }
                    color="primary"
                    sx={{
                      marginLeft: "16px",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.08)", // Hover effect
                      },
                      padding: "8px",
                    }}
                  >
                    <RemoveRedEye sx={{ fontSize: "24px" }} />
                  </IconButton>
                )}
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Modal for uploading files */}
      {projects.map((project) => (
        <Modal
          key={project.id}
          open={openUploadModal === project.id}
          onClose={() => {
            setOpenUploadModal(null);
            // Reset the uploaded files state for the specific project when the modal is closed
            setUploadedFiles((prevFiles) => ({
              ...prevFiles,
              [project.id]: [],
            }));
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 850,
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: 3,
              p: 4,
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <Formik
              initialValues={{
                files: [],
                projectId: project.id,
              }}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue, values }) => (
                <Form>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: "bold", color: "primary.main" }}
                  >
                    Upload Files for {project.pname}
                  </Typography>

                  {/* File Input Section */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 3,
                    }}
                  >
                    <label
                      htmlFor="file-input"
                      style={{
                        cursor: "pointer",
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                        padding: "8px 16px",
                        borderRadius: "20px",
                        backgroundColor: "#e0e0e0",
                        transition: "all 0.3s",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#c0c0c0")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "#e0e0e0")
                      }
                    >
                      <AttachFile color="primary" />
                      <Typography
                        color="text.secondary"
                        sx={{ fontWeight: "500" }}
                      >
                        Add Attachments
                      </Typography>
                    </label>
                    <Box>
                      {uploadedFiles[project.id] &&
                        uploadedFiles[project.id].map((file, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              mt: 1,
                              p: 1.5,
                              border: "1px solid #ccc",
                              borderRadius: 2,
                              boxShadow: 1,
                            }}
                          >
                            <Typography
                              noWrap
                              sx={{ flex: 1, fontWeight: "500" }}
                            >
                              {file.name}
                            </Typography>
                            <IconButton
                              onClick={() => removeFile(project.id, index)}
                              size="small"
                              sx={{
                                backgroundColor: "#f44336",
                                "&:hover": {
                                  backgroundColor: "#d32f2f",
                                },
                              }}
                            >
                              <Close fontSize="small" sx={{ color: "white" }} />
                            </IconButton>
                          </Box>
                        ))}
                    </Box>

                    <input
                      type="file"
                      multiple
                      onChange={(event) =>
                        handleFileChange(event, project.id, setFieldValue)
                      }
                      id="file-input"
                      style={{ display: "none" }}
                    />
                  </Box>

                  {/* Buttons Section */}
                  <Box mt={3} textAlign="right">
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      sx={{
                        padding: "8px 20px",
                        borderRadius: "20px",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "#1976d2",
                        },
                      }}
                    >
                      Submit
                    </Button>
                    <Button
                      onClick={() => setOpenUploadModal(null)}
                      color="error"
                      sx={{
                        ml: 2,
                        padding: "8px 20px",
                        borderRadius: "20px",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "#d32f2f",
                          cursor: "pointer",
                          color: "white",
                        },
                      }}
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

      {/* Modal for previewing documents */}
      <CustomModal
        show={openPreviewModal !== null}
        onHide={closePreviewModal}
        ModalSize="lg"
        ModalTitle={`Documents for Project ID: ${openPreviewModal}`}
        ModalBody={
          <Grid container spacing={2}>
            {/* Show the list of documents with professional design */}
            <Grid item xs={12}>
              <List>
                <Grid container spacing={2}>
                  {selectedProjectDocs.map((doc, index) => {
                    const fileName = getFileName(doc); // Extract the filename
                    return (
                      <Grid item xs={6} key={index}>
                        <ListItem
                          button
                          onClick={() => setSelectedDoc(doc)} // Set the selected document when clicked
                          sx={{
                            padding: "10px 16px",
                            borderBottom: "1px solid #e0e0e0",
                            "&:hover": { backgroundColor: "#f5f5f5" },
                          }}
                        >
                          {/* Numbering the document */}
                          <ListItemText primary={`${index + 1}. ${fileName}`} />
                          {/* Use an icon based on the document type */}
                          <ListItemIcon>
                            {isImage(doc) ? (
                              <Image />
                            ) : isPDF(doc) ? (
                              <PictureAsPdf />
                            ) : (
                              <Description />
                            )}
                          </ListItemIcon>
                        </ListItem>
                      </Grid>
                    );
                  })}
                </Grid>
              </List>
            </Grid>

            {/* Show the preview of the selected document */}
            {selectedDoc && (
              <Grid item xs={12} style={{ marginTop: "20px" }}>
                <Box sx={{ boxShadow: 1, borderRadius: 1, p: 2 }}>
                  {renderDocumentPreview(selectedDoc)}
                </Box>
              </Grid>
            )}
          </Grid>
        }
        ModalFooter={
          <Box textAlign="right" mt={3}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<WhatsApp />}
              // onClick={shareOnWhatsApp}
              sx={{
                padding: "8px 20px",
                borderRadius: "20px",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#25D366",
                },
              }}
              >Share on Whatsapp</Button>
            <Button onClick={closePreviewModal} color="error">
              Close
            </Button>
          </Box>
        }
      />
    </>
  );
};

export default MarketingCollateral;
