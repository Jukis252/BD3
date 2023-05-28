sap.ui.define(
    [
        "rsf/rsf/controller/shared/BaseController",
        "sap/m/MessageToast",
    ],
    function(BaseController, MessageToast) {
      "use strict";
  
      return BaseController.extend("rsf.rsf.controller.App", {
        onInit: function() {
          this.getRouter().attachRouteMatched(this.onRouteMatched, this);
        },

        onRouteMatched: function (oEvent) {
          const sRouteName = oEvent.mParameters.config.name;
          this.getModel("nav").setProperty("/selectedKey", sRouteName);
      },
      onItemSelect: async function (oEvent) {
        const oItem = oEvent.getParameter("item");
        this.getRouter().navTo(oItem.getKey());
      },
      onPress: function (oEvent)
      {
          this.getModel("nav").setProperty("/selectedKey", "Templates");
      }
      });
    }
  );
  