"use strict";

const config = {
		triggers: {
			on: {
				name: 'virtual_tv_on',
			},
			off: {
				name: 'virtual_tv_off',
			}
		},
		conditions: {
			onoff: {
				name: 'virtual_tv',
			}
		},
		actions: {
			on: {
				name: 'virtual_tv_action_on',
				type: 'onoff'
			},
			off: {
				name: 'virtual_tv_action_off',
				type: 'onoff'
			}
		},
		logger: {
		}
	};
	const Switch = require('../../general/drivers/switch.js');
	const driver = new Switch(config);

	module.exports = Object.assign(
		{},
		driver.getExports(), 
		{ init: (devices, callback) => driver.init(devices, callback) }
	);
