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
 * An extended version of the OpenStreetBugs layer from http://wiki.openstreetmap.org/wiki/OpenStreetBugs_layer.
 *
 * Makes use of the features and styles of {@link FacilMap.Layer.Markers}.
 *
 * Make sure to load the OpenStreetBugs API from http://api.facilmap.org/osblayer/osblayer.js before adding this
 * layer or use the {@link FacilMap.Layer.Markers.OpenStreetBugs.loadAPI} function.
*/

FacilMap.Layer.Markers.OpenStreetBugs = ol.Class(fm.Layer.Markers, {
	zoomableInLayerSwitcher : false,

	initialize : function(name, options)
	{
		this.fmParentClasses.push(ol.Layer.OpenStreetBugs);

		fm.Layer.Markers.prototype.initialize.apply(this, arguments);

		for(var i in ol.Layer.OpenStreetBugs.prototype)
		{
			if(i != "initialize" && i != "_createMarker" && i != "CLASS_NAME")
				this[i] = ol.Layer.OpenStreetBugs.prototype[i];
		}

		ol.Layer.OpenStreetBugs.prototype.initialize.apply(this, arguments);
	},

	_createMarker: function(id, lonlat, comments, closed, icon)
	{
		var feature = fm.Layer.Markers.prototype.createMarker.apply(this, [ lonlat, null, false, icon, true ]).fmFeature;

		if(id != null) // Existing bug, not bug creation form
		{
			// Remove the fading of the popup, as the popup opens on marker mouseover
			feature.marker.events.register("mouseover", feature, function() {
				if(!this.osbClicked && this.popup)
					this.popup.unsetOpacity(0);
			});
		}

		// Make the popup intransparent initially
		fm.Util.wrapFunction(feature, "createPopup", null, function() {
			fm.Util.wrapFunction(this.popup, "draw", null, function() { this.unsetOpacity(0); });
		});

		return feature;
	},

	CLASS_NAME : "FacilMap.Layer.Markers.OpenStreetBugs"
});

/**
 * Loads the OpenStreetBugs API and executes a callback function once it is loaded. When the API is already loaded,
 * the function is called immediately.
 * @param callback {Function} A function to call as soon as the API is loaded.
 */
FacilMap.Layer.Markers.OpenStreetBugs.loadAPI = function(callback) {
	fm.Util.loadJavaScript("http://api.facilmap.org/osblayer/osblayer.js", function() { return ol.Layer.OpenStreetBugs != undefined; }, callback);
};

})(FacilMap, OpenLayers, FacilMap.$);