sap.ui.define([
    "rsf/rsf/controller/shared/BaseController",
], function(BaseController){
    "use strict";

    return BaseController.extend("rsf.rsf.controller.Reports.Main", {
        onInit: function () {
            this.getRouter()
                .getRoute("Reports")
                .attachMatched(this.onRouteMatched, this);
        },

        onRouteMatched: function () {
            if (this.getCurrentRouteInfo().name === "Reports") {
                this.getRouter().navTo("ReportList");
            }
        },
    });
    }
);