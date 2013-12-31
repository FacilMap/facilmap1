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
 * OpenOrienteeringMap (http://oobrien.com/oom/) Street-O overlay.
*/

FacilMap.Layer.OSM.OOMStreets = ol.Class(fm.Layer.OSM, {
	numZoomLevels : 19,
	isBaseLayer : false,
	opacity : 0.25,
	attribution : ol.String.format(ol.i18n("attribution-osm"), { rendering: "<a href=\"http://oobrien.com/oom/\">OpenOrienteeringMap</a>" }),
	initialize : function(name, options) {
		// New world-wide tiles. Aren’t transparent anymore so not as good for using them as an overlay as the old ones. See http://www.openstreetmap.org/user/Ollie/diary/9223.
		fm.Layer.OSM.prototype.initialize.apply(this, [ name, "http://tiler1.censusprofiler.org/streeto/${z}/${x}/${y}.png", options ]);
	},
	CLASS_NAME : "FacilMap.Layer.OSM.OOMStreets"
});

})(FacilMap, OpenLayers, FacilMap.$);