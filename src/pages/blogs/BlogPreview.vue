<script setup lang="ts">
  import _ from "lodash"
  import fakerData from "../../utils/faker"
  import { FormTextarea } from "../../base-components/Form"
  import Lucide from "../../base-components/Lucide"
  import Tippy from "../../base-components/Tippy"
  import { useRoute, useRouter } from "vue-router"
  import Button from "../../base-components/Button"
  import fetchWrapper from "../../helper/fetch-wrapper"
  import { onMounted, ref } from "vue"

  const router = useRouter()

  interface Blog {
    id: number
    blogImage: string
    blogTitle: string
    blogDesc: string
    createdAt: Date
  }

  let detailBlog = ref<Blog>()

  const route = useRoute()
  const blogId = ref(route.params.id)

  const getImage = (val: any) => {
    return `${import.meta.env.VITE_API_URL}${val}`
  }

  const formatDate = (dateString: any) => {
    const date = new Date(dateString)
    // Then specify how you want your dates to be formatted
    return new Intl.DateTimeFormat("default", { dateStyle: "long" }).format(
      date
    )
  }

  onMounted(async () => {
    await fetchWrapper.get(`blog/${blogId.value}`).then((res) => {
      detailBlog.value = res as Blog
    })
  })

  const backToList = () => {
    router.push({ name: "blog-list" })
  }

  const editBlog = () => {
    router.push({ name: "detail-blog" })
  }
</script>

<template>
  <div class="flex flex-col justify-end items-end mt-8 intro-y sm:flex-row">
    <div class="flex w-full mt-10 sm:w-auto sm:mt-0">
      <Button @click="backToList" variant="primary" class="mr-2 shadow-md">
        <Lucide icon="ArrowLeft" class="w-4 h-4 mr-2" />
        Back
      </Button>
      <Button @click="editBlog" variant="primary" class="mr-2 shadow-md">
        <Lucide icon="Pencil" class="w-4 h-4 mr-2" />
        Edit
      </Button>
    </div>
  </div>
  <div class="p-5 mt-8 intro-y xl:w-full box">
    <!-- BEGIN: Blog Layout -->
    <h2 class="text-xl font-medium intro-y sm:text-2xl">
      {{ detailBlog?.blogTitle }}
    </h2>
    <div
      class="mt-3 text-xs intro-y text-slate-600 dark:text-slate-500 sm:text-sm">
      {{ detailBlog?.createdAt }} <span class="mx-1">•</span>
    </div>
    <div class="mt-6 intro-y">
      <div class="h-[250px] md:h-[400px] image-fit">
        <img
          alt="Midone Tailwind HTML Admin Template"
          class="rounded-md"
          :src="getImage(detailBlog?.blogImage)" />
      </div>
    </div>
    <div class="mt-10 leading-relaxed text-justify intro-y indent-[30px]">
      <p class="mb-5">{{ detailBlog?.blogDesc }}</p>
    </div>
    <!-- END: Blog Layout -->
  </div>
</template>
