<script setup>
const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['deleteComment']);

const deleteThisComment = () => {
  emit('deleteComment', props.comment.id);
};
</script>

<template>
  <article class="message is-small">
    <div class="message-header">
      <template v-if="props.comment.email">
        <a :href="`mailto:${props.comment.email}`">{{ props.comment.name }}</a>
      </template>
      <template v-else>
        <span>{{ props.comment.name }}</span>
      </template>

      <button
        type="button"
        class="delete is-small"
        aria-label="delete"
        title="Delete comment"
        @click="deleteThisComment"
      ></button>
    </div>
    <div class="message-body">{{ props.comment.body }}</div>
  </article>
</template>

<style></style>
