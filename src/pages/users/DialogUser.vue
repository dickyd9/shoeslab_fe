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
  import { onMounted, reactive, ref, watch } from "vue"
  import fetchWrapper from "../../helper/fetch-wrapper"
  import Lucide from "../../base-components/Lucide"
  import { createToast } from "mosha-vue-toastify"

  import vueFilePond from "vue-filepond"
  import "filepond/dist/filepond.min.css"

  const emits = defineEmits()
  const props = defineProps({
    showDialog: Boolean,
    editData: Object,
  })

  const closeModal = () => {
    emits("update:close", false)
  }

  const sendButtonRef = ref(null)

  let form = reactive({
    email: null as string | null,
    password: null,
    confirmPassword: null,
    fullname: null,
    role: "admin",
    address: "address",
  })

  const initialFormData = { ...form }

  const saveData = async () => {
    // let formData = new FormData()

    // if (form.productImage !== null) {
    //   const file = new File([form.productImage], "nama_file.jpg", {
    //     type: "image/jpeg",
    //   })
    //   formData.append("productImage", file)
    // }

    // formData.append("productName", String(form.productName))
    // formData.append("productPrice", String(form.productPrice)) // Anda perlu mengonversi ke string
    // formData.append("productLink", String(form.productLink))
    if (form.password !== form.confirmPassword) {
      createToast("Password tidak sama", {
        type: "danger",
        timeout: 2000,
      })
    } else {
      await fetchWrapper
        .post("signUp", form)
        .then((res: any) => {
          createToast(res.message, {
            type: "success",
            timeout: 2000,
          })
          Object.assign(form, initialFormData)
        })
        .catch((err: any) => {
          createToast(err.message, {
            type: "danger",
            timeout: 2000,
          })
        })
        .finally(() => {
          closeModal()
        })
    }
  }

  const showPw = reactive({
    password: false,
    confirmPassword: false,
  })

  // watch(() => {

  // })
</script>

<template>
  <Dialog
    :open="props.showDialog"
    size="lg"
    @close="closeModal"
    :initialFocus="sendButtonRef">
    <Dialog.Panel>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">Add User</h2>
      </Dialog.Title>
      <Dialog.Description class="gap-4 gap-y-3">
        <!-- <div class="w-1/2 col-span-12 sm:col-span-12">
        </div> -->
        <div class="grid gap-4 col-span-12 sm:col-span-12">
          <div class="col-span-12 sm:col-span-12">
            <FormLabel htmlFor="modal-form-1">Nama</FormLabel>
            <FormInput
              v-model="form.fullname"
              id="productName"
              type="text"
              placeholder="Nama" />
          </div>
          <div class="col-span-12 sm:col-span-12">
            <FormLabel htmlFor="modal-form-2">Email</FormLabel>
            <FormInput
              v-model="form.email"
              id="productPrice"
              type="text"
              placeholder="Email" />
          </div>
          <div class="col-span-12 sm:col-span-12">
            <FormLabel htmlFor="modal-form-2">Password</FormLabel>
            <div style="position: relative">
              <FormInput
                v-model="form.password"
                id="productPrice"
                :type="showPw.password ? 'text' : 'password'"
                placeholder="Password" />
              <button
                @click="showPw.password = !showPw.password"
                class="showPassword">
                <Lucide
                  :icon="showPw.password ? 'Eye' : 'EyeOff'"
                  class="w-4 h-4 mr-2" />
              </button>
            </div>
          </div>
          <div class="col-span-12 sm:col-span-12">
            <FormLabel htmlFor="modal-form-2">Confirm Password</FormLabel>
            <div style="position: relative">
              <FormInput
                v-model="form.confirmPassword"
                id="productPrice"
                :type="showPw.confirmPassword ? 'text' : 'password'"
                placeholder="Confirm Password" />
              <button
                @click="showPw.confirmPassword = !showPw.confirmPassword"
                class="showPassword">
                <Lucide
                  :icon="showPw.confirmPassword ? 'Eye' : 'EyeOff'"
                  class="w-4 h-4 mr-2" />
              </button>
            </div>
          </div>
          <!-- <div class="col-span-12 sm:col-span-12">
            <FormLabel htmlFor="modal-form-3"> Role </FormLabel>
            <FormSelect class="ml-2 !box">
              <option>Status</option>
              <option>Admin</option>
              <option></option>
            </FormSelect>
          </div> -->
        </div>
      </Dialog.Description>
      <Dialog.Footer>
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
          save
        </Button>
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
</template>

<style scoped>
  .showPassword {
    position: absolute;
    top: 0;
    right: 0;
    margin-top: 12px;
    z-index: 1000;
  }
</style>
