const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./model");
const { getProfile } = require("./middleware/getProfile");
const {
  ContractsController,
  JobsController,
  BalancesController,
  AdminController
} = require("./controllers");

const app = express();
app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", sequelize.models);

app.get("/contracts/:id", getProfile, ContractsController.getContactById);
app.get("/contracts", getProfile, ContractsController.getUserContacts);

app.get("/jobs/unpaid", getProfile, JobsController.getUnpaidJobs);
app.post("/jobs/:jobId/pay", getProfile, JobsController.payForJob);

app.post("/balances/deposit/:userId", getProfile, BalancesController.depositToClient);

app.get("/admin/best-profession", getProfile, AdminController.getBestProfession);



module.exports = app;
