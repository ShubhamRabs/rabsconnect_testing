import React from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { useQuery } from "react-query";
import { useBootstrap } from "../../hooks/Hooks";
import {
  getLeadStatusCounting,
  getUserLeadStatusCounting,
} from "../../hooks/Dashboard/UseDashboardHook";
import StatusCard from "../../components/StatusCard/StatusCard";
import {
  getUndefinedLeadStatusCount,
  getUserUndefinedLeadStatusCount,
} from "../../hooks/DynamicFields/UseLeadStatusHook";

const AllStatus = ({ dispatch }) => {
  const { Row, Col } = useBootstrap();

  // Queries to get lead status counts
  const leadStatus = useQuery("allleadstatus", () => {
    return getLeadStatusCounting();
  });

  // Queries to get user lead status counts
  const leadUsersStatus = useQuery("allUserleadstatus", () => {
    return getUserLeadStatusCounting();
  });

  // Query to get count of undefined lead status
  const undefinedleadstatuscount = useQuery("undefinedleadstatuscount", () => {
    return getUndefinedLeadStatusCount();
  });

  // Query to get count of undefined user lead status
  const undefinedUserleadstatuscount = useQuery(
    "userundefinedleadstatuscount",
    () => {
      return getUserUndefinedLeadStatusCount();
    }
  );
 
  // Handle click for 'Self' status card
  const HandleSelfClick = (row) => {
    if (row === "undefined lead") {
      let undefinedrow = {
        status: "undefinedlead",
        color: "red",
        master_count: undefinedleadstatuscount.data?.undefinedcount,
      };
      let undefineddata = ["Self", undefinedrow];
      dispatch({
        event: "updateglobal_userdata",
        data: JSON.stringify(undefineddata),
      });
      setTimeout(() => {
        dispatch({ event: "leadbystatus" });
      }, 10);
    } else {
      let data = ["Self", row];
      dispatch({
        event: "updateglobal_userdata",
        data: JSON.stringify(data),
      });
      setTimeout(() => {
        dispatch({ event: "leadbystatus" });
      }, 10);
    }
  };

  // Handle click for 'Team' status card
  const HandleTeamClick = (row) => {
    if (row === "undefined lead") {
      let undefinedteamrow = {
        status: "undefinedlead",
        color: "red",
        user_count: undefinedUserleadstatuscount.data?.undefinedcount,
      };
      let undefinedteamdata = ["Team", undefinedteamrow];
      dispatch({
        event: "updateglobal_userdata",
        data: JSON.stringify(undefinedteamdata),
      });
      setTimeout(() => {
        dispatch({ event: "leadbystatus" });
      }, 10);
    } else {
      let data = ["Team", row];
      dispatch({
        event: "updateglobal_userdata",
        data: JSON.stringify(data),
      });
      setTimeout(() => {
        dispatch({ event: "leadbystatus" });
      }, 600);
    }
  };

  // Function to transform data for mergedArray
  const transformData = (data, user = false) => {
    return data?.map((item) => ({
      status: item.status,
      color: item.color,
      [`${user ? "user" : "master"}_count`]: item.leadstatus_count,
    }));
  };

  let mergedArray = [];

  // Merge data from leadStatus and leadUsersStatus queries
  if (leadUsersStatus.data !== undefined) {
    let masterArray = transformData(leadStatus.data?.data);
    let userArray = transformData(leadUsersStatus.data?.data, true);

    mergedArray = masterArray?.map((masterItem) => {
      const matchingUserItem = userArray.find(
        (userItem) => userItem.status === masterItem.status
      );
      if (matchingUserItem) {
        return { ...masterItem, ...matchingUserItem };
      } else {
        // If no matching user item is found, include only the master item.
        return { ...masterItem };
      }
    });
  } else {
    mergedArray = transformData(leadStatus.data?.data);
  }

  // Render the component
  return (
    <>
      <Breadcrumb PageName="All Status" />
      <Row className="mt-4">
        <Col xs={12} md={3} sm={4} className="mb-4">
          {/* Status card for 'Undefined Leads' */}
          <StatusCard
            SelfCount={undefinedleadstatuscount.data?.undefinedcount}
            TeamCount={undefinedUserleadstatuscount.data?.undefinedcount}
            status="Undefined Leads"
            bgcolor="red"
            SelfClick={() => HandleSelfClick("undefined lead")}
            TeamClick={() => HandleTeamClick("undefined lead")}
            NoUser={true}
          />
        </Col>
        {/* Status cards for other lead statuses */}
        {mergedArray?.map((row, index) => {
          return (
            <Col xs={12} md={3} sm={4} key={index} className="mb-4">
              <StatusCard
                SelfCount={row.master_count}
                TeamCount={row.user_count ? row.user_count : 0}
                status={row.status}
                bgcolor={row.color}
                SelfClick={() => HandleSelfClick(row)}
                TeamClick={() => HandleTeamClick(row)}
                NoUser={row.user_count !== undefined ? true : false}
              />
            </Col>
          );
        })}
      </Row>
    </>
  );
};

export default AllStatus;
