const client = require('../lib/client');
// import our seed data:
const dogs = require('./dogs.js');
const usersData = require('./users.js');
const neuroticism = require('./neuroticism.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );
      
    const user = users[0].rows[0];

    await Promise.all(
      neuroticism.map(item => {
        return client.query(`
                    INSERT INTO neuroticism (neuroticism_level)
                    VALUES ($1);
                `,
        [item.neuroticism_level]);
      })
    );

    await Promise.all(
      dogs.map(dog => {
        return client.query(`
                    INSERT INTO dogs (breed, awesomeness_score, have_owned, neuroticism_level, owner_id)
                    VALUES ($1, $2, $3, $4, $5);
                `,
        [dog.breed, dog.awesomeness_score, dog.have_owned, dog.neuroticism_level, user.id]);
      })
    );

    
    

    console.log('seed data load complete');
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
