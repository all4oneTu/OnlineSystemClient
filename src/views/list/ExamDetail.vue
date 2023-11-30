<template>
    <a-layout>
      <a-layout-header class="header" style="color: #fff">
        <!--   v-if="examDetail.exam"  -->
        <span style="font-size:25px;margin-left: 0px;" v-if="examDetail.exam">
          <a-avatar slot="avatar" size="large" shape="circle" :src="examDetail.exam.examAvatar | imgSrcFilter"/>
          {{ examDetail.exam.examName }}
          <span style="font-size:15px;">{{ examDetail.exam.examDescription }} </span>
        </span>
        <span style="float: right;">
          <span style="margin-right: 60px; font-size: 20px" v-if="examDetail.exam">Giới hạn thời gian thi：{{ examDetail.exam.examTimeLimit }}Phút ở đây là đếm ngược</span>
          <a-button type="danger" ghost style="margin-right: 60px;" @click="finishExam()">Nộp bài</a-button>
          <a-avatar class="avatar" size="small" :src="avatar()"/>
          <span style="margin-left: 12px">{{ nickname() }}</span>
        </span>
      </a-layout-header>
      <a-layout>
        <a-layout-sider width="190" :style="{background: '#444',overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }">
          <a-menu
            mode="inline"
            :defaultSelectedKeys="['1']"
            :defaultOpenKeys="['question_radio', 'question_check', 'question_judge']"
            :style="{ height: '100%', borderRight: 0 }"
          >
            <a-sub-menu key="question_radio">
              <span slot="title" v-if="examDetail.exam"><a-icon type="check-circle" theme="twoTone"/>Câu hỏi trắc nghiệm (mỗi câu hỏi{{ examDetail.exam.examScoreRadio }}điểm)</span>
              <a-menu-item v-for="(item, index) in examDetail.radioIds" :key="item" @click="getQuestionDetail(item)">
                <a-icon type="eye" theme="twoTone" twoToneColor="#52c41a" v-if="answersMap.get(item)"/>
                Câu hỏi{{ index + 1 }}
              </a-menu-item>
            </a-sub-menu>
            <a-sub-menu key="question_check">
              <span slot="title" v-if="examDetail.exam"><a-icon type="check-square" theme="twoTone"/>
                Câu hỏi trắc nghiệm (mỗi câu hỏi{{ examDetail.exam.examScoreCheck }}Điểm)</span>
              <a-menu-item v-for="(item, index) in examDetail.checkIds" :key="item" @click="getQuestionDetail(item)">
                <a-icon type="eye" theme="twoTone" twoToneColor="#52c41a" v-if="answersMap.get(item)"/>
                Câu hỏi{{ index + 1 }}
              </a-menu-item>
            </a-sub-menu>
            <a-sub-menu key="question_judge">
              <span slot="title" v-if="examDetail.exam"><a-icon type="like" theme="twoTone"/>Câu hỏi Đúng hay Sai (mỗi câu hỏi {{ examDetail.exam.examScoreJudge }}Điểm)</span>
              <a-menu-item v-for="(item, index) in examDetail.judgeIds" :key="item" @click="getQuestionDetail(item)">
                <a-icon type="eye" theme="twoTone" twoToneColor="#52c41a" v-if="answersMap.get(item)"/>
                Câu hỏi{{ index + 1 }}
              </a-menu-item>
            </a-sub-menu>
          </a-menu>
        </a-layout-sider>
        <a-layout :style="{ marginLeft: '200px' }">
          <a-layout-content :style="{ margin: '24px 16px 0',height: '84vh', overflow: 'initial' }">
            <div :style="{ padding: '24px', background: '#fff',height: '84vh'}">
              <span v-show="currentQuestion === ''" style="font-size: 30px;font-family: Consolas">
                Chào mừng các bạn tham gia thi, các bạn hãy bấm vào số câu hỏi bên trái để bắt đầu trả lời câu hỏi</span>
              <strong>{{ currentQuestion.type }} </strong> <p v-html="currentQuestion.name
              "></p>
             <!-- Câu hỏi một lựa chọn và câu hỏi đúng-sai --> <!-- Khóa chỉ cần được đảm bảo trong vòng lặp for để đảm bảo rằng khóa không bị lặp lại -->
              <a-radio-group @change="onRadioChange" v-model="radioValue" v-if="currentQuestion.type === 'Câu hỏi 1 lựa chọn' || currentQuestion.type === 'Câu hỏi đúng sai'">
                <a-radio v-for="option in currentQuestion.options" :key="option.questionOptionId" :style="optionStyle" :value="option.questionOptionId">
                  {{ option.questionOptionContent }}
                </a-radio>
              </a-radio-group>
  
        
              <a-checkbox-group @change="onCheckChange" v-model="checkValues" v-if="currentQuestion.type === 'Câu hỏi nhiều lựa chọn'">
                <a-checkbox v-for="option in currentQuestion.options" :key="option.questionOptionId" :style="optionStyle" :value="option.questionOptionId">
                  {{ option.questionOptionContent }}
                </a-checkbox>
              </a-checkbox-group>
            </div>
          </a-layout-content>
        </a-layout>
      </a-layout>
    </a-layout>
  </template>
  
  <script>
  import { getExamDetail, getQuestionDetail, finishExam } from '../../api/exam'
  import UserMenu from '../../components/tools/UserMenu'
  import { mapGetters } from 'vuex'
  
  export default {
    name: 'ExamDetail',
    components: {
      // eslint-disable-next-line vue/no-unused-components
      UserMenu
    },
    data () {
      return {
        examDetail: {},
        answersMap: {},
        // Current user's ques
        currentQuestion: '',
        // The binding value of the single-choice or true-false question is used to initialize the question status from answersMap
        radioValue: '',
        // The binding value of the multiple-choice question is used to initialize the question status from answersMap
        checkValues: [],
        optionStyle: {
          display: 'block',
          height: '30px',
          lineHeight: '30px',
          marginLeft: '0px'
        }
      }
    },
    mounted () {
      this.answersMap = new Map()
      const that = this
        // Get the detailed information of the exam from the backend and render it into the exam details.
      getExamDetail(this.$route.params.id)
        .then(res => {
          if (res.code === 0) {
            that.examDetail = res.data
            return res.data
          } else {
            this.$notification.error({
              message: 'sKhông thể lấy được chi tiết bài kiểm tra',
              description: res.msg
            })
          }
        })
    },
    methods: {
      ...mapGetters(['nickname', 'avatar']),
      getQuestionDetail (questionId) {
        const that = this
        this.radioValue = ''
        this.checkValues = []
        getQuestionDetail(questionId)
          .then(res => {
            if (res.code === 0) {
              that.currentQuestion = res.data
              console.log(that.currentQuestion)
              if (that.answersMap.get(that.currentQuestion.id)) {
                if (that.currentQuestion.type === 'Câu hỏi 1 lựa chọn' || that.currentQuestion.type === 'Câu hỏi đúng sai') {
                  that.radioValue = that.answersMap.get(that.currentQuestion.id)[0]
                } else if (that.currentQuestion.type === 'Câu hỏi nhiều lựa chọn') {
                  Object.assign(that.checkValues, that.answersMap.get(that.currentQuestion.id))
                }
              }
              return res.data
            } else {
              this.$notification.error({
                message: 'Không thể lấy được chi tiết bài kiểm tra',
                description: res.msg
              })
            }
          })
      },
      onRadioChange (e) {
        const userOptions = []
        userOptions.push(e.target.value)
        this.answersMap.set(this.currentQuestion.id, userOptions)
      },
      onCheckChange (checkedValues) {
        this.answersMap.set(this.currentQuestion.id, checkedValues)
      },
      _strMapToObj (strMap) {
        const obj = Object.create(null)
        for (const [k, v] of strMap) {
          obj[k] = v
        }
        return obj
      },
      _mapToJson (map) {
        return JSON.stringify(this._strMapToObj(map))
      },
      finishExam () {
        finishExam(this.$route.params.id, this._mapToJson(this.answersMap))
          .then(res => {
            if (res.code === 0) {
            //The exam is handed in, the back-end scoring is completed, and then jumps to my exam interface
              this.$notification.success({
                message: 'Bài thi đã được gửi thành công!'
              })
              this.$router.push('/list/exam-record-list')
              return res.data
            } else {
              this.$notification.error({
                message: 'Không thể nộp bài！',
                description: res.msg
              })
            }
          })
      }
    }
  }
  </script>
  
  <style scoped>
  
  </style>
  