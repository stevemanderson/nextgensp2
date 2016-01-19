'use strict';

describe('Controller: AccountsummaryCtrl', function () {

  // load the controller's module
  beforeEach(module('sprintOneApp'));

  var AccountsummaryCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AccountsummaryCtrl = $controller('AccountsummaryCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AccountsummaryCtrl.awesomeThings.length).toBe(3);
  });
});
