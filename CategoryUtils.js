/**
 * This class contains methods to work with catalog entities
 */
Ext.define("MVR.utils.CategoryUtils", {
    singleton: true,
    alternateClassName: ["MVR.CategoryUtils"],

    requires: [
        "MVR.store.category.CategoryStore",
        "MVR.model.category.SelectedCategory",
        "MVR.store.category.SelectedCategoryStore"
    ],

    /**
     * This method creates new store for nested children
     * @param record {MVR.model.category.Category} - record that contains children
     * @returns {MVR.store.category.CategoryStore}
     */
    generateCategoryStoreByRecord: function (record) {
        return Ext.create('MVR.store.category.CategoryStore', {
            data: record.get('children'),
            storeId: 'categories' + record.get('id'),
            autoLoad: false
        });
    },

    /**
     * This is a temporary utility method. Don't rely on it!
     * @param record {MVR.model.category.Category}
     * @param modelName {String}
     * @returns {Ext.data.Model|null}
     * @TODO Solve the problem of MVR.model.category.Category -> MVR.model.category.SelectedCategory inheritance
     */
    castToModel: function (record, modelName) {
        var fields;
        var result = Ext.create(modelName);

        if (result) {
            fields = result.getFields();

            Ext.Array.each(fields, function (item) {
                var fieldName = item.getName();

                result.set(fieldName, record.get(fieldName));
            });

            return result;
        }

        console.log("Model " + modelName + "cannot be created");
        return null
    },

    /**
     * This method adds checked category to the selection basket
     * @param record {MVR.model.category.Category} category record
     */
    addCategoryToSelection: function (record) {
        if (!this.isRecordSelected(record)){
            var store = Ext.StoreManager.lookup("selectedCategories");
            var recordCopy = this.castToModel(record, "MVR.model.category.SelectedCategory");

            recordCopy.set("children", null);
            recordCopy.set("parent", null);

            store.add(recordCopy);
            store.sync();
        } else {
            console.log("This record is already selected. id = ", record.getId());
        }
    },

    /**
     * This method returns all selected categories
     * @returns {Object[]}
     */
    getSelectedCategoriesData: function () {
        var me = this;
        var store = Ext.StoreManager.lookup("selectedCategories");
        var jsonData = [];

        store.each(function (item) {
            jsonData.push(me.castToModel(item, "MVR.model.category.SelectedCategory").getData());
        });

        return jsonData;
    },

    isRecordSelected: function (record) {
        var store = Ext.StoreManager.lookup("selectedCategories");
        var recordId = record.isModel ? record.get("id") : record.id;

        return !Ext.isEmpty(store.getById(recordId));
    },

    removeCategoryFromSelection: function (record) {
        var store = Ext.StoreManager.lookup("selectedCategories");

        store.remove(record);
        store.sync();
    },

    /**
     * This method removes all selected categories
     */
    removeAllSelectedCategories: function () {
        var store = Ext.StoreManager.lookup("selectedCategories");

        store.removeAll();
        store.sync();
    }

}, function () {
    Ext.create('MVR.store.category.SelectedCategoryStore');
});