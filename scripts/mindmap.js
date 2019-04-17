/**
 *  Home page handler
 */
var MindMap = (function () {
    function MindMap(selectedItem) {
        this.selectedItem = selectedItem;
    }
    MindMap.prototype.getCommandSettings = function () {
        var commandManager = {
            commands: [{
                    gesture: { key: ej.diagrams.Keys.Tab }, canExecute: this.canExecute,
                    execute: this.addChild.bind(this), name: 'leftChild'
                },
                {
                    gesture: { key: ej.diagrams.Keys.Tab, keyModifiers: ej.diagrams.KeyModifiers.Shift }, canExecute: this.canExecute,
                    execute: this.addRightChild.bind(this), name: 'rightChild'
                },
                {
                    gesture: { key: ej.diagrams.Keys.Enter }, canExecute: this.canExecute,
                    execute: this.addSibilingChildTop.bind(this), name: 'sibilingChildTop'
                },
                {
                    gesture: { key: ej.diagrams.Keys.Enter, keyModifiers: ej.diagrams.KeyModifiers.Shift }, canExecute: this.canExecute,
                    execute: this.addSibilingChildBottom.bind(this), name: 'sibilingChildBottom'
                },
                {
                    gesture: { key: ej.diagrams.Keys.Delete }, canExecute: this.canExecute,
                    execute: this.removeChild.bind(this), name: 'deleteChid'
                },
                {
                    gesture: { key: ej.diagrams.Keys.Down }, canExecute: this.canExecute,
                    execute: this.navigateBottomChild.bind(this), name: 'navigationDown'
                },
                {
                    gesture: { key: ej.diagrams.Keys.Up }, canExecute: this.canExecute,
                    execute: this.navigateTopChild.bind(this), name: 'navigationUp'
                },
                {
                    gesture: { key: ej.diagrams.Keys.Right }, canExecute: this.canExecute,
                    execute: this.navigateLeftChild.bind(this), name: 'navigationLeft'
                },
                {
                    gesture: { key: ej.diagrams.Keys.Left }, canExecute: this.canExecute,
                    execute: this.navigateRightChild.bind(this), name: 'navigationRight'
                },
                {
                    gesture: { key: ej.diagrams.Keys.Space }, canExecute: this.canExecute,
                    execute: this.expandCollapse.bind(this), name: 'expandCollapse'
                },
                {
                    gesture: { key: ej.diagrams.Keys.F2 }, canExecute: this.canExecute,
                    execute: this.editNode.bind(this), name: 'editing'
                },
                {
                    gesture: { key: ej.diagrams.Keys.F1 }, canExecute: this.canExecute,
                    execute: MindMapUtilityMethods.onHideNodeClick.bind(MindMapUtilityMethods), name: 'showShortCut'
                },
                {
                    gesture: { key: ej.diagrams.Keys.Z, keyModifiers: ej.diagrams.KeyModifiers.Control }, canExecute: this.canExecute,
                    execute: this.undoMindMap.bind(this), name: 'undo'
                },
                {
                    gesture: { key: ej.diagrams.Keys.Y, keyModifiers: ej.diagrams.KeyModifiers.Control }, canExecute: this.canExecute,
                    execute: this.redoMindMap.bind(this), name: 'redo'
                },
                {
                    gesture: { key: ej.diagrams.Keys.X, keyModifiers: ej.diagrams.KeyModifiers.Control }, canExecute: this.canExecute,
                    execute: this.cutMindMap.bind(this), name: 'cutObject'
                },
                {
                    gesture: { key: ej.diagrams.Keys.C, keyModifiers: ej.diagrams.KeyModifiers.Control }, canExecute: this.canExecute,
                    execute: this.copyMindMap.bind(this), name: 'copyObject'
                },
                {
                    gesture: { key: ej.diagrams.Keys.V, keyModifiers: ej.diagrams.KeyModifiers.Control }, canExecute: this.canExecute,
                    execute: this.pasteMindMap.bind(this), name: 'pasteObject'
                }
            ]
        };
        commandManager.commands = CommonKeyboardCommands.addCommonCommands(commandManager.commands);
        return commandManager;
    };
    MindMap.prototype.preventExecute = function () {
        return false;
    };
    MindMap.prototype.canExecute = function () {
        return true;
    };
    MindMap.prototype.undoMindMap = function () {
        this.selectedItem.utilityMethods.undoRedoLayout(true, this.selectedItem);
    };
    MindMap.prototype.redoMindMap = function () {
        this.selectedItem.utilityMethods.undoRedoLayout(false, this.selectedItem);
    };
    MindMap.prototype.cutMindMap = function () {
        this.selectedItem.utilityMethods.cutLayout(this.selectedItem);
    };
    MindMap.prototype.copyMindMap = function () {
        this.selectedItem.utilityMethods.copyLayout(this.selectedItem);
    };
    MindMap.prototype.pasteMindMap = function () {
        this.selectedItem.utilityMethods.pasteLayout(this.selectedItem);
    };
    MindMap.prototype.addChild = function (args) {
        MindMapUtilityMethods.addNode('Left');
    };
    MindMap.prototype.addRightChild = function (args) {
        MindMapUtilityMethods.addNode('Right');
    };
    MindMap.prototype.addSibilingChildTop = function () {
        MindMapUtilityMethods.addSibilingChild('Top');
    };
    MindMap.prototype.addSibilingChildBottom = function () {
        MindMapUtilityMethods.addSibilingChild('Bottom');
    };
    MindMap.prototype.removeChild = function (args) {
        this.selectedItem.utilityMethods.removeChild(this.selectedItem);
    };
    MindMap.prototype.navigateLeftChild = function (args) {
        this.navigateChild('left');
    };
    MindMap.prototype.navigateRightChild = function () {
        this.navigateChild('right');
    };
    MindMap.prototype.navigateTopChild = function () {
        this.navigateChild('top');
    };
    MindMap.prototype.navigateBottomChild = function () {
        this.navigateChild('bottom');
    };
    MindMap.prototype.expandCollapse = function () {
        var diagram = this.selectedItem.selectedDiagram;
        if (diagram.selectedItems.nodes.length > 0) {
            var node = diagram.selectedItems.nodes[0];
            node.isExpanded = !node.isExpanded;
            diagram.dataBind();
        }
    };
    MindMap.prototype.editNode = function () {
        var diagram = this.selectedItem.selectedDiagram;
        if (diagram.selectedItems.nodes.length > 0) {
            var node = diagram.selectedItems.nodes[0];
            diagram.startTextEdit(node, node.annotations[0].id);
            this.selectedItem.isModified = true;
        }
    };
    MindMap.prototype.navigateChild = function (direction) {
        var diagram = this.selectedItem.selectedDiagram;
        var node = null;
        if (direction === 'top' || direction === 'bottom') {
            var sameLevelNodes = this.getSameLevelNodes();
            var index = sameLevelNodes.indexOf(diagram.selectedItems.nodes[0]);
            node = direction === 'top' ? sameLevelNodes[index - 1] : sameLevelNodes[index + 1];
        }
        else {
            node = this.getMinDistanceNode(diagram, direction);
        }
        if (node) {
            diagram.clearSelection();
            diagram.select([node]);
            diagram.bringIntoView(node.wrapper.bounds);
        }
    };
    MindMap.prototype.getSameLevelNodes = function () {
        var sameLevelNodes = [];
        var diagram = this.selectedItem.selectedDiagram;
        if (diagram.selectedItems.nodes.length > 0) {
            var node = diagram.selectedItems.nodes[0];
            var orientation_1 = node.addInfo.orientation.toString();
            var connector = MindMapUtilityMethods.getConnector(diagram.connectors, node.inEdges[0]);
            var parentNode = MindMapUtilityMethods.getNode(diagram.nodes, connector.sourceID);
            for (var i = 0; i < parentNode.outEdges.length; i++) {
                connector = MindMapUtilityMethods.getConnector(diagram.connectors, parentNode.outEdges[i]);
                var childNode = MindMapUtilityMethods.getNode(diagram.nodes, connector.targetID);
                if (childNode) {
                    var childOrientation = childNode.addInfo.orientation.toString();
                    if (orientation_1 === childOrientation) {
                        sameLevelNodes.push(childNode);
                    }
                }
            }
        }
        return sameLevelNodes;
    };
    MindMap.prototype.getMinDistanceNode = function (diagram, direction) {
        var node = diagram.selectedItems.nodes[0];
        var parentBounds = node.wrapper.bounds;
        var childBounds = null;
        var oldChildBoundsTop = 0;
        var childNode = null;
        var lastChildNode = null;
        var leftOrientationFirstChild = null, rightOrientationFirstChild = null;
        if (node.id === 'rootNode') {
            var edges = node.outEdges;
            for (var i = 0; i < edges.length; i++) {
                var connector = MindMapUtilityMethods.getConnector(diagram.connectors, edges[i]);
                childNode = MindMapUtilityMethods.getNode(diagram.nodes, connector.targetID);
                var addInfo = childNode.addInfo;
                if (addInfo.orientation.toString().toLowerCase() === direction) {
                    if (direction === 'left' && leftOrientationFirstChild === null) {
                        leftOrientationFirstChild = childNode;
                    }
                    if (direction === 'right' && rightOrientationFirstChild === null) {
                        rightOrientationFirstChild = childNode;
                    }
                    childBounds = childNode.wrapper.bounds;
                    if (parentBounds.top >= childBounds.top && (childBounds.top >= oldChildBoundsTop || oldChildBoundsTop === 0)) {
                        oldChildBoundsTop = childBounds.top;
                        lastChildNode = childNode;
                    }
                }
            }
            if (!lastChildNode) {
                lastChildNode = direction === 'left' ? leftOrientationFirstChild : rightOrientationFirstChild;
            }
        }
        else {
            var edges = [];
            var selecttype = '';
            var orientation_2 = node.addInfo.orientation.toString();
            if (orientation_2.toLowerCase() === 'left') {
                edges = direction === 'left' ? node.outEdges : node.inEdges;
                selecttype = direction === 'left' ? 'target' : 'source';
            }
            else {
                edges = direction === 'right' ? node.outEdges : node.inEdges;
                selecttype = direction === 'right' ? 'target' : 'source';
            }
            for (var i = 0; i < edges.length; i++) {
                var connector = MindMapUtilityMethods.getConnector(diagram.connectors, edges[i]);
                childNode = MindMapUtilityMethods.getNode(diagram.nodes, selecttype === 'target' ? connector.targetID : connector.sourceID);
                if (childNode.id === 'rootNode') {
                    lastChildNode = childNode;
                    break;
                }
                else {
                    childBounds = childNode.wrapper.bounds;
                    if (selecttype === 'target') {
                        if (parentBounds.top >= childBounds.top && (childBounds.top >= oldChildBoundsTop || oldChildBoundsTop === 0)) {
                            oldChildBoundsTop = childBounds.top;
                            lastChildNode = childNode;
                        }
                    }
                    else {
                        lastChildNode = childNode;
                    }
                }
            }
        }
        return lastChildNode;
    };
    MindMap.prototype.createMindMap = function (isNew) {
        var diagram = this.selectedItem.selectedDiagram;
        this.selectedItem.utilityMethods.currentDiagramVisibility('mindmap-diagram', this.selectedItem);
        diagram.updateViewPort();
        if (isNew) {
            diagram.clear();
            diagram.constraints = diagram.constraints & ~ej.diagrams.DiagramConstraints.UndoRedo;
            var rootNode = MindMapUtilityMethods.createEmptyMindMap();
            diagram.layout = {
                horizontalSpacing: 100,
                verticalSpacing: 50,
                type: 'MindMap',
                getBranch: function (node) {
                    if (node.addInfo) {
                        var addInfo = node.addInfo;
                        return addInfo.orientation.toString();
                    }
                    return 'Left';
                },
                root: rootNode.id
            };
            diagram.pageSettings = { width: null, height: null };
            diagram.selectedItems = { userHandles: MindMapUtilityMethods.handle, constraints: ej.diagrams.SelectorConstraints.UserHandle };
            diagram.commandManager = this.getCommandSettings();
            //diagram.tool = ej.diagrams.DiagramTools.SingleSelect | ej.diagrams.DiagramTools.ZoomPan;
            diagram.snapSettings.constraints = diagram.snapSettings.constraints & ~ej.diagrams.SnapConstraints.ShowLines;
            diagram.constraints = diagram.constraints | ej.diagrams.DiagramConstraints.UndoRedo;
            diagram.tool = ej.diagrams.DiagramTools.SingleSelect | ej.diagrams.DiagramTools.ZoomPan;
            diagram.dataBind();
            this.selectedItem.utilityMethods.bindMindMapProperties(rootNode, this.selectedItem);
        }
        else {
            this.updateMindMap();
        }
        diagram.contextMenuSettings.show = false;
        diagram.dataBind();
    };
    MindMap.prototype.updateMindMap = function () {
        var diagram = this.selectedItem.selectedDiagram;
        diagram.layout = {
            getBranch: function (node) {
                if (node.addInfo) {
                    var addInfo = node.addInfo;
                    return addInfo.orientation.toString();
                }
                return 'Left';
            },
        };
        diagram.pageSettings = { width: null, height: null };
        diagram.selectedItems = { userHandles: MindMapUtilityMethods.handle, constraints: ej.diagrams.SelectorConstraints.UserHandle };
        diagram.commandManager = this.getCommandSettings();
        diagram.tool = ej.diagrams.DiagramTools.SingleSelect | ej.diagrams.DiagramTools.ZoomPan;
    };
    MindMap.prototype.getShortCutKeys = function (shortcutKeys) {
        var annotations = [];
        var y = 0.1;
        for (var i = 0; i < shortcutKeys.length; i++) {
            var annotation = {
                content: shortcutKeys[i].key.toString() + ': ' + shortcutKeys[i].value.toString(), offset: { x: 0.1, y: y }, visibility: true,
                style: { color: 'white' }, horizontalAlignment: 'Left', verticalAlignment: 'Bottom'
            };
            annotations.push(annotation);
            y += 0.1;
        }
        return annotations;
    };
    return MindMap;
}());

