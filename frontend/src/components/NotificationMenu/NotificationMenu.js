import React from "react";
import { useQuery } from "react-query";
import dayjs from "dayjs";
import { useBootstrap, useMui } from "../../hooks/Hooks";
import {
  PresentLeadTableDataCount,
  GetPresentLeadsTableData,
} from "../../hooks/Leads/UsePresentLeadsHook";
import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined";
import BellSVG from "../../assets/Image/bell.svg";

import "./NotificationMenu.css";
import { CustomModal } from "../CustomModal/CustomModal";
import LeadDeatils from "../LeadDeatils/LeadDeatils";
import { stringAvatar } from "../../hooks/Function";

const NotificationPopup = ({ dispatch }) => {
  // Destructure Material-UI components from custom hook
  const { NotificationsOutlinedIcon, Button, Divider, Avatar, Badge } =
    useMui();

  const [leadModal, setLeadModal] = React.useState();
  const [leadData, setLeadData] = React.useState(null);

  const { Card, Dropdown } = useBootstrap();

  // Query to fetch present lead data and count
  const PresentLeadData = useQuery(
    "presentleaddata",
    () => {
      return GetPresentLeadsTableData(1, 10);
    },
    {}
  );

  const PresentLeadCount = useQuery(
    "presentleadscount",
    () => {
      return PresentLeadTableDataCount();
    },
    {}
  );

  const limitedPresentLeadData = PresentLeadData.data?.data?.slice(0, 5);

  return (
    <>
      <Dropdown className="notification-wrapper d-flex mx-0">
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          <Badge
            badgeContent={PresentLeadCount.data?.data}
            color="error"
            className="notification-badge"
          >
            <NotificationsOutlinedIcon
              sx={{ color: "#817f91", fontSize: "1.8rem" }}
            />
          </Badge>
        </Dropdown.Toggle>

        <Dropdown.Menu
          component={Card}
          className="notification-menu p-0 rounded"
        >
          <div className="notification-header">
            <h4 style={{ fontSize: "1.125rem" }} className="m-0">
              Notifications
            </h4>
          </div>
          <div className="notification-body text-center">
            {PresentLeadData.data?.data?.length !== 0 ? (
              limitedPresentLeadData?.map((row, i) => {
                return (
                  <div key={i}>
                    <Dropdown.Item
                      className="notification-item"
                      as={Button}
                      onClick={() => {
                        setLeadModal(true);
                        setLeadData(row);
                      }}
                    >
                      <Avatar {...stringAvatar(row.lname)} className="me-2" />
                      <div style={{ whiteSpace: "pre-line" }} className="ms-2">
                        <h6>{row.lname}</h6>
                        <p className="mb-1">
                          {"Today follow up at " +
                            dayjs(row.followup_dt).format("hh:mm A")}
                          <br />
                          {row.pname &&
                            "Follow Up Leads For " + row.pname + "."}
                        </p>
                      </div>
                    </Dropdown.Item>
                    <Divider sx={{ my: 1 }} />
                  </div>
                );
              })
            ) : (
              <div className="no-notification">
                <img src={BellSVG} alt="notification bell" className="w-25" />
                <h6>Hey! You don't have any notifications</h6>
              </div>
            )}
            {PresentLeadData.data?.data?.length > 5 && (
              <Button
                variant="text"
                type="button"
                endIcon={<ArrowRightAltOutlinedIcon />}
                className="view-all-notfication-btn"
                onClick={() => dispatch({ event: "presentlead" })}
              >
                View All Notification
              </Button>
            )}
          </div>
        </Dropdown.Menu>
      </Dropdown>
      <CustomModal
        show={leadModal}
        hideCloseIcon={true}
        ModalSize="lg"
        onHide={() => setLeadModal(false)}
        ModalBody={
          <LeadDeatils
            data={leadData}
            dispatch={dispatch}
            handleClose={() => setLeadModal(false)}
          />
        }
      />
    </>
  );
};

export default NotificationPopup;
