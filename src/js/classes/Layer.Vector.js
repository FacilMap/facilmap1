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
 * Line OpenLayers.Layer.Vector, but overloads the getFeatureFromEvent method to have some tolerance about the mouse position.
*/

FacilMap.Layer.Vector = ol.Class(ol.Layer.Vector, {
	HOVER_MAX_DISTANCE : 10,

	_lastFeature : null, // Hack to be used in FacilMap.Control.LineDragFeature

	getFeatureFromEvent : function(evt) {
		this._lastFeature = {
			feature: ol.Layer.Vector.prototype.getFeatureFromEvent.apply(this, arguments),
			lonlat: this.map.getLonLatFromPixel(evt.xy)
		};

		if(!this._lastFeature.feature || this._excludeFeature(this._lastFeature.feature))
			this._lastFeature = this.getPointFromLonLat(this._lastFeature.lonlat);

		return this._lastFeature && this._lastFeature.feature;
	},

	getPointFromLonLat : function(lonlat) {
		if(this.map == null || !this.features)
			return null;

		var smallestDistance = null;
		var maxDistance = this.HOVER_MAX_DISTANCE * this.map.getResolution();

		var lonlatGeometry = new ol.Geometry.Point(lonlat.lon, lonlat.lat);

		for(var i=0; i<this.features.length; i++)
		{
			if(!this.features[i] || !this.features[i].geometry || this._excludeFeature(this.features[i]))
				continue;

			var distance = lonlatGeometry.distanceTo(this.features[i].geometry, { details: true });

			if(distance.distance > maxDistance)
				continue;

			distance.feature = this.features[i];

			if(smallestDistance == null || distance.distance < smallestDistance.distance)
				smallestDistance = distance;
		}

		if(smallestDistance != null)
			return { lonlat: new ol.LonLat(smallestDistance.x1, smallestDistance.y1), feature: smallestDistance.feature };
		else
			return null;
	},

	/**
	 * To be overridden by FacilMap.Control.LineDragFeature to exclude certain features to be respected by OpenLayers.Handler.Feature
	 * @param feature {OpenLayers.Feature}
	 * @returns {boolean}
	 * @private
	 */
	_excludeFeature : function(feature) {
		return feature._fmExcludeFromHandler;
	},

	CLASS_NAME : "FacilMap.Layer.Vector"
});

})(FacilMap, OpenLayers, FacilMap.$);