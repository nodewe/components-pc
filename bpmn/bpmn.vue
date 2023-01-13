<template>
    <div ref="model" class="container">
        <toolbar @preview="isShowDrawer = true" @undo="undo" @redo="redo" @mockSimulationToggle="toggleSimulation"
            @minimapToggle="toggleMap" />
        <div ref="canvas" id="canvas"></div>
        <el-dialog width="72vw" title="XML代码" :visible.sync="isShowDrawer" append-to-body>
            <div class="preview-model">
                <highlightjs :code="info.xml" language="xml" />
            </div>
        </el-dialog>
    </div>

</template>

<script>
import {
    PLAY_SIMULATION_EVENT,
    SCOPE_DESTROYED_EVENT
} from 'bpmn-js-token-simulation/lib/util/EventHelper.js'
//小地图的样式
import "diagram-js-minimap/assets/diagram-js-minimap.css";
// 流程模拟的样式
import "bpmn-js-token-simulation/assets/css/bpmn-js-token-simulation.css";
// 引入bpmn modeler 
import BpmnModeler from 'bpmn-js/lib/Modeler'
import axios from 'axios'

// 引入样式
import 'bpmn-js/dist/assets/diagram-js.css' // 左边工具栏以及编辑节点的样式
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import "bpmn-js-properties-panel/dist/assets/properties-panel.css";
// 基础配置参考 https://juejin.cn/post/7064485347186442271

// 可以知道怎么创建自定义属性节点  https://developer.aliyun.com/article/1116601

// 流程中的基本概念参考 https://code84.com/806598.html

