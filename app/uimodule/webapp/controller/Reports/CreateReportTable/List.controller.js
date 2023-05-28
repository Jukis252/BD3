sap.ui.define([
    "rsf/rsf/controller/shared/BaseController"
], function(BaseController) {
    'use strict';

    return BaseController.extend("rsf.rsf.controller.Reports.CreateReportTable.List",
    {
        onInit: function()
        {
            this.tablepath = "/CreateReportTable";

            BaseController.prototype.onInit.call(this);
        }
    })
    
});