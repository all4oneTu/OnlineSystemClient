<template>
    <div>
      <a-card style="margin-top: 24px" :bordered="false" title="Các bài kiểm tra đã thực hiện">
        <div slot="extra">
          <a-input-search style="margin-left: 16px; width: 272px;"/>
        </div>
        <a-list size="large">
          <a-list-item :key="index" v-for="(item, index) in data">
            <a-list-item-meta :description="item.exam.examDescription">
              <a-avatar slot="avatar" size="large" shape="square" :src="item.exam.examAvatar | imgSrcFilter"/>
              <a slot="title">{{ item.exam.examName }}</a>
            </a-list-item-meta>
            <div slot="actions">
              <a @click="viewExamRecordDetail(item.examRecord)">Xem chi tiết bài thi</a>
            </div>
            <div class="list-content">
              <div class="list-content-item">
                <span>Owner</span>
                <p>{{ item.user.userUsername }}</p>
              </div>
              <div class="list-content-item">
                <span>Thời gian bắt đầu</span>
                <p>{{ item.examRecord.examJoinDate }}</p>
              </div>
              <div class="list-content-item">
                <span>
                    Điểm</span>
                <p>{{ item.examRecord.examJoinScore }}</p>
              </div>
            </div>
          </a-list-item>
        </a-list>
  
      </a-card>
    </div>
  </template>
  <script>
  import HeadInfo from '../../components/tools/HeadInfo'
import { getExamRecordList } from '../../api/exam'

export default {
    //Danh sách hồ sơ thi, ghi lại tất cả các bài thi và kết quả thi mà thí sinh đã thi
  name: 'ExamRecordList',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    HeadInfo
  },
  data () {
    return {
      data: {}
    }
  },
  methods: {
    viewExamRecordDetail (record) {
        // Jump directly to the page where you take the exam and view the details of all questions
      const routeUrl = this.$router.resolve({
        path: `/exam/record/${record.examId}/${record.examRecordId}`
      })
     //The effect is the same as clicking on the exam card. It jumps to the exam page, which contains all the questions, which is equivalent to the details.
      window.open(routeUrl.href, '_blank')
    }
  },
  mounted () {
    // Get the exam list from the back-end data and adapt the front-end card
    getExamRecordList().then(res => {
      if (res.code === 0) {
        this.data = res.data
      } else {
        this.$notification.error({
          message: 'Không lấy được hồ sơ thi',
          description: res.msg
        })
      }
    }).catch(err => {
     // If it fails, a warning message will pop up.
      this.$notification.error({
        message: 'Không lấy được hồ sơ thi',
        description: err.message
      })
    })
  }
}
</script>
  