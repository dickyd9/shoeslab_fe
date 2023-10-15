import { ref } from "vue"

// Fungsi global untuk mereset form
export function useResetForm(initialData: any) {
  const formData = ref({ ...initialData })

  const resetForm = () => {
    formData.value = { ...initialData }
  }

  return { formData, resetForm }
}
