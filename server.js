const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const path = require('path');

// setting up handlebars
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

// more handlebars setup
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// .sync connects the models to the database, making tables where necessary
// the force parameter decides whether all the tables should be dropped and recreated if there was a change
// false means it won't do that, to be clear
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('http://localhost:' + PORT));
});