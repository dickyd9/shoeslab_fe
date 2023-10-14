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
  import { onMounted, reactive, ref } from "vue"
  import fetchWrapper from "../../helper/fetch-wrapper"
  import { createToast } from "mosha-vue-toastify"

  import vueFilePond from "vue-filepond"
  import "filepond/dist/filepond.min.css"

  const emits = defineEmits()
  const props = defineProps({
    headerFooterModalPreview: Boolean,
  })

  const closeModal = () => {
    emits("update:close", false)
  }

  const sendButtonRef = ref(null)
  const isEdit = ref(false)

  const form = reactive({
    productImage: null,
    productName: null,
    productPrice: null,
    productLink: null,
  })

  const initialFormData = { ...form }

  import FilePondPluginImagePreview from "filepond-plugin-image-preview"
  const FilePond = vueFilePond(FilePondPluginImagePreview)
  const pondOptions = {
    allowMultiple: true, // Atur sesuai kebutuhan
    acceptedFileTypes: ["image/*", "application/pdf"], // Atur sesuai kebutuhan
  }
  const myFiles = ref([])

  const saveData = async () => {
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

    await fetchWrapper.post("product", formData).then((res: any) => {
      closeModal()
      createToast(res.message, {
        type: "success",
        timeout: 2000,
      })
      Object.assign(form, initialFormData)
    })
  }

  const onAddFile = (error: any, val: any) => {
    form.productImage = val.file
  }

  // onMounted(() => {
  //   console.log(myFiles)
  // })
</script>

<template>
  <Dialog
    :open="props.headerFooterModalPreview"
    @close="closeModal"
    :initialFocus="sendButtonRef">
    <Dialog.Panel>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">Add Product</h2>

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
      </Dialog.Title>
      <Dialog.Description class="grid grid-cols-12 gap-4 gap-y-3">
        <div class="col-span-12 sm:col-span-12">
          <FormLabel htmlFor="modal-form-1">Product Image</FormLabel>
          <file-pond
            ref="pond"
            v-bind="pondOptions"
            name="image"
            label-idle="Drop files here..."
            accepted-file-types="image/jpeg, image/png"
            v-bind:files="myFiles"
            @addfile="onAddFile" />
          <!-- <Preview.Panel>
            <Dropzone
              refKey="dropzoneSingleRef"
              :options="{
                url: 'https://httpbin.org/post',
                thumbnailWidth: 150,
                maxFilesize: 0.5,
                maxFiles: 1,
                headers: { 'My-Awesome-Header': 'header value' },
              }"
              @vdropzone-file-added="onUploadSuccess"
              class="dropzone">
              <div class="text-lg font-medium">
                Drop files here or click to upload.
              </div>
              <div class="text-gray-600">
                This is just a demo dropzone. Selected files are
                <span class="font-medium">not</span> actually uploaded.
              </div>
            </Dropzone>
          </Preview.Panel> -->
        </div>
        <div class="col-span-12 sm:col-span-12">
          <FormLabel htmlFor="modal-form-1">Product Name</FormLabel>
          <FormInput
            v-model="form.productName"
            id="productName"
            type="text"
            placeholder="Product Name" />
        </div>
        <div class="col-span-12 sm:col-span-12">
          <FormLabel htmlFor="modal-form-2">Product Price</FormLabel>
          <FormInput
            v-model="form.productPrice"
            id="productPrice"
            type="number"
            placeholder="Product price" />
        </div>
        <div class="col-span-12 sm:col-span-12">
          <FormLabel htmlFor="modal-form-3"> Product Link </FormLabel>
          <FormInput
            v-model="form.productLink"
            id="productList"
            type="text"
            placeholder="Product Link" />
        </div>
      </Dialog.Description>
      <!-- <Dialog.Footer>
      </Dialog.Footer> -->
    </Dialog.Panel>
  </Dialog>
</template>
