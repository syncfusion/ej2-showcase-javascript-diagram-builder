var CommonKeyboardCommands = (function () {
    var selectedItem;
    var page;
    var isOpen;
    function CommonKeyboardCommands() {
    }
    CommonKeyboardCommands.newDiagram = function () {
        var origin = window.location.origin;
        if (!origin) {
            origin = window.location.protocol + '//'
                + window.location.hostname
                + (window.location.port ? ':' + window.location.port : '');
        }
        window.open(origin + window.location.pathname);
    };
    CommonKeyboardCommands.openDiagram = function () {
        this.openUploadBox(true, '.json');
    };
    CommonKeyboardCommands.saveDiagram = function () {
        this.download(this.page.savePage(), document.getElementById('diagramName').innerHTML);
    };
    CommonKeyboardCommands.zoomIn = function () {
        var diagram = this.selectedItem.selectedDiagram;
        diagram.zoomTo({ type: 'ZoomIn', zoomFactor: 0.2 });
        this.selectedItem.scrollSettings.currentZoom = (diagram.scrollSettings.currentZoom * 100).toFixed() + '%';
    };
    CommonKeyboardCommands.zoomOut = function () {
        var diagram = this.selectedItem.selectedDiagram;
        diagram.zoomTo({ type: 'ZoomOut', zoomFactor: 0.2 });
        this.selectedItem.scrollSettings.currentZoom = (diagram.scrollSettings.currentZoom * 100).toFixed() + '%';
    };
    CommonKeyboardCommands.download = function (data, filename) {
        var dataStr = data;
        if (window.navigator.msSaveBlob) {
            var blob = new Blob([dataStr], { type: 'data:text/json;charset=utf-8,' });
            window.navigator.msSaveOrOpenBlob(blob, filename + '.json');
        }
        else {
            dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(dataStr);
            var a = document.createElement('a');
            a.href = dataStr;
            a.download = filename + '.json';
            document.body.appendChild(a);
            a.click();
        }
    };
    CommonKeyboardCommands.openUploadBox = function (isOpen, extensionType) {
        var defaultUpload = document.getElementById('defaultfileupload');
        defaultUpload = defaultUpload.ej2_instances[0];
        defaultUpload.clearAll();
        this.selectedItem.orgDataSettings.extensionType = defaultUpload.allowedExtensions = extensionType;
        defaultUpload.dataBind();
        this.isOpen = isOpen;
        document.getElementsByClassName('e-file-select-wrap')[0].children[0].click();
    };
    CommonKeyboardCommands.addCommonCommands = function (commands) {
        commands.push({
            gesture: { key: ej.diagrams.Keys.N, keyModifiers: ej.diagrams.KeyModifiers.Shift }, canExecute: this.canExecute,
            execute: this.newDiagram.bind(this), name: 'New'
        });
        commands.push({
            gesture: { key: ej.diagrams.Keys.N, keyModifiers: ej.diagrams.KeyModifiers.Shift }, canExecute: this.canExecute,
            execute: this.newDiagram.bind(this), name: 'New'
        });
        commands.push({
            gesture: { key: ej.diagrams.Keys.O, keyModifiers: ej.diagrams.KeyModifiers.Control }, canExecute: this.canExecute,
            execute: this.openDiagram.bind(this), name: 'Open'
        });
        commands.push({
            gesture: { key: ej.diagrams.Keys.S, keyModifiers: ej.diagrams.KeyModifiers.Control }, canExecute: this.canExecute,
            execute: this.saveDiagram.bind(this), name: 'Save'
        });
        commands.push({
            gesture: { key: ej.diagrams.Keys.Plus, keyModifiers: ej.diagrams.KeyModifiers.Control }, canExecute: this.canExecute,
            execute: this.zoomIn.bind(this), name: 'ZoomIn'
        });
        commands.push({
            gesture: { key: ej.diagrams.Keys.Minus, keyModifiers: ej.diagrams.KeyModifiers.Control }, canExecute: this.canExecute,
            execute: this.zoomOut.bind(this), name: 'ZoomOut'
        });
        return commands;
    };
    CommonKeyboardCommands.canExecute = function () {
        return true;
    };
    CommonKeyboardCommands.cloneSelectedItems = function () {
        var diagram = this.selectedItem.selectedDiagram;
        var selectedItems1 = diagram.selectedItems.nodes;
        selectedItems1 = selectedItems1.concat(diagram.selectedItems.connectors);
        return selectedItems1;
    };
    CommonKeyboardCommands.duplicateSelectedItems = function () {
        this.selectedItem.selectedDiagram.paste(this.cloneSelectedItems());
    };
    CommonKeyboardCommands.cloneSelectedItemswithChildElements = function () {
        return this.cloneChild();
    };
    CommonKeyboardCommands.cloneChild = function () {
        var diagram = this.selectedItem.selectedDiagram;
        var selectedItems1 = [];
        if (diagram.selectedItems.nodes.length > 0) {
            var node = diagram.selectedItems.nodes[0];
            if (node.addInfo) {
                node.addInfo.isFirstNode = true;
            }
            else {
                node.addInfo = { isFirstNode: true };
            }
            selectedItems1.push(node);
            selectedItems1 = this.cloneSubChildSubChild(node, selectedItems1);
        }
        return selectedItems1;
    };
    CommonKeyboardCommands.cloneSubChildSubChild = function (node, select) {
        var diagram = this.selectedItem.selectedDiagram;
        var select1 = select;
        for (var i = node.outEdges.length - 1; i >= 0; i--) {
            var connector = diagram.getObject(node.outEdges[i]);
            var childNode = diagram.getObject(connector.targetID);
            select1.push(connector);
            select1.push(childNode);
            if (childNode.outEdges.length > 0) {
                this.cloneSubChildSubChild(childNode, select1);
            }
        }
        return this.sortCollection(select1);
    };
    CommonKeyboardCommands.sortCollection = function (select1) {
        var select = [];
        for (var i = select1.length - 1; i >= 0; i--) {
            if (select1[i] instanceof ej.diagrams.Node) {
                select.push(select1[i]);
            }
        }
        for (var i = select1.length - 1; i >= 0; i--) {
            if (select1[i] instanceof ej.diagrams.Connector) {
                select.push(select1[i]);
            }
        }
        return select;
    };
    return CommonKeyboardCommands;
}());