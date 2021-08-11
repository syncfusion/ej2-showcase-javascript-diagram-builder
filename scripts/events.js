var DiagramClientSideEvents = (function () {
    function DiagramClientSideEvents(selectedItem, page) {
        this.selectedItem = selectedItem;
        this.page = page;
    }
    DiagramClientSideEvents.prototype.selectionChange = function (args) {
        var diagram = selectedItem.selectedDiagram;
        if (selectedItem.preventSelectionChange || selectedItem.isLoading) {
            return;
        }
        if (args.state === 'Changed') {
            if (selectedItem.diagramType === 'MindMap') {
                if (args.newValue.length === 1 && diagram.selectedItems.nodes.length === 1) {
                    var node = args.newValue[0];
                    diagram.selectedItems.userHandles[0].visible = false;
                    diagram.selectedItems.userHandles[1].visible = false;
                    diagram.selectedItems.userHandles[2].visible = false;
                    if (node.id !== 'textNode' && !(node instanceof ej.diagrams.Connector)) {
                        var addInfo = node.addInfo;
                        if (node.id === 'rootNode') {
                            diagram.selectedItems.userHandles[0].visible = true;
                            diagram.selectedItems.userHandles[1].visible = true;
                        }
                        else if (addInfo.orientation.toString() === 'Left') {
                            diagram.selectedItems.userHandles[0].visible = true;
                            diagram.selectedItems.userHandles[2].visible = true;
                            diagram.selectedItems.userHandles[2].side = 'Left';
                        }
                        else {
                            diagram.selectedItems.userHandles[1].visible = true;
                            diagram.selectedItems.userHandles[2].visible = true;
                            diagram.selectedItems.userHandles[2].side = 'Right';
                        }
                        selectedItem.utilityMethods.bindMindMapProperties(node, selectedItem);
                    }
                    if (node.addInfo && node.addInfo.level !== undefined) {
                        selectedItem.mindmapSettings.levelType.value = 'Level' + node.addInfo.level;
                    }
                }
            }
            else if (selectedItem.diagramType === 'OrgChart') {
                if (args.newValue.length === 1) {
                    var node = args.newValue[0];
                    diagram.selectedItems.userHandles[0].visible = false;
                    diagram.selectedItems.userHandles[1].visible = false;
                    diagram.selectedItems.userHandles[2].visible = false;
                    if (node.id !== 'textNode' && node instanceof ej.diagrams.Node) {
                        diagram.selectedItems.userHandles[0].visible = true;
                        diagram.selectedItems.userHandles[1].visible = true;
                        diagram.selectedItems.userHandles[2].visible = true;
                    }
                }
            }
            else {
                var selectedItems = selectedItem.selectedDiagram.selectedItems.nodes;
                selectedItems = selectedItems.concat(selectedItem.selectedDiagram.selectedItems.connectors);
                selectedItem.utilityMethods.enableToolbarItems(selectedItems);
                var nodeContainer = document.getElementById('nodePropertyContainer');
                nodeContainer.classList.remove('multiple');
                nodeContainer.classList.remove('connector');
                if (selectedItems.length > 1) {
                    this.multipleSelectionSettings(selectedItems);
                }
                else if (selectedItems.length === 1) {
                    this.singleSelectionSettings(selectedItems[0]);
                }
                else {
                    selectedItem.utilityMethods.objectTypeChange('diagram');
                }
            }
        }
    };

    DiagramClientSideEvents.prototype.multipleSelectionSettings = function (selectedItems) {
        selectedItem.utilityMethods.objectTypeChange('None');
        var showConnectorPanel = false, showNodePanel = false;
        var showTextPanel = false, showConTextPanel = false;
        var nodeContainer = document.getElementById('nodePropertyContainer');
        for (var i = 0; i < selectedItems.length; i++) {
            var object = selectedItems[i];
            if (object instanceof ej.diagrams.Node && (!showNodePanel || !showTextPanel)) {
                showNodePanel = true;
                showTextPanel = object.annotations.length > 0 && object.annotations[0].content ? true : false;
            }
            else if (object instanceof ej.diagrams.Connector && (!showConnectorPanel || !showConTextPanel)) {
                showConnectorPanel = true;
                showConTextPanel = object.annotations.length > 0 && object.annotations[0].content ? true : false;
            }
        }
        var selectItem1 = selectedItem.selectedDiagram.selectedItems;
        if (showNodePanel) {
            nodeContainer.style.display = '';
            nodeContainer.classList.add('multiple');
            if (showConnectorPanel) {
                nodeContainer.classList.add('connector');
            }
            selectedItem.utilityMethods.bindNodeProperties(selectItem1.nodes[0], selectedItem);
        }
        if (showConnectorPanel && !showNodePanel) {
            document.getElementById('connectorPropertyContainer').style.display = '';
            selectedItem.utilityMethods.bindConnectorProperties(selectItem1.connectors[0], selectedItem);
        }
        if (showTextPanel || showConTextPanel) {
            document.getElementById('textPropertyContainer').style.display = '';
            if (showTextPanel && showConTextPanel) {
                document.getElementById('textPositionDiv').style.display = 'none';
                document.getElementById('textColorDiv').className = 'col-xs-6 db-col-left';
            }
            else {
                document.getElementById('textPositionDiv').style.display = '';
                document.getElementById('textColorDiv').className = 'col-xs-6 db-col-right';
                if (showConTextPanel) {
                    diagramEvents.ddlTextPosition.dataSource = selectedItem.textProperties.getConnectorTextPositions();
                    //selectedItem.utilityMethods.bindTextProperties(selectItem1.connectors[0].annotations[0].style, selectedItem);
                }
                else {
                    diagramEvents.ddlTextPosition.dataSource = selectedItem.textProperties.getNodeTextPositions();
                    //selectedItem.utilityMethods.bindTextProperties(selectItem1.connectors[0].annotations[0].style, selectedItem);
                }
                diagramEvents.ddlTextPosition.dataBind();
            }
        }
    };
    DiagramClientSideEvents.prototype.singleSelectionSettings = function (selectedObject) {
        var object = null;
        if (selectedObject instanceof ej.diagrams.Node) {
            selectedItem.utilityMethods.objectTypeChange('node');
            object = selectedObject;
            selectedItem.utilityMethods.bindNodeProperties(object, selectedItem);
        }
        else if (selectedObject instanceof  ej.diagrams.Connector) {
            selectedItem.utilityMethods.objectTypeChange('connector');
            object = selectedObject;
            selectedItem.utilityMethods.bindConnectorProperties(object, selectedItem);
        }
        if (object.shape && object.shape.type === 'Text') {
            document.getElementById('textPropertyContainer').style.display = '';
            document.getElementById('toolbarTextAlignmentDiv').style.display = 'none';
            document.getElementById('textPositionDiv').style.display = 'none';
            document.getElementById('textColorDiv').className = 'col-xs-6 db-col-left';
            selectedItem.utilityMethods.bindTextProperties(object.style, selectedItem);
        }
        else if (object.annotations.length > 0 && object.annotations[0].content) {
            document.getElementById('textPropertyContainer').style.display = '';
            var annotation = null;
            document.getElementById('toolbarTextAlignmentDiv').style.display = '';
            document.getElementById('textPositionDiv').style.display = '';
            document.getElementById('textColorDiv').className = 'col-xs-6 db-col-right';
            selectedItem.utilityMethods.bindTextProperties(object.annotations[0].style, selectedItem);
            selectedItem.utilityMethods.updateHorVertAlign(object.annotations[0].horizontalAlignment, object.annotations[0].verticalAlignment);
            if (object.annotations[0] instanceof ej.diagrams.ShapeAnnotation) {
                annotation = object.annotations[0];
                diagramEvents.ddlTextPosition.dataSource = selectedItem.textProperties.getNodeTextPositions();
                diagramEvents.ddlTextPosition.value = selectedItem.textProperties.textPosition = null;
                diagramEvents.ddlTextPosition.dataBind();
                diagramEvents.ddlTextPosition.value = selectedItem.textProperties.textPosition = selectedItem.utilityMethods.getPosition(annotation.offset);
                diagramEvents.ddlTextPosition.dataBind();
            }
            else if (object.annotations[0] instanceof ej.diagrams.PathAnnotation) {
                annotation = object.annotations[0];
                diagramEvents.ddlTextPosition.dataSource = selectedItem.textProperties.getConnectorTextPositions();
                diagramEvents.ddlTextPosition.value = selectedItem.textProperties.textPosition = null;
                diagramEvents.ddlTextPosition.dataBind();
                diagramEvents.ddlTextPosition.value = selectedItem.textProperties.textPosition = annotation.alignment;
                diagramEvents.ddlTextPosition.dataBind();
            }
        }
    };
    DiagramClientSideEvents.prototype.nodePositionChange = function (args) {
        selectedItem.preventPropertyChange = true;
        selectedItem.nodeProperties.offsetX.value = (Math.round(args.newValue.offsetX * 100) / 100);
        selectedItem.nodeProperties.offsetY.value = (Math.round(args.newValue.offsetY * 100) / 100);
        if (args.state === 'Completed') {
            selectedItem.isModified = true;
            selectedItem.preventPropertyChange = false;
        }
    };
    DiagramClientSideEvents.prototype.nodeSizeChange = function (args) {
        selectedItem.preventPropertyChange = true;
        selectedItem.nodeProperties.width.value = (Math.round(args.newValue.width * 100) / 100);
        selectedItem.nodeProperties.height.value = (Math.round(args.newValue.height * 100) / 100);
        if (args.state === 'Completed') {
            selectedItem.isModified = true;
            selectedItem.preventPropertyChange = false;
        }
    };
    DiagramClientSideEvents.prototype.textEdit = function (args) {
        if (selectedItem.diagramType === 'MindMap') {
            setTimeout(function () { selectedItem.selectedDiagram.doLayout(); }, 10);
        }
        selectedItem.isModified = true;
    };

    DiagramClientSideEvents.prototype.scrollChange = function (args) {
        selectedItem.scrollSettings.currentZoom = (args.newValue.CurrentZoom * 100).toFixed() + '%';
    };
    DiagramClientSideEvents.prototype.nodeRotationChange = function (args) {
        selectedItem.preventPropertyChange = true;
        selectedItem.nodeProperties.rotateAngle.value = (Math.round(args.newValue.rotateAngle * 100) / 100);
        selectedItem.preventPropertyChange = false;
        if (args.state === 'Completed') {
            selectedItem.isModified = true;
        }
    };
    DiagramClientSideEvents.prototype.diagramContextMenuClick = function (args) {
        var diagram = selectedItem.selectedDiagram;
        selectedItem.customContextMenu.updateBpmnShape(diagram, args.item);
        var text = args.item.text;
        if (text === 'Group' || text === 'Un Group' || text === 'Undo' || text === 'Redo' || text === 'Select All') {
            selectedItem.isModified = true;
            if (selectedItem.diagramType === 'MindMap' || selectedItem.diagramType === 'OrgChart') {
                if (text === 'Undo' || text === 'Redo') {
                    args.cancel = true;
                    if (text === 'Undo') {
                        selectedItem.utilityMethods.undoRedoLayout(true, selectedItem);
                    }
                    else if (text === 'Redo') {
                        selectedItem.utilityMethods.undoRedoLayout(false, selectedItem);
                    }
                }
            }
        }
        if (selectedItem.diagramType === 'MindMap' || selectedItem.diagramType === 'OrgChart') {
            if (text === 'Copy') {
                selectedItem.utilityMethods.copyLayout(selectedItem);
            }
            else if (text === 'Cut') {
                args.cancel = true;
                selectedItem.utilityMethods.cutLayout(selectedItem);
            }
            else if (text === 'Paste') {
                args.cancel = true;
                selectedItem.utilityMethods.pasteLayout(selectedItem);
            }
        }
    };
    DiagramClientSideEvents.prototype.diagramContextMenuOpen = function (args) {
        var diagram = selectedItem.selectedDiagram;
        args.hiddenItems = args.hiddenItems.concat(selectedItem.customContextMenu.getHiddenMenuItems(diagram));
    };
    DiagramClientSideEvents.prototype.dragEnter = function (args) {
        var obj = args.element;
        var ratio = 100 / obj.width;
        obj.width = 100;
        obj.height *= ratio;
    };
    DiagramClientSideEvents.prototype.historyChange = function (args) {
        var diagram = selectedItem.selectedDiagram;
        var toolbarContainer = document.getElementsByClassName('db-toolbar-container')[0];
        toolbarContainer.classList.remove('db-undo');
        toolbarContainer.classList.remove('db-redo');
        if (diagram.historyManager.undoStack.length > 0) {
            toolbarContainer.classList.add('db-undo');
        }
        if (diagram.historyManager.redoStack.length > 0) {
            toolbarContainer.classList.add('db-redo');
        }
    };
    return DiagramClientSideEvents;
}());

