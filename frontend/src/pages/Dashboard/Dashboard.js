// Import necessary dependencies and components
import React from "react";
import Cookies from "js-cookie";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import CountCard from "./../../components/CountCard/CountCard";
import { useBootstrap, useMui } from "../../hooks/Hooks";
import {
  getAllUserLocation,
  getLeadAnalyticsCount,
  getLeadSourceCounting,
  getLeadStatusCounting,
  getLeadsStatusAnalyticsCount,
  getProjectLeadCount,
} from "../../hooks/Dashboard/UseDashboardHook";
import { useQuery } from "react-query";
import { CombineTwoArrays } from "../../hooks/Function";
import { LeadSourceData } from "./../../data/SourceData";
import Charts from "./../../components/Charts/Charts";
import StatusList from "./../../components/StatusList/StatusList";
import CardAdvance from "../../components/CardAdvance/CardAdvance";
import ListIcon from "@mui/icons-material/List";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import SegmentIcon from "@mui/icons-material/Segment";
import {
  GoogleMap,
  InfoWindowF,
  MarkerF,
  useLoadScript,
} from "@react-google-maps/api";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import { getActionPrevilege } from "../../setting/ActionModulePrevileges";
import { getTodayAllUsersAttendance } from "../../hooks/Attendance/UseAttendanceHook";
import "./../../assets/css/Dashboard.css";
import {
  CustomDescription,
  CustomHeading,
  CustomSubTitle,
} from "../../components/Common/Common";
// import UserLeadReport from "../../components/UserLeadReport/UserLeadReport";
let crm_countries = document.getElementById("crm_countries");
// Define the Dashboard component

