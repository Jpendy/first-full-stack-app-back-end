const client = require('../lib/client');
// import our seed data:
const dogs = require('./dogs.js');
const usersData = require('./users.js');

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
      dogs.map(dog => {
        return client.query(`
                    INSERT INTO dogs (breed, awesomeness_score, have_owned, owner_id)
                    VALUES ($1, $2, $3, $4);
                `,
        [dog.breed, dog.awesomeness_score, dog.have_owned, user.id]);
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
