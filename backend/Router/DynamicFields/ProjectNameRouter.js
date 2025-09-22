const express = require("express");
const pool = require("../../Database.js");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const dayjs = require("dayjs");
const {
  fetchRecords,
  addRecord,
  editRecord,
  deleteRecord,
} = require("../../Handler/DynamicFields.js");

const ProjectNameRouter = express.Router();

// Multer storage configuration to handle file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Absolute path for the 'uploads/projects' directory
    const uploadPath = path.join(__dirname, "../../uploads", "projects");

    // Ensure the upload path exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Debug: Log the destination path
    console.log("File destination:", uploadPath);
    cb(null, uploadPath); // Store the files in the 'uploads/projects' folder
  },
  filename: function (req, file, cb) {
    const fileExtension = path.extname(file.originalname); // Get the file extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9); // Generate a unique name
    cb(null, uniqueSuffix + fileExtension); // Save the file with a unique name
  },
});

// Initialize multer with the above storage configuration
const upload = multer({ storage: storage });

ProjectNameRouter.post(
  "/upload-project-documents",
  upload.array("files"), // Accept multiple files with the key "files"
  (req, res) => {
    const { projectId } = req.body;

    // Ensure that files are uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Debug: Log the uploaded files
    console.log("Uploaded files:", req.files);

    // Path for the project-specific folder
    const projectFolderPath = path.join(
      __dirname,
      "../../uploads",
      "projects",
      projectId
    );

    // Ensure the project folder exists
    if (!fs.existsSync(projectFolderPath)) {
      fs.mkdirSync(projectFolderPath, { recursive: true });
      console.log("Created project folder:", projectFolderPath); // Log when the folder is created
    } else {
      console.log("Project folder already exists:", projectFolderPath); // Log if folder already exists
    }

    // Move the files to the project-specific folder and create unique names for them
    req.files.forEach((file) => {
      const newFileName = `${Date.now()}_${file.originalname}`; // Ensure unique filenames
      const newFilePath = path.join(projectFolderPath, newFileName);

      // Debug: Log the file paths before moving
      console.log("Attempting to move file from", file.path, "to", newFilePath);

      try {
        fs.renameSync(file.path, newFilePath); // Move the file
        console.log(`File moved successfully to: ${newFilePath}`); // Log success
      } catch (err) {
        console.error("Error moving file:", err);
        return res
          .status(500)
          .json({ message: "Failed to move file", error: err });
      }
    });

    // Gather the document paths for saving in the database
    const documentPaths = req.files
      .map((file) => path.join("uploads", "projects", projectId, file.filename))
      .join(",");

    // Debug: Log document paths
    console.log("Document paths:", documentPaths);

    // Query to get the existing document paths from the database
    const query = "SELECT document FROM crm_pname WHERE prj_id = ?";
    pool.query(query, [projectId], (err, result) => {
      if (err) {
        console.error("Error fetching document paths from the database:", err);
        return res
          .status(500)
          .json({
            message: "Failed to fetch existing document paths",
            error: err,
          });
      }

      // If the project has existing documents, append the new ones to the existing paths
      let existingPaths = result.length > 0 ? result[0].document : "";

      // If there are existing document paths, concatenate them with the new ones
      if (existingPaths) {
        const updatedPaths = existingPaths + "," + documentPaths; // Append new document paths to existing ones
        saveDocumentPaths(updatedPaths);
      } else {
        saveDocumentPaths(documentPaths); // No existing paths, just save the new ones
      }
    });

    // Function to update the document paths in the database
    const saveDocumentPaths = (updatedPaths) => {
      const updateQuery = "UPDATE crm_pname SET document = ? WHERE prj_id = ?";
      const updateParams = [updatedPaths, projectId];

      pool.query(updateQuery, updateParams, (err, updateResult) => {
        if (err) {
          console.error("Error updating document paths in the database:", err);
          return res.status(500).json({
            message: "Failed to save document paths in the database",
            error: err,
          });
        }

        // Successfully saved the document paths
        res
          .status(200)
          .json({ message: "Files uploaded and saved successfully" });
      });
    };
  }
);

