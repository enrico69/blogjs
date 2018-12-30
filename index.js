/**
 * NOTE: By convention, every custom methods are prefixed
 * by the letter "d" (the name of the project).
 *
 * @author Eric COURTIAL <e.courtial30@gmail.com>
 */


/**
 * Main script
 */

// Third party libraries
const express = require('express');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

// Custom libraries
const configManager = require('./system/ConfigManager').ConfigManager();
const repoManager = require('./system/RepoManager').RepoManager(configManager);

// Routing
app
    // Assets, logging...
    .set('view engine', 'ejs')
    .use(morgan('combined'))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(express.static(__dirname + '/public'))
    .use(favicon(__dirname + '/public/img/favicon.ico'))

    /**
     * Homepage route
     *
     * Using a promise with the old way (usage of then).
     */
    .get('/', function (req, res, next) {
        let articlesHomePromise = getArticlesHome();
        articlesHomePromise.then(function(articles) {
            dRenderBasic(req, res, 'home', {
                pageTitle: configManager.getSetting('blogName'),
                pageMeta: configManager.getSetting('blogDescription'),
                articles: articles
            });
        }, function(error) {
            dRenderError(res, error);
        });
    })

    /**
     * Render the article.
     *
     * Using a promise with the old way (usage of then). Callback hell... as
     * two callbacks are chained (remember: it is a educational project showing
     * various techniques).
     */
    .get('/:category/:article/', function (req, res, next) {
        let articlesHomePromise = getArticlesHome();
        articlesHomePromise.then(function(articlesHome) {
            let articlePromise = getArticleBySlug(req.params.article, req.params.category);
            articlePromise.then(function(article) {
                dRenderBasic(req, res, 'article', {
                    pageTitle: article.TITLE,
                    pageMeta: article.DESCRIPTION,
                    article: article,
                    articlesHome: articlesHome,
                    disqusId: configManager.getSetting('disqusId')
                });
            }, function(error) {
                if (error === '404') {
                    dRender404(req, res);
                } else {
                    dRenderError(res, error);
                }
            });
        }, function(error) {
            dRenderError(res, error);
        });
    })

    /**
     * Render the list of categories, using Async/Await with promise.
     *
     * Return a given category by it slug.
     * It uses the 2017 async/await mechanism, with is a more simpler way to
     * use promises. The code look synchronous (no more usage of then).
     */
    .get('/categories/', async function (req, res, next) {
        let categoriesRepository = repoManager.getRepo('Category');
        let categories = await categoriesRepository.getCategories();
        dRenderBasic(req, res, 'categories', {
            pageTitle: 'Liste des catégories',
            pageMeta: 'Index des catégories',
            categories: categories
        });
    })


    /**
     * Search function
     */
    .post('/recherche/', async function (req, res, next) {
        let articleRepository = repoManager.getRepo('Article');
        let articles = await articleRepository.search(req.body.chaine);
        dRenderBasic(req, res, 'search', {
            pageTitle: 'Résultats de la recherche',
            pageMeta: 'Résultats de la recherche',
            articles: articles,
            noIndex: true
        });
    })

    /*
     * Contact form
     */
    .get('/contact/', async function (req, res, next) {
        dRenderBasic(req, res, 'contact', {
            pageTitle: 'Formulaire de contact',
            pageMeta: 'Formulaire de contact',
            antiSpamQuestion: configManager.getSetting('antispamQuestion'),
            antiSpamResponse: configManager.getSetting('antispamResponse'),
            noIndex: true
        });
    })

    /*
     * Contact form submission
     */
    .post('/contact/', async function (req, res, next) {
        let antiSpam = req.body.verif;
        if (antiSpam !== configManager.getSetting('antispamResponse')) {
            console.log("Wrong antispam. Submitted value was: " + antiSpam);
            dRender404(req, res);
        }

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            type: "SMTP",
            host: "smtp.gmail.com",
            secure: true,
            auth: {
                user: configManager.getSetting('userSenderEmail'),
                pass: configManager.getSetting('userSenderEmailPassword')
            }
        });

        let mailOptions = {
            from: configManager.getSetting('userSenderEmail'),
            to: configManager.getSetting('userReceiverEmail'),
            subject: 'Message from ' + configManager.getSetting('blogName'),
            text: req.body.email + ' (' + req.body.name + ') vous dit : ' + req.body.message
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                dRender404(req, res);
            } else {
                res.sendStatus(200);
                res.end();
            }
        });
    })

    /**
     * Render a category, using Async/Await with promise.
     *
     * Here again uses the 2017 async/await mechanism (see also above for more explanation).
     */
    .get('/:category/', async function (req, res, next) {
        let categoriesRepository = repoManager.getRepo('Category');
        let articleRepository = repoManager.getRepo('Article');
        let category = await categoriesRepository.getCategory(req.params.category);
        if (category) {
            let articles = await articleRepository.getArticleByCateg(category.ID);
            dRenderBasic(req, res, 'category', {
                pageTitle: category.NAME,
                pageMeta: category.DESCRIPTION,
                category: category,
                articles: articles
            });
        } else {
            dRender404(req, res);
        }
    })

    // Everything else: 404
    .use(function (req, res, next) {
        dRender404(req, res);
    })
;
app.listen(8080);







/** Functions used by the application */

/**
 * This function handle the common feature for rendering.
 *
 * @param req
 * @param res
 * @param templateName
 * @param templateData
 */
dRenderBasic = function (req, res, templateName, templateData) {
    // Blog slogan
    templateData['slogan'] = configManager.getSetting('blogSlogan');

    // Profiles (Github, Linkedin...)
    templateData['linkedin'] = configManager.getSetting('linkedinProfileUrl');
    templateData['github'] = configManager.getSetting('githubAccountUrl');

    // Blog title
    templateData['blogTitle'] = configManager.getSetting('blogName');

    // Set the current year for the footer
    let dt = new Date();
    templateData['todayYear'] = dt.getFullYear();

    // Moment to format date
    templateData['moment'] = require('moment');

    // General data
    templateData['baseUrl'] = configManager.getBaseUrl(req);

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
dRenderError = function (res, error) {
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
dRender404 = function (req, res) {
    res.status(404);
    dRenderBasic(req, res, '404', {
        pageTitle: 'Not found.',
        pageMeta: '404 not found.',
        noIndex: true
    });
};

/**
 * Return an promise to extract the article on the homepage.
 *
 * For the fun, the promise also uses the observer pattern. We could have
 * just used a promise, like in the article repository.
 *
 * We use "Event Emitter".
 * See ./Model/articles
 * So the promise awaits for an event, and the calling method in the router
 * await for a promise (success or error).
 *
 * @return {Promise}
 */
getArticlesHome = function() {
    let articleRepository = repoManager.getRepo('Article');
    articleRepository.getArticlesHome();

    return new Promise(function(resolve, reject) {
        articleRepository.on('error', function (error) {
            reject(error);
        });
        articleRepository.on('success', function (articles) {
            resolve(articles);
        });
    });
};

/**
 * Return a promise to extract an article
 *
 * Same procedure as the getArticlesHome() method.
 *
 * @param slug
 * @param categorySlug
 *
 * @return {Promise}
 */
getArticleBySlug = function(slug, categorySlug) {
    let articleRepository = repoManager.getRepo('Article');
    articleRepository.getArticleBySlug(slug);

    return new Promise(function(resolve, reject) {
        articleRepository.on('error', function (error) {
            reject(error);
        });
        articleRepository.on('success', function (article) {
            if (article.CATEGURL !== categorySlug) {
                reject('404');
            } else {
                resolve(article);
            }
        });
    });
};
