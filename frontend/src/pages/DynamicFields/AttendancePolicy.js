import React, { useMemo } from "react";
import { useQuery } from "react-query";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat'
import DatePicker, { DateObject } from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";

import "./AttendancePolicy.css";
import { AttendancePolicyColumns } from "../../data/Columns/DynamicFields/AttendancePolicyColumns";
import {
  GetAllAttendancePolicy,
  GetCalendarApi,
  useEditAttendancePolicy,
} from "../../hooks/DynamicFields/useAttendancePolicyHook";
import { useBootstrap, useMui } from "../../hooks/Hooks";
import { getActionPrevilege } from "../../setting/ActionModulePrevileges";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import SmallDataTable from "../../components/SmallDataTable/SmallDataTable";
import { CustomModal } from "../../components/CustomModal/CustomModal";
import { Formik, Form } from "formik";
import {
  CustomFormGroup,
  CustomInputField,
  CustomMultipleSelectField,
  CustomSelectField,
} from "../../components/FormUtility/FormUtility";
import { AttendancePolicySchema } from "../../schema/DynamicFields";

const AttendancePolicy = () => {
  const { Row, Col, Card } = useBootstrap();
  const { LoadingButton, Divider, Alert, EditIcon } = useMui();

  const [ID, setID] = React.useState();
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(null); // New state for success message
  const [colorPicker, setColorPicker] = React.useState("");
  const [color, setColor] = useColor(colorPicker);
  const [dates, setDates] = React.useState([]);
  const [showModal, setShowModal] = React.useState({
    type: "Add",
    show: false,
  });
  const [holidayDates, setHolidayDates] = React.useState([]);
  const [isHolidayEdit, setIsHolidayEdit] = React.useState(false);

  const format = "MM/DD/YYYY";

  // Get Dynamic action previlege
  const memoizedDynamicFieldActionPrevilege = useMemo(
    () => getActionPrevilege("Dynamic Fields"),
    []
  );

  const DynamicActionPrevilege = memoizedDynamicFieldActionPrevilege;

  const formatTime = (timeString) => {
    const formattedTime = dayjs(`1970-01-01 ${timeString}`).format(' HH:mm');
    return formattedTime.trim();
  }

  const AllAttendancePolicy = useQuery("AllAttendancePolicy", () => {
    return GetAllAttendancePolicy();
  });

  const initialValues = {
    policy: (ID?.title === "Intime" || ID?.title === "Outtime") ? formatTime(ID?.policy) : ID?.policy || "",
    title: ID?.title || "",
    status: ID?.status || "ON",
    latemarkintime: ID?.policy ? ID?.policy.split(",")[0] : "",
    latemarkouttime: ID?.policy ? ID?.policy.split(",")[1] : "",
    holiday_title: ID?.title === "Public Holidays" ? isHolidayEdit ? isHolidayEdit : "" : "",
    publicholidays: ID?.title === "Public Holidays" ? ID?.policy.split(",").map(dt => {
      let date = dayjs(dt, format);
      let day = date.date();
      let month = date.month() + 1;
      return new DateObject().set({ day, month, format })
    }) : "",
    start_date:Number(ID?.policy)
  };


  const GetCalenderHolidays = useQuery("GetCalenderHolidays", () => {
    return GetCalendarApi()
  },
    {
      refetchOnWindowFocus: false,
      refetchOnmount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: "86400000",
      onSuccess: (data) => {
        // console.log("data", data);
        if (holidayDates.length === 0) {
          const hashMap = new Map();
          data.items.forEach((dt) => {
            const hashValue = {
              summary: dt.summary,
              description: dt.description
            }
            hashMap.set(dt.start.date, hashValue);
            // hashMap.set(dt.start.date, dt.summary);
          })
          setHolidayDates(hashMap);
        }
      },
    },
  );

  const { mutate, isLoading } = useEditAttendancePolicy();
  dayjs.extend(customParseFormat);

  const HandleSubmit = (values) => {
    let params = { ...values, color: color.hex, id: ID.id, title: ID.title };
    if (ID.title === "Public Holidays") {
      let datesArray = dates.length > 0 ? dates : values.publicholidays;
      let holidayValues = datesArray.map(dt => {
        let holidayFormatDay = dayjs(dt).format('YYYY-MM-DD');
        let formatDay = dayjs(dt).format(format);
        if (holidayDates.has(holidayFormatDay)) {
          return `${formatDay}:${holidayDates.get(holidayFormatDay).summary}`;
        } else {
          return `${formatDay}:Holiday`;
        }
      })
      params = { ...values, policy: dates.length === 0 ? holidayValues : holidayValues, color: color.hex, id: ID.id, title: ID.title };
    }
    if (ID.title === "Intime" || ID.title === "Outtime") {
      params = { ...values, color: "", id: ID.id, title: ID.title };
    }
    // console.log("hello", params);
    if (color.hex !== undefined || ID.title === "Intime" || ID.title === "Outtime") {
      mutate(params, {
        onSuccess: (data) => {
          AllAttendancePolicy.refetch();
          // setColor(undefined);
          setShowModal({ type: "Add", show: false });
          setShowSuccessMessage(data);
          setTimeout(() => {
            setShowSuccessMessage(null);
          }, 3000);
        },
      });
    }
  };

  const HandleEditFun = (data) => {
    setShowModal({
      type: "Edit",
      show: true,
    });
    setID(data);
    setColorPicker(data.color);
    if (data.title === "Public Holidays") {
      let datesArray = data.policy.split(",");
      datesArray.forEach(dt => {
        let splitDate = dt.split(":")[0];
        let holidayTitle = dt.split(":")[1];
        let holidayFormatDay = dayjs(splitDate).format('YYYY-MM-DD');
        let hashValues = {
          summary: holidayTitle,
          description: holidayDates.has(holidayFormatDay) ? holidayDates.get(holidayFormatDay).description : "Normal"
        };
        holidayDates.set(holidayFormatDay, hashValues);
        // return holidayFormatDay;
      })
    }
    // setColor(prevState => ({ ...prevState, hex: data.color }));
  };

  return (
    <>
      <Breadcrumb PageName="Attendance Policy" />
      <Card>
        <Card.Body>
          <Card.Title>All Attendance Policies</Card.Title>
          <Divider />
          {showSuccessMessage && (
            <Alert severity="info">{showSuccessMessage}</Alert>
          )}
          {!AllAttendancePolicy.isLoading ? (
            <SmallDataTable
              columns={AttendancePolicyColumns}
              data={AllAttendancePolicy.data}
              handleEdit={HandleEditFun}
              actionModulePrevilege={DynamicActionPrevilege}
            />
          ) : null}
        </Card.Body>
      </Card>
      <CustomModal
        show={showModal.show}
        onHide={() => setShowModal(false)}
        ModalTitle={
          showModal.type === "Edit" ? "Edit Lead Status" : "Add Lead Status"
        }
        ModalBody={
          <Formik
            initialValues={initialValues}
            validationSchema={AttendancePolicySchema}
            onSubmit={HandleSubmit}
          >
            {({ values, setFieldValue, errors }) => {
              return (
                <Form>
                  <Row>
                    <Col md={12}>
                      <h3 className="custom-form-label">
                        Attendance Policy <span className="required-label">*</span>
                      </h3>
                      <CustomInputField
                        type="hidden"
                        name="title"
                      />
                      {(ID?.title === "Full Day" || ID?.title === "Half Day") && (
                        <CustomFormGroup
                          formlabel="No. of Hours"
                          star="*"
                          xs={12}
                          md={12}
                          FormField={
                            <CustomInputField
                              type="number"
                              name="policy"
                              placeholder="Enter No. of Hours"
                            />
                          }
                        />
                      )}
                      {ID?.title === "Weekly OFF" && (
                        <CustomFormGroup
                          formlabel="Weekly Off Days"
                          star="*"
                          xs={12}
                          md={12}
                          FormField={
                            <>
                              <CustomMultipleSelectField
                                name="policy"
                                placeholder="Select Days"
                                options={[
                                  { label: "Saturday", value: "Saturday" },
                                  { label: "Sunday", value: "Sunday" },
                                  { label: "Monday", value: "Monday" },
                                  { label: "Tuesday", value: "Tuesday" },
                                  { label: "Wednesday", value: "Wednesday" },
                                  { label: "Thursday", value: "Thursday" },
                                  { label: "Friday", value: "Friday" },
                                ]}
                                isLabelValue={true}
                                FieldValue={setFieldValue}
                                values={values}
                                initialValue={
                                  initialValues.policy !== ""
                                    ? initialValues.policy.split(",").map(value => ({ label: value, value: value }))
                                    : []
                                }
                                required
                              />
                              <p className="error">{errors.policy}</p>
                            </>
                          }
                        />
                      )}
                      {ID?.title === "Late Mark" && (
                        <>
                          <CustomFormGroup
                            formlabel="In Time Late Mark"
                            star="*"
                            xs={12}
                            md={12}
                            FormField={
                              <CustomInputField
                                type="number"
                                name="latemarkintime"
                                placeholder="Enter No. of Minutes"
                                label="Latemark"
                              />
                            }
                          />
                          <CustomFormGroup
                            formlabel="Out Time Late Mark"
                            star="*"
                            xs={12}
                            md={12}
                            FormField={
                              <CustomInputField
                                type="number"
                                name="latemarkouttime"
                                placeholder="Enter No. of Minutes"
                                label="Latemark"
                              />
                            }
                          />
                        </>
                      )}
                      {(ID?.title === "Intime" || ID?.title === "Outtime") && (
                        <CustomFormGroup
                          formlabel="In Time"
                          star="*"
                          xs={12}
                          md={12}
                          FormField={
                            <CustomInputField
                              type="time"
                              name="policy"
                            />
                          }
                        />
                      )}
                      {ID?.title === "Public Holidays" && (
                        <CustomFormGroup
                          formlabel="Select Dates"
                          xs={12}
                          md={12}
                          FormField={
                            <DatePicker
                              value={values.publicholidays}
                              onChange={setDates}
                              name="publicholidays"
                              multiple
                              sort
                              format="DD-MM-YYYY"
                              calendarPosition="bottom-center"
                              plugins={[<DatePanel style={{ minWidth: "350px" }}
                                formatFunction={({ date, format, index }) => {
                                  // Check if the current date is selected
                                  let datesArray = dates.length > 0 ? dates : values.publicholidays;
                                  const isSelected = datesArray.some(selectedDate => {
                                    const selectDate = dayjs(selectedDate);
                                    const currentDate = dayjs(date.toDate());
                                    return currentDate.isSame(selectDate, 'day')
                                  });

                                  // If the date is selected, render it with a title
                                  if (isSelected) {
                                    return (
                                      <>
                                        <p style={{ backgroundColor: 'transparent' }} className="m-0">
                                          <span style={{ textWrap: "nowrap" }}>
                                            {date.format(format)} &nbsp;
                                          </span>
                                          <span>
                                            {holidayDates.has(date.format("YYYY-MM-DD")) ? holidayDates.get(date.format("YYYY-MM-DD")).summary : "Holiday"}
                                          </span>
                                          <span onClick={() => {
                                            setIsHolidayEdit(date.format(format));
                                          }}>
                                            <EditIcon sx={{ fontSize: "15px", float: "right", marginTop: "3px" }} />
                                          </span>
                                          <div className={isHolidayEdit === date.format(format) ? "d-block" : "d-none"}>
                                            <CustomInputField type="text" name="holiday_title" className="p-1 my-1" />
                                            <LoadingButton className="my-1" color="error" sx={{ background: "#d32f2f !important" }} onClick={() => {
                                              const hashValues = {
                                                summary: values.holiday_title,
                                                description: "Normal"
                                              };
                                              holidayDates.set(date.format("YYYY-MM-DD"), hashValues);
                                              setIsHolidayEdit(false);
                                            }}>
                                              Edit
                                            </LoadingButton>
                                            <LoadingButton className="my-1 mx-3" color="error" sx={{ background: "#d32f2f !important" }} onClick={() => { setIsHolidayEdit(false) }}>
                                              Cancel
                                            </LoadingButton>
                                          </div>
                                        </p>
                                      </>
                                    )
                                  }
                                  // Otherwise, render the date normally
                                  return date.format(format);
                                }} />]}
                              mapDays={({ date, today }) => {
                                let props = {};
                                let description = "";
                                let isHoliday = holidayDates.has(date.format("YYYY-MM-DD"));
                                if (isHoliday) {
                                  props.title = holidayDates.get(date.format("YYYY-MM-DD")).summary;
                                  description = holidayDates.get(date.format("YYYY-MM-DD")).description;
                                  props.className = description === "Public holiday" ? "public-holiday" : "non-public-holiday"; // Add custom CSS class for holidays
                                }
                                return props;
                              }}
                            />
                          }
                        />
                      )}
                                   {(ID?.title === "Salary Month") ? null :
                        <CustomFormGroup
                          formlabel="Select Status"
                          star="*"
                          xs={12}
                          md={12}
                          FormField={
                            <>
                              <CustomSelectField
                                name="status"
                                placeholder="Select Status"
                                options={[
                                  { value: "ON", label: "ON" },
                                  { value: "OFF", label: "OFF" },
                                ]}
                                FieldValue={setFieldValue}
                                values={values}
                                isLabelValue={true}
                                initialValue={
                                  initialValues.status !== ""
                                    ? { value: initialValues.status, label: initialValues.status }
                                    : []
                                }
                                required
                                disabled={ID.title === 'Intime' || ID.title === 'Outtime'}
                              />
                              {errors.status && <p className="error">{errors.status}</p>}
                            </>
                          }
                        />
                        }
                      <CustomFormGroup
                        formlabel="Select Status"
                        star="*"
                        xs={12}
                        md={12}
                        FormField={
                          <>
                            <CustomSelectField
                              name="status"
                              placeholder="Select Status"
                              options={[
                                { value: "ON", label: "ON" },
                                { value: "OFF", label: "OFF" },
                              ]}
                              FieldValue={setFieldValue}
                              values={values}
                              isLabelValue={true}
                              initialValue={
                                initialValues.status !== ""
                                  ? { value: initialValues.status, label: initialValues.status }
                                  : []
                              }
                              required
                              disabled={ID.title === 'Intime' || ID.title === 'Outtime'}
                            />
                            {errors.status && <p className="error">{errors.status}</p>}
                          </>
                        }
                      />
                    </Col>
                    {(ID?.title === "Intime" || ID?.title === "Outtime") ? null :
                      <Col md={12} className="mt-3">
                        <h3 className="custom-form-label">
                          Status Colour <span className="required-label">*</span>
                        </h3>
                        <ColorPicker
                          widht="100%"
                          height={100}
                          color={color}
                          onChange={setColor}
                          hideInput={["rgb", "hsv"]}
                        />
                        <div
                          className="status-color-card"
                          style={{
                            background: color.hex,
                            marginTop: "10px",
                          }}
                        ></div>

                        {color.hex === undefined ? (
                          <p className="error">Please select the color</p>
                        ) : null}
                      </Col>
                    }
                    {ID?.title === "Salary Month" && (
                      <>
                        <CustomFormGroup
                          formlabel="Enter Date"
                          xs={12}
                          md={12}
                          FormField={
                            <CustomInputField
                              type="text"
                              name="start_date"
                              label="Date"
                            // value={values.date}
                            />
                          }
                        />
                        {/* {console.log(values.start_date,"date")} */}
                        <CustomFormGroup
                          formlabel="End Date"
                          xs={12}
                          md={12}
                          FormField={
                            <CustomInputField
                              type="text"
                              name="final_date"
                              label="Date"
                              disabled
                              value={values.start_date == "1" ? `${1} - End of month` : `${values.start_date} - ${values.start_date - 1}`}
                            />
                          }
                        />
                      </>
                    )}
                  </Row>
                  <div className="text-center mt-3">
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      loading={isLoading}
                    >
                      Edit Policy
                    </LoadingButton>
                  </div>
                </Form>
              )
            }}
          </Formik>
        }
      />
    </>
  );
};

export default AttendancePolicy;
