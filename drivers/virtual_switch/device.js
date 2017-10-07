'use strict';

const Homey = require('homey');

//a list of devices, with their 'id' as key
//it is generally advisable to keep a list of
//paired and active devices in your driver's memory.
var devices = {};

class VirtualDevice extends Homey.Device {
  onInit() {
    this.log('Virtual Device (' + this.getName() + ') initialized');

		// this.log('name:        ', this.getName());
    // this.log('id:          ', this.getData().id);
    // this.log('version:     ', this.getData().version);
    // this.log('icon:        ', this.getData().icon);
    // this.log('class:       ', this.getClass());
    // this.log('capabilities:', JSON.stringify(this.getCapabilities()));
    // this.log('state:       ', this.getState());

    let triggerDevice = new Homey.FlowCardTriggerDevice('press');
    triggerDevice.register();

    let alarmStateIsTrigger = new Homey.FlowCardTriggerDevice('alarm_state_is');
    alarmStateIsTrigger.register();
    this.registerFlowCardRunListener(alarmStateIsTrigger);


    // When capability is changed
    this.registerMultipleCapabilityListener(this.getCapabilities(), (valueObj, optsObj) => {
      this.log(this.getName() + ' -> Capability changed: ' + JSON.stringify(valueObj));

      triggerDevice.trigger( this, {}, valueObj ) // Fire and forget
        .catch( this.error )

      return Promise.resolve();
    }, 500);

    this.registerSingleCapabilityListener('alarm_state', alarmStateIsTrigger);
  }

  // this method is called when the Device is added
  onAdded() {
    this.log('Adding device: ' + this.getName() + ' (' + this.getData().id + ')');
  }

  // this method is called when the Device is deleted
  onDeleted() {
    this.log('device deleted: ' + this.getName());
  }

  registerFlowCardRunListener(flowCardTrigger) {
    flowCardTrigger.registerRunListener(( args, state ) => {
      this.log('Flow card is triggered: ' + JSON.stringify(state));

      let argums = cleanJson(args);
      let firstArg = Object.keys(argums)[0]; // Should I iterate over all arguments?
      let triggerState = argums[firstArg];

      if (state === triggerState) {
        return Promise.resolve( true );
      } else {
        return Promise.resolve( false );
      }
    })
  }

  registerSingleCapabilityListener(capability, flowCardTrigger){
    this.registerCapabilityListener(capability, ( value, opts ) => {
      this.log(this.getName() + ' -> ' + capability + ' changed: ' + JSON.stringify(value) );

      flowCardTrigger.trigger( this, {}, value ) // Fire and forget
        .catch( this.error );

        return Promise.resolve();
      }, 500);
  }
}

module.exports = VirtualDevice;

function cleanJson (object){
    var simpleObject = {};
    for (var prop in object ){
        if (!object.hasOwnProperty(prop)){
            continue;
        }
        if (typeof(object[prop]) == 'object'){
            continue;
        }
        if (typeof(object[prop]) == 'function'){
            continue;
        }
        simpleObject[prop] = object[prop];
    }
    return simpleObject; // returns cleaned up JSON
};