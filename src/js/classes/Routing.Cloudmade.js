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

FacilMap.Routing.Cloudmade = OpenLayers.Class(FacilMap.Routing, {
	routingURL : "http://routes.cloudmade.com/0abc333ea36c4c34bc67a72442d9770b/api/0.3/",
	attribution : OpenLayers.i18n("attribution-routing-cloudmade"),

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
						info : null,
						distance : t._getRouteDistance(resp.responseXML),
						duration : t._getRouteDuration(resp.responseXML),
						getElevationProfile : null,
						optimiseRoute : null
					});
				}
			}
		})
	},

	_getGPXURL : function(options) {
		var url = this.routingURL +
		          options.from.lat + "," + options.from.lon;
		for(var i=0; i<options.via.length; i++)
			url += (i == 0 ? ",[" : ",") + options.via[i].lat + "," + options.via[i].lon;
		if(options.via.length > 0)
			url += "]";
		url += "," + options.to.lat + "," + options.to.lon + "/" + options.medium;
		if(options.medium == "foot" || options.medium == "bicycle")
			url += "/fastest";
		else
			url += "/" + options.type;
		url += ".gpx?units=km";
		return url;
	},

	_getRouteDistance : function(dom) {
		var extensions = dom.getElementsByTagName("extensions");
		if(extensions.length > 0)
		{
			var distance = extensions[0].getElementsByTagName("distance");
			if(distance.length > 0)
				return distance[0].firstChild.data/1000;
		}
		return null;
	},

	_getRouteDuration : function(dom) {
		var extensions = dom.getElementsByTagName("extensions");
		if(extensions.length > 0)
		{
			var duration = extensions[0].getElementsByTagName("time");
			if(duration.length > 0)
				return duration[0].firstChild.data/3600;
		}
		return null;
	},

	CLASS_NAME : "FacilMap.Routing.Cloudmade"
});

})(FacilMap, OpenLayers, FacilMap.$);