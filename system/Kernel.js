// Third party libraries
const morgan = require('morgan');
const favicon = require('serve-favicon');
const ejs = require('ejs');
const bodyParser = require('body-parser');

// Framework router
const customRouter = require('../system/Routes');

/**
 * So this class is in ES6 style. If you search for as ES5 class, look
 * at the categoryRepository.js file. If you search for a more complex
 * ES6 class, look at the articleRepository.js file.
 *
 * The goal of this class is to add our custom features to the express.js framework.
 */
class Kernel {

    /**
     * Constructor
     *
     * @param app (express.js app)
     * @param express (express js class)
     */
    constructor(app, express) {
        this.app = app;
        this.express = express;
    };

    /**
     * Start the decoration
     */
    run() {
        this.decorate();
        this.addRouter();
    };

    /**
     * Load all the needed libraries, add the handling of the assets...
     */
    decorate() {
        this.app
            // Assets, logging...
            .set('view engine', 'ejs')
            .use(morgan('combined'))
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({extended: true}))
            .use(this.express.static(__dirname + '/../public'))
            .use(favicon(__dirname + '/../public/img/favicon.ico'))
    };

    /**
     * Redirect all routes to our custom router.
     */
    addRouter() {
        // /!\ : REMEMBER that the order of the routes is important!
        this.app
            .get('*', customRouter)
            .post('*', customRouter)
            .head('*', customRouter)
            .put('*', customRouter)
            .delete('*', customRouter)
            .connect('*', customRouter)
            .options('*', customRouter)
            .trace('*', customRouter)
    };
}

/**
 * Export with parameter in the constructor.
 *
 * If no parameter needed, you could just use:
 * exports.Kernel = new Kernel();
 * and where you call it:
 * require('./config/Kernel').Kernel;
 */
exports.Kernel = function (app, express) {
    // We want a singleton
    if (typeof this.instance === 'undefined') {
        this.instance = new Kernel(app, express);
    }

    return this.instance;
};
