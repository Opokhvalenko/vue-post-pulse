<script setup>
const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  errorText: {
    type: String,
    default: '',
  },
  hasError: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },

  modelValue: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue', 'remove-err']);

const handleInput = (event) => {
  emit('update:modelValue', event.target.value);
  emit('remove-err');
};
</script>

<template>
  <div class="field" data-cy="BodyField">
    <label class="label textarea-field__label" :for="`comment-${props.name}`">
      {{ props.title }}
    </label>
    <div class="control">
      <textarea
        :id="`comment-${props.name}`"
        :name="props.name"
        :placeholder="props.placeholder"
        :value="props.modelValue"
        :class="{ 'is-danger': props.hasError }"
        class="textarea"
        autocomplete="off"
        @input="handleInput"
      ></textarea>
    </div>

    <p v-if="props.hasError" class="help is-danger" data-cy="ErrorMessage">
      {{ props.errorText }}
    </p>
  </div>
</template>

<style>
.textarea-field__label {
  text-transform: capitalize;
}
</style>
