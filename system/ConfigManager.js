const yaml = require('js-yaml');
const fs = require('fs');

/**
 * So this class is in ES6 style. If you search for as ES5 class, look
 * at the categoryRepository.js file. If you search for a more complex
 * ES6 class, look at the articleRepository.js file.
 */
class ConfigManager {

    /**
     * Constructor
     */
    constructor() {
        this.settings = yaml.safeLoad(
            fs.readFileSync('./config/preferences.yaml', 'utf8')
        );
    };

    /**
     * HTTPS or not?
     */
    isSecure() {
        return this.settings.general.isSecure;
    };

    /**
     * get db params
     */
    getDbSettings() {
        return this.settings.db;
    };

    /**
     * Return URL prefix according to HTTPS or not
     *
     * @return {string}
     */
    getUrlPrefix() {
        if (this.isSecure === true) {
            return 'https://';
        }

        return 'http://';
    };

    /**
     * Return the base URL of the site
     *
     * @param req is the request object
     */
    getBaseUrl(req) {
        return this.getUrlPrefix() + req.headers.host + '/';
    };

    /**
     * Return the request param dynamically
     */
    getSetting(key) {
        return this.settings.general[key];
    }

    /**
     * Return the locale applied to the blog (use for translation for instance)
     *
     * @return {string|false}
     */
    getLanguage() {
        let language = this.settings.general.locale;
        if (typeof language !== 'string'
            || language.trim().length === 0)  {
            language = false;
        }

        return language
    }
}

/**
 * Export with parameter in the constructor.
 *
 * If no parameter needed, you could just use:
 * exports.ConfigManager = new ConfigManager();
 * and where you call it:
 * require('./config/ConfigManager').ConfigManager;
 */
exports.ConfigManager = function () {
    // We want a singleton to avoid to read the config many times...
    if (typeof this.instance === 'undefined') {
        this.instance = new ConfigManager();
    }

    return this.instance;
};
