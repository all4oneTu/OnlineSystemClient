<template>
    <a-modal :title="title" :width="600" :visible="visible" :confirmLoading="confirmLoading" @cancel="handleCancel">
      <div :id="divId"></div>
      <template slot="footer">
        <a-button key="cancel" @click="handleCancel">Quay Lại</a-button>
        <a-button key="update" @click="handleUpdate">Lưu </a-button>
      </template>
    </a-modal>
  </template>
  
  <script>
  import '../../../plugins/summernote'
  import $ from 'jquery'
  
  export default {
    name: 'SummernoteUpdateModal',
    data () {
      return {
        confirmLoading: false,
        visible: false,
        divId: 'summernote-id', 
        record: {},
        key: '', 
        content: '', 
        title: '',
        fn: Function
      }
    },
    updated () {
      this.initSummernote(this.divId)
      $('#' + this.divId).summernote('code', this.content) // Gán giá trị cho summernote
    },
    methods: {
      initSummernote (divId) {
        console.log('Update：' + divId)
        $('#' + divId).summernote({
          lang: 'vi-VN',
          placeholder: 'Nhập nội dung',
          height: 300,
          width: '100%',
          htmlMode: true,
          toolbar: [
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['fontsize', ['fontsize']],
            ['fontname', ['fontname']],
            ['para', ['ul', 'ol', 'paragraph']]
          ],
          fontSizes: ['8', '9', '10', '11', '12', '14', '18', '24', '36'],
          fontNames: [
            'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New',
            'Helvetica Neue', 'Helvetica', 'Impact', 'Lucida Grande',
            'Tahoma', 'Times New Roman', 'Verdana'
          ]
        })
      },
      getSummernoteContent (divId) {
        return $('#' + divId).summernote('code')
      },
      setSummernoteContent (divId, content) {
        return $('#' + divId).summernote('code', content)
      },
      edit (divId, record, key, title, fn) {
        this.divId = divId // Khởi tạo id
        this.visible = true
        Object.assign(this.record, record)
        this.key = key
        this.content = this.record[key] // Lấy giá trị thuộc tính tương ứng với key
        this.title = title
        this.fn = fn // Chức năng cập nhật tùy chỉnh
      },
      handleCancel () {
        this.visible = false
      },
      handleUpdate () {
        const that = this
        that.record[that.key] = $('#' + that.divId).summernote('code')
        that.fn(that.record).then(res => {
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
            message: 'Lỗi!!!',
            description: err.message
          })
        })
      }
    }
  }
  </script>
  