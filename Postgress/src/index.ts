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
};
main();

app.post("/", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const response = await pgClient.query(
      `INSERT INTO users (username, email, password) VALUES ('${username}', '${email}', '${password}');`
    );

    // How to master the sql Injection
    const query = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3);`;
    const values = [username, email, password];

    const response1 = await pgClient.query(query, values);
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
