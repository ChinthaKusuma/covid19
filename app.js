const express = require("express");
const app = express();
const { open } = require("sqlite");
const path = require("path");
const dbPath = path.join(__dirname, "covid19India.db");
const sqlite3 = require("sqlite3");
let db = null;
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
  } catch (e) {
    console.log("Db Error");
  }
};
initiliazeDbAndServer();
module.exports = app;
