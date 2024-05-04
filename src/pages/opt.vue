<script setup lang="ts">
import axios from 'axios'
import logo from '@images/logo.svg?raw'
import authV1MaskDark from '@images/pages/auth-v1-mask-dark.png'
import authV1MaskLight from '@images/pages/auth-v1-mask-light.png'
import authV1Tree2 from '@images/pages/auth-v1-tree-2.png'
import authV1Tree from '@images/pages/auth-v1-tree.png'
import { shallowRef } from 'vue'
import { useTheme } from 'vuetify'
import { VForm } from 'vuetify/lib/components/index.mjs'

import { useRouter } from 'vue-router'
import { ref, onMounted, watch } from 'vue'

import { ToastPluginApi, useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

const form = ref({
  opt: '',
  email: '',
})

const savedEmail = ref('')

// Fonction pour récupérer l'email sauvegardé dans le localStorage
const getEmailFromLocalStorage = () => {
  // Récupérer l'email sauvegardé dans le localStorage
  const email = localStorage.getItem('userEmail')
  if (email) {
    savedEmail.value = email
    savedEmail.value = savedEmail._value
    console.log('email : ', savedEmail._value)
  } else {
    savedEmail.value = '' // Si aucun e-mail n'est trouvé, mettre savedEmail à une chaîne vide
    console.log(savedEmail)
  }
}

onMounted(() => {
  showToast(
    'Consult your email address and enter the OTP message that was sent to you.',
    'info',
    'check_circle_outline',
  )
  getEmailFromLocalStorage()
})

type ToastType = 'success' | 'error' | 'info' | 'warning'
const showToast = (message: string, type: ToastType, icon: string, options: any = {}) => {
  const toast = useToast() as ToastPluginApi
  toast[type](message, {
    icon: icon,
    position: 'top-right',
    timeout: 200000,
    ...options,
  })
}

const loading = shallowRef(false)

const remember = ref(false)
const vuetifyTheme = useTheme()

const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light' ? authV1MaskLight : authV1MaskDark
})

const isPasswordVisible = ref(false)

const refForm = ref<VForm>()

const redirectToForgotPage = () => {
  // Utilisez la fonction push de l'objet router pour rediriger vers la route '/forgot'
  router.push('/login')
}

const router = useRouter()

const saveOPTStatusToLocalStorage = (response: string) => {
  localStorage.setItem('otp_validate', response)
}

const requiredValidator = (v: string) => !!v || 'This field is required'
const minLengthValidator = (v: string) => v.length > 6 || 'This field  must be at least 06 characters'
const maxLengthValidator = (v: string) => v.length < 6 || 'This field  must be at most 06 characters'

const submitForm = () => {
  if (validateForm()) {
    console.log(savedEmail._value, form.value.opt)

    axios
      .post('http://localhost:3000/api/v1/users/active_account', {
        email: savedEmail._value,
        otp: form.value.opt,
      })
      .then(response => {
        if (response.status === 200) {
          console.log(response)
          saveOPTStatusToLocalStorage('oui')
          redirectToForgotPage()
        } else {
          // Gestionnaire d'erreur pour les codes de statut autres que 200
          console.error('Server returned non-200 status:', response.status)
          showToast('Server returned non-200 status', 'error', 'error_outline')
        }
      })
      .catch(error => {
        // Gestionnaire d'erreur pour les erreurs de requête
        console.error('Error occurred during request:', error)
        showToast('Error occurred during request', 'error', 'error_outline')
      })
  } else {
    alert('donnees abscentes')
  }
}

const validateForm = () => {
  if (!requiredValidator(form.value.opt)) {
    return 'OPT is required'
  } else if (!minLengthValidator(form.value.opt)) {
    return 'OPT must be at least 6 characters'
  } else if (!maxLengthValidator(form.value.opt)) {
    return 'OPT must be at most 6 characters'
  } else {
    return true // Form is valid
  }
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

        <VCardTitle class="font-weight-semibold text-2xl text-uppercase"> Materio </VCardTitle>
      </VCardItem>

      <VCardText class="pt-2">
        <h5 class="text-h5 font-weight-semibold mb-1 text-center">OPT Confirm! 💬</h5>
        <p class="mb-0">Please enter your opt confirm that you are receiving</p>
      </VCardText>

      <VCardText>
        <VForm
          ref="refForm"
          @submit.prevent="submitForm"
        >
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <v-otp-input
                length="6"
                v-model="form.opt"
                focus-all
                :loading="loading"
                focused
              >
              </v-otp-input>
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <!-- login button -->
              <VBtn
                block
                :disabled="form.opt.length <= 5 || loading"
                type="submit"
              >
                Confirm OPT
              </VBtn>
            </VCol>

            <!-- create account -->
            <VCol
              cols="12"
              class="text-center text-base"
            >
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
