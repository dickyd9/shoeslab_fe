<script setup lang="ts">
  import _ from "lodash"
  import { computed, onMounted, reactive, ref } from "vue"
  import fakerData from "./../../utils/faker"
  import Button from "./../../base-components/Button"
  import Pagination from "./../../base-components/Pagination"
  import ImageZoom from "./../../base-components/ImageZoom"
  import { FormInput, FormSelect } from "./../../base-components/Form"
  import Lucide from "./../../base-components/Lucide"
  import { Dialog, Menu } from "./../../base-components/Headless"
  import DialogGallery from "./DialogGallery.vue"
  import fetchWrapper from "./../../helper/fetch-wrapper"
  import { useProductStore } from "./../../stores/product.store"
  import { createToast } from "mosha-vue-toastify"

  const dialogGry = ref(false)

  // const items = computed(() => productData.productData)
  interface Gallery {
    id: number
    link: string
    path: string
    title: string
  }

  interface MetaData {
    totalData: number
    limit: number
    totalPages: number
    page: number
  }

  let listGallery = ref<Gallery[]>([])
  let meta = ref<MetaData>()

  const loadGallery = async () => {
    await fetchWrapper.get("gallery").then((res) => {
      listGallery.value = res.data as Gallery[]
      meta.value = res.meta
    })
  }

  let editProduct = reactive({})
  const editData = async (val: object) => {
    dialogGry.value = true
    editProduct = val
  }

  let isEdit = ref(false)

  onMounted(() => {
    loadGallery()
  })

  const deleteConfirmationModal = ref(false)
  const setDeleteConfirmationModal = (value: boolean) => {
    deleteConfirmationModal.value = value
  }

  const dataGallery = ref<Gallery | null>(null)
  const deleteImage = async () => {
    await fetchWrapper
      .delete(`gallery/${dataGallery.value?.id}`)
      .then((res) => {
        createToast(res.message, {
          type: "success",
          timeout: 2000,
        })
        deleteConfirmationModal.value = false
        loadGallery()
      })
  }

  const deleteButtonRef = ref(null)

  const getImage = (val: any) => {
    return `${import.meta.env.VITE_API_URL}${val}`
  }
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Gallery</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div
      class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <Button
        @click="dialogGry = true"
        variant="primary"
        class="mr-2 shadow-md">
        Add New Image
      </Button>
      <div class="hidden mx-auto md:block text-slate-500">
        Showing 1 to {{ meta?.limit }} of {{ meta?.totalData }} entries
      </div>
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0"></div>
    </div>
    <!-- BEGIN: Users Layout -->
    <div
      v-for="(data, id) in listGallery"
      :key="id"
      class="col-span-12 intro-y md:col-span-6 lg:col-span-4 xl:col-span-3">
      <div class="box">
        <div class="p-5">
          <div class="h-40 overflow-hidden rounded-md">
            <ImageZoom
              alt="Shoeslab|images|product"
              :src="getImage(data.path)"
              class="rounded-md" />
          </div>
        </div>
        <div
          class="flex items-center justify-center p-5 border-t lg:justify-center border-slate-200/60 dark:border-darkmode-400">
          <a
            class="flex items-center mr-3"
            href="#"
            @click="
              (event) => {
                event.preventDefault()
                isEdit = true
                editData(data)
              }
            ">
            <Lucide icon="CheckSquare" class="w-4 h-4 mr-1" /> Edit
          </a>
          <a
            class="flex items-center text-danger"
            href="#"
            @click="
              (event) => {
                event.preventDefault()
                setDeleteConfirmationModal(true)
                dataGallery = data
              }
            ">
            <Lucide icon="Trash2" class="w-4 h-4 mr-1" /> Delete
          </a>
        </div>
      </div>
    </div>
    <!-- END: Users Layout -->
    <!-- BEGIN: Pagination -->
    <!-- <div
      class="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
      <Pagination class="w-full sm:w-auto sm:mr-auto">
        <Pagination.Link>
          <Lucide icon="ChevronsLeft" class="w-4 h-4" />
        </Pagination.Link>
        <Pagination.Link>
          <Lucide icon="ChevronLeft" class="w-4 h-4" />
        </Pagination.Link>
        <Pagination.Link>...</Pagination.Link>
        <Pagination.Link>1</Pagination.Link>
        <Pagination.Link active>2</Pagination.Link>
        <Pagination.Link>3</Pagination.Link>
        <Pagination.Link>...</Pagination.Link>
        <Pagination.Link>
          <Lucide icon="ChevronRight" class="w-4 h-4" />
        </Pagination.Link>
        <Pagination.Link>
          <Lucide icon="ChevronsRight" class="w-4 h-4" />
        </Pagination.Link>
      </Pagination>
      <FormSelect class="w-20 mt-3 !box sm:mt-0">
        <option>10</option>
        <option>25</option>
        <option>35</option>
        <option>50</option>
      </FormSelect>
    </div> -->
    <!-- END: Pagination -->
  </div>

  <DialogGallery
    :headerFooterModalPreview="dialogGry"
    :editData="editProduct"
    :isEdit="isEdit"
    @update:close="
      (val: any) => {
        editProduct = reactive({})
        isEdit = false
        dialogGry = val
        loadGallery()
      }
    " />
  <!-- BEGIN: Delete Confirmation Modal -->
  <Dialog
    :open="deleteConfirmationModal"
    @close="
      () => {
        setDeleteConfirmationModal(false)
      }
    ">
    <Dialog.Panel>
      <div class="p-5 text-center">
        <Lucide icon="XCircle" class="w-16 h-16 mx-auto mt-3 text-danger" />
        <div class="mt-5 text-3xl">Are you sure?</div>
        <div class="mt-2 text-slate-500">
          Do you really want to delete these records? <br />
          This process cannot be undone.
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <Button
          variant="outline-secondary"
          type="button"
          @click="
            () => {
              setDeleteConfirmationModal(false)
            }
          "
          class="w-24 mr-1">
          Cancel
        </Button>
        <Button
          variant="danger"
          type="button"
          class="w-24"
          @click="deleteImage"
          ref="deleteButtonRef">
          Delete
        </Button>
      </div>
    </Dialog.Panel>
  </Dialog>
  <!-- END: Delete Confirmation Modal -->
</template>
