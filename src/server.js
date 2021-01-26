const app = require('./app')
const { PORT, CONNECTION_STRING } = require('./config')
const knex = require('knex')

const db = knex({
  client:'pg',
  connection: CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false
  }
});

app.set('db', db)

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})