/**
 *  Custom Properties handler
 */
var CustomProperties = (function () {
    function CustomProperties(selectedItem, customPropertyDialog) {
        this.selectedItem = selectedItem;
        this.customPropertyDialog = customPropertyDialog;
    }
    CustomProperties.prototype.getPropertyDialogContent = function (addInfo) {
        var propertyDialogContent = document.createElement('div');
        if (addInfo) {
            var addInfo1 = addInfo;
            var keys = Object.keys(addInfo1);
            for (var i = 0; i < keys.length; i++) {
                propertyDialogContent.appendChild(this.clonePropInfoTemplate(keys[i], addInfo1[keys[i]]));
            }
            this.createSpaceElement(propertyDialogContent);
        }
        propertyDialogContent.appendChild(this.clonePropTemplate());
        this.customPropertyDialog.content = propertyDialogContent.outerHTML;
        this.customPropertyDialog.refresh();
        this.triggerEvents(addInfo);
    };
    CustomProperties.prototype.triggerEvents = function (addInfo) {
        var removeBtnElements = document.getElementsByClassName('propertyLabelDiv');
        var removeCheckBoxElements = document.getElementsByClassName('propertyTooltipDiv');
        var propertyValueElements = document.getElementsByClassName('propertyValueDiv');
        var addInfo1 = addInfo;
        var keys = Object.keys(addInfo1);
        for (var i = 0; i < keys.length; i++) {
            var removeBtnElement = removeBtnElements[i + 1].children[0];
            var removeButton = new ej.buttons.Button({ iconCss: 'sf-icon-Delete', cssClass: keys[i] });
            removeButton.appendTo(removeBtnElement);
            removeBtnElement.onclick = this.showConfirmationDialog.bind(this);
            var checkboxTooltipElement = removeCheckBoxElements[i + 1].children[0];
            var checkboxTooltip = new ej.buttons.CheckBox({ checked: Boolean(addInfo1[keys[i]].checked), cssClass: keys[i] });
            checkboxTooltip.change = this.removeField.bind(this);
            checkboxTooltip.appendTo(checkboxTooltipElement);
            propertyValueElements[i + 1].children[0].value = addInfo1[keys[i]].value.toString();
            propertyValueElements[i + 1].children[0].onchange = this.valueChange.bind(this);
        }
        var propButton = document.getElementsByClassName('db-custom-prop-button')[1];
        var button = new ej.buttons.Button();
        button.appendTo(propButton);
        propButton.onclick = this.addCustomProperty.bind(this);
    };
    CustomProperties.prototype.clonePropInfoTemplate = function (key, keyValue) {
        var propertyInfo = document.getElementsByClassName('db-custom-prop-info-template')[0].cloneNode(true);
        propertyInfo.style.display = '';
        var propertyName = key;
        if (keyValue.type === 'nameField') {
            propertyName = 'Name';
        }
        else if (keyValue.type === 'imageField') {
            propertyName = 'Image URL';
        }
        propertyInfo.getElementsByClassName('propertyNameDiv')[0].innerHTML = propertyName;
        var removeBtnElement = propertyInfo.getElementsByClassName('btnRemoveProperty')[0];
        if (keyValue.type !== 'bindingField') {
            removeBtnElement.style.display = 'None';
        }
        return propertyInfo;
    };
    CustomProperties.prototype.valueChange = function (args) {
        var target = args.target;
        var addInfo = this.selectedItem.selectedDiagram.selectedItems.nodes[0].addInfo;
        addInfo[target.parentElement.parentElement.children[0].innerHTML].value = target.value;
        var imageField = false;
        if (addInfo['Image URL'] && addInfo['Image URL'].checked) {
            imageField = true;
        }
        this.selectedItem.utilityMethods.updateLayout(this.selectedItem, true, imageField);
    };
    CustomProperties.prototype.removeField = function (args) {
        var target = args.event.target;
        var className = target.parentElement.parentElement.className.replace('e-checkbox-wrapper ', '').trim();
        for (var i = 0; i < this.selectedItem.selectedDiagram.nodes.length; i++) {
            var node = this.selectedItem.selectedDiagram.nodes[i];
            if (node.id !== 'textNode') {
                var nodeInfo = node.addInfo;
                nodeInfo[className].checked = args.checked;
            }
        }
        var imageField = false;
        var addInfo = this.selectedItem.selectedDiagram.selectedItems.nodes[0].addInfo;
        if (addInfo['Image URL'] && addInfo['Image URL'].checked) {
            imageField = true;
        }
        this.selectedItem.utilityMethods.updateLayout(this.selectedItem, true, imageField);
    };
    CustomProperties.prototype.showConfirmationDialog = function (args) {
        var target = args.target;
        if (target.tagName.toLowerCase() === 'span') {
            target = target.parentElement;
        }
        this.deleteField = target.className.replace('btnRemoveProperty e-control e-btn ', '').replace(' e-icon-btn', '').trim();
        var dialog = document.getElementById('deleteConfirmationDialog');
        dialog.ej2_instances[0].show();
    };
    CustomProperties.prototype.removeProperty = function (args) {
        for (var i = 0; i < this.selectedItem.selectedDiagram.nodes.length; i++) {
            var node = this.selectedItem.selectedDiagram.nodes[i];
            if (node.id !== 'textNode') {
                var nodeInfo = node.addInfo;
                delete nodeInfo[this.deleteField];
            }
        }
        var addInfo = this.selectedItem.selectedDiagram.selectedItems.nodes[0].addInfo;
        this.getPropertyDialogContent(addInfo);
        var imageField = false;
        if (addInfo['Image URL'] && addInfo['Image URL'].checked) {
            imageField = true;
        }
        this.selectedItem.utilityMethods.updateLayout(this.selectedItem, true, imageField);
        this.deleteField = '';
        var dialog = document.getElementById('deleteConfirmationDialog');
        dialog.ej2_instances[0].hide();
    };
    CustomProperties.prototype.createSpaceElement = function (element) {
        var spaceDiv = document.createElement('div');
        spaceDiv.style.height = '10px';
        element.appendChild(spaceDiv);
    };
    CustomProperties.prototype.clonePropTemplate = function () {
        var propertyInfo = document.getElementsByClassName('db-custom-prop-template')[0].cloneNode(true);
        propertyInfo.style.display = '';
        return propertyInfo;
    };
    CustomProperties.prototype.addCustomProperty = function () {
        var propName = document.getElementsByClassName('txtPropertyName')[1].value;
        if (propName) {
            for (var i = 0; i < this.selectedItem.selectedDiagram.nodes.length; i++) {
                var node = this.selectedItem.selectedDiagram.nodes[i];
                if (node.id !== 'textNode') {
                    var nodeInfo = node.addInfo;
                    nodeInfo[propName] = { value: '', type: 'bindingField', checked: false };
                }
            }
            this.getPropertyDialogContent(this.selectedItem.selectedDiagram.selectedItems.nodes[0].addInfo);
        }
        else {
            alert('Invalid Name');
        }
    };
    CustomProperties.prototype.setTooltip = function (node, content) {
        if (content) {
            node.constraints = node.constraints | ej.diagrams.NodeConstraints.Tooltip;
            node.tooltip = { content: content, position: 'BottomCenter', relativeMode: 'Object' };
        }
        else {
            node.constraints = node.constraints & ~ej.diagrams.NodeConstraints.Tooltip;
        }
    };
    return CustomProperties;
}());