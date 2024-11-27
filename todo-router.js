import express from "express";
import * as fs from "fs";
import { nanoid } from "nanoid";

const router = express.Router();

const readTodos = () => JSON.parse(fs.readFileSync("./data.json", "utf-8"));
const writeTodos = (todos) =>
  fs.writeFileSync("./data.json", JSON.stringify(todos), "utf-8");

router.get("/", (req, res) => {
  const todos = readTodos();
  res.send(todos);
});

router.post("/", (req, res) => {
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

router.get("/:id", (req, res) => {
  const todos = readTodos();
  const { id } = req.params;

  const todo = todos.find((item) => item.id === id);
  if (!todo) return res.status(404).send({ message: "Todo not found!" });

  res.send(todo);
});

router.delete("/:id", (req, res) => {
  const todos = readTodos();
  const { id } = req.params;

  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) return res.status(404).send({ message: "Todo not found!" });

  todos.splice(index, 1);
  writeTodos(todos);
  res.send({ message: `Todo with id ${id} deleted successfully.` });
});

router.put("/:id", (req, res) => {
  const todos = readTodos();
  const { id } = req.params;

  const todo = todos.find((item) => item.id === id);
  if (!todo) return res.status(404).send({ message: "Todo not found!" });

  if (req.body.title) todo.title = req.body.title;
  if (typeof req.body.checked === "boolean") todo.checked = req.body.checked;

  writeTodos(todos);
  res.send(todo);
});

export default router;
