<script setup lang="ts">
  import _ from "lodash"
  import { onMounted, reactive, ref } from "vue"
  import fakerData from "../../utils/faker"
  import Button from "../../base-components/Button"
  import Pagination from "../../base-components/Pagination"
  import { FormCheck, FormInput, FormSelect } from "../../base-components/Form"
  import Lucide from "../../base-components/Lucide"
  import { Dialog, Menu } from "../../base-components/Headless"
  import Table from "../../base-components/Table"
  import { useRouter } from "vue-router"
  import fetchWrapper from "../../helper/fetch-wrapper"
  import { createToast } from "mosha-vue-toastify"

  const router = useRouter()

  const addNewBlogs = () => {
    router.push("detail-blog")
  }

  interface Blogs {
    id: number
    blogTitle: string
    blogDesc: string
    blogStatus: number
    createdAt: string
  }

  let listBlogs = ref<Blogs[]>([])

  const deleteConfirmationModal = ref(false)
  const setDeleteConfirmationModal = (value: boolean) => {
    deleteConfirmationModal.value = value
  }
  const dataBlog = ref<Blogs | null>(null)
  const deleteButtonRef = ref(null)
  const deleteBlog = async () => {
    console.log('blog')
    await fetchWrapper.delete(`blog/${dataBlog.value?.id}`).then((res) => {
      createToast(res.message, {
        type: "success",
        timeout: 2000,
      })
      deleteConfirmationModal.value = false
      getData()
    })
  }

  const param = ref(null)
  const getData = async () => {
    await fetchWrapper.get("blog", { keyword: param.value }).then((res) => {
      listBlogs.value = res.data as Blogs[]
    })
  }

  onMounted(async () => {
    await getData()
  })

  const detailBlog = (val: number) => {
    router.push({ name: "blog-preview", params: { id: val } })
  }
  const formatDate = (dateString: any) => {
    const date = new Date(dateString)
    // Then specify how you want your dates to be formatted
    return new Intl.DateTimeFormat("default", { dateStyle: "long" }).format(
      date
    )
  }
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Blogs List</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div
      class="flex flex-wrap items-center col-span-12 mt-2 intro-y xl:flex-nowrap">
      <div class="flex justify-space-between w-full sm:w-auto">
        <form @submit.prevent="getData()" class="relative w-48 text-slate-500">
          <FormInput
            v-model="param"
            type="text"
            class="w-48 pr-10 !box"
            placeholder="Search ..." />
          <Lucide
            icon="Search"
            class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
        </form>
        <FormSelect class="ml-2 !box">
          <option>Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </FormSelect>
      </div>
      <div class="hidden mx-auto xl:block text-slate-500"></div>
      <div class="flex items-center w-full mt-3 xl:w-auto xl:mt-0">
        <Button @click="addNewBlogs" variant="primary" class="mr-2 shadow-md">
          <!-- <Lucide icon="FileText" class="w-4 h-4 mr-2" />  -->
          Add new blogs
        </Button>
        <!-- <Button variant="primary" class="mr-2 shadow-md">
          <Lucide icon="FileText" class="w-4 h-4 mr-2" /> Export to PDF
        </Button>
        <Menu>
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
      </div>
    </div>

    <!-- BEGIN: Data List -->
    <div class="col-span-12 overflow-auto intro-y 2xl:overflow-visible">
      <Table class="border-spacing-y-[10px] border-separate -mt-2">
        <Table.Thead>
          <Table.Tr>
            <!-- <Table.Th class="border-b-0 whitespace-nowrap">
              <FormCheck.Input type="checkbox" />
            </Table.Th> -->
            <Table.Th class="border-b-0 whitespace-nowrap"> TITLE </Table.Th>
            <Table.Th class="border-b-0 whitespace-nowrap">
              POST DATE
            </Table.Th>
            <Table.Th class="text-center border-b-0 whitespace-nowrap">
              STATUS
            </Table.Th>
            <Table.Th class="text-center border-b-0 whitespace-nowrap">
              ACTIONS
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr v-for="(blog, id) in listBlogs" :key="id" class="intro-x">
            <!-- <Table.Td
              class="first:rounded-l-md last:rounded-r-md w-10 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
              <FormCheck.Input type="checkbox" />
            </Table.Td> -->
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md w-40 !py-4 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
              <a href="" class="font-medium whitespace-nowrap">
                {{ blog.blogTitle }}
              </a>
            </Table.Td>
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
              <a href="" class="font-medium whitespace-nowrap">
                {{ formatDate(blog.createdAt) }}
              </a>
            </Table.Td>
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
              <div
                :class="{
                  'flex items-center justify-center whitespace-nowrap': true,
                  'text-success': blog.blogStatus,
                  'text-danger': !blog.blogStatus,
                }">
                <Lucide icon="CheckSquare" class="w-4 h-4 mr-2" />
                {{ blog.blogStatus ? "Active" : "Inactive" }}
              </div>
            </Table.Td>
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
              <div class="flex items-center justify-center">
                <a
                  class="flex items-center mr-5 text-primary whitespace-nowrap"
                  href="#"
                  @click="detailBlog(blog.id)">
                  <Lucide icon="CheckSquare" class="w-4 h-4 mr-1" />
                  View Details
                </a>
                <a
                  class="flex items-center text-danger"
                  href="#"
                  @click="
                    (event) => {
                      event.preventDefault()
                      setDeleteConfirmationModal(true)
                      dataBlog = blog
                    }
                  ">
                  <Lucide icon="Trash2" class="w-4 h-4 mr-1" /> Delete
                </a>
              </div>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
    <!-- END: Data List -->
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
  <!-- BEGIN: Delete Confirmation Modal -->
  <Dialog
    :open="deleteConfirmationModal"
    @close="
      () => {
        setDeleteConfirmationModal(false)
      }
    "
    :initialFocus="deleteButtonRef">
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
          @click="deleteBlog"
          ref="deleteButtonRef">
          Delete
        </Button>
      </div>
    </Dialog.Panel>
  </Dialog>
  <!-- END: Delete Confirmation Modal -->
</template>
