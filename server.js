require('dotenv').config();

const client = require('./lib/client');

// Initiate database connection
client.connect();

const app = require('./lib/app');

const PORT = process.env.PORT || 7890;

//get all dogs for full list of dogs page
app.get('/dogs', async(req, res) => {
  const data = await client.query(
    `SELECT dogs.id, dogs.breed, dogs.awesomeness_score, dogs.have_owned, neuroticism.neuroticism_level
  FROM dogs
  JOIN neuroticism
  ON neuroticism.id = dogs.neuroticism_level`); 

  res.json(data.rows);
});

//get one dog for details page
app.get('/dogs/:id', async(req, res) => {
  const id = req.params.id;
  const data = await client.query(
    `SELECT dogs.id, dogs.breed, dogs.awesomeness_score, dogs.have_owned, neuroticism.neuroticism_level
    FROM dogs
    JOIN neuroticism
    ON neuroticism.id = dogs.neuroticism_level
    WHERE dogs.id = $1`,
    [id]
  ); 

  res.json(data.rows);
});


//create new dog entry

app.post('/dogs/', async(req, res) => {

  const data = await client.query(
    `INSERT INTO dogs (breed, awesomeness_score, have_owned, neuroticism_level, owner_id )
     values ($1, $2, $3, $4, $5)
     returning *; `,
    [req.body.breed, req.body.awesomeness_score, req.body.have_owned, req.body.neuroticism_level, 1]
  );

  res.json(data.rows[0]);
});

app.delete('/dogs/:id', async(req, res) => {

  const id = req.params.id;
  console.log(id);
  try {
    const data = await client.query(`
  DELETE FROM dogs
  WHERE id = $1
  RETURNING *;
`, [id]);

    res.json(data.rows[0]); 
  }
  catch(e) {
    console.error(e);
    res.json(e);
  }
  
});


app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Started on ${PORT}`);
});

module.exports = app;
