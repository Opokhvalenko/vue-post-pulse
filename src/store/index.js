import { createStore } from 'vuex';
import { getLocalStorage } from '../utils/getLocalStorage';

const initialUser = getLocalStorage('user');
const initialUserId = initialUser ? initialUser.id : null;

export default createStore({
  state: {
    userId: initialUserId,
    postList: [],
    currentPost: null,
    inSidebar: '',
  },

  mutations: {
    /**
     * @param {object} state
     * @param {number|null} id
     */
    setUserId(state, id) {
      state.userId = id;
    },

    /**
     * @param {object} state
     * @param {Array<object>} posts
     */
    addPostList(state, posts) {
      state.postList = posts;
    },

    /**
     * @param {object} state
     * @param {object} newPost
     */
    addPost(state, newPost) {
      state.postList.unshift(newPost);
    },

    /**
     * @param {object} state
     * @param {object} updatedPost
     */
    updatePost(state, updatedPost) {
      const index = state.postList.findIndex(
        (post) => post.id === updatedPost.id,
      );
      if (index !== -1) {
        state.postList.splice(index, 1, updatedPost);
      }
    },

    /**
     *
     * @param {object} state
     * @param {number} postId
     */
    deletePost(state, postId) {
      state.postList = state.postList.filter((post) => post.id !== postId);
    },

    /**
     * @param {object} state
     * @param {object|null} post
     */
    setCurrentPost(state, post) {
      state.currentPost = post;
    },

    /**
     * @param {object} state
     * @param {string} status
     */
    setInSidebar(state, status) {
      state.inSidebar = status;
    },
  },

  actions: {},

  getters: {},
});
