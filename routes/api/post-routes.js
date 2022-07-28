const router = require('express').Router();
const { Post, User } = require('../../models');

// get all posts
// as with the matching route in user-routes, we're just sending the data back as json, nice and straightforward
router.get('/', (req, res) => {
    console.log('====================');

    Post.findAll({
        attributes: ['id', 'post_url', 'title', 'created_at'],
        // note that this is an array of arrays
        // we could include multiple columns to order it by, each represented as its own array of two values
        order: [['created_at', 'DESC']],
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    }).then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'post_url', 'title', 'created_at'],
        include: [
            {
                model: User,
                attributes: ['username']
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