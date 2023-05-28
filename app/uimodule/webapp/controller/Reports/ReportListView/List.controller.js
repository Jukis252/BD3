sap.ui.define([
    "rsf/rsf/controller/shared/BaseFormController",
    'sap/ui/model/json/JSONModel',
    "sap/ui/model/odata/v2/ODataModel",
	"sap/m/MessageToast",
], function(BaseFormController, JSONModel, ODataModel, MessageToast ) {
    'use strict';


    return BaseFormController.extend("rsf.rsf.controller.Reports.ReportListView.List",
    {
        onInit: function()
        {
            const oModel = new ODataModel("/v2/ui/");
            this.getView().setModel(oModel);
            console.log(oModel);
            var oTextField =this.getView().byId("text2");
            var sPath = "/REPORTS"
            oModel.read(sPath, {
                success: function(oData) {
                  console.log(oData.results[0].ITEM);
                  oTextField.setHtmlText(oData.results[0].ITEM);
                  console.log(oTextField);
                },
                error: function(oError) {
                    console.log(oError);
                  }
                });

            BaseFormController.prototype.onInit.call(this);
        },
        onPressGenerate: async function()
        {
            var oTextField =this.getView().byId("text2");
            var oModel = this.getView().getModel();
            var sPath = "/REPORTS"
            oModel.read(sPath, {
                success: function(oData) {
                  console.log(oData.results[0].ITEM);
                  oTextField.setText(oData.results[0].ITEM);
                  console.log(oTextField);
                },
                error: function(oError) {
                    console.log(oError);
                  }
             });            

             (async () => {
                const fileBuffer = await HTMLtoDOCX(htmlString, null, {
                  table: { row: { cantSplit: true } },
                  footer: true,
                  pageNumber: true,
                });
                fs.writeFile(filePath, fileBuffer, (error) => {
                    if (error) {
                      console.log('Docx file creation failed');
                      return;
                    }
                    console.log('Docx file created successfully');
                  });
                })();
            // var data = oTextField.getText();
            // const blob = new Blob([data], {type: 'text/plain'});
            // console.log(coreLibrary);
            // console.log(File);
            // if (coreLibrary && coreLibrary.File) {
            //     const saveAs = coreLibrary.File.saveAs;
            //     saveAs(blob, "myFile.txt");
            // } else {
            //     console.error("File library not loaded");
            // }
            MessageToast.show("Generuoti");
            HTMLtoDOCX(htmlString, headerHTMLString, documentOptions, footerHTMLString);
        },
        onPressModify: function()
        {
            this.getRouter().navTo("CreateReportText")
            MessageToast.show("Modifikuoti");
        }
    })
    
});