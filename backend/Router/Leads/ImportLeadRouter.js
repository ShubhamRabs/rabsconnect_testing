// for ES5
const express = require("express");
const pool = require("../../Database.js");
const dayjs = require("dayjs");

const ImportLeadRouter = express.Router();

function formatDate(dateString) {
  try {
    const parts = dateString.match(
      /(\d{1,2})[/-](\d{1,2})[/-](\d{2,4}) (\d{1,2}):(\d{1,2})/
    );

    if (!parts) {
      return "0000-00-00 00:00:00";
    }

    const [, day, month, year, hours, minutes] = parts;

    // Note: months are 0-indexed in JavaScript Date objects
    const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));
    if (isNaN(date.getTime())) {
      throw new Error(
        `Invalid date components: ${year}, ${month}, ${day}, ${hours}, ${minutes}`
      );
    }

    return date.toISOString().slice(0, 19).replace("T", " ");
  } catch (error) {
    console.log("error occured", error);
    return "0000-00-00 00:00:00";
  }
}

ImportLeadRouter.post("/import-master-lead", (req, res) => {
  const data = req.body.data;
  const values = [];

  // Check if all columns exist in CSV
  const keysToCheck = [
    "create_dt",
    "update_dt",
    "source_type",
    "brk_id",
    "ref_name",
    "ref_ccode",
    "ref_mob",
    "ref_email",
    "source",
    "service_type",
    "lname",
    "p_ccode",
    "p_mob",
    "p_email",
    "s_ccode",
    "s_mob",
    "s_email",
    "pname",
    "ptype",
    "pcategory",
    "pconfiguration",
    "country",
    "state",
    "city",
    "locality",
    "min_area",
    "max_area",
    "area_unit",
    "min_price",
    "max_price",
    "price_unit",
    "status",
    "followup",
    "followup_dt",
    "comments",
    "other_details",
  ];

  const allKeysExist = keysToCheck.every((key) => data[0].hasOwnProperty(key));

  if (
    allKeysExist === false ||
    keysToCheck.length !== Object.keys(data[0]).length
  ) {
    // console.log("Incorrect File Format");
    res.status(400).json({
      message: "Incorrect File, Please Download Fresh masterCSV File",
      error: "Incorrect File Format",
    });
    return;
  }

  pool.getConnection(function (error, connection) {
    if (error) throw error;
    let rowcount = 1;
    for (const {
      create_dt,
      update_dt,
      source_type,
      brk_id,
      ref_name,
      ref_ccode,
      ref_mob,
      ref_email,
      source,
      service_type,
      lname,
      p_ccode,
      p_mob,
      p_email,
      s_ccode,
      s_mob,
      s_email,
      pname,
      ptype,
      pcategory,
      pconfiguration,
      country,
      state,
      city,
      locality,
      sub_locality,
      min_area,
      max_area,
      area_unit,
      min_price,
      max_price,
      price_unit,
      status,
      followup,
      followup_dt,
      comments,
      other_details,
    } of data) {
      let formattedCreateDt = formatDate(create_dt);
      let formattedUpdateDt = formatDate(update_dt);
      let formattedFollowupDt = formatDate(followup_dt);
      let price_unit1 = price_unit.includes("Rupee") ? "(₹) Rupee" : price_unit;

      rowcount++;

      // check if all fields are empty
      if (
        create_dt === "" &&
        update_dt === "" &&
        source_type === "" &&
        brk_id === "" &&
        ref_name === "" &&
        ref_ccode === "" &&
        ref_mob === "" &&
        ref_email === "" &&
        source === "" &&
        service_type === "" &&
        lname === "" &&
        p_ccode === "" &&
        p_mob === "" &&
        p_email === "" &&
        s_ccode === "" &&
        s_mob === "" &&
        s_email === "" &&
        pname === "" &&
        ptype === "" &&
        pcategory === "" &&
        pconfiguration === "" &&
        country === "" &&
        state === "" &&
        city === "" &&
        locality === "" &&
        min_area === "" &&
        max_area === "" &&
        area_unit === "" &&
        min_price === "" &&
        max_price === "" &&
        price_unit === "" &&
        status === "" &&
        followup === "" &&
        followup_dt === "" &&
        comments === "" &&
        other_details === ""
      ) {
        // console.log("No Data Found");
        continue;
      } else if (source_type === "") {
        res.status(400).json({
          message: `source_type is missing at row no ${rowcount}`,
          error: "source_type Not Found",
        });
        return;
      } else if (source_type === "Direct" && source === "") {
        res.status(400).json({
          message: `source is missing at row no ${rowcount}`,
          error: "source Not Found",
        });
        return;
      } else if (
        source_type === "Direct" &&
        (ref_name !== "" ||
          ref_ccode !== "" ||
          ref_mob !== "" ||
          ref_email !== "" ||
          brk_id !== "")
      ) {
        let msgstr = "";
        if (ref_name !== "") {
          msgstr += "ref_name";
        }
        if (ref_name !== "" && ref_ccode !== "") {
          msgstr += ", ";
        }
        if (ref_ccode !== "") {
          msgstr += "ref_ccode";
        }
        if (ref_ccode !== "" && ref_mob !== "") {
          msgstr += ", ";
        }
        if (ref_mob !== "") {
          msgstr += "ref_mob";
        }
        if (ref_mob !== "" && ref_email !== "") {
          msgstr += ", ";
        }
        if (ref_email !== "") {
          msgstr += "ref_email";
        }
        if (ref_email !== "" && brk_id !== "") {
          msgstr += ", ";
        }
        if (brk_id !== "") {
          msgstr += "brk_id";
        }
        res.status(400).json({
          message: `${msgstr} must be empty at row no ${rowcount}`,
          error: "reference Columns & brk_id must be empty",
        });
        return;
      } else if (
        source_type === "Reference" &&
        (source !== "" || brk_id !== "")
      ) {
        let msgstr = "";
        if (source !== "") {
          msgstr += "source";
        }
        if (source !== "" && brk_id !== "") {
          msgstr += ", ";
        }
        if (brk_id !== "") {
          msgstr += "brk_id";
        }
        res.status(400).json({
          message: `${msgstr} must be empty at row no ${rowcount}`,
          error: "source & brk_id must be empty",
        });
        return;
      } else if (
        source_type === "Reference" &&
        (ref_name === "" ||
          ref_ccode === "" ||
          ref_mob === "" ||
          ref_email === "")
      ) {
        let msgstr = "";
        if (ref_name === "") {
          msgstr += "ref_name";
        }
        if (ref_name === "" && ref_ccode === "") {
          msgstr += ", ";
        }
        if (ref_ccode === "") {
          msgstr += "ref_ccode";
        }
        if (ref_ccode === "" && ref_mob === "") {
          msgstr += ", ";
        }
        if (ref_mob === "") {
          msgstr += "ref_mob";
        }
        if (ref_mob === "" && ref_email === "") {
          msgstr += ", ";
        }
        if (ref_email === "") {
          msgstr += "ref_email";
        }
        // console.log("test", msgstr);
        res.status(400).json({
          message: `missing data in ${msgstr} at row no ${rowcount}`,
          error: "reference column data not found",
        });
        return;
      } else if (source_type === "Broker" && brk_id === "") {
        res.status(400).json({
          message: `brk_id missing at row no ${rowcount}`,
          error: "source must be empty",
        });
        return;
      } else if (
        source_type === "Broker" &&
        (ref_name !== "" ||
          ref_ccode !== "" ||
          ref_mob !== "" ||
          ref_email !== "" ||
          source !== "")
      ) {
        let msgstr = "";
        if (ref_name !== "") {
          msgstr += "ref_name";
        }
        if (ref_name !== "" && ref_ccode !== "") {
          msgstr += ", ";
        }
        if (ref_ccode !== "") {
          msgstr += "ref_ccode";
        }
        if (ref_ccode !== "" && ref_mob !== "") {
          msgstr += ", ";
        }
        if (ref_mob !== "") {
          msgstr += "ref_mob";
        }
        if (ref_mob !== "" && ref_email !== "") {
          msgstr += ", ";
        }
        if (ref_email !== "") {
          msgstr += "ref_email";
        }
        if (
          (ref_name !== "" ||
            ref_ccode !== "" ||
            ref_mob !== "" ||
            ref_email !== "") &&
          source !== ""
        ) {
          msgstr += ", ";
        }
        if (source !== "") {
          msgstr += "source";
        }
        // console.log("test", msgstr);
        res.status(400).json({
          message: `${msgstr} must be empty at row no ${rowcount}`,
          error: "reference column & source must be empty",
        });
        return;
      } else if (min_area !== "" && max_area !== "" && area_unit === "") {
        res.status(400).json({
          message: `area_unit is missing at row no ${rowcount}`,
          error: "area_unit Not Found",
        });
        return;
      } else if (
        min_area !== "" &&
        max_area !== "" &&
        area_unit !== "" &&
        Number(min_area) >= Number(max_area)
      ) {
        res.status(400).json({
          message: `min_area must be less than max_area at row no ${rowcount}`,
          error: "min_area must be less than max_area",
        });
        return;
      } else if (min_price !== "" && max_price !== "" && price_unit === "") {
        res.status(400).json({
          message: `price_unit is missing at row no ${rowcount}`,
          error: "price_unit Not Found",
        });
        return;
      } else if (
        min_price !== "" &&
        max_price !== "" &&
        price_unit !== "" &&
        Number(min_price) >= Number(max_price)
      ) {
        res.status(400).json({
          message: `min_price must be less than max_price at row no ${rowcount}`,
          error: "min_price must be less than max_price",
        });
        return;
      } else if (followup === "Yes" && followup_dt === "") {
        res.status(400).json({
          message: `followup_dt is missing at row no ${rowcount}`,
          error: "followup_dt Not Found",
        });
        return;
      } else if (followup === "" && followup_dt !== "") {
        res.status(400).json({
          message: `followup is missing at row no ${rowcount}`,
          error: "followup Not Found",
        });
        return;
      } else {
        values.push({
          create_dt: formattedCreateDt,
          update_dt: formattedUpdateDt,
          source_type,
          brk_id,
          ref_name,
          ref_ccode,
          ref_mob,
          ref_email,
          source,
          service_type,
          lname,
          p_ccode,
          p_mob,
          p_email,
          s_ccode,
          s_mob,
          s_email,
          pname,
          ptype,
          pcategory,
          pconfiguration,
          country,
          state,
          city,
          locality,
          sub_locality,
          min_area,
          max_area,
          area_unit,
          min_price,
          max_price,
          price_unit: encodeURIComponent(price_unit1),
          status,
          followup,
          followup_dt: formattedFollowupDt,
          comments,
          other_details,
        });
      }
    }
    if (values.length > 0) {
      const query =
        "INSERT INTO crm_lead_primary_details (u_id, create_dt, update_dt, source_type, brk_id, ref_name, ref_ccode, ref_mob, ref_email, source, service_type, lname, p_ccode, p_mob, p_email, s_ccode, s_mob, s_email, pname, ptype, pcategory, pconfiguration, country, state, city, locality, identity, clicked, min_area, max_area, area_unit, min_price, max_price, price_unit, status, followup, followup_dt, comments, other_details) VALUES ?";
      connection.query(
        query,
        [
          values.map((item) => [
            req.body.login_u_id,
            item.create_dt,
            item.update_dt,
            item.source_type,
            item.brk_id,
            item.ref_name,
            item.ref_ccode,
            item.ref_mob,
            item.ref_email,
            item.source,
            item.service_type,
            item.lname,
            item.p_ccode,
            item.p_mob,
            item.p_email,
            item.s_ccode,
            item.s_mob,
            item.s_email,
            item.pname,
            item.ptype,
            item.pcategory,
            item.pconfiguration,
            item.country,
            item.state,
            item.city,
            item.locality,
            "imported",
            "1",
            // item.sub_locality,
            item.min_area,
            item.max_area,
            item.area_unit,
            item.min_price,
            item.max_price,
            item.price_unit,
            item.status,
            item.followup,
            item.followup_dt,
            "By " +
              req.body.login_username +
              ", " +
              dayjs().format("MMM DD,YYYY h:mm A") +
              "= " +
              item.comments,
            item.other_details,
          ]),
        ],
        (error, result) => {
          if (error) {
            res.send(error);
          } else {
            res.send(result);
          }
        }
      );
      connection.release();
    } else {
      res
        .status(400)
        .json({ message: `No data found in csv file`, error: "No data Found" });
    }
  });
});

