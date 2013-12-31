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
 * Displays an XML file on the map (such as GPX, KML or OSM) auto-determining of the format. The colour is
 * randomly assigned.
 * If you set FacilMap.Layer.XML.relationURL, OSM sub-relations will be loaded in additional requests.
 * Include the JavaScript http://api.facilmap.org/ajax-proxy/ajax-proxy.js to "disable" the Same Origin Policy.
 * Otherwise, you might have to set OpenLayers.ProxyHost to a URL on your server. The actual URL will be appended
 * to that in encoded form.
 * @event allloadend If an array of URL is passed, this is only called when the last URL is actually loaded.
*/

FacilMap.Layer.XML = ol.Class(ol.Layer.Vector, {
	fmUrl : null,
	relations : null,
	colour : null,
	toLoad : 0,
	style : {
		strokeColor: this.colour,
		strokeWidth: 3,
		strokeOpacity: 0.5
	},
	projection : new ol.Projection("EPSG:4326"),
	zoomableInLayerSwitcher : true,

	initialize : function(name, url, options) {
		this.relations = { };

		if(this.colour == null)
		{
			switch((fm.Layer.XML.colourCounter++)%4)
			{
				case 0: this.colour = "red"; break;
				case 1: this.colour = "blue"; break;
				case 2: this.colour = "green"; break;
				case 3: this.colour = "black"; break;
			}
		}

		ol.Layer.Vector.prototype.initialize.apply(this, [ name ? name : url, options ]);

		this.events.addEventType("loadstart");
		this.events.addEventType("allloadend");
		this.events.addEventType("loadend");

		this.events.register("loadend", this, function() {
			if(this.toLoad == 0)
				this.events.triggerEvent("allloadend");
		});

		if(url)
			this.setUrl(url);
	},

	/*afterAdd : function() {
		var ret = ol.Layer.Vector.prototype.afterAdd.apply(this, arguments);
		this.map.setLayerZIndex(this, 0);
		return ret;
	},*/

	setUrl : function(url) {
		this.removeAllFeatures();
		this.fmUrl = url;

		this.toLoad = 0;
		this.relations = { };

		if(url) {
			this.events.triggerEvent("loadstart");
			this._loadUrls([ this.fmUrl ]);
		}

		this.events.triggerEvent("stateChanged");
	},

	_loadUrls : function(url) {
		for(var i=0; i<url.length; i++)
		{
			if(!url[i])
				continue;

			this.toLoad++;
			ol.Request.GET({
				url: url[i],
				success: function(req) {
					if(req.responseXML)
						this._loadXml(req.responseXML.documentElement);
					else {
						ol.Console.userError(ol.i18n("Error parsing file."));
						if(window.console && console.error)
							console.error("Could not parse XML", req);
					}

					this.toLoad--;
					this.events.triggerEvent("loadend");
				},
				failure: function(req) {
					ol.Console.userError(ol.i18n("Error loading file."));

					if(window.console && console.error)
						console.error("HTTP request failed", req);

					this.toLoad--;
					this.events.triggerEvent("loadend");
				},
				scope: this
			});
		}
	},

	_loadXml : function(xml) {
		var format = null;
		switch(xml.tagName)
		{
			case "gpx":
				if(xml.getAttribute("creator") == "CloudMade")
					format = fm.Routing.Cloudmade.Format;
				else
					format = ol.Format.GPX;
				break;
			case "osm": format = ol.Format.OSM; break;
			case "kml": format = ol.Format.KML; break;
			case "response": format = fm.Routing.MapQuest.Format;
		}

		if(format == null) {
			ol.Console.userError(ol.i18n("Error parsing file."));
			if(window.console && console.error)
				console.error("Unknown root tag for XML file", xml);
			return;
		}

		var formatObj = new format({ extractAttributes: false, internalProjection: this.map.projection });

		if(fm.Layer.XML.relationURL && format == ol.Format.OSM)
		{
			var relations = xml.getElementsByTagName("relation");
			for(var i=0; i<relations.length; i++)
			{
				var id = relations[i].getAttribute("id");
				if(this.relations[id])
					continue;
				this.relations[id] = true;

				var url = ol.String.format(fm.Layer.XML.relationURL, {"id": id});
				if(url == this.url)
					continue;
				this._loadUrls([ url ]);
			}
		}

		this.addFeatures(formatObj.read(xml));
	},

	getStateObject : function() {
		var obj = { };
		if(this.removableInLayerSwitcher)
			obj.url = this.fmUrl;
		return obj;
	},

	setStateObject : function(obj) {
		if(obj.url != undefined && obj.url != this.fmUrl)
			this.setUrl(obj.url);
	},

	CLASS_NAME : "FacilMap.Layer.XML"
});

/**
 * Set this to the XML URL that shall be loaded for relations referenced in OSM files. “${id}" will be replaced by the ID of the relation.
 * @var String
*/
FacilMap.Layer.XML.relationURL = "http://www.openstreetmap.org/api/0.6/relation/${id}/full";

FacilMap.Layer.XML.colourCounter = 1;

})(FacilMap, OpenLayers, FacilMap.$);