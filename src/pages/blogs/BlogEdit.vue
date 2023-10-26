<script setup lang="ts">
  import _ from "lodash"
  import { onMounted, reactive, ref, watch, toRefs } from "vue"
  import fakerData from "../../utils/faker"
  import Button from "../../base-components/Button"
  import { FormInput, FormLabel, FormSwitch } from "../../base-components/Form"
  import Lucide from "../../base-components/Lucide"
  import Tippy from "../../base-components/Tippy"
  import Litepicker from "../../base-components/Litepicker"
  import TomSelect from "../../base-components/TomSelect"
  import { ClassicEditor } from "../../base-components/Ckeditor"
  import { Menu, Tab } from "../../base-components/Headless"
  import { useRouter } from "vue-router"
  import { createToast } from "mosha-vue-toastify"
  import fetchWrapper from "../../helper/fetch-wrapper"
  import Editor from "@tinymce/tinymce-vue"
  import {
    required,
    minLength,
    maxLength,
    email,
    url,
    integer,
  } from "@vuelidate/validators"
  import { useVuelidate } from "@vuelidate/core"

  const categories = ref(["1", "2"])
  const tags = ref(["1", "2"])
  const salesReportFilter = ref<string>("")
  const route = useRouter()

  interface Blog {
    id: number
    blogImage: string
    blogTitle: string
    blogDesc: string
    blogStatus: boolean
    createdAt: Date
  }

  const editorValue = ref("")
  let form = reactive({
    id: null as number | null,
    blogImage: null as string | null,
    blogTitle: null as string | null,
    blogDesc: "",
    blogStatus: false as boolean | false,
  })

  const initialFormData = { ...form }

  const rules = {
    blogTitle: {
      required,
      maxLength: maxLength(100),
    },
  }

  const validate = useVuelidate(rules, toRefs(form))

  import vueFilePond from "vue-filepond"
  import "filepond/dist/filepond.min.css"
  import FilePondPluginImagePreview from "filepond-plugin-image-preview"
  const FilePond = vueFilePond(FilePondPluginImagePreview)
  const pondOptions = {
    allowMultiple: true,
    acceptedFileTypes: ["image/*", "application/pdf"],
  }

  const onAddFile = (error: any, val: any) => {
    form.blogImage = val.file
  }

  const detailBlog = JSON.parse(
    localStorage.getItem("detailBlog") || ""
  ) as Blog

  const saveData = async () => {
    validate.value.$touch()
    let formData = new FormData()

    if (!form.blogTitle) {
      createToast("Title wajib di isi", {
        type: "danger",
        timeout: 2000,
      })
    }

    if (form.blogImage !== null) {
      const file = new File([form.blogImage], "blog.jpg", {
        type: "image/jpeg",
      })
      formData.append("blogImage", file)
    }

    formData.append("blogTitle", String(form.blogTitle))
    formData.append("blogDesc", String(form.blogDesc))
    formData.append("blogStatus", String(form.blogStatus))

    await fetchWrapper
      .put(`blog/${detailBlog.id}`, formData)
      .then((res: any) => {
        backToList()
        createToast(res.message, {
          type: "success",
          timeout: 2000,
        })
        Object.assign(form, initialFormData)
      })
      .catch((error: any) => {
        createToast(error.response.data.error, {
          type: "danger",
          timeout: 2000,
        })
      })
  }
  const backToList = () => {
    route.back()
  }
  const myFiles = ref<File[]>([])
  const imageUrl = `https://shoeslab.id${detailBlog.blogImage}`
  const loadImage = () => {
    fetch(imageUrl)
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

  onMounted(() => {
    form.blogImage = `${import.meta.env.VITE_API_URL}${detailBlog.blogImage}`
    form.blogTitle = detailBlog?.blogTitle || ""
    form.blogDesc = detailBlog?.blogDesc || ""
    form.blogStatus = detailBlog?.blogStatus || false

    loadImage()
  })

  const example_image_upload_handler = (
    blobInfo: any,
    success: any,
    failure: any,
    progress: any
  ) => {
    let xhr: XMLHttpRequest, formData

    xhr = new XMLHttpRequest()
    xhr.withCredentials = false
    xhr.open("POST", `${import.meta.env.VITE_API_URL}/v1/images`)

    xhr.upload.onprogress = function (e) {
      progress((e.loaded / e.total) * 100)
    }

    xhr.onload = function () {
      let json

      if (xhr.status != 200) {
        failure("HTTP Error: " + xhr.status)
        return
      }

      json = JSON.parse(xhr.responseText || "")

      success(json.data.path)
    }

    formData = new FormData()
    formData.append("path", blobInfo.blob(), blobInfo.filename())

    xhr.send(formData)
  }
</script>

<template>
  <div class="flex flex-col items-center mt-8 intro-y sm:flex-row">
    <h2 class="mr-auto text-lg font-medium">Add New Blog</h2>
    <div class="flex w-full mt-4 sm:w-auto sm:mt-0">
      <Button @click="backToList" variant="primary" class="mr-2 shadow-md">
        <Lucide icon="ArrowLeft" class="w-4 h-4 mr-2" />
        Back
      </Button>
      <Menu>
        <Menu.Button
          :as="Button"
          @click="saveData"
          variant="primary"
          class="flex items-center shadow-md">
          Save
        </Menu.Button>
      </Menu>
    </div>
  </div>
  <div class="grid grid-cols-12 gap-5 mt-5 intro-y">
    <!-- BEGIN: Post Content -->
    <div class="col-span-12 intro-y lg:col-span-8">
      <div class="grid items-end w-full">
        <span class="text-end mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
          {{ form.blogTitle?.length }} / 100
        </span>
        <FormInput
          v-model.trim="validate.blogTitle.$model"
          type="text"
          :class="{
            'border-danger': validate.blogTitle.$error,
          }"
          class="px-4 py-3 pr-10 intro-y !box"
          placeholder="Title" />
        <template v-if="validate.blogTitle.$error">
          <div
            v-for="(error, index) in validate.blogTitle.$errors"
            :key="index"
            class="mt-2 text-danger">
            {{ error.$message }}
          </div>
        </template>
      </div>
      <Tab.Group class="mt-5 overflow-hidden intro-y box">
        <Tab.List
          class="flex-col border-transparent dark:border-transparent sm:flex-row bg-slate-200 dark:bg-darkmode-800">
          <Tab :fullWidth="false" v-slot="{ selected }">
            <Tab.Button
              :class="[
                'flex items-center justify-center w-full px-0 py-0 sm:w-40 text-slate-500',
                {
                  'hover:border-transparent hover:bg-transparent hover:text-slate-600 hover:dark:bg-transparent hover:dark:text-slate-300':
                    !selected,
                },
                {
                  'text-primary border-transparent dark:bg-darkmode-600 dark:border-x-transparent dark:border-t-transparent dark:text-white':
                    selected,
                },
              ]"
              as="button">
              <Tippy
                content="Fill in the article content"
                class="flex items-center justify-center w-full py-4"
                aria-controls="content"
                aria-selected="true">
                <Lucide icon="FileText" class="w-4 h-4 mr-2" />
                Content
              </Tippy>
            </Tab.Button>
          </Tab>
          <!-- <Tab :fullWidth="false" v-slot="{ selected }">
            <Tab.Button
              :class="[
                'flex items-center justify-center w-full px-0 py-0 sm:w-40 text-slate-500',
                {
                  'hover:border-transparent hover:bg-transparent hover:text-slate-600 hover:dark:bg-transparent hover:dark:text-slate-300':
                    !selected,
                },
                {
                  'text-primary border-transparent dark:bg-darkmode-600 dark:border-x-transparent dark:border-t-transparent dark:text-white':
                    selected,
                },
              ]"
              as="button"
            >
              <Tippy
                content="Adjust the meta title"
                class="flex items-center justify-center w-full py-4"
                aria-selected="false"
              >
                <Lucide icon="Code" class="w-4 h-4 mr-2" /> Meta Title
              </Tippy>
            </Tab.Button>
          </Tab>
          <Tab :fullWidth="false" v-slot="{ selected }">
            <Tab.Button
              :class="[
                'flex items-center justify-center w-full px-0 py-0 sm:w-40 text-slate-500',
                {
                  'hover:border-transparent hover:bg-transparent hover:text-slate-600 hover:dark:bg-transparent hover:dark:text-slate-300':
                    !selected,
                },
                {
                  'text-primary border-transparent dark:bg-darkmode-600 dark:border-x-transparent dark:border-t-transparent dark:text-white':
                    selected,
                },
              ]"
              as="button"
            >
              <Tippy
                content="Use search keywords"
                class="flex items-center justify-center w-full py-4"
                aria-selected="false"
              >
                <Lucide icon="AlignLeft" class="w-4 h-4 mr-2" />
                Keywords
              </Tippy>
            </Tab.Button>
          </Tab> -->
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel class="p-5">
            <div
              class="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
              <div
                class="flex items-center pb-5 font-medium border-b border-slate-200/60 dark:border-darkmode-400">
                <Lucide icon="ChevronDown" class="w-4 h-4 mr-2" /> Text Content
              </div>
              <div class="mt-5">
                <!-- <ClassicEditor v-model="form.blogDesc" /> -->
                <Editor
                  v-model="form.blogDesc"
                  api-key="27awhdl835fck97654lvo0oj7zl9p32aju4655y2x5fhq320"
                  :init="{
                    height: 500,
                    menubar: false,
                    plugins: 'lists link image emoticons',
                    automatic_uploads: true,
                    convert_urls: false,
                    images_upload_handler: example_image_upload_handler,
                    images_upload_base_path: '/assets/images',
                    toolbar:
                      'styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist | link image emoticons',
                  }" />
              </div>
            </div>
            <!-- <div
              class="p-5 mt-5 border rounded-md border-slate-200/60 dark:border-darkmode-400"
            >
              <div
                class="flex items-center pb-5 font-medium border-b border-slate-200/60 dark:border-darkmode-400"
              >
                <Lucide icon="ChevronDown" class="w-4 h-4 mr-2" />
                Caption & Images
              </div>
              <div class="mt-5">
                <div>
                  <FormLabel htmlFor="post-form-7">Caption</FormLabel>
                  <FormInput
                    id="post-form-7"
                    type="text"
                    placeholder="Write caption"
                  />
                </div>
                <div class="mt-3">
                  <FormLabel>Upload Image</FormLabel>
                  <div
                    class="pt-4 border-2 border-dashed rounded-md dark:border-darkmode-400"
                  >
                    <div class="flex flex-wrap px-4">
                      <div
                        v-for="(faker, fakerKey) in _.take(fakerData, 4)"
                        :key="fakerKey"
                        class="relative w-24 h-24 mb-5 mr-5 cursor-pointer image-fit zoom-in"
                      >
                        <img
                          class="rounded-md"
                          alt="Midone Tailwind HTML Admin Template"
                          :src="faker.images[0]"
                        />
                        <Tippy
                          as="div"
                          content="Remove this image?"
                          class="absolute top-0 right-0 flex items-center justify-center w-5 h-5 -mt-2 -mr-2 text-white rounded-full bg-danger"
                        >
                          <Lucide icon="X" class="w-4 h-4" />
                        </Tippy>
                      </div>
                    </div>
                    <div
                      class="relative flex items-center px-4 pb-4 cursor-pointer"
                    >
                      <Lucide icon="Image" class="w-4 h-4 mr-2" />
                      <span class="mr-1 text-primary"> Upload a file </span> or
                      drag and drop
                      <FormInput
                        type="file"
                        class="absolute top-0 left-0 w-full h-full opacity-0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div> -->
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
    <!-- END: Post Content -->

    <!-- BEGIN: Post Info -->
    <div class="col-span-12 lg:col-span-4">
      <div class="p-5 intro-y box">
        <!-- <div>
          <FormLabel>Written By</FormLabel>
          <Menu class="[&>div:nth-child(2)]:w-full">
            <Menu.Button
              :as="Button"
              variant="outline-secondary"
              class="flex items-center justify-start w-full dark:bg-darkmode-800 dark:border-darkmode-800"
              role="button"
            >
              <div class="w-6 h-6 mr-3 image-fit">
                <img
                  class="rounded"
                  alt="Midone Tailwind HTML Admin Template"
                  :src="fakerData[0].photos[0]"
                />
              </div>
              <div class="truncate">{{ fakerData[0].users[0].name }}</div>
              <Lucide icon="ChevronDown" class="w-4 h-4 ml-auto" />
            </Menu.Button>
            <Menu.Items>
              <Menu.Item
                v-for="(faker, fakerKey) in _.take(fakerData, 5)"
                :key="fakerKey"
              >
                <div class="absolute w-6 h-6 mr-3 image-fit">
                  <img
                    class="rounded"
                    alt="Midone Tailwind HTML Admin Template"
                    :src="faker.photos[0]"
                  />
                </div>
                <div class="pl-1 ml-8">{{ faker.users[0].name }}</div>
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div> -->
        <!-- <div class="mt-3">
          <FormLabel htmlFor="post-form-2">Post Date</FormLabel>
          <Litepicker
            v-model="form.blog"
            :options="{
              autoApply: false,
              showWeekNumbers: true,
              dropdowns: {
                minYear: 1990,
                maxYear: null,
                months: true,
                years: true,
              },
            }" />
        </div> -->
        <!-- <div class="mt-3">
          <FormLabel htmlFor="post-form-3">Categories</FormLabel>
          <TomSelect
            id="post-form-3"
            v-model="categories"
            class="w-full"
            multiple
          >
            <option value="1">Horror</option>
            <option value="2">Sci-fi</option>
            <option value="3">Action</option>
            <option value="4">Drama</option>
            <option value="5">Comedy</option>
          </TomSelect>
        </div>
        <div class="mt-3">
          <FormLabel htmlFor="post-form-4">Tags</FormLabel>
          <TomSelect id="post-form-4" v-model="tags" class="w-full" multiple>
            <option value="1">Leonardo DiCaprio</option>
            <option value="2">Johnny Deep</option>
            <option value="3">Robert Downey, Jr</option>
            <option value="4">Samuel L. Jackson</option>
            <option value="5">Morgan Freeman</option>
          </TomSelect>
        </div> -->
        <!-- <FormSwitch class="flex flex-col items-start mt-3">
          <FormSwitch.Label htmlFor="post-form-5" class="mb-2 ml-0">
            Published
          </FormSwitch.Label>
          <FormSwitch.Input id="post-form-5" type="checkbox" />
        </FormSwitch> -->
        <div class="col-span-12 sm:col-span-12">
          <FormLabel htmlFor="modal-form-1">Blog Image</FormLabel>
          <file-pond
            ref="pond"
            v-bind="pondOptions"
            name="image"
            label-idle="Drop files here..."
            v-bind:files="myFiles"
            accepted-file-types="image/jpeg, image/png"
            @addfile="onAddFile" />
        </div>
        <FormSwitch class="flex flex-col items-start mt-3">
          <FormSwitch.Label htmlFor="post-form-6" class="mb-2 ml-0">
            Blog Status
          </FormSwitch.Label>
          <FormSwitch.Input
            @click="
              () => {
                form.blogStatus = !form.blogStatus
              }
            "
            id="post-form-6"
            type="checkbox" />
        </FormSwitch>
      </div>
    </div>
    <!-- END: Post Info -->
  </div>
</template>
