<script setup lang="ts">
  import Preview from "../../base-components/Preview"
  import {
    FormLabel,
    FormSwitch,
    FormInput,
    FormSelect,
  } from "../../base-components/Form"
  import { Menu, Dialog } from "../../base-components/Headless"
  import Button from "../../base-components/Button"
  import Dropzone, { DropzoneElement } from "../../base-components/Dropzone"
  import { onMounted, reactive, ref, watch, toRefs } from "vue"
  import fetchWrapper from "../../helper/fetch-wrapper"
  import { createToast } from "mosha-vue-toastify"

  import {
    required,
    minLength,
    maxLength,
    email,
    url,
    integer,
  } from "@vuelidate/validators"

  import vueFilePond from "vue-filepond"
  import "filepond/dist/filepond.min.css"

  const emits = defineEmits()
  const props = defineProps({
    isEdit: Boolean,
    headerFooterModalPreview: Boolean,
    editData: Object,
  })

  const closeModal = () => {
    myFiles.value = []
    initialFormData
    emits("update:close", false)
  }

  const sendButtonRef = ref(null)

  let form = reactive({
    productImage: null as string | null,
    productName: null,
    productPrice: null,
    productLink: null,
  })

  const initialFormData = { ...form }

  import FilePondPluginImagePreview from "filepond-plugin-image-preview"
  import useVuelidate from "@vuelidate/core"
  const FilePond = vueFilePond(FilePondPluginImagePreview)
  const pondOptions = {
    allowMultiple: true, // Atur sesuai kebutuhan
    acceptedFileTypes: "image/jpeg, image/png",
    onload: (response: any) => {
      console.log(response)
      // Tangani respons dari server setelah gambar diunggah
      // Di sini, Anda dapat mengambil URL gambar dari respons dan menyimpannya ke form.productImage
      // console.log(response)
      // form.productImage = imageUrl
    },
  }

  const rules = {
    productName: {
      required,
    },
    productPrice: {
      required,
    },
  }
  const validate = useVuelidate(rules, toRefs(form))
  const saveData = async () => {
    validate.value.$touch()
    if (validate.value.$invalid) {
      console.log("error")
    } else {
      let formData = new FormData()

      if (form.productImage !== null) {
        const file = new File([form.productImage], "nama_file.jpg", {
          type: "image/jpeg",
        })
        formData.append("productImage", file)
      }

      formData.append("productName", String(form.productName))
      formData.append("productPrice", String(form.productPrice)) // Anda perlu mengonversi ke string
      formData.append("productLink", String(form.productLink))
      if (props.isEdit) {
        await fetchWrapper
          .put(`product/${props.editData?.id}`, formData)
          .then((res: any) => {
            closeModal()
            createToast(res.message, {
              type: "success",
              timeout: 2000,
            })
            Object.assign(form, initialFormData)
          })
      } else {
        await fetchWrapper.post("product", formData).then((res: any) => {
          closeModal()
          createToast(res.message, {
            type: "success",
            timeout: 2000,
          })
          Object.assign(form, initialFormData)
        })
      }
    }
  }

  const onAddFile = (error: any, val: any) => {
    form.productImage = val.file
  }

  watch(
    () => props.editData,
    (newValue) => {
      if (newValue) {
        form.productImage = `https://shoeslab.id${newValue.productImage}`
        form.productName = newValue.productName
        form.productPrice = newValue.productPrice
        form.productLink = newValue.productLink
      }
    }
  )

  const myFiles = ref<File[]>([])
  const loadImage = async () => {
    await fetch(`https://shoeslab.id${props.editData?.productImage}`)
      .then((response) => {
        if (response.ok) {
          return response.blob()
        }
        throw new Error("Gagal mengambil gambar")
      })
      .then((imageBlob) => {
        const imageFile = new File([imageBlob], "image.jpg", {
          type: "image/jpeg",
        })
        myFiles.value = [imageFile]
      })
      .catch((error) => {
        console.error(error)
      })
  }

  watch(props, (newValue) => {
    if (newValue.isEdit) {
      loadImage()
    }
  })
</script>

<template>
  <Dialog
    :open="props.headerFooterModalPreview"
    size="lg"
    @close="closeModal"
    :initialFocus="sendButtonRef">
    <!-- Container to center the panel -->
    <Dialog.Panel>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">
          {{ props.isEdit ? "Edit Product" : "Add Product" }}
        </h2>
      </Dialog.Title>
      <Dialog.Description>
        <form
          class="h-full w-full justify-center gap-4 gap-y-3"
          @submit.prevent="saveData">
          <div
            class="overflow-y-auto max-h-[60vh] grid gap-4 col-span-12 sm:col-span-12">
            <div class="col-span-12 sm:col-span-12">
              <FormLabel htmlFor="modal-form-1">Product Image</FormLabel>
              <file-pond
                ref="pond"
                v-bind="pondOptions"
                name="image"
                label-idle="Drop files here..."
                v-bind:files="myFiles"
                @addfile="onAddFile" />
            </div>
            <div class="col-span-12 sm:col-span-12">
              <FormLabel htmlFor="modal-form-1">Product Name</FormLabel>
              <FormInput
                v-model.trim="validate.productName.$model"
                id="productName"
                type="text"
                placeholder="Product Name"
                :class="{
                  'border-danger': validate.productName.$error,
                }" />
              <template v-if="validate.productName.$error">
                <div
                  v-for="(error, index) in validate.productName.$errors"
                  :key="index"
                  class="mt-2 text-danger">
                  {{ error.$message }}
                </div>
              </template>
            </div>
            <div class="col-span-12 sm:col-span-12">
              <FormLabel htmlFor="modal-form-2">Product Price</FormLabel>
              <FormInput
                v-model.trim="validate.productPrice.$model"
                id="productPrice"
                type="number"
                placeholder="Product price"
                :class="{
                  'border-danger': validate.productPrice.$error,
                }" />
              <template v-if="validate.productPrice.$error">
                <div
                  v-for="(error, index) in validate.productName.$errors"
                  :key="index"
                  class="mt-2 text-danger">
                  {{ error.$message }}
                </div>
              </template>
            </div>
            <div class="col-span-12 sm:col-span-12">
              <FormLabel htmlFor="modal-form-3"> Product Link </FormLabel>
              <FormInput
                v-model="form.productLink"
                id="productList"
                type="text"
                placeholder="Product Link" />
            </div>
          </div>

          <div class="flex mt-12">
            <Button
              type="button"
              variant="outline-secondary"
              @click="closeModal"
              class="w-20 mr-1">
              Cancel
            </Button>
            <Button
              @click="saveData"
              variant="primary"
              type="button"
              class="w-20"
              ref="{sendButtonRef}">
              Send
            </Button>
          </div>
        </form>
      </Dialog.Description>
    </Dialog.Panel>
  </Dialog>
</template>
