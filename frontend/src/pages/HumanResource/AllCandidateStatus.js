import React, { useEffect, useState } from "react";
import { useBootstrap } from "../../hooks/Hooks";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import StatusCard from "../../components/StatusCard/StatusCard";
import { useQuery } from "react-query";
import {
  getCandidateByStatusCount,
  getCandidateByUserStatusCount,
} from "../../hooks/HumanResources/UseCandidateByStatusHook";
import { GetAllCandidatesStatus } from "../../hooks/DynamicFields/UseCandidatesStatusHook";
import Cookies from "js-cookie";

const AllCandidateStatus = ({ dispatch }) => {
  const { Row, Col } = useBootstrap();

  const leadStatus = useQuery(
    ["leadCandidateStatus", Cookies.get("username")],
    () => {
      return getCandidateByStatusCount();
    }
  );

  const leadUserStatus = useQuery(
    ["leadUserCandidateStatus", Cookies.get("username")],
    () => {
      return getCandidateByUserStatusCount();
    }
  );

  let leadStatusArray = [];

  const GetCandidatesStatus = useQuery("GetAllCandidatesSt", () => {
    return GetAllCandidatesStatus(["candidate_status"]);
  });

  const getTeamCount = (statusColumn) => {
    if (
      leadUserStatus.isSuccess &&
      leadUserStatus.data &&
      leadUserStatus.data.data
    ) {
      let leadUserData = leadUserStatus.data.data.data;
      const count = leadUserData.filter(
        (item) => item.c_status === statusColumn
      );
      if (count.length > 0 && count[0].hasOwnProperty("count")) {
        return count[0].count;
      }
      return 0;
    }
  };

  if (leadStatus.isSuccess && leadStatus.data && leadStatus.data.data) {
    leadStatusArray = leadStatus.data.data.data;
    if (GetCandidatesStatus.isSuccess && GetCandidatesStatus.data) {
      let candidateStatusArray = GetCandidatesStatus.data;
      for (let i = 0; i < candidateStatusArray.length; i++) {
        let statusNotFound = true;
        for (let j = 0; j < leadStatusArray.length; j++) {
          if (
            candidateStatusArray[i].candidate_status ===
            leadStatusArray[j].status
          ) {
            statusNotFound = false;
          }
        }
        if (statusNotFound) {
          leadStatusArray.push({
            status: candidateStatusArray[i].candidate_status,
            counts: 0,
          });
        }
      }
    }
  }

  const HandleSelfClick = (row) => {
    let data = { status: row.status, teamPage: false };
    dispatch({
      event: "updateglobal_userdata",
      data: JSON.stringify(data),
    });
    setTimeout(() => {
      dispatch({ event: "candidatebystatus" });
    }, 10);
  };

  const HandleTeamClick = (row) => {
    let data = { status: row.status, teamPage: true };
    console.log(data);
    dispatch({
      event: "updateglobal_userdata",
      data: JSON.stringify(data),
    });
    setTimeout(() => {
      dispatch({ event: "candidatebystatus" });
    }, 10);
  };

  return (
    <>
      <Breadcrumb PageName="All Candidate Status" />
      <Row className="mt-4">
        {leadStatusArray.map((item, index) => (
          <Col xs={12} md={3} sm={4} className="mb-4" key={item.status}>
            <StatusCard
              SelfCount={item.counts}
              TeamCount={getTeamCount(item.status)}
              status={item.status || "Undefined Status"}
              isHrCandidateStatus={true}
              bgcolor={index % 2 !== 0 ? "rgb(51, 51, 51)" : "rgb(67, 81, 108)"}
              SelfClick={() => HandleSelfClick(item)}
              TeamClick={() => HandleTeamClick(item)}
              NoUser={true}
            />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default AllCandidateStatus;