import React from "react";
import { Formik, Form } from "formik";
import {
  Modal,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Grid,
} from "@mui/material";
import { useAddPayslip } from "../../hooks/PaySlip/UsePaySlip";
import { useMui } from "../../hooks/Hooks";

const PreviewPayslip = ({
  open,
  handleClose,
  initialValueForm,
  dispatch,
  selectedDate,
}) => {
  const { LoadingButton } = useMui();

  const { mutate } = useAddPayslip();

  console.log(initialValueForm, "HELOOOO FORMMMMMM");
  const handleSubmit = (values) => {
    const formattedDate = {
      datefrom: new Date(selectedDate.datefrom).toISOString().slice(0, 10),
      dateto: new Date(selectedDate.dateto).toISOString().slice(0, 10),
    };
    const submissionData = { ...values, ...formattedDate };

    // Merging dates with form values
    mutate(submissionData, {
      onSuccess: (values) => {
        console.log("Data submitted successfully:", values);
        dispatch({ event: "payslip" });
        handleClose();
      },
      onError: (error) => {
        console.error("Error submitting data:", error);
      },
    });
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 2,
          maxWidth: "90%",
          margin: "auto",
          // mt: 10,
          boxShadow: 24,
          overflow: "auto",
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Payslip Preview
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Formik initialValues={initialValueForm} onSubmit={handleSubmit}>
          {({ values }) => (
            <Form>
              <Box sx={{ mb: 1, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  onClick={handleClose}
                  variant="outlined"
                  color="secondary"
                  sx={{ mr: 2 }}
                >
                  Close
                </Button>
                <LoadingButton type="submit" variant="contained">
                  Submit
                </LoadingButton>
              </Box>
              <Box sx={{ maxHeight: "400px", overflowY: "auto" }}>
                <Grid container spacing={2}>
                  {Object.keys(values).map((key) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
                      <Grid
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          p: 1,
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 1,
                          bgcolor: "background.paper",
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="textPrimary"
                          sx={{ fontWeight: "bold" }}
                        >
                          {key.replace(/_/g, " ").toUpperCase()}:
                        </Typography>
                        <Typography variant="body2">
                          {values[key] !== undefined
                            ? values[key].toString()
                            : "N/A"}
                        </Typography>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* <Box sx={{ maxHeight: "400px", overflowY: "auto" }}>
                <Grid container spacing={2}>
                  {Object.keys(values).map((key) =>
                    values[key] && values[key] !== "null" ? (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
                        <Grid
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            p: 1,
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 1,
                            bgcolor: "background.paper",
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="textPrimary"
                            sx={{ fontWeight: "bold" }}
                          >
                            {key.replace(/_/g, " ").toUpperCase()}:
                          </Typography>
                          <Typography variant="body2">{values[key]}</Typography>
                        </Grid>
                      </Grid>
                    ) : null
                  )}
                </Grid>
              </Box> */}
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default PreviewPayslip;
