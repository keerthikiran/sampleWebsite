'use strict';

angular.module('vkApp')
  .factory('AllowedFields', function($resource, GE) {
    var serviceUrl = GE.serviceUrl + 'grid/getAllowedGridFields';
    //var serviceUrl = 'stub/allowedgridfields.json';
      return $resource(serviceUrl, {}, {
          'read' : {
            method: 'GET'
          }
      });
  })
  .factory('CustomSearchFields', function($resource, GE) {
    var serviceUrl = GE.serviceUrl + 'grid/getCustomSearchGridFields';
    //var serviceUrl = 'stub/allowedgridfields.json';
      return $resource(serviceUrl, {}, {
          'read' : {
            method: 'GET'
          }
      });
  })
  .factory('Gridfields', function($resource, GE) {
    var serviceUrl = GE.serviceUrl + 'grid/getGridFields';
    //var serviceUrl = 'stub/gridfields.json';
    return $resource(serviceUrl, {}, {
        'read': {
          method:'GET'
      }
    });
  })
  .factory('SaveGrid', function($resource, GE) {
    var serviceUrl = GE.serviceUrl + 'grid/saveGrid';
    return $resource(serviceUrl, {}, {
        'savecols': {
          method:'POST'
      }
    });
  })
  .factory('GridData', function($resource, GE, Validate) {
    var serviceUrl = GE.serviceUrl + 'gridDataRestService/getGridData';
    //var serviceUrl = 'stub/griddata.json';
      return $resource(serviceUrl, {}, {
          'read' : {
            method: 'GET',
            transformResponse: Validate.service
          }
      });
  })
  .factory('UsersGridData', function($resource, GE, Validate) {
    var serviceUrl = GE.serviceUrl + 'useradmin/getAllUsers';
    //var serviceUrl = 'stub/griddata.json';
    return $resource(serviceUrl, {}, {
        'read': {
            method: 'GET',
            isArray:true,
            transformResponse: Validate.service
         }
    });
  })
  .factory('GridDataExcel', function($resource, GE) {
    var serviceUrl = GE.serviceUrl + 'gridDataRestService/getGridExcelData?';
    //var serviceUrl = 'stub/griddata.json';
      return $resource(serviceUrl, {}, {
          'read' : {
            method: 'GET'
          }
      });
  }).factory('GridByType', function($resource, GE) {
    var serviceUrl = GE.serviceUrl + 'grid/getGrids';
    //var serviceUrl = 'stub/griddata.json';
      return $resource(serviceUrl, {}, {
          'read' : {
            method: 'GET'
          }
      });
  }).factory('GridExcel', function($resource, GE) {
	    var serviceUrl = GE.serviceUrl + 'gridDataRestService/getGridExcelData';
	    //var serviceUrl = 'stub/griddata.json';
	      return $resource(serviceUrl, {}, {
	          'read' : {
	            method: 'GET'
	          }
	      });
});
