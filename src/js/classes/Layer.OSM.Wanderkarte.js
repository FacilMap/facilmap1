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
 * OSM Reit- und Wanderkarte rendering of OSM foot- and bridle ways. See http://osmc.broadbox.de/.
*/

FacilMap.Layer.OSM.Wanderkarte = ol.Class(fm.Layer.OSM, {
	minZoomLevel : 8,
	maxZoomLevel : 15,
	attribution : ol.String.format(ol.i18n("attribution-osm"), { rendering: "<a href=\"http://osmc.broadbox.de/\">OSMC Reit- und Wanderkarte</a>" }),
	initialize: function(name, options) {
		fm.Layer.OSM.prototype.initialize.apply(this, [ name, "http://topo.geofabrik.de/trails/${z}/${x}/${y}.png", options ]);
	},
	CLASS_NAME : "FacilMap.Layer.OSM.Wanderkarte"
});

})(FacilMap, OpenLayers, FacilMap.$);