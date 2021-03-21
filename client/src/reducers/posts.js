import {
  CREATE_COMMENT,
  CREATE_POST,
  DISLIKE_POST,
  GET_POST,
  GET_POSTS,
  LIKE_POST,
  POST_ERROR,
  REMOVE_COMMENT,
  REMOVE_POST,
} from "../actions/types";

const initialState = {
  post: null,
  posts: [],
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_POSTS:
      return {
        ...state,
        loading: false,
        posts: payload,
      };
    case GET_POST:
      return {
        ...state,
        loading: false,
        post: payload,
      };
    case CREATE_POST:
      return {
        ...state,
        posts: [payload, ...state.posts],
      };
    case LIKE_POST:
    case DISLIKE_POST:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === payload._id ? payload : post
        ),
        // post: state.post
        //   ? state.post._id === payload.id
        //     ? payload
        //     : state.post
        //   : null,
      };
    case CREATE_COMMENT:
    case REMOVE_COMMENT:
      return {
        ...state,
        post: payload,
      };
    case REMOVE_POST:
      return {
        ...state,
        posts: state.posts.filter((post) => post._id !== payload),
      };

    case POST_ERROR:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
