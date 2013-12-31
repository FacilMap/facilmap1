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

FacilMap.Routing.YOURS = ol.Class(fm.Routing, {
	routingURL : "http://www.yournavigation.org/api/1.0/gosmore.php",
	permalinkURL : "http://www.yournavigation.org/",
	routingMediumMapping : { "car" : "motorcar", "bicycle" : "bicycle", "foot" : "foot" },
	routingTypeMapping : { "shortest" : "0", "fastest" : "1" },
	attribution : ol.String.format(ol.i18n("attribution-osm"), { rendering: "<a href=\"http://www.yournavigation.org/\"><acronym title=\"Yet Another OpenStreetMap Routing Service\">YOURS</acronym></a>" }),

	getRoute : function(options, callback) {
		var t = this;

		if(!options.from || !options.to || !options.medium || !options.type)
		{
			callback({ });
			return;
		}

		if(!options.via)
			options.via = [ ];

		ol.Request.GET({
			url : this._getGPXURL(options),
			callback : function(resp) {
				if(!resp || !resp.responseXML)
					callback({ });
				else
				{
					callback({
						from : options.from,
						to : options.to,
						medium : options.medium,
						type : options.type,
						via : options.via,
						gpx : resp.responseXML,
						info : t._getInfoURL(options),
						distance : t._getRouteDistance(resp.responseXML),
						duration : null,
						getElevationProfile : null,
						optimiseRoute : null
					});
				}
			}
		})
	},

	_getGPXURL : function(options) {
		var url = this.routingURL +
			"?v="+this.routingMediumMapping[options.medium] +
			"&fast="+this.routingTypeMapping[options.routingType] +
			"&format=kml";
		var urls = [ ];
		var nodes = [ options.from ].concat(options.via).concat([ options.to ]);
		for(var i=1; i<nodes.length; i++)
		{
			urls.push(url +
				"&flat="+nodes[i-1].lat +
				"&flon="+nodes[i-1].lon +
				"&tlat="+nodes[i].lat +
				"&tlon="+nodes[i].lon);
		}
		return urls;
	},

	_getInfoURL : function(options) {
		var url = this.permalinkURL + "?flat="+options.from.lat +
			"&flon="+options.from.lon +
			"&tlat="+options.to.lat +
			"&tlon="+options.to.lon +
			"&v="+this.routingMediumMapping[options.medium] +
			"&fast="+this.routingTypeMapping[options.type];
		for(var i=0; i<options.via.length; i++)
		{
			url += "&wlat="+options.via[i].lat +
			       "&wlon="+options.via[i].lon;
		}
		return url;
	},

	_getRouteDistance : function(dom) {
		var distanceEls = dom.getElementsByTagName("distance");
		if(distanceEls.length > 0)
			return 1*distanceEls[0].firstChild.data;
		else
			return null;
	},

	CLASS_NAME : "FacilMap.Routing.YOURS"
});

})(FacilMap, OpenLayers, FacilMap.$);