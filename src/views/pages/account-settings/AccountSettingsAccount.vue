<script lang="ts" setup>
import avatar1 from '@images/avatars/avatar-1.png'



import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const account = JSON.parse(localStorage.getItem('account') || '{}') || {}

const accountData = {
  avatarImg: account.photo || avatar1,
  fullname: account.fullname || '',
  email: account.email || '',
  phone: account.phoneNumber || '',
  cv: account.phone || '',
}

const refInputEl = ref<HTMLElement>()

const accountDataLocal = ref(structuredClone(accountData))
const isAccountDeactivated = ref(false)

const resetForm = () => {
  accountDataLocal.value = structuredClone(accountData)
}


onMounted(() => {
  if (!account.email || account.email === '') {
    router.push('/login')
  }
})

// changeAvatar function
const changeAvatar = (file: Event) => {
  const fileReader = new FileReader()
  const { files } = file.target as HTMLInputElement

  if (files && files.length) {
    fileReader.readAsDataURL(files[0])
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string')
        accountDataLocal.value.avatarImg = fileReader.result
    }
  }
}

// reset avatar image
const resetAvatar = () => {
  accountDataLocal.value.avatarImg = accountData.avatarImg
}

const openPDFInNewTab = () => {
  window.open(account.fileUpload, '_blank')
}




</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Account Details">
        <VCardText class="d-flex">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded="lg"
            size="100"
            class="me-6"
            :image="accountDataLocal.avatarImg"
          />

          <!-- 👉 Upload Photo -->
          <form class="d-flex flex-column justify-center gap-5">
            <div class="d-flex flex-wrap gap-2">
              <VBtn
                color="primary"
                @click="refInputEl?.click()"
              >
                <VIcon
                  icon="ri-upload-cloud-line"
                  class="d-sm-none"
                />
                <span class="d-none d-sm-block">Upload new photo</span>
              </VBtn>

              <input
                ref="refInputEl"
                type="file"
                name="file"
                accept=".jpeg,.png,.jpg,GIF"
                hidden
                @input="changeAvatar"
              >

              <VBtn
                type="reset"
                color="error"
                variant="outlined"
                @click="resetAvatar"
              >
                <span class="d-none d-sm-block">Reset</span>
                <VIcon
                  icon="ri-refresh-line"
                  class="d-sm-none"
                />
              </VBtn>
            </div>

            <p class="text-body-1 mb-0">
              Allowed JPG, JPEG or PNG. Max size of 2Mo
            </p>
          </form>
        </VCardText>

        <VDivider />

        <VCardText>
          <!-- 👉 Form -->
          <VForm class="mt-6">
            <VRow>
              <!-- 👉 First Name -->
              <VCol
                md="4"
                cols="12"
              >
                <VTextField
                  v-model="accountDataLocal.fullname"
                  placeholder="John"
                  label="Full Name"
                  readonly
                />
              </VCol>


              <!-- 👉 Email -->
              <VCol
                cols="12"
                md="4"
              >
                <VTextField
                  v-model="accountDataLocal.email"
                  label="E-mail"
                  placeholder="johndoe@gmail.com"
                  type="email"
                  readonly
                />
              </VCol>

              <!-- 👉 Phone -->
              <VCol
                cols="12"
                md="4"
              >
                <VTextField
                  v-model="accountDataLocal.phone"
                  label="Phone Number"
                  placeholder="+1 (917) 543-9876"
                  readonly
                />
              </VCol>

              
              <!-- 👉 Form Actions -->
              <VCol
                cols="12"
                class="d-flex flex-wrap gap-4"
              >
                <VBtn style="margin-left:auto" @click="openPDFInNewTab">Consult Curriculum Vitae</VBtn>

              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
