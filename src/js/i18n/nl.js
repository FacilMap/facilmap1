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
	"attribution-osm" : "Weergave: ${rendering} (CC-by-SA), Gegevens: <a href=\"http://www.openstreetmap.org/\">OpenStreetMap</a> (CC-by-SA)",
	"attribution-relief" : "Reliëf: <a href=\"http://hikebikemap.de/\">Hike &amp; Bike Map</a>",
	"attribution-oom-streets" : "Stratenlaag: <a href=\"http://oobrien.com/oom/\">OpenOrienteeringMap</a> (<a href=\"http://www.openstreetmap.org/\">OpenStreetMap</a>-gegevens, CC-by-SA)",
	"attribution-oom-labels" : "Bijschriften: <a href=\"http://oobrien.com/oom/\">OpenOrienteeringMap</a> (<a href=\"http://www.openstreetmap.org/\">OpenStreetMap</a>-gegevens, CC-by-SA)",
	"attribution-hiking" : "Wandelbeschrijvingen: <a href=\"http://osm.lonvia.de/world_hiking.html\">Lonvia's Hiking Map</a>/<a href=\"http://www.openstreetmap.org/\">OpenStreetMap</a>-gegevens, CC-by-SA",
	"attribution-os-streetview" : "Bevat Ordnance-Survey-gegevens, © Crown copyright and database right 2010",
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
	"Osmarender" : "Osmarender",
	"OpenCycleMap" : "OpenCycleMap",
	"Reit- und Wanderkarte" : "Fiets- en wandelkaart",
	"Hike & Bike Map" : "Hike & Bike Map",
	"OpenPisteMap" : "OpenPisteMap",
	"ÖPNV-Karte" : "ÖPNV-Karte",
	"Google Streets" : "Google Streets",
	"Google Satellite" : "Google Satelliet",
	"Google Hybrid" : "Google Hybrid",
	"Google Terrain" : "Google Terrein",
	"Google MapMaker" : "Google MapMaker",
	"Google MapMaker Hybrid" : "Google MapMaker Hybrid",
	"Yahoo Street" : "Yahoo Street",
	"Yahoo Satellite" : "Yahoo Satelliet",
	"Yahoo Hybrid" : "Yahoo Hybrid",
	"Relief" : "Reliëf",
	"Hiking symbols" : "Wandelbeschrijvingen",
	"Coordinate grid" : "Coördinatensysteem",
	"Izometrická 3D mapa ČR" : "Izometrická 3D mapa ČR",
	"Streets overlay" : "Stratenlaag",
	"Labels overlay" : "Bijschriften",
	"OpenStreetBugs" : "OpenStreetBugs"
});

