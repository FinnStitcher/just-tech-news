const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

router.get('/', (req, res) => {
    // getting post data
    Post.findAll({
        attributes: [
            'id', 'post_url', 'title', 'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        // using the .get method with the argument plain: true so it ONLY returns the data, not the extra stuff that comes with a sequelize response
        // this is called serializing
        // we didnt have to do this in the past because res.json() did it automatically
        const posts = dbPostData.map(post => post.get({ plain: true }));
        // we're using handlebars, so we use .render, not .send, and specify the template
        // res.render can take an object as a second argument, which describes all the data we want to send to the page we're loading
        // what page we're loading at the given endpoint is determined by the first argument
        res.render('homepage', { posts });
        // putting the array into an object so we can more easily add things to this template later on
    })
    .catch(err => {
        res.status(500).json(err);
    })
});

router.get('/login', (req, res) => {
    res.render('login');
})

module.exports = router;