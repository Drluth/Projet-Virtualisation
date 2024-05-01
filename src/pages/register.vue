<script setup lang="ts">
import { useTheme } from 'vuetify'
import { VForm } from 'vuetify/components/VForm'

import logo from '@images/logo.svg?raw'
import authV1MaskDark from '@images/pages/auth-v1-mask-dark.png'
import authV1MaskLight from '@images/pages/auth-v1-mask-light.png'
import authV1Tree2 from '@images/pages/auth-v1-tree-2.png'
import authV1Tree from '@images/pages/auth-v1-tree.png'


import 'vue-toast-notification/dist/theme-sugar.css'




const form = ref({
  fullname: '',
  email: '',
  password: '',
  confirmpassword: '',
  phoneNumber: '',
  fileUpload:  null as File | null,
  photo: null as File | null,
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

const requiredFileValidator = (value: File | null) => !!value || 'This file is required';
const fileMimeTypeValidatorCV = (value: File | null) => !value || value.type != 'application/pdf' || 'This file is not an pdf file';
const fileMimeTypeValidatorPhoto = (value: File | null) => !value || !['image/png', 'image/jpg', 'image/jpeg'].includes(value.type) || 'This file is not an image file';

const maxSizeCV = 3000000;  
const maxSizePhoto = 2000000; // 2 Mo 
const fileMaxSizeValidatorPhoto = (value: File | null) => !value || value.size > maxSizePhoto || 'This file size should be less than 2MB';
const fileMaxSizeValidatorCV = (value: File | null) => !value || value.size > maxSizeCV || 'This file size should be less than 3MB';



const passwordMatchValidator = (v: any, t: any) => v === t || 'Passwords do not match';
const minLengthAndExactLengthAndPrefixValidator = (v: string) => {
  if (v.length !== 12) {
    return 'This field must be exactly 12 characters long';
  }
  if (!v.startsWith('2376')) {
    return 'This field must start with "2376"';
  }
  return true;
};


const submitForm = () => {
  
  const formData = {
    fullname: form.value.fullname,
    email: form.value.email,
    password: form.value.password,
    confirmpassword: form.value.confirmpassword,
    phoneNumber: form.value.phoneNumber,
    fileUpload: form.value.fileUpload,
    photo: form.value.photo,
  };

  if (validateForm()) {
    // sendDataToServer(formData);
  } else {
    console.log(formData);
  }
}

      // Ajoutez ici le  pour gérer les erreurs de soumission du formulaire


const validateForm = () => {
  const fullnameValidations = [
    requiredValidator(form.value.fullname),
    minLengthValidator(form.value.fullname),
    maxLengthValidator(form.value.fullname)
  ];
  const fullnameIsValid = fullnameValidations.every(result => result === true);

  const emailValidations = [
    requiredValidator(form.value.email),
    emailValidator(form.value.email)
  ];
  const emailIsValid = emailValidations.every(result => result === true);

  const phoneNumberValidations = [
    requiredValidator(form.value.phoneNumber),
    minLengthAndExactLengthAndPrefixValidator(form.value.phoneNumber)
  ];
  const phoneNumberIsValid = phoneNumberValidations.every(result => result === true);

  const passwordValidations = [
    requiredValidator(form.value.password),
    minLengthValidator(form.value.password)
  ];
  const passwordIsValid = passwordValidations.every(result => result === true);

  const confirmPasswordValidations = [
    requiredValidator(form.value.confirmpassword),
    minLengthValidator(form.value.confirmpassword),
    passwordMatchValidator(form.value.confirmpassword, form.value.password)
  ];
  const confirmPasswordIsValid = confirmPasswordValidations.every(result => result === true);

  // Vérifier si toutes les règles de validation sont respectées
  return (
    fullnameIsValid &&
    emailIsValid &&
    phoneNumberIsValid &&
    passwordIsValid &&
    confirmPasswordIsValid
  );
};
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
        <VForm ref="refForm" @submit.native.prevent="submitForm">
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
                :rules="[requiredValidator, minLengthValidator, maxLengthValidator]"
                
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
                 :rules="[requiredValidator]"

              />
            </VCol>

            
            <VCol cols="12" sm="6">
              <VFileInput 
                v-model="form.photo"
                prepend-inner-icon="ri-camera-line" 
                prepend-icon="" accept="image/jpg, image/jpeg, image/jpeg" 
                label="Profile Picture" 
                show-size 
                counter 
                :rules="[requiredFileValidator, fileMimeTypeValidatorPhoto]" 
              />
            </VCol>

            <VCol cols="12" sm="6">
              <VFileInput 
              v-model="form.fileUpload"
              prepend-inner-icon="ri-file-pdf-2-line" 
              prepend-icon="" 
              accept="application/pdf" 
              label="Curriculum Vita" 
              :rules="[requiredFileValidator, fileMimeTypeValidatorCV]"  
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
