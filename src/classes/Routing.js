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

fm.Routing = ol.Class({
	initialize : function() {

	},

	/**
	 * Calculates a route.
	 * @param options {Object} Contains the following properties:
	 *                         from {OpenLayers.LonLat}
	 *                         to {OpenLayers.LonLat}
	 *                         medium {FacilMap.Routing.Medium}
	 *                         type {FacilMap.Routing.Type}
	 *                         via {Array<OpenLayers.LonLat>}
	 * @param callback {Function} Receives an object as parameter that may have the following properties:
	 *                            from {OpenLayers.LonLat}
	 *                            to {OpenLayers.LonLat}
	 *                            medium {FacilMap.Routing.Medium}
	 *                            type {FacilMap.Routing.Type}
	 *                            via {Array<OpenLayers.LonLat}
	 *                            gpx {Element} The GPX route
	 *                            info {String} A link to a page with additional route information
	 *                            distance {Number} Route distance in km
	 *                            duration {Number} Route duration in s
	 *                            getElevationProfile {Function} Returns a link to an elevation profile image. Expects a width for the image as first parameter.
	 *                            optimiseRoute {Function} The first parameter has to be a callback function that receives a new route object with opimised via point order.
	 */
	getRoute : function(options, callback) {
		callback({
			from : null,
			to : null,
			medium : null,
			type : null,
			via : null,
			gpx : null,
			info : null,
			distance : null,
			duration : null,
			getElevationProfile : null,
			optimiseRoute : null
		});
	},

	CLASS_NAME : "FacilMap.Routing"
});

/**
 * Means of transportation.
*/
fm.Routing.Medium = {
	CAR : "car",
	BICYCLE : "bicycle",
	FOOT : "foot"
};

/**
 * Route calculation mechanisms.
*/
fm.Routing.Type = {
	FASTEST : "fastest",
	SHORTEST : "shortest"
};

})(FacilMap, OpenLayers, FacilMap.$);