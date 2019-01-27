const configManager = require('../system/ConfigManager').ConfigManager();
const translator = require('../system/Translator').Translator(configManager);
const renderer = require('../system/Renderer').Renderer(configManager, translator);
const nodemailer = require('nodemailer');

/**
 * Render the contact page
 *
 * Here again uses the 2017 async/await mechanism (see Category:index for more explanation).
 */
exports.index = async function(req, res) {
    renderer.renderBasic(req, res, 'contact', {
        pageTitle: translator.translate('Contact form'),
        pageMeta: translator.translate('Contact form'),
        antiSpamQuestion: configManager.getSetting('antispamQuestion'),
        antiSpamResponse: configManager.getSetting('antispamResponse'),
        noIndex: true
    });
};

/**
 * Render the contact page
 *
 * Support only Google (currently)
 *
 * Here again uses the 2017 async/await mechanism (see Category:index for more explanation).
 */
exports.submit = async function(req, res) {
    let antiSpam = req.body.verif;
    if (antiSpam !== configManager.getSetting('antispamResponse')) {
        console.log("Wrong antispam. Submitted value was: " + antiSpam);
        renderer.render404(req, res);
    }

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        type: "SMTP",
        host: "smtp.gmail.com",
        secure: true,
        auth: {
            user: configManager.getSetting('userSenderEmail'),
            pass: configManager.getSetting('userSenderEmailPassword')
        }
    });

    let mailOptions = {
        from: configManager.getSetting('userSenderEmail'),
        to: configManager.getSetting('userReceiverEmail'),
        subject: 'Message from ' + configManager.getSetting('blogName'),
        text: req.body.email + ' (' + req.body.name + ') says : ' + req.body.message
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            renderer.render404(req, res);
        } else {
            res.sendStatus(200);
            res.end();
        }
    });
};
