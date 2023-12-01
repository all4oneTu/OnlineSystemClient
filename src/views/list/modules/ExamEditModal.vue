<template>
    <a-modal title="Cập nhật bài kiểm tra" :width="640" :visible="visible" :confirmLoading="confirmLoading" @cancel="handleCancel">
      <a-spin :spinning="confirmLoading">
        <a-steps :current="currentStep" :style="{ marginBottom: '28px' }" size="small">
          <a-step title="Mô tả bài kiểm tra" />
          <a-step title="Điểm câu hỏi" />
          <a-step title="Chọn câu hỏi" />
        </a-steps>
        <a-form :form="form">
          <!-- step1 -->
          <div v-show="currentStep === 0">
            <a-form-item label="Tên" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-model="name" />
            </a-form-item>
            <a-form-item label="Thời gian" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number :min="1" :max="200" v-model="elapse" />
              Phút
            </a-form-item>
            <a-form-item label="Tóm tắt" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-textarea :rows="2" v-model="desc"></a-textarea>
            </a-form-item>
            <a-form-item label="Avatar" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <p>Nhấp trực tiếp vào hình ảnh danh sách để sửa đổi, khuyến cáo hình ảnh không được lớn hơn 80*80</p>
            </a-form-item>
          </div>
          <div v-show="currentStep === 1">
            <a-form-item label="Câu hỏi 1 lựa chọn" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number :min="1" :max="20" v-model="radioScore" />
              Điểm
            </a-form-item>
            <a-form-item label="Câu hỏi nhiều lựa chọn" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number :min="1" :max="20" v-model="checkScore" />
              Điểm
            </a-form-item>
            <a-form-item label="Câu hỏi đúng sai" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number :min="1" :max="20" v-model="judgeScore" />
              Điểm
            </a-form-item>
          </div>
  
          <div v-show="currentStep === 2">
            <a-form-item label="Chọn câu hỏi 1 đáp án" :labelCol="labelCol" :wrapperCol="wrapperCol" enterButton="Search">
       
              <a-select
                mode="multiple"
                :size="size"
                :default-value="defaultRadios"
                v-if="visible"
                placeholder="Chọn câu hỏi 1 đáp án"
                style="width: 100%"
                @popupScroll="popupScroll"
                @change="handleRadioChange"
              >
                <a-select-option v-for="radio in radios" :value="radio.name" :key="radio.id">
                  {{ radio.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
  
            <a-form-item label="Chọn câu hỏi nhiều đáp án" :labelCol="labelCol" :wrapperCol="wrapperCol" enterButton="Search">
         
              <a-select
                mode="multiple"
                :size="size"
                :default-value="defaultChecks"
                v-if="visible"
                placeholder="Chọn câu hỏi nhiều đáp án"
                style="width: 100%"
                @popupScroll="popupScroll"
                @change="handleCheckChange"
              >
                <a-select-option v-for="check in checks" :value="check.name" :key="check.id">
                  {{ check.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
  
            <a-form-item label="Chọn câu hỏi đúng hoặc sai" :labelCol="labelCol" :wrapperCol="wrapperCol" enterButton="Search">
           
              <a-select
                mode="multiple"
                :size="size"
                :default-value="defaultJudges"
                v-if="visible"
                placeholder="Chọn câu hỏi đúng hoặc sai"
                style="width: 100%"
                @popupScroll="popupScroll"
                @change="handleJudgeChange">
                <a-select-option v-for="judge in judges" :value="judge.name" :key="judge.id">
                  {{ judge.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </div>
        </a-form>
      </a-spin>
      <template slot="footer">
        <a-button key="back" @click="backward" v-if="currentStep > 0" :style="{ float: 'left' }">Quay lại</a-button>
        <a-button key="cancel" @click="handleCancel">Hủy</a-button>
        <a-button key="forward" :loading="confirmLoading" type="primary" @click="handleNext(currentStep)">
          {{ currentStep === 2 && 'Hoàn thành' || 'Tiếp tục' }}
        </a-button>
      </template>
    </a-modal>
  </template>
  
  <script>
  import { getExamQuestionTypeList, examUpdate } from '../../../api/exam'
  
  const stepForms = [
    ['name', 'elapse', 'desc', 'avatar'],
    ['radioScore', 'checkScore', 'judgeScore'],
    ['option']
  ]
  
  export default {
    name: 'ExamEditModal',
    data () {
      return {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 7 }
        },
        size: 'default',
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 13 }
        },
        visible: false,
        confirmLoading: false,
        currentStep: 0,
        mdl: {},
        form: this.$form.createForm(this),
        // 考试的对象
        exam: {},
        name: '',
        elapse: 0,
        desc: '',
        avatar: '',
        radioScore: 0,
        checkScore: 0,
        judgeScore: 0,
        radios: [],
        checks: [],
        judges: [],
        defaultRadios: [],
        defaultChecks: [],
        defaultJudges: []
      }
    },
    methods: {
      edit (exam) {
        Object.assign(this.exam, exam) 
        this.visible = true
        this.radios = []
        this.checks = []
        this.judges = []
        this.defaultRadios = []
        this.defaultChecks = []
        this.defaultJudges = []
        this.name = exam.name
        this.elapse = exam.elapse
        this.desc = exam.desc
        this.avatar = exam.avatar
        this.radioScore = exam.radioScore
        this.checkScore = exam.checkScore
        this.judgeScore = exam.judgeScore
        const that = this

        getExamQuestionTypeList().then(res => {
          console.log(res)
          if (res.code !== 0) {
            that.$notification.error({
              message: 'Không lấy được danh sách câu hỏi',
              description: res.msg
            })
          }
          console.log(res.data)
          that.radios = res.data.radios
          that.checks = res.data.checks
          that.judges = res.data.judges
       
          for (let i = 0; i < exam.radios.length; i++) { 
            that.defaultRadios.push(exam.radios[i].name)
          }
          that.handleRadioChange(that.defaultRadios)
          for (let i = 0; i < exam.checks.length; i++) { 
            that.defaultChecks.push(exam.checks[i].name)
          }
          that.handleCheckChange(that.defaultChecks)
          for (let i = 0; i < exam.judges.length; i++) { 
            that.defaultJudges.push(exam.judges[i].name)
          }
          that.handleJudgeChange(that.defaultJudges)
        }).catch(err => {
          this.$notification.error({
            message: 'Không lấy được danh sách câu hỏi',
            description: err.message
          })
        })
      },
      popupScroll () {
        console.log('popupScroll')
      },
      handleNext (step) {
        const { form: { validateFields } } = this
        const currentStep = step + 1
        if (currentStep <= 2) {
          // stepForms
          // eslint-disable-next-line no-unused-vars
          validateFields(stepForms[this.currentStep], (errors, values) => {
            if (!errors) {
              this.currentStep = currentStep
            }
          })
          return
        }
        this.confirmLoading = true
        console.log('Update')
        this.confirmLoading = false
        this.exam.name = this.name
        this.exam.elapse = this.elapse
        this.exam.desc = this.desc
        this.exam.avatar = this.avatar
        this.exam.radioScore = this.radioScore
        this.exam.checkScore = this.checkScore
        this.exam.judgeScore = this.judgeScore
   
        this.exam.radios = this.radios
        this.exam.checks = this.checks
        this.exam.judges = this.judges
        const that = this
        examUpdate(that.exam).then(res => {
          console.log(res)
          if (res.code === 0) {
            that.$notification.success({
              message: 'Hoàn thành cập nhật',
              description: 'Đã cập nhật bài kiểm tra thành công'
            })
       
            that.visible = false
            that.currentStep = 0
            that.$emit('ok')
          }
        }).catch(err => {
          
          that.$notification.error({
            message: 'Cập nhật bài kiểm tra không thành công',
            description: err.message
          })
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
      handleRadioChange (values) {
        console.log(values)
        for (let i = 0; i < this.radios.length; i++) { 
          const name = this.radios[i].name
          let checked = false
          for (let j = 0; j < values.length; j++) { 
            const value = values[j]
            if (name === value) {

              checked = true
              this.radios[i].checked = true
              break
            }
          }
          if (checked === false) {
            this.radios[i].checked = false
          }
        }
      },
  
      handleCheckChange (values) {
        console.log(values)
        for (let i = 0; i < this.checks.length; i++) { 
          const name = this.checks[i].name
          let checked = false
          for (let j = 0; j < values.length; j++) { 
            const value = values[j]
            if (name === value) {
              checked = true
              this.checks[i].checked = true
              break 
            }
          }
       
          if (checked === false) {
            this.checks[i].checked = false
          }
        }
      },
  
      handleJudgeChange (values) {
        console.log(values)
        for (let i = 0; i < this.judges.length; i++) { 
          const name = this.judges[i].name
          let checked = false
          for (let j = 0; j < values.length; j++) { 
            const value = values[j]
            if (name === value) {
              checked = true
              this.judges[i].checked = true
              break
            }
          }
          if (checked === false) {
            this.judges[i].checked = false
          }
        }
      }
    }
  }
  </script>
  