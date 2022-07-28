const {Model, DataTypes} = require('sequelize');
const bcrypt = require('bcrypt');
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
        // using hooks to encrypt passwords
        hooks: {
            // this hook will run before a new instance of User is created (i.e. before a new row is added to the table, i think)
            // async before the function name
            async beforeCreate(newUserData) {
                // function will only progress once bcrypt.hash is done
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            // this one will run before an update reaches the database
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },
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