const yaml = require('js-yaml');
const fs = require('fs');

class Translator {
    /**
     * Constructor
     *
     * ConfigurationManager configuration
     */
    constructor(configuration) {
        this.defaultLocale = 'en_US';
        this.translations = [];

        // In any case, load the default translations
        this.loadTranslationsForLocale(this.defaultLocale, true);

        // Load the translations for the locale defined in settings (if defined)
        let definedLocale = configuration.getSetting('locale');
        if (definedLocale && this.loadTranslationsForLocale(definedLocale)) {
            this.currentLocale = definedLocale;
        } else {
            this.currentLocale = this.defaultLocale;
        }
    };

    /**
     * Return the locale being currently used
     * @return {*}
     */
    getLocale() {
        return this.currentLocale;
    };

    /**
     * Ex: en_US, fr_FR
     *
     * @param locale
     */
    setLocale(locale) {
        this.currentLocale = locale ? locale : this.defaultLocale;

        if (!this.areTransactionsLoadedForThisLocale(locale)) {
            this.loadTranslationsForLocale(locale);
        }
    };

    /**
     * Load the translations for a given locale
     *
     * @param locale
     * @param throwExIfFails
     *
     * @return {boolean}
     */
    loadTranslationsForLocale(locale, throwExIfFails) {
        try {
            this.translations[locale] = yaml.safeLoad(
                fs.readFileSync('./i18n/' + locale + '.yaml', 'utf8')
            );

            return true;
        } catch(err) {
            if (throwExIfFails) {
                throw 'Impossible to load the translations for the locale '
                    + locale;
            }

            return false;
        }
    }

    /**
     * Check if the translation of a given locale have been loaded
     *
     * @param locale
     *
     * @return {boolean}
     */
    areTransactionsLoadedForThisLocale(locale) {
        return !(this.translations[this.currentLocale] === null
            || typeof this.translations[this.currentLocale] === 'undefined');

    }

    /**
     * Ex: en_US, fr_FR
     *
     * @param message
     */
    translate(message) {
        if (this.areTransactionsLoadedForThisLocale(this.currentLocale)) {
            let translation = this.translations[this.currentLocale][message];
            if (translation) {
                return translation;
            }
        }

        let translation = this.translations[this.defaultLocale][message];
        if (!translation) {
            return message;
        }

        return translation;
    };
}

/**
 * Export with parameter in the constructor.
 *
 * If no parameter needed, you could just use:
 * exports.Translator = new Translator();
 * and where you call it:
 * require('./config/Translator').Translator;
 */
exports.Translator = function (configuration) {
    // We want a singleton
    if (typeof this.instance === 'undefined') {
        this.instance = new Translator(configuration);
    }

    return this.instance;
};
