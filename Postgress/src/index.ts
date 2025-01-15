import { Client } from "pg";
import express from "express";

const app = express();
const pgClient = new Client(
  "postgresql://postgres:mysecretpassword@localhost:5432/postgres?sslmode=disable"
);
const main = async () => {
  await pgClient.connect();

  /* CREATE TABLE */
  const response = await pgClient.query(
    "CREATE TABLE users (id SERIAL PRIMARY KEY ,username VARCHAR(50) UNIQUE NOT NULL,email VARCHAR(255) UNIQUE NOT NULL,password VARCHAR(255) NOT NULL,created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP);"
  );

  /* INSERT TABLE */
  const response1 = await pgClient.query(
    "INSERT INTO users (username, email, password) VALUES ('username_here', 'user@example.com', 'user_password');"
  );

  /* SELECT TABLE */
  const response2 = await pgClient.query("SELECT * FROM users;");
  console.log(response2.rows);
  /* UPDATE TABLE */
  const response3 = await pgClient.query(
    "UPDATE users SET username='Mridul' WHERE id=1;"
  );

  console.log(response3.rows);
  // Forgein Key
  const response4 = await pgClient.query(
    "CREATE TABLE addresses ( id SERIAL PRIMARY KEY,user_id INTEGER NOT NULL,city VARCHAR(100) NOT NULL,country VARCHAR(100) NOT NULL,street VARCHAR(255) NOT NULL,pincode VARCHAR(20),created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE; )"
  );
  console.log(response4);
};
main();

app.post("/", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    const city = req.body.city;
    const country = req.body.country;
    const street = req.body.street;

    const response = await pgClient.query(
      `INSERT INTO users (username, email, password) VALUES ('${username}', '${email}', '${password}');`
    );

    // How to master the sql Injection
    const query = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id; `;
    const values = [username, email, password];

    const response1 = await pgClient.query(query, values);
    const user_id = response1.rows[0].id;

    // Transaction begin
    await pgClient.query("BEGIN;");

    // Foreign Key Ussage
    const query1 = `INSERT INTO addresses (city, country, street ,user_id) VALUES ($1, $2, $3 ,$4);`;
    const values1 = [city, country, street, user_id];

    const response2 = await pgClient.query(query1, values1);
    await pgClient.query("COMMIT;");
    res.json({
      message: "User Signed in",
    });
  } catch (error) {
    res.json({
      message: "Errorn while signin ",
    });
  }
});

app.listen(3000);

//  Creation of Foreign Key
/*
CREATE TABLE addresses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  street VARCHAR(255) NOT NULL,
  pincode VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);*/

// How to use Transaction

// use Pgclient.query("Begin;") is to begin the transaction
// use Pgclient.query("Commit;") is to begin the transaction
// If the server fails in between then there will be no entry in the  database Due to which this transaction is beneficial
