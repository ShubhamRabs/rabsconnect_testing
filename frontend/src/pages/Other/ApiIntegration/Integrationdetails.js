import React from "react";
import "./ApiIntegration.css"; 
import { useBootstrap, useMui } from "../../../hooks/Hooks";
import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";
import Crmlogo from "../../../assets/Image/logo.png";
import CryptoJS from "crypto-js";
import { useSetting } from "../../../hooks/Hooks";
import { useQuery } from "react-query";
import { getPushAPIData } from "../../../hooks/Other/UseApiHook";
import Swal from 'sweetalert2';

const Integrationdetails = ({ dispatch }) => {
  const { globalData } = useSetting();
  const client_code = document.getElementById("client_id").value;
  let CryptoJSKey = globalData.CompanyName + "@" + globalData.Version;

  let bytes = CryptoJS.AES.decrypt(
    localStorage.getItem("updateglobal_userdata"),
    CryptoJSKey
  );

  var user_data = bytes.toString(CryptoJS.enc.Utf8);

  let apiPageData = JSON.parse(user_data);
  // console.log(apiPageData, "apiPageData");

  const { Card, Row, Container } = useBootstrap();
  const {
    Button,
    ArrowForwardIcon,
    Divider,
    WhatsAppIcon,
    EmailOutlinedIcon,
    TabContext,
    Box,
    TabList,
    Tab,
    TabPanel,
    ArrowBackIosIcon,
  } = useMui();

  const [value, setValue] = React.useState(
    apiPageData.pushApi === true ? "1" : "2"
  );
  const [websiteURL, setWebsiteURL] = React.useState("https://www.mywebsite.com");
  // housing
  const [uniqueKey, setUniqueKey] = React.useState("");
  const [housingId, setHousingId] = React.useState("");
  // 99acres
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  
  // const crm_url = 'demo.rabs.support';
  const crm_url = globalData.URL;
  const source_type = apiPageData.source;
  const GetPushAPIData = useQuery("GetPushAPIData", () => {
    return getPushAPIData({'crm_url': crm_url, 'source_type': source_type});
  });

  const apiKey = GetPushAPIData?.data?.data?.api_key['token'];

  console.log(GetPushAPIData?.data?.data?.api_key['token'], "GetPushAPIData");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeURL = (event) => {
    setWebsiteURL(event.target.value);
  }; 
  
  const handleChangeUniqueKey = (event) => {
    setUniqueKey(event.target.value);
  };
  
  const handleChangeHousingId = (event) => {
    setHousingId(event.target.value);
  }; 

  const handleChangeUsername = (event) => {
    setUsername(event.target.value);
  }; 

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  }; 

  const handleWhatsAppClick = () => {
    const websiteURLElement =document.getElementById("website_url");
    if(websiteURLElement && websiteURLElement.value === "" && apiPageData.apiHeading === "Website") {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Please enter website URL',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn btn-warning' // Custom CSS class for OK button
        },
        buttonsStyling: false // Disable default button styling
      });
      return false;
    }

    const housingKeyElement = document.getElementById("housing_unique_key");
    if(housingKeyElement && housingKeyElement.value === "" && apiPageData.apiHeading === "Housing") {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Please enter housing key',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn btn-warning' // Custom CSS class for OK button
        },
        buttonsStyling: false // Disable default button styling
      });
      return false;
    }

    const housingIdElement = document.getElementById("housing_id");
    if(housingIdElement && housingIdElement.value === "" && apiPageData.apiHeading === "Housing") {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Please enter housing Id',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn btn-warning' // Custom CSS class for OK button
        },
        buttonsStyling: false // Disable default button styling
      });
      return false;
    }

    const acresUsernameElement = document.getElementById("99acres_username");
    if(acresUsernameElement && acresUsernameElement.value === "" && apiPageData.apiHeading === "99acres") {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Please enter 99acres username',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn btn-warning' // Custom CSS class for OK button
        },
        buttonsStyling: false // Disable default button styling
      });
      return false;
    }

    const acresPasswordElement = document.getElementById("99acres_password");
    if(acresPasswordElement && acresPasswordElement.value === "" && apiPageData.apiHeading === "99acres") {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Please enter 99acres password',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn btn-warning' // Custom CSS class for OK button
        },
        buttonsStyling: false // Disable default button styling
      });
      return false;
    }

    if((apiPageData.source === "Microsite" || apiPageData.source === "WordPress" || apiPageData.source === "Magicbricks") && apiKey === undefined) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'API Key Not Found, Contact To CRM Administrator',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn btn-warning' // Custom CSS class for OK button
        },
        buttonsStyling: false // Disable default button styling
      });
      return false;
    }
    
    // Format the data into a message string
      let message = "";
    if(apiPageData.source === "Magicbricks" || apiPageData.source === "Microsite") {
        message = `
        Please send my ${apiPageData.apiHeading} leads to RABS Connect CRM.
        ${apiPageData.apiHeading==="Website" ? "My "+apiPageData.apiHeading +" URL is : "+websiteURL : ""}
        The required information is as follows :
        ✔ CRM Name : RABS Connect
        ✔ Push Integration type : POST
        ✔ API Key : ${apiKey}
        ✔ Working Endpoint URL : ${apiPageData.workingEndPoint}
        ✔ Parameters To Be Passed (Sample Payload) : ${apiPageData.samplePayLoad}
        ✔ Complete Eorking Endpoint URL : ${apiPageData.workingEndPoint}
        ✔ Response Message on Lead Sharing : ${apiPageData.apiResponse}
        Please refer to the following RABS Connect API documentation for more details on submitting leads : ${apiPageData.apiDocument}`;
    } else if (apiPageData.source === "WordPress") {
        message = `
        Please send my ${apiPageData.apiHeading} leads to RABS Connect CRM.
        Steps to Connect to WordPress :
        1. Log into your WordPress admin site
        2. Click on Plugins in the left admin panel
        3. Search for Contact Form 7 to find the Contact Form 7 plugin
        4. Click on Activate once the installation is complete
        5. Create the form with contact form 7 and the fields as required.
        6. Required: source_type : Direct, source : WordPress
        7. Required: name, ccode, number, email, pname, other_details
        8. Click on Add New CF7 API and fill all the necessary fields -
          i. Select Contact Form form dropdown
         ii. API URL : ${apiPageData.workingEndPoint}
        iii. Header Request : x-api-key : ${apiKey}
        iv. Header Request : Content-Type : application/json
        v. Input Type : JSON
        vi. Method : POST
        9. Map your Fields - all the fields names should have same as contact form 7 mail page input names that is source_type, source, name,ccode, email, number, pname, other_details
        10. After submit the form result will be shown in logs
        `;
    } else if (apiPageData.source === "Housing") {
        message = `
        Please send my ${apiPageData.apiHeading} leads to RABS Connect CRM.
        My ${apiPageData.apiHeading} Pull API Credentials :
        Client Code : ${client_code}
        Unique Key : ${uniqueKey}
        Id : ${housingId}
        `; 
    } else if (apiPageData.source === "99acres") {
        message = `
        Please send my ${apiPageData.apiHeading} leads to RABS Connect CRM.
        My ${apiPageData.apiHeading} Pull API Credentials :
        Client Code : ${client_code}
        Username : ${username}
        Password : ${password}
        `;        
    }
    
    // Encode the message for use in the URL
    const encodedMessage = encodeURIComponent(message);

    // Construct the WhatsApp link with the encoded message
    let whatsappLink = "";
    if (apiPageData.source === "Housing" || apiPageData.source === "99acres") {
      whatsappLink = `https://web.whatsapp.com/send?phone=+918097727518&text=${encodedMessage}`;
    } else {
      whatsappLink = `https://api.whatsapp.com/send?text=${encodedMessage}`;
    }  

    window.open(whatsappLink);
  };
  
  const handleMailClick = () => {
    const websiteURLElement = document.getElementById("website_url");
    if(websiteURLElement && websiteURLElement.value === "" && apiPageData.apiHeading === "Website") {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Please enter website URL',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn btn-warning' // Custom CSS class for OK button
        },
        buttonsStyling: false // Disable default button styling
      });
      return false;
    }

    const housingKeyElement = document.getElementById("housing_unique_key");
    if(housingKeyElement && housingKeyElement.value === "" && apiPageData.apiHeading === "Housing") {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Please enter housing key',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn btn-warning' // Custom CSS class for OK button
        },
        buttonsStyling: false // Disable default button styling
      });
      return false;
    }

    const housingIdElement = document.getElementById("housing_id");
    if(housingIdElement && housingIdElement.value === "" && apiPageData.apiHeading === "Housing") {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Please enter housing Id',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn btn-warning' // Custom CSS class for OK button
        },
        buttonsStyling: false // Disable default button styling
      });
      return false;
    }

    const acresUsernameElement = document.getElementById("99acres_username");
    if(acresUsernameElement && acresUsernameElement.value === "" && apiPageData.apiHeading === "99acres") {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Please enter 99acres username',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn btn-warning' // Custom CSS class for OK button
        },
        buttonsStyling: false // Disable default button styling
      });
      return false;
    }

    const acresPasswordElement = document.getElementById("99acres_password");
    if(acresPasswordElement && acresPasswordElement.value === "" && apiPageData.apiHeading === "99acres") {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Please enter 99acres password',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn btn-warning' // Custom CSS class for OK button
        },
        buttonsStyling: false // Disable default button styling
      });
      return false;
    }

    if((apiPageData.source === "Microsite" || apiPageData.source === "WordPress" || apiPageData.source === "Magicbricks") && apiKey === undefined) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'API Key Not Found, Contact To CRM Administrator',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn btn-warning' // Custom CSS class for OK button
        },
        buttonsStyling: false // Disable default button styling
      });
      return false;
    }

    const websiteURLLine = apiPageData.apiHeading==="Website" ? "My "+apiPageData.apiHeading +" URL is : "+websiteURL+"%0D%0A" : "";

    // Format the data into a message string
    let emailTo = "";
    if(apiPageData.source === "Magicbricks" || apiPageData.source === "Microsite") {
      emailTo =
      "mailto:" +
      "?subject=RABS Connect CRM Integration Request" +
      "&body=Please send my " +
      apiPageData.apiHeading +
      " leads to RABS Connect CRM.%0D%0A" +
      websiteURLLine +
      "The required information is as follows:%0D%0A" +
      "✔ CRM Name: RABS Connect%0D%0A" +
      "✔ Push Integration Type: POST%0D%0A" +
      "✔ API Key: "+apiKey+"%0D%0A" +
      "✔ Working Endpoint URL: "+apiPageData.workingEndPoint+"%0D%0A" +
      "✔ Parameters To Be Passed (Sample Payload): "+apiPageData.samplePayLoad+"%0D%0A" +
      "✔ Complete working Endpoint URL: "+apiPageData.workingEndPoint+"%0D%0A" +
      "✔ Response Message on Lead Sharing: "+apiPageData.apiResponse+"%0D%0A" +
      "Please refer to the following API documentation for more details on submitting leads: "+apiPageData.apiDocument+"%0D%0A";
    }else if(apiPageData.source === "WordPress") {
      emailTo =
      "mailto:" +
      "?subject=RABS Connect CRM Integration Request" +
      "&body=Please send my " +
      apiPageData.apiHeading +
      " leads to RABS Connect CRM.%0D%0A" +
      "Steps to Connect to WordPress : %0D%0A" +
      "1. Log into your WordPress admin site %0D%0A" +
      "2. Click on Plugins in the left admin panel %0D%0A" +
      "3. Search for Contact Form 7 to find the Contact Form 7 plugin %0D%0A" +
      "4. Click on Activate once the installation is complete %0D%0A" +
      "5. Create the form with contact form 7 and the fields as required. %0D%0A" +
      "6. Required: source_type : Direct, source : WordPress %0D%0A" +
      "7. Required: name, ccode, number, email, pname, other_details %0D%0A" +
      "8. Click on Add New CF7 API and fill all the necessary fields - %0D%0A" +
          "i. Select Contact Form form dropdown %0D%0A" +
         "ii. API URL : "+apiPageData.workingEndPoint+ "%0D%0A" +
        "iii. Header Request : x-api-key :%0D%0A" +apiKey+ "%0D%0A" +
        "iv. Header Request : Content-Type : application/json %0D%0A" +
        "v. Input Type : JSON %0D%0A" +
        "vi. Method : POST %0D%0A" +
        "9. Map your Fields - all the fields names should have same as contact form 7 mail page input names that is source_type, source, name,ccode, email, number, pname, other_details   %0D%0A" +
        "10. After submit the form result will be shown in logs";
    }else if(apiPageData.source === "Housing") {
        emailTo =
        "mailto:technical@rabs.asia" +
        "?subject=Housing Leads Integration to RABS Connect CRM" +
        "&body=Please send my " +
        apiPageData.apiHeading +
        " leads to RABS Connect CRM.%0D%0A" +
        "My Housing Pull API Credentials : %0D%0A" +
        "Client Code : "+client_code+" %0D%0A" +
        "Unique Key : "+uniqueKey+" %0D%0A" +
        "Id : "+housingId+ " %0D%0A" ;
    }else if(apiPageData.source === "99acres") {
        emailTo =
        "mailto:technical@rabs.asia" +
        "?subject=99acres Leads Integration to RABS Connect CRM" +
        "&body=Please send my " +
        apiPageData.apiHeading +
        " leads to RABS Connect CRM.%0D%0A" +
        "My 99acres Pull API Credentials : %0D%0A" +
        "Client Code : "+client_code+" %0D%0A" +
        "Username : "+username+" %0D%0A" +
        "Password : "+password+ " %0D%0A" ;       
    }
     
      window.open(emailTo, "_blank");
  };

  return (
    <>
      <Breadcrumb
        PageName="Integration Details"
        BackButton={[
          true,
          "Back",
          <ArrowBackIosIcon />,
          () =>
            dispatch({
              event:
                localStorage.getItem("previousScreen") ===
                localStorage.getItem("currScreen")
                  ? "apiintegration"
                  : localStorage.getItem("previousScreen"),
            })
        ]}
      />
      <Container>
        <Row className="mt-2">
          <Card>
            <Card.Body>
              <h3 className="text-center mb-4 mt-3">
                {apiPageData.apiHeading} Integration
              </h3>
              <div className="intergration-col mb-4">
                <img
                  src={apiPageData.imageUrl}
                  className="intergration-img"
                  alt={apiPageData.apiHeading}
                  height={50}
                  width={50}
                />
                <ArrowForwardIcon />

                <img
                  src={Crmlogo}
                  className="intergration-img"
                  alt="Rabs Connect Logo"
                  height={50}
                  width={130}
                />
              </div>

              <Divider className="mb-2" />

              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                    centered
                  >
                    {apiPageData.pushApi === true && <Tab label="Push Api" value="1" />}
                    {apiPageData.pullApi === true && <Tab label="Pull Api" value="2" />}
                  </TabList>
                </Box>

                {/* Push Api Tab Start */}
                {apiPageData.pushApi === true && (
                 <TabPanel value="1">
                  <div className="intergration-body">
                    <br/>
                    
                    <h5 className="mb-3">{apiPageData.apiDescriptionLine1}</h5>

                    <h6 className="mb-3">{apiPageData.apiDescriptionLine2}</h6>

                    <h6 className="mb-3">{apiPageData.apiDescriptionLine3}</h6>

                    <h6 className="mb-3">{apiPageData.apiDescriptionLine4}</h6>
                    
                    {apiPageData.apiHeading === "Website" && (
                      <input
                      type="text" name="website_url" id="website_url" placeholder="Enter Website URL" onChange={handleChangeURL} className="form-control input-field"/> 
                    )}

                    <div className="scrollable-content mockup-font ">
                      <p className="mb-4">
                        Please send my {apiPageData.apiHeading} leads to RABS Connect CRM.
                      </p>

                      {apiPageData.apiHeading === "Website" && (
                      <p className="mb-4">
                        {apiPageData.websiteURL} : {websiteURL}
                      </p>
                      )}
                      
                      {(apiPageData.source === "Magicbricks" || apiPageData.source === "Microsite") && (
                      <p>
                        The required information is as follows : <br/>
                        ✔ CRM Name : RABS Connect <br/>
                        ✔ Push Integration Type : POST <br/>
                        ✔ API Key : <code>{apiKey?apiKey: "Not Found"}</code> <br/>
                        ✔ Working Endpoint URL : {apiPageData.workingEndPoint}<br/>
                        ✔ Parameters To Be Passed (Sample Payload) : <br/>
                        <code>{apiPageData.samplePayLoad}</code> <br/>
                        ✔ Complete Working Endpoint URL : {apiPageData.workingEndPoint}<br/>
                        ✔ Response Message on Lead Sharing : {apiPageData.apiResponse}
                      </p>
                      )}

                      {(apiPageData.source === "WordPress") && (
                      <p>
                        Steps to Connect to WordPress : 
                        <ol>
                          <li>Log into your WordPress admin site</li>
                          <li>Click on Plugins in the left admin panel</li>
                          <li>Search for Contact Form 7 to find the Contact Form 7 plugin</li>
                          <li>Click on Activate once the installation is complete</li>
                          <li>Create the form with contact form 7 and the fields as required.</li>
                          <li>Required: source_type : Direct, source : WordPress</li>
                          <li>Required: name, ccode, number, email, pname, other_details</li>
                          <li>Click on Add New CF7 API and fill all the necessary fields -
                            <ul style={{paddingLeft:"1rem",listStyle:"square"}}>
                              <li>Select Contact Form form dropdown</li>
                              <li>API URL : {apiPageData.workingEndPoint}</li>
                              <li>Header Request : x-api-key : <code>{apiKey?apiKey: "Not Found"}</code></li>
                              <li>Header Request : Content-Type : application/json</li>
                              <li>Input Type : JSON</li>
                              <li>Method : POST</li>
                            </ul>
                          </li>
                          <li>Map your Fields - Put your Api field names to map with your contact form that is  source_type, source, name, ccode, number, email, pname, other_details</li>
                          <li>After submit the form result will be shown in logs</li>
                          <li>Response : {apiPageData.apiResponse}</li>
                        </ol>
                      </p>
                      )}

                      <p className="mt-4">
                        Please refer to the following API
                        documentation for more details on submitting leads : 
                        <a
                          href={apiPageData.apiDocument}
                          style={{ textDecoration: "none" }}
                          target="_blank"
                          rel="noreferrer"
                        > API Documentation</a>
                      </p>
                      <p>
                        {apiPageData.apiDescriptionLastLine}
                      </p>
                    </div>

                    <div className="d-flex align-item-center justify-content-evenly mb-3 mt-3">
                      <Button
                        variant="contained"
                        color="success"
                        className="me-auto"
                        startIcon={<WhatsAppIcon />}
                        onClick={handleWhatsAppClick}
                      >
                        Send Via WhatsApp
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        className="ms-auto"
                        startIcon={<EmailOutlinedIcon />}
                        onClick={handleMailClick}
                      >
                        Send Via Mail
                      </Button>
                    </div>

                    <p className="mb-2">
                      Connect to RABS Connect CRM by submitting a request directly to
                      your {apiPageData.apiHeading} Account Manager.
                    </p>
                  </div>
                 </TabPanel>
                )}
                {/* Pull API Tab Start */}
                {apiPageData.pullApi === true && (
                <TabPanel value="2">
                  <div className="intergration-body">
                    <br/>
                    
                    <h5 className="mb-3">{apiPageData.apiDescriptionLine1}</h5>

                    <h6 className="mb-3">{apiPageData.apiDescriptionLine2}</h6>
                    
                    {apiPageData.source === "Housing" && (
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <input
                          type="text" name="unique_key" id="housing_unique_key" placeholder="Enter Housing Unique Key" onChange={handleChangeUniqueKey} className="form-control input-field"/>
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text" name="housing_id" id="housing_id" placeholder="Enter Housing Id" onChange={handleChangeHousingId} className="form-control input-field"/>
                      </div>
                    </div>
                    )}

                    {apiPageData.source === "99acres" && (
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <input
                          type="text" name="username" id="99acres_username" placeholder="Enter 99acres Username" onChange={handleChangeUsername} className="form-control input-field"/>
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text" name="password" id="99acres_password" placeholder="Enter 99 acres Password" onChange={handleChangePassword} className="form-control input-field"/>
                      </div>
                    </div>
                    )}
                    
                    <div className="scrollable-content mockup-font">
                      
                      <p className="mb-4">
                        Please send my {apiPageData.apiHeading} leads to RABS Connect CRM.
                      </p>

                      <p>
                        My {apiPageData.apiHeading} Pull API Credentials: <br/>
                        Client Code: <code>{client_code}</code> <br/>
                        {apiPageData.source === "Housing" && (
                        <>
                        Unique Key: <code>{uniqueKey}</code> <br/>
                        Id: <code>{housingId}</code><br/>
                        </>
                        )}

                        {apiPageData.source === "99acres" && (
                        <>  
                        Username: <code>{username}</code> <br/>
                        Password: <code>{password}</code><br/>
                        </>
                        )}
                      </p>

                    </div> 
                    <div className="d-flex align-item-center justify-content-evenly mb-3 mt-3">
                      <Button
                        variant="contained"
                        color="success"
                        className="me-auto"
                        startIcon={<WhatsAppIcon />}
                        onClick={handleWhatsAppClick}
                      >
                        Send Via WhatsApp
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        className="ms-auto"
                        startIcon={<EmailOutlinedIcon />}
                        onClick={handleMailClick}
                      >
                        Send Via Mail
                      </Button>
                    </div>

                    <p className="mb-2">
                      Connect to RABS Connect CRM by submitting a request directly to
                      your CRM Account Manager.
                    </p>
                           
                  </div>
                </TabPanel>
                )}
                
              </TabContext>
            </Card.Body>
          </Card>
        </Row>
      </Container>
    </>
  );
};

export default Integrationdetails;
