const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

const withAuth = require('../utils/auth');

// you should only be able to access the dashboard if you're logged in, so we can hardcode it as such
// by inserting withAuth into this GET call, we're implementing it as middleware
// any GET request going to this endpoint will pass thru withAuth, like any other middleware!
router.get('/', withAuth, (req, res) => {
    Post.findAll({
        where: {
            user_id: req.session.user_id
        },
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
        // serialize
        const posts = dbPostData.map(post => post.get({ plain: true }));
        res.render('dashboard', {posts, loggedIn: true});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

module.exports = router;