"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const pgClient = new pg_1.Client("postgresql://postgres:mysecretpassword@localhost:5432/postgres?sslmode=disable");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield pgClient.connect();
    /* CREATE TABLE */
    //   const response = await pgClient.query("CREATE TABLE users (id SERIAL PRIMARY KEY ,username VARCHAR(50) UNIQUE NOT NULL,email VARCHAR(255) UNIQUE NOT NULL,password VARCHAR(255) NOT NULL,created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP);")
    /* INSERT TABLE */
    //   const response = await pgClient.query(
    //     "INSERT INTO users (username, email, password) VALUES ('username_here', 'user@example.com', 'user_password');"
    //   );
    /* SELECT TABLE */
    //  const response = await pgClient.query("SELECT * FROM users;");
    /* UPDATE TABLE */
    //   const response = await pgClient.query("UPDATE users SET username='Mridul' WHERE id=1;")
    //    console.log(response.rows);
});
main();
app.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        const response = yield pgClient.query(`INSERT INTO users (username, email, password) VALUES ('${username}', '${email}', '${password}');`);
        res.json({
            message: "User Signed in",
        });
    }
    catch (error) {
        res.json({
            message: "Errorn while signin ",
        });
    }
}));
app.listen(3000);
