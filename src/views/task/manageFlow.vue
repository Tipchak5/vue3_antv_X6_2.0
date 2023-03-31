<template>
	<div class="manageFlow">
		<DirectoryTree
			class="treeImg"
			:treeInfo="treeInfo"
			@emitEvent="handleEmitEvent"
		/>
		<div class="graphBox">
			<p class="taskTitle">
				<el-button
					type="primary"
					:icon="Plus"
					:title="task"
					@mousedown="startDrag(task, $event)"
					>新增{{ task }}</el-button
				>
				<el-button type="primary" @click="exportPNG">导出PNG</el-button>
				<el-button type="primary" @click="printNodeList"
					>导出JSON</el-button
				>
				<!-- <el-button type="primary" @click="changeStyle"
					>修改node1</el-button
				> -->
				<el-button type="primary" @click="leadInMasterplate"
					>插入模版</el-button
				>
			</p>

			<div class="graph">
				<div id="container" class="container" style="flex: 1">
					<div id="graph-container" class="graph-container"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import {
	startDragToGraph,
	showPorts,
	reset,
	deleteNodeById,
	findNodeById,
} from '../../js/methods.js';
import '../../assets/css/manageFlow.less';
import { Plus } from '@element-plus/icons-vue';
import DirectoryTree from '../../components/FlowManage/directoryTree.vue';
import { onMounted, ref, reactive, onUnmounted } from 'vue';
import { Graph, Shape, DataUri } from '@antv/x6';
import { Export } from '@antv/x6-plugin-export';
import { Selection } from '@antv/x6-plugin-selection';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { Clipboard } from '@antv/x6-plugin-clipboard';
import { History } from '@antv/x6-plugin-history';
import { Transform } from '@antv/x6-plugin-transform';

const isTask = ref(false);
let graph;
const tsakMasterplate = ref(require('../../assets/masterplate.json')); // 引入模版数据
// 连接桩
const ports = {
	groups: {
		top: {
			position: 'top',
			attrs: {
				circle: {
					r: 2,
					magnet: true,
					stroke: 'black',
					strokeWidth: 1,
					fill: '#fff',
					style: {
						visibility: 'hidden',
					},
				},
			},
		},
		right: {
			position: 'right',
			attrs: {
				circle: {
					r: 2,
					magnet: true,
					stroke: 'black',
					strokeWidth: 1,
					fill: '#fff',
					style: {
						visibility: 'hidden',
					},
				},
			},
		},
		bottom: {
			position: 'bottom',
			attrs: {
				circle: {
					r: 2,
					magnet: true,
					stroke: 'black',
					strokeWidth: 1,
					fill: '#fff',
					style: {
						visibility: 'hidden',
					},
				},
			},
		},
		left: {
			position: 'left',
			attrs: {
				circle: {
					r: 2,
					magnet: true,
					stroke: 'black',
					strokeWidth: 1,
					fill: '#fff',
					style: {
						visibility: 'hidden',
					},
				},
			},
		},
	},
	items: [
		{
			group: 'top',
		},
		{
			group: 'right',
		},
		{
			group: 'bottom',
		},
		{
			group: 'left',
		},
	],
};

const data = {
	nodes: [
		{
			id: 'node1',
			attrs: {
				body: {
					strokeWidth: 1,
					rx: 20,
					ry: 26,
				},
				label: {
					text: '任务节点',
					textWrap: {
						// 自动换行
						width: '90%',
						height: '80%',
						ellipsis: true,
						breakWord: true,
					},
				},
				div: {
					style: {
						width: '100%',
						height: '100%',
						padding: '10px',
						boxSizing: 'border-box',
						whiteSpace: 'pre-wrap',
					},
				},
			},
			width: 100,
			height: 40,
			ports: { ...ports },
		},
	],
};
const treeInfo = ref([
	{
		label: '任务节点',
		children: [],
	},
]);
const id = ref();

const task = ref('任务');
const ruleForm = reactive({
	type: '',
	name: '',
	date: '',
	assign: '',
	copyValue: '',
	priority: '',
	desc: '',
	attachments: [],
});

const nodeLabel = ref('任务一');

