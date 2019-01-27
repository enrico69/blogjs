const configManager = require('../system/ConfigManager').ConfigManager();
const renderer = require('../system/Renderer').Renderer(configManager);
const repoManager = require('../system/RepoManager').RepoManager(configManager);

/**
 * Render search results
 *
 * Here again uses the 2017 async/await mechanism (see Category:index for more explanation).
 */
exports.index = async function(req, res) {
    let articleRepository = repoManager.getRepo('Article');
    let articles = await articleRepository.search(req.body.chaine);
    renderer.renderBasic(req, res, 'search', {
        pageTitle: 'Résultats de la recherche',
        pageMeta: 'Résultats de la recherche',
        articles: articles,
        noIndex: true
    });
};
