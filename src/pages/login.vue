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

  const form = ref({
    email: '',
    password: '',
  });

  

  const otpStatus = ref('')

  const getOTPStatusFromLocalStorage = () => {
    const otpValue = localStorage.getItem('otp_validate');
    otpStatus.value = otpValue || '';
    console.log('otpStatus : ', otpStatus.value);
  }

  const remember = ref(false)
  const isFormValid = ref(false);

const vuetifyTheme = useTheme()

const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light' ? authV1MaskLight : authV1MaskDark
})


  const isPasswordVisible = ref(false)

  const refForm = ref<VForm>()

  const requiredValidator = (v: string) => !!v || 'This field is required'
  const emailValidator = (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid'
  const minLengthValidator = (v: string) => v.length >= 6 || 'This field must be at least 6 characters'
  const maxLengthValidator = (v: string) => v.length <= 20 || 'This field must be at most 20 characters'

  type ToastType = 'success' | 'error' | 'info' | 'warning';

  const showToast = (message: string, type: ToastType, icon: string, options: any = {}) => {
    const toast = useToast() as ToastPluginApi
    toast[type](message, {
      icon: icon,
      position: 'top-right',
      timeout: 5000,
      ...options
    })
  }

  const saveEmailToLocalStorage = (account: string, token: any) => {
    localStorage.setItem('token', token);
    localStorage.setItem('account', JSON.stringify(account));
  };

  const redirectToForgotPage = () => {
    router.push('/opt')
  }

  const submitForm = (event: Event) => {
    event.preventDefault();
    const formData = {
      email: form.value.email,
      password: form.value.password,
    };

    if (form.value.email && form.value.password) {
      if (validateForm()) {
        axios
          .post('http://localhost:3000/api/v1/users/login', {
            email: form.value.email,
            password: form.value.password,
          })
          .then(
            response => {
              if (response.status === 200) {
                console.log(response);
                saveEmailToLocalStorage(response.data.user, response.data.token);
                showToast('Succeful login.', 'info', 'check_circle_outline');
                router.push('/home')
              } else {
                showToast('Server unavailable please check again later.', 'warning', 'error_outline');
              }
            },
            error => {
              showToast('Missing or incorrect information.', 'error', 'error_outline');
            },
          );
        console.log(formData);
      } else {
        showToast('Missing or incorrect information.', 'error', 'error_outline');
      }
    } else {
      showToast('Missing or incorrect information.', 'error', 'error_outline');
    }
  };

  const validateForm = () => {
    return (
      requiredValidator(form.value.email) &&
      emailValidator(form.value.email) &&
      requiredValidator(form.value.password) &&
      minLengthValidator(form.value.password) &&
      maxLengthValidator(form.value.password)
    );
  };

  const sendDataToServer = () => {
    console.log('Form data:', form.value)
  }

  const router = useRouter()

  onMounted(() => {
    getOTPStatusFromLocalStorage();

    setTimeout(() => {
      localStorage.setItem('otp_validate', '');
    }, 5000);
  });

</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard class="auth-card pa-4 pt-7" max-width="448">
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

      <VCardText class="pt-2 text-center">
        <h5 class="text-h5 font-weight-semibold mb-1">
          Welcome to Materio! 👋🏻
        </h5>
        <p class="mb-0">
          Please sign-in to your account and start the adventure
        </p>
      </VCardText>

      <VCardText>
        <VForm ref="refForm" @submit.prevent="submitForm">
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <VTextField v-model="form.email" prepend-inner-icon="ri-mail-line" placeholder="nanyangbrice@gmail.com"
                label="Email" type="email" :rules="[requiredValidator, emailValidator]" />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField v-model="form.password" prepend-inner-icon="ri-lock-line" label="Password"
                placeholder="············" :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
                :rules="[requiredValidator, minLengthValidator, maxLengthValidator]" />

              <!-- remember me checkbox -->
              <div class="d-flex align-center justify-space-between flex-wrap mt-1 mb-4">
                <VCheckbox v-model="remember" label="Remember me" />

                <RouterLink class="ms-2 mb-1" to="/forgot">
                  Forgot Password?
                </RouterLink>
              </div>

              <!-- login button -->
              <VBtn block type="submit">
                Login
              </VBtn>
            </VCol>

            <!-- create account -->
            <VCol cols="12" class="text-center text-base">
              <span>New on our platform?</span>
              <RouterLink class="text-primary ms-2" to="/register">
                Create an account
              </RouterLink>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>

    <VImg class="auth-footer-start-tree d-none d-md-block" :src="authV1Tree" :width="250" />

    <VImg :src="authV1Tree2" class="auth-footer-end-tree d-none d-md-block" :width="350" />

    <!-- bg img -->
    <VImg class="auth-footer-mask d-none d-md-block" :src="authThemeMask" />
  </div>
</template>

<style lang="scss">
  @use "@core/scss/template/pages/page-auth.scss";
</style>
