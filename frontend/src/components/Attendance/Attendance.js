import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { useMui } from "../../hooks/Hooks";
import { UserAttendance } from "../../hooks/Attendance/UseAttendanceHook";

const Attendance = ({ AttendanceStatus, onData, showTiming }) => {
  const { Box, Button } = useMui();
  /* Date :- 8-09-2023 
      Author name :- shubham sonkar 
      creating the videoConstraints object to store width and mode of camera
    */
  const videoConstraints = {
    width: 300,
    facingMode: "user",
  };

  const onUserMedia = (e) => {
    console.log(e);
  };
  
  const webcamRef = useRef(null);
  const [url, setUrl] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  
  /* Date :- 8-09-2023 
    Author name :- shubham sonkar
   Capturing the user image using webcamref
  */
  const capturePhoto = React.useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log("Outside Navigator");
    if ("geolocation" in navigator) {
    console.log("Inside Navigator if condition");
      // Prompt user for permission to access their location
      let options = {
        timeout: 10000, // Increase timeout to 10 seconds (default is 0, which means no timeout)
        enableHighAccuracy: true // Request high accuracy location data if available
      };
      navigator.geolocation.getCurrentPosition(
        // Success callback function
        (position) => {
          // Get the user's latitude and longitude coordinates
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          // const heading = position.coords.heading;
          console.log("latitudes", lat, lng);
          // Do something with the location data, e.g. display on a map
          setCurrentLocation(`${lat},${lng}`);
        },
        // Error callback function
        (error) => {
          console.log("Inside Navigator if condition error");
          // Handle errors, e.g. user denied location sharing permissions
          console.error("Error getting user location:", error);
        },
        options
      );
    } else {
    console.log("Inside Navigator else condition");
      // Geolocation is not supported by the browser
      console.error("Geolocation is not supported by this browser.");
    }
    setUrl(imageSrc);
  }, [webcamRef]);

  /* Date :- 8-09-2023 
    Author name :- shubham sonkar
   setting the user attendance depended on the attendance Status
  */
  const SetAttendance = (event) => {
    event.preventDefault();
    // console.log("status",AttendanceStatus);
    // console.log(url);
    UserAttendance(url, AttendanceStatus, currentLocation)
      .then((response) => {
        if (response.status === 200) {
          /* Date :- 9-09-2023 
               Author name :- shubham sonkar
               passing the response data to leftsidebar to update the user attendance status
            */
          onData(response.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Box>
      {url === null ? (
        <>
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            onUserMedia={onUserMedia}
            className="w-100"
          />
          <Box sx={{ textAlign: "center" }} className="mt-3">
            <Button variant="outlined" onClick={capturePhoto}>
              Capture
            </Button>
          </Box>
        </>
      ) : (
        <>
          <img src={url} alt="Screenshot" className="user-attendance-img" />
          <div className="w-100 mt-3 d-flex justify-content-between">
            <Button variant="outlined" onClick={() => setUrl(null)}>
              Retake
            </Button>
            <Button variant="outlined" onClick={SetAttendance}>
              {showTiming ? "Out Time" : "In Time"}
            </Button>
          </div>
        </>
      )}
    </Box>
  );
};

export default Attendance;
