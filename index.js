const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { PythonShell } = require('python-shell');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DBNAME;

app.use(cors());
app.use(bodyParser.json());

app.post('/run-script', (req, res) => {
  const { script } = req.body;

  PythonShell.runString(script, null, (err, results) => {
    if (err) {
      return res.status(500).json({ output: err.message });
    }
    res.json({ output: results.join('\n') });
  });
});

MongoClient.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    const db = client.db(dbName);
    console.log(`Connected to database: ${dbName}`);
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(error => console.error(error));
