sap.ui.define([
    "rsf/rsf/controller/shared/BaseController",
], function(BaseController){
    "use strict";

    return BaseController.extend("rsf.rsf.controller.Templates.TemplateList.List", {
        onInit: function()
        {
            this.tablepath = "/TemplateList";

            BaseController.prototype.onInit.call(this);
        }
    })
})