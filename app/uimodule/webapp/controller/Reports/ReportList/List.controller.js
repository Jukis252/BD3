sap.ui.define([
    "rsf/rsf/controller/shared/BaseListController",
    'sap/ui/model/json/JSONModel',
	"sap/m/MessageToast"
], function(BaseListController, JSONModel, MessageToast) {
    'use strict';

    return BaseListController.extend("rsf.rsf.controller.Reports.ReportList.List",
    {
        onInit: function()
        {
            BaseListController.prototype.onInit.call(this);
        },
        onClick: function(oEvent)
        {
            this.getRouter().navTo("ReportListView");
        }
    })
    
});