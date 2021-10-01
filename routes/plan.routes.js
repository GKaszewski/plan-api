const routes = require("express").Router();
const db = require("../database");
const { QueryTypes } = require("sequelize");
const sequelize = require("sequelize");

const env = process.env.NODE_ENV || "dev";
const config = require("../config")[env];
const Course = require("../models/course.model");
const User = require("../models/user.model");

const fs = require("fs");
const csv = require("fast-csv");
const multer = require("multer");
const upload = multer({ dest: "/tmp/csv/" });

const headersDict = {
  dzien: "day",
  godz: "hour",
  przedmiot: "name",
  grupa: "group",
  nauczyciel: "professor",
  sala: "room",
  typ: "type",
  uwagi: "notes",
  dataod: "dateFrom",
  datado: "dateTo",
};

async function verifyToken(req, res, next) {
  await db.sync();
  const token = req.headers["authorization"];
  if (!token) return res.sendStatus(403);

  try {
    let user = await User.findOne({
      where: {
        token: token,
        isAdmin: true,
      },
    });

    if (!user) return res.sendStatus(403);
    next();
  } catch (e) {
    console.log(e);
  }
}

const createCourseFromCSV = (headers, row) => {
  const course = {};
  for (let i = 0; i < headers.length; i++) {
    if (i == 3) {
      let groupRow = row[i];
      let groups = groupRow.split("+");
      groups.forEach((group) => {
        group = group.slice(6);
        course[headersDict[headers[i]]] = group;
      });
    } else {
      course[headersDict[headers[i]]] = row[i];
    }
  }

  return course;
};

routes.post(
  "/plan/upload",
  verifyToken,
  upload.single("data"),
  async (req, res) => {
    await db.sync();
    const fileRows = [];
    csv
      .parseFile(req.file.path)
      .on("data", (data) => {
        fileRows.push(data);
      })
      .on("end", () => {
        headers = fileRows.shift();
        const courses = fileRows.reduce((stack, row) => {
          stack.push(createCourseFromCSV(headers, row));
          return stack;
        }, []);

        fs.unlinkSync(req.file.path);

        courses.forEach(async (course) => {
          let c = await Course.create(course);
        });

        return res.send(courses);
      });
  }
);

routes.get("/plan", async (req, res) => {
  await db.sync();
  let courses = await Course.findAll();
  return res.send(courses);
});

routes.post("/plan/groups", async (req, res) => {
  await db.sync();
  let body = req.body;
  if (!body) return res.sendStatus(400);
  let groups = body["groups"].toString();
  if (groups.length == 0) {
    let courses = await db.query(`SELECT * FROM "Courses" WHERE "group" = ''`, {
      type: QueryTypes.SELECT,
    });
    return res.send(courses);
  } else {
    let courses = await db.query(
      `SELECT * FROM "Courses" WHERE "group" IN (${groups}) OR "group" = ''`,
      { type: QueryTypes.SELECT }
    );
    return res.send(courses);
  }
});

module.exports = routes;
