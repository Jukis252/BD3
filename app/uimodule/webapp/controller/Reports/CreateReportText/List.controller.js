sap.ui.define([
    'rsf/rsf/controller/shared/BaseFormController',
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/comp/variants/VariantManagement",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"handlebars"
	
], function(BaseFormController, ODataModel, VariantManagement, JSONModel,MessageToast) {
    'use strict';

    return BaseFormController.extend("rsf.rsf.controller.Reports.CreateReportText.List", {
        onInit: function() {
			this.idFieldName = "TEMPLATE_ID";			
			BaseFormController.prototype.onInit.call(this);
			this.setModel(new JSONModel({sText: ""}), "UI");
			//var template = Handlebars.compile(source);
			
		},
		onSave: function()
		{
			const sCustomName = this.getView().byId("inputName").getValue();
			const oModel = this.getView().getModel();
			console.log(oModel);
			var update = this.getModel("UI").getJSON();
			var updateString = JSON.parse(update);
			console.log(update);
			console.log(updateString);  
			const oEntry = {ID:2, NAME: sCustomName, ITEM: updateString.sText};
			oModel.create("/REPORTS", oEntry, {
				success: function() {
					// handle the success case
					MessageToast.show("Data saved successfully");
				  },
				  error: function(oError) {
					// handle the error case
					MessageToast.show("Error saving data: " + oError.message);
				  }
			});
		},
		onDataReceived: function()
		{
			const oSmartTable = this.getView().byId("smartTable");
			console.log(oSmartTable);
			var oModel = oSmartTable.getModel().oData;
			var modelJSON = Object.values(oModel);
			console.log(oModel);
			console.log(modelJSON);
		},
		onRowSelectionChange: function(oEvent)
		{
			//console.log(oEvent.getParameter("rowContext").getObject());
			//generateReport();

		},
		generateReport: function(oEvent)
		{
			const sHTML = this.getView().byId("textEditor").getValue();
			console.log(sHTML);
			var source = this.getModel("UI").oData;
			console.log(oEvent.getParameter("rowContext").getObject());
			var data = oEvent.getParameter("rowContext").getObject();
			var template =Handlebars.compile(sHTML);
			var result = template(data);
			console.log(result);
			var update = this.getModel("UI").setProperty("/sText", this.getModel("UI").getProperty("/sText")+ result);
			console.log(update);
			//gauti selectedRows
			//ciklas pazymetu, kuriame buti compiled template su kiekvienos eilutes duomenimis
			//viska pridedu prie html teksto
		},
		onVariantSave: function()
		{
			const oSmartTable = this.getView().byId("smartTable");
			console.log(oSmartTable);
			var oModel = oSmartTable.getModel().oData;
			var modelJSON = Object.values(oModel);
			console.log(oModel);
			console.log(modelJSON);
		}
	});
    
});