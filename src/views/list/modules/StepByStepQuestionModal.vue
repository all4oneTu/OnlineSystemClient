<template>
    <a-modal title="Tạo câu hỏi" :width="800" :visible="visible" :confirmLoading="confirmLoading" @cancel="handleCancel">
      <a-spin :spinning="confirmLoading">
        <a-steps :current="currentStep" :style="{ marginBottom: '28px' }" size="small">
          <a-step title="Nội dung câu hỏi" />
          <a-step title="Thể loại câu hỏi" />
          <a-step title="Tùy chọn câu hỏi" />
        </a-steps>
        <a-form :form="form">
          <!-- step1 -->
          <div v-show="currentStep === 0">
            <a-form-item label="
            Tên" :labelCol="labelColName" :wrapperCol="wrapperColName">
              <div id="summernote-question-name"></div>
            </a-form-item>
            <a-form-item label="Nội dung" :labelCol="labelColName" :wrapperCol="wrapperColName">
              <div id="summernote-question-desc"></div>
            </a-form-item>
          </div>
          <div v-show="currentStep === 1">
            <a-form-item label="Thể loại" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select v-decorator="['type', {rules: [{required: true}]}]" placeholder="Vui lòng chọn loại câu hỏi" style="width: 100%">
                <a-select-option v-for="typeObj in types" :value="typeObj.id" :key="typeObj.id">
                  {{ typeObj.description }}
                </a-select-option>
              </a-select>
            </a-form-item>
  
            <a-form-item label="Phân loại" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select v-decorator="['category', { rules: [{required: true}]}]" placeholder="Vui lòng chọn" style="width: 100%">
                <a-select-option v-for="category in categories" :value="category.id" :key="category.id">
                  {{ category.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
  
            <a-form-item label="Mức độ" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select v-decorator="['level', { rules: [{required: true}]}]" placeholder="Chọn mức độ" style="width: 100%">
                <a-select-option v-for="level in levels" :value="level.id" :key="level.id">
                  {{ level.description }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </div>
  
          <div v-show="currentStep === 2">
           <!-- Hiển thị khi đó không phải là câu hỏi đúng hay sai -->
            <a-form-item label="Tạo tùy chọn" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="type!==3">
              <a-input
                v-decorator="['option', { rules: [{required: true}]}]"
                placeholder="Sau khi nhập xong nội dung nhấn Enter để thêm vào danh sách tùy chọn bên dưới."
                @pressEnter="addOption()"
              />
            </a-form-item>
  
            <a-form-item label="
            Đặt câu trả lời" :labelCol="labelCol" :wrapperCol="wrapperCol" enterButton="Search">
              <!-- Lưu ý ở đây chúng ta cần phân biệt giữa chọn đơn, chọn nhiều và phán đoán -->
              <!-- Lựa chọn đài -->
              <a-select
                style="width: 100%"
                placeholder="Hãy chọn câu trả lời cho câu hỏi trắc nghiệm"
                v-if="type===1"
                @change="handleSingleChange"
                :value="answerOption"
              >
  
                <a-select-option v-for="(option,index) in options" :value="option.content" :key="index">
                  {{ option.content }}
                </a-select-option>
              </a-select>
              <!-- 多选 -->
              <a-select
                mode="multiple"
                :size="size"
                placeholder="Hãy chọn câu trả lời cho câu hỏi trắc nghiệm"
                :value="answerOptions"
                v-if="type===2"
                style="width: 100%"
                @popupScroll="popupScroll"
                @change="handleMultiChange"
              >
                <a-select-option v-for="(option, index) in options" :value="option.content" :key="index">
                  {{ option.content }}
                </a-select-option>
              </a-select>
              <a-select
                style="width: 100%"
                placeholder="Hãy chọn câu trả lời cho câu hỏi đúng hoặc sai"
                v-if="type===3"
                @change="handleSingleChange"
                :value="answerOption"
              >
  
                <a-select-option v-for="(option,index) in options" :value="option.content" :key="index">
                  {{ option.content }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <!-- step1 end -->
        </a-form>
      </a-spin>
      <template slot="footer">
        <a-button key="back" @click="backward" v-if="currentStep > 0" :style="{ float: 'left' }">Quay Lại</a-button>
        <a-button key="cancel" @click="handleCancel">Hủy bỏ</a-button>
        <a-button key="forward" :loading="confirmLoading" type="primary" @click="handleNext(currentStep)">
          {{ currentStep === 2 && 'Hoàn thành' || 'Tiếp theo' }}
        </a-button>
      </template>
    </a-modal>
  </template>

  <script>
import '../../../plugins/summernote'
import $ from 'jquery'
import { getQuestionSelection, questionCreate } from '../../../api/exam'
const stepForms = [[], ['type', 'category', 'level'], ['option']]

export default {
  name: 'StepByStepQuestionModal',
  data () {
        return {
              labelColName: {
                  xs: { span: 2 },
                    sm: { span: 2 }
    },
              wrapperColName: {
                    xs: { span: 22 },
                        sm: { span: 22 }
    },
      labelCol: {
        xs: { span: 3 },
        sm: { span: 3 }
      },
      size: 'default',
      wrapperCol: {
        xs: { span: 22 },
        sm: { span: 22 }
      },
      answerOption: '',
      answerOptions: [],
      visible: false,
      confirmLoading: false,
      currentStep: 0,
      mdl: {},

      form: this.$form.createForm(this),
      categories: [],
      levels: [],
      types: [],
      optionToAdd: 'Thêm vào',
      options: [],
      judgeOptions: [
        {
          answer: false,
          content: 'Đúng'
        },
        {
          answer: false,
          content: 'Sai'
        }
      ],
      type: ''
    }
  },
  updated () {
    this.initSummernote('summernote-question-name')
    this.initSummernote('summernote-question-desc')
  },
  methods: {
    initSummernote (divId) {
      console.log('Khởi tạo câu h：' + divId)
      $('#' + divId).summernote({
        lang: 'vi-VN',
        placeholder: 'Vui lòng nhập nội dung',
        height: 150,
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
        ],
        callbacks: {
          onSubmit: function () {
            this.richContent = $('#summernote').summernote('code')
          }
        }
      })
    },
    getSummernoteContent (divId) {
      return $('#' + divId).summernote('code')
    },
    create () {
      this.visible = true
      // const { form: { setFieldsValue } } = this
      // this.$nextTick(() => {
      //   setFieldsValue(pick(record, []))
      // })
      getQuestionSelection().then(res => {
        console.log(res)
        if (res.code === 0) {
          console.log(res.data)
          this.categories = res.data.categories
          this.levels = res.data.levels
          this.types = res.data.types
        } else {
          this.$notification.error({
            message: 'Không thể nhận được các tùy chọn thả xuống câu hỏi',
            description: res.msg
          })
        }
      }).catch(err => {
        this.$notification.error({
          message: 'Không thể nhận được các tùy chọn thả xuống câu hỏi',
          description: err.message
        })
      })
    },
    popupScroll () {
      console.log('popupScroll')
    },
    handleNext (step) {
        // Handle next step or completion event
      const { form: { validateFields } } = this
      const currentStep = step + 1
      if (currentStep <= 2) {
        // stepForms
        validateFields(stepForms[this.currentStep], (errors, values) => {
          if (!errors) {
            this.currentStep = currentStep
           //Set the question type (single choice 1, multiple choice 2 or judgment 3) for displaying the question options in the last step
            this.type = values.type
         //Clear necessary data
            this.answerOptions = []
            this.answerOption = ''
            if (this.type === 3) {
             // If it is a true or false question, directly change the options to correct and incorrect
              this.options = this.judgeOptions
            } else {
              // It is not a true or false question, so make sure it is cleared every time
              this.options = []
            }
          }
        })
        return
      } 
// last step, the last step, represents the completion of writing the question, you need to click "Finish" to create the question
      this.confirmLoading = true
      validateFields((errors, values) => { 
        console.log('Gửi dữ liệu')
        console.log('errors:', errors, 'val:', values)
        values.options = this.options
        values.name = this.getSummernoteContent('summernote-question-name')
        values.desc = this.getSummernoteContent('summernote-question-desc')
        this.confirmLoading = false
        if (!errors) {
          console.log('values:', values)
            // Submit the question attribute in the data to the backend, and wait until the backend interface is written. Submit the question type created by the frontend to the backend.
          questionCreate(values).then(res => {    
            // Jump to the results page if successful
            console.log(res)
            if (res.code === 0) {
              this.$notification.success({
                message: 'Đã tạo thành công',
                description: 'Câu hỏi được tạo thành công'
              })
              this.visible = false
              this.$emit('ok')
            }
          }).catch(err => {
            this.$notification.error({
              message: 'Làm mới',
              description: err.message
            })
          })
        } else {
          this.confirmLoading = false
        }
      })
    },
    backward () {
      this.currentStep--
    },
    handleCancel () {
      // clear form & currentStep
      this.visible = false
      this.currentStep = 0
    },
    addOption () {
      console.log('Thêm tùy chọn')
   // Here you need to add the option + whether it is the answer to the question as a whole to options.
      const { form: { validateFields } } = this
      validateFields((errors, values) => { 
        console.log('errors:', errors, 'val:', values)
        for (let i = 0; i < this.options.length; i++) {
          const option = this.options[i]
          if (option.content === values.option) {
            this.$notification.error({
              message: 'Lỗi !!!',
              description: 'Không thêm các tùy chọn trùng lặp！'
            })
            return
          }
        }
        const optionObj = { content: values.option, answer: false }
        this.options.push(optionObj)
        this.$notification.success({
          message: 'Tùy chọn được tạo thành công',
          description: 'Làm ơn đến\'Đặt câu trả lời\'Hộp thả xuống để xem！'
        })
      })
    },
 
//Change options for single-choice questions
    handleSingleChange (value) {
        //The processing of single-choice questions
      for (let i = 0; i < this.options.length; i++) {
        if (this.options[i].content === value) {
          // Update the only correct answer
          this.options[i].answer = true       
            //Set the answer content
          this.answerOption = this.options[i].content
        } else {      
            // If the id is not the same as the answer, set it to false to ensure that there is only one correct answer.
          this.options[i].answer = false
        }
      }
      console.log(`Selected: ${value}`)
    },
    //Change options for multiple choice questions
    handleMultiChange (values) {
      console.log(values)
      this.answerOptions = values
      for (let i = 0; i < this.options.length; i++) { 
        const content = this.options[i].content
        let isAnswer = false
        for (let j = 0; j < values.length; j++) { 
          const value = values[j]
          if (content === value) {
            // Indicate that this option is the answer, set it to be the answer, and exit directly
            isAnswer = true
            this.options[i].answer = true
            break 
          }
        }
        if (isAnswer === false) {
          this.options[i].answer = false
        }
      }
    }

  }
}
</script>