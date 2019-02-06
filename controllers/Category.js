const configManager = require('../system/ConfigManager').ConfigManager();
const repoManager = require('../system/RepoManager').RepoManager(configManager);
const translator = require('../system/Translator').Translator(configManager);
const renderer = require('../system/Renderer').Renderer(configManager, translator);

/**
 * Render the list of categories, using Async/Await with promise.
 *
 * Return a given category by it slug.
 * It uses the 2017 async/await mechanism, with is a more simpler way to
 * use promises. The code look synchronous (no more usage of then).
 */
exports.index = async function(req, res) {
    let categoriesRepository = repoManager.getRepo('Category');
    let categories = await categoriesRepository.getCategories();
    renderer.renderBasic(req, res, 'categories', {
        pageTitle: translator.translate('List of the categories'),
        pageMeta: translator.translate('List of the categories'),
        categories: categories
    });
};

/**
 * Render a category, using Async/Await with promise.
 *
 * Here again uses the 2017 async/await mechanism (see also above for more explanation).
 */
exports.viewCategory = async function(req, res) {
    let categoriesRepository = repoManager.getRepo('Category');
    let articleRepository = repoManager.getRepo('Article');
    let category = await categoriesRepository.getCategory(req.params.category);
    if (category) {
        let articles = await articleRepository.getArticleByCateg(category.id);
        renderer.renderBasic(req, res, 'category', {
            pageTitle: category.name,
            pageMeta: category.description,
            category: category,
            articles: articles
        });
    } else {
        renderer.render404(req, res);
    }
};
