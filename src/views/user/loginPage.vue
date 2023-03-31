<template>
  <div class="login">
    <div class="login-box" v-loading="loading" element-loading-text="登录中...">
      <h2>Login</h2>
      <form>
        <div class="user-box">
          <input type="text" v-model="user.username" required="" />
          <label>用户名</label>
        </div>
        <div class="user-box">
          <input type="text" v-model="user.password" required="" />
          <label>密码</label>
        </div>
        <a @click="login" class="loginBtn">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          登录
        </a>
      </form>
    </div>
  </div>
</template>

<script setup>
import "../../assets/css/login.less";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
const loading = ref(false);
const router = useRouter();
const user = ref({
  username: "",
  password: "",
});

const login = () => {
  if (user.value.username === "" || user.value.password === "") {
    ElMessage.error("用户名或密码不能为空");
    return;
  }
  if (user.value.password.length < 6) {
    ElMessage.error("密码长度不能小于6位");
    return;
  }
  loading.value = true;
  if (user.value.username && user.value.password) {
    router.push({
      path: "/home",
    });
    ElMessage.success("登陆成功！");
    loading.value = false;
  } else {
    ElMessage.error("登陆失败！");
  }
};

document.onkeydown = function (e) {
  //对整个页面监听
  const keyNum = window.event ? e.keyCode : e.which; //获取被按下的键值
  if (keyNum === 13 && !loading.value) {
    login();
  }
};
</script>

<style scoped lang="less">
.loginBtn {
  display: flex !important;
  width: 50%;
  justify-content: center;
  margin: 40px auto 0 auto;
}
</style>
