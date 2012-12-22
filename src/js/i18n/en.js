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

ol.Lang.en = ol.Util.extend(ol.Lang.en, {
	"Zoom" : "Zoom",
	"Remove" : "Remove",
	"attribution-osm" : "Rendering CC-by-SA by ${rendering}, Data CC-by-SA by <a href=\"http://www.openstreetmap.org/\">OpenStreetMap</a>",
	"attribution-relief" : "Relief by <a href=\"http://hikebikemap.de/\">Hike &amp; Bike Map</a>",
	"attribution-oom-streets" : "Streets overlay CC-by-SA by <a href=\"http://oobrien.com/oom/\">OpenOrienteeringMap</a>/<a href=\"http://www.openstreetmap.org/\">OpenStreetMap</a> data",
	"attribution-oom-labels" : "Labels overlay CC-by-SA by <a href=\"http://oobrien.com/oom/\">OpenOrienteeringMap</a>/<a href=\"http://www.openstreetmap.org/\">OpenStreetMap</a> data",
	"attribution-hiking" : "Hiking symbols overlay CC-by-SA by <a href=\"http://osm.lonvia.de/world_hiking.html\">Lonvia's Hiking Map</a>/<a href=\"http://www.openstreetmap.org/\">OpenStreetMap</a> data",
	"attribution-os-streetview" : "Contains Ordnance Survey data © Crown copyright and database right 2010",
	"attribution-routing-yours" : "Routing CC-by-SA by <a href=\"http://www.yournavigation.org/\"><acronym title=\"Yet Another OpenStreetMap Routing Service\">YOURS</acronym></a>/<a href=\"http://www.openstreetmap.org/\">OpenStreetMap</a> data",
	"attribution-routing-cloudmade" : "Routing CC-by-SA by <a href=\"http://cloudmade.com/\">CloudMade</a>/<a href=\"http://www.openstreetmap.org/\">OpenStreetMap</a> data",
	"attribution-routing-mapquest" : "Routing CC-by-SA by <a href=\"http://open.mapquest.co.uk/\">MapQuest Open</a>/<a href=\"http://www.openstreetmap.org/\">OpenStreetMap</a> data",
	"attribution-poi" : "POI layer CC-by-SA by <a href=\"http://olm.openstreetmap.de/\">OpenLinkMap</a>/<a href=\"http://www.openstreetmap.org/\">OpenStreetMap</a> data",
	"Create a marker" : "Create a marker",
	"Coordinates" : "Coordinates",
	"unknown" : "unknown",
	"Error parsing file." : "Error parsing file.",
	"Latitude" : "Latitude",
	"Longitude" : "Longitude",
	"OpenStreetMap Permalink" : "OpenStreetMap Permalink",
	"OpenStreetMap Shortlink" : "OpenStreetMap Shortlink",
	"Google Maps Permalink" : "Google Maps Permalink",
	"Yahoo Maps Permalink" : "Yahoo Maps Permalink",
	"OpenStreetMap Links" : "OpenStreetMap Links",
	"Wikimedia GeoHack" : "Wikimedia GeoHack",
	"Go home" : "Go home",
	"Mapnik" : "Mapnik",
	"MapSurfer Road" : "MapSurfer Road",
	"MapSurfer Topographic" : "MapSurfer Topographic",
	"OpenStreetBrowser" : "OpenStreetBrowser",
	"OpenCycleMap" : "OpenCycleMap",
	"Reit- und Wanderkarte" : "Reit- und Wanderkarte",
	"Hike & Bike Map" : "Hike & Bike Map",
	"OpenPisteMap" : "OpenPisteMap",
	"ÖPNV-Karte" : "ÖPNV-Karte",
	"Google Streets" : "Google Streets",
	"Google Satellite" : "Google Satellite",
	"Google Hybrid" : "Google Hybrid",
	"Google Terrain" : "Google Terrain",
	"Google MapMaker" : "Google MapMaker",
	"Google MapMaker Hybrid" : "Google MapMaker Hybrid",
	"Yahoo Street" : "Yahoo Street",
	"Yahoo Satellite" : "Yahoo Satellite",
	"Yahoo Hybrid" : "Yahoo Hybrid",
	"Relief" : "Relief",
	"Hiking symbols" : "Hiking symbols",
	"Coordinate grid" : "Coordinate grid",
	"Izometrická 3D mapa ČR" : "Izometrická 3D mapa ČR",
	"Streets overlay" : "Streets overlay",
	"Labels overlay" : "Labels overlay",
	"Links to other maps" : "Links to other maps",
	"Tags" : "Tags",
	"POI" : "POI",
	"License" : "License",
	"OpenStreetBugs" : "OpenStreetBugs",
	"Search help" : "Search help",
	"searchHelpText" : '<p>Enter one of the following:</p>' +
		'<ul>' +
		'<li>The name of a place to look for, for example <code>London, England</code></li>' +
		'<li>The name or category of a POI to look for, using the keyword <code>near</code>, for example <code>supermarket near London, England</code> or <code>Tesco near London, England</code></li>' +
		'<li>GPS coordinates either in the format <code>lat,lon</code> or as an OpenStreetMap permalink, for example <code>48.1234,5.4321</code>, <code>http://www.openstreetmap.org/?lat=52.4382&amp;lon=13.4162&amp;zoom=14</code> or <code>http://osm.org/go/0MbBmCbE-</code></li>' +
		'<li><code>node 123</code>, <code>way 123</code>, <code>relation 123</code> or <code>trace 123</code> to display the OpenStreetMap object with the given ID</li>' +
		'<li>The URL of a GPX, KML, OSM or GML file to display it on the map.</li>' +
		'</ul>',
	"Search" : "Search",
	"Clear" : "Clear",
	"Shortest" : "Shortest",
	"Fastest" : "Fastest",
	"Car" : "By car",
	"Bicycle" : "By bicycle",
	"Foot" : "By foot",
	"Get directions" : "Get directions",
	"Hide directions" : "Hide directions",
	"No results found." : "No results found.",
	"No results found for %s." : "No results found for %s.",
	"Did you mean?" : "Did you mean?",
	"Found the following places:": "Found the following places:",
	"From" : "From",
	"To" : "To",
	"Loading" : "Loading",
	"Error" : "Error",
	"Distance" : "Distance",
	"Duration" : "Duration",
	"kilometers" : "kilometers",
	"hours" : "hours",
	"Optimise route points" : "Optimise route points",
	"Elevation profile" : "Elevation profile",
	"Tools" : "Tools",
	"OpenStreetMap" : "OpenStreetMap",
	"Google" : "Google",
	"Yahoo" : "Yahoo",
	"Other" : "Other",
	"Layers" : "Layers",
	"Other maps" : "Other maps",
	"Google Maps" : "Google Maps",
	"Yahoo Maps" : "Yahoo Maps",
	"Bing Maps" : "Bing Maps",
	"OSM Links" : "OSM Links"
});

})(FacilMap, OpenLayers, FacilMap.$);
