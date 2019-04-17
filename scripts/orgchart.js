var OrgChartData = (function () {
    function OrgChartData(selectedItem1) {
        this.selectedItem = selectedItem1;
    }
    OrgChartData.prototype.getCommandSettings = function () {
        var commandManager = {
            commands: [{
                    gesture: { key: ej.diagrams.Keys.Tab }, canExecute: this.canExecute,
                    execute: this.addChild.bind(this), name: 'SubChild'
                },
                {
                    gesture: { key: ej.diagrams.Keys.Enter }, canExecute: this.canExecute,
                    execute: this.addRightChild.bind(this), name: 'SameLevelSubChild'
                },
                {
                    gesture: { key: ej.diagrams.Keys.Tab, keyModifiers: ej.diagrams.KeyModifiers.Shift }, canExecute: this.canExecute,
                    execute: this.changeChildParent.bind(this), name: 'sibilingChildTop'
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
                    gesture: { key: ej.diagrams.Keys.Left }, canExecute: this.canExecute,
                    execute: this.navigateLeftChild.bind(this), name: 'navigationLeft'
                },
                {
                    gesture: { key: ej.diagrams.Keys.Right }, canExecute: this.canExecute,
                    execute: this.navigateRightChild.bind(this), name: 'navigationRight'
                },
                {
                    gesture: { key: ej.diagrams.Keys.F2 }, canExecute: this.canExecute,
                    execute: this.editChild.bind(this), name: 'editChild'
                },
                {
                    gesture: { key: ej.diagrams.Keys.F1 }, canExecute: this.canExecute,
                    execute: OrgChartUtilityMethods.onHideNodeClick.bind(OrgChartUtilityMethods), name: 'showShortCut'
                },
                {
                    gesture: { key: ej.diagrams.Keys.Z, keyModifiers: ej.diagrams.KeyModifiers.Control }, canExecute: this.canExecute,
                    execute: this.undoOrgChart.bind(this), name: 'undo'
                },
                {
                    gesture: { key: ej.diagrams.Keys.Y, keyModifiers: ej.diagrams.KeyModifiers.Control }, canExecute: this.canExecute,
                    execute: this.redoOrgChart.bind(this), name: 'redo'
                },
                {
                    gesture: { key: ej.diagrams.Keys.Space }, canExecute: this.canExecute,
                    execute: this.spaceOrgChart.bind(this), name: 'expandcollapse'
                },
                {
                    gesture: { key: ej.diagrams.Keys.X, keyModifiers: ej.diagrams.KeyModifiers.Control }, canExecute: this.canExecute,
                    execute: this.cutOrgChart.bind(this), name: 'cutObject'
                },
                {
                    gesture: { key: ej.diagrams.Keys.C, keyModifiers: ej.diagrams.KeyModifiers.Control }, canExecute: this.canExecute,
                    execute: this.copyOrgChart.bind(this), name: 'copyObject'
                },
                {
                    gesture: { key: ej.diagrams.Keys.V, keyModifiers: ej.diagrams.KeyModifiers.Control }, canExecute: this.canExecute,
                    execute: this.pasteOrgChart.bind(this), name: 'pasteObject'
                }
            ]
        };
        commandManager.commands = CommonKeyboardCommands.addCommonCommands(commandManager.commands);
        return commandManager;
    };
    OrgChartData.prototype.spaceOrgChart = function () {
        // let diagram: Diagram = this.selectedItem.selectedDiagram;
        // let selectedNode: Node = diagram.selectedItems.nodes[0] as Node;
        // selectedNode.isExpanded = !selectedNode.isExpanded;
        // diagram.dataBind();
    };
    OrgChartData.prototype.undoOrgChart = function () {
        this.selectedItem.utilityMethods.undoRedoLayout(true, this.selectedItem);
    };
    OrgChartData.prototype.redoOrgChart = function () {
        this.selectedItem.utilityMethods.undoRedoLayout(false, this.selectedItem);
    };
    OrgChartData.prototype.cutOrgChart = function () {
        this.selectedItem.utilityMethods.cutLayout(this.selectedItem);
    };
    OrgChartData.prototype.copyOrgChart = function () {
        this.selectedItem.utilityMethods.copyLayout(this.selectedItem);
    };
    OrgChartData.prototype.pasteOrgChart = function () {
        this.selectedItem.utilityMethods.pasteLayout(this.selectedItem);
    };
    OrgChartData.prototype.addChild = function (args) {
        var diagram = this.selectedItem.selectedDiagram;
        OrgChartUtilityMethods.addChild(diagram.selectedItems.nodes[0].id);
    };
    OrgChartData.prototype.editChild = function (args) {
        var diagram = this.selectedItem.selectedDiagram;
        OrgChartUtilityMethods.showCustomProperty();
    };
    OrgChartData.prototype.addRightChild = function (args) {
        var diagram = this.selectedItem.selectedDiagram;
        if (diagram.selectedItems.nodes.length > 0) {
            var node = diagram.selectedItems.nodes[0];
            if (node.inEdges.length > 0) {
                var connector1 = this.getConnector(diagram.connectors, node.inEdges[0]);
                OrgChartUtilityMethods.addChild(connector1.sourceID);
            }
        }
    };
    OrgChartData.prototype.changeChildParent = function () {
        this.selectedItem.preventPropertyChange = true;
        var diagram = this.selectedItem.selectedDiagram;
        var selectedNode = diagram.selectedItems.nodes[0];
        if (selectedNode.inEdges.length > 0) {
            var connector1 = this.getConnector(diagram.connectors, selectedNode.inEdges[0]);
            var parentNode = this.getNode(diagram.nodes, connector1.sourceID);
            if (parentNode.inEdges.length > 0) {
                var connector2 = this.getConnector(diagram.connectors, parentNode.inEdges[0]);
                connector1.sourceID = connector2.sourceID;
                diagram.dataBind();
            }
            else {
                diagram.remove(connector1);
            }
            diagram.doLayout();
            diagram.select([selectedNode]);
        }
        this.selectedItem.preventPropertyChange = false;
        this.selectedItem.isModified = true;
    };
    OrgChartData.prototype.removeChild = function (args) {
        this.selectedItem.utilityMethods.removeChild(this.selectedItem);
    };
    OrgChartData.prototype.navigateLeftChild = function () {
        this.navigateChild('left');
    };
    OrgChartData.prototype.navigateRightChild = function () {
        this.navigateChild('right');
    };
    OrgChartData.prototype.navigateTopChild = function () {
        this.navigateChild('up');
    };
    OrgChartData.prototype.navigateBottomChild = function () {
        this.navigateChild('down');
    };
    OrgChartData.prototype.navigateChild = function (direction) {
        var diagram = this.selectedItem.selectedDiagram;
        var node = null;
        if (direction === 'left' || direction === 'right') {
            var sameLevelNodes = this.getSameLevelNodes();
            var index = sameLevelNodes.indexOf(diagram.selectedItems.nodes[0]);
            node = direction === 'left' ? sameLevelNodes[index - 1] : sameLevelNodes[index + 1];
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
    OrgChartData.prototype.getMinDistanceNode = function (diagram, direction) {
        var node = diagram.selectedItems.nodes[0];
        var selectedNodeBounds = node.wrapper.bounds;
        var lastChildNode = null;
        if (direction === 'up') {
            var edges = node.inEdges;
            if (edges.length > 0) {
                var connector = this.getConnector(diagram.connectors, edges[0]);
                var parentNode = this.getNode(diagram.nodes, connector.sourceID);
                var childNodes = [];
                for (var i = 0; i < parentNode.outEdges.length; i++) {
                    connector = this.getConnector(diagram.connectors, parentNode.outEdges[i]);
                    var childNode = this.getNode(diagram.nodes, connector.targetID);
                    if (childNode) {
                        childNodes.push(childNode);
                    }
                }
                if (childNodes.length > 0) {
                    for (var i = 0; i < childNodes.length; i++) {
                        var childNodeBounds = childNodes[i].wrapper.bounds;
                        if (childNodeBounds.top < selectedNodeBounds.top && childNodeBounds.left === selectedNodeBounds.left) {
                            lastChildNode = childNodes[i];
                        }
                    }
                }
                if (!lastChildNode) {
                    lastChildNode = parentNode;
                }
            }
        }
        else {
            var oldChildBoundsLeft = 0;
            var edges = node.outEdges;
            for (var i = 0; i < edges.length; i++) {
                var connector = this.getConnector(diagram.connectors, edges[i]);
                var childNode = this.getNode(diagram.nodes, connector.targetID);
                if (childNode) {
                    var childNodeBounds = childNode.wrapper.bounds;
                    if (selectedNodeBounds.left >= childNodeBounds.left &&
                        (childNodeBounds.left >= oldChildBoundsLeft || oldChildBoundsLeft === 0)) {
                        if (lastChildNode) {
                            if (childNodeBounds.top <= lastChildNode.wrapper.bounds.top) {
                                lastChildNode = childNode;
                            }
                        }
                        else {
                            lastChildNode = childNode;
                        }
                    }
                }
                if (!lastChildNode) {
                    lastChildNode = childNode;
                }
            }
        }
        return lastChildNode;
    };
    OrgChartData.prototype.getSameLevelNodes = function () {
        var sameLevelNodes = [];
        var diagram = this.selectedItem.selectedDiagram;
        if (diagram.selectedItems.nodes.length > 0) {
            var node = diagram.selectedItems.nodes[0];
            var connector = this.getConnector(diagram.connectors, node.inEdges[0]);
            var parentNode = this.getNode(diagram.nodes, connector.sourceID);
            for (var i = 0; i < parentNode.outEdges.length; i++) {
                connector = this.getConnector(diagram.connectors, parentNode.outEdges[i]);
                var childNode = this.getNode(diagram.nodes, connector.targetID);
                if (childNode) {
                    sameLevelNodes.push(childNode);
                }
            }
        }
        return sameLevelNodes;
    };
    OrgChartData.prototype.getConnector = function (connectors, name) {
        for (var i = 0; i < connectors.length; i++) {
            if (connectors[i].id === name) {
                return connectors[i];
            }
        }
        return null;
    };
    OrgChartData.prototype.getNode = function (nodes, name) {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].id === name) {
                return nodes[i];
            }
        }
        return null;
    };
    OrgChartData.prototype.createOrgChart = function (isNew) {
        var diagram = this.selectedItem.selectedDiagram;
        this.selectedItem.utilityMethods.currentDiagramVisibility('orgchart-diagram', this.selectedItem);
        diagram.updateViewPort();
        if (isNew) {
            diagram.clear();
            OrgChartUtilityMethods.createEmptyOrgChart();
            this.doLayoutSettings(diagram);
        }
        else {
            diagram.commandManager = this.getCommandSettings();
        }
        diagram.contextMenuSettings.show = false;
        diagram.dataBind();
    };
    OrgChartData.prototype.doLayoutSettings = function (diagram) {
        diagram.layout = {
            type: 'OrganizationalChart',
            horizontalSpacing: 50, verticalSpacing: 50,
            getLayoutInfo: OrgChartUtilityMethods.getLayoutInfo.bind(OrgChartUtilityMethods)
        };
        diagram.selectedItems = { userHandles: OrgChartUtilityMethods.handle, constraints: ej.diagrams.SelectorConstraints.UserHandle };
        diagram.tool = ej.diagrams.DiagramTools.SingleSelect | ej.diagrams.DiagramTools.ZoomPan;
        diagram.pageSettings = { width: null, height: null };
        diagram.commandManager = this.getCommandSettings();
        diagram.snapSettings.constraints = diagram.snapSettings.constraints & ~ej.diagrams.SnapConstraints.ShowLines;
        diagram.selectedItems.constraints = ej.diagrams.SelectorConstraints.UserHandle;
        diagram.dataBind();
    };
    OrgChartData.prototype.canExecute = function () {
        return true;
    };
    return OrgChartData;
}());

