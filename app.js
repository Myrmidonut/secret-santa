const express = require('express')
const path    = require("path")

const app = express()
const port = 3000

app.use(express.static(path.join(__dirname, "dist/secret-santa")))

// const apiRoutes = require('./api-routes.js');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "dist/secret-santa/index.html"))
})

app.listen(port, () => console.log(`Server running on port ${port}!`))