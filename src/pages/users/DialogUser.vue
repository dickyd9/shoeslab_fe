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
  import { onMounted, reactive, ref, toRefs, watch } from "vue"
  import fetchWrapper from "../../helper/fetch-wrapper"
  import Lucide from "../../base-components/Lucide"
  import { createToast } from "mosha-vue-toastify"

  import vueFilePond from "vue-filepond"
  import "filepond/dist/filepond.min.css"

  import {
    required,
    minLength,
    maxLength,
    email,
    url,
    integer,
  } from "@vuelidate/validators"
  import useVuelidate from "@vuelidate/core"

  const emits = defineEmits()
  const props = defineProps({
    showDialog: Boolean,
    isEdit: Boolean,
    editData: Object,
  })

  const closeModal = () => {
    validate.value.$reset()
    Object.assign(form, initialFormData)
    emits("update:close", false)
  }

  const sendButtonRef = ref(null)

  let form = reactive({
    username: null as string | null,
    email: null as string | null,
    password: null,
    confirmPassword: null,
    fullname: null,
    role: "admin",
    address: "address",
  })

  const initialFormData = { ...form }

  const rules = {
    username: {
      required,
    },
    email: {
      required,
      email,
    },
    password: {
      required,
    },
    confirmPassword: {
      required,
    },
    fullname: {
      required,
    },
  }
  const validate = useVuelidate(rules, toRefs(form))

  const saveData = async () => {
    validate.value.$touch()
    if (validate.value.$invalid) {
      createToast("Form must be fill!", {
        type: "danger",
        timeout: 2000,
      })
    } else {
      if (props.isEdit) {
        if (form.password !== form.confirmPassword) {
          createToast("Password tidak sama", {
            type: "danger",
            timeout: 2000,
          })
        } else {
          await fetchWrapper
            .put(`editUser/${props.editData?.id}`, form)
            .then((res: any) => {
              createToast(res.message, {
                type: "success",
                timeout: 2000,
              })
              closeModal()
              Object.assign(form, initialFormData)
            })
            .catch((err: any) => {
              createToast(err.message, {
                type: "danger",
                timeout: 2000,
              })
            })
        }
      } else {
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
              closeModal()
              validate.value.$reset()
              Object.assign(form, initialFormData)
            })
            .catch((err: any) => {
              createToast(err.message, {
                type: "danger",
                timeout: 2000,
              })
            })
        }
      }
    }
  }

  const showPw = reactive({
    password: false,
    confirmPassword: false,
  })

  watch(
    () => props.editData,
    (newValue) => {
      if (newValue) {
        form.fullname = newValue.fullname
        form.username = newValue.username
        form.email = newValue.email
        form.password = newValue.password
        form.fullname = newValue.fullname
        form.role = newValue.role
        form.address = newValue.address
      }
    }
  )
</script>

<template>
  <Dialog
    :open="props.showDialog"
    size="lg"
    @close="closeModal"
    :initialFocus="sendButtonRef">
    <Dialog.Panel>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">
          {{ isEdit ? "Edit User" : "Add User" }}
        </h2>
      </Dialog.Title>
      <Dialog.Description class="gap-4 gap-y-3">
        <!-- <div class="w-1/2 col-span-12 sm:col-span-12">
        </div> -->
        <div class="grid gap-4 col-span-12 sm:col-span-12">
          <div class="col-span-12 sm:col-span-12">
            <FormLabel htmlFor="modal-form-1">Nama</FormLabel>
            <FormInput
              v-model.trim="validate.fullname.$model"
              id="fullname"
              type="text"
              placeholder="Product Name"
              :class="{
                'border-danger': validate.fullname.$error,
              }" />
            <template v-if="validate.fullname.$error">
              <div
                v-for="(error, index) in validate.fullname.$errors"
                :key="index"
                class="mt-2 text-danger">
                {{ error.$message }}
              </div>
            </template>
          </div>
          <div class="col-span-12 sm:col-span-12">
            <FormLabel htmlFor="modal-form-1">Username</FormLabel>
            <FormInput
              v-model.trim="validate.username.$model"
              id="username"
              type="text"
              placeholder="Username"
              :class="{
                'border-danger': validate.username.$error,
              }" />
            <template v-if="validate.username.$error">
              <div
                v-for="(error, index) in validate.username.$errors"
                :key="index"
                class="mt-2 text-danger">
                {{ error.$message }}
              </div>
            </template>
          </div>
          <div class="col-span-12 sm:col-span-12">
            <FormLabel htmlFor="modal-form-2">Email</FormLabel>
            <FormInput
              v-model.trim="validate.email.$model"
              id="productPrice"
              type="text"
              placeholder="Email"
              :class="{
                'border-danger': validate.email.$error,
              }" />
            <template v-if="validate.email.$error">
              <div
                v-for="(error, index) in validate.email.$errors"
                :key="index"
                class="mt-2 text-danger">
                {{ error.$message }}
              </div>
            </template>
          </div>
          <div class="col-span-12 sm:col-span-12">
            <FormLabel htmlFor="modal-form-2">Password</FormLabel>
            <div style="position: relative">
              <FormInput
                v-model.trim="validate.password.$model"
                id="productPrice"
                :type="showPw.password ? 'text' : 'password'"
                placeholder="Password"
                :class="{
                  'border-danger': validate.password.$error,
                }" />
              <template v-if="validate.password.$error">
                <div
                  v-for="(error, index) in validate.password.$errors"
                  :key="index"
                  class="mt-2 text-danger">
                  {{ error.$message }}
                </div>
              </template>
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
                v-model.trim="validate.confirmPassword.$model"
                id="productPrice"
                :type="showPw.confirmPassword ? 'text' : 'password'"
                placeholder="Confirm Password"
                :class="{
                  'border-danger': validate.confirmPassword.$error,
                }" />
              <template v-if="validate.confirmPassword.$error">
                <div
                  v-for="(error, index) in validate.confirmPassword.$errors"
                  :key="index"
                  class="mt-2 text-danger">
                  {{ error.$message }}
                </div>
              </template>
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
