<template>
    <a-modal title="Thông tin câu hỏi" :width="640" :visible="visible" :confirmLoading="confirmLoading" @cancel="handleCancel">
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <h3><b>Tên câu hỏi：</b></h3>
          <div v-html="question.name"></div>
          <br>
          <h3><b>Nội dung câu hỏi：</b></h3>
          <div v-html="question.description"></div>
          <br>
          <h3><b>Tùy chọn：</b></h3>
          <ul>
            <li v-for="option in question.options" :key="option.id" v-html="option.content"/>
          </ul>
          <br>
          <h3><b>Đáp án：</b></h3>
          <ul>
            <li v-for="option in question.options" :key="option.id" v-show="option.answer===true" v-html="option.content"/>
          </ul>
          <!-- <br>
          <h3><b>Nội dung câu hỏi：</b></h3>
          <div v-html="question.description"></div> -->
        </a-form>
      </a-spin>
      <template slot="footer">
        <a-button key="cancel" @click="handleCancel">
          Đóng</a-button>
      </template>
    </a-modal>
  </template>
  
  <script>
  
  export default {
    name: 'QuestionViewModal',
    data () {
      return {
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        question: {},
        options: [],
        answerOption: ''
      }
    },
    methods: {
      edit (record) {
        this.visible = true
        this.question = record
      },
  
      handleCancel () {
        this.visible = false
      }
    }
  }
  </script>
  