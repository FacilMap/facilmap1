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

fm.Routing.MapQuest = ol.Class(fm.Routing, {
	routingURL : "http://open.mapquestapi.com/directions/v0/route",
	orderedURL : "http://open.mapquestapi.com/directions/v0/optimizedRoute",
	elevationChartURL : "http://open.mapquestapi.com/elevation/v1/getElevationChart",
	attribution : ol.i18n("attribution-routing-mapquest"),

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
						getElevationProfile : function(size){ return t._getElevationProfileURL(this, size); },
						optimiseRoute : function(callback) { t._getOptimisedRoute(this, callback); }
					});
				}
			}
		})
	},

	_getOptimisedRoute : function(oldRoute, callback) {
		var t = this;

		if(callback == null)
			callback = function() { };

		if(!oldRoute.via || oldRoute.via.length < 2)
		{
			callback(oldRoute);
			return;
		}

		var json = "{locations:[{latLng:{lat:" + oldRoute.from.lat + ",lng:" + oldRoute.from.lon +"}}";
		for(var i=0; i<oldRoute.via.length; i++)
			json += ",{latLng:{lat:" + oldRoute.via[i].lat + ",lng:" + oldRoute.via[i].lon + "}}";
		json += ",{latLng:{lat:" + oldRoute.to.lat + ",lng:" + oldRoute.to.lon + "}}]";

		json += ",options:{generalize:-1,narrativeType:none";

		if(oldRoute.medium == fm.Routing.Medium.FOOT)
			json += ",routeType:pedestrian";
		else if(oldRoute.medium == fm.Routing.Medium.BICYCLE)
			json += ",routeType:" + oldRoute.medium;
		else
			json += ",routeType:" + oldRoute.type;

		json += "}}";

		var url = this.orderedURL + "?inFormat=json&outFormat=xml&json=" + encodeURIComponent(json);

		ol.Request.GET({
			url: url,
			callback: function(resp) {
				if(!resp || !resp.responseXML)
				{
					callback({ });
					return;
				}

				var locSequence = resp.responseXML.getElementsByTagName("locationSequence");
				if(locSequence.length == 0)
				{
					callback({ });
					return;
				}

				locSequence = locSequence[0].firstChild.data.split(",");

				var newVia = [ ];
				for(var i=1; i<locSequence.length-1; i++) // The first and last location are the start and end points
				{
					if(oldRoute.via[locSequence[i]-1] == undefined)
					{
						callback({ });
						return;
					}
					newVia.push(oldRoute.via[locSequence[i]-1]);
				}

				callback({
					from : oldRoute.from,
					to : oldRoute.to,
					medium : oldRoute.medium,
					type : oldRoute.type,
					via : newVia,
					gpx : resp.responseXML,
					info : null,
					distance : t._getRouteDistance(resp.responseXML),
					duration : t._getRouteDuration(resp.responseXML),
					getElevationProfile : function(size){ t._getElevationProfileURL(this, size); },
					optimiseRoute : function(callback){ callback(this); }
				});
			}
		});
	},

	_getGPXURL : function(options) {
		var json = "{locations:[{latLng:{lat:" + options.from.lat + ",lng:" + options.from.lon +"}}";
		for(var i=0; i<options.via.length; i++)
			json += ",{latLng:{lat:" + options.via[i].lat + ",lng:" + options.via[i].lon + "}}";
		json += ",{latLng:{lat:" + options.to.lat + ",lng:" + options.to.lon + "}}]";

		json += ",options:{unit:k,generalize:0,narrativeType:none";

		if(options.medium == fm.Routing.Medium.FOOT)
			json += ",routeType:pedestrian";
		else if(options.medium == fm.Routing.Medium.BICYCLE)
			json += ",routeType:" + options.medium;
		else
			json += ",routeType:" + options.type;

		json += "}}";

		return this.routingURL + "?inFormat=json&outFormat=xml&json=" + encodeURIComponent(json);
	},

	_getRouteDistance : function(dom) {
		var els = dom.getElementsByTagName("route")[0].childNodes;
		for(var i=0; i<els.length; i++)
		{
			if(els[i].tagName == "distance")
				return els[i].firstChild.data;
		}
	},

	_getRouteDuration : function(dom) {
		var els = dom.getElementsByTagName("route")[0].childNodes;
		var time = null;
		for(var i=0; i<els.length; i++)
		{
			if(els[i].tagName == "time")
			{
				time = els[i].firstChild.data/3600;
				break;
			}
		}

		if(time != null)
		{
			return time;
		}
	},

	_getElevationProfileURL : function(route, size) {
		var minDist = 2 * route.distance / size.w;

		var calcDist = function(lonlat1, lonlat2) {
			// Source: http://www.movable-type.co.uk/scripts/latlong.html
			var R = 6371; // km
			var dLat = (lonlat2.lat-lonlat1.lat) * Math.PI/180;
			var dLon = (lonlat2.lon-lonlat1.lon) * Math.PI/180;
			var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
					Math.cos(lonlat1.lat * Math.PI/180) * Math.cos(lonlat2.lat * Math.PI/180) *
					Math.sin(dLon/2) * Math.sin(dLon/2);
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
			return R * c;
		};

		var points = route.gpx.getElementsByTagName("shapePoints")[0].getElementsByTagName("latLng");
		var last = null;
		var latlons = [ ];
		var dist = 0;
		for(var i=0; i < points.length; i++)
		{
			var it = new ol.LonLat(points[i].getElementsByTagName("lng")[0].firstChild.data, points[i].getElementsByTagName("lat")[0].firstChild.data);

			if(last != null)
				dist += calcDist(last, it);
			last = it;

			if(i == 0 || i == points.length-1 || dist >= minDist)
			{
				latlons.push(it.lat);
				latlons.push(it.lon);
				dist = 0;
			}
		}

		var json = "{shapeFormat:'raw',unit:'k',width:'"+size.w+"',height:'"+size.h+"',latLngCollection:["+latlons.join(",")+"]}";

		return this.elevationChartURL + "?inFormat=json&json="+encodeURIComponent(json);
	},

	CLASS_NAME : "FacilMap.Routing.MapQuest"
});

})(FacilMap, OpenLayers, FacilMap.$);