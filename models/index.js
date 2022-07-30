const User = require("./User");
const Post = require("./Post");
const Vote = require("./Vote");
const Comment = require("./Comment");

// creating associations between models (tables)
// matched pairs are necessary


// relationships of User
User.hasMany(Post, {
	foreignKey: "user_id",
});

User.belongsToMany(Post, {
	through: Vote,
	as: "voted_posts",
	foreignKey: "user_id",
});

User.hasMany(Vote, {
	foreignKey: "user_id",
});

User.hasMany(Comment, {
	foreignKey: "user_id",
});


// relationships of Post
Post.belongsTo(User, {
	foreignKey: "user_id",
});

Post.belongsToMany(User, {
	through: Vote,
	as: "voted_posts",
	foreignKey: "post_id",
});

Post.hasMany(Vote, {
	foreignKey: "post_id",
});

Post.hasMany(Comment, {
	foreignKey: "post_id",
});


// relationships of Comment
Comment.belongsTo(User, {
	foreignKey: `user_id`,
});

Comment.belongsTo(Post, {
	foreignKey: "post_id",
});


// relationships of Vote
Vote.belongsTo(User, {
	foreignKey: "user_id",
});

Vote.belongsTo(Post, {
	foreignKey: "post_id",
});

module.exports = {
	User,
	Post,
	Vote,
	Comment,
};
