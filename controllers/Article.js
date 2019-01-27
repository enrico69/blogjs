const configManager = require('../system/ConfigManager').ConfigManager();
const translator = require('../system/Translator').Translator(configManager);
const renderer = require('../system/Renderer').Renderer(configManager, translator);
const repoManager = require('../system/RepoManager').RepoManager(configManager);

/**
 * Render the article.
 *
 * Using a promise with the old way (usage of then). Callback hell... as
 * two callbacks are chained (remember: it is a educational project showing
 * various techniques).
 */
exports.viewArticle = function (req, res) {
    let articlesHomePromise = getArticlesHome();
    articlesHomePromise.then(function(articlesHome) {
        let articlePromise = getArticleBySlug(req.params.article, req.params.category);
        articlePromise.then(function(article) {
            renderer.renderBasic(req, res, 'article', {
                pageTitle: article.TITLE,
                pageMeta: article.DESCRIPTION,
                article: article,
                articlesHome: articlesHome,
                disqusId: configManager.getSetting('disqusId')
            });
        }, function(error) {
            if (error === '404') {
                renderer.render404(req, res);
            } else {
                renderer.renderError(res, error);
            }
        });
    }, function(error) {
        renderer.renderError(res, error);
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
