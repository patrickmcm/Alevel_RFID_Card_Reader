import express from 'express'
import session from 'express-session'
import { config } from './config';
import MongoStore from 'connect-mongo';
import { Server } from 'ws';




const app = express();
const wsServer = new Server({ noServer: true })


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

if (app.get('env') == 'prod') {
    sess.cookie.secure = true
}


app.use(express.json());
app.use(session(sess))

app.set('view engine', 'ejs')
app.set('views', __dirname + '\\public')


app.use('/v1', apiRouterv1);
app.use('/', dashRouter)
app.use(express.static('public', { etag: false }))



const port = process.env.PORT || 3000;


const expressServer = app.listen(port, () => {
    console.log(`[+] App listening on port ${port}`);
});

expressServer.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
        if(!request.url) return
        /*

        AUTH HANDHSHAKE FOR WEBSOCKET:
        1. On client hash a nonce + timestamp + uid, include the hash + nonce + timestamp + uid in params? (or headers idk)
        2. we verify the hash by looking up your uid in the db to obtain the psk then do the hashing
        3. once identify is good we then attach uid as param for all the ws events, before the events we mark as online in db
        4. events now have confidence in identity so just mark as offline when 'close' is emitted.
        5. i dont think ws can be comproised so not sure if we have to hash for subsequent messages
        */
        let urlInfo = new URL(request.url, `http://${request.headers.host}`);
        switch(urlInfo.pathname) {
            case "/v1/devices/heartbeat":
                wsServer.emit('heartbeat', socket, request);
        }
    });
});

export { expressServer, wsServer }