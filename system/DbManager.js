/**
 * So this class is in ES6 style. If you search for as ES5 class, look
 * at the categoryRepository.js file. If you search for a more complex
 * ES6 class, look at the articleRepository.js file.
 */
class DbManager {

    /**
     * Constructor
     * @param configuration
     */
    constructor(configuration) {
        this.configuration = configuration;

        this.connection = null;
    };

    /**
     * Get the MySQL connexion.
     */
    getConnection() {
        if (this.connection === null) {
            this.createConnection();
        }

        return this.connection;
    };

    /**
     * Create the connexion.
     */
    createConnection() {
        const mysql = require('mysql');
        this.connection = mysql.createConnection({
            host     : this.configuration.host,
            user     : this.configuration.user,
            password : this.configuration.password,
            database : this.configuration.database,
            charset  : this.configuration.charset
        });

        this.connection.connect();
    };
}

/**
 * Export with parameter in the constructor.
 *
 * If no parameter needed, you could just use:
 * exports.DbManager = new DbManager();
 * and where you call it:
 * require('./config/DbManager').DbManager;
 */
exports.DbManager = function (configuration) {
    return new DbManager(configuration);
};
