require('dotenv').config();
const express = require('express');
require('express-async-errors')


const app = express()
const helmet = require('helmet')
const cors = require('xss-clean')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler')
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')
const connectDB = require('./db/connect')
const authenticateUser  = require('./middleware/authentication')

app.set('trust proxy', 1)

app.use(express.json())

//security middleware
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
})
)
app.use(helmet())
app.use(cors())
app.use(xss())







// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser , jobsRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`app is running on port ${port}`)
        })
    } catch(error) {
        console.log(error)
    }
}

start()




