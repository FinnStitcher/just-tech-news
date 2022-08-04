const express = require('express');
const session = require('express-session');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const path = require('path');

// setting up handlebars
const exphbs = require('express-handlebars');
const helpers = require('./utils/helpers');
const hbs = exphbs.create({helpers});

// setting up express session
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

// creating session stuff
// not really sure what all these options do
const sess = {
    secret: process.env.SECRET,
    cookie: {},
    resave: false,
    saveUninitialized: true,
    // store session data in the database
    store: new SequelizeStore({
        db: sequelize
    })
};

// session(sess) cannot go before the handlebars methods
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session(sess));

// more handlebars setup
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(routes);

// .sync connects the models to the database, making tables where necessary
// the force parameter decides whether all the tables should be dropped and recreated if there was a change
// false means it won't do that, to be clear
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('http://localhost:' + PORT));
});