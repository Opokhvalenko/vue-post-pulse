import { ref } from 'vue';

export function useFetchData(apiFunction, initialData = null) {
  const data = ref(initialData);
  const isLoading = ref(false);
  const error = ref(null);

  const fetchData = async (...args) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiFunction(...args);
      if (response && response.data !== undefined) {
        data.value = response.data;
      } else if (response) {
        data.value = response;
      } else {
        data.value = initialData;
      }
    } catch (err) {
      console.error('Error in useFetchData:', err);
      error.value = err;
      data.value = initialData;
    } finally {
      isLoading.value = false;
    }
  };

  return { data, isLoading, error, fetchData };
}
