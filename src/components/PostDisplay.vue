<script setup>
const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['editPost', 'deletePost']);

const handleEditClick = () => {
  emit('editPost', props.post);
};

const handleDeleteClick = () => {
  emit('deletePost', props.post.id);
};
</script>

<template>
  <div class="box">
    <h3 class="title is-3">{{ props.post.title }}</h3>
    <p>{{ props.post.body }}</p>
    <div class="buttons mt-4">
      <button class="button is-link" @click="handleEditClick">Edit</button>
      <button class="button is-danger is-light" @click="handleDeleteClick">
        Delete
      </button>
    </div>
  </div>
</template>

<style scoped></style>
