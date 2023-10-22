<script setup lang="ts">
  import DarkModeSwitcher from "../components/DarkModeSwitcher"
  import MainColorSwitcher from "../components/MainColorSwitcher"
  import logoUrl from "../assets/images/logo.svg"
  import illustrationUrl from "../assets/images/illustration.svg"
  import { FormInput, FormCheck } from "../base-components/Form"
  import Button from "../base-components/Button"
  import { useAuthStore } from "../stores/auth.store"
  import { createToast } from "mosha-vue-toastify"
  import Lucide from "../base-components/Lucide"
  import { ref } from "vue"

  const authStore = useAuthStore()

  interface FormInput {
    email?: string
    password?: string
  }

  const formData = FormInput

  const onSubmit = async () => {
    try {
      const res = await authStore.login(formData.email, formData.password)
      await authStore.getUserWithToken()
      createToast("Login Success", {
        type: "success",
        timeout: 2000,
      })
    } catch (error: any) {
      createToast(error.response.data.error || error.message, {
        type: "danger",
        timeout: 2000,
      })
    }
  }

  const isShow = ref(false)
  const showPassword = () => {
    isShow.value = !isShow.value
  }
</script>

<template>
  <!-- <div
    :class="[
      '-m-3 sm:-mx-8 p-3 sm:px-8 relative h-screen lg:overflow-hidden bg-primary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600',
      'before:hidden before:xl:block before:content-[\'\'] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400',
      'after:hidden after:xl:block after:content-[\'\'] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700',
    ]"> -->
  <div
    class="bck-image grid justify-items-center h-screen lg:overflow-hidden bg-cover bg-no-repeat overflow-hidden dark:bg-darkmode-800 xl:dark:bg-darkmode-600">
    <!-- <DarkModeSwitcher />
    <MainColorSwitcher /> -->
    <div class="grid justify-items-center content-center">
      <div
        class="container grid h-fit content-center justify-items-center z-10 sm:px-10 max-w-xl p-6 bg-[#f1f1f1ce] border rounded-lg shadow dark:bg-darkmode-300 xl:dark:bg-darkmode-300">
        <!-- <div> -->
        <!-- BEGIN: Login Info -->
        <!-- <div class="flex-col hidden min-h-screen xl:flex">
          <a href="" class="flex items-center pt-5 -intro-x">
            <img
              alt="Midone Tailwind HTML Admin Template"
              class="w-6"
              :src="logoUrl" />
            <span class="ml-3 text-lg text-white"> Rubick </span>
          </a>
          <div class="my-auto">
            <img
              alt="Midone Tailwind HTML Admin Template"
              class="w-1/2 -mt-16 -intro-x"
              :src="illustrationUrl" />
            <div
              class="mt-10 text-4xl font-medium leading-tight text-white -intro-x">
              A few more clicks to <br />
              sign in to your account.
            </div>
            <div
              class="mt-5 text-lg text-white -intro-x text-opacity-70 dark:text-slate-400">
              Manage all your e-commerce accounts in one place
            </div>
          </div>
        </div> -->
        <!-- END: Login Info -->
        <!-- </div> -->
        <!-- BEGIN: Login Form -->
        <form
          @submit.prevent="onSubmit"
          class="grid gap-4 content-center justify-items-center items-center py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
          <div class="mb-4 grid justify-items-center">
            <img class="w-44 bg-black" src="../assets/images/logo-dark-2.png" />

            <h2
              class="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">
              Sign In
            </h2>
          </div>
          <!-- w-full flex flex-col items-center justify-center px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto -->
          <div class="grid items-center justify-items-center content-center">
            <div class="intro-x">
              <FormInput
                v-model="FormInput.email"
                type="text"
                class="block px-4 py-3 intro-x login__input min-w-full xl:min-w-[350px]"
                placeholder="Email" />
              <div style="position: relative">
                <FormInput
                  v-model="FormInput.password"
                  :type="isShow ? 'text' : 'password'"
                  class="block px-4 py-3 mt-4 intro-x login__input min-w-full xl:min-w-[350px]"
                  placeholder="Password" />

                <button class="showPassword" @click.stop.prevent="showPassword">
                  <Lucide
                    :icon="isShow ? 'Eye' : 'EyeOff'"
                    class="w-4 h-4 mr-2" />
                </button>
              </div>
            </div>
            <!-- <div
              class="flex mt-4 text-xs intro-x text-slate-600 dark:text-slate-500 sm:text-sm">
              <div class="flex items-center mr-auto">
                <FormCheck.Input
                  id="remember-me"
                  type="checkbox"
                  class="mr-2 border" />
                <label class="cursor-pointer select-none" htmlFor="remember-me">
                  Remember me
                </label>
              </div>
              <a href="">Forgot Password?</a>
            </div> -->
            <div class="mt-5 text-center intro-x xl:mt-8 xl:text-left">
              <Button
                variant="primary"
                class="w-full px-4 py-3 align-top xl:w-32 xl:mr-3">
                Login
              </Button>
              <!-- <Button
                  variant="secondary"
                  class="w-full px-4 py-3 mt-3 align-top xl:w-32 xl:mt-0">
                  Register
                </Button> -->
            </div>
          </div>
        </form>
        <!-- END: Login Form -->
      </div>
    </div>
  </div>
</template>

<style scoped>
  .bck-image {
    background-image: url("../assets/images/d2.jpg");
    background-size: cover;
    box-shadow: inset 0 0 0 2000px rgba(51, 51, 51, 0.3);
  }

  .showPassword {
    position: absolute;
    top: 0;
    right: 0;
    margin-top: 15px;
    z-index: 1000;
  }
</style>