// 开源项目参考 https://github.com/nodewe/bpmn-process-designer  clone到本地研究
// 引入没有xml的情况下 加入空的 XML
import XML from './defaultXML';
//tooBar的组件
import toolbar from './toolbar/toolBar.vue';
// 函数抽离
import bpmnMixin from './bpmnMixin';
import options from './bpmnAdditionModules';
// 汉化 bpmn的配置
import ZHCN from './Translate/index';
//注册 highlilght
import './highlight';
export default {
    mixins: [bpmnMixin],
    name: '',
    components: {
        toolbar,
    },
    props: {
        // xmlUrl 的链接 例如 https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/mock1.bpmn
        // 有可能后端直接传过来的是xml 因此需要做一层http的判断
        xmlUrl: {
            type: String,
            default: ''
        },
        info: {
            type: Object,
            default: () => ({
                //文件
                file: null,
                // xml
                xml: XML()
            })
        }
    },
    // 生命周期 - 载入后, Vue 实例挂载到实际的 DOM 操作完成，一般在该过程进行 Ajax 交互
    mounted() {
        this.addEventRightKey()
        this.initBpmn()
    },
    data() {
        return {
            isShowDrawer: false,
            //放置svg的链接
            src: '',
            // 选中的Element
            activeElement: null,
            // bpmn建模器
            bpmnModeler: null,
            //viewer 
            BpmnViewer: null,
            canvas: null,
            // File
            file: null,
            // 如果需要设置工作流属性 必须设置 xmlns:flowable  如果是activi就是 xmlns:activi 如果是camunda 就要设置 xmlns:camunda 
            //默认的xml
            //
            defaultXml: ''
        }
    },
    beforeDestroy() {
        this.removeEventRightKey()
    },
    // 方法集合
    methods: {
        //撤销
        undo() {
            const command = this.bpmnModeler.get('commandStack')
            command && command.canRedo() && command.redo();
        },
        //恢复
        redo() {
            const command = this.bpmnModeler.get('commandStack')
            command && command.canUndo() && command.undo();
        },
        //小地图 现实隐藏
        toggleMap() {
            const minimap = this.bpmnModeler.get('minimap');
            minimap && minimap.toggle();
        },
        //流程模拟 现实隐藏
        toggleSimulation() {
            const toggleMode = this.bpmnModeler.get('toggleMode');
            toggleMode && toggleMode.toggleMode();
        },
        removeEventRightKey() {
            this.$refs.model.removeEventListener('contextmenu', this.contextmenu)
        },
        contextmenu(e) {
            e.preventDefault();
            return false
        },
        addEventRightKey() {
            this.$refs.model.addEventListener('contextmenu', this.contextmenu)
        },
        initBpmn() {
            // 获取到属性ref为“canvas”的dom节点
            const canvas = this.$refs.canvas,
                initOp = options(canvas);
            //汉化配置只能放在这里加入
            initOp.additionalModules.push(ZHCN)
            // 建模
            this.bpmnModeler = new BpmnModeler(initOp)
            // 创建新的画布
            this.createNewDiagram()
        },
        async createNewDiagram() {

            // 如果没有 没有链接就不加载
            if (!this.xmlUrl) return this.transformCanvas(this.info.xml)
            return this.transformCanvas(this.xmlUrl)
            // let res = await axios({
            //     method: 'get',
            //     timeout: 120000,
            //     url: this.xmlUrl,
            //     headers: { 'Content-Type': 'multipart/form-data' }
            // })
            // const bpmnXmlStr = res['data'];
            // this.transformCanvas(bpmnXmlStr)
        },
        // 将字符串转换成图并渲染
        transformCanvas(bpmnXmlStr) {
            this.bpmnModeler.importXML(bpmnXmlStr, err => {
                if (err) {
                    console.error(err)
                } else {
                    this.success()
                }
                // 让图能自适应屏幕
                const canvas = this.bpmnModeler.get('canvas')
                canvas.zoom('fit-viewport')
            })
        },
        success() {
            // console.log('创建成功!')
            this.addBpmnListener()
            this.addModelerListener()
            this.addEventBusListener()
            // 获取流程root的节点
            this.activeElement = this.bpmnModeler.get("elementRegistry").find((el) => el.type === "bpmn:Process");
            this.$bus.$emit('bpmn:click', this.activeElement)
        },
        // 添加绑定事件
        addBpmnListener() {
            const that = this;
            // 给图绑定事件，当图有发生改变就会触发这个事件
            this.bpmnModeler.on('commandStack.changed', function () {
                that.saveXML()
            })
        },
        addModelerListener() {
            // 监听 modeler
            const that = this;
            const events = ['shape.added', 'shape.move.end', 'shape.removed']
            events.forEach(function (event) {
                that.bpmnModeler.on(event, e => {
                    that.activeElement = e.element
                    if (event === 'shape.added') {
                        that.$bus.$emit('bpmn:click', that.activeElement)
                    } else if (event === 'shape.move.end') {
                        console.log('移动了shape')
                    } else if (event === 'shape.removed') {
                        console.log('删除了shape')
                    }
                })
            })
        },
        addEventBusListener() {
            let that = this
            const eventBus = this.bpmnModeler.get('eventBus');
            const eventTypes = ['element.click', 'element.changed']
            eventTypes.forEach(function (eventType) {
                eventBus.on(eventType, function (e) {
                    if (!e) return
                    that.activeElement = e.element;
                    if (eventType === 'element.changed') {
                        that.$bus.$emit('bpmn:click', that.activeElement)
                    } else if (eventType === 'element.click') {
                        that.$bus.$emit('bpmn:click', that.activeElement);
                    }
                })
            })
        },
        setColor(shape) {
            const modeling = this.bpmnModeler.get('modeling')
            modeling.setColor(shape, {
                fill: '#ff0000',
                stroke: null
            })
        },
        isInvalid(param) {
            // 判断是否是无效的值
            return param === null || param === undefined || param === ''
        },
        // 判断是否是线
        isSequenceFlow(type) {
            // 判断是否是线
            return type === 'bpmn:SequenceFlow'
        },
        // 下载为SVG格式,done是个函数，调用的时候传入的
        saveSVG(done) {
            // 把传入的done再传给bpmn原型的saveSVG函数调用
            this.bpmnModeler.saveSVG(done)
        },
        // 下载为bpmn格式,done是个函数，调用的时候传入的
        async saveXML(done) {
            // 把传入的done再传给bpmn原型的saveXML函数调用
            const { xml } = await this.bpmnModeler.saveXML({ format: true, preamble: true })
            // this.$emit('sendXML', xml)
            this.info.xml = xml;
        },
        // 当图发生改变的时候会调用这个函数，这个data就是图的xml
        setEncoded(link, name, data) {
            // 把xml转换为URI，下载要用到的
            const encodedData = encodeURIComponent(data)
            // 下载图的具体操作,改变a的属性，className令a标签可点击，href令能下载，download是下载的文件的名字
            //   console.log(link, name, data)
            let xmlFile = new File([data], 'test.bpmn')
            //   console.log(xmlFile)
            if (data) {
                link.className = 'active'
                link.href = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData
                link.download = name
            }
        }
    }
}
</script>

<style lang="scss">
.container {
    width: 100%;
    height: 100%;
    background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMTBoNDBNMTAgMHY0ME0wIDIwaDQwTTIwIDB2NDBNMCAzMGg0ME0zMCAwdjQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlMGUwZTAiIG9wYWNpdHk9Ii4yIi8+PHBhdGggZD0iTTQwIDBIMHY0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTBlMGUwIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+") repeat !important;
}

#canvas {
    width: 100%;
    height: 100%;
}

::v-deep .bjs-powered-by {
    display: none;
}

.djs-minimap .toggle {
    // content: '关闭小地图' !important;
    display: none;
}

.bts-toggle-mode {
    display: none;
}
.preview-model {
  width: 100%;
  height: 64vh;
  pre,
  code {
    word-break: break-word;
    white-space: pre-wrap;
  }
  pre {
    height: 100%;
    margin: 0;
    overflow-y: auto;
  }
  code.hljs {
    min-height: 100%;
    font-size: 16px;
    box-sizing: border-box;
  }
}
</style>