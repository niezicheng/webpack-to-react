module.exports = {
  root: true,
  // parser 用于指定解析器， eslint 本身无法解析es6语法，需要转换成babel-eslint
  parser: "babel-eslint",
  // eslint 碰到 browser 和 es6 对象不用报 undefined
  env: {
    browser: true,
    es6: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module"
  },
  // extends 表示以airbnb为基础规范
  extends: ["airbnb", "prettier"],
  // 指定扩展规范规则，会覆盖airbnb规则中的配置
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
  }
};

