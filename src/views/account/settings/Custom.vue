<!-- eslint-disable vue/multi-word-component-names -->
<script>
import { colorList } from '../../../components/SettingDrawer/settingConfig'
import ASwitch from 'ant-design-vue/es/switch'
import AList from 'ant-design-vue/es/list'
import AListItem from 'ant-design-vue/es/list/Item'
import { mixin } from '../../../utils/mixin'

const Meta = AListItem.Meta

export default {
  components: {
    AListItem,
    AList,
    ASwitch,
    Meta
  },
  mixins: [mixin],
  data () {
    return {
    }
  },
  filters: {
    themeFilter (theme) {
      const themeMap = {
        'dark': 'Tối',
        'light': 'Sáng'
      }
      return themeMap[theme]
    }
  },
  methods: {
    colorFilter (color) {
      const c = colorList.filter(o => o.color === color)[0]
      return c && c.key
    },

    onChange (checked) {
      if (checked) {
        this.$store.dispatch('ToggleTheme', 'dark')
      } else {
        this.$store.dispatch('ToggleTheme', 'light')
      }
    }
  },
  render () {
    return (
      <AList itemLayout="horizontal">
        <AListItem>
          <Meta>
            <a slot="title">Phối màu phong cách</a>
            <span slot="description">
                Cài đặt màu sắc phong cách tổng thể
            </span>
          </Meta>
          <div slot="actions">
            <ASwitch checkedChildren="Tối" unCheckedChildren="Sáng" defaultChecked={this.navTheme === 'dark' && true || false} onChange={this.onChange} />
          </div>
        </AListItem>
        <AListItem>
          <Meta>
            <a slot="title">Màu chủ đề</a>
            <span slot="description">
              Màu kiểu trang： <a domPropsInnerHTML={ this.colorFilter(this.primaryColor) }/>
            </span>
          </Meta>
        </AListItem>
      </AList>
    )
  }
}
</script>

<style scoped>

</style>
