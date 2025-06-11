<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'is-info',
  },
  icon: {
    type: String,
    default: '',
  },
  autoClose: {
    type: Number,
    default: 0,
  },
});

const isVisible = ref(true);

const close = () => {
  isVisible.value = false;
};

onMounted(() => {
  if (props.autoClose > 0) {
    setTimeout(() => {
      isVisible.value = false;
    }, props.autoClose);
  }
});
</script>

<template>
  <article v-if="isVisible" class="message" :class="props.type">
    <div class="message-header">
      <span v-if="props.icon">
        <i :class="props.icon" style="margin-right: 8px"></i>
      </span>

      <slot name="head">Message</slot>

      <button class="delete" aria-label="delete" @click="close"></button>
    </div>

    <div class="message-body">
      <slot></slot>
    </div>
  </article>
</template>

<style scoped></style>
