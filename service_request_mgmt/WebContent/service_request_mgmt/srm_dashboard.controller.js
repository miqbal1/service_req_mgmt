sap.ui.controller("service_request_mgmt.srm_dashboard", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf service_request_mgmt.srm_dashboard
*/
	oModel : new sap.ui.model.json.JSONModel(),
	oJSONModel : new sap.ui.model.json.JSONModel(),
	
	onInit: function() {
		this.oModel.loadData('json/dashboardSampleData.json');
		//this.oModel.setData(data);
		this.getView().byId("samplepie").setModel(this.oModel);
		//this.getView().byId("samplepie1").setModel(this.oModel);
		
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf service_request_mgmt.srm_dashboard
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf service_request_mgmt.srm_dashboard
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf service_request_mgmt.srm_dashboard
*/
//	onExit: function() {
//
//	}

});