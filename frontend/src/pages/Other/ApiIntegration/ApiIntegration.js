import React from "react";
import "./ApiIntegration.css"; 
import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";
import { useSetting, useBootstrap, useMui } from "../../../hooks/Hooks";
import MagicBricks from "../../../assets/Image/source/magicbricks.png";
import Website from "../../../assets/Image/source/website.png";
import Wordpress from "../../../assets/Image/source/wordpress.png";
import Facebook from "../../../assets/Image/source/facebook.png";
import Housing from "../../../assets/Image/source/housing.png";
import Acres from "../../../assets/Image/source/acres.png";

const ApiIntegration = ({ dispatch }) => {
  const { globalData } = useSetting();
  const { Card, Row, Container, Col } = useBootstrap();
  const { Button } = useMui();

  let crm_countries = document.getElementById('crm_countries');
  let ApiIntegrationData = [
    {
      id: 4,
      pullApi: false,
      pushApi: true,
      imageUrl: Website,
      connectBtnName: "Configure",
      connectionStatus: "",
      source: "Microsite",
      apiHeading: "Website",
      apiDescriptionLine1:"Receive new leads from your website contact form in your RABS Connect CRM",
      apiDescriptionLine2:"Get instant alerts when a new lead is submitted on your website, with the contact auto-created in your RABS Connect CRM for immediate follow up.",
      apiDescriptionLine3:"Connect to RABS Connect by submitting a request directly to your Website Account Manager.",
      apiDescriptionLine4:"Please forward them the following instructions.",
      websiteURL: "My Website URL is ",
      fieldName: "URL",
      workingEndPoint: 'https://'+globalData.URL+'/leads_api.php',
      samplePayLoad: `{"source_type" => "Direct", "source" => "Lead Package", "name" => "Lead Name", "ccode" => "91", "number" => "9999999999", "email" => "leadmail@gmail.com", "pname" => "Project Name", "other_details" => ""}`,
      apiResponse: "Success: {'status':'200', 'msg':'Entry Successfully Generated'}, Failure: {'status':'400', 'msg':'Please provide valid entries'}",
      apiDocument: "https://rabsdigital.com/api/microsite/microsite_api.pdf",
      apiDescriptionLastLine: "Your integration should be activated by the website team, share the details by click on the button below. Once the integration is active you will start receiving leads directly in your RABS Connect CRM.",
    },
    {
      id: 5,
      pullApi: false,
      pushApi: true,
      imageUrl: Wordpress,
      connectBtnName: "Configure",
      connectionStatus: "",
      source: "WordPress",
      apiHeading: "WordPress Website",
      apiDescriptionLine1:"Receive new leads from your WordPress contact form in your RABS Connect CRM",
      apiDescriptionLine2:"Get instant alerts when a new lead is submitted on your WordPress website, with the contact auto-created in your RABS Connect CRM for immediate follow up.",
      apiDescriptionLine3:"Connect to RABS Connect by submitting a request directly to your WordPress Website Account Manager.",
      apiDescriptionLine4:"Please forward them the following instructions.",
      apiDescriptionLastLine: "Your integration should be activated by the website team, share the details by click on the button below. Once the integration is active you will start receiving leads directly in your RABS Connect CRM.",
      workingEndPoint: 'https://'+globalData.URL+'/leads_api.php',
      apiResponse: "Success: {'status':'200', 'msg':'Entry Successfully Generated'}, Failure: {'status':'400', 'msg':'Please provide valid entries'}",
      apiDocument: "https://rabsdigital.com/api/wordpress/wordpress_api.pdf",
    },
    {
      id: 6,
      pullApi: false,
      pushApi: false,
      imageUrl: Facebook,
      connectBtnName: "Configure",
      connectionStatus: "",
      source: "Facebook",
      apiHeading: "Facebook",
      apiDescriptionLine1:"Receive new leads from Facebook Lead in your RABS Connect CRM",
    },
  ];
  if(crm_countries.value.includes('India')) {
    ApiIntegrationData.push(
      {
        id: 1,
        pullApi: true,
        pushApi: false,
        imageUrl: Acres,
        connectBtnName: "Configure",
        connectionStatus: "",
        source: "99acres",
        apiHeading: "99acres",
        apiDescriptionLine1:"Receive new leads from 99acres in your RABS Connect CRM",
        apiDescriptionLine2: "Forward Instructions to your CRM Account Manager",
      },
      {
        id: 2,
        pullApi: true,
        pushApi: false,
        imageUrl: Housing,
        connectBtnName: "Configure",
        connectionStatus: "",
        source: "Housing",
        apiHeading: "Housing",
        apiDescriptionLine1:"Receive new leads from Housing in your RABS Connect CRM",
        apiDescriptionLine2: "Forward Instructions to your CRM Account Manager",
      },
      {
        id: 3,
        pullApi: false,
        pushApi: true,
        imageUrl: MagicBricks,
        connectBtnName: "Configure",
        connectionStatus: "",
        source: "Magicbricks",
        apiHeading: "MagicBricks",
        apiDescriptionLine1:"Receive new leads from MagicBricks in your RABS Connect CRM",
        apiDescriptionLine2: "Forward Instructions to your Account Manager",
        apiDescriptionLine3: "Connect to RABS Connect by submitting a request directly to your MagicBricks Account Manager.",
        apiDescriptionLine4:"Please forward them the following instructions.",
        workingEndPoint: 'https://rabsdigital.com/api/magicbricks/magicbricks_api',
        samplePayLoad: `{"lead_name"=>"customer name","country_code"=>"+91", "mobile_no"=>"8885559998","email_id"=>"customermail@mail.com", "service_type"=>"New Project","project_name"=>"Project Name", "property_type"=>"Residential","property_category" =>"Apartment","property_configuration"=>"1 BHK","country" =>"IN","state"=>"MH","city"=>"Mumbai","locality"=>"Andheri West","other_details"=>"Other Details","key"=>"YOUR_API_KEY"`,
        apiResponse: 'Success: {"Status:true"} Failure: {"status:false"} Invalid key: Something went wrong',
        apiDocument: "https://rabsdigital.com/api/magicbricks/magicbricks_api.pdf",
        apiDescriptionLastLine: "Your integration should be activated by the MagicBricks team, share the details by click on the button below. Once the integration is active you will start receiving leads directly in your RABS Connect CRM.",
      },
    )
  }

  return (
    <>
      <Breadcrumb PageName="Api Integration" />
      <Container>
        <Row>
          {ApiIntegrationData.map((apidata, index) => (
            <Col className="mt-3" xs={12} md={6} sm={12} key={index}>
              <Card>
                <Card.Body>
                  <div className="api-integration-header">
                    <img src={apidata.imageUrl} alt="logo" />
                    <h6 className="api-integration-heading">
                      {" "}
                      {apidata.apiHeading}
                    </h6>
                  </div>

                  <p className="mb-2 api-subheading">
                    {apidata.apiDescriptionLine1}
                  </p>

                  <div className="api-btndiv">
                    <span style={{textAlign: "left",fontSize: "14px",paddintTop: "5px"}}>{apidata.connectionStatus}</span>
                    <Button
                      size="small"
                      endIcon={">"}
                      onClick={() =>{
                        if (apidata.apiHeading === "Facebook") {
                          window.open("https://rabsnetsolutions.in/site/login", "_blank");
                        }
                        else {
                          dispatch({
                            event: "updateglobal_userdata",
                            data: JSON.stringify(ApiIntegrationData[index]),
                          })
                          setTimeout(() => {
                            dispatch({ event: "integrationdetails" });
                          }, 30);
                        }
                        }
                      }
                    >
                      {" "}
                      {apidata.connectBtnName}{" "}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default ApiIntegration;