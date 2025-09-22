// ES5
const express = require("express");
const cors = require("cors");
const session = require("express-session");

const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const compression = require("compression");
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const AuthenticationRouter = require("./Router/Auth/AuthenticationRouter");
const AttendanceRouter = require("./Router/Attendance/AttendanceRouter");

const SourceRouter = require("./Router/DynamicFields/SourceRouter");
const ProjectNameRouter = require("./Router/DynamicFields/ProjectNameRouter");
const ConfigurationRouter = require("./Router/DynamicFields/ConfigurationRouter");
const LeadStatusRouter = require("./Router/DynamicFields/LeadStatusRouter");
const UserRouter = require("./Router/Users/UserRouter");

const UnknownLeadRouter = require("./Router/Leads/UnknownLeadRouter.js")
const FreshLeadRouter = require("./Router/Leads/FreshLeadRouter.js")
const TotalLeadRouter = require("./Router/Leads/TotalLeadRouter");
const NonAssignLeadRouter = require("./Router/Leads/NonAssignLeadRouter");
const AssignLeadRouter = require("./Router/Leads/AssignLeadRouter");
const ImportLeadRouter = require("./Router/Leads/ImportLeadRouter");
const LeadRouter = require("./Router/Leads/LeadRouter");
const SearchLeadRouter = require("./Router/AdvancedSearch/Lead/SearchLeadRouter");

const LeftsidebarRouter = require("./Router/Other/LeftsidebarRouter");
const LocalityRouter = require("./Router/Other/LocalityRouter");
const CRMDetailsRouter = require("./Router/Other/CRMDetailsRouter");
const LeadDashboardRouter = require("./Router/Dashboard/LeadDashboardRouter");
const HRDashboardRouter = require("./Router/Dashboard/HRDashboardRouter");
const MissedLeadRouter = require("./Router/Leads/MissedLeadRouter");
const PresentLeadRouter = require("./Router/Leads/PresentLeadRouter");
const LeadByStatusRouter = require("./Router/Leads/LeadByStatusRouter");
const CandidatesSourceRouter = require("./Router/DynamicFields/CandidatesSourceRouter");
const CandidateStatusRouter = require("./Router/DynamicFields/CandidateStatusRouter");
const CandidatePostRouter = require("./Router/DynamicFields/CandidatePostRouter");
const CandidatesRouter = require("./Router/HumanResources/CandidatesRouter");
const AllCandidatesRouter = require("./Router/HumanResources/AllCandidatesRouter");
const ImportCandidateRouter = require("./Router/HumanResources/ImportCandidateRouter");
const CallingReportRouter = require("./Router/Report/CallingReportRouter");
const LeadReportRouter = require("./Router/Report/LeadReportRouter");
const ProfileRouter = require("./Router/Other/ProfileRouter");
const AssignCandidatesRouter = require("./Router/HumanResources/AssignCandidatesRouter");
const NonAssignCandidatesRouter = require("./Router/HumanResources/NonAssignCandidatesRouter");
const SearchCandidateRouter = require("./Router/AdvancedSearch/HR/SearchCandidateRouter");
const UserLeadRouter = require("./Router/Leads/UserLeadRouter");
const LeadBySourceRouter = require("./Router/Leads/LeadBySourceRouter");

const LoanStatusRouter = require("./Router/DynamicFields/LoanStatusRouter");
const LocationFieldRouter = require("./Router/DynamicFields/LocationFieldRouter");
const HandoverYearRouter = require("./Router/DynamicFields/HandoverYearRouter");
const LeadPriorityRouter = require("./Router/DynamicFields/LeadPriorityRouter");

const LoanRouter = require("./Router/Loan/LoanRouter");
const SearchLoanRouter = require("./Router/AdvancedSearch/Loan/SearchLoanRouter");
const LoanSalesManagerRouter = require("./Router/DynamicFields/LoanSalesManagerRouter");

const BrokerRouter = require("./Router/Broker/BrokerRouter");
const SearchBrokerRouter = require("./Router/AdvancedSearch/Broker/SearchBrokerRouter");

const DynamicFieldsRouter = require("./Router/DynamicFields/DynamicFieldsRouter");
const UpcomingLeadRouter = require("./Router/Leads/UpcomingLeadRouter");
const LocationRouter = require("./Router/Location/LocationRouter");

