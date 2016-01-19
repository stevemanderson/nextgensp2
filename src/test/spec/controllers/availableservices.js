'use strict';

describe('Controller: AvailableservicesCtrl', function () {

  // load the controller's module
  beforeEach(module('sprintOneApp'));

  var AvailableservicesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AvailableservicesCtrl = $controller('AvailableservicesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AvailableservicesCtrl.awesomeThings.length).toBe(3);
  });
});
