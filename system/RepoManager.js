/**
 * So this class is in ES6 style. If you search for as ES5 class, look
 * at the categoryRepository.js file. If you search for a more complex
 * ES6 class, look at the articleRepository.js file.
 */
class RepoManager {

    /**
     * Constructor
     *
     * @param ConfigManager configuration
     */
    constructor(configuration) {
        this.configuration = configuration;
        this.repoList = [];
        this.createConnexion();
    };

    /**
     * Get the connexion
     */
    createConnexion() {
        let dDatabaseManager = require('../system/DbManager')
            .DbManager(this.configuration.getDbSettings());
        this.connexion = dDatabaseManager.getConnection();
    };

    /**
     * Retyrn a repo dynamically
     *
     * @param repoName
     * @return {*}
     */
    getRepo(repoName) {
        if (this.repoList[repoName] === null
            || typeof this.repoList[repoName] === 'undefined') {
            repoName = repoName + 'Repository';
            this.repoList[repoName] = require('../model/' + repoName)[repoName](this.connexion);
        }

        return this.repoList[repoName];
    };
}

/**
 * Export with parameter in the constructor.
 *
 * If no parameter needed, you could just use:
 * exports.RepoManager = new RepoManager();
 * and where you call it:
 * require('./config/RepoManager').RepoManager;
 */
exports.RepoManager = function (configuration) {
    // We want a singleton
    if (typeof this.instance === 'undefined') {
        this.instance = new RepoManager(configuration);
    }

    return this.instance;
};
