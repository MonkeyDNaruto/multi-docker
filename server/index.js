const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// setup cors
const cors = require("cors");
app.use(cors());

// setup redis client and publisher
const { createClient } = require("@redis/client");
const {
  REDIS_HOST,
  REDIS_PORT,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DATABASE,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
} = require("./keys");
const redisClient = createClient({
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
});
const redisPublisher = redisClient.duplicate();

// setup pgclient
const { Pool } = require("pg");
const asyncHandler = require("./middleware/async_handler.middleware");
const errorHandler = require("./middleware/error_handler.middleware");
const pgClient = new Pool({
  host: POSTGRES_HOST,
  port: POSTGRES_PORT,
  database: POSTGRES_DATABASE,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
});

pgClient.on("connect", (client) => {
  client
    .query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .then((_) => {
      console.log(`connected to the pg client`);
    })
    .catch((err) => console.error(err));
});

(async () => {
  await redisClient.connect();
  await redisPublisher.connect();
  await pgClient.connect();
})();

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "app is running",
    data: null,
  });
});

app.get(
  "/values/all",
  asyncHandler(async (req, res) => {
    const response = await pgClient.query("SELECT * FROM values");

    res.status(200).json({
      success: true,
      message: "all valus is fetched.",
      data: response.rows,
    });
  })
);

app.get(
  "/values/current",
  asyncHandler(async (req, res) => {
    const response = await redisClient.hGetAll("values");

    res.status(200).json({
      success: true,
      message: "current value is fetched successfully.",
      data: response,
    });
  })
);

app.post(
  "/values",
  asyncHandler((req, res, next) => {
    const index = req.body.index;

    if (parseInt(index) > 40) {
      return next(new Error(`the index is too large to find the fib value`));
    }

    redisClient.hSet("values", index, "nothing yet");
    redisPublisher.publish("insert", index);
    pgClient.query("INSERT INTO values(number) VALUES ($1)", [index]);

    res.status(200).json({
      success: true,
      message: "new value is created successfully.",
      data: null,
    });
  })
);

app.use(errorHandler);

const PORT = 5000;
const server = app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(`server error:${err.message}`);
  server.close();
  process.exit(1);
});
