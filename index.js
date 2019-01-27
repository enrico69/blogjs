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
const configManager = require('./system/ConfigManager').ConfigManager();
const translator = require('./system/Translator').Translator(configManager);
const customRouter = require('./system/Routes');
const renderer = require('./system/Renderer').Renderer(configManager, translator);

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
    // Home
    .get('/', customRouter)
    // View an article
    .get('/:category/:article/', customRouter)
    // See categories
    .get('/categories/', customRouter)
    // Contact page: display
    .get('/contact/', customRouter)
    // View a category
    .get('/:category/', customRouter)
    // Contact page: submit
    .post('/contact/', customRouter)
    // Search function
    .post('/search/', customRouter)

    // Everything else: 404
    .use(function (req, res, next) {
        renderer.render404(req, res);
    })
;
app.listen(8080);
