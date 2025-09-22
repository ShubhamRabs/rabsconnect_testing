import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Input,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material"; // For file input icon
import { CustomHeading } from "../Common/Common";

const FileUpload = ({ onFileSelect, selectedFile, isRequired }) => {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      onFileSelect(droppedFiles[0]);
      setError(false); // Clear error on file select
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    onFileSelect(file);
    setError(false); // Clear error on file select
  };

  const validateFile = () => {
    if (isRequired && !selectedFile) {
      setError(true);
    }
  };

  return (
    <FormControl fullWidth error={error}>
      <Box
        sx={{
          border: "2px dashed #ccc",
          borderRadius: "8px",
          padding: "20px",
          textAlign: "center",
          backgroundColor: dragging ? "#e0e0e0" : "#f9f9f9",
          transition: "background-color 0.3s",
          cursor: "pointer",
        }}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-input").click()}
        onBlur={validateFile} // Validate on blur
      >
        <Input
          id="file-input"
          type="file"
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
          onChange={handleFileSelect}
          sx={{ display: "none" }}
        />
        <IconButton color="primary" component="span">
          <PhotoCamera />
        </IconButton>
        <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
          {selectedFile
            ? selectedFile.name
            : "Drag & drop a file here or click to select"}
        </Typography>
        {selectedFile && selectedFile.type?.startsWith("image/") ? (
          <Box mt={2} sx={{ textAlign: "center" }}>
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Selected file preview"
              style={{
                maxWidth: "100%",
                maxHeight: 200,
                borderRadius: 4,
              }}
            />
          </Box>
        ) : (
          selectedFile && <CustomHeading Heading={selectedFile} />
        )}
      </Box>
      {error && <FormHelperText>Please select a file</FormHelperText>}
    </FormControl>
  );
};

export default FileUpload;