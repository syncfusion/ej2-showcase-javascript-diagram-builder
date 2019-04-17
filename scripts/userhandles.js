var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var CustomTool = (function () {
    function CustomTool(selectedItem) {
        this.selectedItem = null;
        this.selectedItem = selectedItem;
    }
    CustomTool.prototype.getTool = function (action) {
        var tool;
        if (action === 'leftHandle') {
            var leftTool = new LeftExtendTool(this.selectedItem.selectedDiagram.commandHandler);
            leftTool.selectedItem = this.selectedItem;
            return leftTool;
        }
        else if (action === 'rightHandle') {
            var rightTool = new RightExtendTool(this.selectedItem.selectedDiagram.commandHandler);
            rightTool.selectedItem = this.selectedItem;
            return rightTool;
        }
        else if (action === 'removeHandle') {
            var removeTool = new RemoveTool(this.selectedItem.selectedDiagram.commandHandler);
            removeTool.selectedItem = this.selectedItem;
            return removeTool;
        }
        else if (action === 'orgAddHandle') {
            var orgAddTool = new OrgAddHandleTool(this.selectedItem.selectedDiagram.commandHandler);
            orgAddTool.selectedItem = this.selectedItem;
            return orgAddTool;
        }
        else if (action === 'orgRemoveHandle') {
            var orgRemoveTool = new OrgRemoveHandleTool(this.selectedItem.selectedDiagram.commandHandler);
            orgRemoveTool.selectedItem = this.selectedItem;
            return orgRemoveTool;
        }
        else if (action === 'orgEditHandle') {
            var orgEditTool = new OrgEditHandleTool(this.selectedItem.selectedDiagram.commandHandler);
            orgEditTool.selectedItem = this.selectedItem;
            return orgEditTool;
        }
        return tool;
    };
    return CustomTool;
}());

var LeftExtendTool = (function (_super) {
    __extends(LeftExtendTool, _super);
    function LeftExtendTool() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.selectedItem = null;
        return _this;
    }
    LeftExtendTool.prototype.mouseDown = function (args) {
        this.inAction = true;
        _super.prototype.mouseDown.call(this, args);
    };
    LeftExtendTool.prototype.mouseUp = function (args) {
        if (this.inAction) {
            var selectedObject = this.commandHandler.getSelectedObject();
            if (selectedObject[0]) {
                if (selectedObject[0] instanceof ej.diagrams.Node) {
                    MindMapUtilityMethods.addNode('Left');
                }
            }
        }
        _super.prototype.mouseUp.call(this, args);
    };
    return LeftExtendTool;
}(ej.diagrams.ToolBase));
var RightExtendTool = (function (_super) {
    __extends(RightExtendTool, _super);
    function RightExtendTool() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.selectedItem = null;
        return _this;
    }
    RightExtendTool.prototype.mouseDown = function (args) {
        this.inAction = true;
        _super.prototype.mouseDown.call(this, args);
    };
    RightExtendTool.prototype.mouseUp = function (args) {
        if (this.inAction) {
            var selectedObject = this.commandHandler.getSelectedObject();
            if (selectedObject[0]) {
                if (selectedObject[0] instanceof ej.diagrams.Node) {
                    MindMapUtilityMethods.addNode('Right');
                }
            }
        }
        _super.prototype.mouseUp.call(this, args);
    };
    return RightExtendTool;
}(ej.diagrams.ToolBase));
var RemoveTool = (function (_super) {
    __extends(RemoveTool, _super);
    function RemoveTool() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.selectedItem = null;
        return _this;
    }
    RemoveTool.prototype.mouseDown = function (args) {
        this.inAction = true;
        _super.prototype.mouseDown.call(this, args);
    };
    RemoveTool.prototype.mouseUp = function (args) {
        if (this.inAction) {
            var selectedObject = this.commandHandler.getSelectedObject();
            if (selectedObject[0]) {
                if (selectedObject[0] instanceof ej.diagrams.Node) {
                    this.selectedItem.utilityMethods.removeChild(this.selectedItem);
                }
            }
        }
        _super.prototype.mouseUp.call(this, args);
    };
    return RemoveTool;
}(ej.diagrams.ToolBase));

var OrgAddHandleTool = (function (_super) {
    __extends(OrgAddHandleTool, _super);
    function OrgAddHandleTool() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.selectedItem = null;
        return _this;
    }
    OrgAddHandleTool.prototype.mouseDown = function (args) {
        this.inAction = true;
        _super.prototype.mouseDown.call(this, args);
    };
    OrgAddHandleTool.prototype.mouseUp = function (args) {
        if (this.inAction) {
            var selectedObject = this.commandHandler.getSelectedObject();
            if (selectedObject[0]) {
                if (selectedObject[0] instanceof ej.diagrams.Node) {
                    OrgChartUtilityMethods.addChild(this.selectedItem.selectedDiagram.selectedItems.nodes[0].id);
                }
            }
        }
        _super.prototype.mouseUp.call(this, args);
    };
    return OrgAddHandleTool;
}(ej.diagrams.ToolBase));

var OrgRemoveHandleTool = (function (_super) {
    __extends(OrgRemoveHandleTool, _super);
    function OrgRemoveHandleTool() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.selectedItem = null;
        return _this;
    }
    OrgRemoveHandleTool.prototype.mouseDown = function (args) {
        this.inAction = true;
        _super.prototype.mouseDown.call(this, args);
    };
    OrgRemoveHandleTool.prototype.mouseUp = function (args) {
        if (this.inAction) {
            var selectedObject = this.commandHandler.getSelectedObject();
            if (selectedObject[0]) {
                if (selectedObject[0] instanceof ej.diagrams.Node) {
                    this.selectedItem.utilityMethods.removeChild(this.selectedItem);
                }
            }
        }
        _super.prototype.mouseUp.call(this, args);
    };
    return OrgRemoveHandleTool;
}(ej.diagrams.ToolBase));

var OrgEditHandleTool = (function (_super) {
    __extends(OrgEditHandleTool, _super);
    function OrgEditHandleTool() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.selectedItem = null;
        return _this;
    }
    OrgEditHandleTool.prototype.mouseDown = function (args) {
        this.inAction = true;
        _super.prototype.mouseDown.call(this, args);
    };
    OrgEditHandleTool.prototype.mouseUp = function (args) {
        if (this.inAction) {
            var selectedObject = this.commandHandler.getSelectedObject();
            if (selectedObject[0]) {
                if (selectedObject[0] instanceof ej.diagrams.Node) {
                    OrgChartUtilityMethods.showCustomProperty();
                }
            }
        }
        _super.prototype.mouseUp.call(this, args);
    };
    return OrgEditHandleTool;
}(ej.diagrams.ToolBase));