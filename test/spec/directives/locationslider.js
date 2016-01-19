'use strict';

describe('Directive: locationslider', function () {

  // load the directive's module
  beforeEach(module('sprintOneApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<locationslider></locationslider>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the locationslider directive');
  }));
});
