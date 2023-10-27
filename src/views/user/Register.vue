<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="main user-layout-register">
      <h3><span>Đăng ký</span></h3>
      <a-form ref="formRegister" :form="form" id="formRegister">
        <a-form-item>
          <a-input
            size="large"
            type="text"
            placeholder="Email"
            v-decorator="['email', {rules: [{ required: true, type: 'email', message: '请输入邮箱地址' }], validateTrigger: ['change', 'blur']}]"
          ></a-input>
        </a-form-item>
  
        <a-popover placement="rightTop" trigger="click" :visible="state.passwordLevelChecked">
          <template slot="content">
            <div :style="{ width: '240px' }">
              <div :class="['user-register', passwordLevelClass]">Độ mạnh: <span>{{ passwordLevelName }}</span></div>
              <a-progress :percent="state.percent" :showInfo="false" :strokeColor=" passwordLevelColor "/>
              <div style="margin-top: 10px;">
                <span>Vui lòng nhập ít nhất 6 ký tự. Vui lòng không sử dụng mật khẩu dễ đoán.</span>
              </div>
            </div>
          </template>
          <a-form-item>
            <a-input
              size="large"
              type="password"
              @click="handlePasswordInputClick"
              autocomplete="false"
              placeholder="Mật khẩu "
              v-decorator="['password', {rules: [{ required: true, message: 'Mật khẩu ít nhất 6 ký tự, phân biệt chữ hoa chữ thường'}, { validator: this.handlePasswordLevel }], validateTrigger: ['change', 'blur']}]"
            ></a-input>
          </a-form-item>
        </a-popover>
  
        <a-form-item>
          <a-input
            size="large"
            type="password"
            autocomplete="false"
            placeholder="Xác nhận mật khẩu"
            v-decorator="['password2', {rules: [{ required: true, message: 'Mật khẩu ít nhất 6 ký tự, phân biệt chữ hoa chữ thường' }, { validator: this.handlePasswordCheck }], validateTrigger: ['change', 'blur']}]"
          ></a-input>
        </a-form-item>
  
        <a-form-item>
          <a-input
            size="large"
           
            placeholder="Số điện thoại di động"
            v-decorator="['mobile', {rules: [{ required: true, message: 'Xin vui lòng nhập một số điện thoại hợp lệ', pattern: /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/ }, { validator: this.handlePhoneCheck } ], validateTrigger: ['change', 'blur'] }]"
          >
            <a-span slot="addonBefore" size="large" defaultValue="+84">+84
              <!-- <a-select-option value="+84">+84</a-select-option> -->
              <!-- <a-select-option value="+87">+87</a-select-option> -->
            </a-span>
          </a-input>
        </a-form-item>
        <a-row :gutter="16">
          <a-col class="gutter-row" :span="16">
            <a-form-item>
              <a-input
                size="large"
                type="text"
                placeholder="Mã xác nhận"
                v-decorator="['captcha', {rules: [{ required: true, message: 'Vui lòng nhập mã xác nhận' }], validateTrigger: 'blur'}]"
              >
                <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
              </a-input>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="8">
            <a-button
              class="getCaptcha"
              size="large"
              :disabled="state.smsSendBtn"
              @click.stop.prevent="getCaptcha"
              v-text="!state.smsSendBtn && 'Lấy mã '||(state.time+' s')"></a-button>
          </a-col>
        </a-row>
  
        <a-form-item>
          <a-button
            size="large"
            type="primary"
            htmlType="submit"
            class="register-button"
            :loading="registerBtn"
            @click.stop.prevent="handleSubmit"
            :disabled="registerBtn">Đăng ký
          </a-button>
          <router-link class="login" :to="{ name: 'login' }">Đã có tài khoản?</router-link>
        </a-form-item>
  
      </a-form>
    </div>
  </template>
  
  <script>
  import { mixinDevice } from '../../utils/mixin.js'
  import { getSmsCaptcha } from '../../api/login'
  import { register } from '../../api/user'
  
  const levelNames = {
    0: 'Rất yếu',
    1: 'Yếu',
    2: 'Trung bình',
    3: 'Mạnh'
  }
  const levelClass = {
    0: 'error',
    1: 'error',
    2: 'warning',
    3: 'success'
  }
  const levelColor = {
    0: '#ff0000',
    1: '#ff0000',
    2: '#ff7e05',
    3: '#52c41a'
  }
  export default {
    name: 'RegisterPage',
    components: {},
    mixins: [mixinDevice],
    data () {
      return {
        form: this.$form.createForm(this),
  
        state: {
          time: 60,
          smsSendBtn: false,
          passwordLevel: 0,
          passwordLevelChecked: false,
          percent: 10,
          progressColor: '#FF0000'
        },
        registerBtn: false
      }
    },
    computed: {
      passwordLevelClass () {
        return levelClass[this.state.passwordLevel]
      },
      passwordLevelName () {
        return levelNames[this.state.passwordLevel]
      },
      passwordLevelColor () {
        return levelColor[this.state.passwordLevel]
      }
    },
    methods: {
  
      handlePasswordLevel (rule, value, callback) {
        let level = 0
  
      // Xác định xem có số trong chuỗi này không
        if (/[0-9]/.test(value)) {
          level++
        }
       
      // Xác định xem có chữ cái nào trong chuỗi không
        if (/[a-zA-Z]/.test(value)) {
          level++
        }
      // Xác định xem có ký hiệu đặc biệt nào trong chuỗi không
        if (/[^0-9a-zA-Z_]/.test(value)) {
          level++
        }
        this.state.passwordLevel = level
        this.state.percent = level * 30
        if (level >= 2) {
          if (level >= 3) {
            this.state.percent = 100
          }
          callback()
        } else {
          if (level === 0) {
            this.state.percent = 10
          }
          callback(new Error('Mật khẩu không đủ mạnh'))
        }
      },
  
      handlePasswordCheck (rule, value, callback) {
        const password = this.form.getFieldValue('password')
        console.log('value', value)
        if (value === undefined) {
          callback(new Error('Xin vui lòng nhập mật khẩu'))
        }
        if (value && password && value.trim() !== password.trim()) {
          callback(new Error('Hai mật khẩu không nhất quán'))
        }
        callback()
      },
  
      handlePhoneCheck (rule, value, callback) {
        console.log('handlePhoneCheck, rule:', rule)
        console.log('handlePhoneCheck, value', value)
        console.log('handlePhoneCheck, callback', callback)
  
        callback()
      },
  
      handlePasswordInputClick () {
        if (!this.isMobile()) {
          this.state.passwordLevelChecked = true
          return
        }
        this.state.passwordLevelChecked = false
      },
  
      handleSubmit () {
        const { form: { validateFields }, $router, $message } = this
        validateFields({ force: true }, (err, values) => {
          if (!err) {
            register(values).then(res => {
            // Chuyển đến trang kết quả nếu thành công
              console.log(res)
              $router.push({ name: 'registerResult', params: { ...values } })
            }).catch(err => {
            // Nếu thất bại, một thông báo cảnh báo sẽ bật lên.
              $message.error(`load user err: ${err.message}`)
            })
          }
        })
      },
  
      getCaptcha (e) {
        e.preventDefault()
        const { form: { validateFields }, state, $message, $notification } = this
  
        validateFields(['mobile'], { force: true },
          (err, values) => {
            if (!err) {
              state.smsSendBtn = true
  
              const interval = window.setInterval(() => {
                if (state.time-- <= 0) {
                  state.time = 60
                  state.smsSendBtn = false
                  window.clearInterval(interval)
                }
              }, 1000)
  
              const hide = $message.loading('Mã xác minh đang được gửi..', 0)
  
              getSmsCaptcha({ mobile: values.mobile }).then(res => {
                setTimeout(hide, 2500)
                $notification['success']({
                  message: 'Thông báo',
                  description: 'Mã xác minh đã được lấy thành công. Mã xác minh của bạn là:' + res.result.captcha,
                  duration: 8
                })
              }).catch(err => {
                setTimeout(hide, 1)
                clearInterval(interval)
                state.time = 60
                state.smsSendBtn = false
                this.requestFailed(err)
              })
            }
          }
        )
      },
      requestFailed (err) {
        this.$notification['error']({
          message: 'Lỗi !!!',
          description: ((err.response || {}).data || {}).message || 'Đã xảy ra lỗi với yêu cầu, vui lòng thử lại sau',
          duration: 4
        })
        this.registerBtn = false
      }
    },
    watch: {
      'state.passwordLevel' (val) {
        console.log(val)
      }
    }
  }
  </script>
  <style lang="less">
    .user-register {
  
      &.error {
        color: #ff0000;
      }
  
      &.warning {
        color: #ff7e05;
      }
  
      &.success {
        color: #52c41a;
      }
  
    }
  
    .user-layout-register {
      .ant-input-group-addon:first-child {
        background-color: #fff;
      }
    }
  </style>
  <style lang="less" scoped>
    .user-layout-register {
  
      & > h3 {
        font-size: 16px;
        margin-bottom: 20px;
      }
  
      .getCaptcha {
        display: block;
        width: 100%;
        height: 40px;
      }
  
      .register-button {
        width: 50%;
      }
  
      .login {
        float: right;
        line-height: 40px;
      }
    }
  </style>
  