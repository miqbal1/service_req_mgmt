sap.ui.controller("service_request_mgmt.srm_detail3", {
	
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf service_request_mgmt.srm_detail3
*/
onInit: function() {
	
	 this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	 var that=this;
	
	 this.oRouter.attachRoutePatternMatched(function(oEvent) {
		 var collectionTaskODataModel = that.getView().getModel('collectionTaskODataModel');
		 var collectionTaskJsonModel  = that.getView().getModel('collectionTaskJsonModel');
			if (oEvent.getParameter("name") === "srm_detail3") {
				
				collectionTaskODataModel.read("/TaskCollection?$orderby=CreatedOn desc&$filter=Status eq 'READY' or Status eq 'RESERVED' or Status eq 'IN_PROGRESS' &$filter=TaskTitle eq " +
						"'SRM Task with Request Number - REQ0000031 and Requestor - rahulb' &$orderby=CreatedOn desc&$format=json", null, null,false,  
			   	            function(oData,oResponse) {
					collectionTaskJsonModel.setData(oData);
					//use formatter insted of loop
					   for(i=0;i<oData.results.length;i++)
					  {
						  getDate=oData.results[i].CreatedOn;
						  var month=getDate.getMonth()+1;
						  var formatDate=getDate.getDate()+"-"+month+"-"+getDate.getFullYear();
						  collectionTaskJsonModel.getData().results[i].CreatedOn=formatDate;
						  collectionTaskJsonModel.refresh();
					  }
					  
			           },  
			           function(oEvent) {
			          alert("An error occurred while reading data.");  
			           }); 
			  
				that.getView().byId("idMyInboxTbl").setModel(collectionTaskJsonModel);
			}
			});

	

},

onPressTaskTitle : function(oEvent) {
	var screenModel=this.getView().getModel('screenBtnJsonModel').getProperty('/data');
	screenModel.isVisible=true;
	this.getView().getModel('screenBtnJsonModel').refresh();
	//var that=this;
	var instanceId=oEvent.getSource().getBindingContext().getObject().InstanceID;
	var tempTaskId=instanceId.split("task-instance%2F");
	var taskTitle=oEvent.getSource().getBindingContext().getObject().TaskTitle;
	console.log(tempTaskId[1]);
	 var taskSvcURL = "http://115.110.70.122:50000/bpmodata/tasks.svc";  
	var taskODataModel = new sap.ui.model.odata.ODataModel(taskSvcURL);
 	var  taskJsonModel= new sap.ui.model.json.JSONModel();
 	this.getView().setModel(taskJsonModel,'taskJsonModel');
	     /*
		 * Claim task before reading
		 */
	 taskODataModel.create("/Claim?InstanceID='"+tempTaskId[1]+"'", null, null,
	            function(oData,oResponse) {  
		 //console.log('claim success');
	        },  
	        function(oError) {
	        	// console.log('claim failed');
	        });   

	   /*
	   * Now fetch Input data
	   */
	
	 
	  var taskDataSvcURL = "http://115.110.70.122:50000/bpmodata/taskdata.svc/"+tempTaskId[1];  
	  var taskDataODataModel = new sap.ui.model.odata.ODataModel(taskDataSvcURL, true); 
	  taskDataODataModel.read("/InputData('"+tempTaskId[1]+"')/DO_SRM",null, null,false,
	  		function(oData,oRes){
		  taskJsonModel.setData(oData);
			        //console.log('data read successfully');
			       
			        taskJsonModel.getData().reqNo
			        },function(oError){
	  			//console.log('error in reading data');
			        });
		//dont use this.setModel bcz its only working in component.js
	     var reqNo=taskJsonModel.getData().reqNo
	    this.getView().setModel(taskDataODataModel,'taskDataODataModel');
        this.oRouter.navTo("srm_detail4",{
		reqID :reqNo
	});
},
	onPressMyInboxTab : function() {
		
	},
	onPressMyInboxBack : function() {
		
		this.oRouter.navTo("srm_master");
		
	},
	
	getValueOfURLParameter : function(parameter){
		 var pairs = window.location.search.substring(1).split("&");
		    for ( var i = 0; i < pairs.length; i++) {
		        var pair = pairs[i].split("=");
		        if (decodeURIComponent(pair[0]) == "taskId") {
		            return decodeURIComponent(pair[1]);
		        }
		    }
		    console.log('Query parameter %s not found', parameter);
	},
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf service_request_mgmt.srm_detail3
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf service_request_mgmt.srm_detail3
*/
	onAfterRendering: function() {
		
	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf service_request_mgmt.srm_detail3
*/
//	onExit: function() {
//
//	}

});