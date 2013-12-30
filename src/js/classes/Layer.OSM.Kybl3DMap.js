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
 * Izometrická 3D mapa ČR (http://osm.kyblsoft.cz/3dmapa/).
*/
FacilMap.Layer.OSM.Kybl3DMap = ol.Class(fm.Layer.OSM, {
	numZoomLevels : 18,
	attribution : ol.String.format(ol.i18n("attribution-osm"), { rendering: "<a href=\"http://osm.kyblsoft.cz/3dmapa/\">OpenKyblMap</a>" }),
	initialize : function(name, options) {
		fm.Layer.OSM.prototype.initialize.apply(this, [ name, "http://osm.kyblsoft.cz/3dmapa/tiles/${z}/${x}/${y}.jpg", options ]);
	},
	CLASS_NAME : "FacilMap.Layer.OSM.Kybl3DMap"
});

})(FacilMap, OpenLayers, FacilMap.$);