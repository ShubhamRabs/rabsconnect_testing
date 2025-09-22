// for ES5
const express = require("express");
const pool = require("../../Database.js");

const LeadSchedulingRouter = express.Router();

async function getAllLocalities(cities) {
  let localities = {};

  // Iterate over each city asynchronously
  for (const cityName of cities) {
    // Wrap the connection.query in a promise
    const result = await new Promise((resolve, reject) => {
      pool.getConnection(function (error, connection) {
        if (error) {
          reject(error);
          return;
        }
        connection.query(
          "SELECT DISTINCT locality FROM crm_lead_primary_details WHERE city = ?",
          [cityName],
          (err, result) => {
            connection.release();
            if (err) {
              reject(err);
            } else {
              resolve(
                result
                  .map((row) => row.locality.trim())
                  .filter((locality) => locality)
              );
            }
          }
        );
      });
    }).catch((error) => console.error(error));

    localities[cityName] = result; // Store localities for this city
  }

  return localities;
}

async function getAllServiceTypes(sources,ldate_from,ldate_to) {
  let serviceTypes = {};
  let query = "SELECT DISTINCT service_type FROM crm_lead_primary_details WHERE source = ?";
  if (ldate_from && ldate_to) {
    query = "SELECT DISTINCT service_type FROM crm_lead_primary_details WHERE source = ? AND (`create_dt` BETWEEN ? AND ?)";
  }

  for (const sourceData of sources) {
    let source = sourceData;
    if (ldate_from && ldate_to) {
      source = sourceData.source;
    }
    // console.log("Hello",source);
    const result = await new Promise((resolve, reject) => {
      pool.getConnection(function (error, connection) {
        if (error) {
          reject(error);
          return;
        }
        connection.query(
          query,
          [source,ldate_from,ldate_to],
          (err, result) => {
            connection.release();
            if (err) {
              reject(err);
            } else {
              resolve(
                result
                  .map((row) => row.service_type.trim())
                  .filter((service_type) => service_type)
              );
            }
          }
        );
      });
    }).catch((error) => console.error(error));

    serviceTypes[source] = result; 
  }

  return serviceTypes;
}

async function checkScheduler(
  schedule_type,
  ldate_from,
  ldate_to,
  source,
  service_type,
  pname,
  city,
  locality
) {
  let query = "";
  let queryParams = [ldate_from, ldate_to, ldate_from, ldate_to];
  if (
    !schedule_type &&
    !source &&
    !service_type &&
    !pname &&
    !city &&
    !locality
  ) {
    query =
      "SELECT * FROM crm_lead_scheduling WHERE (`ldate_from` BETWEEN ? AND ? OR `ldate_to` BETWEEN ? AND ?) AND `source` = '' AND service_type = '' AND pname = '' AND city = '' AND locality = ''";
  } else {
    query =
      "SELECT * FROM crm_lead_scheduling WHERE (`ldate_from` BETWEEN ? AND ? OR `ldate_to` BETWEEN ? AND ?) ";
      // console.log(source,service_type);
    if (source && source.length > 0) {
      query += "AND (source = '' OR source IN (?)) ";
      queryParams.push(source);
    }
    if (service_type && service_type.length > 0) {
      query += "AND (service_type = '' OR service_type IN (?)) ";
      queryParams.push(service_type);
    }
    if (pname && pname.length > 0) {
      query += "AND (pname = '' OR pname IN (?)) ";
      queryParams.push(pname);
    }
    if (city && city.length > 0) {
      query += "AND (city = '' OR city IN (?)) ";
      queryParams.push(city);
    }
    if (locality && locality.length > 0) {
      query += "AND (locality = '' OR locality IN (?)) ";
      queryParams.push(locality);
    }
  }
  const result = await new Promise((resolve, reject) => {
    pool.getConnection(function (error, connection) {
      if (error) {
        reject(error);
        return false;
      }
      connection.query(query, queryParams, (err, results) => {
        if (err) {
          reject(err);
          return false;
        }
        connection.release();
        resolve(results);
      });
    });
  }).catch((error) => console.error(error));
  if (result) {
    if (Array.isArray(result) && result.length === 0) {
      return true;
    }
    return false;
  } else {
    return false;
  }
}

const convertArrayToString = (arr) => {
  return arr.join(",");
};

