<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

import { getUserPosts } from '@/api/posts';
import PostLoader from './PostLoader.vue';
import Message from './Message.vue';
const store = useStore();
const router = useRouter();
const isLoaded = ref(false);
const errorMessage = ref('');
const postList = computed(() => store.state.postList);
const userId = computed(() => store.state.userId);
const currentPost = computed(() => store.state.currentPost);

const loadPosts = async () => {
  isLoaded.value = true;
  errorMessage.value = '';

  if (!userId.value) {
    errorMessage.value = 'User ID is not set. Please login.';
    isLoaded.value = false;
    return;
  }

  try {
    const { data } = await getUserPosts(userId.value);
    store.commit('addPostList', data);
  } catch (error) {
    console.error('Failed to load posts:', error);
    errorMessage.value = 'Failed to load posts';
  } finally {
    isLoaded.value = false;
  }
};

const openPost = (post) => {
  store.commit('setCurrentPost', post);
  router.push(`/posts/${post.id}`);
};

const closePost = () => {
  store.commit('setCurrentPost', null);
  router.push('/posts');
};

const createNewPost = () => {
  router.push('/posts/create');
};

watch(
  userId,
  (newUserId) => {
    if (newUserId) {
      loadPosts();
    } else {
      store.commit('addPostList', []);
      errorMessage.value = '';
    }
  },
  { immediate: true },
);

onMounted(() => {});
</script>

<template>
  <div class="tile is-parent">
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <p class="title">Posts</p>
          <button
            type="button"
            class="button is-link"
            :disabled="isLoaded || !userId"
            @click="createNewPost"
          >
            Add New Post
          </button>
        </div>

        <PostLoader v-if="isLoaded" />

        <template v-else-if="errorMessage === ''">
          <p v-if="postList.length === 0 && !isLoaded">No posts yet.</p>
          <table
            v-else
            class="table is-fullwidth is-striped is-hoverable is-narrow"
          >
            <thead>
              <tr class="has-background-link-light">
                <th>ID</th>
                <th>Title</th>
                <th class="has-text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="post of postList" :key="post.id">
                <td>{{ post.id }}</td>
                <td>{{ post.title }}</td>
                <td class="has-text-right is-vcentered">
                  <button
                    v-if="currentPost?.id !== post.id"
                    type="button"
                    class="button is-link"
                    @click="openPost(post)"
                  >
                    Open
                  </button>
                  <button
                    v-else
                    type="button"
                    class="button is-link is-light"
                    @click="closePost"
                  >
                    Close
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </template>

        <Message
          v-if="errorMessage !== ''"
          type="is-danger"
          icon="fas fa-exclamation-triangle"
        >
          <template #head>
            <p>Error</p>
          </template>
          <p>{{ errorMessage }}</p>
        </Message>
      </div>
    </div>
  </div>
</template>

<style></style>
