import Vue from 'vue'
import router from './router'
import store from './store'

import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from './utils/domUtil'
import { ACCESS_TOKEN } from './store/mutation-types'


NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['login', 'register', 'registerResult'] // no redirect whitelist,

router.beforeEach((to, from, next) => {
    NProgress.start() // start progress bar
    to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${domTitle}`))
    if (Vue.ls.get(ACCESS_TOKEN)) {
        console.log("has token")
        /* has token*/
        if (to.path === '/user/login') {
            console.log("redirect to dashboard/workplace")
            // Nếu người dùng muốn truy cập vào giao diện đăng nhập thì nhảy thẳng về trang chủ
            next({ path: '/dashboard/workplace' })
            NProgress.done()
        } else {
            console.log("has token and not login")
           // Người dùng đã đăng nhập và không truy cập trang đăng nhập, sau đó thực hiện xác minh quyền để xem người dùng có quyền truy cập trang này hay không.
            if (store.getters.roles.length === 0) { // Nếu store chưa có thuộc tính vai trò của người dùng (bạn có thể thấy Vuex trong thành phần Chrome của Vue) thì hãy request
                console.log("store.getters.roles.length === 0")
                store
                    .dispatch('GetInfo') 
                    // Sau khi đăng nhập, truy cập bất kỳ trang nào ngoài đăng nhập trước tiên sẽ gọi phương thức GetInfo để xem quyền của người dùng có đủ điều kiện để truy cập hay không.
                    .then(res => {
                        const roles = res.data && res.data.role
                        //Phản hồi không trống và chứa thuộc tính vai trò
                        console.log(roles ? "roles is not null" : "roles is null")
                        store.dispatch('GenerateRoutes', { roles }).then(() => { 
                            // Duyệt qua các vai trò và tạo ra các tuyến đường
                            // Tạo bảng định tuyến có thể truy cập dựa trên quyền của vai trò
                            // Tự động thêm bảng định tuyến có thể truy cập
                            router.addRoutes(store.getters.addRouters)
                            console.log(store.getters.newRouters)
                            const redirect = decodeURIComponent(from.query.redirect || to.path)
                            if (to.path === redirect) {
                              // phương thức hack để đảm bảo addRoutes đã được hoàn thành, đặt thay thế: true để điều hướng sẽ không để lại bản ghi lịch sử
                                // next({ ...to, replace: true })
                                router.push({ path: redirect })
                            } else {   
                                    //Chuyển đến tuyến đường đích
                                // next({ path: redirect })
                                router.push({ path: redirect })
                            }
                        })
                    })
                    .catch((error) => {
                        notification.error({
                            message: 'Lỗi !!!',
                            description: 'Yêu cầu thông tin người dùng không thành công, xin vui lòng thử lại'
                        })
                        console.log(error)
                        store.dispatch('Logout').then(() => {
                            next({ path: '/user/login', query: { redirect: to.fullPath } })
                        })
                    })
            } else {
                next()
            }
        }
    } else {
        if (whiteList.includes(to.name)) { 
            // Trong whitelist không cần đăng nhập, nhập trực tiếp
            next()
        } else {
            next({ path: '/user/login', query: { redirect: to.fullPath } })
            NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
        }
    }
})

router.afterEach(() => {
    NProgress.done() // finish progress bar
  })