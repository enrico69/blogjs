/**
 * @author Eric COURTIAL <e.courtial30@gmail.com>
 */

// Load express.js
const express = require('express');
const app = express();

// Load the framework kernel to decorate the app
const kernel = require('./system/Kernel').Kernel(app, express);
kernel.run();

app.listen(8080);
