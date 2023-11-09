<!-- eslint-disable vue/no-useless-template-attributes -->
<template>
    <div class="card-list" ref="content">
      <a-list
        :grid="{gutter: 24, lg: 3, md: 2, sm: 1, xs: 1}"
        :dataSource="dataSource"
      >
        <a-list-item slot="renderItem" slot-scope="item">
          <a-card :hoverable="true" @click="joinExam(item.id)">
            <a-card-meta>
              <div style="margin-bottom: 3px" slot="title">{{ item.title }}</div>
              <a-avatar class="card-avatar" slot="avatar" :src="item.avatar | imgSrcFilter" size="large" />
              <div class="meta-content" slot="description">{{ item.content }}</div>
            </a-card-meta>
            <template class="ant-card-actions" slot="actions">
              <a>Tổng：{{ item.score }} điểm</a>
              <a>Thời gian：{{ item.elapse }} phút</a>
            </template>
          </a-card>
        </a-list-item>
      </a-list>
    </div>
  </template>

<script>
import { getExamCardList } from '../../api/exam'

export default {
  name: 'ExamCardList',
  data () {
    return {
      description: 'Ấn vào thẻ kiểm tra bên dưới để bắt đầu bài kiểm tra',
      extraImage: 'https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png',
      dataSource: []
    }
  },
  methods: {
    joinExam (id) {
      const routeUrl = this.$router.resolve({
        path: `/exam/${id}`
      })
      window.open(routeUrl.href, '_blank')
    }
  },
  mounted () {
  
    // Lấy danh sách bài kiểm tra từ dữ liệu back-end và điều chỉnh thẻ front-end
    getExamCardList().then(res => {
      console.log(res)
      if (res.code === 0) {
        this.dataSource = res.data
      } else {
        this.$notification.error({
          message: 'Không lấy được danh sách bài thi',
          description: res.msg
        })
      }
    }).catch(err => {
      this.$notification.error({
        message: 'Không lấy được danh sách bài thi',
        description: err.message
      })
    })
  }
}

</script>

<style lang="less" scoped>
  .card-avatar {
    width: 48px;
    height: 48px;
    border-radius: 48px;
  }

  .ant-card-actions {
    background: #f7f9fa;

    li {
      float: left;
      text-align: center;
      margin: 12px 0;
      color: rgba(0, 0, 0, 0.45);
      width: 50%;

      &:not(:last-child) {
        border-right: 1px solid #e8e8e8;
      }

      a {
        color: rgba(0, 0, 0, .45);
        line-height: 22px;
        display: inline-block;
        width: 100%;

        &:hover {
          color: #1890ff;
        }
      }
    }
  }

  .new-btn {
    background-color: #fff;
    border-radius: 2px;
    width: 100%;
    height: 188px;
  }

  .meta-content {
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    height: 64px;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
</style>
