import Ember from 'ember';
import FactoryGuy from '../factory-guy';
import MockRequest from './mock-request';
import AttributeMatcher from './attribute-matcher';
import {escapeRegExp} from '../utils/helper-functions';

export default class MockUpdateRequest extends AttributeMatcher(MockRequest) {

  constructor(modelName, id) {
    super(modelName);
    this.id = id;
    this.returnArgs = {};
    this.matchArgs = {};
  }

  getUrl() {
    return FactoryGuy.buildURL(this.modelName, this.id);
  }

  getType() {
    return FactoryGuy.updateHTTPMethod();
  }

  urlMatch(settings) {
    /**
     If no id is specified, match any url with an id,
     with or without a trailing slash after the id.
     Ex: /profiles/:id and /profiles/:id/
     */
    let url = escapeRegExp(this.getUrl());
    if (!this.id) {
      url = new RegExp(url + '\/*\\d+\/*');
    }

    return settings.url.match(url);
  }

  /**
   This returns is different than the one for GET requests, because
   you don't prefix the returns with json or models etc...
   The returns arguments are those attributes or relationships that
   you would like returned with the model when the update succeeds.

   @param {Object} returns attributes and or relationships to send with payload
   */
  returns(returns) {
    if (!this.id) {
      Ember.assert(`[ember-data-factory-guy] Can't use returns in mockUpdate when update only has modelName and no id`, this.id);
    }
    this.returnArgs = returns;
    return this;
  }

  /**
   Adapters freak out if update payload is non empty response with no id.
   So, if there is no id specified for this update => return null

   @returns {*}
   */
  getResponse() {
    this.responseJson = null;
    if (this.id) {
      let args = Ember.$.extend({}, this.matchArgs, this.returnArgs);
      let json = Ember.$.extend({}, args, { id: this.id });
      this.responseJson = FactoryGuy.fixtureBuilder.convertForBuild(this.modelName, json);
    }
    return super.getResponse();
  }

}