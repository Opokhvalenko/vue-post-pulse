<script setup>
import Loader from './Loader.vue';

const props = defineProps({
  size: {
    type: String,
    default: 'medium',
  },
  centered: {
    type: Boolean,
    default: true,
  },
});
</script>

<template>
  <div
    :class="[
      'mt-2',
      {
        'is-flex is-justify-content-center is-align-items-center':
          !props.centered,
      },
    ]"
  >
    <Loader :size="props.size" :centered="props.centered" class="mt-2" />
  </div>
</template>

<style scoped></style>
