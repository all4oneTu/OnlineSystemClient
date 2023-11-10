<template>
    <a-modal title="Chỉnh sửa bìa" :width="400" :visible="visible" :confirmLoading="confirmLoading" @cancel="handleCancel">
      <p>Chỉ cần dán ảnh chụp màn hình ngay bên dưới. Khuyến cáo hình ảnh không được lớn hơn 80*80</p>
      <div id="summernote-exam-avatar"></div>
      <template slot="footer">
        <a-button key="update" @click="handleUpdate">Lưu</a-button>
        <a-button key="cancel" @click="handleCancel">Đóng</a-button>
      </template>
    </a-modal>
  </template>
  
  <script>
  import { examUpdate } from '../../../api/exam'
  import '../../../plugins/summernote'
  import $ from 'jquery'
  
  export default {
    name: 'UpdateAvatarModal',
    data () {
      return {
        confirmLoading: false,
        visible: false,
        exam: {}
      }
    },
    updated () {
      this.initSummernote()
      $('#summernote-exam-avatar').summernote('code', this.exam.avatar) 
    },
    methods: {
      initSummernote () {
        console.log('Update')
        $('#summernote-exam-avatar').summernote({
          lang: 'vi-VN',
          placeholder: 'Vui lòng nhập nội dung',
          height: 200,
          width: 320,
          htmlMode: true,
          toolbar: [],
          fontSizes: ['8', '9', '10', '11', '12', '14', '18', '24', '36'],
          fontNames: [
            'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New',
            'Helvetica Neue', 'Helvetica', 'Impact', 'Lucida Grande',
            'Tahoma', 'Times New Roman', 'Verdana'
          ]
        })
      },
      edit (exam) {
        this.visible = true
        //Assign the current record to the variable in data
        Object.assign(this.exam, exam)
        this.avatar = exam.avatar
      },
      handleCancel () {
        // clear form & currentStep
        this.visible = false
      },
      handleUpdate () {
        const that = this
        that.exam.avatar = $('#summernote-exam-avatar').summernote('code')
        examUpdate(that.exam).then(res => {
          // Jump to the results page if successful
          console.log(res)
          if (res.code === 0) {
            that.$notification.success({
              message: 'Thành công',
              description: 'Hoàn thành cập nhật'
            })
            that.visible = false
            that.$emit('ok')
          }
        }).catch(err => {
          that.$notification.error({
            message: 'Lỗi !!!',
            description: err.message
          })
        })
      }
    }
  }
  </script>
  