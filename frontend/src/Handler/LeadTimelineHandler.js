import React from "react";
import { useMui } from "../hooks/Hooks";
import { useQuery } from "react-query";
import { getLeadCallData, getLeadData } from "../hooks/Leads/useCallLogHook";
import { MessageSquareMore, Flame, Phone } from "lucide-react";
import dayjs from "dayjs";
import { CustomDescription } from "../components/Common/Common";

const LeadTimelineHandler = ({ LeadDetails }) => {
  const {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
  } = useMui();

  let mergedData = [];
  let transformedData = [];

  const leadCallHistory = useQuery(
    "leadCallHistory-" + LeadDetails.l_id,
    () => getLeadCallData(LeadDetails.l_id)
  );

  const leadsDetail = useQuery(
    "leadsDetail-" + LeadDetails.l_id,
    () => getLeadData(LeadDetails.l_id)
  );

  const formatCallDate = (callDate) => {
    return dayjs(callDate).format("MMM DD, YYYY hh:mm A");
  };

  const extractDate = (title) => {
    const dateRegex =
      /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b\s*\d{1,2},\s*\d{4}\s*\d{1,2}:\d{2}\s*(?:AM|PM)/i;
    const match = title?.match(dateRegex);
    return match ? match[0].replace(/\s+/g, " ").trim() : "";
  };

  const formatCommentAndCallDate = (callDate) => {
    const date = dayjs(callDate, "MMM DD, YYYY hh:mm A");
    const now = dayjs();
    const startOfToday = now.startOf("day");
    const startOfYesterday = startOfToday.subtract(1, "day");

    if (date.isSame(startOfToday, "day")) {
      return `Today ${date.format("hh:mm A")}`;
    } else if (date.isSame(startOfYesterday, "day")) {
      return `Yesterday ${date.format("hh:mm A")}`;
    } else {
      return date.format("MMM DD, YYYY hh:mm A");
    }
  };

  const transformLeadHistory = (status, index) => ({
    description: `${status?.split("|")[0]}`,
    description2: `${status?.split("|")[1]}`,
    title: `By ${leadsDetail?.data?.data[0]?.leads_history_users?.split(",")[index]
      }, ${formatCallDate(status?.split("|")[2])}`,
    type: "history",
    color:
      leadsDetail?.data?.data[0]?.leads_history_color?.split(",")[index],
  });

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const transformCallHistory = (call) => ({
    description: `Call Duration: ${formatTime(call.call_duration)}`,
    title: `By ${call.username}, ${formatCallDate(call.call_datetime)}`,
    type: "call",
  });

  const transformComments = (rawComments) => {
    return rawComments
      ?.split("~")
      .map((comment) => {
        const [dateStr, message] = comment.split("=");
        const formattedDate = dayjs(dateStr, "MMM DD, YYYY hh:mm A").isValid()
          ? formatCallDate(dateStr)
          : "";

        if (!message || !formattedDate) return null;

        return {
          description: message,
          title: `Comment on ${formattedDate}`,
          type: "comment",
        };
      })
      .filter(Boolean);
  };

  if (!leadCallHistory.isLoading && leadsDetail.data) {
    const rawComments = leadsDetail?.data?.data[0]?.all_comments;
    const commentsData = transformComments(rawComments);

    mergedData = [
      ...leadCallHistory?.data?.data?.map(transformCallHistory),
      ...(leadsDetail?.data?.data[0]?.leads_history?.split(",")?.length > 0
        ? leadsDetail?.data?.data[0]?.leads_history?.split(",")?.map(transformLeadHistory)
        : []),
      ...(commentsData || []),
    ];

    mergedData.sort((a, b) => {
      const dateAString = extractDate(a?.title);
      const dateBString = extractDate(b?.title);
      const date1 = dayjs(dateAString, "MMM DD, YYYY hh:mm A").toDate();
      const date2 = dayjs(dateBString, "MMM DD, YYYY hh:mm A").toDate();
      return date2.getTime() - date1.getTime();
    });

    transformedData = mergedData.map((activityData) => {
      const titlePrefix = activityData?.title?.includes("By")
        ? activityData?.title?.split(", ")[0]
        : activityData?.title?.split(": ")[0];

      let transformedDate = extractDate(activityData?.title);
      let isDateValid = dayjs(transformedDate, "MMM DD, YYYY hh:mm A").isValid();

      if (!isDateValid) {
        let parts = transformedDate.split(" ");
        let addedZero = parts[2]?.length < 5 ? "0" + parts[2] : parts[2];
        let date = parts[1]?.replace(/,(?!\s)/, ", ");
        transformedDate = `${parts[0]} ${date} ${addedZero} ${parts[3]}`;
      }

      transformedDate = formatCommentAndCallDate(transformedDate);

      const newTitle = activityData?.title?.includes(":") &&
        !activityData?.title?.includes("By")
        ? `${transformedDate}`
        : `${titlePrefix} ${transformedDate}`;

      return {
        ...activityData,
        title: newTitle,
      };
    });
  }

  return (
    <Timeline className="comment-timeline mt-3">
      <div style={styles.commentsContainer}>
        {transformedData.map((comment, i) => (
          <TimelineItem key={i} className="mb-2">
            <TimelineSeparator>
              <div
                className="comment-icon"
                style={{
                  backgroundColor:
                    comment?.type === "call"
                      ? "#10aabe"
                      : comment?.type === "history"
                        ? comment?.color
                        : "#6c6e7a",
                }}
              >
                {comment?.type === "call" ? (
                  <Phone color={"#fff"} size={18} />
                ) : comment?.type === "history" ? (
                  <Flame color="#fff" size={18} />
                ) : (
                  <MessageSquareMore color="#fff" size={18} />
                )}
              </div>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent className="comment-content">
              <h6 className="custom-subtitle fw-500" style={{ fontSize: "14px" }}>
                {comment.title}
              </h6>
              <CustomDescription
                style={{ marginBottom: "5px" }}
                Description={comment.description}
              />
              {comment.description2 && (
                <CustomDescription
                  style={{
                    marginBottom: "5px",
                    wordBreak: "break-word",
                  }}
                  Description={comment.description2}
                />
              )}
            </TimelineContent>
          </TimelineItem>
        ))}
      </div>
    </Timeline>
  );
};

const styles = {
  commentsContainer: {
    display: "flex",
    flexDirection: "column",
  },
};

export default LeadTimelineHandler;
