import express from 'express';
import 'express-async-errors'
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@monkeydkon-ticketing/common';
import { indexOrderRouter } from './routes/index';
import { deleteOrderRouter } from './routes/delete';
import { showOrderRouter } from './routes/show';
import { newOrderRouter } from './routes/new';

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

app.use(indexOrderRouter)
app.use(deleteOrderRouter)
app.use(showOrderRouter)
app.use(newOrderRouter)


//all = POST, GET, PUT etc...
app.all('*', () => {
    throw new NotFoundError()
})

app.use(errorHandler)

export { app }