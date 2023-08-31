const express = require("express");
const app = express();
const { open } = require("sqlite");
const path = require("path");
const dbPath = path.join(__dirname, "covid19India.db");
const sqlite3 = require("sqlite3");
let db = null;
app.use(express.json());
const convertCase = (eachElement) => {
  return {
    stateId: eachElement.state_id,
    stateName: eachElement.state_name,
    population: eachElement.population,
  };
};
const initiliazeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server has Started");
    });
    app.get("/states/", async (request, response) => {
      const query1 = `select * from state;`;
      const dbResponse1 = await db.all(query1);
      const result1 = dbResponse1.map((eachElement) =>
        convertCase(eachElement)
      );
      response.send(result1);
    });
    app.get("/states/:stateId", async (request, response) => {
      const { stateId } = request.params;
      const query2 = `select * from state where
           state_id=${stateId};`;
      const dbResponse2 = await db.get(query2);
      const result2 = convertCase(dbResponse2);
      response.send(result2);
    });
    app.post("/districts/", async (request, response) => {
      const districtData = request.body;
      const {
        districtName,
        stateId,
        cases,
        cured,
        active,
        deaths,
      } = districtData;
      const query3 = `update district set
        district_name='${districtName}',
        state_id=${stateId},
        cases=${cases},
        active=${active},
        deaths=${deaths};`;
      const dbResponse3 = await db.run(query3);
      response.send("District Successfully Added");
    });
  } catch (e) {
    console.log("Db Error");
  }
};
initiliazeDbAndServer();
module.exports = app;