var DiagramPropertyBinding = (function () {
    function DiagramPropertyBinding(selectedItem, page) {
        this.selectedItem = selectedItem;
        this.page = page;
    }
    DiagramPropertyBinding.prototype.pageBreaksChange = function (args) {
        if (args.event) {
            selectedItem.pageSettings.pageBreaks = args.checked;
            selectedItem.selectedDiagram.pageSettings.showPageBreaks = args.checked;
        }
    }; 
    DiagramPropertyBinding.prototype.multiplePage = function (args) {
        if (args.event) {
            selectedItem.printSettings.multiplePage = args.checked; 
        }
    };
    DiagramPropertyBinding.prototype.paperListChange = function (args) {
        if (args.element) {
            var diagram = selectedItem.selectedDiagram;
            document.getElementById('pageDimension').style.display = 'none';
            document.getElementById('pageOrientation').style.display = '';
            selectedItem.pageSettings.paperSize = args.value;
            var paperSize = selectedItem.utilityMethods.getPaperSize(selectedItem.pageSettings.paperSize);
            var pageWidth = paperSize.pageWidth;
            var pageHeight = paperSize.pageHeight;
            if (pageWidth && pageHeight) {
                if (selectedItem.pageSettings.isPortrait) {
                    if (pageWidth > pageHeight) {
                        var temp = pageWidth;
                        pageWidth = pageHeight;
                        pageHeight = temp;
                    }
                }
                else {
                    if (pageHeight > pageWidth) {
                        var temp = pageHeight;
                        pageHeight = pageWidth;
                        pageWidth = temp;
                    }
                }
                diagram.pageSettings.width = pageWidth;
                diagram.pageSettings.height = pageHeight;
                selectedItem.pageSettings.pageWidth = pageWidth;
                selectedItem.pageSettings.pageHeight = pageHeight;
                diagram.dataBind();
            }
            else {
                document.getElementById('pageOrientation').style.display = 'none';
                document.getElementById('pageDimension').style.display = '';
            }
        }
    };
    DiagramPropertyBinding.prototype.pageDimensionChange = function (args) {
        if (args.event) {
            var pageWidth = Number(selectedItem.pageSettings.pageWidth);
            var pageHeight = Number(selectedItem.pageSettings.pageHeight);
            var target = args.event.target;
            if (target.tagName.toLowerCase() === 'span') {
                target = target.parentElement.children[0];
            }
            var diagram = selectedItem.selectedDiagram;
            if (target.id === 'pageWidth') {
                pageWidth = Number(target.value.replace(/,/g, ''));
            }
            else {
                pageHeight = Number(target.value.replace(/,/g, ''));
            }
            if (pageWidth && pageHeight) {
                if (pageWidth > pageHeight) {
                    selectedItem.pageSettings.isPortrait = false;
                    selectedItem.pageSettings.isLandscape = true;
                    diagram.pageSettings.orientation = 'Landscape';
                }
                else {
                    selectedItem.pageSettings.isPortrait = true;
                    selectedItem.pageSettings.isLandscape = false;
                    diagram.pageSettings.orientation = 'Portrait';
                }
                selectedItem.pageSettings.pageWidth = diagram.pageSettings.width = pageWidth;
                selectedItem.pageSettings.pageHeight = diagram.pageSettings.height = pageHeight;
                diagram.dataBind();
            }
        }
    };
    DiagramPropertyBinding.prototype.pageOrientationChange = function (args) {
        if (args.event) {
            var pageWidth = Number(selectedItem.pageSettings.pageWidth);
            var pageHeight = Number(selectedItem.pageSettings.pageHeight);
            var target = args.event.target;
            var diagram = selectedItem.selectedDiagram;
            switch (target.id) {
                case 'pagePortrait':
                    selectedItem.pageSettings.isPortrait = true;
                    selectedItem.pageSettings.isLandscape = false;
                    diagram.pageSettings.orientation = 'Portrait';
                    break;
                case 'pageLandscape':
                    selectedItem.pageSettings.isPortrait = false;
                    selectedItem.pageSettings.isLandscape = true;
                    diagram.pageSettings.orientation = 'Landscape';
                    break;
            }
            diagram.dataBind();
            selectedItem.pageSettings.pageWidth = diagram.pageSettings.width;
            selectedItem.pageSettings.pageHeight = diagram.pageSettings.height;
        }
    };
    DiagramPropertyBinding.prototype.pageBackgroundChange1 = function (args) {
        if (args.currentValue) {
            // let target: HTMLInputElement = args.target as HTMLInputElement;
            var diagram = selectedItem.selectedDiagram;
            diagram.pageSettings.background = {
                color: args.currentValue.rgba
            };
            diagram.dataBind();
        }
    };
    DiagramPropertyBinding.prototype.textPositionChange = function (args) {
        if (args.value !== null) {
            this.textPropertyChange('textPosition', args.value);
        }
    };
    DiagramPropertyBinding.prototype.toolbarTextStyleChange = function (args) {
        this.textPropertyChange(args.item.tooltipText, false);
    };
    DiagramPropertyBinding.prototype.toolbarTextSubAlignChange = function (args) {
        var propertyName = args.item.tooltipText.replace(/[' ']/g, '');
        this.textPropertyChange(propertyName, propertyName);
    };
    DiagramPropertyBinding.prototype.toolbarTextAlignChange = function (args) {
        var propertyName = args.item.tooltipText.replace('Align ', '');
        this.textPropertyChange(propertyName, propertyName);
    };
    DiagramPropertyBinding.prototype.textPropertyChange = function (propertyName, propertyValue) {
        if (!selectedItem.preventPropertyChange) {
            var diagram = selectedItem.selectedDiagram;
            var selectedObjects = diagram.selectedItems.nodes;
            selectedObjects = selectedObjects.concat(diagram.selectedItems.connectors);
            propertyName = propertyName.toLowerCase();
            if (selectedObjects.length > 0) {
                for (var i = 0; i < selectedObjects.length; i++) {
                    var node = selectedObjects[i];
                    if (node instanceof ej.diagrams.Node || node instanceof ej.diagrams.Connector) {
                        if (node.annotations.length > 0) {
                            for (var j = 0; j < node.annotations.length; j++) {
                                var annotation = null;
                                if (node.annotations[j] instanceof ej.diagrams.ShapeAnnotation) {
                                    annotation = node.annotations[j];
                                    if (propertyName === 'textposition') {
                                        selectedItem.textProperties.textPosition = propertyValue.toString();
                                        annotation.offset = selectedItem.utilityMethods.getOffset(propertyValue);
                                    }
                                }
                                else if (node.annotations[j] instanceof ej.diagrams.PathAnnotation) {
                                    annotation = node.annotations[j];
                                    if (propertyName === 'textposition') {
                                        selectedItem.textProperties.textPosition = propertyValue.toString();
                                        annotation.alignment = selectedItem.textProperties.textPosition;
                                    }
                                }
                                if (propertyName === 'left' || propertyName === 'right' || propertyName === 'center') {
                                    annotation.horizontalAlignment = propertyValue;
                                    selectedItem.utilityMethods.updateHorVertAlign(annotation.horizontalAlignment, annotation.verticalAlignment);
                                }
                                else if (propertyName === 'top' || propertyName === 'bottom') {
                                    annotation.verticalAlignment = propertyValue;
                                    selectedItem.utilityMethods.updateHorVertAlign(annotation.horizontalAlignment, annotation.verticalAlignment);
                                }
                                else if (propertyName === 'middle') {
                                    annotation.verticalAlignment = 'Center';
                                    selectedItem.utilityMethods.updateHorVertAlign(annotation.horizontalAlignment, annotation.verticalAlignment);
                                }
                                else {
                                    this.updateTextProperties(propertyName, propertyValue, annotation.style);
                                }
                            }
                        }
                        else if (node.shape && node.shape.type === 'Text') {
                            this.updateTextProperties(propertyName, propertyValue, node.style);
                        }
                    }
                }
                diagram.dataBind();
                selectedItem.isModified = true;
            }
        }
    };
    DiagramPropertyBinding.prototype.updateTextProperties = function (propertyName, propertyValue, annotation) {
        switch (propertyName) {
            case 'bold':
                annotation.bold = !annotation.bold;
                this.updateToolbarState('toolbarTextStyle', annotation.bold, 0);
                break;
            case 'italic':
                annotation.italic = !annotation.italic;
                this.updateToolbarState('toolbarTextStyle', annotation.italic, 1);
                break;
            case 'underline':
                selectedItem.textProperties.textDecoration = !selectedItem.textProperties.textDecoration;
                annotation.textDecoration = annotation.textDecoration === 'None' || !annotation.textDecoration ? 'Underline' : 'None';
                this.updateToolbarState('toolbarTextStyle', selectedItem.textProperties.textDecoration, 2);
                break;
            case 'aligntextleft':
            case 'aligntextright':
            case 'aligntextcenter':
                annotation.textAlign = propertyValue.toString().replace('AlignText', '');
                selectedItem.utilityMethods.updateTextAlign(annotation.textAlign);
                break;
        }
    };
    DiagramPropertyBinding.prototype.updateToolbarState = function (toolbarName, isSelected, index) {
        var toolbarTextStyle = document.getElementById(toolbarName);
        if (toolbarTextStyle) {
            toolbarTextStyle = toolbarTextStyle.ej2_instances[0];
        }
        if (toolbarTextStyle) {
            var cssClass = toolbarTextStyle.items[index].cssClass;
            toolbarTextStyle.items[index].cssClass = isSelected ? cssClass + ' tb-item-selected' : cssClass.replace(' tb-item-selected', '');
            toolbarTextStyle.dataBind();
        }
    };
    return DiagramPropertyBinding;
}());

