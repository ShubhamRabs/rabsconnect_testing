import dayjs from "dayjs";
import { createMutationHook, makeApiRequest } from "../../Handler/HooksHandler";
import Axios from "../../setting/axios";

// const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");

// API function for uploading files
export const uploadProjectDocuments = async (formData) => {
  try {
    const response = await Axios.post(
      "/project-name/upload-project-documents",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data; // or return the response object directly
  } catch (error) {
    if (error.response) {
      console.error("Error uploading project documents:", error.response.data);
    } else {
      console.error("Error uploading project documents:", error.message);
    }
    throw error; // This will be caught in the component
  }
};

export const GetAllProjectName = (fields) =>
  makeApiRequest(`/project-name/get-all-project-name`, { columns: fields });

export const SetProjectName = (data) => {
  const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  return makeApiRequest(`/project-name/add-project-name`, { data, DateTime });
};

export const SetEditProjectName = (data) => {
  const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  return makeApiRequest(`/project-name/edit-project-name`, { data, DateTime });
};

export const DeleteProjectName = (projectID) =>
  makeApiRequest(`/project-name/delete-project-name`, { prj_id: projectID });

export const ProjectNameDropDownData = async () => {
  try {
    const response = await Axios.post(
      `/project-name/get-project-name-drop-down`
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const useAddProjectName = createMutationHook(SetProjectName);
export const useEditProjectName = createMutationHook(SetEditProjectName);
export const useDeleteProjectName = createMutationHook(DeleteProjectName);
