const router = require('express').Router();

router.get('/', (req, res) => {
    // we're using handlebars, so we use .render, not .send, and specify the template
    res.render('homepage');
});

module.exports = router;