var OrgChartUtilityMethods = (function () {
    function OrgChartUtilityMethods() {
    }
    OrgChartUtilityMethods.orgchartPaste = function () {
        var diagram = this.selectedItem.selectedDiagram;
        var selectedNode = diagram.selectedItems.nodes[0];
        var selectedelement;
        var mindmapData;
        var orientation;
        diagram.startGroupAction();
        if (this.selectedItem.pasteData.length > 0) {
            diagram.paste(this.selectedItem.pasteData);
            selectedelement = this.selectedItem.pastedFirstItem;
            var connector = {
                id: 'connector' + this.selectedItem.randomIdGenerator(), sourceID: selectedNode.id,
                targetID: selectedelement.id, type: 'Orthogonal',
                style: { strokeColor: 'black', strokeWidth: 2 }
            };
            connector.constraints = ej.diagrams.ConnectorConstraints.PointerEvents | ej.diagrams.ConnectorConstraints.Select | ej.diagrams.ConnectorConstraints.Delete;
            diagram.add(connector);
            diagram.clearSelection();
            diagram.select([selectedelement]);
            diagram.doLayout();
            diagram.bringIntoView(diagram.nodes[diagram.nodes.length - 1].wrapper.bounds);
        }
        this.selectedItem.isModified = true;
        diagram.endGroupAction();
    };
    OrgChartUtilityMethods.showUploadDialog = function () {
        this.uploadDialog.show();
    };
    OrgChartUtilityMethods.readFile = function (event) {
        this.orgChart = new OrgChartData(this.selectedItem);
        this.columnsList = [];
        var resultString = event.target.result.toString();
        if (this.fileType === 'csv') {
            this.orgDataSource = OrgChartUtilityMethods.convertCsvToJson(resultString);
        }
        else if (this.fileType === 'json') {
            this.orgDataSource = JSON.parse(resultString);
            for (var i = 0; i < this.orgDataSource.length; i++) {
                var attr = this.orgDataSource[i];
                for (var prop in attr) {
                    if (this.columnsList.indexOf(prop) === -1) {
                        this.columnsList.push(prop);
                    }
                }
            }
        }
        else {
            var parser = new DOMParser();
            var xmlDom = parser.parseFromString(resultString, 'text/xml');
            var element = xmlDom.children[0];
            this.orgDataSource = this.convertXmlToJson(element);
        }
        var columns = this.getDataSourceColumns();
        //this.selectedItem.orgDataSettings.dataSourceColumns = columns;
        document.getElementById("employeeId").ej2_instances[0].dataSource = columns;
        document.getElementById("superVisorId").ej2_instances[0].dataSource = columns;
        document.getElementById("orgNameField").ej2_instances[0].dataSource = columns;
        document.getElementById("orgBindingFields").ej2_instances[0].dataSource = columns;
        document.getElementById("orgImageField").ej2_instances[0].dataSource = columns;
        document.getElementById("orgAdditionalField").ej2_instances[0].dataSource = columns;
    };
    OrgChartUtilityMethods.validateParentChildRelation = function () {
        var isParentChild = false;
        var ss1 = this.getParentChildValues();
        for (var i = 0; i < ss1.childValues.length; i++) {
            if (ss1.parentValues.indexOf(ss1.childValues[i]) !== -1) {
                isParentChild = true;
            }
        }
        return isParentChild;
    };
    OrgChartUtilityMethods.showCustomProperty = function () {
        var node = this.selectedItem.selectedDiagram.selectedItems.nodes[0];
        this.customProperty = new CustomProperties(this.selectedItem, this.customPropertyDialog);
        this.customProperty.getPropertyDialogContent(node.addInfo);
        this.customPropertyDialog.cssClass = 'db-org-diagram';
        this.customPropertyDialog.dataBind();
        this.customPropertyDialog.show();
    };
    OrgChartUtilityMethods.getParentChildValues = function () {
        var parentValues = [], childValues = [];
        for (var i = 0; i < this.orgDataSource.length; i++) {
            var data = this.orgDataSource[i];
            var childValue = data[this.selectedItem.orgDataSettings.id] ? data[this.selectedItem.orgDataSettings.id].toString() : '';
            var parentValue = data[this.selectedItem.orgDataSettings.parent] ? data[this.selectedItem.orgDataSettings.parent].toString() : '';
            if (childValue) {
                childValues.push(childValue);
            }
            if (parentValue) {
                parentValues.push(parentValue);
            }
        }
        return { parentValues: parentValues, childValues: childValues };
    };
    OrgChartUtilityMethods.addChild = function (sourceId) {
        var diagram = this.selectedItem.selectedDiagram;
        var parentNode = this.getNode(diagram.nodes, sourceId);
        diagram.startGroupAction();
        var node = {
            id: 'node' + this.selectedItem.randomIdGenerator(),
            minWidth: parentNode.minWidth, minHeight: parentNode.minHeight, maxHeight: parentNode.maxHeight,
            annotations: [{ content: 'Name', style: { bold: true, fontSize: 14 } }],
            style: { fill: parentNode.style.fill, strokeColor: parentNode.style.strokeColor, strokeWidth: parentNode.style.strokeWidth },
            offsetX: 200, offsetY: 200
        };
        node.constraints = ej.diagrams.NodeConstraints.Default | ej.diagrams.NodeConstraints.AllowDrop;
        if (parentNode.shape && parentNode.shape.type === 'Image') {
            node.shape = { type: 'Image', source: 'src/assets/dbstyle/orgchart_images/blank-male.jpg', align: 'XMinYMin', scale: 'Meet' };
        }
        else {
            node.shape = { type: 'Basic', shape: 'Rectangle', cornerRadius: 5 };
        }
        var keys = Object.keys(parentNode.addInfo);
        var addInfo = {};
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var keyValue = ej.diagrams.cloneObject(parentNode.addInfo[key]);
            addInfo[key] = keyValue;
            if (key !== 'Name') {
                addInfo[key].value = '';
            }
            else {
                addInfo[key].value = 'Name';
            }
        }
        node.addInfo = ej.diagrams.cloneObject(addInfo);
        diagram.add(node);
        var connector = {
            id: 'connector' + this.selectedItem.randomIdGenerator(), sourceID: sourceId,
            targetID: node.id, type: 'Orthogonal',
            style: { strokeColor: 'black', strokeWidth: 2 }
        };
        connector.constraints = ej.diagrams.ConnectorConstraints.PointerEvents | ej.diagrams.ConnectorConstraints.Select | ej.diagrams.ConnectorConstraints.Delete;
        diagram.add(connector);
        var node1 = this.getNode(diagram.nodes, node.id);
        diagram.doLayout();
        diagram.endGroupAction();
        this.selectedItem.preventPropertyChange = true;
        diagram.select([node1]);
        this.selectedItem.preventPropertyChange = false;
        diagram.bringIntoView(node1.wrapper.bounds);
        this.selectedItem.isModified = true;
    };
    OrgChartUtilityMethods.getNode = function (nodes, name) {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].id === name) {
                return nodes[i];
            }
        }
        return null;
    };
    OrgChartUtilityMethods.bindFields = function () {
        var addInfo = {};
        for (var i = 0; i < this.orgDataSource.length; i++) {
            addInfo = {};
            addInfo.nameField = this.selectedItem.orgDataSettings.nameField;
            addInfo.bindingFields = this.selectedItem.orgDataSettings.bindingFields;
            addInfo.imageField = this.selectedItem.orgDataSettings.imageField;
            addInfo.additionalFields = this.selectedItem.orgDataSettings.additionalFields;
            this.orgDataSource[i].addInfo = ej.diagrams.cloneObject(addInfo);
        }
        return this.orgDataSource;
    };
    OrgChartUtilityMethods.createEmptyOrgChart = function () {
        var diagram = this.selectedItem.selectedDiagram;
        diagram.constraints = diagram.constraints & ~ej.diagrams.DiagramConstraints.UndoRedo;
        var node = {
            id: 'rootNode', minWidth: 150, minHeight: 50, maxHeight: 50,
            annotations: [{ content: 'Name', style: { fontSize: 14, bold: true } }],
            shape: { type: 'Basic', shape: 'Rectangle', cornerRadius: 5 },
            style: { fill: '#C4F2E8', strokeColor: '#8BC1B7', strokeWidth: 2 },
            addInfo: {
                'Name': { value: 'Name', type: 'nameField', checked: true },
                'Image URL': { value: '', type: 'imageField', checked: false }
            },
        };
        node.constraints = ej.diagrams.NodeConstraints.Default & ~ej.diagrams.NodeConstraints.Delete;
        node.constraints |= ej.diagrams.NodeConstraints.AllowDrop;
        diagram.add(node);
        var node1 = {
            id: 'textNode', width: 400, height: 300, offsetX: diagram.scrollSettings.viewPortWidth - 200,
            offsetY: 150, shape: { type: 'HTML', content: this.getShortCutString() }, style: { strokeWidth: 0 },
            excludeFromLayout: true, constraints: ej.diagrams.NodeConstraints.Default & ~ej.diagrams.NodeConstraints.Delete
        };
        diagram.add(node1);
        document.getElementById('diagram').querySelector('#closeIconDiv').onclick = this.onHideNodeClick.bind(this);
        diagram.constraints = diagram.constraints | ej.diagrams.DiagramConstraints.UndoRedo;
    };
    OrgChartUtilityMethods.onHideNodeClick = function () {
        var node1 = MindMapUtilityMethods.getNode(this.selectedItem.selectedDiagram.nodes, 'textNode');
        node1.visible = !node1.visible;
        this.selectedItem.selectedDiagram.dataBind();
    };
    OrgChartUtilityMethods.getShortCutString = function () {
        return '<div style="width: 400px; height: 300px; padding: 10px; background-color: #FFF7B5; border: 1px solid #FFF7B5">' +
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
            '<span class="db-html-font-normal">Add a child to parent</span>' +
            '</li>' +
            '</ul>' +
            '</div>' +
            '<div>' +
            '<ul>' +
            '<li>' +
            '<span class="db-html-font-medium">Enter : </span>' +
            '<span class="db-html-font-normal">Add a child to the same level</span>' +
            '</li>' +
            '</ul>' +
            '</div>' +
            '<div>' +
            '<ul>' +
            '<li>' +
            '<span class="db-html-font-medium">Shift + Tab : </span>' +
            '<span class="db-html-font-normal">Move the child parent to the next level</span>' +
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
            '<span class="db-html-font-normal">Navigate between child</span>' +
            '</li>' +
            '</ul>' +
            '</div>' +
            '<div>' +
            '<ul>' +
            '<li>' +
            '<span class="db-html-font-medium">Spacebar : </span>' +
            '<span class="db-html-font-normal">Expand/Collapse a shape</span>' +
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
    OrgChartUtilityMethods.applyDataSource = function () {
        document.getElementsByClassName('db-property-editor-container')[0].classList.add('orgchart-diagram');
        var diagram = this.selectedItem.selectedDiagram;
        diagram.clear();
        diagram.updateViewPort();
        diagram.getNodeDefaults = this.setNodeDefaults;
        diagram.getConnectorDefaults = this.setConnectorDefaults;
        var items = new ej.data.DataManager(this.bindFields());
        if (this.fileType === 'xml') {
            diagram.dataSourceSettings = {
                id: 'id', parentId: 'parentId', dataManager: items
            };
        }
        else {
            diagram.dataSourceSettings = {
                id: this.selectedItem.orgDataSettings.id.toString(), parentId: this.selectedItem.orgDataSettings.parent.toString(),
                dataManager: items
            };
        }
        diagram.layout = {
            type: 'OrganizationalChart',
            getLayoutInfo: this.getLayoutInfo.bind(this)
        };
        diagram.selectedItems = { userHandles: OrgChartUtilityMethods.handle, constraints: ej.diagrams.SelectorConstraints.UserHandle };
        diagram.pageSettings = { width: null, height: null };
        //diagram.tool = ej.diagrams.DiagramTools.SingleSelect | ej.diagrams.DiagramTools.ZoomPan;
        diagram.commandManager = this.orgChart.getCommandSettings();
        diagram.snapSettings.constraints = diagram.snapSettings.constraints & ~ej.diagrams.SnapConstraints.ShowLines;
        diagram.selectedItems.constraints = ej.diagrams.SelectorConstraints.UserHandle;
        diagram.dataBind();
        diagram.dataBind();
        this.uploadDialog.hide();
    };
    OrgChartUtilityMethods.getLayoutInfo = function (node, options) {
        if (!options.hasSubTree) {
            options.orientation = this.subTreeOrientation;
            options.type = this.subTreeAlignments;
        }
    };
    OrgChartUtilityMethods.getDataSourceColumns = function () {
        var columns = [];
        for (var i = 0; i < this.columnsList.length; i++) {
            if (this.columnsList[i]) {
                columns.push({
                    'text': this.columnsList[i], 'value': this.columnsList[i]
                });
            }
        }
        return columns;
    };
    OrgChartUtilityMethods.setConnectorDefaults = function (connector, diagram) {
        var connector1 = { type: 'Orthogonal', style: { strokeWidth: 2 } };
        return connector1;
    };
    OrgChartUtilityMethods.setNodeDefaults = function (node, diagram) {
        node.minWidth = node.minWidth || 150;
        node.minHeight = node.minHeight || 100;
        node.maxHeight = node.maxHeight || 100;
        if (node.data) {
            var data = node.data;
            var addInfo = data.addInfo;
            var addInfo1 = {};
            var propName1 = 'Name';
            addInfo1[propName1] = { 'value': data[addInfo.nameField.toString()], 'type': 'nameField', 'checked': true };
            var propertyFields = [addInfo.nameField.toString()];
            if (addInfo.imageField) {
                propName1 = 'Image URL';
                node.shape = {
                    type: 'Image', source: data[addInfo.imageField.toString()].toString(),
                    align: 'XMinYMin', scale: 'Meet'
                };
                node.minWidth = 250;
                addInfo1[propName1] = { 'value': data[addInfo.imageField.toString()], 'type': 'imageField', 'checked': true };
            }
            if (addInfo.bindingFields) {
                var bindingFields = addInfo.bindingFields;
                for (var i = 0; i < bindingFields.length; i++) {
                    addInfo1[bindingFields[i]] = { 'value': data[bindingFields[i]], 'type': 'bindingField', 'checked': true };
                }
                propertyFields = propertyFields.concat(bindingFields);
            }
            var annotations = [];
            var startY = 0.5 - ((propertyFields.length - 1) / 10);
            for (var i = 0; i < propertyFields.length; i++) {
                var content = data[propertyFields[i]];
                var annotation1 = { content: content ? content : '' };
                var offset = { x: 0.5, y: startY };
                if (node.shape && node.shape.type === 'Image') {
                    offset.x = 0;
                    annotation1.margin = { left: 110 };
                    annotation1.horizontalAlignment = 'Left';
                }
                if (i === 0) {
                    annotation1.style = { fontSize: 14, bold: true };
                }
                startY += 0.2;
                annotation1.offset = offset;
                annotations.push(annotation1);
            }
            if (annotations.length > 0) {
                node.annotations = annotations;
            }
            if (addInfo.additionalFields) {
                var additionalFields = addInfo.additionalFields;
                var content = '';
                for (var i = 0; i < additionalFields.length; i++) {
                    content = content + additionalFields[i] + ':' + data[additionalFields[i]] + '\n';
                    addInfo1[additionalFields[i]] = { 'value': data[additionalFields[i]], 'type': 'bindingField', 'checked': false };
                }
                node.tooltip = { content: content, position: 'BottomCenter', relativeMode: 'Object' };
                node.constraints = ej.diagrams.NodeConstraints.Default | ej.diagrams.NodeConstraints.Tooltip;
            }
            node.style.fill = '#88C65C';
            node.style.strokeColor = '#88C65C';
            node.addInfo = addInfo1;
        }
        return node;
    };
    OrgChartUtilityMethods.convertCsvToJson = function (csvText) {
        var allTextLines = csvText.split(/\r\n|\n/);
        this.columnsList = allTextLines[0].split(',');
        var lines = [];
        for (var i = 1; i < allTextLines.length; i++) {
            if (allTextLines[i]) {
                var data = allTextLines[i].split(',');
                //if (data.length === headers.length) {
                var tarr = {};
                for (var j = 0; j < this.columnsList.length; j++) {
                    if (data[j].trim().startsWith('"') && !data[j].trim().endsWith('"')) {
                        while (!data[j].trim().endsWith('"')) {
                            data[j] = data[j] + ',' + data[j + 1];
                            data.splice(j + 1, 1);
                        }
                    }
                    tarr[this.columnsList[j]] = data[j];
                }
                lines.push(tarr);
                //}
            }
        }
        return lines;
    };
    OrgChartUtilityMethods.convertXmlToJson = function (element) {
        var dataSource = [];
        for (var i = 0; i < element.children.length; i++) {
            var childElement = element.children[i];
            var rowData = this.generateRowData(childElement, dataSource.length.toString());
            if (Object.keys(rowData).length > 0) {
                dataSource.push(rowData);
            }
            if (childElement.children.length > 0) {
                var key = 'id';
                this.convertChildXmlToJson(childElement, rowData[key].toString(), dataSource);
            }
        }
        return dataSource;
    };
    OrgChartUtilityMethods.convertChildXmlToJson = function (element, parentId, dataSource) {
        for (var i = 0; i < element.children.length; i++) {
            var childElement = element.children[i];
            var rowData = this.generateRowData(childElement, dataSource.length.toString(), parentId.toString());
            if (Object.keys(rowData).length > 0) {
                dataSource.push(rowData);
            }
            if (childElement.children.length > 0) {
                var key = 'id';
                this.convertChildXmlToJson(childElement, rowData[key].toString(), dataSource);
            }
        }
    };
    OrgChartUtilityMethods.generateRowData = function (element, id, parentId) {
        var rowData = {};
        for (var i = 0; i < element.attributes.length; i++) {
            var attr = element.attributes[i];
            rowData[attr.name] = attr.value;
            if (this.columnsList.indexOf(attr.name) === -1) {
                this.columnsList.push(attr.name);
            }
        }
        var key = 'id';
        rowData[key] = id;
        if (parentId) {
            key = 'parentId';
            rowData[key] = parentId;
        }
        return rowData;
    };
    OrgChartUtilityMethods.columnsList = [];
    OrgChartUtilityMethods.orgDataSource = [];
    OrgChartUtilityMethods.subTreeOrientation = 'Vertical';
    OrgChartUtilityMethods.subTreeAlignments = 'Alternate';
    OrgChartUtilityMethods.shortCutkeys = [
        { 'key': 'Tab', 'value': 'Add a child to parent' },
        { 'key': 'Enter', 'value': 'Add a child to same level' },
        { 'key': 'Shift + Tab', 'value': 'Move the child parent to next level' },
        { 'key': 'Delete', 'value': 'Delete a child' },
        { 'key': 'Spacebar', 'value': 'Expand/Collapse a shape' },
        { 'key': 'F2', 'value': 'Edit a shape' },
        { 'key': 'Esc', 'value': 'End Editing' },
        { 'key': 'Arrow(Up, Down, Left, Right)', 'value': 'Navigate between child' },
    ];
    OrgChartUtilityMethods.handle = [
        {
            name: 'orgAddHandle', pathColor: 'white', backgroundColor: '#7d7d7d', borderColor: 'white',
            pathData: 'M 30.05 15.03 L 30.05 30.05 L 15.02 30.05 L 15.02 39.9 L 30.05 39.9 L 30.05 54.93 L 39.9 54.93 L 39.9 39.9 L 54.93 39.9 L 54.93 30.05 L 39.9 30.05 L 39.9 15.03 z',
            side: 'Left', offset: 0, horizontalAlignment: 'Center', verticalAlignment: 'Center'
        },
        {
            name: 'orgRemoveHandle', pathColor: 'white', backgroundColor: '#7d7d7d', borderColor: 'white',
            pathData: 'M 7.04 22.13 L 92.95 22.13 L 92.95 88.8 C 92.95 91.92 91.55 94.58 88.76 96.74 C 85.97 98.91 82.55 100 78.52 100 L 21.48 100 C 17.45 100 14.03 98.91 11.24 96.74 C 8.45 94.58 7.04 91.92 7.04 88.8 z M 32.22 0 L 67.78 0 L 75.17 5.47 L 100 5.47 L 100 16.67 L 0 16.67 L 0 5.47 L 24.83 5.47 z',
            visible: true, offset: 1, side: 'Right', horizontalAlignment: 'Center', verticalAlignment: 'Center'
        }, {
            name: 'orgEditHandle', pathColor: 'white', backgroundColor: '#7d7d7d', borderColor: 'white',
            pathData: 'M 42.65 30.41 L 67.5 53.99 L 41.2 78.73 C 39.41 80.42 37.34 81.27 34.99 81.27 C 32.65 81.27 30.57 80.49 28.78 78.93 L 25.05 82.44 L 0 82.44 L 16.36 67.05 C 14.57 65.36 13.67 63.41 13.67 61.2 C 13.67 58.99 14.57 56.98 16.36 55.16 z M 78.42 25.49 C 78.57 0 78.73 0.01 78.88 0.01 C 81.09 -0.12 83.09 0.66 84.88 2.35 L 97.52 14.04 C 99.17 15.86 100 17.87 100 20.09 C 100 22.29 99.17 24.24 97.52 25.93 L 71.84 50.09 L 46.79 26.51 L 72.47 2.35 C 74.15 0.77 76.13 -0.02 78.42 25.49 z',
            side: 'Right', offset: 0, horizontalAlignment: 'Center', verticalAlignment: 'Center'
        },
    ];
    return OrgChartUtilityMethods;
}());