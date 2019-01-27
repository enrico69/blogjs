const configManager = require('../system/ConfigManager').ConfigManager();
const repoManager = require('../system/RepoManager').RepoManager(configManager);
const translator = require('../system/Translator').Translator(configManager);
const renderer = require('../system/Renderer').Renderer(configManager, translator);

/**
 * Render search results
 *
 * Here again uses the 2017 async/await mechanism (see Category:index for more explanation).
 */
exports.index = async function(req, res) {
    let articleRepository = repoManager.getRepo('Article');
    let articles = await articleRepository.search(req.body.chaine);
    renderer.renderBasic(req, res, 'search', {
        pageTitle: translator.translate('Search results'),
        pageMeta: translator.translate('Search results'),
        articles: articles,
        noIndex: true
    });
};
