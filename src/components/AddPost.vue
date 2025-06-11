<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { createPost, updatePost, getPostById } from '@/api/posts';
import { useFormValidation } from '@/composables/useFormValidation';
import InputField from './InputField.vue';
import TextAreaField from './TextAreaField.vue';
import Message from './Message.vue';

const route = useRoute();
const router = useRouter();
const store = useStore();

const isLoading = ref(false);
const errorMessage = ref('');

const userId = computed(() => store.state.userId);

const {
  fields: postForm,
  errors: postErrors,
  validateForm,
  clearError,
  resetFields,
} = useFormValidation({
  postTitle: '',
  postBody: '',
});

const validators = {
  postTitle: (value) => value.trim() !== '',
  postBody: (value) => value.trim() !== '',
};

const isEditMode = computed(() => !!route.params.id);

const formTitle = computed(() =>
  isEditMode.value ? 'Post editing' : 'Create new post',
);

const loadPostForEditing = async (id) => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const { data } = await getPostById(id);
    postForm.value.postTitle = data.title;
    postForm.value.postBody = data.body;
  } catch (error) {
    console.error('Failed to load post for editing:', error);
    errorMessage.value = 'Failed to load post. Please try again.';
    router.push('/posts');
  } finally {
    isLoading.value = false;
  }
};

const handleSubmit = async () => {
  errorMessage.value = '';

  if (!validateForm(validators)) {
    return;
  }

  isLoading.value = true;
  try {
    const postData = {
      title: postForm.value.postTitle,
      body: postForm.value.postBody,
      userId: userId.value,
    };

    let response;
    if (isEditMode.value) {
      response = await updatePost(route.params.id, postData);
      console.log('Post updated successfully!', response.data);
      store.commit('updatePost', response.data);
    } else {
      response = await createPost(postData);
      console.log('Post created successfully!', response.data);
      store.commit('addPostList', response.data);
    }

    resetFields();
    router.push('/posts');
  } catch (error) {
    console.error('Error processing post:', error);
    errorMessage.value = `Failed to ${isEditMode.value ? 'update' : 'create'} post. Please try again.`;
  } finally {
    isLoading.value = false;
  }
};

const handleCancel = () => {
  router.back();
};

onMounted(() => {
  if (isEditMode.value) {
    if (route.params.id) {
      loadPostForEditing(route.params.id);
    } else {
      console.warn(
        'Edit mode but no post ID found in route params. Redirecting to posts list.',
      );
      router.push('/posts');
    }
  } else {
    resetFields();
    clearError('postTitle');
    clearError('postBody');
    errorMessage.value = '';
  }
});
watch(
  () => route.params.id,
  (newId, oldId) => {
    if (newId && isEditMode.value && newId !== oldId) {
      loadPostForEditing(newId);
    } else if (!newId && !isEditMode.value) {
      resetFields();
      clearError('postTitle');
      clearError('postBody');
      errorMessage.value = '';
    }
  },
);
</script>

<template>
  <div class="content">
    <form @submit.prevent="handleSubmit">
      <h2 class="title is-2">{{ formTitle }}</h2>

      <InputField
        v-model.trim="postForm.postTitle"
        title="Title"
        name="postTitle"
        placeholder="Post title"
        error-text="Title is required"
        :has-error="postErrors.postTitle"
        @remove-err="clearError('postTitle')"
      />

      <TextAreaField
        v-model.trim="postForm.postBody"
        title="Write Post Body"
        name="postBody"
        placeholder="Post body"
        error-text="Body is required"
        :has-error="postErrors.postBody"
        @remove-err="clearError('postBody')"
      />

      <div class="field is-grouped">
        <div class="control">
          <button
            type="submit"
            class="button is-link"
            :class="{ 'is-loading': isLoading }"
            :disabled="isLoading"
          >
            {{ isEditMode ? 'Save Changes' : 'Add Post' }}
          </button>
        </div>
        <div class="control">
          <button
            type="button"
            class="button is-link is-light"
            :disabled="isLoading"
            @click="handleCancel"
          >
            Cancel
          </button>
        </div>
      </div>

      <Message
        v-if="errorMessage"
        type="is-danger"
        icon="fas fa-exclamation-triangle"
      >
        <template #head>
          <p>Error</p>
        </template>
        <p>{{ errorMessage }}</p>
      </Message>
    </form>
  </div>
</template>

<style></style>
