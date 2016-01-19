'use strict';

describe('Controller: AccountprivacyCtrl', function () {

  // load the controller's module
  beforeEach(module('sprintOneApp'));

  var AccountprivacyCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AccountprivacyCtrl = $controller('AccountprivacyCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AccountprivacyCtrl.awesomeThings.length).toBe(3);
  });
});
