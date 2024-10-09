require('dotenv').config()
const express = require('express')
const app = express()
const connectDB = require('./database/db')
const router = require('./routes/admin.routes')
const incomerouter = require('./routes/income.routes')
const expenserouter = require('./routes/expense.routes')
const driverrouter = require('./routes/driver.routes')
const accidentrouter = require('./routes/accident.routes')
const port = process.env.PORT

connectDB()

app.use(express.json())
app.use('/api/v1', router)
app.use('/api/v2', incomerouter);
app.use('/api/v3', expenserouter);
app.use('/api/v4', driverrouter)
app.use('/api/v5', accidentrouter)
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})