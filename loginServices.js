'use strict';

angular.module('vkApp')

  .factory('UserProperties', function($resource, GE, Validate) {
    var serviceUrl = GE.serviceUrl + 'login/getCredentials';
      return $resource(serviceUrl, {}, {
          'read' :  {
            method: 'GET',
            transformResponse: Validate.service
          }
      });
  })
  .factory('Logout', function($resource, GE) {
    var serviceUrl = GE.serviceUrl + 'login/logout';
      return $resource(serviceUrl, {}, {
          'read' : {
            method: 'GET'
          }
      });
  })
  .factory('VKAppDefault', function ($resource, GE, Validate) {
        //var serviceUrl = 'stub/repair/form.json';
        var serviceUrl = GE.serviceUrl + 'application/initialdata';
        return $resource(serviceUrl, {}, {
            'read': {
                method: 'GET',
                transformResponse: Validate.service
            }
        });
    })
  ;
