Ext.define('MVR.controller.base.BaseCategoryViewController', {
    extend: 'Ext.app.ViewController',

    requires: [
        "MVR.utils.CategoryUtils",
        'MVR.manager.NavigationManager'
    ],

    onItemTap: function (view, index, target, record, event) {
        var checkboxTarget = event.getTarget('.categoryCheckBox');

        if (!checkboxTarget) {
            this._analyzeCategoryType(record);
        } else {
            this._onCheckboxValueChange(record, checkboxTarget.checked);
        }
    },

    /**
     * If user clicked on the checkbox, the new category should be selected
     * @param record {MVR.model.category.Category} selected record
     * @param checked {Boolean} is checkbox checked or not
     * @private
     */
    _onCheckboxValueChange: function (record, checked) {
        if (checked === true) {
            MVR.utils.CategoryUtils.addCategoryToSelection(record);
        } else {
            MVR.utils.CategoryUtils.removeCategoryFromSelection(record);
        }
    },

    /**
     * This method decides what action to perform by the category type
     * @param record {MVR.model.category.Category} selected record
     * @private
     */
    _analyzeCategoryType: function (record) {
        switch (record.get("type")) {
            case "category":
                this._performCategoryNavigationAction(record);
                break;

            case "action":
                this._performCustomAction(record);
                break;

            default:
                Ext.raise("Unknown category type " + record.get("type"));
        }
    },

    /**
     * This method performs navigation through the category tree
     * @param record {MVR.model.category.Category} selected record
     * @private
     */
    _performCategoryNavigationAction: function (record) {
        var categoryStore,
            label;

        if (!Ext.isEmpty(record.get("children"))) {
            label = record.get('label');
            categoryStore = MVR.utils.CategoryUtils.generateCategoryStoreByRecord(record);

            MVR.manager.NavigationManager.navigate("category/category-list", {
                store: categoryStore,
                title: label,
                itemId: 'categoryListView-' + label
            });

            MVR.manager.NavigationManager.showNavigationBar();
        } else {
            console.log("This record has no children. id = ", record.getId());
        }
    },

    /**
     * This method performs custom action.
     * For example, the navigation to the special page can be done
     * @param record {MVR.model.category.Category} selected record
     * @private
     */
    _performCustomAction: function (record) {
        switch (record.get("key")) {
            case "action-assistant":
                MVR.manager.NavigationManager.navigate("assistant/assistant");
                break;

            default:
                Ext.raise("Action " + record.get("key") + " is not related to any view");
        }
    }
});