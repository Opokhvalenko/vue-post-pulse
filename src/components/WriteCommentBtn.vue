<script setup>
const emit = defineEmits(['click']);

const handleClick = () => {
  emit('click');
};
</script>

<template>
  <button
    type="button"
    class="button is-link"
    aria-label="Write a comment"
    @click="handleClick"
  >
    <slot>Write a comment</slot>
  </button>
</template>

<style scoped></style>
