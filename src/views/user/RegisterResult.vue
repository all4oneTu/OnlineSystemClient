<template>
    <result
      :isSuccess="true"
      :content="false"
      :title="email"
      :description="description">
  
      <template slot="action">
        <a-button size="large" type="primary">Kiểm tra hộp thư của bạn</a-button>
        <a-button size="large" style="margin-left: 8px" @click="goHomeHandle">Trở về trang chủ</a-button>
      </template>
  
    </result>
  </template>
  
  <script>
  import { Result } from '../../components'
  
  export default {
    name: 'RegisterResult',
    components: {
      Result
    },
    data () {
      return {
        description: 'Email kích hoạt đã được gửi đến hộp thư của bạn và có hiệu lực trong 24 giờ. Vui lòng đăng nhập ngay vào email của bạn và nhấp vào liên kết trong email để kích hoạt tài khoản của bạn。',
        form: {}
      }
    },
    computed: {
      email () {
        const v = this.form && this.form.email || 'xxx'
        const title = `
Tài khoản của bạn：${v} đăng ký thành công`
        return title
      }
    },
    created () {
      this.form = this.$route.params
    },
    methods: {
      goHomeHandle () {
        this.$router.push({ name: 'login' })
      }
    }
  }
  </script>
  
  <style scoped>
  
  </style>
  