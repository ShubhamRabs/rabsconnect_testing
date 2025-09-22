// Import necessary dependencies and components
import React from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { CombineTwoArrays } from "../../hooks/Function";
import { CandidateSourceData } from "../../data/SourceData";
import { useQuery } from "react-query";
import {
  getCandidateSourceCounting,
  getCandidateStatusAnalyticsCount,
} from "../../hooks/Dashboard/UseDashboardHook";
import { useBootstrap, useMui } from "../../hooks/Hooks";
import CountCard from "../../components/CountCard/CountCard";
import Charts, { CustomPieChart } from "../../components/Charts/Charts";
import CardAdvance from "../../components/CardAdvance/CardAdvance";
import Cookies from "js-cookie";
import { CustomHeading, CustomSubTitle } from "../../components/Common/Common";

// Define the HRDashboard component
const HRDashboard = ({ dispatch }) => {
  // Destructure Bootstrap and MUI components from custom hooks
  const { Row, Col } = useBootstrap();
  const { Button, Box } = useMui();

  // State variables
  const [candidateCountingData, setCandidateCountingData] = React.useState([]);
  const [SourceLength, setSourceLength] = React.useState(12);
  const [CandidateStatusAnalyticsData, setCandidateStatusAnalyticsData] =
    React.useState([]);

  // Query for fetching candidate source counting data
  const CandidateSourceCounting = useQuery(
    "candidatesourcecount",
    () => {
      return getCandidateSourceCounting();
    },
    {
      onSuccess: (data) => {
        // Combine two arrays for additional source data
        setCandidateCountingData(
          CombineTwoArrays(data.data, CandidateSourceData)
        );
      },
    }
  );
  const CandidateStatusAnalytics = useQuery(
    "CandidateStatusAnalytics",
    () => {
      return getCandidateStatusAnalyticsCount();
    },
    {
      onSuccess: (data) => {
        let CandidateColor = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
        let CandidateStatusAnalyticsObjects = data?.data?.map(
          (item, index) => ({
            ...item,
            color: CandidateColor[index],
          })
        );
        // Combine two arrays for additional source data
        setCandidateStatusAnalyticsData(CandidateStatusAnalyticsObjects);
      },
    }
  );

  // Prepare data for the Charts component
  var Chartdata = [
    {
      name: "linkedin",
      Leads: candidateCountingData[0]?.candidate_count,
      amt: candidateCountingData[0]?.candidate_count,
    },
    {
      name: "Google",
      Leads: candidateCountingData[1]?.candidate_count,
      amt: candidateCountingData[1]?.candidate_count,
    },
    {
      name: "workindia",
      Leads: candidateCountingData[2]?.candidate_count,
      amt: candidateCountingData[2]?.candidate_count,
    },
    {
      name: "job hai",
      Leads: candidateCountingData[3]?.candidate_count,
      amt: candidateCountingData[3]?.candidate_count,
    },
    {
      name: "naukri",
      Leads: candidateCountingData[4]?.candidate_count,
      amt: candidateCountingData[4]?.candidate_count,
    },
    {
      name: "indeed",
      Leads: candidateCountingData[4]?.candidate_count,
      amt: candidateCountingData[4]?.candidate_count,
    },
  ];

  // Display a limited number of source cards
  const LimitedSourceCard = candidateCountingData?.slice(0, SourceLength);

  // Handle expanding or collapsing source cards
  const HandleSourceCard = () => {
    if (candidateCountingData.length === SourceLength) {
      setSourceLength(12);
    } else {
      setSourceLength(candidateCountingData.length);
    }
  };

  // Return the JSX for the HRDashboard component
  return (
    <>
      <Breadcrumb
        PageName="HRDashboard"
        otherBtn={Cookies.get("previous_user") !== undefined ? null:
          Cookies.get("module_privilege").includes("Leads") && (
            <Button
              variant="contained"
              onClick={() => dispatch({ event: "dashboard" })}
            >
              Lead Dashboard
            </Button>
          )
        }
      />
      {Cookies.get("role") === "Master" ||
      Cookies.get("module_privilege").includes("Human Resource View") ? (
        <>
          {/* Breadcrumb component */}
          <Row className="mt-4">
            {/* Display source cards in a row */}
            {!CandidateSourceCounting.isLoading
              ? LimitedSourceCard.map((row, index) => {
                  return (
                    <Col xs={12} md={3} sm={4} key={index} className="mb-4">
                      {/* CountCard component for each source */}
                      <CountCard
                        Loading={CandidateSourceCounting.isLoading}
                        cardRole={
                          row.SourceIcon === undefined ? "usercard" : null
                        }
                        SourceImg={
                          row.SourceIcon !== undefined
                            ? row.SourceIcon
                            : row.source.charAt(0) + row.source.charAt(1)
                        }
                        SourceName={
                          row.source === "" ? "undefined" : row.source
                        }
                        LeadCount={row.candidate_count}
                      />
                    </Col>
                  );
                })
              : [1, 2, 3, 4, 5, 6].map((id) => {
                  return (
                    <Col xs={12} md={3} sm={4} key={id} className="mb-4">
                      {/* Skeleton placeholder for loading state */}
                      <CountCard Loading={CandidateSourceCounting.isLoading} />
                    </Col>
                  );
                })}
            {/* Display "View All" button if there are more than 12 source cards */}
            {candidateCountingData.length > 12 ? (
              <div style={{ textAlign: "right" }} className="my-2">
                <Button variant="text" onClick={HandleSourceCard}>
                  {SourceLength === candidateCountingData.length
                    ? "View Less"
                    : "View ALL"}
                </Button>
              </div>
            ) : null}
          </Row>
          {/* Display charts for candidate analytics */}
          <Row>
            <Col xs={12} md={8} className="mb-4">
              <Charts data={Chartdata} title="Candidate Analytics" />
            </Col>
            <Col>
              <CardAdvance
                title="Candidate Status Analytics"
                desc="Candidate analytics by status updated in last 24 hours"
                children={
                  <div
                    style={{
                      height: "367px",
                      width: "100%",
                      overflowY: "scroll",
                    }}
                  >
                    {!CandidateStatusAnalytics.isLoading ? (
                      <CustomPieChart data={CandidateStatusAnalyticsData} />
                    ) : null}
                    <Box className="pie-chart-container mt-3">
                      {CandidateStatusAnalyticsData.map((row, index) => {
                        return (
                          <div
                            className="d-flex align-items-baseline pie-chart-wrapper"
                            key={index}
                          >
                            <span className="text-primary me-2">
                              <div
                                className="pie-chart-color"
                                style={{
                                  background: row.color,
                                }}
                              ></div>
                            </span>
                            <div className="pie-chart-details">
                              <p className="m-0">{row.c_status}</p>
                              <h5
                                style={{
                                  fontSize: ".9rem",
                                  marginBottom: ".1rem",
                                }}
                              >
                                {"Updated " +
                                  row.unique_count +
                                  " " +
                                  " leads " +
                                  row.count +
                                  " " +
                                  " times updated"}
                              </h5>
                            </div>
                          </div>
                        );
                      })}
                    </Box>
                  </div>
                }
              />
            </Col>
            {/* The following section is commented out, you can uncomment it if needed */}
            {/* <Col xs={12} md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Leads Status</Card.Title>
              <Divider sx={{ mt: 2 }} />
              <div
                style={{ height: "415px", width: "100%", overflowY: "scroll" }}
              >
                {!CandidateStatusAnalytics.isLoading
                  ? CandidateStatusAnalytics.data.data?.map((row, id) => {
                      return (
                        <StatusList
                          key={id}
                          Title={row.status}
                          Count={row.leadstatus_count}
                          StatusColor={row.color}
                        />
                      );
                    })
                  : [1, 2, 3, 4, 5, 6].map((id) => {
                      return (
                        <div className="p-3 d-flex align-items-center" key={id}>
                          <Skeleton
                            variant="rectangular"
                            width={45}
                            height={45}
                          />
                          <div className="mx-3">
                            <Skeleton
                              variant="rectangular"
                              width={150}
                              height={15}
                              style={{ marginBottom: ".5rem" }}
                            />
                            <Skeleton
                              variant="rectangular"
                              width={100}
                              height={15}
                            />
                          </div>
                        </div>
                      );
                    })}
              </div>
            </Card.Body>
          </Card>
        </Col> */}
          </Row>
        </>
      ) : (
        <div className="text-center mt-5">
          <CustomHeading
            Heading={`Welcome ${Cookies.get("username")}`}
            style={{ fontSize: "3rem" }}
          />
          <CustomSubTitle
            SubTitle="You don't have Human Resource module privilege as of now"
            style={{ fontSize: "1.2rem", marginTop: "1rem" }}
          />
        </div>
      )}
    </>
  );
};
// Export the HRDashboard component
export default HRDashboard;