const UserStatisticsReportRouter = require("./Router/Report/UserStatisticsReportRouter.js");
const LeadSchedulingRouter = require("./Router/Leads/LeadSchedulingRouter.js");
const LeadCallRouter = require("./Router/Leads/LeadCallRouter");
const SearchLeadSchedulerRouter = require("./Router/AdvancedSearch/LeadScheduling/SearchLeadSchedulingRouter.js");
const LeadAssignReportRouter = require("./Router/Leads/LeadAssignReportRouter.js");
const SearchLeadAssignReportRouter = require("./Router/AdvancedSearch/LeadAssignReport/SearchLeadAssignReportRouter.js");
const CandidatesByStatusRouter = require("./Router/HumanResources/CandidatesByStatusRouter.js");
const AttendancePolicyRouter = require("./Router/DynamicFields/AttendancePolicyRouter.js");
const InvoiceRouter = require("./Router/Invoice/InvoiceRouter.js");
const BankNameRouter = require("./Router/DynamicFields/BankNameRouter");
const ApiDataRouter = require("./Router/Other/ApiDataRouter.js");
const CredentialsRouter = require("./Router/Other/CredentialsRouter.js");
const PaySlipRouter = require("./Router/PaySlip/PaySlipRouter.js");
// const { mailHandler } = require("./Handler/EmailHandler.js");
const { mailHandler } = require("./Handler/EmailHandler.js");

const MySQLStore = require("express-mysql-session")(session);

const firebase = require("firebase-admin");
const { getMessaging } = require("firebase-admin/messaging");
const serviceAccount = require("./push-notification.json");
const cron = require("node-cron");
const pool = require("./Database.js");
const dayjs = require("dayjs");
const fs = require("fs");
const path = "./leads.json";
const hrPath = "./hr.json";
const brPath = "./broker.json";
const psPath = "./payslip.json";

