import { ref } from 'vue';

export function useFormValidation(initialFields) {
  const fields = ref({ ...initialFields });
  const errors = ref({});

  const validateField = (fieldName, validator) => {
    errors.value[fieldName] = !validator(fields.value[fieldName]);
    return !errors.value[fieldName];
  };

  const validateForm = (validators) => {
    let isValid = true;
    for (const fieldName in validators) {
      if (Object.prototype.hasOwnProperty.call(validators, fieldName)) {
        const validator = validators[fieldName];

        if (!validateField(fieldName, validator)) {
          isValid = false;
        }
      }
    }
    return isValid;
  };

  const clearError = (fieldName) => {
    if (errors.value[fieldName]) {
      errors.value[fieldName] = false;
    }
  };

  const resetFields = () => {
    for (const key in initialFields) {
      if (Object.prototype.hasOwnProperty.call(initialFields, key)) {
        fields.value[key] = initialFields[key];
        errors.value[key] = false;
      }
    }
  };

  return {
    fields,
    errors,
    validateField,
    validateForm,
    clearError,
    resetFields,
  };
}
