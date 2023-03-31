import { createRouter, createWebHistory } from 'vue-router';
import Layout from '../views/mainLayout.vue';
import Login from '../views/user/loginPage.vue';
// import ManageFlow from '../views/task/manageFlow.vue';

const routes = [
	{
		path: '/Login',
		name: 'Login',
		component: Login,
		meta: {
			title: '登录',
		},
	},
	{
		path: '/:catchAll(.*)',
		component: Layout,
		children: [
			{
				path: '/',
				name: 'ManageFlow',
				meta: {
					title: '任务详情',
				},
				component: () => import('../views/task/manageFlow.vue'),
			},

			{
				path: '/:catchAll(userCenter)',
				name: 'UserCenter',
				meta: {
					title: '用户中心',
				},
				component: () => import('../views/user/userCenter.vue'),
			},
		],
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

export default router;
