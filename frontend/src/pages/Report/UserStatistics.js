import React from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { useBootstrap, useMui } from "../../hooks/Hooks";
import {
  GetUpdatedLeadReport,
  GetUserLeadCountReport,
  GetUserLeadSourceCountReport,
} from "../../hooks/Report/useUserStatisticsReportHook";
import { useQuery } from "react-query";
import { CompareCharts } from "../../components/Charts/Charts";
import CryptoJS from "crypto-js";

import ListIcon from "@mui/icons-material/List";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import SegmentIcon from "@mui/icons-material/Segment";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";

import CardAdvance from "../../components/CardAdvance/CardAdvance";
import { CombineTwoArrays } from "../../hooks/Function";
import { LeadSourceData } from "../../data/SourceData";

import "./../../assets/css/UserStatistics.css";
import { Divider } from "@mui/material";
import CountCard from "../../components/CountCard/CountCard";

const UserStatistics = ({ myglobalData }) => {
  const { Row, Col, Card } = useBootstrap();
  const { List, ListItem, Box, Button, Skeleton } = useMui();

  const [filterData, setFilterData] = React.useState({
    leadSourceAnalytics: "overall",
    leadActivityTimeline: "overall",
  });

  const [leadCountingData, setLeadCountingData] = React.useState([]);

  let CryptoJSKey = myglobalData.CompanyName + "@" + myglobalData.Version;
  const bytes = CryptoJS.AES.decrypt(
    localStorage.getItem("store_new_data"),
    CryptoJSKey
  );
  const UserDetails = bytes.toString(CryptoJS.enc.Utf8);

  const UpdatedLeadReport = useQuery("updatedLeadReport", () => {
    return GetUpdatedLeadReport(JSON.parse(UserDetails).u_id);
  });

  const UserLeadCountReport = useQuery("LeadCountReport", () => {
    return GetUserLeadCountReport(JSON.parse(UserDetails).u_id);
  });

  // Query for fetching lead source counting data
  const UserLeadSourceCountReport = useQuery(
    "LeadSourceCountReport",
    () => {
      return GetUserLeadSourceCountReport(
        JSON.parse(UserDetails).u_id,
        filterData.leadSourceAnalytics
      );
    },
    {
      onSuccess: (data) => {
        // Combine two arrays for additional source data
        setLeadCountingData(CombineTwoArrays(data.data, LeadSourceData));
      },
    }
  );

  React.useEffect(() => {
    UserLeadSourceCountReport.refetch();
  }, [filterData]);

  const CountArr = [
    {
      title: "Total Leads",
      count: UserLeadCountReport.data?.data[0]?.totallead,
      icon: <ListIcon />,
    },
    {
      title: "Assign Leads",
      count: UserLeadCountReport.data?.data[0]?.assign_lead,
      icon: <PlaylistAddCheckIcon />,
    },
    {
      title: "Non Assign Leads",
      count: UserLeadCountReport.data?.data[0]?.nonassignlead,
      icon: <FilterListOffIcon />,
    },
    {
      title: "Present Leads",
      count: UserLeadCountReport.data?.data[0]?.persentlead,
      icon: <SegmentIcon />,
    },
    {
      title: "Missed Leads",
      count: UserLeadCountReport.data?.data[0]?.missedlead,
      icon: <PlaylistRemoveIcon />,
    },
  ];

  return (
    <>
      <Breadcrumb
        PageName={"Analytics" + " " + JSON.parse(UserDetails).username}
      />
      <Row className="mt-4">
        {CountArr.map((row, index) => {
          return (
            <Col xs={12} md={3} sm={4} key={index} className="mb-4">
              <CountCard
                cardRole={"leadcount"}
                SourceImg={row.icon}
                SourceName={row.title}
                LeadCount={row.count}
                index={index}
              />
            </Col>
          );
        })}
      </Row>

      <div className="mt-1">
        {!UpdatedLeadReport.isLoading ? (
          <CompareCharts
            data={UpdatedLeadReport.data?.data}
            title="Updated Lead Report"
          />
        ) : null}
      </div>

      <Row className="mt-5">
        <Col sm={12} md={4} lg={4}>
          <CardAdvance
            title="Leads Source Analytics"
            desc="Including all the lead source"
            fliterDropdown={true}
            filterData={(data) =>
              setFilterData({ ...filterData, leadSourceAnalytics: data })
            }
            children={
              <List
                sx={{
                  width: "100%",
                  bgcolor: "background.paper",
                  height: "340px",
                  overflowY: "scroll",
                  overflowX: "hidden",
                }}
              >
                {leadCountingData.map((row, index) => {
                  return (
                    <>
                      <ListItem
                        className="p-0 mb-0 card-item-list d-flex align-items-center justify-content-between user-statistics-list"
                        key={index}
                      >
                        <span className="d-flex align-items-center">
                          {row.SourceIcon !== undefined ? (
                            <img src={row.SourceIcon} width={30} />
                          ) : (
                            <button className="sravatar">
                              {row.source.charAt(0) + row.source.charAt(1)}
                            </button>
                          )}
                          <h6 className="mb-0 ms-3 text-capitalize">
                            <span>{row.source}</span>
                          </h6>
                        </span>
                        <p
                          className="mb-0 fw-medium mx-3"
                          style={{ color: "#6f6b7d" }}
                        >
                          {row.lead_count}
                        </p>
                      </ListItem>
                      <Divider className="my-3" />
                    </>
                  );
                })}
              </List>
            }
          />
        </Col>
        <Col sm={12} md={4} lg={4}>
          <CardAdvance
            title="Lead Activity Timeline"
            desc="comapairing the lead updated according to filter"
            fliterDropdown={true}
            filterData={(data) =>
              setFilterData({ ...filterData, LeadActivityTimeline: data })
            }
            // children={

            // }
          />
        </Col>
      </Row>
    </>
  );
};

export default UserStatistics;
