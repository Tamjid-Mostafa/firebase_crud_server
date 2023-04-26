const admin = require("firebase-admin");
const FieldValue = admin.firestore.FieldValue;

const serviceAccount = require("./crud.json");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

app.get("/todo", async (req, res) => {
  try {
    const todosRef = db.collection("todos");
    const snapshot = await todosRef.get();
    const todos = [];
    snapshot.forEach((doc) => {
      todos.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    res.status(201).send(todos);
  } catch (error) {
    console.log("Error getting todos:", error);
    throw error;
  }
});

app.post("/todo", async (req, res) => {
  const { title, detail } = req.body;
  try {
    const newTodo = {
      title,
      detail,
      createdAt: FieldValue.serverTimestamp(),
    };
    const docRef = await db.collection("todos").add(newTodo);
    res.status(201).send(`Todo added with ID: ${docRef.id}`);
    console.log(docRef.id);
  } catch (error) {
    console.error("Error adding new user:", error);
    res.status(500).send("Error adding new user");
  }
});

app.put("/todo/:id", async (req, res) => {
  const id = req.params.id;
  const { title, detail } = req.body;
  try {
    const docRef = await db.collection("todos").doc(id).update({
      title,
      detail,
      updatedAt: FieldValue.serverTimestamp(),
    });
    res.status(201).send(`Todo added with ID: ${docRef}`);
    console.log(docRef)
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Error updating user");
  }
});

app.delete("/todo/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await db.collection("todos").doc(id).delete();
    res.status(200).send(`Todo deleted with ID: ${id}`);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Error deleting user");
  }
});

app.get("/", async (req, res) => {
  res.send("CRUD server is running");
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
});
