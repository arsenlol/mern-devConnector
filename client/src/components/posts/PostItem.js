import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { dislikePost, likePost, removePost } from "../../actions/posts";

const PostItem = ({ post, auth, dislikePost, likePost, removePost }) => {

  return (
    <Fragment>
      {post && auth.user && (
        <div className="post bg-white p-1 my-1">
          <div>
            <Link to={`/profile/${post.user}`}>
              <img className="round-img" src={post.avatar} alt="avatar" />
              <h4>{post.name}</h4>
            </Link>
          </div>
          <div>
            <p className="my-1">{post.text}</p>
            <p className="post-date">
              Posted on <Moment format="DD/MM/YYYY">{post.date}</Moment>
            </p>
            <button
              type="button"
              className="btn btn-light"
              disabled={(post.likes.some(like => like.user === auth.user._id)) ? 'disabled' : ''}
              onClick={() => likePost(post._id)}
            >
              <i className="fas fa-thumbs-up"></i>
              <span>{post.likes.length}</span>
            </button>
            <button
              type="button"
              className="btn btn-light"
              disabled={(post.likes.every(like => like.user !== auth.user._id)) ? 'disabled' : ''}
              onClick={() => dislikePost(post._id)}
            >
              <i className="fas fa-thumbs-down"></i>
            </button>
            <Link to={`/post/${post._id}`} className="btn btn-primary">
              Discussion{" "}
              <span className="comment-count">{post.comments.length}</span>
            </Link>
            {auth.user._id === post.user && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removePost(post._id)}
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>
      )}
    </Fragment>
  );
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  likePost: PropTypes.func.isRequired,
  dislikePost: PropTypes.func.isRequired,
  removePost: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { likePost, dislikePost, removePost })(
  PostItem
);
