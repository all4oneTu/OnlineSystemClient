<template>
    <a-card :bordered="false">
      <div id="toolbar">
        <a-button type="primary" icon="plus" @click="$refs.createExamModal.create()">New</a-button>&nbsp;
        <a-button type="primary" icon="reload" @click="loadAll()">Refresh</a-button>
      </div>
      <BootstrapTable
        ref="table"
        :columns="columns"
        :data="tableData"
        :options="options"
      />
    
      <step-by-step-exam-modal ref="createExamModal" @ok="handleOk" />
      <!-- <exam-edit-modal ref="editExamModal" @ok="handleOk" /> -->
      <update-avatar-modal ref="updateAvatarModal" @ok="handleOk" />
    </a-card>
  </template>
  
  <script>
  import '../../plugins/bootstrap-table'
  import { getExamAll } from '../../api/exam'
  import StepByStepExamModal from './modules/StepByStepExamModal'
//   import ExamEditModal from './modules/ExamEditModal'
  import UpdateAvatarModal from './modules/UpdateAvatarModal'
  
  export default {
    name: 'ExamTableList',
    components: {
      UpdateAvatarModal,
    //   ExamEditModal,
      StepByStepExamModal
    },
    data () {
      const that = this 
      return {
        columns: [
          {
            title: 'STT',
            field: 'serial',
            formatter: function (value, row, index) {
              return index + 1 
            }
          },
          {
            title: 'Avatar',
            field: 'avatar',
            width: 50,
            formatter: (value) => {
              return '<div class="exam-avatar">' + value + '</div>'
            },
            events: {
              'click .exam-avatar': function (e, value, row) {
                that.handleAvatarEdit(row)
              }
            }
          },
          {
            title: 'Tên',
            field: 'name',
            width: 250
          },
          {
            title: 'Điểm',
            field: 'score'
          },
          {
            title: 'Người tạo',
            field: 'creator'
          },
          {
            title: 'Thời gian tạo',
            field: 'elapse'
          },
          {
            title: 'Thời gian cập nhật',
            field: 'updateTime'
          },
          {
            title: 'Hành động',
            field: 'action',
            width: '150px',
            formatter: () => {
              return `
                <div class="btn-group">
                  <button type="button" class="btn btn-success view-question mr-1 text-nowrap">Chi tiết</button>
                  <button type="button" class="btn btn-success edit-question text-nowrap">Chỉnh sửa</button>
                </div>
              `;
            },
            events: {
              'click .view-exam': function (e, value, row) {
                that.handleSub(row)
              },
              'click .edit-exam': function (e, value, row) {
                that.handleEdit(row)
              }
            }
          }
        ],
        tableData: [], 
        // custom bootstrap-table
        options: {
          search: true,
          showColumns: true,
          showExport: true,
          pagination: true,
          toolbar: '#toolbar',
          advancedSearch: true,
          idTable: 'advancedTable'
          // onClickRow: that.clickRow,
          // onClickCell: that.clickCell, 
          // onDblClickCell: that.dblClickCell 
        }
      }
    },
    mounted () {
      this.loadAll() 
    },
    methods: {
      handleEdit (record) {
        console.log(record)
        this.$refs.editExamModal.edit(record)
      },
      handleAvatarEdit (record) {
        console.log(record)
        this.$refs.updateAvatarModal.edit(record)
      },
      handleSub (record) {
        // this.$refs.modalView.edit(record)
        const routeUrl = this.$router.resolve({
          path: `/exam/${record.id}`
        })
        window.open(routeUrl.href, '_blank')
      },
      handleOk () {
        this.loadAll()
      },
      loadAll () {
        const that = this
        getExamAll()
          .then(res => {
            if (res.code === 0) {
              that.tableData = res.data
              that.$refs.table._initTable()
            } else {
              that.$notification.error({
                message: 'Không thể lấy được danh sách tất cả các bài kiểm tra',
                description: res.msg
              })
            }
          })
      }
    }
  }
  </script>
  