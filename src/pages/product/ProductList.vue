<script setup lang="ts">
  import _ from "lodash"
  import { computed, onMounted, reactive, ref } from "vue"
  import fakerData from "../../utils/faker"
  import Button from "../../base-components/Button"
  import Pagination from "../../base-components/Pagination"
  import ImageZoom from "../../base-components/ImageZoom"
  import { FormInput, FormSelect } from "../../base-components/Form"
  import Lucide from "../../base-components/Lucide"
  import { Dialog, Menu } from "../../base-components/Headless"
  import AddProduct from "./AddProduct.vue"
  import fetchWrapper from "../../helper/fetch-wrapper"
  import { useProductStore } from "../../stores/product.store"
import { createToast } from "mosha-vue-toastify"

  const productData = useProductStore()

  const addProduct = ref(false)

  // const items = computed(() => productData.productData)
  interface Product {
    id: number
    productImage: string
    productName: string
    productPrice: number
    productLink: string
  }

  interface MetaData {
    totalData: number
    limit: number
    totalPages: number
    page: number
  }

  let formatprice = (value: any) => {
    return value.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.")
  }

  let listProduct = ref<Product[]>([])
  let meta = ref<MetaData>()

  const loadProduct = async () => {
    await fetchWrapper.get("product").then((res) => {
      listProduct.value = res.data as Product[]
      meta.value = res.meta
    })
  }

  let editProduct = reactive({})
  const editData = async (val: object) => {
    addProduct.value = true
    editProduct = val
  }

  onMounted(() => {
    loadProduct()
  })

  const deleteConfirmationModal = ref(false)
  const setDeleteConfirmationModal = (value: boolean) => {
    deleteConfirmationModal.value = value
  }

  const dataProduct = ref<Product | null>(null)
  const deleteProduct = async () => {
    await fetchWrapper.delete(`product/${dataProduct.value?.id}`).then((res) => {
      createToast(res.message, {
        type: "success",
        timeout: 2000,
      })
      deleteConfirmationModal.value = false
      loadProduct()
    })
  }

  const deleteButtonRef = ref(null)

  const getImage = (val: any) => {
    return `${import.meta.env.VITE_API_URL}${val}`
  }
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Product List</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div
      class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <Button
        @click="addProduct = true"
        variant="primary"
        class="mr-2 shadow-md">
        Add New Product
      </Button>
      <!-- <Menu>
        <Menu.Button :as="Button" class="px-2 !box">
          <span class="flex items-center justify-center w-5 h-5">
            <Lucide icon="Plus" class="w-4 h-4" />
          </span>
        </Menu.Button>
        <Menu.Items class="w-40">
          <Menu.Item>
            <Lucide icon="Printer" class="w-4 h-4 mr-2" /> Print
          </Menu.Item>
          <Menu.Item>
            <Lucide icon="FileText" class="w-4 h-4 mr-2" /> Export to Excel
          </Menu.Item>
          <Menu.Item>
            <Lucide icon="FileText" class="w-4 h-4 mr-2" /> Export to PDF
          </Menu.Item>
        </Menu.Items>
      </Menu> -->
      <div class="hidden mx-auto md:block text-slate-500">
        Showing 1 to {{ meta?.limit }} of {{ meta?.totalData }} entries
      </div>
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <!-- <div class="relative w-56 text-slate-500">
          <FormInput
            type="text"
            class="w-56 pr-10 !box"
            placeholder="Search..." />
          <Lucide
            icon="Search"
            class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
        </div> -->
      </div>
    </div>
    <!-- BEGIN: Users Layout -->
    <div
      v-for="(data, id) in listProduct"
      :key="id"
      class="col-span-12 intro-y md:col-span-6 lg:col-span-4 xl:col-span-3">
      <div class="box">
        <div class="p-5">
          <div class="h-40 overflow-hidden rounded-md">
            <ImageZoom
              alt="Shoeslab|images|product"
              :src="getImage(data.productImage)"
              class="rounded-md" />
          </div>
          <div class="mt-5 text-slate-600 dark:text-slate-500">
            <div class="flex text-base font-medium items-center">
              {{ data?.productName }}
            </div>

            <div class="flex items-center mt-2">
              <Lucide icon="Link" class="w-4 h-4 mr-2" /> Price: Rp
              {{ formatprice(data?.productPrice) }}
            </div>

            <!-- <div class="flex items-center mt-2">
              <Lucide icon="CheckSquare" class="w-4 h-4 mr-2" /> Status: {{ data?.productPrice === 1 ? 'Active' : 'Inactive' }}
            </div> -->
          </div>
        </div>
        <div
          class="flex items-center justify-center p-5 border-t lg:justify-center border-slate-200/60 dark:border-darkmode-400">
          <!-- <a class="flex items-center mr-auto text-primary" href="#">
            <Lucide icon="Eye" class="w-4 h-4 mr-1" /> Preview
          </a> -->
          <a class="flex items-center mr-3" href="#" @click="(event) => {
              event.preventDefault()
              editData(data)
            }">
            <Lucide icon="CheckSquare" class="w-4 h-4 mr-1" /> Edit
          </a>
          <a
            class="flex items-center text-danger"
            href="#"
            @click="
              (event) => {
                event.preventDefault()
                setDeleteConfirmationModal(true)
                dataProduct = data
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

  <AddProduct
    :headerFooterModalPreview="addProduct"
    :editData="editProduct"
    @update:close="
      (val) => {
        editProduct = reactive({})
        addProduct = val
        loadProduct()
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
          @click="deleteProduct"
          ref="deleteButtonRef">
          Delete
        </Button>
      </div>
    </Dialog.Panel>
  </Dialog>
  <!-- END: Delete Confirmation Modal -->
</template>
