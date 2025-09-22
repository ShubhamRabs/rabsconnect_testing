// Importing necessary dependencies and components from React and other files
import React from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { useBootstrap, useMui, useSetting } from "../../hooks/Hooks";
import { useQuery } from "react-query";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  useFilterCallingReport,
  getStatusCount,
  AddFilterCallingReport1,
  useGetDetailLeadReport,
} from "../../hooks/Report/UseLeadReport";
import { Formik, Form } from "formik";
import {
  CustomInputField,
  CustomMultipleSelectField,
} from "../../components/FormUtility/FormUtility";
import CustomDataTable from "../../components/CustomDataTable/CustomDataTable";
import { CreateLabelValueArray } from "../../hooks/Function";
import { getAllUsers } from "../../hooks/Users/useAllUsersHook";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import * as yup from "yup";
import "./LeadReport.css"
import { Tab, Tabs, Tooltip } from "react-bootstrap";
import { CustomHeading } from "../../components/Common/Common";
import Charts, { CustomPieChart, CustomPieChart2 } from "../../components/Charts/Charts";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { GetAllLeadStatus } from "../../hooks/DynamicFields/UseLeadStatusHook";


// React functional component named LeadReport
const LeadReport = ({ dispatch }) => {
  // Destructuring utility functions and components from custom hooks and libraries
  const { Card, Row, Col, Tabs, Tab } = useBootstrap();
  const { LoadingButton, Typography, Button } = useMui();
  const { globalData } = useSetting();

  // State variables for managing form values, filter data, status, pagination, and selected rows
  const [FliterData, setFliterData] = React.useState([]);
  const [Detail, setDetail] = React.useState([])
  const [status, setStatus] = React.useState([]);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(50);
  const [initialValues, setinitialValues] = React.useState({
    user:
      Cookies.get("role") === "Master" || Cookies.get("role") === "Admin"
        ? []
        : Cookies.get("u_id"),
    start_date: "",
    end_date: "",
  });
  const [selectedUsers, setSelectedUsers] = React.useState([])
  const [overview, setOverview] = React.useState([])

  // Initial form values for formik
  // const initialValues = {
  //   user:
  //     Cookies.get("role") === "Master" || Cookies.get("role") === "Admin"
  //       ? []
  //       : Cookies.get("u_id"),
  //   start_date: "",
  //   end_date: "",
  // };

  // Custom hook for handling filter calling report data
  const { mutate, isLoading } = useFilterCallingReport(page, pageSize);

  // State variable for resetting the form
  const [ResetForm, setResetForm] = React.useState(false);

  // Query for fetching all users list
  const AllUsers = useQuery("AllUsersList", getAllUsers);

  // Query for fetching calling report table data
  const CallingReportTableData = useQuery(["CallingReportData"], () =>
    AddFilterCallingReport1()
  );

  const AllLeadStatus = useQuery("AllLeadStatus", () => {
    return GetAllLeadStatus();
  });

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  const handlePageSizeChange = (newSize) => {
    console.log(newSize,"I am the new size");
    setPageSize(newSize);
    console.log(pageSize,"I am the old size");
  };

  // Function to handle form submission
  const HandleSubmit = (values) => {
    // dispatch({ event: "store_new_data", data: JSON.stringify(values) });
    setSelectedUsers(AllUsers?.data?.data?.filter(user => values.user.includes(user.id)));
    const data = {
      ...values, page, pageSize
    };
    mutate(data, {
      onSuccess: (data) => {
        setFliterData(data.data[0]);
        setDetail(data.data[1]);
        setOverview(data.data[2]);
      },
    });
  };

  // Fetching status count data on component mount
  React.useEffect(() => {
    getStatusCount()
      .then((response) => {
        setStatus(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Function to handle data click for updating global user data and navigating to calling report
  const HandleDataClick = (status, row) => {
    let cellData = [
      {
        username: row.original.username,
        u_id: row.original.u_id,
        status: status,
        status_count: row.original[status],
      },
    ];
    dispatch({
      event: "updateglobal_userdata",
      data: JSON.stringify(cellData),
    });
    setTimeout(() => {
      dispatch({ event: "callingreport" });
    }, 30);
  };

  const overviewColumn = [
    {
      Header: "Date",
      accessor: "create_dt",
    },
    {
      Header: "FollowUps",
      accessor: "FollowUps",
    },
    {
      Header: "NewLeads",
      accessor: "NewLeads",
    },
    {
      Header: "MissedLeads",
      accessor: "MissedLeads",
    },
  ]

  // Memoized columns configuration for the custom data table
  const columns = React.useMemo(() => {
    const staticColumns = [
      {
        Header: "Date",
        accessor: "date",
      },
      {
        Header: "Username",
        accessor: "username",
      },
      {
        Header: "Total Count",
        accessor: "total_count",
      },
    ];

    return staticColumns.concat(
      status.map((status) => ({
        Header: status.status,
        accessor: status.status,
        Cell: ({ value, column, row }) =>
          Cookies.get("role") === "Master" ||
            Cookies.get("role") === "Admin" ? (
            <button
              onClick={() => HandleDataClick(column.Header, row)}
              className="report-count-btn"
            >
              {value}
            </button>
          ) : (
            <span>{value}</span>
          ),
      }))
    );
  }, [status]);

  const handleAction = async (action) => {
    // setLoading(true);
    try {

      const content_table1 = document.getElementById("lead_detail");
      const table1 = await html2canvas(content_table1)
      const imgData = table1.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (table1.height * imgWidth) / table1.width;
      let heightLeft = imgHeight;
      const pageHeight = 295;
      let position = 10; // give some top padding to first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position += heightLeft - imgHeight; // top padding for other pages
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      if (action === "print") {
        const pdfBlob = pdf.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl);
      } else if (action === "download") {
        pdf.save("leadReport.pdf");
      }
    } catch (error) {
      console.log(error);
    }

  };

  const HandleResetForm = () => {
    localStorage.removeItem("store_new_data");
    setResetForm(true);
    setFliterData([]);
    setTimeout(() => {
      setResetForm(false);
    }, 100);
  };

  // React.useEffect(() => {
  //   if (localStorage.getItem("store_new_data") !== null) {
  //     let CryptoJSKey = globalData.CompanyName + "@" + globalData.Version;

  //     const Searchbytes = CryptoJS.AES.decrypt(
  //       localStorage.getItem("store_new_data"),
  //       CryptoJSKey
  //     );

  //     HandleSubmit(JSON.parse(Searchbytes.toString(CryptoJS.enc.Utf8)));
  //   }
  // }, []);

  const validationSchema = yup.object({
    start_date: yup.date().required("Start Date is required"),
    end_date: yup.date().required("End Date is required"),
  });

  const chartDataOverview = []
  const totalOverview = overview.reduce((acc, curr) => {
    acc.FollowUps += curr.FollowUps;
    acc.NewLeads += curr.NewLeads;
    acc.MissedLeads += curr.MissedLeads;
    return acc;
  }, { FollowUps: 0, NewLeads: 0, MissedLeads: 0 });


  for (let index = 0; index < Object.keys(totalOverview).length; index++) {
    chartDataOverview.push({
      name: Object.keys(totalOverview)[index],
      value: Object.values(totalOverview)[index],
    })
  }

  const chartDataDetail = []

  function calculateTotals(Detail) {
    const totals = {};
    Detail.forEach(item => {
      for (const key in item) {
        if (key !== "date" && key !== "u_id" && key !== "username" && key !== "total_count") {
          totals[key] = (totals[key] || 0) + item[key];
        }
      }
    });
    return totals;
  }

  const detailTotals = calculateTotals(Detail);
  for (let index = 0; index < Object.keys(detailTotals).length; index++) {
    for (let index2 = 0; index2 < AllLeadStatus.data.length; index2++) {
      if (Object.keys(detailTotals)[index] == AllLeadStatus.data[index2].status) {
        chartDataDetail.push({
          name: Object.keys(detailTotals)[index],
          value: Object.values(detailTotals)[index],
          color: AllLeadStatus.data[index2].color
        })
      }
    }
  }

  return (
    <>
      {/* Breadcrumb component for page navigation */}
      <Breadcrumb PageName="User Lead Report" />

      {/* Card component for organizing content */}
      <Card className="mt-3">
        <Card.Body className="align-items-center justify-content-between">
          {/* Card title for generating user lead reports */}
          <Card.Title className="mb-4" style={{ fontSize: "16px" }}>
            Generate User Lead Reports
          </Card.Title>
          {/* Formik form for submitting filter criteria */}
          <Formik
            initialValues={initialValues}
            onSubmit={HandleSubmit}
            validationSchema={validationSchema}
          >

            {({ values, setFieldValue }) => (
              <>
                {/* {console.log(values,"values")} */}
                {/* Form containing filter fields */}
                <Form className="mt-3">
                  <Row className="mb-5">
                    {/* CustomMultipleSelectField for selecting users */}
                    <Col
                      md={3}
                      className={
                        Cookies.get("role") === "Master" ||
                          Cookies.get("role") === "Admin"
                          ? ""
                          : "d-flex align-items-center justify-content-center"
                      }
                    >
                      {Cookies.get("role") === "Master" ||
                        Cookies.get("role") === "Admin" ? (
                        <CustomMultipleSelectField
                          name="user"
                          placeholder="Select User"
                          options={CreateLabelValueArray(
                            AllUsers.data?.data,
                            "username",
                            "id"
                          )}
                          isLabelValue={true}
                          FieldValue={(name, value) => {
                            return setFieldValue(name, value);
                          }}
                          values={values}
                          resetField={ResetForm}
                        />
                      ) : (
                        <Typography>{Cookies.get("username")}</Typography>
                      )}
                    </Col>
                    {/* CustomInputField for selecting start date */}
                    <Col md={3}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: "400" }}
                      >
                        Select Date From
                      </Typography>
                      <CustomInputField type="date" name="start_date" />
                    </Col>
                    {/* CustomInputField for selecting end date */}
                    <Col md={3}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: "400" }}
                      >
                        Select Date To
                      </Typography>
                      <CustomInputField type="date" name="end_date" />
                    </Col>
                  </Row>
                  {/* Button group for searching and resetting filters */}
                  <div className="text-end">
                    <LoadingButton
                      variant="contained"
                      type="submit"
                      loading={isLoading}
                      sx={{ mr: 2 }}
                    >
                      Search Reports
                    </LoadingButton>
                    {/* Placeholder for Reset Search Default button */}
                    <LoadingButton
                      variant="contained"
                      type="button"
                      onClick={HandleResetForm}
                    >
                      Reset Search Default
                    </LoadingButton>

                  </div>
                </Form>
              </>
            )}
          </Formik>
        </Card.Body>
      </Card>
      {/* Card component for the calling report table */}
      <div className="bg-white">
        <Card className="mt-3 calling-report-table-card">
          {/* Render custom data table with calling report data */}
          {!CallingReportTableData.isLoading ? (
            <>
              {FliterData !== null ? (
                <CustomDataTable
                  columns={columns}
                  data={FliterData}
                  page={page}
                  pageSize={pageSize}
                  showAction={false}
                  showCheckBox={false}
                  fullsize={true}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  // SetSelectedRows={handleSelectedRows}
                  selectedRows={selectedRows}
                  totalCount={FliterData.length}
                />
              ) : (
                <CustomDataTable columns={columns} onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange} data={FliterData} showAction={false} showCheckBox={false} />
              )}
            </>
          ) : null}
        </Card>
        {FliterData.length > 0 && <>
          <CustomHeading className="m-4 custom-heading" Heading="Lead Report In Detail" />
          <div id="lead_detail" className=" bg-white">
            <Tabs
              defaultActiveKey={selectedUsers[0].username}
              // defaultActiveKey={AllUsers?.data?.data[0]}              
              id="uncontrolled-tab-example"
              className="lead-details-tab"
            >
              {
                selectedUsers.map((val, index) => (
                  <Tab eventKey={val.username} title={val.username} key={index}>
                    <CustomDataTable
                      columns={columns}
                      data={Detail.filter((value) => value.username === val.username)}
                      page={page}
                      pageSize={pageSize}
                      showAction={false}
                      showCheckBox={false}
                      onPageChange={handlePageChange}
                      onPageSizeChange={handlePageSizeChange}
                      SetSelectedRows={() => { }}
                      selectedRows={selectedRows}
                      totalCount={Detail.filter((value) => value.username === val.username).length}
                      fullsize={true}

                    />
                  </Tab>
                ))
              }
            </Tabs>


            <CustomHeading className="m-4 custom-heading" Heading="Lead Overview" />
            <CustomDataTable
              columns={overviewColumn}
              data={overview}
              page={page}
              pageSize={pageSize}
              showAction={false}
              showCheckBox={false}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              SetSelectedRows={() => { }}
              selectedRows={selectedRows}
              totalCount={overview.length}
              fullsize
            />


            {/* <div className="bg-white rounded"> */}
            <Row className="bg-white rounded m-0 p-0">
              <Col md={5} className="my-4 d-flex align-items-center flex-column">
                <CustomHeading className="custom-heading text-center" Heading="Overview in Detail" />
                <CustomPieChart2 data={chartDataOverview} />
              </Col>
              <Col md={5} className="my-4 d-flex align-items-center flex-column">
                <CustomHeading className="custom-heading text-center" Heading="Status in Detail" />
                <CustomPieChart2 data={chartDataDetail} />
              </Col>
            </Row>
            {/* </div> */}
          </div>
        </>
        }
      </div>
      <Button
        variant="contained"
        // onClick={handlePrint}
        onClick={() => handleAction("print")}
        className="m-4"
        style={{ color: "#fff" }}
      >
        Print
      </Button>
      <Button
        variant="contained"
        style={{ color: "#fff" }}
        onClick={() => handleAction("download")}
      >
        Download
      </Button>
    </>
  );
};

// Exporting the LeadReport component as the default export
export default LeadReport;