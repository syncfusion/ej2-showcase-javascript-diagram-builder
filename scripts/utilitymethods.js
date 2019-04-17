/**
 *  Home page handler
 */

var PaperSize = (function () {
    function PaperSize() {
    }
    return PaperSize;
}());

var UtilityMethods = (function () {
    function UtilityMethods() {
        this.flowChartImage = [
            { source: 'src/assets/dbstyle/common_images/blank_diagram.svg', name: 'Blank Diagram', type: 'svg_blank' },
            { source: 'src/assets/dbstyle/flowchart_Images/Credit_Card_Processing.svg', name: 'Credit Card Processing', type: 'svg_image' },
            { source: 'src/assets/dbstyle/flowchart_Images/Bank_Teller_Flow.svg', name: 'Banking Teller Process Flow', type: 'svg_image' },
            { source: 'src/assets/dbstyle/flowchart_Images/Developer_Workflow.SVG', name: 'Agile"s Developer Workflow', type: 'svg_image' },
        ];
        this.mindMapImage = [
            { source: 'src/assets/dbstyle/common_images/blank_diagram_mind.svg', name: 'Blank Diagram', type: 'svg_image' },
            { source: 'src/assets/dbstyle/mindmap_images/BusinessPlanning.SVG', name: 'Business Planning', type: 'svg_image' },
            { source: 'src/assets/dbstyle/mindmap_images/TQM.SVG', name: 'Quality Management', type: 'svg_image' },
            { source: 'src/assets/dbstyle/mindmap_images/SoftwareLifeCycle.SVG', name: 'Software Life Cycle', type: 'svg_image' },
        ];
        this.orgChartImage = [
            { source: 'src/assets/dbstyle/common_images/blank_diagram_org.svg', name: 'Blank Diagram', type: 'svg_image' },
            { source: 'src/assets/dbstyle/orgchart_images/OrgRenderingStyle_1.svg', name: 'Org Template Style - 1', type: 'svg_image' },
            { source: 'src/assets/dbstyle/orgchart_images/OrgRenderingStyle_2.svg', name: 'Org Template Style - 2', type: 'svg_image' },
            { source: 'src/assets/dbstyle/orgchart_images/OrgRenderingStyle_3.svg', name: 'Org Template Style - 3', type: 'svg_image' },
        ];
        this.bpmnImage = [
            { source: 'src/assets/dbstyle/common_images/blank_diagram.svg', name: 'Blank Diagram', type: 'svg_blank' },
            { source: 'src/assets/dbstyle/bpmn_images/Template1.png', name: 'BPMN Diagram 1' },
            { source: 'src/assets/dbstyle/bpmn_images/Template1.png', name: 'BPMN Diagram 2' },
            { source: 'src/assets/dbstyle/bpmn_images/Template1.png', name: 'BPMN Diagram 3' },
        ];
        this.fillColorCode = ['#C4F2E8', '#F7E0B3', '#E5FEE4', '#E9D4F1', '#D4EFED', '#DEE2FF'];
        this.borderColorCode = ['#8BC1B7', '#E2C180', '#ACCBAA', '#D1AFDF', '#90C8C2', '#BBBFD6'];
    }
    UtilityMethods.prototype.bindNodeProperties = function (node, selectedItem) {
        selectedItem.preventPropertyChange = true;
        selectedItem.nodeProperties.offsetX.value = (Math.round(node.offsetX * 100) / 100);
        selectedItem.nodeProperties.offsetY.value = (Math.round(node.offsetY * 100) / 100);
        selectedItem.nodeProperties.width.value = node.width ? (Math.round(node.width * 100) / 100) : (Math.round(node.minWidth * 100) / 100);
        selectedItem.nodeProperties.height.value = node.height ? (Math.round(node.height * 100) / 100) : (Math.round(node.minHeight * 100) / 100);
        selectedItem.nodeProperties.rotateAngle.value = node.rotateAngle;
        selectedItem.nodeProperties.strokeColor.value = this.getHexColor(node.style.strokeColor);
        selectedItem.nodeProperties.strokeStyle.value = node.style.strokeDashArray ? node.style.strokeDashArray : 'None';
        selectedItem.nodeProperties.strokeWidth.value = node.style.strokeWidth;
        selectedItem.nodeProperties.fillColor.value = this.getHexColor(node.style.fill);
        selectedItem.nodeProperties.opacity.value = node.style.opacity * 100;
        selectedItem.nodeProperties.aspectRatio.checked = node.constraints & ej.diagrams.NodeConstraints.AspectRatio ? true : false;
        selectedItem.nodeProperties.gradient = node.style.gradient.type !== 'None' ? true : false;
        var gradientElement = document.getElementById('gradientStyle');
        if (selectedItem.nodeProperties.gradient) {
            gradientElement.className = 'row db-prop-row db-gradient-style-show';
            selectedItem.nodeProperties.gradientColor.value = node.style.gradient.stops[1].color;
            var gradient = node.style.gradient;
            if (gradient.x1) {
                selectedItem.nodeProperties.gradientDirection.value = 'North';
            }
            else if (gradient.x2) {
                selectedItem.nodeProperties.gradientDirection.value = 'East';
            }
            else if (gradient.y1) {
                selectedItem.nodeProperties.gradientDirection.value = 'West';
            }
            else if (gradient.y2) {
                selectedItem.nodeProperties.gradientDirection.value = 'South';
            }
        }
        else {
            gradientElement.className = 'row db-prop-row db-gradient-style-hide';
            selectedItem.nodeProperties.gradientColor.value = '#ffffff';
            selectedItem.nodeProperties.gradientDirection.value = 'South';
        }
        selectedItem.preventPropertyChange = false;
    };
    UtilityMethods.prototype.bindMindMapProperties = function (node, selectedItem) {
        selectedItem.preventPropertyChange = true;
        selectedItem.mindmapSettings.stroke.value = node.style.strokeColor;
        selectedItem.mindmapSettings.strokeStyle.value = node.style.strokeDashArray ? node.style.strokeDashArray : 'None';
        selectedItem.mindmapSettings.strokeWidth.value = node.style.strokeWidth;
        selectedItem.mindmapSettings.fill.value = node.style.fill;
        selectedItem.mindmapSettings.opacity.value = (node.style.opacity || 1) * 100;
        if (node.annotations.length > 0) {
            var annotation = node.annotations[0].style;
            selectedItem.mindmapSettings.fontFamily.value = annotation.fontFamily;
            selectedItem.mindmapSettings.fontColor.value = annotation.color;
            selectedItem.mindmapSettings.fontSize.value = annotation.fontSize;
            selectedItem.mindmapSettings.textOpacity.value = (annotation.opacity || 1) * 100;
        }
        selectedItem.preventPropertyChange = false;
    };
    UtilityMethods.prototype.bindTextProperties = function (text, selectedItem) {
        selectedItem.preventPropertyChange = true;
        selectedItem.textProperties.fontColor.value = this.getHexColor(text.color);
        selectedItem.textProperties.fontFamily.value = text.fontFamily;
        selectedItem.textProperties.fontSize.value = text.fontSize;
        selectedItem.textProperties.opacity.value = text.opacity * 100;
        var toolbarTextStyle = document.getElementById('toolbarTextStyle');
        if (toolbarTextStyle) {
            toolbarTextStyle = toolbarTextStyle.ej2_instances[0];
        }
        if (toolbarTextStyle) {
            toolbarTextStyle.items[0].cssClass = text.bold ? 'tb-item-start tb-item-selected' : 'tb-item-start';
            toolbarTextStyle.items[1].cssClass = text.italic ? 'tb-item-middle tb-item-selected' : 'tb-item-middle';
            toolbarTextStyle.items[2].cssClass = text.textDecoration === 'Underline' ? 'tb-item-end tb-item-selected' : 'tb-item-end';
        }
        this.updateTextAlign(text.textAlign);
        selectedItem.preventPropertyChange = false;
    };
    UtilityMethods.prototype.updateTextAlign = function (textAlign) {
        var toolbarTextSubAlignment = document.getElementById('toolbarTextSubAlignment');
        if (toolbarTextSubAlignment) {
            toolbarTextSubAlignment = toolbarTextSubAlignment.ej2_instances[0];
        }
        if (toolbarTextSubAlignment) {
            for (var i = 0; i < toolbarTextSubAlignment.items.length; i++) {
                toolbarTextSubAlignment.items[i].cssClass = toolbarTextSubAlignment.items[i].cssClass.replace(' tb-item-selected', '');
            }
            var index = textAlign === 'Left' ? 0 : (textAlign === 'Center' ? 1 : 2);
            toolbarTextSubAlignment.items[index].cssClass = toolbarTextSubAlignment.items[index].cssClass + ' tb-item-selected';
        }
    };
    UtilityMethods.prototype.updateHorVertAlign = function (horizontalAlignment, verticalAlignment) {
        var toolbarHorVerAlignment = document.getElementById('toolbarTextAlignment');
        if (toolbarHorVerAlignment) {
            toolbarHorVerAlignment = toolbarHorVerAlignment.ej2_instances[0];
        }
        if (toolbarHorVerAlignment) {
            for (var i = 0; i < toolbarHorVerAlignment.items.length; i++) {
                toolbarHorVerAlignment.items[i].cssClass = toolbarHorVerAlignment.items[i].cssClass.replace(' tb-item-selected', '');
            }
            var index = horizontalAlignment === 'Right' ? 0 : (horizontalAlignment === 'Center' ? 1 : 2);
            toolbarHorVerAlignment.items[index].cssClass = toolbarHorVerAlignment.items[index].cssClass + ' tb-item-selected';
            index = verticalAlignment === 'Bottom' ? 3 : (verticalAlignment === 'Center' ? 4 : 5);
            toolbarHorVerAlignment.items[index].cssClass = toolbarHorVerAlignment.items[index].cssClass + ' tb-item-selected';
        }
    };
    UtilityMethods.prototype.bindConnectorProperties = function (connector, selectedItem) {
        selectedItem.preventPropertyChange = true;
        selectedItem.connectorProperties.lineColor.value = this.getHexColor(connector.style.strokeColor);
        selectedItem.connectorProperties.lineStyle.value = connector.style.strokeDashArray ? connector.style.strokeDashArray : 'None';
        selectedItem.connectorProperties.lineType.value = connector.type;
        selectedItem.connectorProperties.lineWidth.value = connector.style.strokeWidth;
        selectedItem.connectorProperties.sourceType.value = connector.sourceDecorator.shape;
        selectedItem.connectorProperties.targetType.value = connector.targetDecorator.shape;
        selectedItem.connectorProperties.opacity.value = connector.style.opacity * 100;
        selectedItem.connectorProperties.lineJumpSize.value = connector.bridgeSpace;
        selectedItem.connectorProperties.lineJump.checked = connector.constraints & ej.diagrams.ConnectorConstraints.Bridging ? true : false;
        selectedItem.connectorProperties.targetSize.value = connector.targetDecorator.width;
        selectedItem.connectorProperties.sourceSize.value = connector.sourceDecorator.width;
        selectedItem.preventPropertyChange = false;
    };
    UtilityMethods.prototype.getHexColor = function (colorStr) {
        var a = document.createElement('div');
        a.style.color = colorStr;
        var colors = window.getComputedStyle(document.body.appendChild(a)).color.match(/\d+/g).map(function (a) {
            return parseInt(a, 10);
        });
        document.body.removeChild(a);
        return (colors.length >= 3) ? '#' + (((1 << 24) + (colors[0] << 16) + (colors[1] << 8) + colors[2]).toString(16).substr(1)) : '';
    };
    UtilityMethods.prototype.getOffset = function (position) {
        switch (position.toLowerCase()) {
            case 'topleft':
                return { x: 0, y: 0 };
            case 'topcenter':
                return { x: 0.5, y: 0 };
            case 'topright':
                return { x: 1, y: 0 };
            case 'middleleft':
                return { x: 0, y: 0.5 };
            default:
                return { x: 0.5, y: 0.5 };
            case 'middleright':
                return { x: 1, y: 0.5 };
            case 'bottomleft':
                return { x: 0, y: 1 };
            case 'bottomcenter':
                return { x: 0.5, y: 1 };
            case 'bottomright':
                return { x: 1, y: 1 };
        }
    };
    UtilityMethods.prototype.getPosition = function (offset) {
        if (offset.x === 0 && offset.y === 0) {
            return 'TopLeft';
        }
        else if (offset.x === 0.5 && offset.y === 0) {
            return 'TopCenter';
        }
        else if (offset.x === 1 && offset.y === 0) {
            return 'TopRight';
        }
        else if (offset.x === 0 && offset.y === 0.5) {
            return 'MiddleLeft';
        }
        else if (offset.x === 1 && offset.y === 0.5) {
            return 'MiddleRight';
        }
        else if (offset.x === 0 && offset.y === 1) {
            return 'BottomLeft';
        }
        else if (offset.x === 0.5 && offset.y === 1) {
            return 'BottomCenter';
        }
        else if (offset.x === 1 && offset.y === 1) {
            return 'BottomRight';
        }
        else {
            return 'Center';
        }
    };
    UtilityMethods.prototype.hideElements = function (elementType, diagram, diagramType) {
        var diagramContainer = document.getElementsByClassName('diagrambuilder-container')[0];
        if (diagramContainer.classList.contains(elementType)) {
            if (!(diagramType === 'mindmap-diagram' || diagramType === 'orgchart-diagram')) {
                diagramContainer.classList.remove(elementType);
            }
        }
        else {
            diagramContainer.classList.add(elementType);
        }
        if (diagram) {
            diagram.updateViewPort();
        }
    };
    UtilityMethods.prototype.objectTypeChange = function (objectType) {
        document.getElementById('diagramPropertyContainer').style.display = 'none';
        document.getElementById('nodePropertyContainer').style.display = 'none';
        document.getElementById('textPropertyContainer').style.display = 'none';
        document.getElementById('connectorPropertyContainer').style.display = 'none';
        switch (objectType) {
            case 'diagram':
                document.getElementById('diagramPropertyContainer').style.display = '';
                break;
            case 'node':
                document.getElementById('nodePropertyContainer').style.display = '';
                break;
            case 'connector':
                document.getElementById('connectorPropertyContainer').style.display = '';
                break;
        }
    };
    UtilityMethods.prototype.getDefaultDiagramTemplates1 = function (selectedItem, tempCount, backgroundColor, parentId) {
        tempCount = tempCount ? tempCount : 4;
        backgroundColor = backgroundColor ? backgroundColor : 'red';
        parentId = parentId ? parentId : 'Flow Chart';
        var parentDiv = document.getElementById('diagramTemplateDiv1');
        parentDiv = parentDiv.cloneNode(true);
        parentDiv.id = '';
        parentDiv.style.display = '';
        var parentElements = parentDiv.getElementsByClassName('db-diagram-template-parent-text');
        for (var i = 0; i < parentElements.length; i++) {
            if (parentElements[i].children[0].innerHTML.trim() === parentId) {
                parentElements[i].classList.add('active');
            }
            parentElements[i].onclick = this.showDiagramTemplates.bind(this, selectedItem);
        }
        var diagramTemplatesDiv = parentDiv.getElementsByClassName('diagramTemplates')[0];
        diagramTemplatesDiv.appendChild(this.generateDiagramTemplates(tempCount, backgroundColor, parentId, selectedItem));
        this.tempDialog.content = parentDiv.outerHTML;
        this.tempDialog.dataBind();
        this.triggerTemplateEvent(selectedItem);
        return this.tempDialog.content;
    };
    UtilityMethods.prototype.generateDiagramTemplates = function (tempCount, backgroundColor, parentId, selectedItem) {
        var parentTemplateDiv = document.createElement('div');
        parentTemplateDiv.classList.add('class', 'db-parent-diagram-template');
        var divElement = document.getElementById('diagramTemplateDiv');
        for (var i = 0; i < tempCount; i++) {
            var cloneTemplateDiv = divElement.cloneNode(true);
            cloneTemplateDiv.style.display = '';
            cloneTemplateDiv.id = '';
            var imageDiv = cloneTemplateDiv.children[0];
            imageDiv.setAttribute('id', parentId.replace(' ', '').toLowerCase() + '_child' + i);
            imageDiv.onclick = this.generateDiagram.bind(this, selectedItem);
            var diagramType = this.getImageSource(parentId, i);
            imageDiv.children[0].style.backgroundImage = 'url(' + diagramType.source + ')';
            if (diagramType.type) {
                if (diagramType.type === 'svg_blank') {
                    imageDiv.children[0].className = 'db-diagram-template-svg-blank-image';
                }
                else {
                    imageDiv.children[0].className = 'db-diagram-template-svg-image';
                }
            }
            else {
                imageDiv.children[0].className = 'db-diagram-template-image';
            }
            cloneTemplateDiv.children[1].children[0].innerHTML = diagramType.name;
            parentTemplateDiv.appendChild(cloneTemplateDiv);
        }
        return parentTemplateDiv;
    };
    UtilityMethods.prototype.triggerTemplateEvent = function (selectedItem) {
        var parentElements = document.getElementsByClassName('db-diagram-template-parent-text');
        for (var i = 0; i < parentElements.length; i++) {
            parentElements[i].onclick = this.showDiagramTemplates.bind(this, selectedItem);
        }
        var parentElements1 = document.getElementsByClassName('db-diagram-template-image-div');
        for (var i = 0; i < parentElements1.length; i++) {
            parentElements1[i].onclick = this.generateDiagram.bind(this, selectedItem);
        }
    };
    UtilityMethods.prototype.getImageSource = function (diagramType, index) {
        switch (diagramType) {
            case 'Flow Chart':
                return this.flowChartImage[index];
            case 'Mind Map':
                return this.mindMapImage[index];
            case 'Org Chart':
                return this.orgChartImage[index];
            default:
                return this.bpmnImage[index];
        }
    };
    UtilityMethods.prototype.readTextFile = function (file, selectedItem) {
        var _this = this;
        document.getElementsByClassName('sb-content-overlay')[0].style.display = '';
        var ajax = new ej.base.Ajax(file, 'GET', true);
        ajax.send().then();
        var context = this;
        ajax.onSuccess = function (data) {
            selectedItem.preventSelectionChange = true;
            selectedItem.isTemplateLoad = true;
            _this.page.loadPage(data);
            _this.page.loadDiagramSettings();
            selectedItem.isTemplateLoad = false;
            if (selectedItem.diagramType === 'MindMap') {
                var rootNode = MindMapUtilityMethods.getNode(selectedItem.selectedDiagram.nodes, 'rootNode');
                selectedItem.utilityMethods.bindMindMapProperties(rootNode, selectedItem);
            }
            if (selectedItem.diagramType === 'OrgChart') {
                selectedItem.selectedDiagram.layout.getLayoutInfo = OrgChartUtilityMethods.getLayoutInfo.bind(OrgChartUtilityMethods);
                selectedItem.selectedDiagram.selectedItems.userHandles = OrgChartUtilityMethods.handle;
                selectedItem.selectedDiagram.selectedItems.constraints = ej.diagrams.SelectorConstraints.UserHandle;
                selectedItem.selectedDiagram.dataBind();
            }
            selectedItem.preventSelectionChange = false;
            document.getElementsByClassName('sb-content-overlay')[0].style.display = 'none';
        };
        ajax.onFailure = function (data) {
            document.getElementsByClassName('sb-content-overlay')[0].style.display = 'none';
        };
        ajax.onError = function (evt) {
            document.getElementsByClassName('sb-content-overlay')[0].style.display = 'none';
            return null;
        };
    };
    UtilityMethods.prototype.generateDiagram = function (selectedItem, evt) {
        var diagramContainer = document.getElementsByClassName('diagrambuilder-container')[0];
        var target = evt.target;
        if (target.id.startsWith('mindmap')) {
            selectedItem.diagramType = 'MindMap';
            MindMapUtilityMethods.selectedItem = selectedItem;
            var mindMapObject = new MindMap(selectedItem);
            if (target.id === 'mindmap_child0') {
                mindMapObject.createMindMap(true);
                MindMapUtilityMethods.templateType = 'template1';
            }
            else if (target.id === 'mindmap_child1') {
                mindMapObject.createMindMap(false);
                this.readTextFile('src/assets/dbstyle/mindmap_images/BusinessPlanning.json', selectedItem);
                MindMapUtilityMethods.templateType = 'template1';
            }
            else if (target.id === 'mindmap_child2') {
                mindMapObject.createMindMap(false);
                this.readTextFile('src/assets/dbstyle/mindmap_images/TQM.json', selectedItem);
                MindMapUtilityMethods.templateType = 'template2';
            }
            else if (target.id === 'mindmap_child3') {
                mindMapObject.createMindMap(false);
                this.readTextFile('src/assets/dbstyle/mindmap_images/SoftwareDevelopmentLifeCycle.json', selectedItem);
                MindMapUtilityMethods.templateType = 'template1';
            }
            this.hideMenuItems();
            diagramContainer.classList.add('custom-diagram');
        }
        else if (target.id.startsWith('orgchart')) {
            selectedItem.diagramType = 'OrgChart';
            OrgChartUtilityMethods.selectedItem = selectedItem;
            var orgChartObject = new OrgChartData(selectedItem);
            if (target.id === 'orgchart_child0') {
                orgChartObject.createOrgChart(true);
            }
            else {
                OrgChartUtilityMethods.subTreeOrientation = 'Horizontal';
                OrgChartUtilityMethods.subTreeAlignments = 'Center';
                if (target.id === 'orgchart_child1') {
                    orgChartObject.createOrgChart(false);
                    this.readTextFile('src/assets/dbstyle/orgchart_images/OrgTemplateStyle1.json', selectedItem);
                }
                else if (target.id === 'orgchart_child2') {
                    orgChartObject.createOrgChart(false);
                    this.readTextFile('src/assets/dbstyle/orgchart_images/OrgTemplateStyle2.json', selectedItem);
                }
                else if (target.id === 'orgchart_child3') {
                    orgChartObject.createOrgChart(false);
                    this.readTextFile('src/assets/dbstyle/orgchart_images/OrgTemplateStyle3.json', selectedItem);
                }
            }
            this.hideMenuItems();
            diagramContainer.classList.add('custom-diagram');
        }
        else if (target.id.startsWith('flowchart')) {
            if (target.id === 'flowchart_child0') {
                selectedItem.selectedDiagram.clear();
            }
            else if (target.id === 'flowchart_child1') {
                this.readTextFile('src/assets/dbstyle/flowchart_Images/CreditCardFlow.json', selectedItem);
            }
            else if (target.id === 'flowchart_child2') {
                this.readTextFile('src/assets/dbstyle/flowchart_Images/BankingTellerProcess.json', selectedItem);
            }
            else if (target.id === 'flowchart_child3') {
                this.readTextFile('src/assets/dbstyle/flowchart_Images/Developer_Workflow.json', selectedItem);
            }
            selectedItem.diagramType = 'GeneralDiagram';
            diagramContainer.classList.add('general-diagram');
        }
        else {
            selectedItem.selectedDiagram.clear();
            selectedItem.diagramType = 'GeneralDiagram';
            diagramContainer.classList.add('general-diagram');
        }
        var diagramName = target.parentElement.children[1].children[0].innerHTML;
        if (diagramName !== 'Blank Diagram') {
            document.getElementById('diagramName').innerHTML = diagramName;
        }
        this.tempDialog.hide();
    };
    UtilityMethods.prototype.hideMenuItems = function () {
        var btnWindow = document.getElementById('btnWindowMenu');
        btnWindow.ej2_instances[0].items[1].iconCss = '';
        var btnView = document.getElementById('btnViewMenu');
        btnView.ej2_instances[0].items[7].iconCss = '';
    };
    UtilityMethods.prototype.currentDiagramVisibility = function (diagramname, selectedItem) {
        if (diagramname === 'mindmap-diagram' || diagramname === 'orgchart-diagram') {
            selectedItem.utilityMethods.hideElements('hide-palette', null, diagramname);
            var diagramContainer = document.getElementsByClassName('db-current-diagram-container')[0];
            diagramContainer.classList.add(diagramname);
            var propertyContainer = document.getElementsByClassName('db-property-editor-container')[0];
            if (diagramname === 'mindmap-diagram') {
                propertyContainer.classList.remove('orgchart-diagram');
            }
            else {
                propertyContainer.classList.remove('mindmap-diagram');
            }
            propertyContainer.classList.add(diagramname);
        }
    };
    UtilityMethods.prototype.showDiagramTemplates = function (selectedItem, evt) {
        var target = evt.target;
        if (target.tagName.toLowerCase() === 'span') {
            target = target.parentElement;
        }
        switch (target.children[0].innerHTML.trim()) {
            case 'Flow Chart':
                this.getDefaultDiagramTemplates1(selectedItem, 4, 'red', 'Flow Chart');
                break;
            case 'Mind Map':
                this.getDefaultDiagramTemplates1(selectedItem, 4, 'blue', 'Mind Map');
                break;
            case 'Org Chart':
                this.getDefaultDiagramTemplates1(selectedItem, 4, 'orange', 'Org Chart');
                break;
            case 'BPMN':
                this.getDefaultDiagramTemplates1(selectedItem, 4, 'brown', 'BPMN');
                break;
        }
    };
    UtilityMethods.prototype.enableToolbarItems = function (selectedItems) {
        var toolbarContainer = document.getElementsByClassName('db-toolbar-container')[0];
        var toolbarClassName = 'db-toolbar-container';
        if (toolbarContainer.classList.contains('db-undo')) {
            toolbarClassName += ' db-undo';
        }
        if (toolbarContainer.classList.contains('db-redo')) {
            toolbarClassName += ' db-redo';
        }
        toolbarContainer.className = toolbarClassName;
        if (selectedItems.length === 1) {
            toolbarContainer.className = toolbarContainer.className + ' db-select';
            if (selectedItems[0] instanceof ej.diagrams.Node) {
                if (selectedItems[0].children) {
                    if (selectedItems[0].children.length > 2) {
                        toolbarContainer.className = toolbarContainer.className + ' db-select db-double db-multiple db-node db-group';
                    }
                    else {
                        toolbarContainer.className = toolbarContainer.className + ' db-select db-double db-node db-group';
                    }
                }
                else {
                    toolbarContainer.className = toolbarContainer.className + ' db-select db-node';
                }
            }
        }
        else if (selectedItems.length === 2) {
            toolbarContainer.className = toolbarContainer.className + ' db-select db-double';
        }
        else if (selectedItems.length > 2) {
            toolbarContainer.className = toolbarContainer.className + ' db-select db-double db-multiple';
        }
        if (selectedItems.length > 1) {
            var isNodeExist = false;
            for (var i = 0; i < selectedItems.length; i++) {
                if (selectedItems[i] instanceof ej.diagrams.Node) {
                    toolbarContainer.className = toolbarContainer.className + ' db-select db-node';
                    break;
                }
            }
        }
    };
    UtilityMethods.prototype.enableMenuItems = function (itemText, selectedItem) {
        var selectedDiagram = diagram.ej2_instances ? diagram.ej2_instances[0] : selectedItem.selectedDiagram;
        var selectedItems = selectedDiagram.selectedItems.nodes;
        selectedItems = selectedItems.concat(selectedDiagram.selectedItems.connectors);
        if (itemText) {
            var commandType = itemText.replace(/[' ']/g, '');
            if (selectedItems.length === 0 || selectedItem.diagramType !== 'GeneralDiagram') {
                switch (commandType.toLowerCase()) {
                    case 'edittooltip':
                        var disable = false;
                        if (!(selectedItems.length === 1)) {
                            disable = true;
                        }
                        return disable;
                    case 'cut':
                        return true;
                    case 'copy':
                        return true;
                    case 'delete':
                        return true;
                    case 'duplicate':
                        return true;
                }
            }
            if (selectedItems.length > 1) {
                switch (commandType.toLowerCase()) {
                    case 'edittooltip':
                        return true;
                }
            }
            if (selectedItem.pasteData.length === 0 && itemText === 'Paste') {
                return true;
            }
            if (itemText === 'Undo' && selectedItem.selectedDiagram.historyManager.undoStack.length === 0) {
                return true;
            }
            if (itemText === 'Redo' && selectedItem.selectedDiagram.historyManager.redoStack.length === 0) {
                return true;
            }
            if (itemText === 'Select All') {
                if (selectedItem.diagramType !== 'GeneralDiagram' || (selectedItem.selectedDiagram.nodes.length === 0 && selectedItem.selectedDiagram.connectors.length === 0)) {
                    return true;
                }
            }
            if (selectedItem.diagramType !== 'GeneralDiagram') {
                if (itemText === 'Themes' || itemText === 'Paste' || itemText === 'Show Rulers' || itemText === 'Show Guides'
                    || itemText === 'Show Grid' || itemText === 'Snap To Grid' || itemText === 'Show Stencil') {
                    return true;
                }
            }
        }
        return false;
    };
    UtilityMethods.prototype.enableArrangeMenuItems = function (selectedItem) {
        var contextInstance = document.getElementById('arrangeContextMenu');
        var contextMenu = contextInstance.ej2_instances[0];
        var selectedItems = selectedItem.selectedDiagram.selectedItems.nodes;
        selectedItems = selectedItems.concat(selectedItem.selectedDiagram.selectedItems.connectors);
        for (var i = 0; i < contextMenu.items.length; i++) {
            contextMenu.enableItems([contextMenu.items[i].text], false);
        }
        if (selectedItem.diagramType === 'GeneralDiagram') {
            if (selectedItems.length > 1) {
                contextMenu.enableItems(['Align Objects', 'Distribute Objects', 'Match Size', 'Lock', 'Unlock', 'Group'], true);
            }
            else if (selectedItems.length === 1) {
                contextMenu.enableItems(['Send To Back', 'Bring To Front', 'Send Backward', 'Bring Forward']);
                var object = selectedItems[0];
                if (object instanceof ej.diagrams.Node) {
                    if (object.children && object.children.length > 0) {
                        contextMenu.enableItems(['Ungroup']);
                    }
                    if (object.constraints & ej.diagrams.NodeConstraints.Drag) {
                        contextMenu.enableItems(['Lock'], true);
                    }
                    else {
                        contextMenu.enableItems(['Unlock'], true);
                    }
                }
            }
        }
    };
    UtilityMethods.prototype.getPaperSize = function (paperName) {
        var paperSize = new PaperSize();
        switch (paperName) {
            case 'Letter':
                paperSize.pageWidth = 816;
                paperSize.pageHeight = 1056;
                break;
            case 'Legal':
                paperSize.pageWidth = 816;
                paperSize.pageHeight = 1344;
                break;
            case 'Tabloid':
                paperSize.pageWidth = 1056;
                paperSize.pageHeight = 1632;
                break;
            case 'A3':
                paperSize.pageWidth = 1122;
                paperSize.pageHeight = 1587;
                break;
            case 'A4':
                paperSize.pageWidth = 793;
                paperSize.pageHeight = 1122;
                break;
            case 'A5':
                paperSize.pageWidth = 559;
                paperSize.pageHeight = 793;
                break;
            case 'A6':
                paperSize.pageWidth = 396;
                paperSize.pageHeight = 559;
                break;
        }
        return paperSize;
    };
    UtilityMethods.prototype.removeChild = function (selectedItem) {
        var diagram = selectedItem.selectedDiagram;
        if (diagram.selectedItems.nodes.length > 0) {
            selectedItem.preventPropertyChange = true;
            diagram.historyManager.startGroupAction();
            this.removeSubChild(diagram.selectedItems.nodes[0], selectedItem);
            diagram.historyManager.endGroupAction();
            diagram.doLayout();
            selectedItem.preventPropertyChange = false;
        }
        selectedItem.isModified = true;
    };
    UtilityMethods.prototype.removeSubChild = function (node, selectedItem) {
        var diagram = selectedItem.selectedDiagram;
        for (var i = node.outEdges.length - 1; i >= 0; i--) {
            var connector = MindMapUtilityMethods.getConnector(diagram.connectors, node.outEdges[i]);
            var childNode = MindMapUtilityMethods.getNode(diagram.nodes, connector.targetID);
            if (childNode != null && childNode.outEdges.length > 0) {
                this.removeSubChild(childNode, selectedItem);
            }
            else {
                diagram.remove(childNode);
            }
        }
        for (var j = node.inEdges.length - 1; j >= 0; j--) {
            var connector = MindMapUtilityMethods.getConnector(diagram.connectors, node.inEdges[j]);
            var childNode = MindMapUtilityMethods.getNode(diagram.nodes, connector.sourceID);
            var index = childNode.outEdges.indexOf(connector.id);
            if (childNode.outEdges.length > 1 && index === 0) {
                index = childNode.outEdges.length;
            }
            if (index > 0) {
                var node1 = childNode.outEdges[index - 1];
                var connector1 = diagram.getObject(node1);
                var node2 = MindMapUtilityMethods.getNode(diagram.nodes, connector1.targetID);
                diagram.select([node2]);
            }
            else {
                diagram.select([childNode]);
            }
        }
        diagram.remove(node);
    };
    UtilityMethods.prototype.cutLayout = function (selectedItem) {
        var diagram = selectedItem.selectedDiagram;
        if (diagram.selectedItems.nodes.length) {
            selectedItem.utilityMethods.copyLayout(selectedItem);
            selectedItem.utilityMethods.removeChild(selectedItem);
            diagram.doLayout();
            selectedItem.isModified = true;
        }
    };
    UtilityMethods.prototype.copyLayout = function (selectedItem) {
        var diagram = selectedItem.selectedDiagram;
        var selectedNode = diagram.selectedItems.nodes[0];
        if (selectedNode.id !== 'rootNode') {
            selectedItem.pasteData = CommonKeyboardCommands.cloneSelectedItemswithChildElements();
        }
    };
    UtilityMethods.prototype.pasteLayout = function (selectedItem) {
        selectedItem.isCopyLayoutElement = true;
        if (selectedItem.diagramType === 'MindMap') {
            MindMapUtilityMethods.mindmapPaste();
        }
        else if (selectedItem.diagramType === 'OrgChart') {
            OrgChartUtilityMethods.orgchartPaste();
        }
        selectedItem.isCopyLayoutElement = false;
        selectedItem.isModified = true;
    };
    UtilityMethods.prototype.undoRedoLayout = function (isundo, selectedItem) {
        var diagram = selectedItem.selectedDiagram;
        if (isundo) {
            diagram.undo();
        }
        else {
            diagram.redo();
        }
        if (diagram.selectedItems.nodes.length === 0) {
            this.updateSectionforNode(selectedItem);
        }
        diagram.doLayout();
        selectedItem.isModified = true;
    };
    UtilityMethods.prototype.updateSectionforNode = function (selectedItem) {
        var diagram = selectedItem.selectedDiagram;
        for (var i = 0; i < diagram.nodes.length; i++) {
            var newselection = diagram.nodes[i];
            if (newselection.id === 'rootNode') {
                selectedItem.preventPropertyChange = true;
                diagram.select([newselection]);
                selectedItem.preventPropertyChange = false;
            }
        }
    };
    UtilityMethods.prototype.updateLayout = function (selectedItem, bindBindingFields, imageField) {
        for (var i = 0; i < selectedItem.selectedDiagram.nodes.length; i++) {
            var node = selectedItem.selectedDiagram.nodes[i];
            if (node.id !== 'textNode') {
                var nodeInfo = node.addInfo;
                var keys = Object.keys(nodeInfo);
                var bindingFields = [];
                var additionalFields = [];
                var propName = 'Name';
                if (nodeInfo[propName] && nodeInfo[propName].checked) {
                    bindingFields.push(propName);
                }
                for (var i_1 = 0; i_1 < keys.length; i_1++) {
                    var keyValue = nodeInfo[keys[i_1]];
                    if (keyValue.type === 'bindingField') {
                        if (keyValue.checked) {
                            if (bindBindingFields) {
                                bindingFields.push(keys[i_1]);
                            }
                        }
                        else {
                            additionalFields.push(keys[i_1]);
                        }
                    }
                }
                selectedItem.selectedDiagram.removeLabels(node, node.annotations);
                propName = 'Image URL';
                if (!imageField) {
                    node.minWidth = 150;
                    node.minHeight = 50;
                    node.maxHeight = 50;
                    selectedItem.selectedDiagram.dataBind();
                    node.shape = { type: 'Basic', shape: 'Rectangle', cornerRadius: 5 };
                    selectedItem.selectedDiagram.dataBind();
                }
                else if (imageField) {
                    node.minWidth = 300;
                    node.minHeight = 100;
                    node.maxHeight = 100;
                    selectedItem.selectedDiagram.dataBind();
                    node.shape = {
                        type: 'Image', source: nodeInfo[propName] && nodeInfo[propName].value ? nodeInfo[propName].value.toString() : 'src/assets/dbstyle/orgchart_images/blank-male.jpg',
                        align: 'XMinYMin', scale: 'Meet'
                    };
                    selectedItem.selectedDiagram.dataBind();
                }
                var annotations = [];
                var startY = 0.5 - ((bindingFields.length - 1) / 10);
                for (var i_2 = 0; i_2 < bindingFields.length; i_2++) {
                    var annotation1 = {
                        content: nodeInfo[bindingFields[i_2]].value.toString(), offset: { x: 0.5, y: startY }
                    };
                    if (node.shape && node.shape.type === 'Image') {
                        annotation1.offset.x = 0;
                        annotation1.margin = { left: 110 };
                        annotation1.horizontalAlignment = 'Left';
                    }
                    if (i_2 === 0) {
                        annotation1.style = { fontSize: 14, bold: true };
                    }
                    startY += 0.2;
                    annotations.push(annotation1);
                }
                if (annotations.length > 0) {
                    selectedItem.selectedDiagram.addLabels(node, annotations);
                }
                var content = '';
                if (additionalFields.length > 0) {
                    for (var i_3 = 0; i_3 < additionalFields.length; i_3++) {
                        if (nodeInfo[additionalFields[i_3]].value) {
                            content = content + additionalFields[i_3] + ':' + nodeInfo[additionalFields[i_3]].value + '\n';
                        }
                    }
                }
                if (content) {
                    node.tooltip = { content: content, position: 'BottomCenter', relativeMode: 'Object' };
                    node.constraints = ej.diagrams.NodeConstraints.Default | ej.diagrams.NodeConstraints.Tooltip;
                }
                else {
                    node.constraints = ej.diagrams.NodeConstraints.Default & ~ej.diagrams.NodeConstraints.Tooltip;
                }
            }
        }
        selectedItem.selectedDiagram.dataBind();
        selectedItem.selectedDiagram.doLayout();
        selectedItem.isModified = true;
    };
    return UtilityMethods;
}());