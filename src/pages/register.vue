<script setup lang="ts">
import { useTheme } from 'vuetify'
import { useRouter } from 'vue-router'
import { VForm } from 'vuetify/components/VForm'
import axios from 'axios'
import logo from '@images/logo.svg?raw'
import authV1MaskDark from '@images/pages/auth-v1-mask-dark.png'
import authV1MaskLight from '@images/pages/auth-v1-mask-light.png'
import authV1Tree2 from '@images/pages/auth-v1-tree-2.png'
import authV1Tree from '@images/pages/auth-v1-tree.png'
import { ref, onMounted, watch } from 'vue'

import { ToastPluginApi, useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

import { getStorage, getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage'
const storage = getStorage()
const router = useRouter()

const redirectToForgotPage = () => {
  // Utilisez la fonction push de l'objet router pour rediriger vers la route '/forgot'
  router.push('/opt')
}

const resetForm = () => {
  // Reset each form field to empty string or default value
  form.value.fullname = '';
  form.value.email = '';
  form.value.password = '';
  form.value.confirmpassword = '';
  form.value.phoneNumber = '';
  form.value.fileUpload = [];
  form.value.photo = [];
};

const uploadFileToFirebase = async (file: File) => {
  try {
    // Utilisez la référence du service de stockage Firebase obtenue dans main.ts
    const storageReference = storageRef(storage, `uploads/${file.name}`)
    const snapshot = await uploadBytes(storageReference, file)
    console.log('Fichier téléversé avec succès:', snapshot.metadata.fullPath)
    const downloadURL = await getDownloadURL(storageReference) // Appel de getDownloadURL avec la référence de stockage
    return downloadURL
  } catch (error) {
    console.error('Erreur lors du téléversement du fichier:', error)
    throw error
  }
}

const handleFileUploadCv: (event: Event) => Promise<void> = async event => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  try {
    const downloadURL = await uploadFileToFirebase(file)
    console.log('URL de téléchargement du fichier:', downloadURL)
    form.value.fileUpload = downloadURL // Mettre à jour form.fileUpload
    showToast('Cv taken successfully.', 'success', 'check_circle_outline')
  } catch (error) {
    showToast('Cv could not be supported.', 'error', 'error_outline')
    console.error('Erreur lors du téléversement du fichier vers Firebase:', error)
  }
}

const handleFileUploadPhoto: (event: Event) => Promise<void> = async event => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  try {
    const downloadURL = await uploadFileToFirebase(file)
    console.log('URL de téléchargement du fichier:', downloadURL)
    showToast('Photo taken successfully.', 'success', 'check_circle_outline')
    form.value.photo = downloadURL // Mettre à jour form.photo
  } catch (error) {
    showToast('Photo could not be supported.', 'error', 'error_outline')
    form.value.photo = ''
    console.error('Erreur lors du téléversement du fichier vers Firebase:', error)
  }
}

type ToastType = 'success' | 'error' | 'info' | 'warning'
const showToast = (message: string, type: ToastType, icon: string, options: any = {}) => {
  const toast = useToast() as ToastPluginApi
  toast[type](message, {
    icon: icon,
    position: 'top-right',
    timeout: 12000,
    ...options,
  })
}

const form = ref({
  fullname: '',
  email: '',
  password: '',
  confirmpassword: '',
  phoneNumber: '',
  fileUpload: [], // Modifier en tant que tableau
  photo: [],
})

const vuetifyTheme = useTheme()

const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light' ? authV1MaskLight : authV1MaskDark
})

const privacyPolicies = ref(false)
const isPasswordVisible = ref(false)
const isPasswordVisible1 = ref(false)

const refForm = ref<VForm>()

