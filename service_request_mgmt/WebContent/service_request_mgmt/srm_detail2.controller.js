sap.ui.controller("service_request_mgmt.srm_detail2", {

	onInit: function() {
		 this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		 var that=this;
		 this.oRouter.attachRoutePatternMatched(function(oEvent) {
				
				if (oEvent.getParameter("name") === "srm_detail2") {
				    var myRequestJsonModel = that.getView().getModel('myRequestJsonModel');
				    var myReqServiceURL="http://115.110.70.122:50000/cwsrm/rest/db/myRequests";
				    var gdata = GetData(myReqServiceURL);
				    myRequestJsonModel.setData(gdata);
					 var list =[];
						if(myRequestJsonModel.getData().cwSrmRequestDataDtos!=null)
						{
							
							if(myRequestJsonModel.getData().cwSrmRequestDataDtos instanceof Array)
							{
								list=myRequestJsonModel.getData().cwSrmRequestDataDtos;
							}
							else {
								list =[myRequestJsonModel.getData().cwSrmRequestDataDtos];
							}
							
							
						}
						else if(myRequestJsonModel.getData().cwSrmRequestDataDtos == null)
						{
							list =[];
						}
						myRequestJsonModel.getData().cwSrmRequestDataDtos =list;
						myRequestJsonModel.refresh();
						that.getView().byId("idMyRequestTbl").setModel(myRequestJsonModel);
				}
				});
		
	},
	
	onPressRequestId : function(oEvent) {
		
		var screenModel=this.getView().getModel('screenBtnJsonModel').getProperty('/data');
		screenModel.isVisible=false;
		this.getView().getModel('screenBtnJsonModel').refresh();
		var reqId=oEvent.oSource.mProperties.text;
		this.oRouter.navTo("srm_detail4",{
			reqID :reqId
		});
		
	},
fnFormatDate : function(createdOn) {
		var myRequestJsonModel = this.getView().getModel('myRequestJsonModel');
		var size=myRequestJsonModel.getData().cwSrmRequestDataDtos.length;
		for(i=0;i<size;i++)
		{
			var date=myRequestJsonModel.getData().cwSrmRequestDataDtos[i].createdOn;
			var myDate=new Date(date);
			var d = myDate.getDate();
			var m = myDate.getMonth()+1;
			var y = myDate.getFullYear();
			createdOn= d+"-"+m+"-"+y;
			
		}
		return createdOn;
	},
	
		
	 

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf service_request_mgmt.srm_detail2
*/
	onPressMyReqBack : function() {
		alert("from back");
		this.oRouter.navTo("srm_master");
		
	},

	onBeforeRendering: function() {
		var that = this;
		 var model2 = this.getView().getModel('model2');
			that.getView().byId("idMyRequestTbl").setModel(model2);
	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf service_request_mgmt.srm_detail2
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf service_request_mgmt.srm_detail2
*/
//	onExit: function() {
//
//	}

});