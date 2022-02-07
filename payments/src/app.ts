import express from 'express';
import 'express-async-errors'
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@monkeydkon-ticketing/common';
import { createChargeRouter } from './routes/new';


const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test' // if in test env false, else true (jest automatically sets NODE_ENV)
    })
)

app.use(currentUser)

app.use(createChargeRouter)

//all = POST, GET, PUT etc...
app.all('*', () => {
    throw new NotFoundError()
})

app.use(errorHandler)

export { app }