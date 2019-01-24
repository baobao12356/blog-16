
// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  "proxy": {
    "/api": {
      "target": "http://localhost:5050",
      "changeOrigin": true,
      "pathRewrite": { "api": "/" }
    }
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: false,
      dva: true,
      dynamicImport: false,
      title: 'Ada - Blog',
      dll: false,
      routes: {
        exclude: [
        
          /components\//,
        ],
      },
    }],
  ],
}
