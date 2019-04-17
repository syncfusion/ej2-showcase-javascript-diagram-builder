var CustomContextMenuItems = (function () {
    function CustomContextMenuItems() {
        // this.items = [
        //     {
        //         text: 'Duplicate', id: 'duplicate'
        //     },
        // ];
    }
    CustomContextMenuItems.prototype.items = function () {
        var items = [
            {
                text: 'Duplicate', id: 'duplicate'
            },
        ];
        return items;
    }
    CustomContextMenuItems.prototype.getHiddenMenuItems = function (diagram) {
        var hiddenItems = [];
        hiddenItems.push('duplicate');
        // hiddenItems.push('Ad-Hoc', 'Loop', 'Compensation', 'Activity-Type', 'Boundry',
        //     'Data Object', 'Collection', 'Call', 'Trigger Result', 'Event Type', 'Task Type', 'GateWay');
        if (diagram.selectedItems.nodes.length > 0 || diagram.selectedItems.connectors.length > 0) {
            hiddenItems.splice(hiddenItems.indexOf('duplicate'), 1);
        }
        if (diagram.selectedItems.nodes.length === 1 && diagram.selectedItems.connectors.length === 0) {
            var node = diagram.selectedItems.nodes[0];
            if (node.shape && node.shape.type === 'Bpmn') {
                var bpmnShape = node.shape;
                if (bpmnShape.shape === 'Event') {
                    // hiddenItems.splice(hiddenItems.indexOf('Event Type'), 1);
                    // hiddenItems.splice(hiddenItems.indexOf('Trigger Result'), 1);
                }
            }
        }
        return hiddenItems;
    };
    CustomContextMenuItems.prototype.updateBpmnShape = function (diagram, item) {
        var itemText = item.text.replace(/[' ']/g, '').replace(/[-]/g, '');
        if (itemText === 'Duplicate') {
            CommonKeyboardCommands.duplicateSelectedItems();
        }
        else if (diagram.selectedItems.nodes.length === 1 && diagram.selectedItems.connectors.length === 0) {
            var node = diagram.selectedItems.nodes[0];
            if (node.shape && node.shape.type === 'Bpmn') {
                var bpmnShape = node.shape;
                if (item.id.startsWith('eventType')) {
                    bpmnShape.event.event = itemText;
                }
                else if (item.id.startsWith('triggerType')) {
                    bpmnShape.event.trigger = itemText;
                }
                else if (item.id.startsWith('taskType')) {
                    // bpmnShape.activity.task.type = itemText as BpmnTasks;
                    bpmnShape.activity.subProcess = {};
                }
            }
        }
    };
    return CustomContextMenuItems;
}());