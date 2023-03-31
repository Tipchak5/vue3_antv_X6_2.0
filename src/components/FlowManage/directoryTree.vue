<template>
	<div class="directoryTree">
		<h3>树形目录</h3>
		<el-tree
			ref="treeRef"
			class="filter-tree div_part hiddenScroll"
			:data="props.treeInfo"
			:props="defaultProps"
			:filter-node-method="filterNode"
			default-expand-all="true"
			:default-checked-keys="[0]"
			@node-click="emitEvent"
		/>
	</div>
</template>

<script setup>
import { defineEmits, onMounted, defineProps } from 'vue';

const props = defineProps({
	treeInfo: Array,
});
//  向父组件发送被点击的节点信息
const emit = defineEmits(['emitEvent']);
const emitEvent = (data) => {
	emit('emitEvent', data);
};

const defaultProps = {
	children: 'children',
	label: 'label',
};

onMounted(() => {});
</script>

<style scoped lang="less"></style>
