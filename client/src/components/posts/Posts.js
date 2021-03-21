import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import TextAreaForm from "./TextAreaForm";
import { connect } from "react-redux";
import {
  createPost,
  dislikePost,
  getPosts,
  likePost,
} from "../../actions/posts";
import PostItem from "./PostItem";
import Spinner from "../layout/Spinner";

const Posts = ({ getPosts, createPost, posts: { posts, loading } }) => {
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <Fragment>
      {loading || !posts.length ? (
        <Spinner />
      ) : (
        <div>
          <h1 className="large text-primary">Posts</h1>
          <p className="lead">
            <i className="fas fa-user"></i> Welcome to the community!
          </p>
          <TextAreaForm
            motivation="Say Something..."
            placeholder="Create a post"
            submitHandler={(value) => createPost(value)}
          />

          <div className="posts">
            {posts.map((post) => (
              <PostItem key={post._id} post={post} />
            ))}
          </div>
        </div>
      )}
    </Fragment>
  );
};

Posts.propTypes = {
  posts: PropTypes.object.isRequired,
  getPosts: PropTypes.func.isRequired,
  createPost: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  posts: state.posts,
});

export default connect(mapStateToProps, { getPosts, createPost })(Posts);