LeadSchedulingRouter.get("/get-lead-scheduler-details", async (req, res) => {
  const source = new Set();
  const service_type = new Set();
  const pname = new Set();
  const city = new Set();
  const locality = new Set();
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "SELECT DISTINCT source, service_type, pname, city, locality FROM crm_lead_primary_details",
      async (err, result) => {
        if (err) {
          console.log(err);
        } else {
          for (let i = 0; i < result.length; i++) {
            if (result[i].source) {
              // console.log("Hello",source.has(result[i].source.trim()),source);
              source.add(result[i].source.trim());
            }
            if (result[i].service_type) {
              service_type.add(result[i].service_type.trim());
            }
            if (result[i].pname) {
              pname.add(result[i].pname.trim());
            }
            if (result[i].city) {
              city.add(result[i].city.trim());
            }
            if (result[i].locality) {
              locality.add(result[i].locality);
            }
          }
          let SchedularDetails = {
            source: Array.from(source),
            service_type: Array.from(service_type),
            pname: Array.from(pname),
            city: Array.from(city),
            locality: Array.from(locality),
          };
          let localityByCity = await getAllLocalities(SchedularDetails.city);
          let serviceTypeBySource = await getAllServiceTypes(SchedularDetails.source,'','');
          // console.log("serviceTypeBySource",serviceTypeBySource);
          SchedularDetails.localityByCity = localityByCity;
          SchedularDetails.serviceTypeBySource = serviceTypeBySource;

          res.send(SchedularDetails);
        }
        connection.release();
      }
    );
  });
});

LeadSchedulingRouter.post("/get-lead-scheduler-details-by-date", async (req, res) => {
  const ldate_from = req.body.data.ldate_from;
  const ldate_to = req.body.data.ldate_to;
  if (!ldate_from || !ldate_to) {
    res.send("Date not selected");
    return;
  }
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "SELECT DISTINCT source FROM crm_lead_primary_details WHERE source != '' AND `create_dt` BETWEEN ? AND ?",[ldate_from,ldate_to],
      async (err, result) => {
        if (err) {
          console.log(err);
        } else {
          const serviceTypes = await getAllServiceTypes(result,ldate_from,ldate_to);
          let SchedularDetails = {
            source: result,
            serviceTypes
          }
          // console.log("Services",serviceTypes);
          res.send(SchedularDetails);
        }
        connection.release();
      }
    );
  });
});

LeadSchedulingRouter.post("/get-lead-scheduler-details-by-project-name", async (req, res) => {
  const ldate_from = req.body.data.ldate_from;
  const ldate_to = req.body.data.ldate_to;
  const source = req.body.data.source || [];
  const service_type = req.body.data.service_type || [];
  let queryParams = [];
  let query = "SELECT DISTINCT pname FROM crm_lead_primary_details WHERE pname != '' ";
  if (source.length === 0 && service_type.length === 0 && (!ldate_from && !ldate_to)) {
    res.send("select data");
    return;
  }
  if (source.length > 0) {
    query += " AND source IN (?) ";
    // if (queryParams.length > 0) {
    // }
    // else {
    //   query += " source IN (?)";
    // }
    queryParams.push(source);
  }
  if (service_type.length > 0) {
    query += "AND service_type IN (?) "; 
    queryParams.push(service_type);
  }
  if (ldate_from && ldate_to) {
    query += " AND (`create_dt` BETWEEN ? AND ?)";
    queryParams.push(ldate_from,ldate_to);
  }
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      query,queryParams,
      async (err, result) => {
        if (err) {
          console.log(err);
        } else {
          // console.log("results projects",result)
          res.send(result);
        }
        connection.release();
      }
    );
  });
});

LeadSchedulingRouter.post("/get-lead-scheduler-details-by-city-name", async (req, res) => {
  const ldate_from = req.body.data.ldate_from;
  const ldate_to = req.body.data.ldate_to;
  const source = req.body.data.source || [];
  const service_type = req.body.data.service_type || [];
  const pname = req.body.data.pname || [];
  let queryParams = [];
  let query = "SELECT DISTINCT city FROM crm_lead_primary_details WHERE city != '' ";
  if (source.length === 0 && service_type.length === 0 && pname.length === 0 && (!ldate_from && !ldate_to)) {
    res.send("select data");
    return;
  }
  if (source.length > 0 ) {
    query += " AND source IN (?) ";
    queryParams.push(source);
  }
  if (service_type.length > 0) {
    query += "AND service_type IN (?) "; 
    queryParams.push(service_type);
  }
  if (pname.length > 0) {
    query += "AND pname IN (?) ";
    queryParams.push(pname);
  }
  if (ldate_from && ldate_to) {
    query += " AND (`create_dt` BETWEEN ? AND ?)";
    queryParams.push(ldate_from,ldate_to);
  }
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      query,queryParams,
      async (err, result) => {
        if (err) {
          console.log(err);
        } else {
          // console.log("result city",result);
          res.send(result);
        }
        connection.release();
      }
    );
  });
});

