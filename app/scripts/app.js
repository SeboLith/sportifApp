'use strict';
/*globals angular*/

/* App Module */
var app = angular.module('AsicsStore', [
	'ngResource',
	'ngStorage',
	'ngSanitize',
	'ShoeFinder.controllers',
	'ShoeFinder.directives',
	'ShoeFinder.filters',
	'ProductList.controllers',
	'ProductList.directives',
	'Returns.controllers'
]);

/* AngularUI - @version v0.3.2, 2013-01-31 - http://angular-ui.github.com - MIT License, http://www.opensource.org/licenses/MIT */
// angular.module('ui.config', []).value('ui.config', {});
// angular.module('ui.filters', ['ui.config']);
// angular.module('ui.directives', ['ui.config']);
// angular.module('ui', ['ui.filters', 'ui.directives', 'ui.config']);