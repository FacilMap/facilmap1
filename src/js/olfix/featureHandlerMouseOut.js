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

(function(fm, ol, $) {

	// Fi

	ol.Handler.Feature.prototype.mouseout = function(e) {
		if(this.feature && $(e.relatedTarget || e.toElement).closest(this.map.viewPortDiv).size() == 0) {
			if(this.feature && !this.feature.layer) // feature has been destroyed
				this.feature = null;

			if(this.lastFeature && !this.lastFeature.layer) // last feature has been destroyed
				this.lastFeature = null;

			if(this.feature)
				this.triggerCallback("mousemove", 'out', [this.lastFeature]);

			this.lastFeature = null;
		}

		return true;
	};

	/*var h = ol.Handler.Feature;

	var initializeBkp = h.prototype.initialize;
	h.prototype.initialize = function() {
		initializeBkp.apply(this, arguments);

		var t = this;
		this._viewPortMouseOut = function(e) {
			if($(e.relatedTarget || e.toElement).closest(t.map.viewPortDiv).size() == 0)
				t._simulateOverFeature(null);
		};
	};

	var activateBkp = h.prototype.activate;
	h.prototype.activate = function() {
		var ret = activateBkp.apply(this, arguments);

		if(ret)
			OpenLayers.Event.observe(this.map.viewPortDiv, "mouseout", this.viewPortMouseOut);

		return ret;
	};

	var deactivateBkp = h.prototype.deactivate;
	h.prototype.deactivate = function() {
		var ret = h.prototype.deactivate.apply(this, arguments);

		if(ret)
			OpenLayers.Event.stopObserving(this.map.viewPortDiv, "mouseout", this.viewPortMouseOut);

		return ret;
	};*/

})(FacilMap, OpenLayers, FacilMap.$);