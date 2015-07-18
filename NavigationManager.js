/**
 * This class is responsible for the navigation across the application
 */
Ext.define("MVR.manager.NavigationManager", function () {
    /**
     * This parameter contains the link to the navigation view {@link Ext.navigation.View}
     * @private
     */
    var _navigationView;

    return {
        singleton: true,
        alternateClassName: ["MVR.NavigationManager"],

        requires: [
            "MVR.utils.StringUtils"
        ],

        /**
         * This method saves link to navigation view into the private variable
         * @param view {Ext.navigation.View}
         */
        setNavigationView: function (view) {
            _navigationView = view;
        },

        getNavigationView : function(){
            return _navigationView;
        },

        /**
         * Navigates to view by url
         * "area1"
         * "area1/system"
         * @param {String} url URL string
         * @param {Object} [viewConf] configuration object that will be applied to view
         * @param {Object} [controllerConfig]
         */
        navigate: function (url, viewConf, controllerConfig) {
            var view;

            console.log("NavigationManager.navigate!", url, MVR.StringUtils.getViewClassName(url));

            if (url) {
                view = Ext.create(MVR.StringUtils.getViewClassName(url), (!Ext.isEmpty(viewConf) && Ext.isObject(viewConf)) ? viewConf : null);
                Ext.apply(view.getController(), (!Ext.isEmpty(controllerConfig) && Ext.isObject(controllerConfig)) ? controllerConfig : null);

                _navigationView.push(view);
            } else {
                this.goHome();
            }
        },

        /**
         * Navigates to the previous view
         */
        goBack: function () {
            _navigationView.pop();
        },

        /**
         * Navigates to the initial view
         */
        goHome: function () {
            _navigationView.reset();
        },

        /**
         * This method hides the navigation bar
         */
        hideNavigationBar: function () {
            _navigationView.setNavigationBar({hidden: true});
        },

        /**
         * This method shows the navigation bar
         */
        showNavigationBar: function () {
            _navigationView.setNavigationBar({hidden: false});
        },

        /**
         * This method clears the navigation bar title
         */
        resetNavigationBarTitle: function() {
            _navigationView.getNavigationBar().setTitle("&nbsp;");
        },

        /**
         * This method returns active item's itemId
         * @returns {String}
         */
        getCurrentViewId: function () {
            return _navigationView.getActiveItem().getItemId();
        }
    }
});