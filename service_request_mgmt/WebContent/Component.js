jQuery.sap.declare('sap.ui.demo.Component');
sap.ui.core.UIComponent.extend('sap.ui.demo.Component', {
	metadata : {
		routing : {
			config: {
				viewType: "XML",
				viewPath: "service_request_mgmt",
				targetAggregation: "pages",
				clearTarget: false
			},
			routes: [
				{
					viewType: "XML",
					pattern: "",
					name: "srm_master",
					view: "srm_master",
					targetControl: "SplitAppDemo",
					targetAggregation: "masterPages",
						subroutes : [
						             {
											viewType: "XML",
											pattern: "srm_dashboard",
											name: "srm_dashboard",
											view: "srm_dashboard",
											targetAggregation: "detailPages"

									},
						{
							viewType: "XML",
							pattern: "srm_detail1",
							name: "srm_detail1",
							view: "srm_detail1",
							targetAggregation: "detailPages"

						},
						
						{
							viewType: "XML",
							pattern: "srm_detail2",
							name: "srm_detail2",
							view: "srm_detail2",
							targetAggregation: "detailPages"

						},
						{
							viewType: "XML",
							pattern: "srm_detail3",
							name: "srm_detail3",
							view: "srm_detail3",
							targetAggregation: "detailPages"

						},
						{
							viewType: "XML",
							pattern: "srm_detail4/{reqID}",
							name: "srm_detail4",
							view: "srm_detail4",
							targetAggregation: "detailPages"

						}
						]
					
			    }]
			
		}
	},
	init : function() {
	     jQuery.sap.require("sap.m.routing.RouteMatchedHandler");
		 var oModel = new sap.ui.model.json.JSONModel();
		 oModel.loadData("json/sampleData.json",null,false);
		 this.setModel(oModel,'oDropDownModel');
		 
      var myRequestJsonModel = new sap.ui.model.json.JSONModel();
      this.setModel(myRequestJsonModel,'myRequestJsonModel');
      
      
      var loginJsonModel = new sap.ui.model.json.JSONModel();
      this.setModel(loginJsonModel,'loginJsonModel');
   
	 var oClickReqModel = new sap.ui.model.json.JSONModel();
	 this.setModel(oClickReqModel,'oClickReqModel');

   
 var tasksSvcURL = "http://115.110.70.122:50000/bpmodata/tasks.svc";  
 var tasksODataModel = new sap.ui.model.odata.ODataModel(tasksSvcURL, false);

  var taskId = getValueOfURLParameter("taskId"); 
  //if(taskId == '-1'){
	     /*
		 * Starting bpm process configuration
		 */
        var startProcessSvcURL = "http://115.110.70.122:50000/bpmodata/startprocess.svc/com.incture/srm~bpm/SRM_Process/"; 
		var processStartODataModel = new sap.ui.model.odata.ODataModel(startProcessSvcURL, true);
		this.setModel(processStartODataModel,'processStartODataModel');
		var edmMetadata = processStartODataModel.getServiceMetadata();  
		var PurchaseOrderDetailsEntity = createEntityForEntityType(edmMetadata, "DO_SRM");
  //}

		 /*
		  * for screen UI control
		  */
		 var screenBtnData = {
				 "data" :  {"isVisible" : false}
        };
		 var screenBtnJsonModel = new sap.ui.model.json.JSONModel();
		 screenBtnJsonModel.setData(screenBtnData);
		 this.setModel(screenBtnJsonModel,'screenBtnJsonModel');
	

    var collectionTaskODataModel = new sap.ui.model.odata.ODataModel(tasksSvcURL, true);
	this.setModel(collectionTaskODataModel,'collectionTaskODataModel');
	
	var  collectionTaskJsonModel= new sap.ui.model.json.JSONModel();
	this.setModel(collectionTaskJsonModel,'collectionTaskJsonModel');
	
	/*
	 * For ecm upload
	 */
	var  oDocumentsModel= new sap.ui.model.json.JSONModel([]);
	this.setModel(oDocumentsModel,'oDocumentsModel');
	 /*
	  * Router remaining 
	  */
	   sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
		var router = this.getRouter();
		this.routeHandler = new sap.m.routing.RouteMatchedHandler(router);
		router.initialize();

	},
	createContent : function() {
		
		var oView = sap.ui.view({
			viewName : "service_request_mgmt.App",
			type : "XML"
		})
		return oView;
	},
	generateRandomNo : function(min,max){
		var prefix = ""+new Date().getFullYear()+new Date().getMonth()+new Date().getDate()+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds();
		 return prefix + parseInt(Math.random() * (max - min) + min);
	}

});

