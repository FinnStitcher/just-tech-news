const router = require('express').Router();
const { User, Post, Vote, Comment } = require('../../models');

// get all users
router.get('/', (req, res) => {
    User.findAll({
        attributes: { exclude: ['password'] }
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});
// LETS GOOOOOO

// get user by id
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        },
        // ohhhh shit is the name of the property there linked to the properties on the class?
        include: [
            {
                // get posts this user made
                // automatically sticks them into a property named 'posts'
                model: Post,
                attributes: ['id', 'title', 'post_url', 'created_at']
            },
            {
                // get posts this user voted on
                // as: 'voted_posts' declares the property name for the returned data
                model: Post,
                attributes: ['title'],
                through: Vote,
                as: 'voted_posts'
            },
            {
                // get this user's comments
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            }
        ]
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user with that ID was found'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// add new user
router.post('/', (req, res) => {
    // keys are the field names defined in the User model (class)
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// login
// it's best to use POST for this because the incoming data is in req.body, not the url
// remember, the password isnt encrypted yet
router.post('/login', (req, res) => {
    // first, we need to confirm that a user with this email exists
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({message: 'No user with that email address'});
            return;
        }
        
        // the dbUserData object has a method that checks if the encrypted and unencrypted passwords match
        // it returns a boolean value
        const validPassword = dbUserData.checkPassword(req.body.password);

        if (!validPassword) {
            res.status(400).json({message: 'Password is incorrect'});
            return;
        }
        
        res.json({ user: dbUserData, message: 'You are now logged in' });
    })
});

// update user
router.put('/:id', (req, res) => {
    User.update(req.body, {
        // necessary to use in conjunction with the beforeUpdate() hook
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData[0]) {
            res.status(404).json({message: 'No user with that ID was found'});
            return;
        };
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// delete user
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({message: 'No user with that ID was found'});
            return;
        };
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;