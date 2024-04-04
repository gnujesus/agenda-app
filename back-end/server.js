import express from "express";
import cors from "cors";
import mysql from "mysql";

const app = express()
app.use(cors())
app.use(express.json())

const database = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: null,
  database: 'agenda_app'
})

app.get("/", (req, res) => {
  const query = "SELECT * FROM Entry;"
  database.query(query, (err, result) => {
    if (err) {
      return res.json(err)
    }
    return res.json(result)
  })
})

app.post("/", (req, res) => {
  const { title, description, date, startingTime, endingTime } = req.body;
  const query = 'INSERT INTO Entry (Name, Description, Date, StartingTime, EndingTime) VALUES (?, ?, ?, ?, ?)';

  database.query(query, [title, description, date, startingTime, endingTime], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'An error occurred while adding the entry.' });
    }
    res.json({ message: 'Entry added successfully', insertId: result.insertId });
  });
})

app.put("/", (req, res) => {
  const { title, description, date, startingTime, endingTime } = req.body

  const query = `
  UPDATE Entry 
  SET Name = ?, Description= ?, Date = ?, StartingTime = ?, EndingTime = ?
  WHERE EndingTime = ?
`;
  database.query(query, [title, description, date, startingTime, endingTime, endingTime], (err, result) => {
    if (err) {
      return res.json(err)
    }
    return res.json(result)
  })
})

app.delete("/", (req, res) => {
  const id = req.body.id;
  if (!id) {
    return res.status(400).json({ message: 'Missing required ID parameter' });
  }
  const query = `DELETE FROM Entry WHERE Id = ?`;


  database.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'An error occurred while deleting.' });
    }
    res.json({ message: 'Delete successful' });
  });

})

app.listen(8081, () => {
  console.log("Listening from 8081...")
})


