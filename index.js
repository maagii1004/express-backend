import express from "express";
import * as fs from "fs";

const PORT = 3333;
const app = express();
app.use(express.json());

const readTodos = () => {
  const data = fs.readFileSync("./data.json", "utf-8");
  return JSON.parse(data);
};

const writeTodos = (todos) => {
  fs.writeFileSync("./data.json", JSON.stringify(todos), "utf-8");
};

app.get("/todos", (req, res) => {
  const todos = readTodos();
  res.send(todos);
});

app.post("/todos", (req, res) => {
  const todos = readTodos();
  const title = req.body.title;
  if (!title) return res.status(400).send({ message: "title is not found" });
  const newTodo = {
    id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
    title: title,
    checked: false,
  };
  todos.push(newTodo);
  writeTodos(todos);
  return res.send(newTodo);
});

app.get("/todos/:id", (req, res) => {
  const todos = readTodos();
  const id = Number(req.params.id);
  const todo = todos.find((item) => item.id === id);
  if (!todo) return res.status(404).send({ message: "Todo not found!" });
  return res.send(todo);
});

app.delete("/todos/:id", (req, res) => {
  let todos = readTodos();
  const id = Number(req.params.id);
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) return res.status(404).send({ message: "Todo not found!" });

  todos.splice(index, 1);
  writeTodos(todos);
  return res.send({ message: `Todo with id ${id} deleted successfully.` });
});

app.put("/todos/:id", (req, res) => {
  let todos = readTodos();
  const id = Number(req.params.id);
  const todo = todos.find((item) => item.id === id);

  if (!todo) return res.status(404).send({ message: "Todo not found!" });

  if (req.body.title) {
    todo.title = req.body.title;
  }
  if (typeof req.body.checked === "boolean") {
    todo.checked = req.body.checked;
  }

  writeTodos(todos);
  return res.send(todo);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