LeadSchedulingRouter.post("/get-lead-scheduler-details-by-locality-name", async (req, res) => {
  const ldate_from = req.body.data.ldate_from;
  const ldate_to = req.body.data.ldate_to;
  const source = req.body.data.source || [];
  const service_type = req.body.data.service_type || [];
  const pname = req.body.data.pname || [];
  const city = req.body.data.city || [];
  let queryParams = [];
  let query = "SELECT DISTINCT locality FROM crm_lead_primary_details WHERE locality != '' ";
  if (source.length === 0 && service_type.length === 0 && pname.length === 0 && city.length === 0 && (!ldate_from && !ldate_to)) {
    res.send("select data");
    return;
  }
  if (source.length > 0 ) {
    query += " AND source IN (?) ";
    queryParams.push(source);
  }
  if (service_type.length > 0) {
    query += "AND service_type IN (?) "; 
    queryParams.push(service_type);
  }
  if (pname.length > 0) {
    query += "AND pname IN (?) ";
    queryParams.push(pname);
  }
  if (city.length > 0) {
    query += "AND city IN (?) ";
    queryParams.push(city)
  }
  if (ldate_from && ldate_to) {
    query += " AND (`create_dt` BETWEEN ? AND ?)";
    queryParams.push(ldate_from,ldate_to);
  }
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      query,queryParams,
      async (err, result) => {
        if (err) {
          console.log(err);
        } else {
          // console.log("result",result);
          res.send(result);
        }
        connection.release();
      }
    );
  });
});

LeadSchedulingRouter.post("/add-lead-scheduling", async (req, res) => {
  const data = req.body.data[0];
  const u_id = req.session.user[0].u_id;
  let assign_to = "";
  const selected_user_role = data.user_role;
  const schedule_type = data.schedule_type;
  if (schedule_type === "Round Robin") {
    if (
      selected_user_role === "Team Leader" &&
      Array.isArray(data.team_leader_id) &&
      data.team_leader_id.length > 0
    ) {
      assign_to = convertArrayToString(data.team_leader_id);
    } else if (
      selected_user_role === "Sales Manager" &&
      Array.isArray(data.sales_manager_id) &&
      data.sales_manager_id.length > 0
    ) {
      assign_to = convertArrayToString(data.sales_manager_id);
    } else if (
      selected_user_role === "Tele Caller" &&
      Array.isArray(data.tele_caller_id) &&
      data.tele_caller_id.length > 0
    ) {
      assign_to = convertArrayToString(data.tele_caller_id);
    } else if (
      selected_user_role === "Branch Admin" &&
      Array.isArray(data.branch_admin_id) &&
      data.branch_admin_id.length > 0
    ) {
      assign_to = convertArrayToString(data.branch_admin_id);
    }
  } else {
    if (selected_user_role === "Team Leader") {
      assign_to = data.team_leader_id.toString();
    } else if (selected_user_role === "Sales Manager") {
      assign_to = data.sales_manager_id.toString();
    } else if (selected_user_role === "Tele Caller") {
      assign_to = data.tele_caller_id.toString();
    } else if (selected_user_role === "Branch Admin") {
      assign_to = data.branch_admin_id.toString();
    }
  }
  let source = "";
  let service_type = "";
  let pname = "";
  let city = "";
  let locality = "";
  if (data.source.length > 0) {
    source = convertArrayToString(data.source);
  }
  if (data.service_type.length > 0) {
    service_type = convertArrayToString(data.service_type);
  }
  if (data.pname.length > 0) {
    pname = convertArrayToString(data.pname);
  }
  if (data.city.length > 0) {
    city = convertArrayToString(data.city);
  }
  if (data.locality.length > 0) {
    locality = convertArrayToString(data.locality);
  }
  // console.log("data", data);

  const checkSchedulers = await checkScheduler(
    schedule_type,
    data.ldate_from,
    data.ldate_to,
    data.source,
    data.service_type,
    data.pname,
    data.city,
    data.locality
  );

  // console.log("Schedulers", checkSchedulers);

  if (!checkSchedulers) {
    res.status(404).send("error");
    return;
  }

  // res.status(404).send("error");
  // return;

  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "INSERT INTO crm_lead_scheduling (schedule_type,created_by,assign_to,ldate_from,ldate_to,source,service_type,pname,city,locality,create_dt,update_dt,no_of_leads,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        data.schedule_type,
        u_id,
        assign_to,
        data.ldate_from,
        data.ldate_to,
        source,
        service_type,
        pname,
        city,
        locality,
        req.body.DateTime,
        req.body.DateTime,
        data.no_of_leads,
        data.status,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          // console.log(result);
          res.send(result);
        }
        connection.release();
      }
    );
  });
});

