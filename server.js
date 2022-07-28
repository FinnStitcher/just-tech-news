const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(routes);

// .sync connects the models to the database, making tables where necessary
// the force parameter decides whether all the tables should be dropped and recreated if there was a change
// false means it won't do that, to be clear
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('http://localhost:' + PORT));
});