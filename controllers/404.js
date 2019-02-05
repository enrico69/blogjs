const configManager = require('../system/ConfigManager').ConfigManager();
const repoManager = require('../system/RepoManager').RepoManager(configManager);
const translator = require('../system/Translator').Translator(configManager);
const renderer = require('../system/Renderer').Renderer(configManager, translator);

/**
 * Render 404
 */
exports.index = async function(req, res) {
    renderer.render404(req, res);
};
