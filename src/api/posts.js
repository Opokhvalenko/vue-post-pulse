import { client } from './httpClient';

export const getUserPosts = (userId) => {
  return client.get(`/posts?userId=${userId}`);
};

export const getPosts = () => {
  return client.get('/posts');
};

export const getPostById = (postId) => {
  return client.get(`/posts/${postId}`);
};

export const createPost = ({ body, title, userId }) => {
  return client.post('/posts', { body, title, userId });
};

export const updatePost = (postId, data) => {
  return client.patch(`/posts/${postId}`, data);
};

export const deletePost = (postId) => {
  return client.delete(`/posts/${postId}`);
};
