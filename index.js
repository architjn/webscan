const express = require('express');
const app = express();


app.use('/api/url', require('./api/url'));

app.listen(3000, () => console.log('Server started on port 3000'));