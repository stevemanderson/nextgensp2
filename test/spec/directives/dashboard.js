'use strict';

describe('Directive: dashboard', function () {

  // load the directive's module
  beforeEach(module('sprintOneApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<dashboard></dashboard>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the dashboard directive');
  }));
});