const Dashboard = ({ dispatch }) => {
  // Destructure Bootstrap and MUI components from custom hooks
  const { Row, Col, Card } = useBootstrap();
  const { List, ListItem, Box, Button } = useMui();

  // Memoize the result of getActionPrevilege()
  const memoizedLeadsActionPrevilege = React.useMemo(
    () => getActionPrevilege("Leads"),
    []
  );
  const LeadsActionPrevilege = memoizedLeadsActionPrevilege;

  const memoizedHumanResourceActionPrevilege = React.useMemo(
    () => getActionPrevilege("Human Resource"),
    []
  );
  const HumanResourceActionPrevilege = memoizedHumanResourceActionPrevilege;

  // State variables
  const [leadCountingData, setLeadCountingData] = React.useState([]);
  const [SourceLength, setSourceLength] = React.useState(12);

  // Query for fetching lead status data
  const leadStatus = useQuery("LeadStatusdashboard", () => {
    return getLeadStatusCounting();
  });

  // Query for fetching lead status data
  const LeadsStatusAnalytics = useQuery("LeadsStatusAnalytics", () => {
    return getLeadsStatusAnalyticsCount();
  });

  // Query for fetching lead status data
  const LeadAnalyticsCount = useQuery("LeadAnalyticsCount", () => {
    return getLeadAnalyticsCount();
  });

  const TodayAllUsersAttendance = useQuery("TodayAllUsersAttendance", () => {
    return getTodayAllUsersAttendance();
  });

  const AllUserLocation = useQuery("AllUserLocation", () => {
    return getAllUserLocation();
  });

  const ProjectLeadCount = useQuery("ProjectLeadCount", () => {
    return getProjectLeadCount();
  });

  // Query for fetching lead source counting data
  const LeadSourceCounting = useQuery(
    "leadsourcecount",
    () => {
      return getLeadSourceCounting();
    },
    {
      onSuccess: (data) => {
        // Combine two arrays for additional source data
        setLeadCountingData(CombineTwoArrays(data.data, LeadSourceData));
      },
    }
  );

  // Prepare data for the Charts component
  let Chartdata = [
    {
      name: "Facebook",
      Leads: leadCountingData[0]?.lead_count,
      amt: leadCountingData[0]?.lead_count,
    },
    {
      name: "Google",
      Leads: leadCountingData[1]?.lead_count,
      amt: leadCountingData[1]?.lead_count,
    },
  ];

  if (crm_countries.value.includes("India")) {
    Chartdata.push(
      ...[
        {
          name: "Housing",
          Leads: leadCountingData[2]?.lead_count,
          amt: leadCountingData[2]?.lead_count,
        },
        {
          name: "MagicBricks",
          Leads: leadCountingData[3]?.lead_count,
          amt: leadCountingData[3]?.lead_count,
        },
        {
          name: "99 Acres",
          Leads: leadCountingData[4]?.lead_count,
          amt: leadCountingData[4]?.lead_count,
        },
      ]
    );
  }

  if (crm_countries.value.includes("UAE")) {
    if (!crm_countries.value.includes("India")) {
      Chartdata.push(
        ...[
          {
            name: "Bayut",
            Leads: leadCountingData[2]?.lead_count,
            amt: leadCountingData[2]?.lead_count,
          },
          {
            name: "PropertyFinder",
            Leads: leadCountingData[3]?.lead_count,
            amt: leadCountingData[3]?.lead_count,
          },
          {
            name: "Dubizzle",
            Leads: leadCountingData[4]?.lead_count,
            amt: leadCountingData[4]?.lead_count,
          },
        ]
      );
    } else {
      Chartdata.push(
        ...[
          {
            name: "Bayut",
            Leads: leadCountingData[5]?.lead_count,
            amt: leadCountingData[5]?.lead_count,
          },
          {
            name: "PropertyFinder",
            Leads: leadCountingData[6]?.lead_count,
            amt: leadCountingData[6]?.lead_count,
          },
          {
            name: "Dubizzle",
            Leads: leadCountingData[7]?.lead_count,
            amt: leadCountingData[7]?.lead_count,
          },
        ]
      );
    }
  }

  // Display a limited number of source cards
  const LimitedSourceCard = leadCountingData?.slice(0, SourceLength);
  // Handle expanding or collapsing source cards
  const HandleSourceCard = () => {
    if (leadCountingData.length === SourceLength) {
      setSourceLength(12);
    } else {
      alert(leadCountingData.length);
      setSourceLength(leadCountingData.length);
    }
  };

  // Handle clicking on a source card
  const HandleSourceCardClick = (row) => {
    dispatch({
      event: "updateglobal_userdata",
      data: JSON.stringify(row),
    });
    setTimeout(() => {
      dispatch({ event: "leadbysource" });
    }, 10);
  };

  const CountArr = [
    {
      title: "Total Leads",
      count: LeadAnalyticsCount.data?.data[0].totallead,
      icon: <ListIcon />,
    },
    {
      title: "Assign Leads",
      count: LeadAnalyticsCount.data?.data[0].assign_lead,
      icon: <PlaylistAddCheckIcon />,
    },
    {
      title: "Non Assign Leads",
      count: LeadAnalyticsCount.data?.data[0].nonassignlead,
      icon: <FilterListOffIcon />,
    },
    {
      title: "Today's Followup",
      count: LeadAnalyticsCount.data?.data[0].persentlead,
      icon: <SegmentIcon />,
    },
    {
      title: "Missed Followup",
      count: LeadAnalyticsCount.data?.data[0].missedlead,
      icon: <PlaylistRemoveIcon />,
    },
  ];

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAFB7lnFaGvbIL0m3jLYL6oK2p6lDajNbk",
  });
  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, {});

  if (loadError) return `Error loading map: ${loadError.message}`;
  if (!isLoaded) return "Loading...";

  // Return the JSX for the Dashboard component
  return (
    <>
      <Breadcrumb
        PageName="Dashboard"
        otherBtn={
          Cookies.get("previous_user") !==
            undefined ? null : HumanResourceActionPrevilege.View ? (
              <Button
                variant="contained"
                onClick={() => dispatch({ event: "hrdashboard" })}
              >
                View HR Dashboard
              </Button>
            ) : null
        }
      />

      {LeadsActionPrevilege.View ? (
        <>
          <Row className="mt-4">
            {!LeadSourceCounting.isLoading
              ? LimitedSourceCard.map((row, index) => {
                return (
                  <Col xs={12} md={3} sm={4} key={index} className="mb-4">
                    {" "}
                    {/* CountCard component for each source */}
                    <CountCard
                      Loading={LeadSourceCounting.isLoading}
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
                      LeadCount={row.lead_count}
                      onClick={() => HandleSourceCardClick(row)}
                    />
                  </Col>
                );
              })
              : [1, 2, 3, 4, 5, 6].map((id) => {
                return (
                  <Col xs={12} md={3} sm={4} key={id} className="mb-4">
                    {/* Skeleton placeholder for loading state */}
                    <CountCard
                      Loading={LeadSourceCounting.isLoading}
                      title="Leads Analytics"
                    />
                  </Col>
                );
              })}
            {/* Display "View All" button if there are more than 12 source cards */}
            {leadCountingData.length > 12 ? (
              <div style={{ textAlign: "right" }} className="my-2">
                <Button variant="text" onClick={HandleSourceCard}>
                  {SourceLength === leadCountingData.length
                    ? "View Less"
                    : "View ALL"}
                </Button>
              </div>
            ) : null}
          </Row>

          {/* Display charts and lead status list in a row */}
          <Row>
            <Col xs={12} md={8} className="mb-4">
              <Charts data={Chartdata} />
            </Col>
            <Col>
              <CardAdvance
                title="Leads Status Analytics"
                desc="Leads analytics by status updated in last 24 hours"
                children={
                  <div
                    style={{
                      height: "344px",
                      width: "100%",
                      overflowY: "scroll",
                    }}
                  >
                    {/* {!LeadsStatusAnalytics.isLoading ? (
                  <CustomPieChart data={LeadsStatusAnalytics.data.data} />
                ) : null} */}
                    <Box className="pie-chart-container mt-3">
                      {LeadsStatusAnalytics.data?.data?.map((row, index) => {
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
                              <p className="m-0">{row.status}</p>
                              <h5
                                style={{
                                  fontSize: ".9rem",
                                  marginBottom: ".1rem",
                                }}
                              >
                                {"" +
                                  row.unique_count +
                                  " " +
                                  " leads " +
                                  row.count +
                                  " " +
                                  " times updated"}
                              </h5>
                              {/* <h5 style={{ fontSize: ".8rem" }}>
                            {row.count + " " + "Total Leads"}
                          </h5> */}
                            </div>
                          </div>
                        );
                      })}
                    </Box>
                  </div>
                }
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <CardAdvance
                title="Leads Analytics"
                desc="Including all the lead status"
                children={
                  <List
                    sx={{
                      width: "100%",
                      height: "320px",
                      bgcolor: "background.paper",
                    }}
                  >
                    {CountArr.map((row, index) => {
                      return (
                        <ListItem
                          className="p-0 mb-4 card-item-list justify-content-between"
                          key={index}
                        >
                          <span className="d-flex align-items-center">
                            <Box className={"icon-box" + index + " icon-box"}>
                              {row.icon}
                            </Box>
                            <h6 className="mb-0 ms-3">{row.title}</h6>
                          </span>
                          <p
                            className="mb-0 fw-medium"
                            style={{ color: "#6f6b7d" }}
                          >
                            {row.count}
                          </p>
                        </ListItem>
                      );
                    })}
                  </List>
                }
              />
            </Col>
            <Col>
              <CardAdvance
                title="Total Leads Status"
                desc="All leads count according to status"
                children={
                  <div
                    style={{
                      height: "320px",
                      width: "100%",
                      overflowY: "scroll",
                    }}
                  >
                    {leadStatus.data?.data?.map((row, id) => {
                      return (
                        <StatusList
                          key={id}
                          Title={row.status}
                          Count={row.leadstatus_count}
                          StatusColor={row.color}
                        />
                      );
                    })}
                  </div>
                }
              />
            </Col>
            <Col>
              {Cookies.get("role") === "Master" ||
                Cookies.get("role") === "Admin" ? (
                <CardAdvance
                  title="User's Activity"
                  desc="User's activity details of today"
                  children={
                    <div
                      style={{
                        height: "320px",
                        width: "100%",
                        overflowY: "scroll",
                      }}
                    >
                      {/* {TodayAllUsersAttendance.data?.data?.map((row, index) => {
                    return (
                      <>
                        <div
                          className="d-flex align-items-center justify-content-between"
                          key={index}
                        >
                          <div className="d-flex align-items-center">
                            <div className="avatar me-3 avatar-sm">
                              <Avatar />
                            </div>
                            <div className="d-flex flex-column">
                              <h6 className="mb-0">{row.username}</h6>
                              <small className="text-truncate text-muted">
                                {row.urole}
                              </small>
                            </div>
                          </div>
                          <div
                            className={
                              row.session_id === "no"
                                ? "user-offline"
                                : "user-online"
                            }
                          >
                            {row.session_id === "no" ? "Offline" : "Online"}
                          </div>
                        </div>
                        <Divider className="my-3" />
                      </>
                    );
                  })} */}
                    </div>
                  }
                />
              ) : null}
            </Col>
          </Row>
        </>
      ) : (
        <div className="text-center mt-5">
          <CustomHeading
            Heading={`Welcome ${Cookies.get("username")}`}
            style={{ fontSize: "3rem" }}
          />
          <CustomSubTitle
            SubTitle="You don't have any module privilege as of now"
            style={{ fontSize: "1.2rem", marginTop: "1rem" }}
          />
        </div>
      )}
      {/* <Row className="mt-4">
        <UserLeadReport />
      </Row> */}
      <Row className="mt-4">
        {
          Cookies.get("role") === "Master" ||
          Cookies.get("role") === "Admin" && (
            <Col md={6}>
              <CardAdvance
                title="Project campaign report"
                desc="Summary of Project campaign Progress and Insights"
                children={
                  <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Project name </th>
                          <th>24 Hours </th>
                          <th>7 Days </th>
                          <th>1 Month </th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {ProjectLeadCount?.data?.data?.map((row, index) => (
                          <tr key={index}>
                            <td>{row.pname || "Unknown Project"}</td>
                            <td className="text-center">
                              {row.last_24_hours_count}
                            </td>
                            <td className="text-center">{row.last_7_days_count}</td>
                            <td className="text-center">
                              {row.last_1_month_count}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                }
              />
            </Col>
          )
        }
        < Col md={6}>
          {Cookies.get("role") === "Master" && (
            <Card className="card-advance">
              <Card.Body>
                <GoogleMap
                  mapContainerStyle={{
                    width: "100%",
                    height: "350px",
                    borderRadius: "10px",
                  }}
                  center={{ lat: 19.1366729, lng: 72.8454621 }}
                  zoom={13}
                  onLoad={onMapLoad}
                >
                  {AllUserLocation.data?.data?.map((row, index) => {
                    return (
                      <MarkerF
                        key={index}
                        position={{
                          lat: parseFloat(row.latitude),
                          lng: parseFloat(row.longitude),
                        }}
                        icon={{
                          url: row.Image
                            ? row.Image
                            : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
                          scaledSize: {
                            width: 50,
                            height: 50,
                            borderRadius: "50%",
                          },
                        }}
                      >
                        <InfoWindowF
                          position={{
                            lat: parseFloat(row.latitude),
                            lng: parseFloat(row.longitude),
                          }}
                        >
                          <div>
                            <CustomDescription
                              Description={row.username}
                              style={{
                                color: "#000",
                                fontWeight: "500",
                                marginBottom: "5px",
                              }}
                            />
                            <CustomDescription
                              Description={row.latest_datetime}
                            />
                          </div>
                        </InfoWindowF>
                      </MarkerF>
                    );
                  })}
                </GoogleMap>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row >
    </>
  );
};
// Export the Dashboard component
export default Dashboard;