var MindMapPropertyBinding = (function () {
    function MindMapPropertyBinding(selectedItem) {
        this.selectedItem = selectedItem;
    }
    MindMapPropertyBinding.prototype.mindmapTextStyleChange = function (args) {
        this.updateMindMapTextStyle(args.item.tooltipText.toLowerCase(), false);
    };
    MindMapPropertyBinding.prototype.updateMindMapTextStyle = function (propertyName, propertyValue) {
        var diagram = selectedItem.selectedDiagram;
        if (diagram.nodes.length > 0) {
            for (var i = 0; i < diagram.nodes.length; i++) {
                var node = diagram.nodes[i];
                if (node.addInfo && node.annotations.length > 0) {
                    var annotation = node.annotations[0].style;
                    var addInfo = node.addInfo;
                    var levelType = selectedItem.mindmapSettings.levelType.value;
                    if ('Level' + addInfo.level === levelType || addInfo.level === levelType) {
                        switch (propertyName) {
                            case 'bold':
                                annotation.bold = !annotation.bold;
                                break;
                            case 'italic':
                                annotation.italic = !annotation.italic;
                                break;
                            case 'underline':
                                annotation.textDecoration = annotation.textDecoration === 'None' || !annotation.textDecoration ? 'Underline' : 'None';
                                break;
                        }
                    }
                }
                diagram.dataBind();
                selectedItem.isModified = true;
            }
        }
    };
    MindMapPropertyBinding.prototype.mindmapPatternChange = function (args) {
        var target = args.target;
        var diagram = selectedItem.selectedDiagram;
        diagram.historyManager.startGroupAction();
        for (var i = 0; i < selectedItem.selectedDiagram.nodes.length; i++) {
            var node = selectedItem.selectedDiagram.nodes[i];
            if (node.id !== 'textNode') {
                if (target.className === 'mindmap-pattern-style mindmap-pattern1') {
                    if (node.id === 'rootNode') {
                        node.height = 50;
                    }
                    else {
                        node.height = 20;
                    }
                }
                else {
                    node.height = 50;
                }
            }
            selectedItem.selectedDiagram.dataBind();
        }
        for (var i = 0; i < selectedItem.selectedDiagram.connectors.length; i++) {
            var connector = selectedItem.selectedDiagram.connectors[i];
            switch (target.className) {
                case 'mindmap-pattern-style mindmap-pattern1':
                    connector.type = 'Bezier';
                    MindMapUtilityMethods.templateType = 'template1';
                    break;
                case 'mindmap-pattern-style mindmap-pattern2':
                    connector.type = 'Bezier';
                    MindMapUtilityMethods.templateType = 'template4';
                    break;
                case 'mindmap-pattern-style mindmap-pattern3':
                    connector.type = 'Orthogonal';
                    MindMapUtilityMethods.templateType = 'template2';
                    break;
                case 'mindmap-pattern-style mindmap-pattern4':
                    connector.type = 'Straight';
                    MindMapUtilityMethods.templateType = 'template3';
                    break;
            }
            selectedItem.selectedDiagram.dataBind();
        }
        diagram.historyManager.endGroupAction();
        selectedItem.selectedDiagram.doLayout();
        selectedItem.isModified = true;
    };
    return MindMapPropertyBinding;
}());

