<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

import { getPostById, deletePost } from '@/api/posts';
import { getPostComments, deleteComment } from '@/api/comments';

import Comment from './Comment.vue';
import NoCommentsYet from './NoCommentsYet.vue';
import Loader from './Loader.vue';
import Message from './Message.vue';
import WriteCommentBtn from './WriteCommentBtn.vue';
import AddComment from './AddComment.vue';

import { useFetchData } from '@/composables/useFetchData';

const route = useRoute();
const router = useRouter();
const store = useStore();

const postId = ref(route.params.id);

const {
  data: post,
  isLoading: isLoadingPost,
  error: postFetchError,
  fetchData: fetchPostData,
} = useFetchData(() => getPostById(postId.value));

const {
  data: commentsList,
  isLoading: isLoadingComments,
  error: commentsFetchError,
  fetchData: fetchCommentsData,
} = useFetchData(() => getPostComments(postId.value), []);

const isWritingComment = ref(false);
const addCommentErrorMessage = ref('');
const deletePostErrorMessage = ref('');

const showWriteComment = () => {
  isWritingComment.value = true;
};

const cancelWritingComment = () => {
  isWritingComment.value = false;
  addCommentErrorMessage.value = '';
};

const addNewComment = async () => {
  addCommentErrorMessage.value = '';
  isWritingComment.value = false;
  await fetchCommentsData();
};

const removeComment = async (commentId) => {
  addCommentErrorMessage.value = '';
  try {
    const { data } = await deleteComment(commentId);
    if (data === 1) {
      const index = commentsList.value.findIndex(
        (comment) => comment.id === commentId,
      );
      if (index !== -1) {
        commentsList.value.splice(index, 1);
      }
      console.log('Comment deleted successfully!');
    } else {
      console.warn(
        'Comment deletion might not be fully successful. API response:',
        data,
      );
      addCommentErrorMessage.value = 'Comment deletion failed on server.';
    }
  } catch (error) {
    console.error('Error deleting comment:', error);
    addCommentErrorMessage.value = "Couldn't delete the comment.";
  }
};

const editPost = () => {
  console.log('Attempting to edit post with ID:', postId.value);
  router.push({ name: 'UpdatingPost', params: { id: postId.value } });
};

const handleDeletePost = async () => {
  deletePostErrorMessage.value = '';
  if (
    !confirm(
      'Are you sure you want to delete this post? This action cannot be undone.',
    )
  ) {
    return;
  }

  try {
    const response = await deletePost(postId.value);
    console.log('Delete API response:', response.data);

    if (response.status === 200 || response.data === 1) {
      console.log(`Post with ID ${postId.value} deleted successfully.`);
      store.commit('deletePost', postId.value);
      router.push('/posts');
    } else {
      deletePostErrorMessage.value =
        'Failed to delete post. Unexpected API response.';
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    if (error.response && error.response.status === 403) {
      deletePostErrorMessage.value =
        'You are not authorized to delete this post.';
    } else if (error.response && error.response.status === 404) {
      deletePostErrorMessage.value = 'Post not found.';
    } else {
      deletePostErrorMessage.value = 'Failed to delete post. Please try again.';
    }
  }
};
watch(
  () => route.params.id,
  (newId, oldId) => {
    if (newId && newId !== oldId) {
      postId.value = newId;
      isWritingComment.value = false;
      addCommentErrorMessage.value = '';
      deletePostErrorMessage.value = '';

      fetchPostData();
      fetchCommentsData();
    } else if (!newId) {
      post.value = null;
      commentsList.value = [];
      isWritingComment.value = false;
      addCommentErrorMessage.value = '';
    }
  },
  { immediate: true },
);

onMounted(() => {});
</script>

<template>
  <Loader v-if="isLoadingPost" size="large" centered />

  <div v-else-if="post && !postFetchError" class="content">
    <h3 class="title is-4">{{ post.title }}</h3>
    <p>{{ post.body }}</p>
    <div class="buttons">
      <button class="button is-link" @click="editPost">Edit Post</button>
      <button class="button is-danger" @click="handleDeletePost">
        Delete Post
      </button>
    </div>

    <hr />
    <h4 class="title is-5">Comments</h4>

    <Loader v-if="isLoadingComments" centered />

    <template v-else-if="!commentsFetchError">
      <template v-if="!isWritingComment">
        <template v-if="commentsList.length !== 0">
          <Comment
            v-for="comment of commentsList"
            :key="comment.id"
            :comment="comment"
            @delete-comment="removeComment"
          />
        </template>
        <NoCommentsYet v-else />
        <WriteCommentBtn @click="showWriteComment" />
      </template>

      <AddComment
        v-else
        :post-id="post.id"
        @cancel="cancelWritingComment"
        @update-comments-list="addNewComment"
      />
    </template>

    <Message
      v-if="postFetchError || commentsFetchError || addCommentErrorMessage"
      type="is-danger"
      icon="fas fa-exclamation-triangle"
    >
      <template #head>
        <p>Error</p>
      </template>
      <p>
        {{
          postFetchError?.message ||
          commentsFetchError?.message ||
          addCommentErrorMessage ||
          deletePostErrorMessage
        }}
      </p>
    </Message>
  </div>
  <div v-else class="content">
    <p class="title is-4">Select a post from the list.</p>
    <Message
      v-if="postFetchError"
      type="is-danger"
      icon="fas fa-exclamation-triangle"
    >
      <template #head>
        <p>Error</p>
      </template>
      <p>Failed to load post details: {{ postFetchError.message }}</p>
    </Message>
  </div>
</template>

<style></style>
