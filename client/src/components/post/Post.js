import React, { useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import TextAreaForm from "../posts/TextAreaForm";
import { createComment, getPostById } from "../../actions/posts";
import { Link } from "react-router-dom";
import Comment from "./Comment";

const Post = ({ post, createComment, getPostById, match }) => {
  useEffect(() => {
    getPostById(match.params.id);
  }, [getPostById]);
  return (
    <Fragment>
      {post && (
        <div>
          <Link to="/posts" className="btn">
            Back To Posts
          </Link>
          <div className="post bg-white p-1 my-1">
            <div>
              <Link to={`/profile/${post.user}`}>
                <img className="round-img" src={post.avatar} alt="" />
                <h4>{post.name}</h4>
              </Link>
            </div>
            <div>
              <p className="my-1">{post.text}</p>
            </div>
          </div>

          <TextAreaForm
            motivation="Leave A Comment"
            placeholder="Comment on this post"
            submitHandler={(text) => createComment(post._id, text)}
          />

          <div className="comments">
            {post.comments.map((comment) => (
              <Comment key={comment._id} comment={comment} />
            ))}
          </div>
        </div>
      )}
    </Fragment>
  );
};

Post.propTypes = {
  // post: PropTypes.object.isRequired,
  createComment: PropTypes.func.isRequired,
  getPostById: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.posts.post,
});

export default connect(mapStateToProps, { createComment, getPostById })(Post);
