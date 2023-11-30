import Vue from 'vue'
import VueStorage from 'vue-ls'
import config from '../config/defaultSettings'


import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'
import VueCropper from 'vue-cropper'
import Viser from 'viser-vue'

Vue.use(Antd)
Vue.use(VueStorage, config.storageOptions)
Vue.use(VueCropper)
Vue.use(Viser)