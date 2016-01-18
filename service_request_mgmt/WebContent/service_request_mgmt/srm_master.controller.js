sap.ui.controller("service_request_mgmt.srm_master", {
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf service_request_mgmt.srm_master
*/
	onInit: function() {
		this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		//that = this;
		this.oRouter.navTo("srm_dashboard");
},

onPressGoToCreateNewReq : function() {
	
	this.oRouter.navTo("srm_detail1");
},

onPressGoToMyReq : function() {
	
	this.oRouter.navTo("srm_detail2");
},
onPressGoToMyInbox : function() {
	
	this.oRouter.navTo("srm_detail3");
},
onPressGoToDashboard : function() {
	this.oRouter.navTo("srm_dashboard");
},

onPressBack : function() {
	//this.getSplitAppObj().backDetail();
	
},

/*getSplitAppObj : function() {
	var result = this.byId("SplitAppDemo");
	if (!result) {
		jQuery.sap.log.info("SplitApp object can't be found");
	}
	return result;
},*/
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf service_request_mgmt.srm_master
*/
//	onBeforeRendering: function() {
//
//	},
	
	

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf service_request_mgmt.srm_master
*/
/*	onAfterRendering: function() {
		
	},*/

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf service_request_mgmt.srm_master
*/
//	onExit: function() {
//
//	}
onItemPress:function(oEvent){
	var that=this;
	var title=oEvent.getParameter("listItem").getTitle();
	if (title=="Create New Request") {
		that.onPressGoToCreateNewReq();
	} else if (title=="My Request") {
		that.onPressGoToMyReq();
	}
	else if (title=="Dashboard") {
		that.onPressGoToDashboard();
	}
	else{
		that.onPressGoToMyInbox();
	}
	
}

});