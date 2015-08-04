'use strict';
angular
    .module('vkApp')
    .directive('tasks', function($translate) {
        return {
            restrict: 'C',
            replace: true,
            transclude: true,
            controller: showTasksModal,
            scope: { entityId: '@', entityType: '@', type: '@', isCollapsed : '@'},
            template: '<a class="gridIcon" ng-click="presentTasks();"  title="Show Tasks"><i class="icon-ok-sign"></i></a>'
        };
        function showTasksModal
			(
            $scope,
            $log,
            TasksById,
            createDialog
            )
		{
            $scope.action='';
            $scope.letterLimit = 10;
            $scope.parts ='';

            $scope.presentTasks = function() {
                TasksById.read({
                    'entityId': $scope.entityId,
                    'entityType': $scope.entityType,
                    'type': $scope.type
                }, function (json) {
                    $log.log('present tasks: ', json);
                    $scope.tasks = json;
                    createDialog('/VKWebApp/partials/tasksbyid.html',{
                        id : 'taskDialog',
                        title: 'Task Details',
                        backdrop: true,
                        controller: 'showTasks'
                    },{
                        data : $scope.tasks,
                        entityId : $scope.entityId,
                        entityType : $scope.entityType,
                        type: $scope.type,
                        isCollapsed: $scope.isCollapsed
                    });
                });
            }
	    }
    })
    .controller('showTasks', function (
        $scope,
        data,
        isCollapsed,
        type,
        entityId,
        entityType,
        TaskStatus,
        TaskAddById,
        AllUsers
        ) {
        var selfObj = $scope;
        $scope.data = data;
        $scope.entityId = entityId;
        $scope.entityType = entityType;
        $scope.type = type;
        $scope.allUsers = AllUsers.read();
        $scope.task = {};
        $scope.isCollapsed = (isCollapsed === "true") ? true : false;
        $scope.toggleIcon = function(){
			$(".taskModal i").toggleClass('icon-plus-sign');
			$(".taskModal i").toggleClass('icon-minus-sign');
		}
        $scope.populateData = function(taskid){
            var collapseEle = $(".taskModal div[collapse]");
            var height = collapseEle.height();
            for (var i=0; i< $scope.data.length; i++){
                if ($scope.data[i].id == taskid){
                    $scope.action = 'update';
                    $scope.task = $scope.data[i];
                    return;
                }
            }
        };
     
        $scope.removeTask = function(row){
            var index = $scope.tasks.indexOf(row.entity);
            $scope.gridOptions.selectItem(index, false);
            $scope.tasks.splice(index, 1);
        };

        $scope.closeTask = function(taskId){
            TaskStatus.update({
                'status': 'closed',
                'taskId': taskId
            }, function (json) {
            });
        };

        $scope.addTask = function(){
            $scope.task.type = $scope.type;
            $scope.task.entityId = $scope.entityId;
            $scope.task.entityType = $scope.entityType;
            $scope.task.status = 'o';
            $scope.task.showToOwner = true;
            
            TaskAddById.create($scope.task, function (json)
			{
                var output = json.response.status;
                if (output == "Success") {
                    $scope.data = json.response.result;
                }
            });

            $('table td:first').focus();
			$scope.reset();
        };
        $scope.reset = function(){
			$scope.task = {};
            $scope.toggleIcon();
        };
    })

    .directive('notes', function($translate) {
        return {
            restrict: 'C',
            replace: true,
            transclude: true,
            scope: { entityId: '@', entityType: '@', type: '@', isCollapsed : '@'},
            controller: showActionRemarksModal,
            template: '<a class="gridIcon" ng-click="presentActionRemarks()" title="Show Notes"><i class="icon-ok-sign"></i></a>'
        };
        function showActionRemarksModal ($scope, $log, TasksById, createDialog) {
            $scope.letterLimit = 10;
            $scope.parts ='';

            $scope.presentActionRemarks = function() {
                /*if (!$('body').find('div.modal').hasClass('in')) {*/
            	
            	TasksById.read({
                    'entityId': $scope.entityId,
                    'entityType': $scope.entityType,
                    'type': 'action' || 'remark' 
                },
				function (json)
				{
                    $log.log('present action remarks: ', json);
                    $scope.actionremarks = json;
                    createDialog('/VKWebApp/partials/actionsremarksbyvalveid.html',
					{
                        id : 'arDialog',
                        title: 'Action/Remarks Details',
                        backdrop: true,
                        controller: 'showActionRemarks'
                        //success: {label: 'Yay',fn: function(){console.log('Successfully closed modal');}}
                    }
				   ,{
                        data : $scope.actionremarks,
                        entityId : $scope.entityId,
                        entityType : $scope.entityType,
                        type: $scope.type,
                        isCollapsed: $scope.isCollapsed
                    });
                });
            }
        }
    })
    .controller('showActionRemarks',function (
        $scope,
        data,
        isCollapsed,
        entityId,
        entityType,
        type,
        TaskAddById
        )
	{
        $scope.data = data;
        $scope.ar = {};
        $scope.isCollapsed = (isCollapsed === "true") ? true : false;
 		$scope.toggleIcon = function(){
			$(".actionremarksModal i").toggleClass('icon-plus-sign');
			$(".actionremarksModal i").toggleClass('icon-minus-sign');
		}
        $scope.addAR = function(ar){
            ar.status = 'o';
			ar.showToOwner = false
            ar.entityType = entityType;
            ar.entityId = entityId;

            TaskAddById.create(ar, function (json) {
                var output = json.response.status;
                if (output == "Success") {
                    $scope.data = json.response.result;
                }
            });
			$('#taskGrid td:first').focus();
			$scope.reset();
        };

		$scope.populateData = function(taskid){
			for (var i=0; i< $scope.data.length; i++){
				if ($scope.data[i].id == taskid){
                	$scope.action = 'update';
					$scope.ar = $scope.data[i];
					return;
				}
			}
		};

        $scope.reset = function()
		{
            $scope.ar = {}
            $scope.toggleIcon();
        };
    })

	/***** Carousel *******/

    .directive('photos', function($translate) {
        return {
            restrict: 'C',
            replace: true,
            transclude: true,
            scope: { entityId: '@', entityType: '@', type: '@' },
            controller: showPhotoModal,
            template: '<a class="gridIcon" ng-click="presentPhotos()" title="Show Photos"><i class="icon-camera"></i></a>'
        };
        function showPhotoModal($scope, GenericsByRepair, createDialog) {
            $scope.presentPhotos = function() {
                GenericsByRepair.read({'entityId': $scope.entityId,'entityType': $scope.entityType, 'fileType':'IMAGE'}, function (json)
				{
                    //$scope.images = json.response.result;
                    var data = json.response.result;
                    $scope.slides= data;

                    createDialog('/VKWebApp/partials/imagebyid.html',
					{
                        id : 'imageDialog',
                        title: 'Images',
                        backdrop: true,
                        controller: 'showPhotos'
                        //success: {label: 'Ok',fn: function(){console.log('Successfully closed modal');}}
                    },
					{
                        data : $scope.slides,
                        id : $scope.entityId,
                        entity : $scope.entityType
                    });

                });
            }
        }
    })
   .controller('showPhotos', function (
        $scope,
        data,
        id,
        entity,
        AddAttachment
        )
	{
        $scope.slides = data;
        $scope.ok = function () {
            $modalInstance.close(false);
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        $scope.setFiles = function(element)
		{
           $scope.$apply(function(scope)
		   {
		       // Turn the FileList object into an array
                scope.files = [];
                for (var i = 0; i < element.files.length; i++) {
                    scope.files.push(element.files[i]);
                }
                scope.progressVisible = false
            });
        };

        $scope.uploadFile = function(files) {
            var generic = new FormData();
            //Take the first selected file
            for (var i in $scope.files) {
                generic.append("file", $scope.files[i]);
            }

            generic.append("upload.entityType",entity);
            generic.append("upload.entityId",id);
            generic.append("upload.comments",'test');
            generic.append("upload.tagName",'test');
            generic.append("upload.fileType",'IMAGE');

            AddAttachment.create(generic, function (json)
			{
                var output = json.response.status;
                if (output == "Success"){
                	 $scope.uploadStatus ="File upload is done"
                    $scope.slides = json.response.result;
                }
            });

			$('table td:first').focus();
        };

        $scope.direction = 'left';
        $scope.currentIndex = 0;
        $scope.setCurrentSlideIndex = function (index) {
            $scope.direction = (index > $scope.currentIndex) ? 'left' : 'right';
            $scope.currentIndex = index;
        };

        $scope.isCurrentSlideIndex = function (index) {
            return $scope.currentIndex === index;
        };

        $scope.prevSlide = function () {
            $scope.direction = 'left';
            $scope.currentIndex = ($scope.currentIndex < $scope.slides.length - 1) ? ++$scope.currentIndex : 0;
        };

        $scope.nextSlide = function () {
            $scope.direction = 'right';
            $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.slides.length - 1;
        };
    })

    .animation('.slide-animation', function () {
        return {
            addClass: function (element, className, done) {
                var scope = element.scope();

                if (className == 'ng-hide') {
                    var finishPoint = element.parent().width();
                    if(scope.direction !== 'right') {
                        finishPoint = -finishPoint;
                    }
                    TweenMax.to(element, 0.5, {left: finishPoint, onComplete: done });
                }
                else {
                    done();
                }
            },
            removeClass: function (element, className, done) {
                var scope = element.scope();

                if (className == 'ng-hide') {
                    element.removeClass('ng-hide');

                    var startPoint = element.parent().width();
                    if(scope.direction === 'right') {
                        startPoint = -startPoint;
                    }

                    TweenMax.set(element, { left: startPoint });
                    TweenMax.to(element, 0.5, {left: 0, onComplete: done });
                }
                else {
                    done();
                }
            }
        };
    })
	.directive('parts', function($translate) {

		return {
			restrict: 'C',
			scope: { entityId: '@'},
			controller: showPartsModal,
			template: '<a ng-click="presentParts()" style="color:#313337" class="gridIcon" title="Show Parts"><i class="icon-wrench"></i></a>'
		};
		function showPartsModal ($scope, $element, $modal, PartsByRepairId, createDialog) {
			$scope.letterLimit = 10;
			$scope.parts = {
                repairId : ""
            };

			$scope.presentParts = function() {
				PartsByRepairId.read({'repairId': $scope.entityId}, function (json) {
					$scope.parts = json.response.result;

					createDialog('/VKWebApp/partials/partsbyrepairid.html',{
						id : 'partsDialog',
						title: 'Parts Details',
						backdrop: true,
						controller: 'showParts',
					},{
						data : $scope.parts,
						id : $scope.entityId,
						entity : 'repair'
					});
				});

			}
		};
	})
	.controller('showParts', function ($scope, data, id, entity, AddParts) {
 		$scope.data = data;

		$scope.toggleIcon = function(){
			$(".taskModal i").toggleClass('icon-plus-sign');
			$(".taskModal i").toggleClass('icon-minus-sign');
		}
		$scope.partsgridOptions = { data: 'data' ,
			multiSelect: false,
			columnDefs: [
                {field:'partDate', displayName: 'Date'},
				{field:'partName', displayName: 'Name'},
				{field:'partNumber', displayName:'Part Number'},
				{field:'', displayName:'Work Performed'},
				{field:'recommendations', displayName:'Recommendation'},
				{field:'extendedCost', displayName:'Extended Cost'},
                {field:'extendedPrice', displayName:'Extended Price'}]
		}
        $scope.addParts = function(parts){
            parts.repairId = id;

            AddParts.create(part, function (json) {
                var output = json.response.status;  
                if (output == "Success") {
                    $scope.data = json.response.result;
                    $scope.reset();
                }
            });
        }
        $scope.reset = function(){
            $('#partName').val('');
            $('#partNumber').val('');
            $('#quantity').val('');
            $('#cost').val('');
            $('#recommendation').val('');
            $('#status').val('');
        }
		 
	})
    .directive('attachments', function($translate) {
        return {
            restrict: 'C',
            replace: true,
            transclude: true,
            scope: { entityId: '@', entityType: '@', type: '@' },
            controller: showDocsModal,
            template: '<a ng-click="presentAttachments()" class="gridIcon" title="Show Attachments"><i class="icon-paper-clip"></i></a>'
        };
        function showDocsModal($scope, GenericsByRepair, createDialog)
		{       $scope.presentAttachments = function() {
                GenericsByRepair.read({
                	'entityId': $scope.entityId,
                	'entityType': $scope.entityType,
                    'fileType':'DOCS'
                }, function (json)
				{
					var data = json.response.result;
                    $scope.data= data;

                    createDialog('/VKWebApp/partials/docsbyid.html',{
                        id : 'imageDialog',
                        title: 'Attachments',
                        backdrop: true,
                        controller: 'showAttachments'
                        //success: {label: 'Ok',fn: function(){console.log('Successfully closed modal');}}
                    },{
                        data : $scope.data,
                        entity : $scope.entityType,
                        id : $scope.entityId
                    });
                });
            }
        }
    })

    .controller('showAttachments', function (
        $scope,
        $translate,
        data,
        entity,
        id,
        AddAttachment,
        GE
        )
	{
        $scope.isCollapsedAR = true;
        $scope.data = data;
        $scope.docsgridOptions = {
            data: 'data' ,
            multiSelect: false,
            columnDefs: [
             {field:'fileName', displayName:'Name', cellTemplate:'<div><a target="new" href="'+GE.serviceUrl+'attachment/getAttachmentById?attachmentId={{row.entity.id}}">{{row.getProperty(col.field)}}</a>'},
             {field:'comments', displayName:'Comments'},
             {field:'updated',displayName: 'Updated On'}]
        };

        $scope.setFiles = function(element) {

            $scope.$apply(function(scope) {

                // Turn the FileList object into an Array
                scope.files = [];
                for (var i = 0; i < element.files.length; i++) {
                    scope.files.push(element.files[i]);
                }
                scope.progressVisible = false
            });
        };

        $scope.uploadFile = function(files) {
            var generic = new FormData();
            //Take the first selected file
            for (var i in $scope.files) {
                generic.append("file", $scope.files[i]);
            }
            generic.append("upload.entityId",id);
            generic.append("upload.entityType",entity);
            generic.append("upload.comments",'test');
            generic.append("upload.tagName",'test');
            generic.append("upload.fileType",'DOCS');

            AddAttachment.create(generic, function (json) {
                var output = json.response.status;
                if (output == "Success"){
					$scope.data = json.response.result;
					$scope.uploadStatus ="File upload is done"
                    $scope.slides = json.response.result;
                }
            });
        };
    })
	.directive('repairs', function($translate){
        return {
            restrict: 'C',
            replace: true,
            transclude: true,
            scope: { entityId: '@', entityType: '@', type: '@', entityValvetypeid: '@', entityValvesubtypeid:'@' },
            controller: addRepairs,
            template: '<a ng-click="gotoRepairs()"  class="gridIcon" title="Add Repair"><i class="icon-wrench"></i></a>'
        };

        function addRepairs($scope, $log, $location){
            var obj = $scope;
            obj.gotoRepairs = function(){
                $location.path('/repair/'+this.entityId +'/' +this.entityValvetypeid +'/'+this.entityValvesubtypeid );
            }
        }

    })
;

