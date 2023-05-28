sap.ui.define(
    [
        "rsf/rsf/controller/shared/BaseController",
        "sap/ui/richtexteditor/RichTextEditor",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/m/MessageToast",
        "sap/m/MessageBox",
    ],
    function (
        BaseController,
        RichTextEditor,
        JSONModel,
        Filter,
        FilterOperator,
        MessageToast,
        MessageBox
    ) {
        "use strict";

        return BaseController.extend(
            "rsf.rsf.controller.shared.BaseFormController",
            {
                /**
                 * Initialises form
                 *
                 * @public
                 * @returns
                 */
                onInit: function () {
                    BaseController.prototype.onInit.call(this);

                    this.bindOdata();

                    this.setModel(
                        new JSONModel({
                            formTitle:
                                this.title ||
                                this.getRouter().getTarget(this.getCurrentRouteInfo().name)
                                    ?._oOptions?.title ||
                                null,
                            readonly: false,
                            isSaveAllowed: true,
                        }),
                        "ui"
                    );

                    this.oUiModel = this.getModel("ui");
                    const oBinding = new sap.ui.model.Binding(
                        this.oUiModel,
                        "/",
                        this.oUiModel.getContext("/")
                    );
                    oBinding.attachChange((_) => {
                        const bReadOnly =
                            this.oUiModel.getProperty("/readonly");
                        this.setControlsState(this.byId("idVerticalLayout"), !bReadOnly);
                    });

                },

                onGoBack: async function () {
                    if (await this.isSafeToProceed()) {
                        this.getRouter().navTo(this.sListTarget, this.oNavParams);
                    }
                },

                /**
                 * Deletes record of the form
                 */
                onDelete: function (oEvent) {
                    MessageBox.warning(`Ar tikrai norite pašalinti įrašą?`, {
                        title: "Dėmesio!",
                        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                        onClose: (oAction) => {
                            if (oAction === "YES") {
                                sap.ui.core.BusyIndicator.show(0);

                                if (this?.getModel()?.hasPendingChanges())
                                    this.getModel().resetChanges(this.batchGroupId);

                                const oContext = this.byId("idVerticalLayout").getBindingContext();
                                CRUD.handleDelete(oContext)
                                    .then((_) => {
                                        sap.ui.core.BusyIndicator.hide();
                                        this.eventBus.publish("mainChannel", "refreshTable", {
                                            target: this.targetName,
                                        });
                                        this.onGoBack();
                                        if (this.afterDelete) this.afterDelete(oContext);
                                        MessageToast.show("Įrašas pašalintas sėkmingai");
                                    })
                                    .catch((oError) => {
                                        sap.ui.core.BusyIndicator.hide();
                                        if (oError?.message) MessageBox.error(oError.message);
                                    });
                            }
                        },
                    });
                },

                /**
                 * If exists VALID_FROM_DATE and VALID_TO_DATE, then validate them and if coresponding controls are
                 * found mark them with error
                 *
                 * @param oContext
                 * @returns {boolean}
                 */
                onSave: function (oEvent, bStayIn = false, sMsg) {

                    const oContext = this.byId("idVerticalLayout").getBindingContext();


                    if (this.beforeSave) {
                        if (this.beforeSave(oContext) === false) {
                            return;
                        }
                    }


                    if (this.getModel().hasPendingChanges()) {
                        this.resetPendingChanges();

                        const oBundle = this.getModel("i18n").getResourceBundle();
                        try {
                            this.getModel()
                                .submitBatch(this.batchGroupId)
                                .then(
                                    () => {
                                        if (!this.getModel("appView").getProperty("/error")) {
                                            this.eventBus.publish("mainChannel", "refreshTable", {
                                                target: this.targetName,
                                            });
                                            this.navigateAfterSave(
                                                bStayIn,
                                                oContext.getProperty(this.idFieldName)
                                            );
                                            if (this.afterSave) this.afterSave(oContext);
                                            MessageToast.show(sMsg ? sMsg : "Išsaugota sėkmingai");
                                        }
                                    },
                                    (oError) => {
                                        MessageBox.error(oBundle.getText(oError.message));
                                    }
                                )
                                .catch((oError) => {
                                    MessageBox.error(oBundle.getText(oError.message));
                                });
                        } catch (oError) {
                            MessageBox.error(oBundle.getText(oError.message));
                        }
                    } else {
                        this.navigateAfterSave(
                            bStayIn,
                            MessageToast.show("Veikia"),
                            oContext.getProperty(this.idFieldName)
                        );
                    }
                    console.log(oEvent);
                },

                resetPendingChanges: function () {
                    // save modified data of other batch groups
                    const oModel = this.getOwnerComponent().getModel();
                    const oBatchQueue = oModel.oRequestor.mBatchQueue;
                    Object.entries(oBatchQueue)?.forEach(([batchGroupId, _]) => {
                        if (batchGroupId !== this.batchGroupId) {
                            if (oModel.hasPendingChanges(batchGroupId)) {
                                oModel.resetChanges(batchGroupId);
                            }
                        }
                    });
                },

                /**
                 *  if bStayIn is true, then rest on the same page.
                 *
                 * @param bStayIn
                 * @param id
                 */
                navigateAfterSave: function (bStayIn, id) {
                    if (!bStayIn && !this.bStayIn) {
                        this.onGoBack();
                    } else {
                        // just refresh the form to reflect new id
                        this.oNavParams[this.idArgName || "id"] = id;
                        this.getRouter().navTo(this.targetName, this.oNavParams, true);
                    }
                },

                bindForm: function (id, sExpand, sSelect) {
                    //   if (!this.getModel()) return;

                    this.byId("idVerticalLayout").unbindElement();
                    if (this?.getModel()?.hasPendingChanges())
                        this.getModel().resetChanges(this.batchGroupId);

                    if (!id) {
                        // CREATE a new record
                        // create a new item in the ListBindig
                        const oListBinding = this.getModel().bindList(
                            `/${this.entityName}`,
                            null,
                            null,
                            null,
                            {$$updateGroupId: this.batchGroupId, $expand: sExpand}
                        );

                        // oListBinding.attachCreateSent((oEvent) => {
                        //     this.getView().setBusy(true);
                        //     if (this.afterCreateCompleted) this.afterCreateCompleted(oEvent);
                        //     // console.log(oEvent);
                        // });

                        // oListBinding.attachCreateCompleted((oEvent) => {
                        //     this.getView().setBusy(false);
                        //     // console.log(oEvent);
                        // });

                        const oContext = oListBinding.create();
                        if (
                            this.getModel()
                                .getMetaModel()
                                .getObject(`/${this.entityName}/VALID_FROM_DATE`)
                        ) {
                            oContext.setProperty(
                                "VALID_FROM_DATE",
                                this.toIsoUtcString(new Date())
                            );
                        }
                        // attach it to the Element
                        this.byId("idVerticalLayout").setElementBindingContext(oContext);

                        if (this.afterContextCreated) this.afterContextCreated(oContext);
                    } else {
                        // This part comes during the EDIT
                        this.byId("idVerticalLayout").bindElement({
                            path: `/${this.entityName}(${id})`,
                            parameters: {
                                $$updateGroupId: this.batchGroupId,
                                $expand: sExpand,
                                $select: sSelect,
                            },
                            events: {
                                dataRequested: (oEvent) => {
                                    this.getView().setBusy(true);
                                    if (this.onDataRequest) this.onDataRequest(oEvent);
                                    // console.log(oEvent);
                                },
                                dataReceived: (oEvent) => {
                                    this.getView().setBusy(false);
                                    if (this.afterDataReceived) this.afterDataReceived(oEvent);
                                    // console.log(oEvent.getSource().getBoundContext().getObject());
                                },
                                patchSent: (oEvent) => {
                                    this.getView().setBusy(true);
                                    // console.log(oEvent);
                                },
                                patchCompleted: (oEvent) => {
                                    this.getView().setBusy(false);
                                    // console.log(oEvent);
                                },
                                createSent: (oEvent) => {
                                    this.getView().setBusy(true);
                                    // console.log(oEvent);
                                },
                                createCompleted: (oEvent) => {
                                    this.getView().setBusy(false);
                                    if (this.afterCreateCompleted)
                                        this.afterCreateCompleted(oEvent);
                                    // console.log(oEvent);
                                },
                            },
                        });
                    }
                },

                /**
                 * Argument name passed by the list could differ. Default is "id"
                 * Binds the form on route matched.
                 *
                 * @param oEvent
                 */
                onRouteMatched: function (oEvent) {

                    sap.ui.getCore().getMessageManager().removeAllMessages();

                    this.oUiModel.setProperty("/id", null); // FIXME:: ???

                    //  This one is used to pass route params if set
                    this.oNavParams = this.getCurrentRouteInfo().arguments;

                    const id = this.idArgName ? this.idArgName : "id";
                    this.bindForm(this.oNavParams[id], this.expand, this.select);
                    this.oUiModel.setProperty("/id", this.oNavParams[id]);


                    if (this.onRoute) {
                        this.onRoute(oEvent);
                    }
                },

                /**
                 * Used by inputs to get suggested items.
                 * If sFixedKey present adds it to AND condition
                 *
                 * @param oEvent
                 * @param sFixedFilterKey
                 * @param sFixedKeyValue
                 */
                onSuggest: function (oEvent, sFixedFilterKey, sFixedKeyValue) {
                    const oControl = oEvent.getSource();
                    const sValue = oEvent.getParameter("suggestValue");
                    const oTemplate = oControl.getBindingInfo("suggestionItems").template;
                    const sKeyFieldName = oTemplate.getBindingInfo("key").parts[0].path;
                    const sTextFieldName = oTemplate.getBindingInfo("text").parts[0].path;
                    const aFilters = [];

                    if (sValue) {
                        aFilters.push(
                            new this.createFilter(
                                sTextFieldName,
                                sValue,
                                FilterOperator.Contains
                            )
                        );
                        if (+sValue) {
                            aFilters.push(
                                new this.createFilter(sKeyFieldName, +sValue, FilterOperator.EQ)
                            );
                        }
                    }

                    let oFilter = new Filter(aFilters, false);

                    if (sFixedFilterKey && sFixedKeyValue) {
                        oFilter = new Filter(
                            [
                                oFilter,
                                new this.createFilter(
                                    sFixedFilterKey,
                                    +sFixedKeyValue,
                                    FilterOperator.EQ
                                ),
                            ],
                            true
                        );
                    }

                    const oBinding = oControl.getBinding("suggestionItems");
                    oBinding.filter(oFilter, sap.ui.model.FilterType.Control);
                },

                setLookup: function (id, sEntity, oControl, cbItemSelected) {
                    this.oUiModel.setProperty(`/selected${sEntity}Id`, null);
                    this.oUiModel.setProperty(`/selected${sEntity}Name`, null);

                    if (id) {
                        this.oUiModel.setProperty(`/selected${sEntity}Id`, id);
                        const sUnderscoredEntity = sEntity
                            .replace(/[A-Z]/g, (letter) => `_${letter}`)
                            .substr(1)
                            .toUpperCase();
                        const sPath = `/${sUnderscoredEntity}(${id})/NAME`;
                        this.getModel()
                            .bindProperty(sPath)
                            .requestValue()
                            .then((value) => {
                                this.oUiModel.setProperty(`/selected${sEntity}Name`, value);
                                //oControl.setProperty("value", value);
                            });
                    }

                    oControl.attachSuggestionItemSelected((oEvent) => {
                        this.oUiModel.setProperty(
                            `/selected${sEntity}Id`,
                            oEvent.getParameter("selectedItem")?.getKey() ?? null
                        );
                        oControl.setValueState(
                            oEvent.getParameter("selectedItem")?.getKey()
                                ? sap.ui.core.ValueState.None
                                : sap.ui.core.ValueState.Error
                        );
                        if (cbItemSelected)
                            cbItemSelected(oEvent.getParameter("selectedItem"));
                    });

                    oControl.attachLiveChange((oEvent) => {
                        this.oUiModel.setProperty(`/selected${sEntity}Id`, null);
                        //oControl.setProperty("value", null);
                        oControl.setValueState(sap.ui.core.ValueState.Error);
                    });
                },

                /**
                 * Recursively trespasses all possible controls of the list aPossibleAggregations and sets them
                 * enabled/disabled depending on bEnabled.
                 *
                 * Ignores the controls having ID ending with "RO"
                 *
                 * @param oControl
                 * @param bEnabled
                 */
                setControlsState: function (oControl, bEnabled) {
                    let aPossibleAggregations = [
                            "fixContent",
                            "items",
                            "content",
                            "form",
                            "formContainers",
                            "formElements",
                            "fields",
                        ],
                        aControlAggregation = null,
                        i,
                        j;

                    // only validate controls and elements which have a 'visible' property
                    if (
                        oControl instanceof sap.ui.core.Control ||
                        oControl instanceof sap.ui.layout.form.FormContainer ||
                        oControl instanceof sap.ui.layout.form.FormElement ||
                        oControl instanceof RichTextEditor
                    ) {
                        // only check visible controls
                        if (oControl.getVisible()) {
                            if (oControl instanceof sap.m.ComboBox) {
                                oControl.setShowValueStateMessage(false);
                            }
                            if (oControl.setValueState) {
                                oControl.setValueState("None");
                            }
                            if (oControl.setEnabled) {
                                if (!oControl.getId().endsWith("RO")) {
                                    oControl.setEnabled(bEnabled);
                                }
                            }
                            // in case it is a RichText
                            if (oControl.setEditable) {
                                if (!oControl.getId().endsWith("RO")) {
                                    oControl.setEditable(bEnabled);
                                }
                            }

                            for (i = 0; i < aPossibleAggregations.length; i += 1) {
                                aControlAggregation = oControl.getAggregation(
                                    aPossibleAggregations[i]
                                );
                                if (aControlAggregation) {
                                    // generally, aggregations are of type Array
                                    if (aControlAggregation instanceof Array) {
                                        for (j = 0; j < aControlAggregation.length; j += 1) {
                                            this.setControlsState(aControlAggregation[j], bEnabled);
                                        }
                                    }
                                    // ...however, with sap.ui.layout.form.Form, it is a single object *sigh*
                                    else {
                                        this.setControlsState(aControlAggregation, bEnabled);
                                    }
                                }
                            }
                        }
                    }
                },

            }
        );
    }
);
