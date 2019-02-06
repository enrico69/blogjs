/**
 *  So this class uses the old ES5 way without prototype.
 *  If you want to see ES6, see the articleRepository.js file.
 *
 *  All the methods are asynchronous and return promises.
 */
var CategoryRepository = (function (dbConnection) {

    var connection = dbConnection;

    /**
     * Return a given category by its slug.
     *
     * @param slug
     */
    this.getCategory = function(slug) {
        return new Promise(function(resolve, reject) {
            var query = "SELECT * FROM category WHERE url = ? LIMIT 1";

            connection.query(query, [slug], function (err, rows, fields) {
                if (rows) {
                    resolve(rows[0]);
                } else {
                    resolve(false);
                }
                if (err) {
                    reject(err);
                }
            });
        });
    };

    /**
     * List the categories
     *
     * @return {Promise}
     */
    this.getCategories = function() {
        return new Promise(function(resolve, reject) {
            var query = "SELECT * FROM category ORDER BY name";

            connection.query(query, [], function (err, rows, fields) {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            });
        });
    };
});

exports.CategoryRepository = function (connexion) {
    return new CategoryRepository(connexion);
};