const requiredValidator = (v: string) => !!v || 'This field is required'
const emailValidator = (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid'
const minLengthValidator = (v: string) => v.length >= 5 || 'This field  must be at least 05 characters'
const maxLengthValidator = (v: string) => v.length <= 50 || 'This field  must be at most 50 characters'

const requiredFileValidator = (value: File | null) => !!value || 'This file is required'
const fileMimeTypeValidatorCV = (value: File | null) =>
  !value || value.type != 'application/pdf' || 'This file is not an pdf file'
const fileMimeTypeValidatorPhoto = (value: File | null) =>
  !value || !['image/png', 'image/jpg', 'image/jpeg'].includes(value.type) || 'This file is not an image file'

const maxSizeCV = 3000000
const maxSizePhoto = 2000000 // 2 Mo
const fileMaxSizeValidatorPhoto = (value: File | null) =>
  !value || value.size > maxSizePhoto || 'This file size should be less than 2MB'
const fileMaxSizeValidatorCV = (value: File | null) =>
  !value || value.size > maxSizeCV || 'This file size should be less than 3MB'
const passwordMatchValidator = (v: any, t: any) => v === t || 'Passwords do not match'
const minLengthAndExactLengthAndPrefixValidator = (v: string) => {
  if (v.length !== 12) {
    return 'This field must be exactly 12 characters long'
  }
  if (!v.startsWith('2376')) {
    return 'This field must start with "2376"'
  }
  return true
}

const saveEmailToLocalStorage = (email: string) => {
  localStorage.setItem('userEmail', email);
};

const submitForm = (event: Event) => {
  event.preventDefault()
  const formData = {
    fullname: form.value.fullname,
    email: form.value.email,
    password: form.value.password,
    confirmpassword: form.value.confirmpassword,
    phoneNumber: form.value.phoneNumber,
    fileUpload: form.value.fileUpload,
    photo: form.value.photo,
  }

  if (validateForm()) {
    axios
      .post('http://localhost:3000/api/v1/users/add', {
        fullname: form.value.fullname,
        email: form.value.email,
        password: form.value.password,
        confirmpassword: form.value.confirmpassword,
        phoneNumber: form.value.phoneNumber,
        fileUpload: form.value.fileUpload,
        photo: form.value.photo,
      })
      .then(
        response => {
          if (response.status === 200) {
            console.log(response)
            saveEmailToLocalStorage(response.data.newUser.email);
            redirectToForgotPage();
            setTimeout(() => {
              resetForm();
            }, 3000);
          } else {
            showToast('Server unavailable please check again later.', 'warning', 'error_outline')
          }
        },
        error => {
          showToast('Missing or incorrect information.', 'error', 'error_outline')
        },
      )
    console.log(formData)
  } else {
    showToast('Missing or incorrect information.', 'error', 'error_outline')
  }
}

// Ajoutez ici le  pour gérer les erreurs de soumission du formulaire

const validateForm = () => {
  const fullnameValidations = [
    requiredValidator(form.value.fullname),
    minLengthValidator(form.value.fullname),
    maxLengthValidator(form.value.fullname),
  ]
  const fullnameIsValid = fullnameValidations.every(result => result === true)

  const emailValidations = [requiredValidator(form.value.email), emailValidator(form.value.email)]
  const emailIsValid = emailValidations.every(result => result === true)

  const phoneNumberValidations = [
    requiredValidator(form.value.phoneNumber),
    minLengthAndExactLengthAndPrefixValidator(form.value.phoneNumber),
  ]
  const phoneNumberIsValid = phoneNumberValidations.every(result => result === true)

  const passwordValidations = [requiredValidator(form.value.password), minLengthValidator(form.value.password)]
  const passwordIsValid = passwordValidations.every(result => result === true)

  // Vérifier si toutes les règles de validation sont respectées
  return fullnameIsValid && emailIsValid && phoneNumberIsValid && passwordIsValid
}
</script>

<template>
  <!-- eslint-disable vue/no-v-html -->

  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-4 pt-7"
      max-width="800"
    >
      <VCardItem class="justify-center">
        <template #prepend>
          <div class="d-flex">
            <div v-html="logo" />
          </div>
        </template>

        <VCardTitle class="font-weight-semibold text-2xl text-uppercase"> Materio </VCardTitle>
      </VCardItem>

      <VCardText class="pt-2 text-center">
        <h5 class="text-h5 font-weight-semibold mb-1">Adventure starts here 🚀</h5>
        <p class="mb-0">Make your app management easy and fun!</p>
      </VCardText>

      <VCardText>
        <VForm
          ref="refForm"
          @submit.prevent="submitForm"
        >
          <VRow>
            <!-- fullname -->
            <VCol cols="12">
              <VTextField
                v-model="form.fullname"
                prepend-inner-icon="ri-user-line"
                label="fullname"
                placeholder="Nanyang Brice"
                :rules="[requiredValidator, minLengthValidator, maxLengthValidator]"
              />
            </VCol>
            <!-- email -->
            <VCol
              cols="12"
              sm="6"
            >
              <VTextField
                v-model="form.email"
                prepend-inner-icon="ri-mail-line"
                label="Email"
                placeholder="nanyangbrice@gmail.com"
                type="email"
                :rules="[requiredValidator, emailValidator]"
              />
            </VCol>

            <!-- password -->
            <VCol
              cols="12"
              sm="6"
            >
              <VTextField
                v-model="form.phoneNumber"
                prepend-inner-icon="ri-smartphone-line"
                label="Mobile"
                modelvalue="2376"
                placeholder="237657807309"
                type="number"
                :rules="[requiredValidator, minLengthAndExactLengthAndPrefixValidator]"
                class=""
              />
            </VCol>

            <VCol
              cols="12"
              sm="6"
            >
              <VTextField
                v-model="form.password"
                prepend-inner-icon="ri-lock-line"
                label="Password"
                placeholder="············"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
                :rules="[
                  requiredValidator,
                  minLengthValidator,
                  maxLengthValidator,
                  () => passwordMatchValidator(form.confirmpassword, form.password),
                ]"
              />
            </VCol>

            <VCol
              cols="12"
              sm="6"
            >
              <VTextField
                v-model="form.confirmpassword"
                prepend-inner-icon="ri-lock-line"
                label="Confirm Password"
                placeholder="············"
                :type="isPasswordVisible1 ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible1 ? 'ri-eye-off-line' : 'ri-eye-line'"
                @click:append-inner="isPasswordVisible1 = !isPasswordVisible1"
                :rules="[
                  requiredValidator,
                  minLengthValidator,
                  maxLengthValidator,
                  () => passwordMatchValidator(form.confirmpassword, form.password),
                ]"
              />
            </VCol>

            <VCol
              cols="12"
              sm="6"
            >
              <VFileInput
                v-model="form.photo"
                prepend-inner-icon="ri-camera-line"
                prepend-icon=""
                accept="image/jpg, image/jpeg, image/jpeg"
                label="Profile Picture"
                show-size
                counter
                :rules="[requiredFileValidator, fileMimeTypeValidatorPhoto]"
                @change="handleFileUploadPhoto"
              />
            </VCol>

            <VCol
              cols="12"
              sm="6"
            >
              <VFileInput
                prepend-inner-icon="ri-file-pdf-2-line"
                prepend-icon=""
                accept="application/pdf"
                label="Curriculum Vitae"
                show-size
                counter
                :rules="[requiredFileValidator, fileMimeTypeValidatorCV]"
                @change="handleFileUploadCv"
              />
            </VCol>

            <VCol cols="12">
              <VBtn
                block
                type="submit"
              >
                Sign up
              </VBtn>
            </VCol>

            <!-- login instead -->
            <VCol
              cols="12"
              class="text-center text-base"
            >
              <span>Already have an account?</span>
              <RouterLink
                class="text-primary ms-2"
                to="login"
              >
                Sign in instead
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
@use '@core/scss/template/pages/page-auth.scss';
</style>
