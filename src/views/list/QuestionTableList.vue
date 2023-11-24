<!-- eslint-disable vue/no-unused-components -->

<template>
    <a-card :bordered="false">
      <div id="toolbar">
        <a-button type="primary" icon="plus" @click="$refs.createQuestionModal.create()">New</a-button>&nbsp;
        <a-button type="primary" icon="reload" @click="loadAll()">Refresh</a-button>
      </div>
      <BootstrapTable
        ref="table"
        :columns="columns"
        :data="tableData"
        :options="options"
      />
      <step-by-step-question-modal ref="createQuestionModal" @ok="handleOk" />
      <summernote-update-modal ref="questionUpdateModal" @ok="handleOk" />
      <question-view-modal ref="modalView" @ok="handleOk" />
      <question-edit-modal ref="modalEdit" @ok="handleOk" />
    </a-card>
  </template>

<script>
import '../../plugins/bootstrap-table'
import SummernoteUpdateModal from './modules/SummernoteUpdateModal'
import StepByStepQuestionModal from './modules/StepByStepQuestionModal'
import QuestionEditModal from './modules/QuestionEditModal'
// eslint-disable-next-line no-unused-vars
import { questionUpdate, getQuestionSelection, getQuestionAll} from '../../api/exam'
import $ from 'jquery'
import QuestionViewModal from './modules/QuestionViewModal'
export default {
  name: 'QuestionTableList',
  components: {
    QuestionViewModal,
    SummernoteUpdateModal,
    StepByStepQuestionModal,
    QuestionEditModal
  },
  data() {
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
          title: 'Tên câu hỏi',
          field: 'name',
          width: 200,
          // eslint-disable-next-line no-unused-vars
          formatter: (value, row) => {
            return '<div class="question-name" style="height: 100%;width: 100%">' + value + '</div>'
          },
          events: {
            // eslint-disable-next-line no-unused-vars
            'click .question-name': function (e, value, row, index) {
              that.$refs.questionUpdateModal.edit('summernote-question-name-update', row, 'name', 'Cập nhật tên câu hỏi', questionUpdate)
            }
          }
        },
        {
          title: 'Nội dung câu hỏi',
          field: 'description',
          width: 200,
          // eslint-disable-next-line no-unused-vars
          formatter: (value, row) => {
            return '<div class="question-desc">' + value + '</div>'
          },
          events: {
            // eslint-disable-next-line no-unused-vars
            'click .question-desc': function (e, value, row, index) {
              that.$refs.questionUpdateModal.edit('summernote-question-desc-update', row, 'description', 'Cập nhật nội dung câu hỏi', questionUpdate)
            }
          }
        },
        {
          title: 'Điểm',
          field: 'score',
          // eslint-disable-next-line no-unused-vars
          formatter: (value, row) => {
            return '<div class="question-score">' + value + '</div>'
          },
          events: {
            // eslint-disable-next-line no-unused-vars
            'click .question-score': function (e, value, row, index) {
              const $element = $(e.target)
              $element.html('<input type="text" value="' + value + '">')
            }
          }
        },
        {
          title: 'Người tạo',
          field: 'creator'
        },
        {
          title: 'Level',
          field: 'level',
          // eslint-disable-next-line no-unused-vars
          formatter: (value, row) => {
            return '<div class="question-level">' + value + '</div>'
          },
          events: {
            // eslint-disable-next-line no-unused-vars
            'click .question-level': function (e, value, row, index) {
              const $element = $(e.target) 
              if ($element.children().length > 0) return 
              getQuestionSelection().then(res => {
                console.log(res)
                if (res.code === 0) {
                  console.log(res.data)
                  const levels = res.data.levels
                  let inner = '<select>'
                  for (let i = 0; i < levels.length; i++) {
                    if (levels[i].description === value) {
                      inner += '<option value ="' + levels[i].id + '" name="' + levels[i].name + '" selected="selected">' + levels[i].description + '</option>'
                    } else {
                      inner += '<option value ="' + levels[i].id + '" name="' + levels[i].name + '">' + levels[i].description + '</option>'
                    }
                  }
                  inner += '</select>'
                  $element.html(inner)
                } else {
                  that.$notification.error({
                    message: 'Không thể nhận được các tùy chọn câu hỏi',
                    description: res.msg
                  })
                }
              })
            }
          }
        },
        {
          title: 'Thể loại',
          field: 'type',
          // eslint-disable-next-line no-unused-vars
          formatter: (value, row) => {
            return '<div class="question-type">' + value + '</div>'
          },
          events: {
            // eslint-disable-next-line no-unused-vars
            'click .question-type': function (e, value, row, index) {
              const $element = $(e.target) 
              if ($element.children().length > 0) return 
              getQuestionSelection().then(res => {
                console.log(res)
                if (res.code === 0) {
                  console.log(res.data)
                  const types = res.data.types
                  let inner = '<select>'
                  for (let i = 0; i < types.length; i++) {
                    if (types[i].description === value) {
                      inner += '<option value ="' + types[i].id + '" name="' + types[i].name + '" selected="selected">' + types[i].description + '</option>'
                    } else {
                      inner += '<option value ="' + types[i].id + '" name="' + types[i].name + '">' + types[i].description + '</option>'
                    }
                  }
                  inner += '</select>'
                  $element.html(inner)
                } else {
                  that.$notification.error({
                    message: 'Không thể nhận được các thể loại câu hỏi',
                    description: res.msg
                  })
                }
              })
            }
          }
        },
        {
          title: 'Phân loại',
          field: 'category',
          // eslint-disable-next-line no-unused-vars
          formatter: (value, row) => {
            return '<div class="question-category">' + value + '</div>'
          },
          events: {
            // eslint-disable-next-line no-unused-vars
            'click .question-category': function (e, value, row, index) {
              const $element = $(e.target)
              if ($element.children().length > 0) return 
              getQuestionSelection().then(res => {
                console.log(res)
                if (res.code === 0) {
                  console.log(res.data)
                  const categories = res.data.categories
                  let inner = '<select>'
                  for (let i = 0; i < categories.length; i++) {
                    if (categories[i].name === value) {
                      inner += '<option value ="' + categories[i].id + '" name="' + categories[i].description + '" selected="selected">' + categories[i].name + '</option>'
                    } else {
                      inner += '<option value ="' + categories[i].id + '" name="' + categories[i].description + '">' + categories[i].name + '</option>'
                    }
                  }
                  inner += '</select>'
                  $element.html(inner)
                } else {
                  that.$notification.error({
                    message: 'Không thể nhận được các tùy chọn câu hỏi',
                    description: res.msg
                  })
                }
              })
            }
          }
        },
        {
          title: 'Ngày tạo',
          field: 'updateTime',
          align: 'left',
          formatter: (value) => {
            return '<div class="text-nowrap">' + value + '</div>';
          }
        },
        {
          title: 'Hành động',
          field: 'action',
          align: 'center',
          // eslint-disable-next-line no-unused-vars
          formatter: (value, row) => {
            // return '<button type="button" class="btn btn-success view-question">Chi tiết</button>' +
            //   '&nbsp;&nbsp;' +
            //   '<button type="button" class="btn btn-success edit-question">Chỉnh sửa</button>'
            return `
                <div class="btn-group">
                  <button type="button" class="btn btn-success view-question mr-1 text-nowrap">Chi tiết</button>
                  <button type="button" class="btn btn-success edit-question text-nowrap">Chỉnh sửa</button>
                </div>
              `;
          },
          events: {
            // eslint-disable-next-line no-unused-vars
            'click .view-question': function (e, value, row, index) {
              that.handleSub(row)
            },
            // eslint-disable-next-line no-unused-vars
            'click .edit-question': function (e, value, row, index) {
              that.handleEdit(row)
            }
          }
        }
      ],
      tableData: [],
      options: {
        search: true,
        showColumns: true,
        showExport: true,
        pagination: true,
        toolbar: '#toolbar',
        advancedSearch: true,
        idTable: 'advancedTable',
        // onClickRow: that.clickRow,
        // onClickCell: that.clickCell 
        onDblClickCell: that.dblClickCell 
      }
    }
  },
  mounted () {
    this.loadAll() 
    //Tải dữ liệu cho tất cả các câu hỏi
  },
  methods: {
    handleEdit (record) {
      this.$refs.modalEdit.edit(record)
    },
    handleSub (record) { 
      // Xem câu hỏi
      console.log(record)
      this.$refs.modalView.edit(record)
    },
    handleOk () {
      this.loadAll()// Tải dữ liệu cho tất cả câu hỏi
    },
    dblClickCell (field, value, row, $element) {
      if (field === 'score') { // Cập nhật
        const childrenInput = $element.children('.question-score').children('input') 
        if (childrenInput.length === 0) return
        row.score = childrenInput[0].value
        const that = this
        questionUpdate(row).then(res => {
          // Chuyển đến trang kết quả nếu thành công
          console.log(res)
          if (res.code === 0) {
            $element.children('.question-score').text(row.score)
            that.$notification.success({
              message: 'Thành công',
              description: 'Hoàn thành cập nhật'
            })
          }
        })
      }

      if (field === 'level') { 
        const childrenSelect = $element.children('.question-level').children('select')
        if (childrenSelect.length === 0) return
        const optionSelected = $(childrenSelect[0]).find('option:selected')
        row.levelId = optionSelected.val()
        console.log(row.levelId)
        row.level = optionSelected.text()
        console.log(row.level)
        const that = this
        questionUpdate(row).then(res => {
          console.log(res)
          if (res.code === 0) {
            $element.children('.question-level').text(row.level)
            that.$notification.success({
              message: 'Thành công',
              description: 'Hoàn thành cập nhật'
            })
          }
        })
      }

      if (field === 'type') {
        const childrenSelect = $element.children('.question-type').children('select') 
        if (childrenSelect.length === 0) return
        const optionSelected = $(childrenSelect[0]).find('option:selected')
        row.typeId = optionSelected.val()
        row.type = optionSelected.text()
        const that = this
        questionUpdate(row).then(res => {
          console.log(res)
          if (res.code === 0) {
            $element.children('.question-type').text(row.type)
            that.$notification.success({
              message: 'Thành công',
              description: 'Hoàn thành cập nhật'
            })
          }
        })
      }

      if (field === 'category') { 
        const childrenSelect = $element.children('.question-category').children('select') 
        console.log(childrenSelect)
        if (childrenSelect.length === 0) return
        const optionSelected = $(childrenSelect[0]).find('option:selected')
        row.categoryId = optionSelected.val()
        row.category = optionSelected.text()
        const that = this
        questionUpdate(row).then(res => {
          console.log(res)
          if (res.code === 0) {
            $element.children('.question-category').text(row.category)
            that.$notification.success({
              message: 'Thành công',
              description: 'Hoàn thành cập nhật'
            })
          }
        })
      }
    },
    loadAll () {
      const that = this
      getQuestionAll()
        .then(res => {
          if (res.code === 0) {
            that.tableData = res.data
            that.$refs.table._initTable()
          } else {
            that.$notification.error({
              message: 'Không thể lấy được danh sách tất cả các câu hỏi',
              description: res.msg
            })
          }
        })
    }
  }
  
}
</script>