import '@antv/x6-vue-shape';
// import { Graph } from '@antv/x6';
import { ElMessage } from 'element-plus';

let count = 0;
export const startDragToGraph = (graph, type) => {
	let node = null;

	node = graph.addNode({
		shape: 'custom-rect',
		attrs: {
			label: {
				text: type,
				// 自动换行
				textWrap: {
					width: '90%',
					height: '80%',
					ellipsis: true,
					breakWord: true,
				},
			},
		},

		x: -50,
		y: -50,
		id: `task${++count}`, // 设置节点id
	});

	ElMessage.success(`添加任务节点${node.id}成功！`);
	return node;
};

// 控制连接桩显示/隐藏
export function showPorts(ports, show) {
	for (let i = 0, len = ports.length; i < len; i = i + 1) {
		ports[i].style.visibility = show ? 'visible' : 'hidden';
	}
}

// 重置所有节点
export function reset(graph) {
	const nodes = graph.getNodes();
	const edges = graph.getEdges();

	nodes.forEach((node) => {
		node.attr('body/stroke', 'black');
	});
	edges.forEach((edge) => {
		edge.attr('line/stroke', 'black');
	});
}

// 树形目录中删除对应节点
export const deleteNodeById = (treeArr, keyArr) => {
	let deleted = false;
	for (let i = treeArr.length - 1; i >= 0; i--) {
		const node = treeArr[i];
		if (keyArr.includes(node.label)) {
			treeArr.splice(i, 1);
			deleted = true;
		} else if (node.children && node.children.length) {
			if (deleteNodeById(node.children, keyArr)) {
				deleted = true;
				if (node.children.length === 0) {
					node.children = [];
				}
			}
		}
	}
	return deleted;
};

// 树形目录中添加节点
export const findNodeById = (nodes, id) => {
	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[i];
		if (node.label === id) {
			return node;
		}
		if (node.children) {
			const result = findNodeById(node.children, id);
			if (result) {
				return result;
			}
		}
	}
	return null;
};

// 重置表单
export const resetForm = (formEl) => {
	if (!formEl) return;
	formEl.resetFields();
};
