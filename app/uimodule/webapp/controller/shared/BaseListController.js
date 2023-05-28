sap.ui.define([
    "rsf/rsf/controller/shared/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
], function(BaseController, MessageToast, MessageBox, Filter, FilterOperator, JSONModel) {
    'use strict';

    return BaseController.extend("rsf.rsf.controller.shared.BaseListController",
    {
        /**
             * Initialises List
             *
             * @public
             * @returns
             */
        onInit: function () {
            BaseController.prototype.onInit.call(this);

            //   this.bindOdata();

            this.setModel(
                new JSONModel({
                    wrapColumns: false,
                    wrapTextColumns: false,
                    readonly: false,
                    validityFilterOn: this.bValidityFilterOn === undefined ? true : this.bValidityFilterOn,
                    validityFilterVisible: true,
                    tableTitle:
                        this.title || this.getRouter().getTarget(this.getCurrentRouteInfo().name)?._oOptions?.title || null,
                }),
                "ui"
            );

            this.setModel(new JSONModel({}), "selectedRow");
        },
        onCellClick: function (oEvent) {
            const rowIdx = oEvent.getParameter("rowIndex");
            const cxt = this.getTable().getContextByIndex(rowIdx);
            const oData = cxt?.getObject();
            this.getModel("selectedRow").setData(oData);
            if (this.cellClick) {
                this.cellClick(oEvent, oData);
            }
        },
        onReset: function (oEvent, bNoRefresh) {
            this.resetFBFilter();
            if (!bNoRefresh) this.onSearch(oEvent);
        },
        onRouteMatched: function (oEvent) {
            //  This one is used to pass route params if set
            this.oNavParams = this.getCurrentRouteInfo().arguments;

            if (this.onRoute) {
                this.onRoute(oEvent);
            }
        },
        onAddRec: async function (oEvent) {
                if (await this.isSafeToProceed()) {
                    this.getRouter().navTo(this.editFormTarget, this.getCurrentRouteInfo().arguments);
                }
        },

        onViewRec: async function (oEvent, oData) {

            const oRec = oEvent?.getSource()?.getBindingContext()?.getObject() || oData;
            if (await this.isSafeToProceed()) {
                this.oNavParams[this.idArgName ? this.idArgName : "id"] = oRec[this.idFieldName];
                this.getRouter().navTo(this.editFormTarget, this.oNavParams);
            }
        },
    })
    
});