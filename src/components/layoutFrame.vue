<template>
	<div class="common-layout">
		<el-container>
			<el-header>
				<el-menu
					background-color="#545c64"
					text-color="#fff"
					active-text-color="#ffd04b"
					:default-active="activePath"
					class="el-menu-demo"
					router
					mode="horizontal"
					@select="handleSelect"
				>
					<el-menu-item index="/ManageFlow">
						<el-icon>
							<HomeFilled />
						</el-icon>
						<template #title><span>首页</span></template>
					</el-menu-item>
				</el-menu>
				<div class="rightMenu">
					<el-badge :value="notice" class="item">
						<img
							src="../assets/img/notice.png"
							style="width: 30px; height: 30px"
						/>
					</el-badge>

					<el-dropdown>
						<span class="el-dropdown-link" style="cursor: pointer">
							<el-avatar style="margin-right: 10px"
								>用户</el-avatar
							>
						</span>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item @click="logout"
									>退出登录</el-dropdown-item
								>
								<el-dropdown-item @click="userCenter"
									>用户中心</el-dropdown-item
								>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
				</div>
			</el-header>

			<el-container>
				<el-aside width="auto"> </el-aside>
				<el-main> <router-view /> </el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import '../assets/css/layout.less';
import { useRouter } from 'vue-router';

const router = useRouter();
const activePath = ref('/:catchAll(.*)');
const selectTitle = ref('任务管理');
const notice = ref(1);

const handleSelect = (key) => {
	activePath.value = key;
	window.sessionStorage.setItem('activePath', key);
	changeTitle(key);
};
activePath.value = window.sessionStorage.getItem('activePath') || '';

const changeTitle = (key) => {
	switch (key) {
		case '/workList':
			selectTitle.value = '任务列表';
			break;
	}
};
const logout = () => {
	router.push({ path: '/login' });
};
const userCenter = () => {
	router.push({ path: '/userCenter' });
};
</script>

<style scoped lang="less">
.demo-type {
	display: flex;
}
.demo-type > div {
	flex: 1;
	text-align: center;
}

.demo-type > div:not(:last-child) {
	border-right: 1px solid var(--el-border-color);
}
</style>
