const configManager = require('../system/ConfigManager').ConfigManager();
const renderer = require('../system/Renderer').Renderer(configManager);
const repoManager = require('../system/RepoManager').RepoManager(configManager);

/**
 * Homepage route
 *
 * Using a promise with the old way (usage of then).
 */
exports.index = function(req, res) {
    let articlesHomePromise = getArticlesHome();
    articlesHomePromise.then(function(articles) {
        renderer.renderBasic(req, res, 'home', {
            pageTitle: configManager.getSetting('blogName'),
            pageMeta: configManager.getSetting('blogDescription'),
            articles: articles
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
