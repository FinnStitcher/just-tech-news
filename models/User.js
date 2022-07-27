const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

class User extends Model {};

// defining table
User.init(
    {
        // definitions
        // sequelize can automatically generate ids, but it's best to be explicit
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            // unsure how this one works under the hood
            // i guess it doesnt matter though
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // must be at least 4 charaters
                len: [4]
            }
        }
    },
    {
        // config
        // passing in the connection to the database, stored in this variable
        sequelize,
        // no automatic timestamps
        timestamps: false,
        // don't pluralize table name
        freezeTableName: true,
        // use underscores instead of camel-case
        underscored: true,
        // make sure model name is lowercase in the database
        modelName: 'user'
    }
);

module.exports = User;