$.each({
	"AF": "Afghanistan",
	"AL": "Albanië",
	"DZ": "Algerije",
	"AS": "Amerikaans-Samoa",
	"VI": "Amerikaanse Maagdeneilanden",
	"UM": "Amerikaanse ondergeschikte afgelegen eilanden",
	"AD": "Andorra",
	"AO": "Angola",
	"AI": "Anguilla",
	"AQ": "Antarctica",
	"AG": "Antigua en Barbuda",
	"AR": "Argentinië",
	"AM": "Armenië",
	"AW": "Aruba",
	"AU": "Australië",
	"AZ": "Azerbeidzjan",
	"BS": "Bahama's",
	"BH": "Bahrein",
	"BD": "Bangladesh",
	"BB": "Barbados",
	"BY": "Belarus; Wit-Rusland",
	"BE": "België",
	"BZ": "Belize",
	"BJ": "Benin",
	"BM": "Bermuda",
	"BT": "Bhutan",
	"BO": "Bolivia",
	"BA": "Bosnië en Herzegovina",
	"BW": "Botswana",
	"BV": "Bouveteiland",
	"BR": "Brazilië",
	"IO": "Brits Territorium in de Indische Oceaan",
	"VG": "Britse Maagdeneilanden",
	"BN": "Brunei",
	"BG": "Bulgarije",
	"BF": "Burkina Faso",
	"BI": "Burundi",
	"KH": "Cambodja",
	"CA": "Canada",
	"KY": "Caymaneilanden",
	"CF": "Centraal-Afrikaanse Republiek",
	"CL": "Chili",
	"CN": "China",
	"CX": "Christmaseiland",
	"CC": "Cocoseilanden",
	"CO": "Colombia",
	"KM": "Comoren",
	"CG": "Congo",
	"CK": "Cookeilanden",
	"CR": "Costa Rica",
	"CU": "Cuba",
	"CY": "Cyprus",
	"CD": "Democratische Republiek Congo",
	"DK": "Denemarken",
	"DJ": "Djibouti",
	"DM": "Dominica",
	"DO": "Dominicaanse Republiek",
	"DE": "Duitsland",
	"EC": "Ecuador",
	"EG": "Egypte",
	"SV": "El Salvador",
	"GQ": "Equatoriaal-Guinea",
	"ER": "Eritrea",
	"EE": "Estland",
	"ET": "Ethiopië",
	"FO": "Faeröer",
	"FK": "Falklandeilanden",
	"FJ": "Fiji",
	"PH": "Filipijnen",
	"FI": "Finland",
	"FR": "Frankrijk",
	"GF": "Frans-Guyana",
	"PF": "Frans-Polynesië",
	"TF": "Franse Gebieden in de zuidelijke Indische Oceaan",
	"GA": "Gabon",
	"GM": "Gambia",
	"GE": "Georgië",
	"GH": "Ghana",
	"GI": "Gibraltar",
	"GD": "Grenada",
	"GR": "Griekenland",
	"GL": "Groenland",
	"GP": "Guadeloupe",
	"GU": "Guam",
	"GT": "Guatemala",
	"GN": "Guinee",
	"GW": "Guinee-Bissau",
	"GY": "Guyana",
	"HT": "Haïti",
	"HM": "Heard- en McDonaldeilanden",
	"HN": "Honduras",
	"HU": "Hongarije",
	"HK": "Hongkong",
	"IS": "IJsland",
	"IE": "Ierland",
	"IN": "India",
	"ID": "Indonesië",
	"IQ": "Irak",
	"IR": "Iran",
	"IL": "Israël",
	"IT": "Italië",
	"CI": "Ivoorkust",
	"JM": "Jamaica",
	"JP": "Japan",
	"YE": "Jemen",
	"YU": "Joegoslavië",
	"JO": "Jordanië",
	"CV": "Kaapverdië",
	"CM": "Kameroen",
	"KZ": "Kazachstan",
	"KE": "Kenia; Kenya",
	"KG": "Kirgizië; Kirgizstan",
	"KI": "Kiribati",
	"KW": "Koeweit",
	"HR": "Kroatië",
	"LA": "Laos",
	"LS": "Lesotho",
	"LV": "Letland",
	"LB": "Libanon",
	"LR": "Liberia",
	"LY": "Libië",
	"LI": "Liechtenstein",
	"LT": "Litouwen",
	"LU": "Luxemburg",
	"MO": "Macau",
	"MG": "Madagaskar",
	"MW": "Malawi",
	"MV": "Maldiven",
	"MY": "Maleisië",
	"ML": "Mali",
	"MT": "Malta",
	"MA": "Marokko",
	"MH": "Marshalleilanden",
	"MQ": "Martinique",
	"MR": "Mauritanië",
	"MU": "Mauritius",
	"YT": "Mayotte",
	"MX": "Mexico",
	"FM": "Micronesia",
	"MD": "Moldavië",
	"MC": "Monaco",
	"MN": "Mongolië",
	"MS": "Montserrat",
	"MZ": "Mozambique",
	"MM": "Myanmar",
	"NA": "Namibië",
	"NR": "Nauru",
	"NL": "Nederland",
	"AN": "Nederlandse Antillen",
	"NP": "Nepal",
	"NI": "Nicaragua",
	"NC": "Nieuw-Caledonië",
	"NZ": "Nieuw-Zeeland",
	"NE": "Niger",
	"NG": "Nigeria",
	"NU": "Niue",
	"KP": "Noord-Korea",
	"MP": "Noordelijke Marianen",
	"NO": "Noorwegen",
	"NF": "Norfolkeiland",
	"UA": "Oekraïne",
	"UZ": "Oezbekistan",
	"OM": "Oman",
	"TL": "Oost-Timor",
	"AT": "Oostenrijk",
	"PK": "Pakistan",
	"PW": "Palau",
	"PA": "Panama",
	"PG": "Papoea-Nieuw-Guinea",
	"PY": "Paraguay",
	"PE": "Peru",
	"PN": "Pitcairneilanden",
	"PL": "Polen",
	"PT": "Portugal",
	"PR": "Puerto Rico; Porto Rico",
	"QA": "Qatar",
	"RE": "Réunion",
	"RO": "Roemenië",
	"RU": "Rusland",
	"RW": "Rwanda",
	"KN": "Saint Kitts en Nevis",
	"LC": "Saint Lucia",
	"VC": "Saint Vincent en de Grenadines",
	"PM": "Saint-Pierre en Miquelon",
	"SB": "Salomonseilanden",
	"WS": "Samoa",
	"SM": "San Marino",
	"ST": "Sao Tomé en Principe",
	"SA": "Saudi-Arabië; Saoedi-Arabië",
	"SN": "Senegal",
	"SC": "Seychellen",
	"SL": "Sierra Leone",
	"SG": "Singapore",
	"SH": "Sint-Helena",
	"SI": "Slovenië",
	"SK": "Slowakije; Slovakije",
	"SO": "Somalië",
	"ES": "Spanje",
	"LK": "Sri Lanka",
	"SD": "Sudan; Soedan",
	"SR": "Suriname",
	"SJ": "Svalbard en Jan Mayen",
	"SZ": "Swaziland",
	"SY": "Syrië",
	"TJ": "Tadzjikistan",
	"TW": "Taiwan",
	"TZ": "Tanzania",
	"TH": "Thailand",
	"TG": "Togo",
	"TK": "Tokelau-eilanden",
	"TO": "Tonga",
	"TT": "Trinidad en Tobago",
	"TD": "Tsjaad",
	"CZ": "Tsjechië",
	"TN": "Tunesië",
	"TR": "Turkije",
	"TM": "Turkmenistan",
	"TC": "Turks- en Caicoseilanden",
	"TV": "Tuvalu",
	"UG": "Uganda; Oeganda",
	"UY": "Uruguay",
	"VU": "Vanuatu",
	"VA": "Vaticaanstad",
	"VE": "Venezuela",
	"GB": "Verenigd Koninkrijk",
	"AE": "Verenigde Arabische Emiraten",
	"US": "Verenigde Staten",
	"VN": "Vietnam",
	"MK": "Voormalige Joegoslavische Republiek Macedonië",
	"WF": "Wallis en Futuna",
	"EH": "Westelijke Sahara",
	"ZM": "Zambia",
	"ZW": "Zimbabwe",
	"ZA": "Zuid-Afrika",
	"GS": "Zuid-Georgië en Zuidelijke Sandwicheilanden",
	"KR": "Zuid-Korea",
	"SE": "Zweden",
	"CH": "Zwitserland"
}, function(i,it){ ol.Lang.nl["country."+i.toLowerCase()] = it; });

})(FacilMap, OpenLayers, FacilMap.$);