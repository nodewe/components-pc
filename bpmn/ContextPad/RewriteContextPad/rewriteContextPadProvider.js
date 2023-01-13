import ContextPadProvider from "bpmn-js/lib/features/context-pad/ContextPadProvider";
RewriteContextPadProvider.$inject = [
  'palette',
  'create',
  'elementFactory',
  'spaceTool',
  'lassoTool',
  'handTool',
  'globalConnect',
  'translate',
];
class RewriteContextPadProvider extends ContextPadProvider {
  constructor(
    config,
    injector,
    eventBus,
    contextPad,
    modeling,
    elementFactory,
    connect,
    create,
    popupMenu,
    canvas,
    rules,
    translate
  ) {
    super(
      config,
      injector,
      eventBus,
      contextPad,
      modeling,
      elementFactory,
      connect,
      create,
      popupMenu,
      canvas,
      rules,
      translate,
      2000
    );

    this._contextPad = contextPad;
    this._modeling = modeling;
    this._elementFactory = elementFactory;
    this._connect = connect;
    this._create = create;
    this._popupMenu = popupMenu;
    this._canvas = canvas;
    this._rules = rules;
    this._translate = translate;

    this._autoPlace = injector.get("autoPlace", false);
  }

  getContextPadEntries(element) {
    function createAction(type, group, className, title, options) {

      function createListener(event) {
        var shape = elementFactory.createShape(Object.assign({ type: type }, options));

        if (options) {
          shape.businessObject.di.isExpanded = options.isExpanded;
        }

        create.start(event, shape);
      }

      var shortType = type.replace(/^bpmn:/, '');

      return {
        group: group,
        className: className,
        title: title || this._translate('Create {type}', { type: shortType }),
        action: {
          dragstart: createListener,
          click: createListener,
        }
      };
    }

    const actions = {};

    // // 添加一个与edit一组的按钮
    // actions["enhancement-op-1"] = {
    //   group: "edit",
    //   className: "enhancement-op",
    //   title: "扩展操作1",
    //   action: {
    //     click: function (e) {
    //       alert("点击 扩展操作1");
    //     }
    //   }
    // };

    // // 添加一个新分组的自定义按钮
    // actions["enhancement-op"] = {
    //   group: "enhancement",
    //   className: "enhancement-op",
    //   title: "扩展操作2",
    //   action: {
    //     click: function (e) {
    //       alert("点击 扩展操作2");
    //     }
    //   }
    // };
    Object.assign(actions, {
   
      // 'space-tool': {//创建/删除空间工具
      //     group: 'tools',
      //     className: 'bpmn-icon-space-tool',
      //     title: this._translate('Activate the create/remove space tool'),
      //     action: {
      //         click: function(event) {
      //             spaceTool.activateSelection(event);
      //         }
      //     }
      // },
     
      // 'global-connect-tool': {//全局连接工具
      //     group: 'tools',
      //     className: 'bpmn-icon-connection-multi',
      //     title: this._translate('Activate the global connect tool'),
      //     action: {
      //         click: function(event) {
      //             globalConnect.toggle(event);
      //         }
      //     }
      // },
 
      'create.start-event': createAction(//开始事件
          'bpmn:StartEvent', 'event', 'bpmn-icon-start-event-none',
          this._translate('Create StartEvent')
      ),
      'create.end-event': createAction(//结束事件
          'bpmn:EndEvent', 'event', 'bpmn-icon-end-event-none',
          this._translate('Create EndEvent')
      ),
      'create.intermediate-event': createAction(//中间/边界事件
          'bpmn:IntermediateThrowEvent', 'event', 'bpmn-icon-intermediate-event-none',
          this._translate('Create Intermediate/Boundary Event')
      ),
      // 'event-separator': {//事件分割线
      //     group: 'events',
      //     separator: true
      // },
      'create.exclusive-gateway': createAction(//互斥网关
          'bpmn:ExclusiveGateway', 'gateway', 'bpmn-icon-gateway-xor',
          this._translate('创建互斥网关')
      ),
      'create.parallel-gateway': createAction(//并行网关
          'bpmn:ParallelGateway', 'gateway', 'bpmn-icon-gateway-parallel',
          this._translate('创建并行网关')
      ),
    
      'create.user-task': createAction(//用户任务
          'bpmn:UserTask', 'activity', 'bpmn-icon-user-task',
          this._translate('创建用户任务')
      ),
   
  });
    return actions;
  }
}

export default RewriteContextPadProvider;
