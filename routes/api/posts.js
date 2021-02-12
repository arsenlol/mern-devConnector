const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

const Post = require("../../models/Post");
const User = require("../../models/User");
const Like = require("../../models/Like");
const Comment = require("../../models/Comment");

// @route       POST api/posts
// @desc        Create posts
// @access      Private
router.post(
  "/",
  [auth, [check("text", "Text is required").notEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save();

      return res.json(post);
    } catch (err) {
      console.error(err);
      return res.status(500).send("Server error");
    }
  }
);

// @route       GET api/posts
// @desc        Get all posts
// @access      Private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    return res.json(posts);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});

// @route       GET api/posts/:id
// @desc        Get post by ID
// @access      Private
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    return res.json(post);
  } catch (err) {
    console.error(err);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    return res.status(500).send("Server error");
  }
});

// @route       DELETE api/posts/:id
// @desc        Delete post by ID
// @access      Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    await post.remove();

    return res.json({ msg: "Post deleted" });
  } catch (err) {
    console.error(err);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    return res.status(500).send("Server error");
  }
});

// @route       POST api/posts/like/:id
// @desc        Like a post
// @access      Private
router.post("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("likes");

    // Check if post has already been liked
    if (post.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: "Post already liked" });
    }

    const user = await User.findById(req.user.id);

    const like = new Like({
      user: req.user.id,
      post: post.id,
    });

    await like.save();
    post.likes.unshift(like);
    user.likes.unshift(like);

    await post.save();
    await user.save();
    return res.json(post);
  } catch (err) {
    console.error(err);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    return res.status(500).send("Server error");
  }
});

// @route       DELETE api/posts/like/:id
// @desc        Dislike a post
// @access      Private
router.delete("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("likes");

    // Check if post has already been liked
    const likeInPost = post.likes.find(
      (like) => like.user.toString() === req.user.id
    );
    if (!likeInPost) {
      return res.status(400).json({ msg: "You have not not liked this post" });
    }
    const removeFromPostIndex = post.likes.indexOf(likeInPost);
    post.likes.splice(removeFromPostIndex, 1);

    const user = await User.findById(req.user.id).populate("likes");
    const removeFromUserIndex = user.likes.findIndex(
      (like) => like.post.toString() === post.id
    );
    user.likes.splice(removeFromUserIndex, 1);

    const like = Like.findById(likeInPost.id);
    await like.remove();
    await post.save();
    await user.save();
    return res.json(post);
  } catch (err) {
    console.error(err);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    return res.status(500).send("Server error");
  }
});

// @route       POST api/posts/comment/:id
// @desc        Comment on a post
// @access      Private
router.post(
  "/comment/:id",
  [auth, [check("text", "Comment must contain text").not().isEmpty()]],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const post = await Post.findById(req.params.id);
      const user = await User.findById(req.user.id);

      const comment = new Comment({
        text: req.body.text,
        avatar: user.avatar,
        name: user.name,
        post: post.id,
        user: req.user.id,
      });

      user.comments.unshift(comment);
      post.comments.unshift(comment);
      await comment.save();
      await user.save();
      await post.save();
      return res.json(comment);
    } catch (err) {
      console.error(err);
      if (err.kind === "ObjectId") {
        return res.status(404).json({ msg: "Post not found" });
      }
      return res.status(500).send("Server error");
    }
  }
);

// @route       DELETE api/posts/comment/:id
// @desc        Delete a comment
// @access      Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("comments");

    // Check if post has already been liked
    const commentInPost = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    if (!commentInPost) {
      return res.status(400).json({ msg: "Comment does not exist" });
    }
    // Check user
    if (commentInPost.user.toString() !== req.user.id) {
      return res.status(400).json({ msg: "User not authorized" });
    }
    const removeFromPostIndex = post.comments.indexOf(commentInPost);
    post.comments.splice(removeFromPostIndex, 1);

    const user = await User.findById(req.user.id).populate("comments");
    const removeFromUserIndex = user.comments.findIndex(
      (comment) => comment.post.toString() === post.id
    );
    user.comments.splice(removeFromUserIndex, 1);

    await Comment.deleteOne({ _id: req.params.comment_id });
    await post.save();
    await user.save();
    return res.json(post);
  } catch (err) {
    console.error(err);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    return res.status(500).send("Server error");
  }
});

module.exports = router;
