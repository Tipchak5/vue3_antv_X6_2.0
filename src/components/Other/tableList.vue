<template>
	<el-table :data="props.tableData" border style="width: 100%">
		<el-table-column prop="id" label="编号" width="80" align="center" />
		<el-table-column prop="name" label="名称" align="center" />
		<el-table-column prop="manager" label="项目负责人" align="center" />
		<el-table-column prop="state" label="项目状态" align="center" />
		<el-table-column
			prop="secretGrade"
			label="密级"
			width="80"
			align="center"
		/>
		<el-table-column prop="describe" label="项目描述" align="center" />
		<el-table-column label="操作" align="center">
			<!--  #default="scope" -->
			<template #default="scope">
				<el-icon :size="25"><VideoPlay /></el-icon>
				<el-icon :size="25"><SwitchButton /></el-icon>
				<el-button size="small" type="primary" @click="checkInfo(scope)"
					>查看详情</el-button
				>
			</template>
		</el-table-column>
	</el-table>
</template>

<script setup>
import { defineProps } from 'vue';
import { VideoPlay, SwitchButton } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
const props = defineProps({
	tableData: {
		type: Array,
	},
});
// console.log(props.tableData, "props");
const router = useRouter();
const checkInfo = (scope) => {
	router.push({ path: '/ManageFlow', query: { nodeName: scope.row.name } });
};
// const addTask = () => {};
</script>

<style scoped lang="less">
.el-table--border {
	margin-top: 10px;
}

/deep/ .cell {
	display: flex !important;
	align-items: center;
	justify-content: center;
}
.el-icon {
	cursor: pointer;
}
</style>
