<script setup lang="ts">
import { useTheme } from 'vuetify'

import logo from '@images/logo.svg?raw'
import authV1MaskDark from '@images/pages/auth-v1-mask-dark.png'
import authV1MaskLight from '@images/pages/auth-v1-mask-light.png'
import authV1Tree2 from '@images/pages/auth-v1-tree-2.png'
import authV1Tree from '@images/pages/auth-v1-tree.png'
import { VForm } from 'vuetify/lib/components/index.mjs'

const form = ref({
  email: '',
  password: '',
});

const remember = ref(false)

const vuetifyTheme = useTheme()

const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light'
    ? authV1MaskLight
    : authV1MaskDark
})

const isPasswordVisible = ref(false)

const refForm = ref<VForm>()

const requiredValidator = (v: string) => !!v || 'This field is required'
const emailValidator = (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid'
const minLengthValidator = (v: string) => v.length >= 8 || 'This field  must be at least 8 characters'
const maxLengthValidator = (v: string) => v.length <= 20 || 'This field  must be at most 20 characters'

const submitForm = () => {
  if (validateForm()) {
    console.log("Data "+ form.value)
    sendDataToServer()
  } else {
    alert('Veuillez remplir tous les champs requis correctement.')
  }
}

const validateForm = () => {
  return (
    requiredValidator(form.value.email) &&
    emailValidator(form.value.email) &&
    requiredValidator(form.value.password) &&
    minLengthValidator(form.value.password) &&
    maxLengthValidator(form.value.password)
  )
}

const sendDataToServer = () => {
  console.log('Form data:', form.value)
}

</script>

<template>
  <!-- eslint-disable vue/no-v-html -->

  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-4 pt-7"
      max-width="448"
    >
      <VCardItem class="justify-center">
        <template #prepend>
          <div class="d-flex">
            <div v-html="logo" />
          </div>
        </template>

        <VCardTitle class="font-weight-semibold text-2xl text-uppercase">
          Materio
        </VCardTitle>
      </VCardItem>

      <VCardText class="pt-2">
        <h5 class="text-h5 font-weight-semibold mb-1">
          Reset Password ! 🔒
        </h5>
        <p class="mb-0">
          If you've forgotten your password, click to reset it.
        </p>
      </VCardText>

      <VCardText>
        <VForm ref="refForm" @submit.prevent="submitForm">
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <VTextField
                v-model="form.email"
                prepend-inner-icon="ri-mail-line"
                placeholder="nanyangbrice@gmail.com"
                label="Email"
                type="email"
                :rules="[requiredValidator, emailValidator]"
              />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <!-- login button -->
              <VBtn
                block
                type="submit"
              >
                Reset Password
              </VBtn>
            </VCol>

            <!-- create account -->
            <VCol
              cols="12"
              class="text-center text-base"
            >
              <span>Are you remember your password?</span>
              <RouterLink
                class="text-primary ms-2"
                to="/"
              >
                sign in now.
              </RouterLink>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>

    <VImg
      class="auth-footer-start-tree d-none d-md-block"
      :src="authV1Tree"
      :width="250"
    />

    <VImg
      :src="authV1Tree2"
      class="auth-footer-end-tree d-none d-md-block"
      :width="350"
    />

    <!-- bg img -->
    <VImg
      class="auth-footer-mask d-none d-md-block"
      :src="authThemeMask"
    />
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
