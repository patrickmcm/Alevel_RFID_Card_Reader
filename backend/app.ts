import express from 'express'
import session from 'express-session'
import { config } from './config';
import MongoStore from 'connect-mongo';



const app = express();


// routes
import { apiRouterv1 } from './routes/v1/index'
import { dashRouter } from './routes/dashboard';

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

app.set('view engine', 'ejs')
app.set('views', __dirname+'\\public')


app.use('/v1', apiRouterv1);
app.use('/',dashRouter)
app.use(express.static('public',{etag:false}))


const port = process.env.PORT || 3000;


app.listen(port, () => {
    console.log(`[+] App listening on port ${port}`);
});