const express = require("express");
const { Pool } = require("pg");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

dotenv.config();
const app = express();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

pool
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL database!");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

app.use(bodyParser.json());

// Homepage endpoint

app.get("/", (req, res) => {
  const info = {
    message: "Welcome to the xSystem API!",
    endpoints: [
      { method: "GET", path: "/properties" },
      { method: "POST", path: "/new-property" },
      { method: "GET", path: "/bookings" },
      { method: "POST", path: "/new-booking" },
      { method: "GET", path: "/reviews" },
      { method: "POST", path: "/new-review" },
      { method: "GET", path: "/reviews/:property_id" },
      { method: "GET", path: "/create-table" },
    ],
  };

  res.json(info);
});

// Properties endpoint

app.get("/properties", (req, res) => {
  pool.query("SELECT * FROM properties", (error, results) => {
    if (error) {
      console.error("Error executing query", error);
      res.status(500).send("Internal Server Error");
    } else {
      res.json(results.rows);
    }
  });
});

app.post("/new-property", express.json(), (req, res) => {
  const {
    name,
    city,
    country,
    description,
    price_per_night,
    max_guests,
    address,
  } = req.body;

  const insertQuery = `
    INSERT INTO properties (name, city, country, description, price_per_night, max_guests, address)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id;
  `;
  pool.query(
    insertQuery,
    [name, city, country, description, price_per_night, max_guests, address],
    (error, results) => {
      if (error) {
        console.error("Error inserting new property", error);
        res.status(500).send("Internal Server Error");
      } else {
        const newPropertyId = results.rows[0].id;
        res.status(201).json({
          id: newPropertyId,
          name,
          city,
          country,
          message: name + " added successfully!",
        });
      }
    }
  );
});

// Booking endpoint

app.get("/bookings", (req, res) => {
  pool.query(
    "SELECT * FROM bookings WHERE end_date > NOW()",
    (error, results) => {
      if (error) {
        console.error("Error executing query", error);
        res.status(500).send("Internal Server Error");
      } else {
        res.json(results.rows);
      }
    }
  );
});

app.post("/new-booking", express.json(), (req, res) => {
  const {
    property_id,
    user_email,
    phone_number,
    start_date,
    end_date,
    total_price,
  } = req.body;

  const insertQuery = `
    INSERT INTO bookings (property_id, user_email, phone_number, start_date, end_date, total_price)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id;
  `;
  pool.query(
    insertQuery,
    [property_id, user_email, phone_number, start_date, end_date, total_price],
    (error, results) => {
      if (error) {
        console.error("Error booking property", error);
        res.status(500).send("Internal Server Error");
      } else {
        const newBookingId = results.rows[0].id;
        res.status(201).json({
          id: newBookingId,
          property_id,
          start_date,
          end_date,
          message: "Booking created successfully!",
        });
      }
    }
  );
});

// Reviews endpoint

app.get("/reviews", (req, res) => {
  pool.query("SELECT * FROM reviews", (error, results) => {
    if (error) {
      console.error("Error executing query", error);
      res.status(500).send("Internal Server Error");
    } else {
      res.json(results.rows);
    }
  });
});

app.post("/new-review", express.json(), (req, res) => {
  const { property_id, user_email, rating, comment } = req.body;
  const insertQuery = `
    INSERT INTO reviews (property_id, user_email, rating, comment)
    VALUES ($1, $2, $3, $4)
    RETURNING id;
  `;

  pool.query(
    insertQuery,
    [property_id, user_email, rating, comment],
    (error, results) => {
      if (error) {
        console.error("Error inserting new review", error);
        res.status(500).send("Internal Server Error");
      } else {
        const newReviewId = results.rows[0].id;
        res.status(201).json({
          id: newReviewId,
          property_id,
          user_email,
          rating,
          message: "Review added successfully!",
        });
      }
    }
  );
});

app.get("/reviews/:property_id", (req, res) => {
  const propertyId = req.params.property_id;
  if (isNaN(propertyId)) {
    return res.status(400).send("Invalid property ID");
  }
  pool.query(
    "SELECT * FROM reviews WHERE property_id = $1",
    [propertyId],
    (error, results) => {
      if (error) {
        console.error("Error fetching reviews", error);
        res.status(500).send("Internal Server Error");
      } else {
        res.json(results.rows);
      }
    }
  );
});

// Create table endpoint --> reviews done

app.get("/create-table", (req, res) => {
  const createTableQuery = `CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    property_id INT NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id)
);`;

  pool.query(createTableQuery, (error, results) => {
    if (error) {
      console.error("Error creating table", error);
      res.status(500).send("Internal Server Error");
    } else {
      res.send("Table created successfully!");
    }
  });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

// Export the app for testing purposes
module.exports = app;
