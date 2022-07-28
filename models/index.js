const User = require('./User');
const Post = require('./Post');
const Vote = require('./Vote');

// creating associations between models (tables)
// matched pairs are necessary

// users and posts
User.hasMany(Post, {
    foreignKey: 'user_id'
});
Post.belongsTo(User, {
    foreignKey: 'user_id'
});

// users and posts thru vote
User.belongsToMany(Post, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'user_id'
});
Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'post_id'
});

// user to votes
Vote.belongsTo(User, {
    foreignKey: 'user_id'
});
User.hasMany(Vote, {
    foreignKey: 'user_id'
});

// post to votes
Vote.belongsTo(Post, {
    foreignKey: 'post_id'
});
Post.hasMany(Vote, {
    foreignKey: 'post_id'
});

module.exports = {
    User,
    Post,
    Vote
};