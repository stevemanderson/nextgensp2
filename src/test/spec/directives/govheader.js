'use strict';

describe('Directive: govheader', function () {

  // load the directive's module
  beforeEach(module('nextgensp2'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<govheader></govheader>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the govheader directive');
  }));
});
