    sap.ui.define([
        "rsf/rsf/controller/shared/BaseController"],
    function (BaseController) {
        "use strict";

        return BaseController.extend("rsf.rsf.controller.Templates.Main", {
            onInit: function () {
                this.getRouter()
                    .getRoute("Templates")
                    .attachMatched(this.onRouteMatched, this);
            },

            onRouteMatched: function () {
                if (this.getCurrentRouteInfo().name === "Templates") {
                    this.getRouter().navTo("TemplateList");
                }
            },

        });
    });