<template>
	<div>
		<el-tabs type="border-card" stretch="true">
			<!-- <el-tab-pane label="用户管理"> </el-tab-pane> -->

			<div class="user">
				<div class="add">
					<el-button type="primary" @click="openDialog"
						>添加用户
					</el-button>
				</div>
				<el-table
					:data="userTableData"
					style="width: 100%; margin-top: 15px"
				>
					<el-table-column
						v-for="i in tableColumn"
						:key="i.label"
						:label="i.label"
						:property="i.prop"
						align="center"
						width="auto"
					/>

					<el-table-column align="center" label="操作">
						<template #default="scope">
							<!-- @click="openDialog(false, scope.row)" -->
							<el-button size="small">修改 </el-button>
							<el-popconfirm
								title="确认删除该用户吗？"
								@confirm.prevent="deleteCancel(scope)"
							>
								<template #reference>
									<el-button text size="small" type="danger">
										删除</el-button
									>
								</template>
							</el-popconfirm>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</el-tabs>
		<el-dialog title="删除角色" v-model="dial" width="30%">
			<span>此操作将永久删除角色，是否继续？</span>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="dial = false">取 消</el-button>
					<el-button type="primary" @click="cilkdial"
						>确 定</el-button
					>
				</span>
			</template>
		</el-dialog>

		<el-dialog
			v-model="dialogVisible"
			:title="dialogTitle"
			draggable
			destroy-on-close
		>
			<el-form
				inline
				label-width="120px"
				ref="ruleFormRef"
				:model="userInfo"
				:rules="rules"
				class="demo-ruleForm"
				size="default"
				status-icon
			>
				<template style="display: flex">
					<el-form-item label="用户名" prop="name">
						<el-input
							v-model="userInfo.name"
							placeholder="请输入用户名"
						/>
					</el-form-item>

					<el-form-item label="密码" prop="password">
						<el-input
							v-model="userInfo.password"
							autocomplete="off"
							placeholder="请输入密码"
							type="password"
							show-password
						/>
					</el-form-item>
				</template>

				<template style="display: flex">
					<el-form-item label="电话" prop="phoneNum">
						<el-input
							v-model="userInfo.phoneNum"
							autocomplete="off"
							placeholder="请输入电话"
							onblur="this.reg=/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/;/*修改正则表达式即可*/if(!this.reg.test(this.value)){this.value='';this.placeholder='请输入正确的手机号';}"
						/>
					</el-form-item>

					<el-form-item label="权限" prop="permission">
						<el-select
							v-model="userInfo.permission"
							placeholder="修改权限"
						>
							<el-option label="普通用户" value="user" />
							<el-option label="管理员" value="admin" />
						</el-select>
					</el-form-item>
				</template>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="dialogVisible = false">取消</el-button>
					<el-button type="primary" @click="addUser(ruleFormRef)"
						>确定</el-button
					>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';

const tableColumn = ref([
	{
		label: 'ID',
		prop: 'account',
	},
	{
		label: '用户名',
		prop: 'name',
	},
	{
		label: '电话号码',
		prop: 'phoneNum',
	},
	{
		label: '用户权限',
		prop: 'permission',
	},
]);
const ruleFormRef = ref();
//表单校验
const rules = reactive({
	name: [
		{
			required: true,
			message: '请填写用户名！',
			trigger: 'change',
		},
	],
	password: [
		{
			required: true,
			message: '请填写密码！',
			trigger: 'change',
		},
	],
});

const userInfo = reactive({
	account: '',
	name: '',
	password: '',
	phoneNum: '',
	permission: 'user',
	sex: '',
});

const userTableData = reactive([
	{
		account: '1',
		sex: '男',
		name: '嘻嘻笑',
		phoneNum: '123333',
		permission: 'user',
		describe: '规定时间内完成三维模型',
	},
]);
const dialogVisible = ref(false);
const dialogTitle = ref('添加用户');

const addUser = async (formEl) => {
	if (!formEl) return;
	const formRes = await formEl.validate();
	if (formRes) {
		ElMessage.success('用户创建成功！');
		dialogVisible.value = false;
		formEl.resetFields();
	} else {
		ElMessage.error('用户创建失败，请将内容补充完整！');
	}
};

function openDialog() {
	dialogVisible.value = true;
}

function deleteCancel(scope) {
	console.log(scope, 'scope');
}
</script>

<style scoped lang="less">
.input_Class {
	display: flex;
}

.add {
	display: flex;
}

.header {
	display: flex;
	align-items: center;
	width: 60px;
	height: 30px;
}

.input_width {
	width: 200px;
}
</style>
