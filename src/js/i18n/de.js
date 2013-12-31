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
	along with FacilchangeOpacityMap.  If not, see <http://www.gnu.org/licenses/>.

	Obtain the source code from http://gitorious.org/facilmap.
*/

(function(fm, ol, $){

ol.Lang.de = ol.Util.extend(ol.Lang.de, {
	"Zoom" : "Zoom",
	"Remove" : "Entfernen",
	"attribution-osm" : "${rendering} / OpenStreetMap-Mitwirkende <a href=\"http://www.openstreetmap.org/copyright\">©</a>",
	"attribution-relief" : "<a href=\"http://hikebikemap.de/\">Hike &amp; Bike Map</a>",
	"attribution-os-streetview" : "© Ordnance Survey, Crown copyright and database right 2010",
	"Create a marker" : "Marker anlegen",
	"Coordinates" : "Koordinaten",
	"unknown" : "unbekannt",
	"Error parsing file." : "Fehler beim Parsen der Datei.",
	"Latitude" : "Breite",
	"Longitude" : "Länge",
	"OpenStreetMap Permalink" : "OpenStreetMap Permalink",
	"OpenStreetMap Shortlink" : "OpenStreetMap Shortlink",
	"Google Maps Permalink" : "Google Maps Permalink",
	"Yahoo Maps Permalink" : "Yahoo Maps Permalink",
	"OpenStreetMap Links" : "OpenStreetMap Links",
	"Wikimedia GeoHack" : "Wikimedia GeoHack",
	"Go home" : "Zum Aufenthaltsort",
	"Mapnik" : "Mapnik",
	"MapSurfer Road" : "MapSurfer Road",
	"MapSurfer Topographic" : "MapSurfer Topographic",
	"OpenStreetBrowser" : "OpenStreetBrowser",
	"OpenCycleMap" : "OpenCycleMap",
	"Reit- und Wanderkarte" : "Reit- und Wanderkarte",
	"Hike & Bike Map" : "Hike & Bike Map",
	"OpenPisteMap" : "OpenPisteMap",
	"ÖPNV-Karte" : "ÖPNV-Karte",
	"Google Streets" : "Google Karte",
	"Google Satellite" : "Google Satellit",
	"Google Hybrid" : "Google Hybrid",
	"Google Terrain" : "Google Gelände",
	"Google MapMaker" : "Google MapMaker",
	"Google MapMaker Hybrid" : "Google MapMaker Hybrid",
	"Relief" : "Relief",
	"Hiking symbols" : "Wanderbeschilderung",
	"Coordinate grid" : "Koordinatensystem",
	"Izometrická 3D mapa ČR" : "Izometrická 3D mapa ČR",
	"Streets overlay" : "Straßen-Hybrid",
	"Labels overlay" : "Beschriftungen",
	"Links to other maps" : "Auf andere Karten",
	"Tags" : "Attribute",
	"POI" : "POI",
	"OpenStreetBugs" : "OpenStreetBugs",
	"License" : "Lizenz",
	"Search help" : "Suchhilfe",
	// TODO: searchHelpText
	"Distance" : "Entfernung",
	"Duration" : "Dauer",
	"kilometers" : "Kilometer",
	"hours" : "Stunden",
	"Optimise route points" : "Routenpunkte optimieren",
	"Elevation profile" : "Höhenprofil",
	"Layers" : "Karten"
});

$.each({

}, function(i,it){ ol.Lang.de["country."+i.toLowerCase()] = it; });

})(FacilMap, OpenLayers, FacilMap.$);
