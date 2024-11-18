import express from "express";
import * as fs from "fs";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import { object, string, number, date, InferType } from "yup";

const PORT = 3333;
const app = express();
app.use(express.json());

const readTodos = () => JSON.parse(fs.readFileSync("./data.json", "utf-8"));
const writeTodos = (todos) =>
  fs.writeFileSync("./data.json", JSON.stringify(todos), "utf-8");

const readUsers = () => JSON.parse(fs.readFileSync("./users.json", "utf-8"));
const writeUsers = (users) =>
  fs.writeFileSync("./users.json", JSON.stringify(users), "utf-8");

const signUpSchema = object({
  email: string()
  .email("Invalid email structure"),
  username: string()
  .min(3, "Username must be at least 3 letters long"),
  password: string()
  .min(8, "Password must be at least 3 letters long")
  .matches(/[0-9]/, "Password must contain at least one mumber")
  .matches(/[A-Z]/, "Password must contain at last one CAPITAL letter")
});

app.get("/signup", (req, res) => {
  const users = readUsers();
  res.send(users);
});

app.post("/signup", async (req, res) => {
  const users = readUsers();
  const { email, username, password } = req.body;

  await signUpSchema.validate({ email, username, password });

  if (!email || !username || !password) {
    return res.status(400).send({ message: "Incomplete input!" });
  }

  const userExists = users.find((user) => user.email === email);
  if (userExists) {
    return res.status(400).send({ message: "Email already exists" });
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(400).send({ message: "Hashing error" });
    const newUser = { id: nanoid(), email, username, password: hash };
    users.push(newUser);
    writeUsers(users);
    res.status(201).send({ message: "User registered successfully!" });
  });
});

app.post("/login", (req, res) => {
  const users = readUsers();
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: "Please don't leave empty input!" });
  }

  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(400).send({ message: "Email not found!" });
  }

  bcrypt.compare(password, user.password, (err, result) => {
    if (err) return res.status(400).send({ message: "Comparison error" });
    if (!result) {
      return res.status(400).send({ message: "Invalid password!" });
    }
    res.status(200).send({ message: "Login successful!" });
  });
});

app.get("/todos", (req, res) => {
  const todos = readTodos();
  res.send(todos);
});

app.post("/todos", (req, res) => {
  const todos = readTodos();
  const { title } = req.body;

  if (!title) return res.status(400).send({ message: "Title is required" });

  const newTodo = {
    id: nanoid(),
    title,
    checked: false,
  };
  todos.push(newTodo);
  writeTodos(todos);
  res.status(201).send(newTodo);
});

app.get("/todos/:id", (req, res) => {
  const todos = readTodos();
  const { id } = req.params;

  const todo = todos.find((item) => item.id === id);
  if (!todo) return res.status(404).send({ message: "Todo not found!" });

  res.send(todo);
});

app.delete("/todos/:id", (req, res) => {
  const todos = readTodos();
  const { id } = req.params;

  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) return res.status(404).send({ message: "Todo not found!" });

  todos.splice(index, 1);
  writeTodos(todos);
  res.send({ message: `Todo with id ${id} deleted successfully.` });
});

app.put("/todos/:id", (req, res) => {
  const todos = readTodos();
  const { id } = req.params;

  const todo = todos.find((item) => item.id === id);
  if (!todo) return res.status(404).send({ message: "Todo not found!" });

  if (req.body.title) todo.title = req.body.title;
  if (typeof req.body.checked === "boolean") todo.checked = req.body.checked;

  writeTodos(todos);
  res.send(todo);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