ProjectNameRouter.post("/add-project-name", async (req, res) => {
  try {
    const { DateTime, data } = req.body;
    await addRecord("crm_pname", {
      create_dt: DateTime,
      update_dt: DateTime,
      pname: data.pname,
      bname: data.bname,
    });
    res.send("Project Name Added Successfully");
  } catch (error) {
    handleServerError(error, res);
  }
});

ProjectNameRouter.post("/get-all-project-name", async (req, res) => {
  try {
    const records = await fetchRecords(
      "crm_pname",
      "prj_id as id, create_dt, update_dt, pname, bname, document"
    );
    res.json(records);
  } catch (error) {
    handleServerError(error, res);
  }
});

ProjectNameRouter.post("/delete-project-name", async (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "DELETE FROM crm_pname WHERE ?? = ?",
      ["prj_id", req.body.prj_id],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Project Name Deleted Successfully");
        }
        connection.release();
      }
    );
  });
});

ProjectNameRouter.post("/edit-project-name", async (req, res) => {
  const { DateTime, data } = req.body;
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "UPDATE crm_pname SET update_dt = ?, pname = ?,bname = ? WHERE prj_id = ?",
      [DateTime, data.pname, data.bname, data.id],
      (err, result) => {
        if (err) {
          res.send("Project Name with same name already exist");
        } else {
          res.send("Project Name Updated Successfully");
        }
        connection.release();
      }
    );
  });
});

ProjectNameRouter.post("/get-search-project-name-drop-down", (req, res) => {
  const user_role = req.session.user[0].urole;
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "SELECT DISTINCT(pname) FROM ?? ORDER BY l_id DESC",
      [
        user_role === "Master" || user_role === "Admin"
          ? "crm_lead_primary_details"
          : "crm_lead_req_details",
      ],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.json(result);
        }
        connection.release();
      }
    );
  });
});

ProjectNameRouter.post("/get-project-name-drop-down", (req, res) => {
  const user_role = req.session.user[0].urole;

  pool.getConnection((error, connection) => {
    if (error) throw error;

    const query1 = new Promise((resolve, reject) => {
      connection.query(
        "SELECT DISTINCT(pname) FROM ?? ORDER BY create_dt DESC",
        ["crm_pname"],
        (err, result) => (err ? reject(err) : resolve(result))
      );
    });

    const query2 = new Promise((resolve, reject) => {
      connection.query(
        "SELECT DISTINCT(pname) FROM ??",
        ["crm_lead_primary_details"],
        (err, result) => (err ? reject(err) : resolve(result))
      );
    });

    Promise.all([query1, query2])
      .then(([result1, result2]) => {
        // Combine both result sets
        const allPnames = [...result1, ...result2];

        // Use a Set to store unique project names
        const uniquePnamesSet = new Set();
        const uniquePnames = [];

        allPnames.forEach(({ pname }) => {
          if (!uniquePnamesSet.has(pname)) {
            uniquePnamesSet.add(pname);
            uniquePnames.push({ pname });
          }
        });

        res.json(uniquePnames);
      })
      .catch(err => {
        console.error("Error fetching project names:", err);
        res.status(500).send("Internal Server Error");
      })
      .finally(() => {
        connection.release();
      });
  });
});



// ProjectNameRouter.post("/get-project-name-drop-down", (req, res) => {
//   const user_role = req.session.user[0].urole;
//   pool.getConnection(function (error, connection) {
//     if (error) throw error;
//     connection.query(
//       "SELECT DISTINCT(pname) FROM ?? ORDER BY create_dt DESC",
//       ["crm_pname"],
//       (err, result) => {
//         if (err) {
//           console.log(err);
//         } else {
//           res.json(result);
//         }
//         connection.release();
//       }
//     );
//   });
// });

// for ES5
module.exports = ProjectNameRouter;