onMounted(() => {
	init();

	// 快捷键与事件
	graph.bindKey(['meta+c', 'ctrl+c'], () => {
		const cells = graph.getSelectedCells();
		if (cells.length) {
			graph.copy(cells);
		}
		return false;
	});
	graph.bindKey(['meta+x', 'ctrl+x'], () => {
		const cells = graph.getSelectedCells();
		if (cells.length) {
			graph.cut(cells);
		}
		return false;
	});
	graph.bindKey(['meta+v', 'ctrl+v'], () => {
		if (!graph.isClipboardEmpty()) {
			const cells = graph.paste({ offset: 32 });
			graph.cleanSelection();
			graph.select(cells);
		}
		return false;
	});
	graph.bindKey(['meta+z', 'ctrl+z'], () => {
		if (graph.canUndo()) {
			graph.undo();
		}
		return false;
	});
	graph.bindKey(['meta+shift+z', 'ctrl+shift+z'], () => {
		if (graph.canRedo()) {
			graph.redo();
		}
		return false;
	});
	graph.bindKey(['meta+a', 'ctrl+a'], () => {
		const nodes = graph.getNodes();
		if (nodes) {
			graph.select(nodes);
		}
	});
	graph.bindKey(['ctrl+1', 'meta+1'], () => {
		const zoom = graph.zoom();
		if (zoom < 1.5) {
			graph.zoom(0.1);
		}
	});
	graph.bindKey(['ctrl+2', 'meta+2'], () => {
		const zoom = graph.zoom();
		if (zoom > 0.5) {
			graph.zoom(-0.1);
		}
	});
	graph.on('node:mouseenter', () => {
		const container = document.getElementById('graph-container');
		const ports = container.querySelectorAll('.x6-port-body');
		showPorts(ports, true);
	});
	graph.on('node:mouseleave', () => {
		const container = document.getElementById('graph-container');
		const ports = container.querySelectorAll('.x6-port-body');
		showPorts(ports, false);
	});

	/** 双击节点 文本编辑 */
	graph.on('cell:dblclick', ({ cell, e }) => {
		const isNode = cell.isNode();
		const name = cell.isNode() ? 'node-editor' : 'edge-editor';
		cell.removeTool(name);
		cell.addTools({
			name,
			args: {
				event: e,
				attrs: {
					backgroundColor: isNode ? '#EFF4FF' : '#FFF',
				},
			},
		});
	});

	/** 删除的一些操作 */
	graph.bindKey(['delete', 'backspace'], () => {
		const cells = graph.getSelectedCells();
		const cellsId = cells[0].id;

		if (cells.length) {
			const allChildrenNode = [];
			const nodes = cells.filter((cell) => cell.isNode());
			nodes.forEach((node) => {
				//  获取后继单元格
				const successors = graph.getSuccessors(node, { depth: 3 });
				allChildrenNode.push(...successors);
				console.log(successors, 'successors');
			});
			// 获取后继节点id
			let keyArr = [];
			allChildrenNode.forEach((i) => {
				keyArr.push(i.id);
			});

			// 删除当前节点
			graph.removeCells(cells);
			removeNodes(keyArr);
			// 如果删除的节点和其他节点有共同子节点时 删除书目录中对应的数据
			let newArr = [...keyArr, cellsId]; // 要删除的节点id
			// 删除对应树目录数据
			deleteNodeById(treeInfo.value[0].children, newArr);
			console.log(newArr, 'newArr');
		}
	});

	graph.on('node:click', ({ node }) => {
		isTask.value = true;
		reset(graph);
		node.attr('body/stroke', 'orange');
		clickNode(node);
		nodeLabel.value = node.label;
	});

	graph.on('edge:click', ({ edge }) => {
		reset(graph);
		console.log(edge, 'edge');
		edge.attr('line/stroke', 'orange');
	});

	// 节点连接成功时
	graph.on('edge:connected', ({ isNew, edge }) => {
		if (isNew) {
			const sourceId = edge.getSourceCell().id;
			const targetId = edge.getTargetCell().id;

			const sourceNode = findNodeById(
				treeInfo.value[0].children,
				sourceId
			);

			const targetNode = findNodeById(
				treeInfo.value[0].children,
				targetId
			);

			if (sourceNode && targetNode) {
				sourceNode.children.push(targetNode);
				// push之后删除原targetNode
				for (let i = 0; i < treeInfo.value[0].children.length; i++) {
					const node = treeInfo.value[0].children[i];
					if (node.label === targetId) {
						treeInfo.value[0].children.splice(i, 1);
					}
				}
			}
		}
	});
});

// 删除后继节点
function removeNodes(keys) {
	if (keys && keys.length > 0) {
		keys.forEach((key) => {
			graph.removeNode(key, {
				deep: true,
			});
		});
	}
}

//  接收选中节点
const handleEmitEvent = (data) => {
	const curID = data.label;
	console.log('component:', curID);
	const selectedNode = graph.getCellById(curID);
	console.log(selectedNode, 'selectedNode');
	if (selectedNode) {
		reset(graph);
		selectedNode.attr('body/stroke', 'orange');
		ruleForm.desc = selectedNode.id;
		isTask.value = true;
	}
};

// 销毁画布
onUnmounted(() => {
	graph.dispose();
});

const clickNode = (node) => {
	ruleForm.desc = node.id;
};

