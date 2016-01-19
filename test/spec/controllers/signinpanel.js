'use strict';

describe('Controller: SigninpanelCtrl', function () {

  // load the controller's module
  beforeEach(module('sprintOneApp'));

  var SigninpanelCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SigninpanelCtrl = $controller('SigninpanelCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SigninpanelCtrl.awesomeThings.length).toBe(3);
  });
});
