/**
 * So this class is in ES6 style. If you search for as ES5 class, look
 * at the categoryRepository.js file. If you search for a more complex
 * ES6 class, look at the articleRepository.js file.
 */
class Renderer {

    /**
     * Constructor
     *
     * @param configManager
     * @param translator
     */
    constructor(configManager, translator) {
        this.configManager = configManager;
        this.translator = translator;
    };

    /**
     * This function handle the common feature for rendering.
     *
     * @param req
     * @param res
     * @param templateName
     * @param templateData
     */
    renderBasic (req, res, templateName, templateData) {
        // Blog slogan
        templateData['slogan'] = this.configManager.getSetting('blogSlogan');

        // Profiles (Github, Linkedin...)
        templateData['linkedin'] = this.configManager.getSetting('linkedinProfileUrl');
        templateData['github'] = this.configManager.getSetting('githubAccountUrl');

        // Blog title
        templateData['blogTitle'] = this.configManager.getSetting('blogName');

        // Set the current year for the footer
        let dt = new Date();
        templateData['todayYear'] = dt.getFullYear();

        // Moment to format date
        templateData['moment'] = require('moment');

        // General data
        templateData['baseUrl'] = this.configManager.getBaseUrl(req);

        // Add the translator component
        templateData['translator'] = this.translator;

        /**
         * Rendering... with a callback, again. Told you callback could lead to hell?
         */
        res.render('layout.ejs', {templateName: templateName, templateData: templateData});

        /**
         * Could also be done this way:
         */
        // ejs.renderFile('./views/layout.ejs', {templateName: templateName, templateData: templateData}, function (err, str) {
        //     if (err) {
        //         throw err;
        //     }
        //     res.end(str);
        // });
    };

    /**
     * Render error 500
     *
     * @param res
     * @param error
     */
    renderError (res, error) {
        res.status(500);
        console.log(error);
        res.end();
    };

    /**
     * Render 404
     *
     * @param req
     * @param res
     */
    render404 (req, res) {
        res.status(404);
        this.renderBasic(req, res, '404', {
            pageTitle: 'Not found.',
            pageMeta: '404 not found.',
            noIndex: true
        });
    };

}

/**
 * Export with parameter in the constructor.
 *
 * If no parameter needed, you could just use:
 * exports.Renderer = new Renderer();
 * and where you call it:
 * require('./config/Renderer').Renderer;
 */
exports.Renderer = function (configuration, translator) {
    // We want a singleton
    if (typeof this.instance === 'undefined') {
        this.instance = new Renderer(configuration, translator);
    }

    return this.instance;
};
