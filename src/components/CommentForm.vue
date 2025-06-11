<script setup>
import { useFormValidation } from '@/composables/useFormValidation';

const emit = defineEmits(['submit', 'cancel']);

const {
  fields: commentForm,
  errors: commentErrors,
  validateForm,
  clearError,
  resetFields,
} = useFormValidation({
  authorName: '',
  authorEmail: '',
  commentBody: '',
});

const validators = {
  authorName: (value) => value.trim() !== '',
  authorEmail: (value) => value.trim() !== '',
  commentBody: (value) => value.trim() !== '',
};

const handleSubmit = () => {
  if (validateForm(validators)) {
    const formData = {
      name: commentForm.value.authorName,
      email: commentForm.value.authorEmail,
      body: commentForm.value.commentBody,
    };
    emit('submit', formData);
    resetFields();
  }
};

const handleCancel = () => {
  emit('cancel');
};
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="field">
      <label class="label">Author Name</label>
      <div class="control">
        <input
          v-model.trim="commentForm.authorName"
          class="input"
          :class="{ 'is-danger': commentErrors.authorName }"
          type="text"
          placeholder="Your Name"
          @input="clearError('authorName')"
        />
      </div>
      <p v-if="commentErrors.authorName" class="help is-danger">
        Name is required
      </p>
    </div>

    <div class="field">
      <label class="label">Author Email</label>
      <div class="control">
        <input
          v-model.trim="commentForm.authorEmail"
          class="input"
          :class="{ 'is-danger': commentErrors.authorEmail }"
          type="email"
          placeholder="Your Email"
          @input="clearError('authorEmail')"
        />
      </div>
      <p v-if="commentErrors.authorEmail" class="help is-danger">
        Email is required
      </p>
    </div>

    <div class="field">
      <label class="label">Comment Body</label>
      <div class="control">
        <textarea
          v-model.trim="commentForm.commentBody"
          class="textarea"
          :class="{ 'is-danger': commentErrors.commentBody }"
          placeholder="Your Comment"
          @input="clearError('commentBody')"
        ></textarea>
      </div>
      <p v-if="commentErrors.commentBody" class="help is-danger">
        Comment body is required
      </p>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button type="submit" class="button is-link">Submit</button>
      </div>
      <div class="control">
        <button
          type="button"
          class="button is-link is-light"
          @click="handleCancel"
        >
          Cancel
        </button>
      </div>
    </div>
  </form>
</template>
