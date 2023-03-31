<template>
  <div style="height: 93%; width: 94%; margin: 1px; position: absolute">
    <div class="tools" id="tools">
      <el-button class="btn_setting" @click="add_node">新增节点</el-button>
      <el-button class="btn_setting">新增变量</el-button>
    </div>
    <div style="height: 90%; width: 100%; display: flex">
      <div id="tree_node" class="tree_node">
        <el-tree
          id="tree"
          :data="data"
          :props="defaultProps"
          @node-click="handleNodeClick"
          default-expand-all
        />
      </div>
      <div style="height: 100%; width: 80%">
        <div style="height: 80%; width: 100%">
          <div id="container" class="container">
            <div id="graph-container" class="graph-container"></div>
          </div>
        </div>
        <div id="setting" class="setup">
          <el-descriptions
            title="属性"
            :column="3"
            size="small"
            style="margin: 0 10px 0 10px"
            border
          >
            <el-descriptions-item label="任务名：">任务1</el-descriptions-item>
            <el-descriptions-item label="描述：">三维建模</el-descriptions-item>
            <el-descriptions-item label="负责人：">张三</el-descriptions-item>
            <el-descriptions-item label="截止时间："
              >2023-1-1 12:00:00</el-descriptions-item
            >
            <el-descriptions-item label="输入："
              >[文件1,文件2]</el-descriptions-item
            >
            <el-descriptions-item label="输出："
              >[文件1,文件2]</el-descriptions-item
            >
          </el-descriptions>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { Graph, Shape } from "@antv/x6";
import { Selection } from "@antv/x6-plugin-selection";
import { Snapline } from "@antv/x6-plugin-snapline";
import { Keyboard } from "@antv/x6-plugin-keyboard";
import { Clipboard } from "@antv/x6-plugin-clipboard";
import { History } from "@antv/x6-plugin-history";

