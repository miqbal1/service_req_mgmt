sap.ui.controller("service_request_mgmt.srm_detail1", {
	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf service_request_mgmt.srm_detail1
	 */
	_idSucessDialog :"",
	_idValidationDialog :"",
	onInit: function() {
		this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		var that=this;
		this.oRouter.attachRoutePatternMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "srm_detail1") {
				var logindata = GetData("http://115.110.70.122:50000/cwsrm/rest/ume/loginuser");
				var loginJsonModel = that.getView().getModel('loginJsonModel');
				loginJsonModel.setData(logindata);
			}
		});
	},
	onPressCreateValidation : function() {
		if(this.getView().byId("idSubjectInput").getValue())
			{
			this.onPressCreate();
			}
		else{
			if(!this._idValidationDialog){
				this._idValidationDialog = sap.ui.xmlfragment("fragments.Validation", this);
				}
			this.getView().addDependent(this._idValidationDialog);
				this._idValidationDialog.open();
				
		}
	},
	onPressValidationDialog : function() {
		this._idValidationDialog.close();	
	},
	onPressCreate : function() {
		var objDate = new Date();
		
		/*
		 * SLA Service
		 */
		
		
		var reqType=this.getView().byId("reqSelect").getSelectedKey();
		var getSla = GetData("http://115.110.70.122:50000/cwsrm/rest/brm/sla/"+reqType);
		//var slaHours=hours+parseInt(getSla);
		
		
		
		var contact=this.getView().byId("contacttextId").getValue();
		var updateContact;
		if(contact=="Iqbal Md")
			{
			updateContact="miqbal";
			}
		else if (contact=="Rohit J") {
			updateContact="jrohit";
		}
		//no conditon match then need to check service
		else{
			updateContact="rahulb";
		}
		
		var subjectVal=this.getView().byId("idSubjectInput").getValue();
		var descVal=this.getView().byId("idDescInput").getValue();
		
		var getTaskOwnerSvcURL="http://115.110.70.122:50000/cwsrm/rest/ume/taskowneruid/HR/"+contact;
		var taskDetail=GetData(getTaskOwnerSvcURL);
	
		
		
		var loginData=this.getView().getModel('loginJsonModel');
		
		data = {
				"agreedSla": getSla,
				"assignedToId": updateContact,
				"assignedToName": taskDetail.userDisplayName,
				"catalogType": this.getView().byId("idCatalogDD").getSelectedKey(),
				"createdOn": ""+objDate,
				"createById": loginData.getData().loggedInUserLogonId,
				"createByName": loginData.getData().loggedInUserDisplayName,
				"currentMilestone": "Test",
				"currentStatus": "Test",
				"externalInstanceId": "Test",
				"hasAttachment": "Y",
				"isExternalProcess": "Y",
				"priority": this.getView().byId("prioritySelect").getSelectedKey(),
				"processURL": "Test",
				"requestId": "",
				"requestType": reqType,
				"serviceType": this.getView().byId("idTypeDD").getSelectedKey(),
				"cwSrmCommentDataDtos":[],
				                        "cwSrmAttachmentDataDtos" :[],
				                        "cwSrmContentDataDtosMap": {
				                            "entry": [
				                                {
				                                    "key": "Subject",
				                                    "value": {
				                                        "contentId": "",
				                                        "dataLabel": "Subject",
				                                        "dataValue": subjectVal
				                                    }
				                                },
				                                {
				                                    "key": "Description",
				                                    "value": {
				                                        "contentId": "",
				                                        "dataLabel": "Description",
				                                        "dataValue": ""
				                                    }
				                                },
				                                {
				                                    "key": "AccountName",
				                                    "value": {
				                                        "contentId": "",
				                                        "dataLabel": "AccountName",
				                                        "dataValue": ""
				                                    }
				                                }
				                            ]
				                        }                        
		};
		var oDocumentsModel = this.getView().getModel('oDocumentsModel');
		var fileData=oDocumentsModel.getData();

		var oModelCreateReq = new sap.ui.model.json.JSONModel();
		oModelCreateReq.setData(data);

		if (fileData) {
			for ( var i = 0; i < fileData.length; i++) {
				
				var tempName=fileData[i].attachName;
				var attName=tempName.split(".");
				oModelCreateReq.oData.cwSrmAttachmentDataDtos.push({
					"attachmentId" : fileData[i].attachmentId,
					"attachmentName" : attName[0],
					"attachmentType" : attName[1],
					"attachmentURL" : fileData[i].attachPath,
					"createdOn" : fileData[i].attachAddedOnDatePicker,
					"createByName" : fileData[i].attachAddedByName,
					"createById" : fileData[i].sectionId
				});
			}
		}


		var createServiceURL="http://115.110.70.122:50000/cwsrm/rest/db/createUpdate";
		var requestNo = Postdata(createServiceURL,oModelCreateReq.getData());

		/*
		 * BPM Start Process
		 */

		var startData = {};
		startData.ProcessStartEvent = {}; 
		var oModel = this.getView().getModel();
		/*
		 * Task Owner Id Service-Note: userLogonId is contact field value from ui
		 */
		
			data ={
				reqNo : requestNo,
				initiatorId : loginData.getData().loggedInUserLogonId,
				taskOwnerUid : taskDetail.taskOwnerUniqueId,
				subject : subjectVal

		};

		startData.ProcessStartEvent.DO_SRM = data;
		var processStartODataModel = this.getView().getModel('processStartODataModel');
		that = this;
		processStartODataModel.create('/StartData', startData, null,  
				function(oData,oResponse) {  
			if(!that._idSucessDialog){
				that._idSucessDialog = sap.ui.xmlfragment("fragments.Success", that);
			}
			that.getView().addDependent(this._idSucessDialog);
			that._idSucessDialog.open();

		},  
		function(oEvent) {

			alert("An error occurred while submitting the data.");  
		});  



	},
	onPressDelete : function(oEvent) {
		this.getView().byId("idMyAttchmentTbl").getModel('oDropDownModel').getData().UploadedFiles={};
		this.getView().getModel('oDropDownModel').refresh();
		
	},
	onPressSuccessDialog : function() {
		this.onPressCancel();
		this._idSucessDialog.close();	
	},
	onPressCreateAnother : function() {
		this.onPressCreateValidation();
		this.getView().byId("reasonSelect").setSelectedItem(new sap.ui.core.Item());
		this.getView().byId("acctextField").setValue("");
		this.getView().byId("idSubjectInput").setValue("");
		this.getView().byId("idDescInput").setValue("");
	},
	onPressCancel : function() {
		this.getView().byId("contacttextId").setValue("");
		this.getView().byId("reqSelect").setSelectedItem(new sap.ui.core.Item());
		this.getView().byId("idCatalogDD").setSelectedItem(new sap.ui.core.Item());
		this.getView().byId("idTypeDD").setSelectedItem(new sap.ui.core.Item());
		this.getView().byId("prioritySelect").setSelectedItem(new sap.ui.core.Item());
		this.getView().byId("reasonSelect").setSelectedItem(new sap.ui.core.Item());
		this.getView().byId("acctextField").setValue("");
		this.getView().byId("idSubjectInput").setValue("");
		this.getView().byId("idDescInput").setValue("");
		this.getView().byId("idMyAttchmentTbl").getModel('oDropDownModel').getData().UploadedFiles={};
		this.getView().getModel('oDropDownModel').refresh();
		
	},
	onChangeReqType : function(oEvent) {

		this.getView().byId("idCatalogDD").setEnabled(true);
		this.getView().byId("reasonSelect").setEnabled(true);
		var bindingContext = this.getView().byId("reqSelect").getSelectedItem().getBindingContext('oDropDownModel');
		var idCatalogDD = this.getView().byId('idCatalogDD');
		idCatalogDD.setBindingContext(bindingContext,'oDropDownModel');
		var idReason = this.getView().byId('reasonSelect');
		idReason.setBindingContext(bindingContext,'oDropDownModel');

	},
	onChangeCatalog : function(oEvent) {
		this.getView().byId("idTypeDD").setEnabled(true);
		var bindingCotext = this.getView().byId("idCatalogDD").getSelectedItem().getBindingContext('oDropDownModel');
		var idTypeDD = this.getView().byId('idTypeDD');
		idTypeDD.setBindingContext(bindingCotext,'oDropDownModel');
	},
	
	handleUploadPress : function(oEvent) {
		var that=this;
		that.fileEcmUpload();


	},
	onPressCreateNewReqBack : function() {
		this.oRouter.navTo("srm_master");

	},

	/*
	 * for uploading file
	 */
	uploadedDatainTable : function(UploadedData) {
		var oDocumentsModel = this.getView().getModel('oDocumentsModel');
		var modelData = oDocumentsModel.getData();
		modelData =modelData.push(UploadedData);
		oDocumentsModel.refresh();
		fUpload=that.getView().byId("fileUploaderACRDoc").getValue();
		var fileType=fUpload.split(".");

		/*
		 * Creating Structure For binding
		 */
		var element = {
				FileName:fileType[0],
				FileType:fileType[1],
				//need to change
				UploadedBy:'Iqbal'
		};

		var aUploadedFiles = this.getView().getModel('oDropDownModel').getProperty('/UploadedFiles');
		/*
		 * sample data file we pushing data which we put as blank
		 */
		aUploadedFiles.push(element);
		/*
		 * if model get new data so we just refreshing our ui by this new data
		 */
		this.getView().byId("fileUploaderACRDoc").setValue("");
		this.getView().getModel('oDropDownModel').refresh();

	},
	fileEcmUpload : function() {
		
		that = this;
		var pageId = this.getView().getId();

		if (document.getElementById(pageId+"--fileUploaderACRDoc-fu")) {
			if (document
					.getElementById(pageId+"--fileUploaderACRDoc-fu").files[0] != null) {
				var file = document
				.getElementById(pageId+"--fileUploaderACRDoc-fu").files[0];
			}
		}
		if(file ==null){
			jQuery.sap.require("sap.m.MessageBox");
			sap.m.MessageBox.show(
					"Please browse a document first", {
						icon: sap.m.MessageBox.Icon.ERROR,
						title: "Error",
						actions: [sap.m.MessageBox.Action.OK],
						onClose: function(oAction) { / * do something * / }
					}
			);
			return;
		}
		if (file.name.length > 255) {
			// sap.ui.getCore().byId("dialogUpload").close();
			//	jQuery.sap.require("sap.ui.commons.MessageBox");
			sap.ui.commons.MessageBox.show(
					"File name too long!!",
					sap.ui.commons.MessageBox.Icon.WARNING,
					"Important Information",
					[ sap.ui.commons.MessageBox.Action.OK ],
					fnCallbackConfirm,
					sap.ui.commons.MessageBox.Action.OK);
			function fnCallbackConfirm() {
			}
			return;
		}
		// validating file size
		if (file && (file.size / 1024 / 1024) > 5) {
			//jQuery.sap.require("sap.ui.commons.MessageBox");
			sap.ui.commons.MessageBox.show(
					"File size more than 5MB is not allowed",
					sap.ui.commons.MessageBox.Icon.WARNING,
					"Important Information",
					[ sap.ui.commons.MessageBox.Action.OK ],
					fnCallbackConfirm,
					sap.ui.commons.MessageBox.Action.OK);


			function fnCallbackConfirm() {

			}
		}
		if (file && window.File && window.FileList
				&& window.FileReader) {

			var reader = new FileReader();
			reader.readAsArrayBuffer(file);

			reader.onload = function(evt) {
				var fileName = file.name;
				var byteArray2 = new Uint8Array(
						evt.target.result);

				var fileEncodedData = window.btoa(that.uint8ToString(byteArray2));
				var UniqueFileId = new Date().getTime();
				//Here we put SRM?
				that.createEcmFile("SRM", UniqueFileId,fileName, fileEncodedData);
			};
		}
	},
	/*
	 * it call inside fileUpload function
	 */
	uint8ToString : function(buf) {
		var i, length, out = '';
		for (i = 0, length = buf.length; i < length; i += 1) {
			out += String.fromCharCode(buf[i]);
		}
		return out;
	},
	parseXmlEntities : function(str) {
		/************ used to parse the xml content before sending it to the service*********/
		if (str) {
			str = str.replace(/&/g, "&amp;").replace(/</g,"&lt;").replace(/>/g, "&gt;").replace(/"/g,"'");
		}
		return str;
	},

	getDateFromTimestamp : function(timestamp) {
		/** getting date from timestamp */
		timestamp = parseInt(timestamp);
		if(timestamp){
			var date = new Date(timestamp);
			var months = new Array("Jan", "Feb", "Mar", "Apr",
					"May", "Jun", "Jul", "Aug", "Sep", "Oct",
					"Nov", "Dec");
			//"May 18, 2015" date formate
			var date1 = date.getDate();

			if (date1 < 10) {
				date1 = "0" + date1;
			}
			var dateFull =  months[date.getMonth()] + ' '  + date1 + ',' + ' ' + date.getFullYear();
			return dateFull;	
		}else{
			return "";
		}

	},
	createEcmFile : function(applicationArea, UniqueFileId,
			fileName, file) {

		/*uploading the file*/
		that=this;
		var soapMessage = '<?xml version="1.0" encoding="utf-8"?>'
			+ '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'
			+ '<SOAP-ENV:Body>'
			+ '<yq1:create xmlns:yq1="http://incture.com/cw/srm/ecm/">'
			+ '<applicationArea>'
			+ applicationArea
			+ '</applicationArea>'
			+ '<objectRefId>'
			+ UniqueFileId
			+ '</objectRefId>'
			+ '<fileName>'
			+ this.parseXmlEntities(fileName)
			+ '</fileName>'
			+ '<file>'
			+ file
			+ '</file>'
			+ '</yq1:create>'
			+ '</SOAP-ENV:Body>'
			+ '</SOAP-ENV:Envelope>';

		var newFile = {};
		$.ajax( {
			//Problem?
			url : "http://115.110.70.122:50000/ManageDocumentsService/ManageDocuments?wsdl",
			type : "POST",
			async : false,
			dataType : "xml",
			data : soapMessage,
			contentType : "text/xml; charset=\"utf-8\"",
			success : function(data, textStatus, jqXHR) {
				xmldoc = jqXHR.responseXML;
				//console.log(xmldoc);
				if (xmldoc.getElementsByTagName('return')[0]
				&& xmldoc.getElementsByTagName('return')[0].childNodes[0]) {

					that.UniqueFileId = UniqueFileId;
					//why you call read service
					that.readEcmFile(applicationArea,UniqueFileId, true,newFile);
					(applicationArea,UniqueFileId, true,newFile);
				}

			},
			error : function(data) {
				//console.log("error in create ecm");
			}
		});
	},

	readEcmFile : function(applicationArea, UniqueFileId,
			getFullContent, newFile) {
		that =this;
		/******************** reading the file back from backend*****************************/

//		$(document).ready(function() {

		var soapMessage = '<?xml version="1.0" encoding="utf-8"?>'
			+ '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'
			+ '<SOAP-ENV:Body>'
			+ '<yq1:read xmlns:yq1="http://incture.com/cw/srm/ecm/">'
			+ '<applicationArea>'
			+ applicationArea
			+ '</applicationArea>'
			+ '<objectReferenceId>'
			+ UniqueFileId
			+ '</objectReferenceId>'
			+ '<getFullContent>'
			+ getFullContent
			+ '</getFullContent>'
			+ '</yq1:read>'
			+ '</SOAP-ENV:Body>'
			+ '</SOAP-ENV:Envelope>';

		$.ajax( {

			url : "http://115.110.70.122:50000/ManageDocumentsService/ManageDocuments?wsdl",
			type : "POST",
			// async: false,
			dataType : "xml",
			data : soapMessage,
			contentType : "text/xml; charset=\"utf-8\"",
			success : function(	data,textStatus,jqXHR) {

				var xmldoc = jqXHR.responseXML;
				console.log(xmldoc);

				if (xmldoc.getElementsByTagName('fullContent')[0]
				&& xmldoc.getElementsByTagName('fullContent')[0].childNodes[0]) {

					var FileContent = xmldoc.getElementsByTagName('fullContent')[0].childNodes[0].nodeValue;

					xmldoc.getElementsByTagName('id')[0].childNodes[0].nodeValue;

					xmldoc.getElementsByTagName('objectReferenceId')[0].childNodes[0].nodeValue;

					var newFileName;
					var newFileURL;

					if (xmldoc.getElementsByTagName('name')[0]
					&& xmldoc.getElementsByTagName('name')[0].childNodes[0]) {

						newFileName = xmldoc.getElementsByTagName('name')[0].childNodes[0].nodeValue;

						$("a#linkDoc_" + UniqueFileId).text(
								xmldoc.getElementsByTagName('name')[0].childNodes[0].nodeValue);

						if ($("a#linkDoc_" + UniqueFileId).length > 0) {

							var fileNam = xmldoc.getElementsByTagName('name')[0].childNodes[0].nodeValue;
							$("a#linkDoc_"+ UniqueFileId).prop("download",fileNam);
						}
					}

					// convert server-url to file blob url
					var u8_2 = new Uint8Array(atob(FileContent).split("").map(function(c) {
						return c.charCodeAt(0);
					}));

					var blob = new Blob([ u8_2 ]);

					if (xmldoc.getElementsByTagName('url')[0]
					&& xmldoc.getElementsByTagName('url')[0].childNodes[0]) {
						newFileURL = xmldoc.getElementsByTagName('url')[0].childNodes[0].nodeValue;

						var d = new Date();
						// start
						var currentDate = d.getTime();

						var date = that.getDateFromTimestamp(currentDate);
						var loginData=that.getView().getModel('loginJsonModel');
						newFile.attachAddedByLogonId = loginData.getData().loggedInUserLogonId;
						newFile.attachAddedByName = loginData.getData().loggedInUserDisplayName;
//							newFile.attachSNo = 1;
//							newFile.attachAddedByUId = loginUserDetail.loggedInUserUniqueId;
							newFile.attachAddedOnDate = currentDate;

						newFile.attachAddedOnDatePicker = date;

						newFile.attachName = newFileName;
						newFile.attachPath = newFileURL;
						newFile.attachUid = UniqueFileId;
						newFile.sectionId = "1";
						newFile.attachmentId = currentDate;
						//console.log(newFile);
						that.uploadedDatainTable(newFile);
					}
				}
			},
			error : function(data) {
				console.log("error in read ecm");

			},

			complete : function(data) {
				//console.log("Complete");
			}
		});
		// put all your jQuery document ready.
//		});

	},



	onFileRemove:function(){
		var table = this.getView().byId('idDocTable');
		var item = table.getSelectedItem();
		if(item == null){
			jQuery.sap.require("sap.m.MessageBox");
			sap.m.MessageBox.show(
					"Please select one document", {
						icon: sap.m.MessageBox.Icon.ERROR,
						title: "Error",
						actions: [sap.m.MessageBox.Action.OK],
						onClose: function(oAction) { / * do something * / }
					}
			);
			return;
		}
		else{
			var index = item.getBindingContextPath().split("/")[2];
			var acrAttachDtosData = table.getModel('oDocumentsModel').getData().acrAttachDtos;
			acrAttachDtosData.splice(index, 1);

			if (acrAttachDtosData.length > 0) {
				for ( var int = 0; int < acrAttachDtosData.length; int++) {
					acrAttachDtosData[int].attachSNo = (int + 1);
				}
			}
			table.getModel('oDocumentsModel').checkUpdate();
		}
	},

	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 * @memberOf service_request_mgmt.srm_detail1
	 */
	onBeforeRendering: function() {
		//alert("onBeforeRendering-detail1")

	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf service_request_mgmt.srm_detail1
	 */
	onAfterRendering: function() {
		this.getView().byId('reqSelect').setSelectedItem(new sap.ui.core.Item());
		this.getView().byId('idCatalogDD').setSelectedItem(new sap.ui.core.Item());
		this.getView().byId('idTypeDD').setSelectedItem(new sap.ui.core.Item());
		this.getView().byId('prioritySelect').setSelectedItem(new sap.ui.core.Item());

		this.getView().byId('reasonSelect').setSelectedItem(new sap.ui.core.Item());

		var that = this;
		var model2 = this.getView().getModel('model2');
		//that.getView().byId("idMyRequestTbl").setModel(model2);

	},

	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * @memberOf service_request_mgmt.srm_detail1
	 */
//	onExit: function() {

//	}

});