ImportLeadRouter.post("/import-user-lead", (req, res) => {
  const data = req.body.data;
  const values = [];

  if (req.body.login_type === "Admin") {
    // if import leads form master or admin login
    // Check if all columns exist in CSV
    const keysToCheck = [
      "assignto_id",
      "create_dt",
      "update_dt",
      "source_type",
      "brk_id",
      "ref_name",
      "ref_ccode",
      "ref_mob",
      "ref_email",
      "source",
      "service_type",
      "lname",
      "p_ccode",
      "p_mob",
      "p_email",
      "s_ccode",
      "s_mob",
      "s_email",
      "pname",
      "ptype",
      "pcategory",
      "pconfiguration",
      "country",
      "state",
      "city",
      "locality",
      "min_area",
      "max_area",
      "area_unit",
      "min_price",
      "max_price",
      "price_unit",
      "status",
      "followup",
      "followup_dt",
      "comments",
      "other_details",
    ];

    const allKeysExist = keysToCheck.every((key) =>
      data[0].hasOwnProperty(key)
    );

    if (
      allKeysExist === false ||
      keysToCheck.length !== Object.keys(data[0]).length
    ) {
      // console.log("Incorrect File Format");
      res.status(400).json({
        message: "Incorrect File, Please Download Fresh master_usersCSV File",
        error: "Incorrect File Format",
      });
      return;
    }

    pool.getConnection(function (error, connection) {
      if (error) {
        console.log(error); // Log the error
        res.status(500).json({ error: "Database connection error" });
        connection.release();
        return; // Return early to avoid further execution
      }
      let rowcount = 1;
      for (const {
        assignto_id,
        create_dt,
        update_dt,
        source_type,
        brk_id,
        ref_name,
        ref_ccode,
        ref_mob,
        ref_email,
        source,
        service_type,
        lname,
        p_ccode,
        p_mob,
        p_email,
        s_ccode,
        s_mob,
        s_email,
        pname,
        ptype,
        pcategory,
        pconfiguration,
        country,
        state,
        city,
        locality,
        min_area,
        max_area,
        area_unit,
        min_price,
        max_price,
        price_unit,
        status,
        followup,
        followup_dt,
        comments,
        other_details,
      } of data) {
        let formattedCreateDt = formatDate(create_dt);
        let formattedUpdateDt = formatDate(update_dt);
        let formattedFollowupDt = formatDate(followup_dt);
        let price_unit1 = price_unit.includes("Rupee")
          ? "(₹) Rupee"
          : price_unit;
        let assign_status = "Yes";

        rowcount++;

        // check if all fields are empty
        if (
          assignto_id === "" &&
          create_dt === "" &&
          update_dt === "" &&
          source_type === "" &&
          brk_id === "" &&
          ref_name === "" &&
          ref_ccode === "" &&
          ref_mob === "" &&
          ref_email === "" &&
          source === "" &&
          service_type === "" &&
          lname === "" &&
          p_ccode === "" &&
          p_mob === "" &&
          p_email === "" &&
          s_ccode === "" &&
          s_mob === "" &&
          s_email === "" &&
          pname === "" &&
          ptype === "" &&
          pcategory === "" &&
          pconfiguration === "" &&
          country === "" &&
          state === "" &&
          city === "" &&
          locality === "" &&
          min_area === "" &&
          max_area === "" &&
          area_unit === "" &&
          min_price === "" &&
          max_price === "" &&
          price_unit === "" &&
          status === "" &&
          followup === "" &&
          followup_dt === "" &&
          comments === "" &&
          other_details === ""
        ) {
          // console.log("No Data Found");
          continue;
        } else if (assignto_id === "") {
          res.status(400).json({
            message: `assignto_id is missing at row no ${rowcount}`,
            error: "assignto_id Not Found",
          });
          return;
        } else if (source_type === "") {
          res.status(400).json({
            message: `source_type is missing at row no ${rowcount}`,
            error: "source_type Not Found",
          });
          return;
        } else if (source_type === "Direct" && source === "") {
          res.status(400).json({
            message: `source is missing at row no ${rowcount}`,
            error: "source Not Found",
          });
          return;
        } else if (
          source_type === "Direct" &&
          (ref_name !== "" ||
            ref_ccode !== "" ||
            ref_mob !== "" ||
            ref_email !== "" ||
            brk_id !== "")
        ) {
          let msgstr = "";
          if (ref_name !== "") {
            msgstr += "ref_name";
          }
          if (ref_name !== "" && ref_ccode !== "") {
            msgstr += ", ";
          }
          if (ref_ccode !== "") {
            msgstr += "ref_ccode";
          }
          if (ref_ccode !== "" && ref_mob !== "") {
            msgstr += ", ";
          }
          if (ref_mob !== "") {
            msgstr += "ref_mob";
          }
          if (ref_mob !== "" && ref_email !== "") {
            msgstr += ", ";
          }
          if (ref_email !== "") {
            msgstr += "ref_email";
          }
          if (ref_email !== "" && brk_id !== "") {
            msgstr += ", ";
          }
          if (brk_id !== "") {
            msgstr += "brk_id";
          }
          res.status(400).json({
            message: `${msgstr} must be empty at row no ${rowcount}`,
            error: "reference Columns & brk_id must be empty",
          });
          return;
        } else if (
          source_type === "Reference" &&
          (source !== "" || brk_id !== "")
        ) {
          let msgstr = "";
          if (source !== "") {
            msgstr += "source";
          }
          if (source !== "" && brk_id !== "") {
            msgstr += ", ";
          }
          if (brk_id !== "") {
            msgstr += "brk_id";
          }
          res.status(400).json({
            message: `${msgstr} must be empty at row no ${rowcount}`,
            error: "source & brk_id must be empty",
          });
          return;
        } else if (
          source_type === "Reference" &&
          (ref_name === "" ||
            ref_ccode === "" ||
            ref_mob === "" ||
            ref_email === "")
        ) {
          let msgstr = "";
          if (ref_name === "") {
            msgstr += "ref_name";
          }
          if (ref_name === "" && ref_ccode === "") {
            msgstr += ", ";
          }
          if (ref_ccode === "") {
            msgstr += "ref_ccode";
          }
          if (ref_ccode === "" && ref_mob === "") {
            msgstr += ", ";
          }
          if (ref_mob === "") {
            msgstr += "ref_mob";
          }
          if (ref_mob === "" && ref_email === "") {
            msgstr += ", ";
          }
          if (ref_email === "") {
            msgstr += "ref_email";
          }
          // console.log("test", msgstr);
          res.status(400).json({
            message: `missing data in ${msgstr} at row no ${rowcount}`,
            error: "reference column data not found",
          });
          return;
        } else if (source_type === "Broker" && brk_id === "") {
          res.status(400).json({
            message: `brk_id missing at row no ${rowcount}`,
            error: "source must be empty",
          });
          return;
        } else if (
          source_type === "Broker" &&
          (ref_name !== "" ||
            ref_ccode !== "" ||
            ref_mob !== "" ||
            ref_email !== "" ||
            source !== "")
        ) {
          let msgstr = "";
          if (ref_name !== "") {
            msgstr += "ref_name";
          }
          if (ref_name !== "" && ref_ccode !== "") {
            msgstr += ", ";
          }
          if (ref_ccode !== "") {
            msgstr += "ref_ccode";
          }
          if (ref_ccode !== "" && ref_mob !== "") {
            msgstr += ", ";
          }
          if (ref_mob !== "") {
            msgstr += "ref_mob";
          }
          if (ref_mob !== "" && ref_email !== "") {
            msgstr += ", ";
          }
          if (ref_email !== "") {
            msgstr += "ref_email";
          }
          if (
            (ref_name !== "" ||
              ref_ccode !== "" ||
              ref_mob !== "" ||
              ref_email !== "") &&
            source !== ""
          ) {
            msgstr += ", ";
          }
          if (source !== "") {
            msgstr += "source";
          }
          // console.log("test", msgstr);
          res.status(400).json({
            message: `${msgstr} must be empty at row no ${rowcount}`,
            error: "reference column & source must be empty",
          });
          return;
        } else if (min_area !== "" && max_area !== "" && area_unit === "") {
          res.status(400).json({
            message: `area_unit is missing at row no ${rowcount}`,
            error: "area_unit Not Found",
          });
          return;
        } else if (
          min_area !== "" &&
          max_area !== "" &&
          area_unit !== "" &&
          Number(min_area) >= Number(max_area)
        ) {
          res.status(400).json({
            message: `min_area must be less than max_area at row no ${rowcount}`,
            error: "min_area must be less than max_area",
          });
          return;
        } else if (min_price !== "" && max_price !== "" && price_unit === "") {
          res.status(400).json({
            message: `price_unit is missing at row no ${rowcount}`,
            error: "price_unit Not Found",
          });
          return;
        } else if (
          min_price !== "" &&
          max_price !== "" &&
          price_unit !== "" &&
          Number(min_price) >= Number(max_price)
        ) {
          res.status(400).json({
            message: `min_price must be less than max_price at row no ${rowcount}`,
            error: "min_price must be less than max_price",
          });
          return;
        } else if (followup === "Yes" && followup_dt === "") {
          res.status(400).json({
            message: `followup_dt is missing at row no ${rowcount}`,
            error: "followup_dt Not Found",
          });
          return;
        } else if (followup === "" && followup_dt !== "") {
          res.status(400).json({
            message: `followup is missing at row no ${rowcount}`,
            error: "followup Not Found",
          });
          return;
        } else {
          values.push({
            assignto_id,
            create_dt: formattedCreateDt,
            update_dt: formattedUpdateDt,
            source_type,
            brk_id,
            ref_name,
            ref_ccode,
            ref_mob,
            ref_email,
            source,
            service_type,
            lname,
            p_ccode,
            p_mob,
            p_email,
            s_ccode,
            s_mob,
            s_email,
            pname,
            ptype,
            pcategory,
            pconfiguration,
            country,
            state,
            city,
            locality,
            min_area,
            max_area,
            area_unit,
            min_price,
            max_price,
            price_unit: encodeURIComponent(price_unit1),
            status,
            followup,
            followup_dt: formattedFollowupDt,
            comments,
            other_details,
            assign_status,
          });
        }
      }
      if (values.length > 0) {
        for (let i = 0; i < values.length; i++) {
          const query =
            "INSERT INTO crm_lead_primary_details (u_id, create_dt, update_dt, source_type, brk_id, ref_name, ref_ccode, ref_mob, ref_email, source, service_type, lname, p_ccode, p_mob, p_email, s_ccode, s_mob, s_email, pname, ptype, pcategory, pconfiguration, country, state, city, locality, identity, clicked, min_area, max_area, area_unit, min_price, max_price, price_unit, status, followup, followup_dt, comments, other_details, assign_status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
          connection.query(
            query,
            [
              req.body.login_u_id,
              values[i].create_dt,
              values[i].update_dt,
              values[i].source_type,
              values[i].brk_id,
              values[i].ref_name,
              values[i].ref_ccode,
              values[i].ref_mob,
              values[i].ref_email,
              values[i].source,
              values[i].service_type,
              values[i].lname,
              values[i].p_ccode,
              values[i].p_mob,
              values[i].p_email,
              values[i].s_ccode,
              values[i].s_mob,
              values[i].s_email,
              values[i].pname,
              values[i].ptype,
              values[i].pcategory,
              values[i].pconfiguration,
              values[i].country,
              values[i].state,
              values[i].city,
              values[i].locality,
              "imported",
              "1",
              values[i].min_area,
              values[i].max_area,
              values[i].area_unit,
              values[i].min_price,
              values[i].max_price,
              values[i].price_unit,
              values[i].status,
              values[i].followup,
              values[i].followup_dt,
              values[i].comments,
              values[i].other_details,
              values[i].assign_status,
            ],
            (error, results) => {
              if (error) {
                console.log(error);
              } else {
                const query =
                  "INSERT INTO crm_lead_req_details (`l_id`, `assignto_id`, `assignby_id`, `create_dt`, `update_dt`, `s_ccode`, `s_mob`, `s_email`, `pname`, `service_type`, `ptype`, `pcategory`, `pconfiguration`, `min_area`, `max_area`, `area_unit`, `min_price`, `max_price`, `price_unit`, `other_details`, `country`, `state`, `city`, `locality`, `clicked`, `status`, `followup`, `followup_dt`, `comments`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                connection.query(
                  query,
                  [
                    results.insertId,
                    values[i].assignto_id,
                    req.body.login_u_id,
                    values[i].create_dt,
                    values[i].update_dt,
                    values[i].s_ccode,
                    values[i].s_mob,
                    values[i].s_email,
                    values[i].pname,
                    values[i].service_type,
                    values[i].ptype,
                    values[i].pcategory,
                    values[i].pconfiguration,
                    values[i].min_area,
                    values[i].max_area,
                    values[i].area_unit,
                    values[i].min_price,
                    values[i].max_price,
                    values[i].price_unit,
                    values[i].other_details,
                    values[i].country,
                    values[i].state,
                    values[i].city,
                    values[i].locality,
                    1,
                    values[i].status,
                    values[i].followup,
                    values[i].followup_dt,
                    "By " +
                      req.body.login_username +
                      ", " +
                      dayjs().format("MMM DD,YYYY h:mm A") +
                      "= " +
                      values[i].comments,
                  ],
                  (error, result) => {
                    if (error) {
                      console.log(error);
                    }
                  }
                );
              }
            }
          );
        }
        connection.release();
        // Send a success response when all operations are complete.
        res.status(200).json({ affectedRows: values.length });
      } else {
        res
          .status(400)
          .json({ message: "No data found", error: "No data found" });
      }
    });
  } else {
    // if import leads form master or admin login
    // Check if all columns exist in CSV
    const keysToCheck = [
      "create_dt",
      "update_dt",
      "source_type",
      "brk_id",
      "ref_name",
      "ref_ccode",
      "ref_mob",
      "ref_email",
      "source",
      "service_type",
      "lname",
      "p_ccode",
      "p_mob",
      "p_email",
      "s_ccode",
      "s_mob",
      "s_email",
      "pname",
      "ptype",
      "pcategory",
      "pconfiguration",
      "country",
      "state",
      "city",
      "locality",
      "min_area",
      "max_area",
      "area_unit",
      "min_price",
      "max_price",
      "price_unit",
      "status",
      "followup",
      "followup_dt",
      "comments",
      "other_details",
    ];

    const allKeysExist = keysToCheck.every((key) =>
      data[0].hasOwnProperty(key)
    );

    if (
      allKeysExist === false ||
      keysToCheck.length !== Object.keys(data[0]).length
    ) {
      // console.log("Incorrect File Format");
      res.status(400).json({
        message: "Incorrect File, Please Download Fresh usersCSV File",
        error: "Incorrect File Format",
      });
      return;
    }

    pool.getConnection(function (error, connection) {
      if (error) {
        console.log(error); // Log the error
        res.status(500).json({ error: "Database connection error" });
        connection.release();
        return; // Return early to avoid further execution
      }
      let rowcount = 1;
      for (const {
        create_dt,
        update_dt,
        source_type,
        brk_id,
        ref_name,
        ref_ccode,
        ref_mob,
        ref_email,
        source,
        service_type,
        lname,
        p_ccode,
        p_mob,
        p_email,
        s_ccode,
        s_mob,
        s_email,
        pname,
        ptype,
        pcategory,
        pconfiguration,
        country,
        state,
        city,
        locality,
        min_area,
        max_area,
        area_unit,
        min_price,
        max_price,
        price_unit,
        status,
        followup,
        followup_dt,
        comments,
        other_details,
      } of data) {
        let formattedCreateDt = formatDate(create_dt);
        let formattedUpdateDt = formatDate(update_dt);
        let formattedFollowupDt = formatDate(followup_dt);
        let price_unit1 = price_unit.includes("Rupee")
          ? "(₹) Rupee"
          : price_unit;
        let assign_status = "Yes";

        rowcount++;

        // check if all fields are empty
        if (
          create_dt === "" &&
          update_dt === "" &&
          source_type === "" &&
          brk_id === "" &&
          ref_name === "" &&
          ref_ccode === "" &&
          ref_mob === "" &&
          ref_email === "" &&
          source === "" &&
          service_type === "" &&
          lname === "" &&
          p_ccode === "" &&
          p_mob === "" &&
          p_email === "" &&
          s_ccode === "" &&
          s_mob === "" &&
          s_email === "" &&
          pname === "" &&
          ptype === "" &&
          pcategory === "" &&
          pconfiguration === "" &&
          country === "" &&
          state === "" &&
          city === "" &&
          locality === "" &&
          min_area === "" &&
          max_area === "" &&
          area_unit === "" &&
          min_price === "" &&
          max_price === "" &&
          price_unit === "" &&
          status === "" &&
          followup === "" &&
          followup_dt === "" &&
          comments === "" &&
          other_details === ""
        ) {
          // console.log("No Data Found");
          continue;
        } else if (source_type === "") {
          res.status(400).json({
            message: `source_type is missing at row no ${rowcount}`,
            error: "source_type Not Found",
          });
          return;
        } else if (source_type === "Direct" && source === "") {
          res.status(400).json({
            message: `source is missing at row no ${rowcount}`,
            error: "source Not Found",
          });
          return;
        } else if (
          source_type === "Direct" &&
          (ref_name !== "" ||
            ref_ccode !== "" ||
            ref_mob !== "" ||
            ref_email !== "" ||
            brk_id !== "")
        ) {
          let msgstr = "";
          if (ref_name !== "") {
            msgstr += "ref_name";
          }
          if (ref_name !== "" && ref_ccode !== "") {
            msgstr += ", ";
          }
          if (ref_ccode !== "") {
            msgstr += "ref_ccode";
          }
          if (ref_ccode !== "" && ref_mob !== "") {
            msgstr += ", ";
          }
          if (ref_mob !== "") {
            msgstr += "ref_mob";
          }
          if (ref_mob !== "" && ref_email !== "") {
            msgstr += ", ";
          }
          if (ref_email !== "") {
            msgstr += "ref_email";
          }
          if (ref_email !== "" && brk_id !== "") {
            msgstr += ", ";
          }
          if (brk_id !== "") {
            msgstr += "brk_id";
          }
          res.status(400).json({
            message: `${msgstr} must be empty at row no ${rowcount}`,
            error: "reference Columns & brk_id must be empty",
          });
          return;
        } else if (
          source_type === "Reference" &&
          (source !== "" || brk_id !== "")
        ) {
          let msgstr = "";
          if (source !== "") {
            msgstr += "source";
          }
          if (source !== "" && brk_id !== "") {
            msgstr += ", ";
          }
          if (brk_id !== "") {
            msgstr += "brk_id";
          }
          res.status(400).json({
            message: `${msgstr} must be empty at row no ${rowcount}`,
            error: "source & brk_id must be empty",
          });
          return;
        } else if (
          source_type === "Reference" &&
          (ref_name === "" ||
            ref_ccode === "" ||
            ref_mob === "" ||
            ref_email === "")
        ) {
          let msgstr = "";
          if (ref_name === "") {
            msgstr += "ref_name";
          }
          if (ref_name === "" && ref_ccode === "") {
            msgstr += ", ";
          }
          if (ref_ccode === "") {
            msgstr += "ref_ccode";
          }
          if (ref_ccode === "" && ref_mob === "") {
            msgstr += ", ";
          }
          if (ref_mob === "") {
            msgstr += "ref_mob";
          }
          if (ref_mob === "" && ref_email === "") {
            msgstr += ", ";
          }
          if (ref_email === "") {
            msgstr += "ref_email";
          }
          // console.log("test", msgstr);
          res.status(400).json({
            message: `missing data in ${msgstr} at row no ${rowcount}`,
            error: "reference column data not found",
          });
          return;
        } else if (source_type === "Broker" && brk_id === "") {
          res.status(400).json({
            message: `brk_id missing at row no ${rowcount}`,
            error: "source must be empty",
          });
          return;
        } else if (
          source_type === "Broker" &&
          (ref_name !== "" ||
            ref_ccode !== "" ||
            ref_mob !== "" ||
            ref_email !== "" ||
            source !== "")
        ) {
          let msgstr = "";
          if (ref_name !== "") {
            msgstr += "ref_name";
          }
          if (ref_name !== "" && ref_ccode !== "") {
            msgstr += ", ";
          }
          if (ref_ccode !== "") {
            msgstr += "ref_ccode";
          }
          if (ref_ccode !== "" && ref_mob !== "") {
            msgstr += ", ";
          }
          if (ref_mob !== "") {
            msgstr += "ref_mob";
          }
          if (ref_mob !== "" && ref_email !== "") {
            msgstr += ", ";
          }
          if (ref_email !== "") {
            msgstr += "ref_email";
          }
          if (
            (ref_name !== "" ||
              ref_ccode !== "" ||
              ref_mob !== "" ||
              ref_email !== "") &&
            source !== ""
          ) {
            msgstr += ", ";
          }
          if (source !== "") {
            msgstr += "source";
          }
          // console.log("test", msgstr);
          res.status(400).json({
            message: `${msgstr} must be empty at row no ${rowcount}`,
            error: "reference column & source must be empty",
          });
          return;
        } else if (min_area !== "" && max_area !== "" && area_unit === "") {
          res.status(400).json({
            message: `area_unit is missing at row no ${rowcount}`,
            error: "area_unit Not Found",
          });
          return;
        } else if (
          min_area !== "" &&
          max_area !== "" &&
          area_unit !== "" &&
          Number(min_area) >= Number(max_area)
        ) {
          res.status(400).json({
            message: `min_area must be less than max_area at row no ${rowcount}`,
            error: "min_area must be less than max_area",
          });
          return;
        } else if (min_price !== "" && max_price !== "" && price_unit === "") {
          res.status(400).json({
            message: `price_unit is missing at row no ${rowcount}`,
            error: "price_unit Not Found",
          });
          return;
        } else if (
          min_price !== "" &&
          max_price !== "" &&
          price_unit !== "" &&
          Number(min_price) >= Number(max_price)
        ) {
          res.status(400).json({
            message: `min_price must be less than max_price at row no ${rowcount}`,
            error: "min_price must be less than max_price",
          });
          return;
        } else if (followup === "Yes" && followup_dt === "") {
          res.status(400).json({
            message: `followup_dt is missing at row no ${rowcount}`,
            error: "followup_dt Not Found",
          });
          return;
        } else if (followup === "" && followup_dt !== "") {
          res.status(400).json({
            message: `followup is missing at row no ${rowcount}`,
            error: "followup Not Found",
          });
          return;
        } else {
          values.push({
            create_dt: formattedCreateDt,
            update_dt: formattedUpdateDt,
            source_type,
            brk_id,
            ref_name,
            ref_ccode,
            ref_mob,
            ref_email,
            source,
            service_type,
            lname,
            p_ccode,
            p_mob,
            p_email,
            s_ccode,
            s_mob,
            s_email,
            pname,
            ptype,
            pcategory,
            pconfiguration,
            country,
            state,
            city,
            locality,
            min_area,
            max_area,
            area_unit,
            min_price,
            max_price,
            price_unit: encodeURIComponent(price_unit1),
            status,
            followup,
            followup_dt: formattedFollowupDt,
            comments,
            other_details,
            assign_status,
          });
        }
      }
      if (values.length > 0) {
        for (let i = 0; i < values.length; i++) {
          const query =
            "INSERT INTO crm_lead_primary_details (u_id, create_dt, update_dt, source_type, brk_id, ref_name, ref_ccode, ref_mob, ref_email, source, service_type, lname, p_ccode, p_mob, p_email, s_ccode, s_mob, s_email, pname, ptype, pcategory, pconfiguration, country, state, city, locality, identity, clicked, min_area, max_area, area_unit, min_price, max_price, price_unit, status, followup, followup_dt, comments, other_details, assign_status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
          connection.query(
            query,
            [
              req.body.login_u_id,
              values[i].create_dt,
              values[i].update_dt,
              values[i].source_type,
              values[i].brk_id,
              values[i].ref_name,
              values[i].ref_ccode,
              values[i].ref_mob,
              values[i].ref_email,
              values[i].source,
              values[i].service_type,
              values[i].lname,
              values[i].p_ccode,
              values[i].p_mob,
              values[i].p_email,
              values[i].s_ccode,
              values[i].s_mob,
              values[i].s_email,
              values[i].pname,
              values[i].ptype,
              values[i].pcategory,
              values[i].pconfiguration,
              values[i].country,
              values[i].state,
              values[i].city,
              values[i].locality,
              "imported",
              "1",
              values[i].min_area,
              values[i].max_area,
              values[i].area_unit,
              values[i].min_price,
              values[i].max_price,
              values[i].price_unit,
              values[i].status,
              values[i].followup,
              values[i].followup_dt,
              "By " +
                req.body.login_username +
                ", " +
                dayjs().format("MMM DD,YYYY h:mm A") +
                "= " +
                values[i].comments,
              values[i].other_details,
              values[i].assign_status,
            ],
            (error, results) => {
              if (error) {
                console.log(error);
              } else {
                const query =
                  "INSERT INTO crm_lead_req_details (`l_id`, `assignto_id`, `assignby_id`, `create_dt`, `update_dt`, `s_ccode`, `s_mob`, `s_email`, `pname`, `service_type`, `ptype`, `pcategory`, `pconfiguration`, `min_area`, `max_area`, `area_unit`, `min_price`, `max_price`, `price_unit`, `other_details`, `country`, `state`, `city`, `locality`, `clicked`, `status`, `followup`, `followup_dt`, `comments`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                connection.query(
                  query,
                  [
                    results.insertId,
                    req.body.login_u_id,
                    req.body.login_u_id,
                    values[i].create_dt,
                    values[i].update_dt,
                    values[i].s_ccode,
                    values[i].s_mob,
                    values[i].s_email,
                    values[i].pname,
                    values[i].service_type,
                    values[i].ptype,
                    values[i].pcategory,
                    values[i].pconfiguration,
                    values[i].min_area,
                    values[i].max_area,
                    values[i].area_unit,
                    values[i].min_price,
                    values[i].max_price,
                    values[i].price_unit,
                    values[i].other_details,
                    values[i].country,
                    values[i].state,
                    values[i].city,
                    values[i].locality,
                    1,
                    values[i].status,
                    values[i].followup,
                    values[i].followup_dt,
                    "By " +
                      req.body.login_username +
                      ", " +
                      dayjs().format("MMM DD,YYYY h:mm A") +
                      "= " +
                      values[i].comments,
                  ],
                  (error, result) => {
                    if (error) {
                      console.log(error);
                    }
                  }
                );
              }
            }
          );
        }
        connection.release();
        // Send a success response when all operations are complete.
        res.status(200).json({ affectedRows: values.length });
      } else {
        res
          .status(400)
          .json({ message: "No data found", error: "No data found" });
      }
    });
  }
});

