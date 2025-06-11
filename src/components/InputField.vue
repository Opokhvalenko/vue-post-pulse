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
  modelValue: {
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
});

const emit = defineEmits(['update:modelValue', 'remove-err']);

const handleInput = (event) => {
  emit('update:modelValue', event.target.value);
  emit('remove-err');
};
</script>

<template>
  <div class="field" :data-cy="`${props.name}Field`">
    <label class="label input-field__label" :for="`input-field-${props.name}`">
      {{ props.title }}
    </label>
    <div class="control has-icons-left has-icons-right">
      <input
        :id="`input-field-${props.name}`"
        type="text"
        class="input"
        :class="{ 'is-danger': props.hasError }"
        :value="props.modelValue"
        :name="props.name"
        :placeholder="props.placeholder"
        @input="handleInput"
      />
      <span class="icon is-small is-left">
        <i
          class="fas"
          :class="{
            'fa-user': !props.name.toLowerCase().includes('email'),
            'fa-envelope': props.name.toLowerCase().includes('email'),
          }"
        ></i>
      </span>

      <span
        v-if="props.hasError"
        class="icon is-small is-right has-text-danger"
        data-cy="ErrorIcon"
      >
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>

    <p v-if="props.hasError" class="help is-danger" data-cy="ErrorMessage">
      {{ props.errorText }}
    </p>
  </div>
</template>

<style>
.input-field__label {
  text-transform: capitalize;
}
</style>
