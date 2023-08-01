"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const app = express();
// routes
const index_1 = require("./routes/v1/index");
// middlewares
app.use(express.json());
app.use('/v1', index_1.router);
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
