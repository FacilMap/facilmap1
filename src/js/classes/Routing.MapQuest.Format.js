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

FacilMap.Routing.MapQuest.Format = ol.Class(ol.Format.GPX, {
	read : function(doc) {
		if (typeof doc == "string") {
			doc = ol.Format.XML.prototype.read.apply(this, [doc]);
		}

		var points = doc.getElementsByTagName("shapePoints")[0].getElementsByTagName("latLng");
		var point_features = [];
		for (var i = 0, len = points.length; i < len; i++) {
			point_features.push(new ol.Geometry.Point(points[i].getElementsByTagName("lng")[0].firstChild.data, points[i].getElementsByTagName("lat")[0].firstChild.data));
		}
		features = [ new ol.Feature.Vector(new ol.Geometry.LineString(point_features), null) ];

		if (this.internalProjection && this.externalProjection) {
			for (var g = 0, featLength = features.length; g < featLength; g++) {
				features[g].geometry.transform(this.externalProjection, this.internalProjection);
			}
		}

		return features;
	}
});

})(FacilMap, OpenLayers, FacilMap.$);