ImportLeadRouter.get("/get-total-import-lead-table-data", (req, res) => {
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;
  const { page, pageSize } = req.query;
  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize);

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        `SELECT lpd.l_id AS l_id, lrd.lreq_id AS assignlead_id, GROUP_CONCAT(cu.username) AS assign_users, lpd.create_dt, lpd.brk_id, lpd.ref_name, lpd.ref_ccode, lpd.ref_mob, lpd.ref_email, lpd.identity, lpd.lname, CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile, lpd.p_ccode, lpd.p_mob, lpd.s_ccode, lpd.s_mob, lpd.form_name, lpd.p_email, lpd.status as admin_status, GROUP_CONCAT(lrd.status,' - ', cu.username) AS users_status, lpd.pname, lpd.followup, lpd.followup_dt, lpd.source, lpd.city, lpd.locality, lpd.sub_locality, lpd.comments, ls.color, lpd.clicked, lpd.source_type, lpd.service_type, lpd.ptype, lpd.pcategory, lpd.pconfiguration, lpd.min_area, lpd.max_area, lpd.area_unit, lpd.min_price, lpd.max_price, lpd.price_unit, lpd.country, lpd.state, lpd.other_details, lpd.assign_status, (SELECT clh.status FROM crm_lead_history AS clh WHERE clh.l_id = lpd.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_status, (SELECT cu.username FROM crm_lead_history AS clh LEFT JOIN crm_users AS cu ON clh.u_id = cu.u_id WHERE clh.l_id = lpd.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_username, (SELECT ls.color FROM crm_lead_history AS clh LEFT JOIN crm_lead_status AS ls ON clh.status = ls.status WHERE clh.l_id = lpd.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_status_color FROM crm_lead_primary_details AS lpd LEFT JOIN crm_lead_req_details AS lrd ON lrd.l_id = lpd.l_id LEFT JOIN crm_lead_status AS ls ON ls.status = lpd.status LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id WHERE lpd.identity = 'imported' GROUP BY lpd.l_id ORDER BY CASE WHEN lpd.clicked = 1 THEN 0 ELSE 1 END, lpd.l_id DESC LIMIT ? OFFSET ?`,
        [limit, offset],
        (err, result) => {
          if (err) {
            res.send(err);
            console.log(err);
          } else {
            res.json(result);
          }
          connection.release();
        }
      );
    });
  } else if (user_role === "Team Leader") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        `SELECT 
          lrd.lreq_id AS l_id, 
          lrd.l_id AS assignlead_id, 
          lrd.create_dt, 
          lpd.brk_id, 
          lpd.ref_name, 
          lpd.ref_ccode, 
          lpd.ref_mob, 
          lpd.ref_email, 
          lpd.lname, 
          CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile, 
          lpd.p_ccode, 
          lpd.p_mob, 
          lpd.s_ccode, 
          lpd.s_mob, 
          lpd.form_name, 
          lpd.p_email, 
          lrd.status as team_leader_status, 
          GROUP_CONCAT(lrd.status, ' - ', cu.username) AS users_status, 
          lpd.pname, 
          lrd.followup, 
          lrd.followup_dt, 
          lpd.source, 
          lpd.city, 
          lpd.locality,
          lpd.identity,
          lpd.sub_locality, 
          lrd.comments, 
          ls.color, 
          lrd.clicked, 
          lpd.source_type, 
          lpd.service_type, 
          lpd.ptype, 
          lpd.pcategory, 
          lpd.pconfiguration, 
          lpd.min_area, 
          lpd.max_area, 
          lpd.area_unit, 
          lpd.min_price, 
          lpd.max_price, 
          lpd.price_unit, 
          lpd.country, 
          lpd.state, 
          lpd.other_details, 
          lpd.assign_status, 
          (SELECT clh.status 
            FROM crm_lead_history AS clh 
            WHERE clh.l_id = lpd.l_id 
            AND (clh.u_id = ? 
            OR clh.u_id IN (SELECT crm_lead_req_details.assignto_id 
                            FROM crm_lead_req_details 
                            WHERE crm_lead_req_details.assignby_id = ? 
                            AND crm_lead_req_details.l_id = lpd.l_id) 
            OR clh.u_id IN (SELECT u_id 
                            FROM crm_users 
                            WHERE utype = 'Admin')) 
            ORDER BY clh.update_dt DESC LIMIT 1) AS latest_status, 
          (SELECT ls.color 
            FROM crm_lead_history AS clh 
            LEFT JOIN crm_lead_status AS ls 
            ON clh.status = ls.status 
            WHERE clh.l_id = lpd.l_id 
            AND (clh.u_id = ? 
            OR clh.u_id IN (SELECT crm_lead_req_details.assignto_id 
                            FROM crm_lead_req_details 
                            WHERE crm_lead_req_details.assignby_id = ? 
                            AND crm_lead_req_details.l_id = lpd.l_id) 
            OR clh.u_id IN (SELECT u_id 
                            FROM crm_users 
                            WHERE utype = 'Admin')) 
            ORDER BY clh.update_dt DESC LIMIT 1) AS latest_status_color, 
          (SELECT cu.username 
            FROM crm_lead_history AS clh 
            LEFT JOIN crm_users AS cu 
            ON clh.u_id = cu.u_id 
            WHERE clh.l_id = lpd.l_id 
            AND (clh.u_id = ? 
            OR clh.u_id IN (SELECT crm_lead_req_details.assignto_id 
                            FROM crm_lead_req_details 
                            WHERE crm_lead_req_details.assignby_id = ? 
                            AND crm_lead_req_details.l_id = lpd.l_id) 
            OR clh.u_id IN (SELECT u_id 
                            FROM crm_users 
                            WHERE utype = 'Admin')) 
            ORDER BY clh.update_dt DESC LIMIT 1) AS latest_username 
        FROM crm_lead_req_details AS lrd 
        JOIN crm_lead_primary_details AS lpd 
        ON lpd.l_id = lrd.l_id 
        LEFT JOIN crm_lead_status AS ls 
        ON lrd.status = ls.status 
        LEFT JOIN crm_users AS cu 
        ON cu.u_id = lrd.assignto_id 
        WHERE lrd.assignto_id = ? 
        AND lpd.identity = 'imported' 
        GROUP BY lrd.l_id 
        ORDER BY CASE WHEN lrd.clicked = 1 THEN 0 ELSE 1 END, lrd.l_id DESC 
        LIMIT ? OFFSET ?`,
        [
          user_id,
          user_id,
          user_id,
          user_id,
          user_id,
          user_id,
          user_id,
          limit,
          offset,
        ],
        (err, result) => {
          if (err) {
            console.log(err);
            res.send(err);
          } else {
            res.json(result);
          }
          connection.release();
        }
      );
    });
  } else if (user_role === "Sales Manager") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        `SELECT 
          lrd.lreq_id AS l_id, 
          lrd.l_id AS assignlead_id, 
          lrd.create_dt, 
          lpd.brk_id, 
          lpd.ref_name, 
          lpd.ref_ccode, 
          lpd.ref_mob, 
          lpd.ref_email, 
          lpd.lname, 
          CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile, 
          lpd.p_ccode, 
          lpd.p_mob, 
          lpd.s_ccode, 
          lpd.s_mob, 
          lpd.form_name, 
          lpd.p_email, 
          lrd.status as team_leader_status, 
          GROUP_CONCAT(lrd.status, ' - ', cu.username) AS users_status, 
          lpd.pname, 
          lrd.followup, 
          lrd.followup_dt, 
          lpd.source, 
          lpd.city, 
          lpd.locality,
          lpd.identity,
          lpd.sub_locality, 
          lrd.comments, 
          ls.color, 
          lrd.clicked, 
          lpd.source_type, 
          lpd.service_type, 
          lpd.ptype, 
          lpd.pcategory, 
          lpd.pconfiguration, 
          lpd.min_area, 
          lpd.max_area, 
          lpd.area_unit, 
          lpd.min_price, 
          lpd.max_price, 
          lpd.price_unit, 
          lpd.country, 
          lpd.state, 
          lpd.other_details, 
          lpd.assign_status, 
          (SELECT clh.status 
            FROM crm_lead_history AS clh 
            WHERE clh.l_id = lpd.l_id 
            AND (clh.u_id = ? 
            OR clh.u_id IN (SELECT crm_lead_req_details.assignto_id 
                            FROM crm_lead_req_details 
                            WHERE crm_lead_req_details.assignby_id = ? 
                            AND crm_lead_req_details.l_id = lpd.l_id) 
            OR clh.u_id IN (SELECT u_id 
                            FROM crm_users 
                            WHERE utype = 'Admin')) 
            ORDER BY clh.update_dt DESC LIMIT 1) AS latest_status, 
          (SELECT ls.color 
            FROM crm_lead_history AS clh 
            LEFT JOIN crm_lead_status AS ls 
            ON clh.status = ls.status 
            WHERE clh.l_id = lpd.l_id 
            AND (clh.u_id = ? 
            OR clh.u_id IN (SELECT crm_lead_req_details.assignto_id 
                            FROM crm_lead_req_details 
                            WHERE crm_lead_req_details.assignby_id = ? 
                            AND crm_lead_req_details.l_id = lpd.l_id) 
            OR clh.u_id IN (SELECT u_id 
                            FROM crm_users 
                            WHERE utype = 'Admin')) 
            ORDER BY clh.update_dt DESC LIMIT 1) AS latest_status_color, 
          (SELECT cu.username 
            FROM crm_lead_history AS clh 
            LEFT JOIN crm_users AS cu 
            ON clh.u_id = cu.u_id 
            WHERE clh.l_id = lpd.l_id 
            AND (clh.u_id = ? 
            OR clh.u_id IN (SELECT crm_lead_req_details.assignto_id 
                            FROM crm_lead_req_details 
                            WHERE crm_lead_req_details.assignby_id = ? 
                            AND crm_lead_req_details.l_id = lpd.l_id) 
            OR clh.u_id IN (SELECT u_id 
                            FROM crm_users 
                            WHERE utype = 'Admin')) 
            ORDER BY clh.update_dt DESC LIMIT 1) AS latest_username 
        FROM crm_lead_req_details AS lrd 
        JOIN crm_lead_primary_details AS lpd 
        ON lpd.l_id = lrd.l_id 
        LEFT JOIN crm_lead_status AS ls 
        ON lrd.status = ls.status 
        LEFT JOIN crm_users AS cu 
        ON cu.u_id = lrd.assignto_id 
        WHERE lrd.assignto_id = ? 
        AND lpd.identity = 'imported' 
        GROUP BY lrd.l_id 
        ORDER BY CASE WHEN lrd.clicked = 1 THEN 0 ELSE 1 END, lrd.l_id DESC 
        LIMIT ? OFFSET ?`,
        [
          user_id,
          user_id,
          user_id,
          user_id,
          user_id,
          user_id,
          user_id,
          limit,
          offset,
        ],
        (err, result) => {
          if (err) {
            console.log(err);
            res.send(err);
          } else {
            res.json(result);
          }
          connection.release();
        }
      );
    });
  } else {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        `SELECT 
          lrd.lreq_id AS l_id, 
          lrd.l_id AS assignlead_id, 
          lrd.create_dt, 
          lpd.brk_id, 
          lpd.ref_name, 
          lpd.ref_ccode, 
          lpd.ref_mob, 
          lpd.ref_email, 
          lpd.lname, 
          CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile, 
          lpd.p_ccode, 
          lpd.p_mob, 
          lpd.s_ccode, 
          lpd.s_mob, 
          lpd.form_name, 
          lpd.p_email, 
          lrd.status as team_leader_status, 
          GROUP_CONCAT(lrd.status, ' - ', cu.username) AS users_status, 
          lpd.pname, 
          lrd.followup, 
          lrd.followup_dt, 
          lpd.source, 
          lpd.city, 
          lpd.locality,
          lpd.identity,
          lpd.sub_locality, 
          lrd.comments, 
          ls.color, 
          lrd.clicked, 
          lpd.source_type, 
          lpd.service_type, 
          lpd.ptype, 
          lpd.pcategory, 
          lpd.pconfiguration, 
          lpd.min_area, 
          lpd.max_area, 
          lpd.area_unit, 
          lpd.min_price, 
          lpd.max_price, 
          lpd.price_unit, 
          lpd.country, 
          lpd.state, 
          lpd.other_details, 
          lpd.assign_status, 
          (SELECT clh.status 
            FROM crm_lead_history AS clh 
            WHERE clh.l_id = lpd.l_id 
            AND (clh.u_id = ? 
            OR clh.u_id IN (SELECT crm_lead_req_details.assignto_id 
                            FROM crm_lead_req_details 
                            WHERE crm_lead_req_details.assignby_id = ? 
                            AND crm_lead_req_details.l_id = lpd.l_id) 
            OR clh.u_id IN (SELECT u_id 
                            FROM crm_users 
                            WHERE utype = 'Admin')) 
            ORDER BY clh.update_dt DESC LIMIT 1) AS latest_status, 
          (SELECT ls.color 
            FROM crm_lead_history AS clh 
            LEFT JOIN crm_lead_status AS ls 
            ON clh.status = ls.status 
            WHERE clh.l_id = lpd.l_id 
            AND (clh.u_id = ? 
            OR clh.u_id IN (SELECT crm_lead_req_details.assignto_id 
                            FROM crm_lead_req_details 
                            WHERE crm_lead_req_details.assignby_id = ? 
                            AND crm_lead_req_details.l_id = lpd.l_id) 
            OR clh.u_id IN (SELECT u_id 
                            FROM crm_users 
                            WHERE utype = 'Admin')) 
            ORDER BY clh.update_dt DESC LIMIT 1) AS latest_status_color, 
          (SELECT cu.username 
            FROM crm_lead_history AS clh 
            LEFT JOIN crm_users AS cu 
            ON clh.u_id = cu.u_id 
            WHERE clh.l_id = lpd.l_id 
            AND (clh.u_id = ? 
            OR clh.u_id IN (SELECT crm_lead_req_details.assignto_id 
                            FROM crm_lead_req_details 
                            WHERE crm_lead_req_details.assignby_id = ? 
                            AND crm_lead_req_details.l_id = lpd.l_id) 
            OR clh.u_id IN (SELECT u_id 
                            FROM crm_users 
                            WHERE utype = 'Admin')) 
            ORDER BY clh.update_dt DESC LIMIT 1) AS latest_username 
        FROM crm_lead_req_details AS lrd 
        JOIN crm_lead_primary_details AS lpd 
        ON lpd.l_id = lrd.l_id 
        LEFT JOIN crm_lead_status AS ls 
        ON lrd.status = ls.status 
        LEFT JOIN crm_users AS cu 
        ON cu.u_id = lrd.assignto_id 
        WHERE lrd.assignto_id = ? 
        AND lpd.identity = 'imported' 
        GROUP BY lrd.l_id 
        ORDER BY CASE WHEN lrd.clicked = 1 THEN 0 ELSE 1 END, lrd.l_id DESC 
        LIMIT ? OFFSET ?`,
        [
          user_id,
          user_id,
          user_id,
          user_id,
          user_id,
          user_id,
          user_id,
          limit,
          offset,
        ],
        (err, result) => {
          if (err) {
            console.log(err);
            res.send(err);
          } else {
            res.json(result);
          }
          connection.release();
        }
      );
    });
  }
});

ImportLeadRouter.post("/get-total-import-lead-count", (req, res) => {
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT COUNT(lpd.l_id) AS totalCount FROM crm_lead_primary_details AS lpd WHERE lpd.identity = 'imported'",
        (err, result) => {
          if (err) {
            console.log("error", err);
            res.status(500).send(err);
          } else {
            res.json(result[0].totalCount);
          }
          connection.release();
        }
      );
    });
  } else {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT COUNT(lp.l_id) AS totalCount FROM crm_lead_req_details AS lrd JOIN crm_lead_primary_details AS lp ON lp.l_id = lrd.l_id WHERE lrd.assignto_id = ? AND lp.identity = 'imported'",
        [user_id],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.json(result[0].totalCount);
          }
          connection.release();
        }
      );
    });
  }
});

// for ES5
module.exports = ImportLeadRouter;
