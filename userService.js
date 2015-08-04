'use strict';

angular
    .module('vkApp')
  
  .factory('AllUsers', function($resource, GE, Validate) {
    var serviceUrl = GE.serviceUrl + 'useradmin/getAllUsers';
    //var serviceUrl = 'stub/griddata.json';
    return $resource(serviceUrl, {}, {
        'read': {
            method: 'GET',
            isArray: true,
            transformResponse: Validate.service
         }
    });
  })

  .factory('AddNewUser', function($resource, GE, Validate) {
    var serviceUrl = GE.serviceUrl + 'useradmin/saveUser';
    // /VKWebApp/vk/useradmin/saveUser
    //var serviceUrl = 'stub/griddata.json';
    return $resource(serviceUrl, {}, {
        'create': {
            method: 'POST',
            data: '@newuser'
        }
    });
  })

  .factory('DeleteUser', function($resource, GE, Validate) {
    var serviceUrl = GE.serviceUrl + 'useradmin/deleteUser';
    return $resource(serviceUrl, {}, {
        'update': {
            method: 'PUT',
            params: {Id: '@Id'}
        }
    });
  })
  .factory('ChangePassword', function($resource, GE, Validate) {
    var serviceUrl = GE.serviceUrl + 'useradmin/changePassword';
    return $resource(serviceUrl, {}, {
        'update': {
            method: 'POST',
            data: '@passwordObj'
        }
    });
  })

  .factory('CreateCustomer', function($resource, GE, Validate) {
    var serviceUrl = GE.serviceUrl + 'customer/addCustomer';
    //var serviceUrl = 'stub/griddata.json';
    return $resource(serviceUrl, {}, {
        'create': {
            method: 'POST',
            data: '@customer'
        }
    });
  }) 

  .factory('AddOwner', function($resource, GE, Validate) {
    var serviceUrl = GE.serviceUrl + 'owner/addOwner';
    //var serviceUrl = 'stub/griddata.json';
    return $resource(serviceUrl, {}, {
        'create': {
            method: 'POST',
            data: '@customer'
        }
    });
  })

    .factory('GetOwnerById', function ($resource, GE) {
        var serviceUrl = GE.serviceUrl + 'owner/getOwnerById';
        return $resource(serviceUrl, {}, {
            'read': {
                method: 'GET'
            }
        });
    })
  .factory('GetOwnerByName', function ($resource, GE) {
        var serviceUrl = GE.serviceUrl + 'owner/getOwnerByName';
        return $resource(serviceUrl, {}, {
            'read': {
                method: 'GET'
            }
        });
    })

    .factory('TenantLogo', function ($resource, GE, Validate) {
        var serviceUrl = GE.serviceUrl + 'attachment/getTenantLogo';
        return $resource(serviceUrl, {}, {
            'read': {
                method: 'GET',
                isArray: true,
                transformResponse:  Validate.service
            }
        });
    })



;