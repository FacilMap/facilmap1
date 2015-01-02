/*
	This file is part of FacilMap.

	FacilMap is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	FacilMap is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.

	You should have received a copy of the GNU Affero General Public License
	along with FacilMap.  If not, see <http://www.gnu.org/licenses/>.

	Obtain the source code from http://gitorious.org/facilmap.
*/

(function(fm, ol, $){

/**
 * When hovering a line, a temporary marker will appear on the line that can be dragged away (for changing the course of a route, for
 * example).
 */

fm.Control.DragLine = ol.Class(ol.Control.DragFeature, {
	/**
	 * The temporary icon to show along the line.
	 * @type {OpenLayers.Marker}
	 */
	dragIcon : null,

	onDblClick: function(feature) {},

	initialize : function(layer, dragIcon, options) {
		ol.Control.DragFeature.prototype.initialize.apply(this, [ layer, options ]);

		var t = this;

		t.dragIcon = dragIcon;

		var moveBkp = this.handlers.feature.mousemove;
		this.handlers.feature.mousemove = function(evt) {
			moveBkp.apply(this, arguments);

			if(this.feature)
				t.mousemove(this.feature);
		};

		this.handlers.feature.dblclick = function(evt) {
			if(this.feature) {
				t.dblClickFeature(this.feature);
				return false;
			}
		};
	},

	overFeature : function(feature) {
		ol.Control.DragFeature.prototype.overFeature.apply(this, arguments);

		if(!this.handlers.drag.dragging && this.isLine(feature)) {
			feature.fmDragFeature = fm.Util.createIconVector(this.layer._lastFeature.lonlat, this.dragIcon);
			feature.fmDragFeature._fmExcludeFromHandler = true; // FacilMap.Layer.Vector.getFeatureFromEvent() will ignore it
			this.layer.addFeatures([ feature.fmDragFeature ]);
		}
	},

	mousemove : function(feature) {
		if(feature.fmDragFeature) {
			feature.fmDragFeature.geometry.x = this.layer._lastFeature.lonlat.lon;
			feature.fmDragFeature.geometry.y = this.layer._lastFeature.lonlat.lat;
			this.layer.drawFeature(feature.fmDragFeature);
		}
	},

	moveFeature : function(px) {
		ol.Control.DragFeature.prototype.moveFeature.apply(this, arguments);
	},

	outFeature : function(feature) {
		if(!this.handlers.drag.dragging && feature.fmDragFeature) {
			this.layer.removeFeatures([ feature.fmDragFeature ]);
			feature.fmDragFeature.destroy();
			delete feature.fmDragFeature;
		}

		ol.Control.DragFeature.prototype.outFeature.apply(this, arguments);
	},

	downFeature : function(pixel) {
		if(this.feature.fmDragFeature) {
			var dragFeature = this.feature.fmDragFeature;
			delete this.feature.fmDragFeature;
			delete dragFeature._fmExcludeFromHandler;

			dragFeature.fmStartLonLat = new OpenLayers.LonLat(dragFeature.geometry.x, dragFeature.geometry.y);
			dragFeature.fmLine = this.feature;

			this._simulateOverFeature(dragFeature, true);

			var lonlat = this.map.getLonLatFromPixel(pixel);
			this.feature.geometry.x = lonlat.lon;
			this.feature.geometry.y = lonlat.lat;
			this.layer.drawFeature(this.feature);
		}

		ol.Control.DragFeature.prototype.downFeature.apply(this, arguments);
	},

	_simulateOverFeature : function(feature, preserveDragging) {
		var dragActive = this.handlers.drag.active;

		this.handlers.feature.feature = feature;

		if(this.feature) {
			if(preserveDragging)
				this.handlers.drag.active = false; // Trick dragHandler so that it is not deactivated by outFeature()

			this.outFeature(this.feature);
		}

		if(feature) {
			if(preserveDragging)
				this.handlers.drag.active = true;

			this.overFeature(feature);
		}

		if(preserveDragging)
			this.handlers.drag.active = dragActive;

		this.handlers.feature.lastFeature = feature;
	},

	dblClickFeature : function(feature) {
		this.onDblClick(feature);
	},

	isLine : function(feature) {
		return feature.geometry != null && feature.geometry.components != null;
	},

	CLASS_NAME: "FacilMap.Control.DragLine"
});



})(FacilMap, OpenLayers, FacilMap.$);