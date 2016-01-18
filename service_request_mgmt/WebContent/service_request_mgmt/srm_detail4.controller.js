sap.ui.controller("service_request_mgmt.srm_detail4", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf service_request_mgmt.srm_detail4
*/
	_idTextArea :"",
	_idTextArea2 :"",
	onInit: function() {
		this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		var that=this;
		this.oRouter.attachRoutePatternMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "srm_detail4") {
				var reqID = oEvent.mParameters.arguments.reqID;
				var readServiceURL="http://115.110.70.122:50000/cwsrm/rest/db/read/"+reqID;
				var getdata = GetData(readServiceURL);
				var obj1=getdata.cwSrmAttachmentDataDtos;
				var oClkReqModel = that.getView().getModel('oClickReqModel');
				oClkReqModel.setData(getdata);
				var objDate = new Date();
				var d = objDate.getDate();
				var m = objDate.getMonth()+1;
				var y = objDate.getFullYear();
				var date= d+"-"+m+"-"+y;
				var hours = objDate.getHours();
				var minutes=objDate.getMinutes();
				var createTime=oClkReqModel.getData().createdOn;
				//string to object
				var data = JSON.parse(createTime);
				console.log(data);
				
				
				currentTimeVal=date+" Time"+hours+":"+minutes;
				
				
				x1=createTime.split("Time");
				//y1=x1[1].split(":");
				createTimehrs=y1[0];
				createTimemin=y1[1];
				
				
				x2=currentTimeVal.split("Time");
				//y2=x2[1].split(":");
				currentTimehrs=y2[0];
				currentTimemin=y2[1];
				
				
				elapsedtimehrs=parseInt(currentTimehrs)-parseInt(createTimehrs);
				elapsedtimemin=parseInt(currentTimemin)-parseInt(createTimemin);
				
				
				
				var elapsed=elapsedtimehrs+":"+elapsedtimemin;
				
				that.getView().byId("idElapsedTime").setText("Time Elapsed: "+elapsed+" hrs");
				
				var sla=oClkReqModel.getData().agreedSla;
				
				 var list =[];
				if(oClkReqModel.getData().cwSrmAttachmentDataDtos!=null)
				{
					
					if(oClkReqModel.getData().cwSrmAttachmentDataDtos instanceof Array)
					{
						list=oClkReqModel.getData().cwSrmAttachmentDataDtos;
					}
					else {
						list =[oClkReqModel.getData().cwSrmAttachmentDataDtos];
					}
					
					
				}
				else if(oClkReqModel.getData().cwSrmAttachmentDataDtos == null)
				{
					list =[];
				}
				 oClkReqModel.getData().cwSrmAttachmentDataDtos =list;
				/*
				 * making attchment dto as array
				 */
				 var list2 =[];
					if(oClkReqModel.getData().cwSrmCommentDataDtos!=null)
					{
						
						if(oClkReqModel.getData().cwSrmCommentDataDtos instanceof Array)
						{
							list2=oClkReqModel.getData().cwSrmCommentDataDtos;
						}
						else {
							list2 =[oClkReqModel.getData().cwSrmCommentDataDtos];
						}
						
						
					}
					else if(oClkReqModel.getData().cwSrmCommentDataDtos == null)
					{
						list2 =[];
					}
				 oClkReqModel.getData().cwSrmCommentDataDtos =list2;
				 oClkReqModel.refresh();
			}
			});
	},
	handleIconTabBarSelect: function (oEvent) {
		
			sKey = oEvent.getParameter("key");
			
		if (sKey === "request") {
			
			
		} else if (sKey === "history") {
			
			this.getView().byId('idMyInboxTbl').setVisible(true);
		} else if (sKey === "attachment") {
			
			this.getView().byId('idMyAttachmentTbl').setVisible(true);
			
		} else {
			
			this.getView().byId('idMyCommentTbl').setVisible(true);
		}
	},
	
	
	onPressAccept : function() {
		if(!this._idTextArea){
			this._idTextArea = sap.ui.xmlfragment("fragments.Reason", this);
			}
		this.getView().addDependent(this._idTextArea);
			this._idTextArea.open();
			
	},
	onPressReject : function() {
		if(!this._idTextArea2){
			this._idTextArea2 = sap.ui.xmlfragment("fragments.Reject", this);
			}
		this.getView().addDependent(this._idTextArea2);
			this._idTextArea2.open();
			
	},
	onPressOk : function(oEvent) {
		   var txtValue;
		   var oClkReqModel =this.getView().getModel('oClickReqModel');
		   var objDate = new Date();
		   var d = objDate.getDate();
		   var m = objDate.getMonth()+1;
		   var y = objDate.getFullYear();
		   var createdOn= d+"-"+m+"-"+y;
		  
		if( this._idTextArea2=="")
			{
			oClkReqModel.getData().currentStatus="Accept";
			txtValue=sap.ui.getCore().byId('idTextArea').getValue();
			}
		else{
			oClkReqModel.getData().currentStatus="Reject";
			txtValue=sap.ui.getCore().byId('idTextArea2').getValue();
		}
		
		 /*var list =[];
			if(oClkReqModel.getData().cwSrmCommentDataDtos!=null)
			{
				
				if(oClkReqModel.getData().cwSrmCommentDataDtos instanceof Array)
				{
					list=oClkReqModel.getData().cwSrmCommentDataDtos;
				}
				else {
					list =[oClkReqModel.getData().cwSrmCommentDataDtos];
				}
				
				
			}
			else if(oClkReqModel.getData().cwSrmCommentDataDtos == null)
			{
				list =[];
			}
			oClkReqModel.getData().cwSrmCommentDataDtos =list;
			oClkReqModel.refresh();*/
			

		
		var gdata = GetData("http://115.110.70.122:50000/cwsrm/rest/ume/loginuser");
		var commentStrcture =  { "commentId" :"", 
            	"comment" : txtValue,
            	"createdOn" : createdOn,
                "createById" : gdata.loggedInUserLogonId,
                "createByName" : gdata.loggedInUserDisplayName 
              };
		oClkReqModel.getData().cwSrmCommentDataDtos.push(commentStrcture);
		
		var createServiceURL="http://115.110.70.122:50000/cwsrm/rest/db/createUpdate";
	    var postdata = PostData(createServiceURL,oClkReqModel.getData());
		this.oRouter.navTo("srm_detail3");
	},
	onPressCancel : function() {
		this._idTextArea.close();
		
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf service_request_mgmt.srm_detail4
*/
	onBeforeRendering: function() {
		
	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf service_request_mgmt.srm_detail4
*/
	onAfterRendering: function() {
		this.getView().byId('idAcceptBtn').setVisible(true);
		this.getView().byId('idRejectBtn').setVisible(true);
	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf service_request_mgmt.srm_detail4
*/
//	onExit: function() {
//
//	}

});