<script setup>
import { /*, computed */ ref } from 'vue';
import { createComment } from '@/api/comments';
import InputField from './InputField.vue';
import TextAreaField from './TextAreaField.vue';
import Message from './Message.vue';

const props = defineProps({
  postId: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['cancel', 'updateCommentsList']);

const newAuthorName = ref('');
const newAuthorEmail = ref('');
const newCommentText = ref('');
const hasErrorText = ref(false);
const hasErrorName = ref(false);
const hasErrorEmail = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

const validateForm = () => {
  hasErrorName.value = !newAuthorName.value.trim();
  hasErrorEmail.value = !newAuthorEmail.value.trim();
  hasErrorText.value = !newCommentText.value.trim();

  return !(hasErrorName.value || hasErrorEmail.value || hasErrorText.value);
};

const createNewComment = async () => {
  errorMessage.value = '';
  if (!validateForm()) {
    return;
  }

  const newData = {
    body: newCommentText.value,
    email: newAuthorEmail.value,
    name: newAuthorName.value,
    postId: props.postId,
  };

  isLoading.value = true;
  try {
    const { data } = await createComment(newData);
    newCommentText.value = '';
    newAuthorName.value = '';
    newAuthorEmail.value = '';
    emit('updateCommentsList', data);
  } catch (error) {
    console.error('Error creating comment:', error);
    errorMessage.value = 'Failed to add comment. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

const cancel = () => {
  emit('cancel');
};
</script>

<template>
  <form @submit.prevent="createNewComment">
    <InputField
      v-model.trim="newAuthorName"
      title="Author Name"
      name="authorName"
      placeholder="Name Surname"
      error-text="Name is required"
      :has-error="hasErrorName"
      @remove-err="hasErrorName = false"
    />

    <InputField
      v-model.trim="newAuthorEmail"
      title="Author Email"
      name="authorEmail"
      placeholder="Your Email"
      error-text="Email is required"
      :has-error="hasErrorEmail"
      @remove-err="hasErrorEmail = false"
    />

    <TextAreaField
      v-model.trim="newCommentText"
      title="Write Comment Body"
      name="commentText"
      placeholder="Comment"
      error-text="Body is required"
      :has-error="hasErrorText"
      @remove-err="hasErrorText = false"
    />

    <Message v-if="errorMessage" :type="'is-danger'">
      {{ errorMessage }}
    </Message>

    <div class="field is-grouped">
      <div class="control">
        <button
          type="submit"
          class="button is-link"
          :class="{ 'is-loading': isLoading }"
        >
          Save
        </button>
      </div>
      <div class="control">
        <button
          type="reset"
          class="button is-link is-light"
          :disabled="isLoading"
          @click="cancel"
        >
          Cancel
        </button>
      </div>
    </div>
  </form>
</template>
