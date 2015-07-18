Ext.define('MVR.controller.route.RouteViewController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.route.route',

    requires: [
        'MVR.manager.NavigationManager',
        'MVR.model.route.Position',
        'MVR.utils.GoogleUtils',
        'MVR.utils.RouteObserver'
    ],

    platformConfig: {
        desktop: {
            positionSelector: 'MVR.view.route.PositionDialogView'
        },
        '!desktop': {
            positionSelector: 'MVR.view.route.PositionPickerView'
        }
    },

    routeObserver: null,

    constructor: function () {
        this.routeObserver = Ext.create(MVR.utils.RouteObserver, {
            listeners: {
                position_changed: function (currentMarker) {
                    MVR.utils.GoogleUtils.performGeocoding(
                        currentMarker.position,
                        function (geocoderRecord) {
                            this.config.relatedRecord.set(geocoderRecord.getData(true));
                        },
                        function (record, operation) {
                            // do something if the load failed
                        },
                        function () {
                            MVR.manager.NavigationManager.goBack();
                        },
                        this
                    );
                }
            }
        });
    },

    changeToBicycleMode : function (){
      this.routeObserver.config.travelMode = 'BICYCLING';
    },

    changeToDriveMode : function (){
        this.routeObserver.config.travelMode = 'DRIVING';
    },

    changeToWalkMode: function(){
        this.routeObserver.config.travelMode = 'WALKING';
    },

    changeToTransitMode : function(){
        this.routeObserver.config.travelMode = 'TRANSIT';
    },

    buildRoute: function () {
        var me = this;
        me.routeObserver.isReadyToBuildRoute = true;
        MVR.manager.NavigationManager.navigate("map/map", {isCurrentMarkerDraggable: true}, {routeObserver: me.routeObserver});
    },

    /**
     * This method is called on route view "initialize" event.
     * It adds two initial positions for the route calculation
     */
    showRouteView: function () {
        var store = this._getPositionStore();

        //previous positions should be cleared
        if (store.getCount() > 0) {
            store.removeAll();
        }

        //Minimal number of position is 2
        this.addNewPosition(Ext.create("MVR.model.route.Position"));
        this.addNewPosition(Ext.create("MVR.model.route.Position"));
    },

    goToMap: function (element) {
        var me = this;
        me.routeObserver.config.relatedRecord = element.up("dataitem").getRecord();
        MVR.manager.NavigationManager.navigate("map/map", {isCurrentMarkerDraggable: true}, {routeObserver: me.routeObserver});
    },

    /**
     * Adds new position to the dataview
     * @param position {MVR.model.route.Position}
     */
    addNewPosition: function (position) {
        this._getPositionStore().add(position);
    },

    /**
     * Removes position from the dataview
     * @param button
     */
    removePosition: function (button) {
        var dataItem,
            dataView;
        var store = this._getPositionStore();

        //Minimal number of position is two
        if (store.getCount() > 2) {
            dataItem = button.up("dataitem");
            dataView = dataItem.up("dataview");

            store.remove(dataItem.getRecord());
            dataView.refresh();
        }
    },

    /**
     * Opens position picker
     * @param textfield {Ext.field.Text}
     */
    onPlaceInputFocus: function (textfield) {
        var positionSelector;

        if (!this.getView().down("#positionSelector")) {
            positionSelector = Ext.create(this.positionSelector, {
                relatedRecord: textfield.up("dataitem").getRecord()
            });
            this.getView().add(positionSelector);
            positionSelector.show();
        }
    },

    /**
     * This method is called on "add new position" button tap event
     */
    onAddPosition: function () {
        this.addNewPosition(Ext.create("MVR.model.route.Position"));
    },

    /**
     * This method returns dataview position store
     * @returns {MVR.store.route.PositionStore}
     * @private
     */
    _getPositionStore: function () {
        return this.getView().down("dataview#positionsContainer").getStore();
    }
});