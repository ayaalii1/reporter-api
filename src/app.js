const express = require('express')
const app = express()
const port = process.env.PORT || 3000

require('./db/mongoose')

app.use(express.json())

const reporterRouter = require("./routers/reporter")
app.use(reporterRouter)

const newsRouter = require('./routers/news')
app.use(newsRouter)


app.listen(port,()=>{console.log('Server is running on port'+ "-->"+port)})


