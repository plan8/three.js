/**
 * @author mrdoob / http://mrdoob.com/
 */

import { Vector3 } from '../math/Vector3';
import { Quaternion } from '../math/Quaternion';
import { Object3D } from '../core/Object3D';
import { AudioContext } from './AudioContext';

function AudioListener() {

	Object3D.call( this );

	this.type = 'AudioListener';

	this.context = AudioContext.getContext();

	this.gain = this.context.createGain();
	this.gain.connect( this.context.destination );

	this.filter = null;

}

AudioListener.prototype = Object.assign( Object.create( Object3D.prototype ), {

	constructor: AudioListener,

	getInput: function () {

		return this.gain;

	},

	removeFilter: function ( ) {

		if ( this.filter !== null ) {

			this.gain.disconnect( this.filter );
			this.filter.disconnect( this.context.destination );
			this.gain.connect( this.context.destination );
			this.filter = null;

		}

	},

	getFilter: function () {

		return this.filter;

	},

	setFilter: function ( value ) {

		if ( this.filter !== null ) {

			this.gain.disconnect( this.filter );
			this.filter.disconnect( this.context.destination );

		} else {

			this.gain.disconnect( this.context.destination );

		}

		this.filter = value;
		this.gain.connect( this.filter );
		this.filter.connect( this.context.destination );

	},

	getMasterVolume: function () {

		return this.gain.gain.value;

	},

	setMasterVolume: function ( value ) {

		this.gain.gain.value = value;

	},

	updateMatrixWorld: ( function () {

		var position = new Vector3();
		var quaternion = new Quaternion();
		var scale = new Vector3();

		var orientation = new Vector3();

		return function updateMatrixWorld( force ) {

			Object3D.prototype.updateMatrixWorld.call( this, force );

			var listener = this.context.listener;
			var up = this.up;

			this.matrixWorld.decompose( position, quaternion, scale );

			orientation.set( 0, 0, - 1 ).applyQuaternion( quaternion );

			if ( listener.positionX ) {

				var scheduleTime = this.context.currentTime;

				listener.positionX.cancelScheduledValues( this.context.currentTime );
				listener.positionY.cancelScheduledValues( this.context.currentTime );
				listener.positionZ.cancelScheduledValues( this.context.currentTime );
				listener.forwardX.cancelScheduledValues( this.context.currentTime );
				listener.forwardY.cancelScheduledValues( this.context.currentTime );
				listener.forwardZ.cancelScheduledValues( this.context.currentTime );
				listener.upX.cancelScheduledValues( this.context.currentTime );
				listener.upY.cancelScheduledValues( this.context.currentTime );
				listener.upZ.cancelScheduledValues( this.context.currentTime );

				listener.positionX.setTargetAtTime( position.x, scheduleTime, 0.1 );
				listener.positionY.setTargetAtTime( position.y, scheduleTime, 0.1 );
				listener.positionZ.setTargetAtTime( position.z, scheduleTime, 0.1 );
				listener.forwardX.setTargetAtTime( orientation.x, scheduleTime, 0.1 );
				listener.forwardY.setTargetAtTime( orientation.y, scheduleTime, 0.1 );
				listener.forwardZ.setTargetAtTime( orientation.z, scheduleTime, 0.1 );
				listener.upX.setTargetAtTime( up.x, scheduleTime, 0.1 );
				listener.upY.setTargetAtTime( up.y, scheduleTime, 0.1 );
				listener.upZ.setTargetAtTime( up.z, scheduleTime, 0.1 );

			}
			else {

				listener.setPosition( position.x, position.y, position.z );
				listener.setOrientation( orientation.x, orientation.y, orientation.z, up.x, up.y, up.z );

			}

		};

	} )()

} );

export { AudioListener };
