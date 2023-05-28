sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/routing/History",
        "sap/ui/core/UIComponent",
        "sap/ui/model/odata/ODataUtils",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.core.routing.History} History
     * @param {typeof sap.ui.core.UIComponent} UIComponent
     */
    function (Controller, History, UIComponent, Formatter, DataUtils, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("rsf.rsf.controller.shared.BaseController", {

            onInit: function () {
                if (this.onRouteMatched) {
                    const targetName = this.targetName || this.getCurrentRouteInfo().name;
                    this.getRouter().getRoute(targetName)?.attachMatched(this.onRouteMatched, this);
                }
                this.oNavParams = {};
                this.eventBus = this.getOwnerComponent().getEventBus();
            },
            getModel: function (sName) {
                return this.getView().getModel(sName);
            },
            /**
             * Gets current route's info
             * @param (sap.ui.core.routing.Router) [oRouter]
             * @public
             * @returns
             */
            getCurrentRouteInfo: function (oRouter = this.getRouter()) {
                if (!oRouter) return;
                const currentHash = oRouter.getHashChanger().getHash();
                return oRouter.getRouteInfoByHash(currentHash);
            },
            /**
             * Convenience method for setting the view model in every controller of the application.
             * @public
             * @param {sap.ui.model.Model} oModel the model instance
             * @param {string} sName the model name
             * @returns {sap.ui.core.mvc.View} the view instance
             */
            setModel: function (oModel, sName) {
                return this.getView().setModel(oModel, sName);
            },
            /**
             * Method for navigation to specific view
             * @public
             * @param {string} psTarget Parameter containing the string for the target navigation
             * @param {Object.<string, string>} pmParameters? Parameters for navigation
             * @param {boolean} pbReplace? Defines if the hash should be replaced (no browser history entry) or set (browser history entry)
             */
            navTo: function (psTarget, pmParameters, pbReplace) {
                this.getRouter().navTo(psTarget, pmParameters, pbReplace);
            },

            getRouter: function () {
                return UIComponent.getRouterFor(this);
            },

            onNavBack: async function () {
            
                    const sPreviousHash = History.getInstance().getPreviousHash();

                    if (sPreviousHash !== undefined) {
                        window.history.back();
                    } else {
                        this.getRouter().navTo("appHome", {}, true /* no history*/);
                    }
        
            },
            onNavItemSelect: async function (oEvent) {
                const sKey = oEvent.getSource().getSelectedKey();
                if (sKey) {
                        this.getRouter().navTo(sKey);
                }
            },
            bindOdata: function () {
                this.setModel(this.getOwnerComponent().getModel());
            },

            bindTable: function (oParams) {
                const oTable = oParams?.oTable || this.getTable();
                const sPath = oParams?.tablePath || this.tablePath;
                const oTotalId = oParams?.oTotalId || this.byId("idListToolbarView--idTableTotal") || this.byId("idTableTotal");
                const sSelect = oParams?.sSelect === null ? undefined : oParams?.sSelect || this.sSelect;
                const sExpand = oParams?.sExpand === null ? undefined : oParams?.sExpand || this.expand;
                const bSuspended = oParams?.bSuspended || this.bSuspended;
                const oSorter = oParams?.oSorter || this.oSorter || null;
                const aFilters = oParams?.aFilters || this.aFixedFilter || [];

                const bSelectFirstRow = oParams?.bSelectFirstRow || this.bSelectFirstRow;
                const cbChanged = oParams?.cbChanged || this.afterLoad || null;

                oTable.bindRows({
                    path: sPath,
                    parameters: {
                        $expand: sExpand,
                        $select: sSelect,
                        $count: true,
                    },
                    suspended: bSuspended,
                    sorter: oSorter ? oSorter : [],
                    filters: aFilters,
                    events: {
                        change: () => {
                            const oBinding = oTable.getBinding("rows");
                            const length = oBinding.getLength();
                            if (bSelectFirstRow && length > 0) {
                                // oTable.clearSelection();    // this one is necessary, because rowSelectionChange
                                //                             // won't be triggered otherwise
                                // oTable.setSelectedIndex(0);
                                oTable.fireCellClick({rowIndex: 0});
                            }
                            if (oTotalId) oTotalId.setText(`${this.getResourceBundle().getText("TOTAL")} ${length}`);
                            // this.byId("idListToolbarView--idDeleteAllButton").setEnabled(length ? true : false);

                            if (cbChanged) cbChanged(oBinding, this);
                        },
                    },
                });
            },

            /**
             * If oEvent is provided tries to find out Table by the path (used by dialogs)
             * otherwise returns Table object by common 'idTable'
             *
             * @param oEvent
             * @returns {sap.ui.table.Table}
             */
            getTable: function (oEvent = null) {
                if (oEvent) {
                    const oTable = oEvent?.oSource?.oParent?.oParent;
                    if (oTable instanceof sap.ui.table.Table) {
                        return oTable;
                    }
                }
                return this.byId("idTable");
            },
            isSafeToProceed: function () {
                return new Promise((resolve, reject) => {
                    const oModel = this.getOwnerComponent().getModel();

                    const resetChanges = () => {
                        const oBatchQueue = oModel.oRequestor.mBatchQueue;
                        Object.entries(oBatchQueue)?.forEach(([batchGroupId, _]) => {
                            oModel.resetChanges(batchGroupId);
                        });
                        resolve(true);
                    };

                    if (oModel.hasPendingChanges()) {
                        sap.m.MessageBox.warning(`Duomenys buvo pakeisti! Ar tikrai norite tęsti neišsaugoję duomenų?`, {
                            title: "Dėmesio!",
                            actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                            onClose: (oAction) => {
                                if (oAction === "YES") {
                                    resetChanges();
                                } else {
                                    resolve(false);
                                }
                            },
                        });
                    } else {
                        resolve(true);
                    }
                });
            },
        })

    }
);