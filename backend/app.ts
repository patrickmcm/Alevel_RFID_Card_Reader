const express = require('express');

const app = express();

// routes
import {router} from './routes/v1/index'

// middlewares
app.use(express.json());


app.use('/v1', router);


const port = process.env.PORT || 3000;


app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});