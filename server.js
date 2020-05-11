require('dotenv').config();

const client = require('./lib/client');

// Initiate database connection
client.connect();

const app = require('./lib/app');

const PORT = process.env.PORT || 7890;

//get all dogs for full list of dogs page
app.get('/dogs', async(req, res) => {
  const data = await client.query('SELECT * from dogs'); 

  res.json(data.rows);
});

//get one dog for details page
app.get('/dogs/:id', async(req, res) => {
  const id = req.params.id;
  const data = await client.query('SELECT * from dogs WHERE id = $1',
    [id]
  ); 

  res.json(data.rows);
});


//create new dog entry

app.post('/dogs/', async(req, res) => {

  const data = await client.query(
    `INSERT INTO dogs (breed, awesomeness_score, have_owned, owner_id )
     values ($1, $2, $3, $4)
     returning *; `,
    [req.body.breed, req.body.awesomeness_score, req.body.have_owned, 1]
  );

  res.json(data.rows[0]);

});


app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Started on ${PORT}`);
});

module.exports = app;
