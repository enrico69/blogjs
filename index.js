/**
 * @author Eric COURTIAL <e.courtial30@gmail.com>
 */

// Third party libraries
const express = require('express');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');

// Custom libraries and config
const customRouter = require('./system/Routes');

// Routing
app
// Assets, logging...
    .set('view engine', 'ejs')
    .use(morgan('combined'))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({extended: true}))
    .use(express.static(__dirname + '/public'))
    .use(favicon(__dirname + '/public/img/favicon.ico'))

    // /!\ : REMEMBER that the order of the routes is important!
    .get('*', customRouter)
    .post('*', customRouter)
    .head('*', customRouter)
    .put('*', customRouter)
    .delete('*', customRouter)
    .connect('*', customRouter)
    .options('*', customRouter)
    .trace('*', customRouter)
;
app.listen(8080);
