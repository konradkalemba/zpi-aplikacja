import { config as loadDotEnvVariables } from 'dotenv'

// Load enviroment variables from `.env` file
loadDotEnvVariables()

import 'reflect-metadata'
import http from 'http'
import express from 'express'
import parser from 'body-parser'
import { connect as databaseConnect } from './database'
import routes from './routes'

const router = express()
const { PORT = 3000 } = process.env
const server = http.createServer(router)

router.use(parser.urlencoded({ extended: true }))
router.use(parser.json())
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Register defined routes
for (const { path, method, handle } of routes) {
    (router as any)[method](path, handle)
}

databaseConnect().then(async connection => {
    server.listen(PORT, () =>
        console.log(`Server is running http://localhost:${PORT}...`)
    )
}).catch(error => console.log(error))