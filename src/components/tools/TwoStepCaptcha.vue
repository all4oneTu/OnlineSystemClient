<!-- eslint-disable vue/no-mutating-props -->
<template>
    <a-modal
      centered
      v-model="visible"
      @cancel="handleCancel"
      :maskClosable="false"
    >
      <div slot="title" :style="{ textAlign: 'center' }">Xác minh hai bước</div>
      <template slot="footer">
        <div :style="{ textAlign: 'center' }">
          <a-button key="back" @click="handleCancel">
            Trở lại</a-button>
          <a-button key="submit" type="primary" :loading="stepLoading" @click="handleStepOk">
          Tiếp tục
          </a-button>
        </div>
      </template>
  
      <a-spin :spinning="stepLoading">
        <a-form layout="vertical" :auto-form-create="(form)=>{this.form = form}">
          <div class="step-form-wrapper">
            <p style="text-align: center" v-if="!stepLoading">Vui lòng mở Google Authenticator hoặc APP xác minh hai bước trên điện thoại của bạn<br />Nhập mã động gồm 6 chữ số</p>
            <p style="text-align: center" v-else>
              Đang xác minh..<br/>Vui lòng chờ</p>
            <a-form-item
              :style="{ textAlign: 'center' }"
              hasFeedback
              fieldDecoratorId="stepCode"
              :fieldDecoratorOptions="{rules: [{ required: true, message: 'Vui lòng nhập mã động gồm 6 chữ số!', pattern: /^\d{6}$/, len: 6 }]}"
            >
              <a-input :style="{ textAlign: 'center' }" @keyup.enter.native="handleStepOk" placeholder="000000" />
            </a-form-item>
            <p style="text-align: center">
              <a @click="onForgeStepCode">Bạn bị mất điện thoại?</a>
            </p>
          </div>
        </a-form>
      </a-spin>
    </a-modal>
  </template>
  
<script>
export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        stepLoading: false,
  
        form: null
      }
    },
    methods: {
      handleStepOk () {
        const vm = this
        this.stepLoading = true
        this.form.validateFields((err, values) => {
          if (!err) {
            console.log('values', values)
            setTimeout(() => {
              vm.stepLoading = false
              vm.$emit('success', { values })
            }, 2000)
            return
          }
          this.stepLoading = false
          this.$emit('error', { err })
        })
      },
      handleCancel () {
        // this.visible = false
        // this.$emit('cancel')
      },
      onForgeStepCode () {
  
      }
    }
  }
  </script>
  <style lang="less" scoped>
    .step-form-wrapper {
      margin: 0 auto;
      width: 80%;
      max-width: 400px;
    }
  </style>
  