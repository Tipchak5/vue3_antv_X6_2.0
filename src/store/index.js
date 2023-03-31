import { createStore } from "vuex";

export default createStore({
  state: {
    projectList: [
      {
        id: "1",
        date: ['2023-05-03', '2023-05-04'],
        name: "制定三维模型",
        manager: "段xx",
        state: "未完成", // 进行中 已结束、
        secretGrade: "一级",
        describe: "规定时间内完成三维模型",
        progress: 25,
      },
    ],
  },
  mutations: {
    upDateProjectList(state, data) {
      state.projectList.push(data);
      console.log(state.projectList, "vuex");
    },
  },
  // 异步操作
  actions: {},
  modules: {},
});
