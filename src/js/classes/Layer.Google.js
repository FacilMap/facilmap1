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

FacilMap.Layer.Google = ol.Class(ol.Layer.Google, {
	sphericalMercator : true,
	CLASS_NAME : "FacilMap.Layer.Google"
});

/**
 * Loads the Google Maps API and calls the given callback function as soon as it’s loaded.
 * @param callback {Function}
 * @return {void}
*/
FacilMap.Layer.Google.loadAPI = function(callback) {
	if(window.google && google.maps)
		return callback();

	var cbName = "fm_"+(new Date()).getTime();
	window[cbName] = function() {
		callback();
	};
	fm.Util.loadJavaScript("https://maps.googleapis.com/maps/api/js?sensor=false&callback="+encodeURIComponent(cbName));
};

})(FacilMap, OpenLayers, FacilMap.$);