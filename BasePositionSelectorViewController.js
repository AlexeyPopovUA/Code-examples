Ext.define('MVR.controller.base.BasePositionSelectorViewController', {
    extend: 'Ext.app.ViewController',

    onQueryChange: function (field) {
        var selectorStore = field.up("#positionSelector").down("#resultList").getStore();

        selectorStore.getProxy().query = field.getValue();
        //TODO make a 500ms pause
        selectorStore.load();
    },

    onPositionCancel: function () {
        this._closeSelector();
    },

    _closeSelector: function () {
        this.getView().destroy();
    }
});