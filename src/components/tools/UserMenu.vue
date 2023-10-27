<template>
    <div class="user-wrapper">
      <div class="content-box">
        <a-dropdown>
          <span class="action ant-dropdown-link user-dropdown-menu">
            <a-avatar class="avatar" size="small" :src="avatar()"/>
            <span>{{ nickname() }}</span>
          </span>
          <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
            <a-menu-item key="1">
              <router-link :to="{ name: 'settings' }">
                <a-icon type="setting"/>
                <span>Cài đặt tài khoản</span>
              </router-link>
            </a-menu-item>
            <a-menu-divider/>
            <a-menu-item key="3">
              <a href="javascript:;" @click="handleLogout">
                <a-icon type="logout"/>
                <span>Đăng xuất</span>
              </a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>
  </template>
  
  <script>
  import { mapActions, mapGetters } from 'vuex'
  
  export default {
    name: 'UserMenu',
    methods: {
      ...mapActions(['Logout']), // Xóa thông tin trong token và localStorage
      ...mapGetters(['nickname', 'avatar']), 
        // Lấy biệt danh và hình đại diện của người dùng từ các biến toàn cục
      handleLogout () {
        const that = this
  
        this.$confirm({
          title: 'Thông báo',
          content: 'Bạn có thực sự muốn đăng xuất ?',
          onOk () {
            return that.Logout({}).then(() => {
              window.location.reload()
            }).catch(err => {
              that.$message.error({
                title: 'Lỗi !!',
                description: err.message
              })
            })
          },
          onCancel () {
          }
        })
      }
    }
  }
  </script>
  