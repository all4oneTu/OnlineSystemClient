<template>
    <a-layout>
      <a-layout-header class="header" style="color: #fff">
        <span style="font-size:25px;margin-left: 0px;" v-if="examDetail.exam">
          <a-avatar slot="avatar" size="large" shape="circle" :src="examDetail.exam.examAvatar | imgSrcFilter"/>
          {{ examDetail.exam.examName }}
          <span style="font-size:15px;">{{ examDetail.exam.examDescription }} </span>
        </span>
        <span style="float: right;">
          <span style="margin-right: 40px; font-size: 20px" v-if="recordDetail.examRecord">
            Điểm thi：<span style="color: red">{{ recordDetail.examRecord.examJoinScore }}</span>&nbsp;Điểm&nbsp;
            <span style="font-size:15px;">
                Thời gian làm bài thi:{{ recordDetail.examRecord.examJoinDate }}</span>
          </span>
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
              <span slot="title" v-if="examDetail.exam"><a-icon type="check-circle" theme="twoTone"/>Câu hỏi trắc nghiệm (mỗi câu hỏi{{ examDetail.exam.examScoreRadio }}Điểm)</span>
              <a-menu-item v-for="(item, index) in examDetail.radioIds" :key="item" @click="getQuestionDetail(item)">
                <a-icon type="check" v-if="resultsMap.get(item)==='True'"/>
                <a-icon type="close" v-if="resultsMap.get(item)==='False'"/>
               Câu hỏi {{ index + 1 }}
              </a-menu-item>
            </a-sub-menu>
            <a-sub-menu key="question_check">
              <span slot="title" v-if="examDetail.exam"><a-icon type="check-square" theme="twoTone"/>Câu hỏi trắc nghiệm (mỗi câu hỏi{{ examDetail.exam.examScoreCheck }}Điểm)</span>
              <a-menu-item v-for="(item, index) in examDetail.checkIds" :key="item" @click="getQuestionDetail(item)">
                <a-icon type="check" v-if="resultsMap.get(item)==='True'"/>
                <a-icon type="close" v-if="resultsMap.get(item)==='False'"/>
                Câu hỏi {{ index + 1 }}
              </a-menu-item>
            </a-sub-menu>
            <a-sub-menu key="question_judge">
              <span slot="title" v-if="examDetail.exam"><a-icon type="like" theme="twoTone"/>Câu hỏi đúng/sai (mỗi câu hỏi{{ examDetail.exam.examScoreJudge }}Điểm)</span>
              <a-menu-item v-for="(item, index) in examDetail.judgeIds" :key="item" @click="getQuestionDetail(item)">
                <a-icon type="check" v-if="resultsMap.get(item)==='True'"/>
                <a-icon type="close" v-if="resultsMap.get(item)==='False'"/>
                Câu hỏi {{ index + 1 }}
              </a-menu-item>
            </a-sub-menu>
          </a-menu>
        </a-layout-sider>
        <a-layout :style="{ marginLeft: '200px' }">
          <a-layout-content :style="{ margin: '24px 16px 0',height: '84vh', overflow: 'initial' }">
            <div :style="{ padding: '24px', background: '#fff',height: '84vh'}">
              <span v-if="currentQuestion === ''" style="font-size: 30px;font-family: Consolas">Chào mừng bạn đến kiểm tra trạng thái của bài kiểm tra này. Nhấp vào số câu hỏi ở bên trái để xem chi tiết câu trả lời.</span>
              <span v-if="currentQuestion !== ''">
                <strong>{{ currentQuestion.type }} </strong> <p v-html="currentQuestion.name"></p>
                <strong style="color: green;" v-if="questionRight">Bạn đã trả lời đúng câu hỏi này!</strong>
                <strong style="color: red;" v-if="!questionRight">Bạn trả lời sai câu này rồi!</strong>
              </span>
              <br><br>

              <a-radio-group v-model="radioValue" v-if="currentQuestion.type === 'Câu hỏi 1 lựa chọn' || currentQuestion.type === 'Câu hỏi đúng sai'">
                <a-radio v-for="option in currentQuestion.options" :key="option.questionOptionId" :style="optionStyle" :value="option.questionOptionId">
                  {{ option.questionOptionContent }}
                </a-radio>
              </a-radio-group>

              <div v-if="!questionRight && currentQuestion!=='' && (currentQuestion.type === 'Câu hỏi 1 lựa chọn' || currentQuestion.type === 'Câu hỏi đúng sai')">
                <span style="color: red;"><br/>Đáp án đúng là:<br/></span>
                <a-radio-group v-model="radioRightValue">
                  <a-radio v-for="option in currentQuestion.options" :key="option.questionOptionId" :style="optionStyle" :value="option.questionOptionId">
                    {{ option.questionOptionContent }}
                  </a-radio>
                </a-radio-group>
              </div>
  
              <a-checkbox-group v-model="checkValues" v-if="currentQuestion.type === 'Câu hỏi nhiều lựa chọn'">
                <a-checkbox v-for="option in currentQuestion.options" :key="option.questionOptionId" :style="optionStyle" :value="option.questionOptionId">
                  {{ option.questionOptionContent }}
                </a-checkbox>
              </a-checkbox-group>

              <div v-if="!questionRight && currentQuestion!=='' && currentQuestion.type === 'Câu hỏi nhiều lựa chọn'">
                <span style="color: red;"><br/>Đáp án đúng là：<br/></span>
                <a-checkbox-group v-model="checkRightValues">
                  <a-checkbox v-for="option in currentQuestion.options" :key="option.questionOptionId" :style="optionStyle" :value="option.questionOptionId">
                    {{ option.questionOptionContent }}
                  </a-checkbox>
                </a-checkbox-group>
              </div>
  
              <span style="color: red;"><br/>Phân tích câu trả lời：<br/></span>
              <p v-html="currentQuestion.description"></p>
            </div>
          </a-layout-content>
        </a-layout>
      </a-layout>
    </a-layout>
  </template>
  
  <script>
  import { getExamDetail, getQuestionDetail, getExamRecordDetail } from '../../api/exam'
  import UserMenu from '../../components/tools/UserMenu'
  import { mapGetters } from 'vuex'
  
  export default {
    name: 'ExamRecordDetail',
    components: {
      // eslint-disable-next-line vue/no-unused-components
      UserMenu
    },
    data () {
      return {
        examDetail: {},
        recordDetail: {},
        answersMap: {},
        answersRightMap: {},
        resultsMap: {},
        currentQuestion: '',
        radioValue: '',
        radioRightValue: '',
        checkValues: [],
        checkRightValues: [],
        optionStyle: {
          display: 'block',
          height: '30px',
          lineHeight: '30px',
          marginLeft: '0px'
        }
      }
    },
    computed: {
      questionRight () {
        return this.resultsMap !== '' && this.resultsMap.get(this.currentQuestion.id) === 'True'
      }
    },
    mounted () {
      this.answersMap = new Map()
      this.answersRightMap = new Map()
      this.resultsMap = new Map()
      const that = this
      getExamDetail(this.$route.params.exam_id)
        .then(res => {
          if (res.code === 0) {
            that.examDetail = res.data
            return res.data
          } else {
            this.$notification.error({
              message: '获取考试详情失败',
              description: res.msg
            })
          }
        })
      getExamRecordDetail(this.$route.params.record_id)
        .then(res => {
          if (res.code === 0) {
            console.log(res.data)
            that.recordDetail = res.data
            that.objToMap()
            return res.data
          } else {
            this.$notification.error({
              message: '获取考试记录详情失败',
              description: res.msg
            })
          }
        })
    },
    methods: {
      ...mapGetters(['nickname', 'avatar']),
      objToMap () {
        for (const item in this.recordDetail.answersMap) {
          this.answersMap.set(item, this.recordDetail.answersMap[item])
        }
  
        for (const item in this.recordDetail.answersRightMap) {
          this.answersRightMap.set(item, this.recordDetail.answersRightMap[item])
        }
  
        for (const item in this.recordDetail.resultsMap) {
          this.resultsMap.set(item, this.recordDetail.resultsMap[item])
        }
      },
      getQuestionDetail (questionId) {
        const that = this
        this.radioValue = ''
        this.radioRightValue = ''
        this.checkValues = []
        this.checkRightValues = []
        getQuestionDetail(questionId)
          .then(res => {
            if (res.code === 0) {
              that.currentQuestion = res.data
              if (that.answersMap.get(that.currentQuestion.id)) {
                if (that.currentQuestion.type === 'Câu hỏi 1 lựa chọn' || that.currentQuestion.type === 'Câu hỏi đúng sai') {
                  that.radioValue = that.answersMap.get(that.currentQuestion.id)[0]
                  that.radioRightValue = that.answersRightMap.get(that.currentQuestion.id)[0]
                } else if (that.currentQuestion.type === 'Câu hỏi nhiều lựa chọn') {
                  Object.assign(that.checkValues, that.answersMap.get(that.currentQuestion.id))
                  Object.assign(that.checkRightValues, that.answersRightMap.get(that.currentQuestion.id))
                }
              }
              return res.data
            } else {
              this.$notification.error({
                message: '获取问题详情失败',
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
  