<script setup lang="ts">
  import _ from "lodash"
  import fakerData from "../../utils/faker"
  import { FormTextarea } from "../../base-components/Form"
  import Lucide from "../../base-components/Lucide"
  import Tippy from "../../base-components/Tippy"
  import { useRouter } from "vue-router"
  import Button from "../../base-components/Button"

  const router = useRouter()
  const backToList = () => {
    router.push({ name: "blog-list" })
  }
</script>

<template>
  <div class="flex flex-col justify-end items-end mt-8 intro-y sm:flex-row">
    <div class="flex w-full mt-10 sm:w-auto sm:mt-0">
      <Button @click="backToList" variant="primary" class="mr-2 shadow-md">
        <Lucide icon="ArrowLeft" class="w-4 h-4 mr-2" />
        Back
      </Button>
      <Button variant="primary" class="mr-2 shadow-md">
        <Lucide icon="Pencil" class="w-4 h-4 mr-2" />
        Edit
      </Button>
    </div>
  </div>
  <div class="p-5 mt-8 intro-y xl:w-full box">
    <!-- BEGIN: Blog Layout -->
    <h2 class="text-xl font-medium intro-y sm:text-2xl">
      {{ fakerData[0].news[0].title }}
    </h2>
    <div
      class="mt-3 text-xs intro-y text-slate-600 dark:text-slate-500 sm:text-sm">
      {{ fakerData[0].dates[0] }} <span class="mx-1">•</span>
    </div>
    <div class="mt-6 intro-y">
      <div class="h-[250px] md:h-[400px] image-fit">
        <img
          alt="Midone Tailwind HTML Admin Template"
          class="rounded-md"
          :src="fakerData[0].images[0]" />
      </div>
    </div>
    <div class="mt-10 leading-relaxed text-justify intro-y indent-[30px]">
      <p class="mb-5">{{ fakerData[1].news[0].content }}</p>
      <p class="mb-5">{{ fakerData[2].news[0].content }}</p>
      <p>{{ fakerData[3].news[0].content }}</p>
    </div>
    <!-- END: Blog Layout -->
  </div>
</template>
