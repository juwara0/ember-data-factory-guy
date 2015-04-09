import Ember from 'ember';
import FactoryGuy from 'ember-data-factory-guy/factory-guy';
import FactoryGuyTestHelper from 'ember-data-factory-guy/factory-guy-test-helper';
import config from '../config/environment';

export default {
  name: 'ember-data-factory-guy',
  after: 'store',

  initialize: function(container, application) {
    FactoryGuy.setStore(container.lookup('store:main'));
    FactoryGuyTestHelper.set('container', container);

    var prefix = config.modulePrefix;
    var factoryFileRegExp = new RegExp('^' + prefix + '/tests/factories');

    Ember.keys(requirejs._eak_seen).filter(function(key) {
      return factoryFileRegExp.test(key);
    }).forEach(function(moduleName) {
      //console.log(moduleName)
      if (moduleName.match('.jshint')) { // ignore autogenerated .jshint files
        return;
      }
      require(moduleName, null, null, true);
    });

  }
};
