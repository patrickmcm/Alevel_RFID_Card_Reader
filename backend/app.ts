import express from 'express'
import session from 'express-session'
import { config } from './config';
import MongoStore from 'connect-mongo';



const app = express();


// routes
import {router} from './routes/v1/index'

// middlewares

const sess = {
    secret: "the test",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: config.db.uri,
        dbName: 'main',
        ttl: 259200
    }),
    cookie: {
        secure: false
    }
}

if(app.get('env') == 'prod') {
    sess.cookie.secure = true
}


app.use(express.json());
app.use(session(sess))


app.use('/v1', router);


const port = process.env.PORT || 3000;


app.listen(port, () => {
    console.log(`[+] App listening on port ${port}`);
});