/**
 * Creates JSON entity for the entity type with entityTypeName name 
 * using the EDM metadata that is specified as edmMetadata parameter.
 */
createEntityForEntityType = function(edmMetadata, entityTypeName) {
	//**********************************************
	var edmSchema = edmMetadata.dataServices.schema[0];
	var entityType = getEntityTypeByName(edmSchema, entityTypeName);
	return createEntity(edmSchema, entityType);
},

/**
 * Returns object representation of EDM entity type with entityTypeName name using the specified edmSchema.
 */
getEntityTypeByName = function(edmSchema, entityTypeName) {
	for(var i = 0; i < edmSchema.entityType.length; i++) {
		var entityType = edmSchema.entityType[i];
		if(entityTypeName == entityType.name) {
			return entityType;                			
		}
	}
	
	throw "There is no entity type with name: " + entityTypeName;
},

/**
 * Creates JSON entity for the object representation of the EDM entity type specified as entityType parameter.
 */
createEntity = function(edmSchema, entityType) {
	var entity = {};
	
	addProperties(entityType, entity);
	addNavigationProperties(entityType, edmSchema, entity);	
	
	return entity;
},

/**
 * Creates primitive properties in the entity based on primitive properties of the entityType.
 */
addProperties = function(entityType, entity) {
	for (var i = 0; i < entityType.property.length; i++) {
		var property = entityType.property[i];
		var propertyName = property.name;
		
		// do not include EDM keys because they should neither be used for UI bindings 
		// nor be sent to the OData service 
		if("EDM_Key" != propertyName) {
			entity[propertyName] = null;
		}
	}
},

/**
 * Creates nested properties in the entity based on navigation properties of the entityType.
 */
addNavigationProperties = function(entityType, edmSchema, entity) {
	if(!entityType.navigationProperty) {
		return;
	}
	
	for (var i = 0; i < entityType.navigationProperty.length; i++) {
		var navigationProperty = entityType.navigationProperty[i];
		var navPropertyName = navigationProperty.name;									
		var navigationMultiplicity = getNavigationMultiplicity(edmSchema, navigationProperty);
		
		if("*" == navigationMultiplicity) {
			// set empty results[] array for multi-valued nested property
			var results = {};
			results["results"] = [];
			entity[navPropertyName] = results;				
		} else {
			// create JSON entity for the entity type to which the navigation property points
			// and set it as the value of the nested property
			var navPropertyEntityType = getEntityTypeForNavProperty(edmSchema, navigationProperty);
			var navPropertyEntity = createEntity(edmSchema, navPropertyEntityType);
			entity[navPropertyName] = navPropertyEntity;
		}
	}	
},

/**
 * Returns object representation of entity type for the specified navigationProperty. 
 */
getEntityTypeForNavProperty = function(edmSchema, navigationProperty) {
	var association = getAssociationForNavProperty(edmSchema, navigationProperty);
	
	var fullQualifiedTypeName = association.end[1].type;
	var namespaceDelimiter = fullQualifiedTypeName.indexOf(".");
	var entityTypeName = fullQualifiedTypeName.substring(namespaceDelimiter + 1);
	
	return getEntityTypeByName(edmSchema, entityTypeName);
},

/**
 * Returns multiplicity of the specified navigationProperty. 
 */
getNavigationMultiplicity = function(edmSchema, navigationProperty) {	
	var association = getAssociationForNavProperty(edmSchema, navigationProperty);
	
	// multiplicity of a navigation property is the multiplicity
	// of the second end of its association
	return association.end[1].multiplicity;
},

/**
 * Returns name of the association that is defined for the specified navigationProperty.
 */
getAssociationName = function(navigationProperty) {
	var navigationAssociation = navigationProperty.relationship;
	var namespaceDelimiter = navigationAssociation.indexOf(".");
	return navigationAssociation.substring(namespaceDelimiter + 1);
},



getValueOfURLParameter = function(parameter){
	 var pairs = window.location.search.substring(1).split("&");
	    for ( var i = 0; i < pairs.length; i++) {
	        var pair = pairs[i].split("=");
	        if (decodeURIComponent(pair[0]) == "taskId") {
	            return decodeURIComponent(pair[1]);
	        }
	    }
	   //console.log("dont have task id in url");
	   return "-1";
},


/**
 * Returns object representation of the association for the navigationProperty. 
 */
getAssociationForNavProperty = function(edmSchema, navigationProperty) {
	var associationName = getAssociationName(navigationProperty);
	
	for(var i = 0; edmSchema.association.length; i++) {
		var association = edmSchema.association[i];
		if(associationName == association.name) {			
			return association;               			
		}
	}
	
	throw "There is no association with name: " + associationName; 
};
