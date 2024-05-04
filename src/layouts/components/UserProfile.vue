<script setup lang="ts">
import avatar1 from '@images/avatars/avatar-1.png'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const account = JSON.parse(localStorage.getItem('account') || '{}') || {}

const accountData = {
  avatarImg: account.photo || avatar1,
  fullname: account.fullname || '',
}

const router = useRouter()

const accountDataLocal = ref(structuredClone(accountData))


const logout = () => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to log out?',
    icon: 'warning',
    showCancelButton: true,
    cancelButtonColor: '#d33',
    confirmButtonText: 'Continue'
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem('account');
      Swal.fire({
        title: 'Logged Out!',
        text: 'You have been logged out successfully.',
        showConfirmButton: true,
        confirmButtonText: 'Continue'
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/');
        }
      });
    }
  });
};


</script>

<template>
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    color="success"
    bordered
  >
    <VAvatar
      class="cursor-pointer"
      color="primary"
      variant="tonal"
    >
      <VImg :src="account.photo" />

      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="230"
        location="bottom end"
        offset="14px"
      >
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <VAvatar
                    color="primary"
                    variant="tonal"
                  >
                    <VImg :src="account.photo" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ account.fullname }}
            </VListItemTitle>
            <VListItemSubtitle>User</VListItemSubtitle>
          </VListItem>
          <VDivider class="my-2" />

          <!-- 👉 Logout -->
          <VListItem to="/login">
            <template #prepend>
              <VIcon
                class="me-2"
                icon="ri-logout-box-r-line"
                size="22"
              />
            </template>

            <VListItemTitle @click="logout">Logout</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