export default defineComponent({
  setup() {
    const defaultProps = {
      children: "children",
      label: "label",
    };

    const data = [
      {
        id: 1,
        label: "节点",
        children: [
          {
            id: 3,
            label: "节点1",
          },
          {
            id: 4,
            label: "节点2",
          },
        ],
      },
      {
        id: 2,
        label: "变量",
        children: [
          {
            id: 5,
            label: "变量1",
          },
          {
            id: 6,
            label: "变量2",
          },
        ],
      },
    ];

    const task_value = ref({
      name: "",
      person: "",
      description: "",
      datetime: "",
      input: [],
      output: [],
    });
    let graph;
    const ports = {
      groups: {
        top: {
          position: "top",
          attrs: {
            circle: {
              r: 2,
              magnet: true,
              stroke: "black",
              strokeWidth: 1,
              fill: "#fff",
              style: {
                visibility: "hidden",
              },
            },
          },
        },
        right: {
          position: "right",
          attrs: {
            circle: {
              r: 2,
              magnet: true,
              stroke: "black",
              strokeWidth: 1,
              fill: "#fff",
              style: {
                visibility: "hidden",
              },
            },
          },
        },
        bottom: {
          position: "bottom",
          attrs: {
            circle: {
              r: 2,
              magnet: true,
              stroke: "black",
              strokeWidth: 1,
              fill: "#fff",
              style: {
                visibility: "hidden",
              },
            },
          },
        },
        left: {
          position: "left",
          attrs: {
            circle: {
              r: 2,
              magnet: true,
              stroke: "black",
              strokeWidth: 1,
              fill: "#fff",
              style: {
                visibility: "hidden",
              },
            },
          },
        },
      },
      items: [
        {
          group: "top",
        },
        {
          group: "right",
        },
        {
          group: "bottom",
        },
        {
          group: "left",
        },
      ],
    };

    // 控制连接桩显示/隐藏
    function showPorts(ports, show) {
      for (let i = 0, len = ports.length; i < len; i = i + 1) {
        ports[i].style.visibility = show ? "visible" : "hidden";
      }
    }

    onMounted(() => {
      // 初始化画布
      graph = new Graph({
        container: document.getElementById("graph-container"),
        grid: true,
        panning: true,
        mousewheel: {
          enabled: true,
          zoomAtMousePosition: true,
          modifiers: "ctrl",
          minScale: 0.5,
          maxScale: 3,
        },
        connecting: {
          router: {
            name: "manhattan",
            args: {},
          },
          connector: {
            name: "rounded",
            args: {
              radius: 8,
            },
          },
          anchor: "center",
          connectionPoint: "anchor",
          allowBlank: true,
          snap: {
            radius: 20,
          },
          createEdge() {
            return new Shape.Edge({
              attrs: {
                line: {
                  stroke: "#000000",
                  strokeWidth: 1,
                  targetMarker: {
                    name: "block",
                    size: 5,
                  },
                },
              },
              zIndex: 0,
              router: {
                name: "manhattan",
                args: {},
              },
            });
          },
          validateConnection({ targetMagnet }) {
            return !!targetMagnet;
          },
        },
        highlighting: {
          magnetAdsorbed: {
            name: "stroke",
            args: {
              attrs: {
                fill: "black",
                stroke: "black",
              },
            },
          },
        },
        interacting: true,
      });

      // region 使用插件
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
        );
      // 重置所有节点
      function reset() {
        const nodes = graph.getNodes();
        const edges = graph.getEdges();

        nodes.forEach((node) => {
          node.attr("body/stroke", "black");
        });
        edges.forEach((edge) => {
          edge.attr("line/stroke", "black");
        });
      }
      // 快捷键与事件
      graph.bindKey(["meta+c", "ctrl+c"], () => {
        const cells = graph.getSelectedCells();
        if (cells.length) {
          graph.copy(cells);
        }
        return false;
      });
      graph.bindKey(["meta+x", "ctrl+x"], () => {
        const cells = graph.getSelectedCells();
        if (cells.length) {
          graph.cut(cells);
        }
        return false;
      });
      graph.bindKey(["meta+v", "ctrl+v"], () => {
        if (!graph.isClipboardEmpty()) {
          const cells = graph.paste({ offset: 32 });
          graph.cleanSelection();
          graph.select(cells);
        }
        return false;
      });
      graph.bindKey(["meta+z", "ctrl+z"], () => {
        if (graph.canUndo()) {
          graph.undo();
        }
        return false;
      });
      graph.bindKey(["meta+shift+z", "ctrl+shift+z"], () => {
        if (graph.canRedo()) {
          graph.redo();
        }
        return false;
      });
      graph.bindKey(["meta+a", "ctrl+a"], () => {
        const nodes = graph.getNodes();
        if (nodes) {
          graph.select(nodes);
        }
      });
      graph.bindKey("delete", () => {
        const cells = graph.getSelectedCells();
        if (cells.length) {
          graph.removeCells(cells);
        }
      });
      graph.bindKey(["ctrl+1", "meta+1"], () => {
        const zoom = graph.zoom();
        if (zoom < 1.5) {
          graph.zoom(0.1);
        }
      });
      graph.bindKey(["ctrl+2", "meta+2"], () => {
        const zoom = graph.zoom();
        if (zoom > 0.5) {
          graph.zoom(-0.1);
        }
      });
      graph.on("node:mouseenter", () => {
        const container = document.getElementById("graph-container");
        const ports = container.querySelectorAll(".x6-port-body");
        showPorts(ports, true);
      });
      graph.on("node:mouseleave", () => {
        const container = document.getElementById("graph-container");
        const ports = container.querySelectorAll(".x6-port-body");
        showPorts(ports, false);
      });
      graph.on("node:click", ({ node }) => {
        reset();
        node.attr("body/stroke", "orange");
        console.log(node.id);
      });
      graph.on("edge:click", ({ edge }) => {
        reset();
        edge.attr("line/stroke", "orange");
      });
    });

    //新增节点
    function add_node() {
      graph.addNode({
        id: "node1",
        shape: "rect",
        x: 40,
        y: 40,
        width: 100,
        height: 40,
        label: "hello",
        attrs: {
          body: {
            stroke: "#8f8f8f",
            strokeWidth: 1,
            fill: "#fff",
            rx: 6,
            ry: 6,
          },
        },
        ports: { ...ports },
      });
    }

    return {
      data,
      defaultProps,
      task_value,
      add_node,
    };
  },
});
</script>

<style scoped>
.tools {
  height: 10%;
  width: 100%;
  background-color: #42b983;
}

.setup {
  height: 20%;
  width: 100%;
  background-color: #3dafe4;
}

.div_setting {
  position: relative;
  height: 30px;
  margin: 5px;
  display: flex;
}

.btn_setting {
  margin: 15px 10px 15px 10px;
}

.tree_node {
  background-color: yellow;
  height: 100%;
  width: 20%;
}

.container {
  display: flex;
  height: 100%;
  width: 100%;
}

.graph-container {
  width: 100%;
  height: 100%;
}

.x6-widget-stencil {
  background-color: #fff;
}

.x6-widget-stencil-title {
  background-color: #fff;
}

.x6-widget-stencil-group-title {
  background-color: #fff !important;
}

.x6-widget-transform {
  margin: -1px 0 0 -1px;
  padding: 0px;
  border: 1px solid #239edd;
}

.x6-widget-transform > div {
  border: 1px solid #239edd;
}

.x6-widget-transform > div:hover {
  background-color: #3dafe4;
}

.x6-widget-transform-active-handle {
  background-color: #3dafe4;
}

.x6-widget-transform-resize {
  border-radius: 0;
}

.x6-widget-selection-inner {
  border: 1px solid #239edd;
}

.x6-widget-selection-box {
  opacity: 0;
}
</style>
