require('dotenv').config();

const client = require('./lib/client');

// Initiate database connection
client.connect();

const app = require('./lib/app');

const PORT = process.env.PORT || 7890;

app.get('/dogs', async(req, res) => {
  const data = await client.query('SELECT * from dogs'); 

  res.json(data.rows);
});

app.get('/dogs/:id', async(req, res) => {
  const id = req.params.id;
  const data = await client.query('SELECT * from dogs WHERE id = $1',
    [id]
  ); 

  res.json(data.rows);
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Started on ${PORT}`);
});

module.exports = app;