var MindMapUtilityMethods = (function () {
    function MindMapUtilityMethods() {
    }
    MindMapUtilityMethods.mindmapPaste = function () {
        var diagram = this.selectedItem.selectedDiagram;
        var selectedNode = diagram.selectedItems.nodes[0];
        var selectedelement;
        var mindmapData;
        var selecteditemOrientation;
        if (this.selectedItem.pasteData.length > 0) {
            diagram.startGroupAction();
            diagram.paste(this.selectedItem.pasteData);
            if (selectedNode.id !== 'rootNode') {
                selecteditemOrientation = selectedNode.addInfo.orientation.toString();
            }
            else {
                selecteditemOrientation = this.selectedItem.pastedFirstItem.addInfo.orientation.toString();
            }
            selectedelement = this.selectedItem.pastedFirstItem;
            mindmapData = MindMapUtilityMethods.getMindMapShape(selectedNode);
            var connector = MindMapUtilityMethods.setConnectorDefault(diagram, selecteditemOrientation, mindmapData.connector, selectedNode.id, selectedelement.id);
            diagram.add(connector);
            var selectedNodeLevel = void 0;
            selectedNodeLevel = selectedNode.addInfo.level;
            this.updateLevel(selectedelement, selectedNodeLevel, selecteditemOrientation);
            diagram.clearSelection();
            this.selectedItem.preventPropertyChange = true;
            diagram.select([selectedelement]);
            this.selectedItem.preventPropertyChange = false;
            diagram.doLayout();
            diagram.endGroupAction();
            diagram.bringIntoView(diagram.nodes[diagram.nodes.length - 1].wrapper.bounds);
        }
    };
    MindMapUtilityMethods.updateLevel = function (parentNode, level, orientation) {
        var diagram = this.selectedItem.selectedDiagram;
        var lastNode = parentNode;
        var level1;
        parentNode.addInfo.level = level + 1;
        level1 = 'Level' + parentNode.addInfo.level;
        this.addMindMapLevels(level1);
        parentNode.addInfo.orientation = orientation;
        for (var i = parentNode.outEdges.length - 1; i >= 0; i--) {
            var connector = MindMapUtilityMethods.getConnector(diagram.connectors, lastNode.outEdges[i]);
            var childNode = MindMapUtilityMethods.getNode(diagram.nodes, connector.targetID);
            childNode.addInfo.orientation = orientation;
            connector.sourcePortID = 'rightPort';
            connector.targetPortID = 'leftPort';
            if (orientation === 'Right') {
                connector.sourcePortID = 'leftPort';
                connector.targetPortID = 'rightPort';
            }
            if (childNode.outEdges.length > 0) {
                this.updateLevel(childNode, parentNode.addInfo.level, orientation);
            }
            else {
                childNode.addInfo.level = parentNode.addInfo.level + 1;
                level1 = 'Level' + childNode.addInfo.level;
                this.addMindMapLevels(level1);
            }
        }
        diagram.dataBind();
    };
    MindMapUtilityMethods.addMindMapLevels = function (level) {
        var mindmap = document.getElementById('mindMapLevels');
        var dropdownlist = mindmap.ej2_instances[0];
        var dropdowndatasource = dropdownlist.dataSource;
        var isExist = false;
        for (var i = 0; i < dropdowndatasource.length; i++) {
            var data = dropdowndatasource[i];
            if (data.text === level) {
                isExist = true;
                break;
            }
        }
        if (!isExist) {
            dropdowndatasource.push({ text: level, value: level });
        }
        dropdownlist.dataSource = dropdowndatasource;
        dropdownlist.dataBind();
    };
    MindMapUtilityMethods.createEmptyMindMap = function () {
        var node = {
            id: 'rootNode', width: 150, minHeight: 50,
            annotations: [{ content: 'MindMap', style: { color: '#000000' } }],
            shape: { type: 'Basic', shape: 'Rectangle', cornerRadius: 5 },
            ports: [{ id: 'leftPort', offset: { x: 0, y: 0.5 } }, { id: 'rightPort', offset: { x: 1, y: 0.5 } }],
            addInfo: { level: 0 }, style: { fill: '#D0ECFF', strokeColor: '#80BFEA', strokeWidth: 1 },
            constraints: ej.diagrams.NodeConstraints.Default & ~ej.diagrams.NodeConstraints.Delete
        };
        this.selectedItem.selectedDiagram.add(node);
        var node1 = {
            id: 'textNode', width: 400, height: 280, offsetX: this.selectedItem.selectedDiagram.scrollSettings.viewPortWidth - 200, offsetY: 140,
            shape: { type: 'HTML', content: this.getShortCutString() }, style: { strokeWidth: 0 },
            excludeFromLayout: true,
            constraints: ej.diagrams.NodeConstraints.Default & ~ej.diagrams.NodeConstraints.Delete
        };
        this.selectedItem.selectedDiagram.add(node1);
        document.getElementById('diagram').querySelector('#closeIconDiv').onclick = this.onHideNodeClick.bind(this);
        return node;
    };
    MindMapUtilityMethods.onHideNodeClick = function () {
        var node1 = MindMapUtilityMethods.getNode(this.selectedItem.selectedDiagram.nodes, 'textNode');
        node1.visible = !node1.visible;
        this.selectedItem.selectedDiagram.dataBind();
    };
    MindMapUtilityMethods.getShortCutString = function () {
        return '<div style="width: 400px; height: 280px; padding: 10px; background-color: #FFF7B5; border: 1px solid #FFF7B5">' +
            '<div id="closeIconDiv" style="float: right; width: 22px; height: 22px; border: 1px solid #FFF7B5">' +
            '<span class="sf-icon-Close" style="font-size:14px;cursor:pointer;"></span>' +
            '</div>' +
            '<div>' +
            '<span class="db-html-font-medium">Quick shortcuts</span>' +
            '</div>' +
            '<div style="padding-top:10px">' +
            '<ul>' +
            '<li>' +
            '<span class="db-html-font-medium">Tab : </span>' +
            '<span class="db-html-font-normal">Add a subtopic to the left</span>' +
            '</li>' +
            '</ul>' +
            '</div>' +
            '<div>' +
            '<ul>' +
            '<li>' +
            '<span class="db-html-font-medium">Shift + Tab : </span>' +
            '<span class="db-html-font-normal">Add a subtopic to the right</span>' +
            '</li>' +
            '</ul>' +
            '</div>' +
            '<div>' +
            '<ul>' +
            '<li>' +
            '<span class="db-html-font-medium">Enter : </span>' +
            '<span class="db-html-font-normal">Add a sibling subtopic to the top</span>' +
            '</li>' +
            '</ul>' +
            '</div>' +
            '<div>' +
            '<ul>' +
            '<li>' +
            '<span class="db-html-font-medium">Delete : </span>' +
            '<span class="db-html-font-normal">Delete a topic</span>' +
            '</li>' +
            '</ul>' +
            '</div>' +
            '<div>' +
            '<ul>' +
            '<li>' +
            '<span class="db-html-font-medium">F2 : </span>' +
            '<span class="db-html-font-normal">Edit a topic</span>' +
            '</li>' +
            '</ul>' +
            '</div>' +
            '<div>' +
            '<ul>' +
            '<li>' +
            '<span class="db-html-font-medium">Esc : </span>' +
            '<span class="db-html-font-normal">End text editing</span>' +
            '</li>' +
            '</ul>' +
            '</div>' +
            '<div>' +
            '<ul>' +
            '<li>' +
            '<span class="db-html-font-medium">Arrow(Up, Down, Left, Right) : </span>' +
            '<span class="db-html-font-normal">Navigate between topics</span>' +
            '</li>' +
            '</ul>' +
            '</div>' +
            '<div>' +
            '<ul>' +
            '<li>' +
            '<span class="db-html-font-medium">F1 : </span>' +
            '<span class="db-html-font-normal">Show/Hide shortcut Key</span>' +
            '</li>' +
            '</ul>' +
            '</div>' +
            '</div>';
    };
    MindMapUtilityMethods.getMindMapShape = function (parentNode) {
        var sss = {};
        var node = {};
        var connector = {};
        var addInfo = parentNode.addInfo;
        if (this.templateType === 'template1') {
            var annotations = {
                //verticalAlignment: 'Bottom', offset: { x: 0.5, y: 0 },
                content: ''
            };
            node = {
                minWidth: 100, maxWidth: 100, minHeight: 20, shape: { type: 'Basic', shape: 'Rectangle' },
                annotations: [annotations], style: { fill: '#000000', strokeColor: '#000000' },
                addInfo: { level: addInfo.level + 1 },
                offsetX: 200, offsetY: 200
            };
            connector = { type: 'Bezier', style: { strokeWidth: 3 } };
        }
        else {
            node = {
                minWidth: 100, maxWidth: 100, minHeight: 50, shape: { type: 'Basic', shape: 'Rectangle' },
                annotations: [{ content: '' }],
                style: { fill: '#000000', strokeColor: '#000000' },
                addInfo: { level: addInfo.level + 1 },
                offsetX: 200, offsetY: 200
            };
            if (this.templateType === 'template2') {
                connector = { type: 'Orthogonal', style: { strokeColor: '#000000' } };
            }
            else if (this.templateType === 'template3') {
                connector = { type: 'Straight', style: { strokeColor: '#000000' } };
            }
            else {
                connector = { type: 'Bezier', style: { strokeColor: '#000000' } };
            }
        }
        if (addInfo.level < 1) {
            node.style.fill = this.selectedItem.utilityMethods.fillColorCode[this.lastFillIndex];
            node.style.strokeColor = this.selectedItem.utilityMethods.borderColorCode[this.lastFillIndex];
            ;
            if (this.lastFillIndex + 1 >= this.selectedItem.utilityMethods.fillColorCode.length) {
                this.lastFillIndex = 0;
            }
            else {
                this.lastFillIndex++;
            }
        }
        else {
            node.style.strokeColor = node.style.fill = parentNode.style.fill;
        }
        connector.style.strokeColor = node.style.fill;
        connector.targetDecorator = { shape: 'None' };
        connector.constraints = ej.diagrams.ConnectorConstraints.PointerEvents | ej.diagrams.ConnectorConstraints.Select | ej.diagrams.ConnectorConstraints.Delete;
        node.constraints = ej.diagrams.NodeConstraints.Default & ~ej.diagrams.NodeConstraints.Drag;
        node.ports = [{ id: 'leftPort', offset: { x: 0, y: 0.5 } }, { id: 'rightPort', offset: { x: 1, y: 0.5 } }];
        sss.node = node;
        sss.connector = connector;
        return sss;
    };
    MindMapUtilityMethods.addNode = function (orientation) {
        var diagram = this.selectedItem.selectedDiagram;
        var selectedNode = diagram.selectedItems.nodes[0];
        if (selectedNode.id !== 'rootNode') {
            var selectedNodeOrientation = selectedNode.addInfo.orientation.toString();
            orientation = selectedNodeOrientation;
        }
        diagram.startGroupAction();
        var mindmapData = this.getMindMapShape(selectedNode);
        var node = mindmapData.node;
        this.addMindMapLevels('Level' + node.addInfo.level);
        node.id = 'node' + this.selectedItem.randomIdGenerator();
        if (node.addInfo) {
            node.addInfo.orientation = orientation;
        }
        else {
            node.addInfo = { 'orientation': orientation };
        }
        diagram.add(node);
        var connector = this.setConnectorDefault(diagram, orientation, mindmapData.connector, selectedNode.id, node.id);
        diagram.add(connector);
        var node1 = this.getNode(diagram.nodes, node.id);
        diagram.doLayout();
        diagram.endGroupAction();
        this.selectedItem.preventPropertyChange = true;
        diagram.select([node1]);
        this.selectedItem.preventPropertyChange = false;
        diagram.dataBind();
        diagram.bringIntoView(node1.wrapper.bounds);
        diagram.startTextEdit(node1, node1.annotations[0].id);
        this.selectedItem.isModified = true;
    };
    MindMapUtilityMethods.addSibilingChild = function (position) {
        var diagram = this.selectedItem.selectedDiagram;
        var selectedNode = diagram.selectedItems.nodes[0];
        if (selectedNode.id !== 'rootNode') {
            var selectedNodeOrientation = selectedNode.addInfo.orientation.toString();
            var orientation_3 = selectedNodeOrientation;
            var connector1 = this.getConnector(diagram.connectors, selectedNode.inEdges[0]);
            diagram.startGroupAction();
            var mindmapData = this.getMindMapShape(this.getNode(diagram.nodes, connector1.sourceID));
            var node = mindmapData.node;
            node.id = 'node' + this.selectedItem.randomIdGenerator();
            if (node.addInfo) {
                node.addInfo.orientation = orientation_3;
            }
            else {
                node.addInfo = { 'orientation': orientation_3 };
            }
            diagram.add(node);
            var connector = this.setConnectorDefault(diagram, orientation_3, mindmapData.connector, connector1.sourceID, node.id);
            diagram.add(connector);
            var node1 = this.getNode(diagram.nodes, node.id);
            diagram.doLayout();
            diagram.endGroupAction();
            this.selectedItem.preventPropertyChange = true;
            diagram.select([node1]);
            this.selectedItem.preventPropertyChange = false;
            diagram.bringIntoView(node1.wrapper.bounds);
            diagram.startTextEdit(node1, node1.annotations[0].id);
            this.selectedItem.isModified = true;
        }
    };
    MindMapUtilityMethods.getConnector = function (connectors, name) {
        for (var i = 0; i < connectors.length; i++) {
            if (connectors[i].id === name) {
                return connectors[i];
            }
        }
        return null;
    };
    MindMapUtilityMethods.getNode = function (nodes, name) {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].id === name) {
                return nodes[i];
            }
        }
        return null;
    };
    MindMapUtilityMethods.setConnectorDefault = function (diagram, orientation, connector, sourceID, targetID) {
        connector.id = 'connector' + this.selectedItem.randomIdGenerator();
        connector.sourceID = sourceID;
        connector.targetID = targetID;
        connector.sourcePortID = 'rightPort';
        connector.targetPortID = 'leftPort';
        if (orientation === 'Right') {
            connector.sourcePortID = 'leftPort';
            connector.targetPortID = 'rightPort';
        }
        connector.style.strokeWidth = 3;
        return connector;
    };
    MindMapUtilityMethods.lastFillIndex = 0;
    MindMapUtilityMethods.shortCutkeys = [
        { 'key': 'Tab', 'value': 'Add a subtopic to left side' },
        { 'key': 'Shift + Tab', 'value': 'Add a subtopic to right side' },
        { 'key': 'Enter', 'value': 'Add a sibling subtopic to top' },
        { 'key': 'Shift + Enter', 'value': 'Add a sibling subtopic to bottom' },
        { 'key': 'Delete', 'value': 'Delete a topic' },
        { 'key': 'Spacebar', 'value': 'Expand/Collapse a topic' },
        { 'key': 'F2', 'value': 'Edit a topic' },
        { 'key': 'Esc', 'value': 'End a text editing' },
        { 'key': 'Arrow(Up, Down, Left, Right)', 'value': 'Navigate between topics' },
    ];
    MindMapUtilityMethods.handle = [
        {
            name: 'leftHandle', pathColor: 'white', backgroundColor: '#7d7d7d', borderColor: 'white',
            pathData: 'M0,3.063 L7.292,3.063 L7.292,0 L11.924,4.633 L7.292,9.266 L7.292,5.714 L0.001,5.714 L0.001,3.063Z',
            side: 'Right', offset: 0.5, horizontalAlignment: 'Center', verticalAlignment: 'Center',
        },
        {
            name: 'rightHandle', pathColor: 'white', backgroundColor: '#7d7d7d', borderColor: 'white',
            pathData: 'M11.924,6.202 L4.633,6.202 L4.633,9.266 L0,4.633 L4.632,0 L4.632,3.551 L11.923,3.551 L11.923,6.202Z',
            visible: true, offset: 0.5, side: 'Left', horizontalAlignment: 'Center', verticalAlignment: 'Center'
        }, {
            name: 'removeHandle', pathColor: 'white', backgroundColor: '#7d7d7d', borderColor: 'white',
            pathData: 'M 7.04 22.13 L 92.95 22.13 L 92.95 88.8 C 92.95 91.92 91.55 94.58 88.76 96.74 C 85.97 98.91 82.55 100 78.52 100 L 21.48 100 C 17.45 100 14.03 98.91 11.24 96.74 C 8.45 94.58 7.04 91.92 7.04 88.8 z M 32.22 0 L 67.78 0 L 75.17 5.47 L 100 5.47 L 100 16.67 L 0 16.67 L 0 5.47 L 24.83 5.47 z',
            side: 'Bottom', offset: 0.5, horizontalAlignment: 'Center', verticalAlignment: 'Center'
        }
    ];
    return MindMapUtilityMethods;
}());