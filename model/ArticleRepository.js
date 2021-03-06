const EventEmitter = require('events').EventEmitter;

/**
 * So this class is in ES6 style. If you search for as ES5 class, look
 * at the categoryRepository.js file.
 *
 * It inherits the EventEmitter. A proper way - but longer - could have
 * been to use it as a DI.
 */
class ArticleRepository extends EventEmitter {

    /**
     * Constructor
     * @param connection
     */
    constructor(connection) {
        super();
        this.connection = connection;
    }

    /**
     * Extract the articles for the homepage
     */
    getArticlesHome() {
        let sqlQuery = 'SELECT article.title, article.description, article.date, ' +
            'article.categ, article.url, category.url AS categ_url FROM ' +
            'article, category WHERE article.categ = category.id AND top_article = 1 ' +
            'AND online = 1 ORDER BY date DESC LIMIT 10';

        let that = this;

        this.connection.query(sqlQuery, [], function (err, rows, fields) {
            that.handleReadResult(err, rows, fields);
        });
    };

    /**
     * Extract an article for a given slug
     */
    getArticleBySlug(articleSlug) {
        let sqlQuery = 'SELECT article.*, category.url AS categ_url, category.name as categ_name FROM ' +
            'article, category WHERE article.url = ? AND article.categ = category.id' +
            ' AND online = 1 LIMIT 1';

        let that = this;

        this.connection.query(sqlQuery, [articleSlug], function (err, rows, fields) {
            if (rows && rows.length === 1) {
                rows = rows[0];
            }
            that.handleReadResult(err, rows, fields);
        });
    };

    /**
     * Trigger event for the result of the operation use the event observer pattern
     * @param err
     * @param rows
     * @param fields
     */
    handleReadResult(err, rows, fields) {
        if (err) {
            this.emit('error', err);
        }
        this.emit('success', rows);
    };

    /**
     * Return the list of the articles for a given category. Uses a promise,
     * not the event pattern.
     *
     * @param categId
     */
    getArticleByCateg(categId) {
        let that = this;

        return new Promise(function(resolve, reject) {
            let query = "SELECT * FROM article WHERE categ = ? AND online = 1";

            that.connection.query(query, [categId], function (err, rows, fields) {
                if (rows) {
                    resolve(rows);
                } else {
                    resolve(false);
                }
                if (err) {
                    throw err;
                }
            });
        });
    };

    /**
     * Search for an article. Uses a promise, not the event pattern.
     *
     * @param queryString
     * @return {Promise}
     */
    search(queryString) {
        let that = this;
        queryString = '%' + queryString + '%';

        return new Promise(function(resolve, reject) {
            let sqlQuery = 'SELECT article.title, article.description, article.date, ' +
                'article.categ, article.url, category.url AS categ_url FROM ' +
                "article, category WHERE (article.title LIKE ? OR article.content LIKE ?) " +
                'AND article.categ = category.id ' +
                'AND article.online = 1 ORDER BY article.date DESC';

            that.connection.query(sqlQuery, [queryString, queryString], function (err, rows, fields) {
                if (rows) {
                    resolve(rows);
                } else {
                    resolve(false);
                }
                if (err) {
                    throw err;
                }
            });
        });
    };
}

/**
 * Export with parameter in the constructor.
 *
 * If no parameter needed, you could just use:
 * exports.ArticlesRepository = new ArticlesRepository();
 * and where you call it:
 * require('./model/articles').ArticlesRepository;
 */
exports.ArticleRepository = function (connexion) {
    return new ArticleRepository(connexion);
};