// const changeStyle = () => {
// 	const nodes = graph.getNodes();
// 	nodes.forEach((node) => {
// 		switch (node.id) {
// 			case 'node1':
// 				node.prop('attrs/text/text', '我是node1哈哈哈啊哈哈哈');
// 				break;
// 		}
// 	});
// };

/** 画布初始化 */
const init = () => {
	graph = new Graph({
		container: document.getElementById('graph-container'),
		autoResize: true,
		panning: true, // 平移
		width: '100%',
		height: '100%',
		on: {
			'node:keydown': (event) => {
				console.log(event, 'event');
			},
		},
		background: {
			color: '#fff',
		},
		grid: {
			size: 10,
			visible: true,
		},
		mousewheel: {
			enabled: true,
			zoomAtMousePosition: true,
			modifiers: 'ctrl',
			minScale: 0.5,
			maxScale: 3,
		},
		connecting: {
			router: 'manhattan',
			connector: {
				name: 'rounded',
				args: {
					radius: 8,
				},
			},
			anchor: 'center',
			connectionPoint: 'anchor',
			allowBlank: false,
			snap: {
				radius: 10,
			},
			createEdge() {
				return new Shape.Edge({
					attrs: {
						line: {
							stroke: '#A2B1C3',
							strokeWidth: 2,
							targetMarker: {
								name: 'block',
								width: 12,
								height: 8,
							},
						},
					},
					zIndex: 0,
				});
			},
			validateConnection({ sourceCell, targetCell, targetMagnet }) {
				// 不能连接自身
				if (sourceCell === targetCell) {
					return false;
				}
				return !!targetMagnet;
			},
		},
		highlighting: {
			magnetAdsorbed: {
				name: 'stroke',
				args: {
					attrs: {
						fill: '#5F95FF',
						stroke: '#5F95FF',
					},
				},
			},
		},
	})
		.centerContent()
		.fromJSON(data);
	graph
		.use(
			new Selection({
				enabled: true,
			})
		)
		.use(
			new Snapline({
				enabled: true,
			})
		)
		.use(
			new Keyboard({
				enabled: true,
			})
		)
		.use(
			new Clipboard({
				enabled: true,
			})
		)
		.use(
			new History({
				enabled: true,
			})
		)
		.use(
			new Transform({
				resizing: true,
				rotating: true,
				enabled: true,
			})
		)
		.use(new Export());
	Graph.registerNode(
		'custom-rect',
		{
			inherit: 'rect',
			width: 60,
			height: 40,
			attrs: {
				body: {
					strokeWidth: 1,
					stroke: '#5F95FF',
					fill: '#EFF4FF',
				},
				text: {
					fontSize: 12,
					fill: '#262626',
				},
			},
			ports: ports,
		},
		true
	);
};

/** 导入模版 */
const leadInMasterplate = async () => {
	// 清空所有单元格
	const cells = graph.getCells(); // 获取所有单元格
	graph.removeCells(cells); // 画布清空
	// 模版渲染
	await new Promise((resolve) => setTimeout(resolve, 100));
	graph.fromJSON(tsakMasterplate.value).centerContent(); // 引入模版数据 这里tsakMasterplate是我自己写的一个死数据
	// 对应的目录树
	treeInfo.value = [
		{
			label: 'node2',
			children: [
				{
					label: 'task2',
					children: [
						{
							label: 'task3',
							children: [],
						},
						{
							label: 'task5',
							children: [],
						},
					],
				},
			],
		},
	];
};

//导出PNG
const exportPNG = () => {
	graph.toPNG(
		(dataUri) => {
			DataUri.downloadDataUri(dataUri, 'chart.png');
		},
		{
			backgroundColor: '#fff',
			padding: {
				top: 20,
				right: 30,
				bottom: 40,
				left: 50,
			},
			//图片质量 默认值 0.92
			quality: 0.93,
		}
	);
};

// 导出json
function printNodeList() {
	console.log(graph.toJSON(), '导出数组');
	console.log(JSON.stringify(graph.toJSON({ diff: true })), 'JSON');
	graph.clearCells();
}

// 新增任务节点
const startDrag = (type) => {
	const tree = startDragToGraph(graph, type);
	id.value = tree.id;
	const label = { label: tree.id, children: [] };
	treeInfo.value[0].children.push(label);
};
</script>

<style scoped lang="less">
/deep/ .el-form-item__content {
	justify-content: center;
	margin-left: 0 !important;
}
/deep/ .el-form-item > label {
	width: auto !important;
}
/deep/ .el-form-item__label {
	width: auto !important;
}
/deep/ .el-select {
	width: 100% !important;
}

/deep/ .el-tabs__nav {
	width: 100%;
}
.x6-node .x6-label {
	word-wrap: break-all;
	text-overflow: ellipsis;
}
</style>
