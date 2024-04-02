const express = require('express')
const {route} = require('./routes/route.js')
const PORT = 5051
const app = express()

app.use(express.json())
app.use('/', route)

app.listen(PORT, () => {
  console.log(`Server is working on http://localhost:${PORT}`)
})