LeadSchedulingRouter.post("/delete-selected-lead-scheduling", (req, res) => {
  let lsche_id = req.body.lsche_id;
  // const l_id = lead_id?.map((entry) => entry.l_id);
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "DELETE FROM crm_lead_scheduling WHERE ?? IN (?) ",
      ["lsche_id", lsche_id],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Lead Schedule deleted");
        }
        connection.release();
      }
    );
  });
});

LeadSchedulingRouter.get("/get-lead-scheduling-table-data", (req, res) => {
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;
  const utype = req.session.user[0].utype;
  const { page, pageSize } = req.query;
  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize);

  // console.log("sessions",req.session);

  // let query = "";

  // if (utype === "Admin") {
  //   query = "SELECT ls.lsche_id, ls.created_by, ls.create_dt, ls.update_dt, ls.assign_to,ls.ldate_from, ls.ldate_to, ls.source,ls.service_type, ls.pname,ls.locality, ls.city, ls.schedule_type, ls.no_of_leads, ls.status, cu.username AS createdby FROM crm_lead_scheduling AS ls LEFT JOIN crm_users AS cu ON cu.u_id = ls.created_by ORDER BY ls.lsche_id DESC LIMIT ? OFFSET ?";
  // }
  // else {
  //   query = "SELECT ls.lsche_id, ls.created_by, ls.create_dt, ls.update_dt, ls.assign_to,ls.ldate_from, ls.ldate_to, ls.source,ls.service_type, ls.pname,ls.locality, ls.city, ls.schedule_type, ls.no_of_leads, ls.status, cu.username AS createdby FROM crm_lead_scheduling AS ls LEFT JOIN crm_users AS cu ON cu.u_id = ls.created_by ORDER BY ls.lsche_id DESC LIMIT ? OFFSET ?"
  // }

  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "SELECT ls.lsche_id, ls.created_by, ls.create_dt, ls.update_dt, ls.assign_to, ls.ldate_from, ls.ldate_to, ls.source, ls.service_type, ls.pname, ls.locality, ls.city, ls.schedule_type, ls.no_of_leads, ls.status, cu.username AS createdby, GROUP_CONCAT(au.username) AS assignto FROM crm_lead_scheduling AS ls LEFT JOIN crm_users AS cu ON cu.u_id = ls.created_by LEFT JOIN crm_users AS au ON FIND_IN_SET(au.u_id, ls.assign_to) GROUP BY ls.lsche_id, ls.created_by, ls.create_dt, ls.update_dt, ls.assign_to, ls.ldate_from, ls.ldate_to, ls.source, ls.service_type, ls.pname, ls.locality, ls.city, ls.schedule_type, ls.no_of_leads, ls.status, cu.username ORDER BY ls.lsche_id DESC LIMIT ? OFFSET ?",
      [limit, offset],
      (err, result) => {
        if (err) {
          console.log("error");
        } else {
          res.json(result);
        }
        connection.release();
      }
    );
  });
});

LeadSchedulingRouter.post(
  "/get-lead-scheduling-table-data-count",
  (req, res) => {
    const user_role = req.session.user[0].urole;
    const user_id = req.session.user[0].u_id;

    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT COUNT(ls.lsche_id) AS totalCount FROM crm_lead_scheduling AS ls",
        (err, result) => {
          if (err) {
            console.log("error");
          } else {
            res.json(result[0].totalCount);
          }
          connection.release();
        }
      );
    });
  }
);

// for ES5
module.exports = LeadSchedulingRouter;
