<script setup lang="ts">
  import _ from "lodash"
  import fakerData from "../../utils/faker"
  import Button from "../../base-components/Button"
  import DialogUser from "./DialogUser.vue"
  import Pagination from "../../base-components/Pagination"
  import { FormInput, FormSelect } from "../../base-components/Form"
  import Lucide from "../../base-components/Lucide"
  import { Dialog, Menu } from "../../base-components/Headless"

  import { onMounted, reactive, ref } from "vue"
  import fetchWrapper from "../../helper/fetch-wrapper"
  import { createToast } from "mosha-vue-toastify"

  interface Users {
    id: number
    username: string
    fullname: string
    email: string
    password: string
    role: number
    address: string
  }

  let listUser = ref<Users[]>([])

  const loadUser = async () => {
    await fetchWrapper.get("user-list").then((res) => {
      listUser.value = res.data as Users[]
    })
  }

  const dialog = ref(false)
  let isEdit = ref(false)
  let editData = reactive({})
  const editUser = (user: any) => {
    dialog.value = true
    editData = user
    isEdit.value = true
  }

  const deleteConfirmationModal = ref(false)
  const setDeleteConfirmationModal = (value: boolean) => {
    deleteConfirmationModal.value = value
  }

  const dataUser = ref<Users | null>(null)
  const deleteUser = async () => {
    await fetchWrapper
      .delete(`deleteUser/${dataUser.value?.id}`)
      .then((res) => {
        createToast(res.message, {
          type: "success",
          timeout: 2000,
        })
        deleteConfirmationModal.value = false
        loadUser()
      })
  }

  const deleteButtonRef = ref(null)
  const deleteDialog = (value: any) => {
    dataUser.value = value
    deleteConfirmationModal.value = true
  }
  onMounted(() => {
    loadUser()
  })
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Users List</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div
      class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <Button
        @click="
          () => {
            dialog = true
            isEdit = false
          }
        "
        variant="primary"
        class="mr-2 shadow-md">
        Add New User
      </Button>
      <!-- <div class="hidden mx-auto md:block text-slate-500">
        Showing 1 to 10 of 150 entries
      </div>
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500">
          <FormInput
            type="text"
            class="w-56 pr-10 !box"
            placeholder="Search..." />
          <Lucide
            icon="Search"
            class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
        </div>
      </div> -->
    </div>
    <!-- BEGIN: Users Layout -->
    <div
      v-for="(user, id) in listUser"
      :key="id"
      class="col-span-12 intro-y md:col-span-6 lg:col-span-4">
      <div class="box">
        <div class="flex items-start px-5 pt-5">
          <div class="flex flex-col items-center w-full lg:flex-row">
            <div class="mt-3 text-center lg:ml-4 lg:text-left lg:mt-0">
              <a href="" class="font-medium"> {{ user.fullname }} </a>
              <div class="text-slate-500 text-xs mt-0.5">
                {{ user.role }}
              </div>
            </div>
          </div>
          <Menu class="absolute top-0 right-0 mt-3 mr-5">
            <Menu.Button tag="a" class="block w-5 h-5" href="#">
              <Lucide icon="MoreHorizontal" class="w-5 h-5 text-slate-500" />
            </Menu.Button>
            <Menu.Items class="w-40">
              <Menu.Item @click="editUser(user)">
                <Lucide icon="Edit2" class="w-4 h-4 mr-2" />
                Edit
              </Menu.Item>
              <Menu.Item @click="deleteDialog(user)">
                <Lucide icon="Trash" class="w-4 h-4 mr-2" /> Delete
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>
        <div class="p-5 text-center lg:text-left">
          <div
            class="flex items-center justify-center mt-5 lg:justify-start text-slate-500">
            <Lucide icon="Mail" class="w-3 h-3 mr-2" />
            {{ user.email }}
          </div>
          <div
            class="flex items-center justify-center mt-1 lg:justify-start text-slate-500">
            <Lucide icon="MapPin" class="w-3 h-3 mr-2" />
            {{ user.address }}
          </div>
        </div>
        <!-- <div
          class="p-5 text-center border-t lg:text-right border-slate-200/60 dark:border-darkmode-400">
          <Button variant="outline-secondary" class="px-2 py-1">
            Profile
          </Button>
        </div> -->
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

  <DialogUser
    :show-dialog="dialog"
    :editData="editData"
    :isEdit="isEdit"
    @update:close="
      () => {
        dialog = false
        loadUser()
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
          @click="deleteUser"
          ref="deleteButtonRef">
          Delete
        </Button>
      </div>
    </Dialog.Panel>
  </Dialog>
  <!-- END: Delete Confirmation Modal -->
</template>
