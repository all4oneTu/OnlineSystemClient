# vuejs2_frontend
## Cấu trúc project
### Frontend
```
.  
├── docs  
│   ├── versions.md    // thư mục chứa file migrations  
│   └── webpack.md
├── node_modules
├── public
├── src 
│   ├── api         // các file api được đặt trong này
│   ├── assets      // lưu trữ hình ảnh, svg, font
│   ├── components      // các thành phần giao diện người dùng
│   ├── config        // chứa file config load
│   ├── router        // các router chính của dự án
│   ├── views       // các layout chính của dự án
│   ├── App.vue       // trang gốc của dự án
│   └── main.js     // cấu hình chính của toàn bộ project  
├── tests  
├── .gitignore  
├── alembic.ini  
├── docker-compose.yaml  
├── Dockerfile  
├── env.example  
├── README.md
├── package.js   // file chứa các thư viện để cài đặt qua pip install
└── vue.config.js    
```
## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
