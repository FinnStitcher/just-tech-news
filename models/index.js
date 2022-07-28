const User = require('./User');
const Post = require('./Post');

// creating associations between models (tables)
// matched pairs are necessary
User.hasMany(Post, {
    foreignKey: 'user_id'
});
Post.belongsTo(User, {
    foreignKey: 'user_id'
});

module.exports = {
    User,
    Post
};