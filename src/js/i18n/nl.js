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

ol.Lang.nl = ol.Util.extend(ol.Lang.nl, {
	"Zoom" : "Zoom",
	"Remove" : "Verwijderen",
	"attribution-osm" : "${rendering} / OpenStreetMap contributors <a href=\"http://www.openstreetmap.org/copyright\">©</a>",
	"attribution-relief" : "<a href=\"http://hikebikemap.de/\">Hike &amp; Bike Map</a>",
	"attribution-os-streetview" : "© Ordnance Survey, Crown copyright and database right 2010",
	"Create a marker" : "Marker maken",
	"Coordinates" : "Coördinaten",
	"unknown" : "onbekend",
	"Error parsing file." : "Fout bij gegevens ophalen.",
	"Latitude" : "Latitude (breedte)",
	"Longitude" : "Longitude (lengte)",
	"Get directions (OpenRouteService)" : "Route bepalen (OpenRouteService)",
	"OpenStreetMap Permalink" : "OpenStreetMap Permalink",
	"OpenStreetMap Shortlink" : "OpenStreetMap Shortlink",
	"Google Maps Permalink" : "Google Maps Permalink",
	"Yahoo Maps Permalink" : "Yahoo Maps Permalink",
	"OpenStreetMap Links" : "OpenStreetMap Links",
	"Wikimedia GeoHack" : "Wikimedia GeoHack",
	"Go home" : "Naar voorpagina",
	"Mapnik" : "Mapnik",
	"MapSurfer Road" : "MapSurfer Road",
	"MapSurfer Topographic" : "MapSurfer Topographic",
	"OpenStreetBrowser" : "OpenStreetBrowser",
	"OpenCycleMap" : "OpenCycleMap",
	"Reit- und Wanderkarte" : "Fiets- en wandelkaart",
	"Hike & Bike Map" : "Hike & Bike Map",
	"OpenPisteMap" : "OpenPisteMap",
	"ÖPNV-Karte" : "ÖPNV-Karte",
	"Google Streets" : "Google Streets",
	"Google Satellite" : "Google Satelliet",
	"Google Hybrid" : "Google Hybrid",
	"Google Terrain" : "Google Terrein",
	"Relief" : "Reliëf",
	"Hiking symbols" : "Wandelbeschrijvingen",
	"Coordinate grid" : "Coördinatensysteem",
	"Izometrická 3D mapa ČR" : "Izometrická 3D mapa ČR",
	"Streets overlay" : "Stratenlaag",
	"Labels overlay" : "Bijschriften",
	"OpenStreetBugs" : "OpenStreetBugs"
});

$.each({

}, function(i,it){ ol.Lang.nl["country."+i.toLowerCase()] = it; });

})(FacilMap, OpenLayers, FacilMap.$);
