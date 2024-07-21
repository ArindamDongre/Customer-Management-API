import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import moment from "moment";
import { Customer } from "./models/customer.js";

const app = express();
const port = 3000;

app.use(bodyParser.json());

const connectionString =
  "mongodb+srv://arindamdongre:u38VFuKoYo1cz35w@cluster0.wrakhif.mongodb.net/";

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("connected to MongoDB");
});

const calculateAge = (dob) => moment().diff(dob, "years");

const apiHitTracker = new Map();

const checkRateLimit = (customerName) => {
  const currentTime = Date.now();
  const timeFrame2Min = 2 * 60 * 1000;
  const timeFrame5Min = 5 * 60 * 1000;

  if (!apiHitTracker.has(customerName)) {
    apiHitTracker.set(customerName, []);
  }

  const hits = apiHitTracker.get(customerName);
  const recentHits = hits.filter((hit) => currentTime - hit < timeFrame5Min);
  const hitsWithin2Mins = recentHits.filter(
    (hit) => currentTime - hit < timeFrame2Min
  );

  if (hitsWithin2Mins.length >= 1) {
    return { exceeded: true, message: "maximum limit exceeded" };
  }

  if (recentHits.lenght >= 2) {
    return { exceeded: true, message: "only 2 hits allowed per 5 min" };
  }

  recentHits.push(currentTime);
  apiHitTracker.set(customerName, recentHits);
  return { exceeded: false };
};

app.post("/db-save", async (req, res) => {
  const { customer_name, dob, monthly_income } = req.body;

  if (!customer_name || !dob || !monthly_income) {
    return res.status(400).json({ message: "All parameters are required" });
  }

  const age = calculateAge(dob);
  if (age < 15) {
    return res.status(400).json({ message: "Age must be above 15" });
  }

  const rateLimitCheck = checkRateLimit(customer_name);
  if (rateLimitCheck.exceeded) {
    return res.status(429).json({ message: rateLimitCheck.message });
  }

  try {
    const newCustomer = new Customer({ customer_name, dob, monthly_income });
    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(500).json({ message: "Error saving data" });
  }
});

app.post("/time-based-api", async (req, res) => {
  const { customer_name, dob, monthly_income } = req.body;
  const now = moment();

  if (!customer_name || !dob || !monthly_income) {
    return res.status(400).json({ message: "All parameters are required" });
  }

  if (now.day() === 1) {
    return res
      .status(403)
      .json({ message: "Please don't use this api on monday" });
  }

  if (now.hour() >= 8 && now.hour() < 15) {
    return res.status(403).json({ message: "Please try after 3pm" });
  }

  try {
    const newCustomer = new Customer({ customer_name, dob, monthly_income });
    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(500).json({ message: "Error saving data" });
  }
});

app.get("/db-search", async (req, res) => {
  const start = process.hrtime();

  const minAge = 10;
  const maxAge = 25;

  try {
    const customers = await Customer.find();
    const filteredCustomers = customers.filter((customer) => {
      const age = calculateAge(customer.dob);
      return age >= minAge && age <= maxAge;
    });

    const customerNames = filteredCustomers.map(
      (customer) => customer.customer_name
    );
    const end = process.hrtime(start);
    const timeTaken = end[0] + end[1] / 1e9;

    res.status(200).json({ customerNames, timeTaken });
  } catch (error) {
    res.status(500).json({ message: "Error fetching data" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
