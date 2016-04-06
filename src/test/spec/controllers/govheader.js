'use strict';

describe('Controller: GovheaderctrlCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgensp2'));

  var GovheaderctrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GovheaderctrlCtrl = $controller('GovheaderctrlCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(GovheaderctrlCtrl.awesomeThings.length).toBe(3);
  });
});