const dnm = './config/setting.json';
dotenv.config();
const app = express();
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
});

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  app.use(compression());

  const options = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    createDatabaseTable: false,
    schema: {
      tableName: "sessions_store",
      columnNames: {
        session_id: "session_id",
        expires: "expires",
        data: "data",
      },
    },
    cookie: {
      // domain: "localhost",
      domain: "crm.fortunedxb.com",
      path: "/",
      httpOnly: false,
      secure: false,
    },
  };

  const sessionStore = new MySQLStore(options); // // for es5
  // const sessionStore = new MySQLStore(options, session); // for es6

  app.use(cookieParser());
  app.use(
    bodyParser.urlencoded({
      imit: "300mb",
      extended: true,
      parameterLimit: 5000000,
    })
  );
  app.use(bodyParser.json({ limit: "300mb" }));

  app.use(
    cors({
      origin: [
        "http://localhost:3000",
        "https://crm.fortunedxb.com",
        "https://www.crm.fortunedxb.com",
        "http://www.crm.fortunedxb.com",
        "http://crm.fortunedxb.com"
      ],
      method: ["GET", "POST"],
      credentials: true,
    })
  );

  app.use(
    session({
      key: process.env.SESS_NAME,
      secret: process.env.SESS_SECRET,
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: false,
      },
    })
  );

  sessionStore
    .onReady()
    .then(() => {
      console.log("MySQLStore ready");
    })
    .catch((error) => {
      console.error(error);
    });
  // Serve static files (e.g., images)
  app.use(express.json());

  app.use(express.static("public"));
  app.use("/uploads", express.static(__dirname + "/uploads"));
  
   // ================================================== Lead setting ====================================
  const readData = () => {
    return JSON.parse(fs.readFileSync(path, "utf8"));
  };
   const readDnm = () => {
    return JSON.parse(fs.readFileSync(dnm, 'utf8'));
  };

  const readPs = () => {
    return JSON.parse(fs.readFileSync(psPath, "utf8"));
  };
  const readHr = () => {
    return JSON.parse(fs.readFileSync(hrPath, "utf8"));
  };

  const readBr = () => {
    return JSON.parse(fs.readFileSync(brPath, "utf8"));
  };

  const writeData = (data) => {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
  };
   const writeDmn = (data) => {
    fs.writeFileSync(dnm, JSON.stringify(data, null, 2));
  }
  const writeHr = (data) => {
    fs.writeFileSync(hrPath, JSON.stringify(data, null, 2));
  };

  const writeBr = (data) => {
    fs.writeFileSync(brPath, JSON.stringify(data, null, 2));
  };

  const writePs = (data) => {
    fs.writeFileSync(psPath, JSON.stringify(data, null, 2));
  };

  app.get("/lead:u_id", (req, res) => {
    const userId = req.params.u_id; // Get u_id from the URL
    const data = readData(userId); // Pass u_id to the function that reads data
    res.json(data);
  });
    app.get('/dmn', (req, res) => {
    // const userId = req.params.u_id; // Get u_id from the URL  
    const data = readDnm(); // Pass u_id to the function that reads data
    res.json(data);
  });

  app.get("/hr:u_id", (req, res) => {
    const userId = req.params.u_id; // Get u_id from the URL
    const data = readHr(userId); // Pass u_id to the function that reads data
    res.json(data);
  });

  app.get("/br:u_id", (req, res) => {
    const userId = req.params.u_id; // Get u_id from the URL
    const data = readBr(userId); // Pass u_id to the function that reads data
    res.json(data);
  });
  app.get("/ps:u_id", (req, res) => {
    const userId = req.params.u_id; // Get u_id from the URL
    const data = readPs(userId); // Pass u_id to the function that reads data
    res.json(data);
  });
  app.post("/lead:u_id", (req, res) => {
    const userId = req.params.u_id;
    const data = readData(userId);
    const newItem = req.body;
    data.push(newItem);
    writeData(data);
    res.json(newItem);
  });

  app.put("/lead/:u_id", (req, res) => {
    const userId = req.params.u_id;
    const updatedHeaders = req.body; // This should contain the 'visible' and 'hidden' arrays

    // Read data from your JSON or database
    let data = readData();

    // Ensure the data for the specified user exists
    if (!data[userId]) {
      return res.status(404).json({ error: "Data not found for user" });
    }

    // Update the headers based on the provided data
    data[userId] = {
      visible: updatedHeaders.visible,
      hidden: updatedHeaders.hidden,
    };

    // Write updated data back to your JSON or database
    writeData(data);

    // Send the updated headers back as a response
    res.json(data[userId]);
  });
  
   app.put('/dmn', (req, res) => {
    const updatedLeadSettings = req.body.lead; // Expecting { lead: { showTypeOfBuyer: true/false, ... } }
  
    // Log the incoming updatedLeadSettings for debugging
    console.log('Received updated lead settings:', updatedLeadSettings);
  
    // Validate that the lead object is provided
    if (!updatedLeadSettings) {
      return res.status(400).json({ error: 'Invalid request data. Lead object is required.' });
    }
  
    // Read current visibility settings
    let visibilitySettings = readDnm(); // Ensure readDmn() returns the current settings
  
    // Update visibility settings based on the received data
    visibilitySettings.lead = {
      ...visibilitySettings.lead, // Preserve existing settings
      ...updatedLeadSettings,      // Update with new values
    };
  
    // Write the updated visibility settings to a file
    writeDmn(visibilitySettings); // Persist the changes to the file
  
    // Respond with the updated settings
    res.status(200).json({
      message: 'Visibility settings updated successfully.',
      visibilitySettings: visibilitySettings.lead,
    });
  });

  app.put("/hr/:u_id", (req, res) => {
    const userId = req.params.u_id;
    const updatedHeaders = req.body;
    let data = readHr();

    if (!data[userId]) {
      return res.status(404).json({ error: "Data not found for user" });
    }

    data[userId] = {
      visible: updatedHeaders.visible,
      hidden: updatedHeaders.hidden,
    };

    writeHr(data);

    res.json(data[userId]);
  });

  app.put("/br/:u_id", (req, res) => {
    const userId = req.params.u_id;
    const updatedHeaders = req.body;
    let data = readBr();

    if (!data[userId]) {
      return res.status(404).json({ error: "Data not found for user" });
    }

    data[userId] = {
      visible: updatedHeaders.visible,
      hidden: updatedHeaders.hidden,
    };

    writeBr(data);

    res.json(data[userId]);
  });
  app.put("/ps/:u_id", (req, res) => {
    const userId = req.params.u_id;
    const updatedHeaders = req.body;
    let data = readPs();

    if (!data[userId]) {
      return res.status(404).json({ error: "Data not found for user" });
    }

    data[userId] = {
      visible: updatedHeaders.visible,
      hidden: updatedHeaders.hidden,
    };

    writePs(data);

    res.json(data[userId]);
  });
  // ================================================== Lead setting ====================================

  app.use(AuthenticationRouter);
  app.use("/nonassign-lead", NonAssignLeadRouter);
  app.use("/assign-lead", AssignLeadRouter);
  app.use("/fresh-lead",FreshLeadRouter);
  app.use("/unknown-lead",UnknownLeadRouter);
  app.use("/dashboard", LeadDashboardRouter);
  app.use("/dashboard", HRDashboardRouter);
  app.use("/present-lead", PresentLeadRouter);
  app.use("/missed-lead", MissedLeadRouter);
  app.use("/users", UserRouter);
  app.use("/attendance", AttendanceRouter);
  app.use("/attendance-policy", AttendancePolicyRouter);
  app.use("/left-sidebar", LeftsidebarRouter);
  app.use("/source", SourceRouter);
  app.use("/project-name", ProjectNameRouter);
  app.use("/configuration", ConfigurationRouter);
  app.use("/lead-status", LeadStatusRouter);
  app.use("/lead-by-status", LeadByStatusRouter);
  app.use("/lead-by-source", LeadBySourceRouter);
  app.use("/lead", LeadRouter);
  app.use("/candidates-source", CandidatesSourceRouter);
  app.use("/import-lead", ImportLeadRouter);
  app.use("/crm-details", CRMDetailsRouter);
  app.use("/crm-credentials",CredentialsRouter);
  app.use("/total-lead", TotalLeadRouter);
  app.use("/user-lead", UserLeadRouter);
  app.use("/advanced-search", SearchLeadRouter);
  app.use("/candidate-advanced-search", SearchCandidateRouter);
  app.use("/locality", LocalityRouter);
  app.use("/profile", ProfileRouter);
  app.use("/candidates-status", CandidateStatusRouter);
  app.use("/candidates-post", CandidatePostRouter);
  app.use("/candidate", CandidatesRouter);
  app.use("/import-candidate", ImportCandidateRouter);
  app.use("/all-candidate", AllCandidatesRouter);
  app.use("/assign-candidate", AssignCandidatesRouter);
  app.use("/non-assign-candidate", NonAssignCandidatesRouter);
  app.use("/candidate-by-status", CandidatesByStatusRouter);

  app.use("/lead-report", LeadReportRouter);
  app.use("/report", CallingReportRouter);
  app.use("/user-statistics", UserStatisticsReportRouter);

  app.use("/lead-scheduling", LeadSchedulingRouter);
  app.use("/lead-scheduling-advanced-search", SearchLeadSchedulerRouter);
  
  app.use("/lead-assign-report", LeadAssignReportRouter);
  app.use("/lead-assign-report-advanced-search", SearchLeadAssignReportRouter);

  app.use("/loan-status", LoanStatusRouter);
  app.use("/location-field", LocationFieldRouter);
  app.use("/handover-year", HandoverYearRouter);
  app.use("/lead-priority", LeadPriorityRouter);
  app.use("/loan-sales-manager", LoanSalesManagerRouter);
  app.use("/loan", LoanRouter);
  app.use("/loan-advanced-search", SearchLoanRouter);

  app.use("/broker", BrokerRouter);
  app.use("/broker-advanced-search", SearchBrokerRouter);

  app.use("/upcoming-lead", UpcomingLeadRouter);
  app.use("/dynamicFields", DynamicFieldsRouter);
  app.use("/location", LocationRouter);
    app.use("/pay-slip",PaySlipRouter)

  app.use("/invoice", InvoiceRouter);
  app.use("/bank-name", BankNameRouter);
  app.use("/call-history", LeadCallRouter);
  app.use("/api-data", ApiDataRouter);

//   app.get("/check-user-login", (req, res) => {
//     sessionStore.get(req.session.id, (err, sessionData) => {
//       if (err || !sessionData) {
//         res.send("Session not found");
//       } else {
//         res.send("Session found");
//       }
//     });
//   });

  app.use((req, res) => {
    res.status(404).send("<h1>Opps! Bad Request</h1>");
  });

  // app.listen(3003, () => {
  //   console.log("Server Running");
  // });

  const server = app.listen(3003, () => {
    console.log(`Worker ${process.pid} started`);
  });

  process.on("SIGINT", () => {
    // Close the server and the connection pool gracefully
    server.close(() => {
      // The server is closed. Now, close the connection pool and exit the process
      pool.end((err) => {
        if (err) {
          console.error("Error closing the connection pool:", err);
        }
        console.log(`Worker ${process.pid} has been terminated`);
        process.exit(0);
      });
    });
  });
}
