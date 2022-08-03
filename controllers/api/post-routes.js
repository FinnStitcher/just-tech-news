const router = require('express').Router();
const { Post, User, Vote, Comment } = require('../../models');
const sequelize = require('../../config/connection');

// /api/posts

// get all posts
// as with the matching route in user-routes, we're just sending the data back as json, nice and straightforward
router.get('/', (req, res) => {
    Post.findAll({
        attributes: ['id', 'post_url', 'title', 'created_at', [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']],
        // note that this is an array of arrays
        // we could include multiple columns to order it by, each represented as its own array of two values
        order: [['created_at', 'DESC']],
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {
                model: Comment,
                attributes: [[sequelize.literal('(SELECT COUNT(*) FROM comment WHERE post.id = comment.post_id)'), 'comment_count']]
            }
        ]
    }).then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// get by id
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'post_url', 'title', 'created_at', [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']],
        include: [
            {
                model: User,
                attributes: ['username']
            },
            // holy shit, you can nest include statements
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            }
        ]
    })
    .then(dbPostData => {
        // if nothing came back, through a 404 error
        if (!dbPostData) {
            res.status(404).json({message: 'No post with this ID was found'});
            return;
        };
        res.json(dbPostData);
    })
    // this .catch will get server errors
    // a request that goes through but finds nothing is not recognized by a catch statement
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

// make post
router.post('/', (req, res) => {
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.body.user_id
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// add vote to post
// needs to go before 'update post info' so express doesn't think 'upvote' is an id
router.put('/upvote', (req, res) => {
    // only logged-in users should be able to vote
    // so we check if there's a session active
    if (req.session) {
        // req.body will contain the post id
        // we get the user id from the session data
        Post.upvote(
            { ...req.body, user_id: req.session.user_id },
            { Vote, User }
        )
        .then(updatedPostData => res.json(updatedPostData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });        
    }
});

// update post info
router.put('/:id', (req, res) => {
    // two objects: one that contains the stuff we're sending in, and one that contains the options and such
    Post.update(
        {
            title: req.body.title
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({message: 'No post with that ID was found'});
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

// delete post
router.delete('/:id', (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({message: 'No post with this ID was found'});
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

module.exports = router;