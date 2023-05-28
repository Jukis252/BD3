sap.ui.define([
    "rsf/rsf/controller/shared/BaseController",
    "sap/m/MessageToast",
], function(BaseController, MessageToast){
    "use strict";

    return BaseController.extend("rsf.rsf.controller.Templates.CreateTemplate.List", {
        onInit: function()
        {
            this.tablepath = "/CreateTemplate";

            BaseController.prototype.onInit.call(this);
            MessageToast.show("veikia");
        },

        onAfterVariantSave: function (oEvent)
        {
            MessageToast.show("veikia");
        },
        onAfterVariantApply: function (oEvent)
        {
            MessageToast.show("veikia");
        }
    })
})