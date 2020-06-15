import React from "react";
import { hot } from "react-hot-loader/root";
import avatar from "./assets/favicon.jpg";

function App() {
  return (
    <div>
      <h1>这是个简单的app</h1>
      <img src={avatar} alt="avatar" />
    </div>
  );
}

// 使用hot函数装饰App组件
export default hot(App);