var OrgChartPropertyBinding = (function () {
    function OrgChartPropertyBinding(selectedItem) {
        this.selectedItem = selectedItem;
    }
    OrgChartPropertyBinding.prototype.orgDropDownChange = function (args) {
        if (args.element) {
            var value = args.value ? args.value.toString() : '';
            if (args.element.id === 'employeeId') {
                selectedItem.orgDataSettings.id = value;
            }
            else if (args.element.id === 'superVisorId') {
                selectedItem.orgDataSettings.parent = value;
            }
            else if (args.element.id === 'orgNameField') {
                selectedItem.orgDataSettings.nameField = value;
            }
            else if (args.element.id === 'orgImageField') {
                selectedItem.orgDataSettings.imageField = value;
            }
        }
    };
    OrgChartPropertyBinding.prototype.orgMultiSelectChange = function (args) {
        if (args.element) {
            if (args.element.id === 'orgAdditionalField') {
                selectedItem.orgDataSettings.additionalFields = args.value;
            }
            else if (args.element.id === 'orgBindingFields') {
                selectedItem.orgDataSettings.bindingFields = args.value;
            }
        }
    };
    OrgChartPropertyBinding.prototype.orgChartSpacingChange = function (args) {
        if (args.event) {
            var target = args.event.target;
            if (target.tagName.toLowerCase() === 'span') {
                target = target.parentElement.children[0];
            }
            if (target.id === 'orgHorizontalSpacing') {
                selectedItem.selectedDiagram.layout.horizontalSpacing = args.value;
            }
            else {
                selectedItem.selectedDiagram.layout.verticalSpacing = args.value;
            }
        }
    };
    OrgChartPropertyBinding.prototype.orgChartAligmentChange = function (args) {
        var diagram = selectedItem.selectedDiagram;
        var commandType = args.item.tooltipText.replace(/[' ']/g, '').toLowerCase();
        switch (commandType) {
            case 'alignleft':
                diagram.layout.horizontalAlignment = 'Left';
                break;
            case 'alignright':
                diagram.layout.horizontalAlignment = 'Right';
                break;
            case 'aligncenter':
                diagram.layout.horizontalAlignment = 'Center';
                break;
            case 'aligntop':
                diagram.layout.verticalAlignment = 'Top';
                break;
            case 'alignmiddle':
                diagram.layout.verticalAlignment = 'Center';
                break;
            case 'alignbottom':
                diagram.layout.verticalAlignment = 'Bottom';
                break;
        }
        selectedItem.isModified = true;
    };
    OrgChartPropertyBinding.prototype.layoutOrientationChange = function (args) {
        var target = args.target;
        switch (target.className) {
            case 'org-pattern-style org-pattern-1 vertical-alternate':
                OrgChartUtilityMethods.subTreeAlignments = 'Alternate';
                OrgChartUtilityMethods.subTreeOrientation = 'Vertical';
                break;
            case 'org-pattern-style org-pattern-2 vertical-left':
                OrgChartUtilityMethods.subTreeAlignments = 'Left';
                OrgChartUtilityMethods.subTreeOrientation = 'Vertical';
                break;
            case 'org-pattern-style org-pattern-3 vertical-right':
                OrgChartUtilityMethods.subTreeAlignments = 'Right';
                OrgChartUtilityMethods.subTreeOrientation = 'Vertical';
                break;
            case 'org-pattern-style org-pattern-4 horizontal-center':
                OrgChartUtilityMethods.subTreeAlignments = 'Center';
                OrgChartUtilityMethods.subTreeOrientation = 'Horizontal';
                break;
            case 'org-pattern-style org-pattern-5 horizontal-right':
                OrgChartUtilityMethods.subTreeAlignments = 'Right';
                OrgChartUtilityMethods.subTreeOrientation = 'Horizontal';
                break;
            case 'org-pattern-style org-pattern-6 horizontal-left':
                OrgChartUtilityMethods.subTreeAlignments = 'Left';
                OrgChartUtilityMethods.subTreeOrientation = 'Horizontal';
                break;
        }
        selectedItem.selectedDiagram.doLayout();
        selectedItem.isModified = true;
    };
    OrgChartPropertyBinding.prototype.layoutPatternChange = function (args) {
        var target = args.target;
        var bindingFields = target.id === 'orgPattern2' || target.id === 'orgPattern4' ? true : false;
        var imageField = target.id === 'orgPattern3' || target.id === 'orgPattern4' ? true : false;
        selectedItem.utilityMethods.updateLayout(selectedItem, bindingFields, imageField);
    };
    OrgChartPropertyBinding.prototype.getTooltipContent = function (args) {
        if (args.target) {
            if (args.target.classList.contains('db-employee-id')) {
                return 'Defines a unique column from the data source.';
            }
            else if (args.target.classList.contains('db-supervisor-id')) {
                return 'Defines a column that is used to identify the person to whom the employee reports to.';
            }
            else if (args.target.classList.contains('db-nameField-id')) {
                return 'Defines a column that has an employee name, and it appears at the top of the shapes.';
            }
            else if (args.target.classList.contains('db-bindingField-id')) {
                return 'Defines columns that have employees’ contact information, and appear after the employees’ names in the shape.';
            }
            else if (args.target.classList.contains('db-imageField-id')) {
                return 'Defines a column that has the picture of an employee.';
            }
            else if (args.target.classList.contains('db-additionalField-id')) {
                return 'Defines columns that should be displayed through a tooltip.';
            }
        }
        return '';
    };
    return OrgChartPropertyBinding;
}());