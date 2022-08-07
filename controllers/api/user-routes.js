const router = require('express').Router();
const { User, Post, Vote, Comment } = require('../../models');

const withAuth = require('../../utils/auth');

// no idea how the session thing gets in here but if it works it works
// i guess express-session is automatically attaching the .session property to the request when it goes through to here?
// middleware...

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
router.post('/', withAuth, (req, res) => {
    // keys are the field names defined in the User model (class)
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => {
        // when a new user is added, log them in automatically
        // req.session.save() initializes a new session
        req.session.save(() => {
            console.log(req.session);

            // storing data about the user
            // we're declaring new properties, not reassigning old ones, i think
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json(dbUserData);
        });
    })
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
        
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json({ user: dbUserData, message: 'You are now logged in'});
        })
    })
});

router.post('/logout', withAuth, (req, res) => {
    // if this request came from a logged-in user, destroy the session
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            // 200s mean something went right
            res.status(204).end();
        });
    } else {
        // otherwise, you shouldn't be seeing this page, so go away
        res.status(404).end();
    }
})

// update user
router.put('/:id', withAuth, (req, res) => {
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
router.delete('/:id', withAuth, (req, res) => {
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