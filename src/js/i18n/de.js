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
	"attribution-osm" : "Darstellung: ${rendering} (CC-by-SA), Daten: <a href=\"http://www.openstreetmap.org/\">OpenStreetMap</a> (CC-by-SA)",
	"attribution-relief" : "Reliefdarstellung: <a href=\"http://hikebikemap.de/\">Hike &amp; Bike Map</a>",
	"attribution-oom-streets" : "Straßenhybrid von <a href=\"http://oobrien.com/oom/\">OpenOrienteeringMap</a> (<a href=\"http://www.openstreetmap.org/\">OpenStreetMap</a>-Daten, CC-by-SA)",
	"attribution-oom-labels" : "Beschriftungen von <a href=\"http://oobrien.com/oom/\">OpenOrienteeringMap</a> (<a href=\"http://www.openstreetmap.org/\">OpenStreetMap</a>-Daten, CC-by-SA)",
	"attribution-hiking" : "Wanderbeschilderung von <a href=\"http://osm.lonvia.de/world_hiking.html\">Lonvia's Hiking Map</a>/<a href=\"http://www.openstreetmap.org/\">OpenStreetMap</a>-Daten, CC-by-SA",
	"attribution-os-streetview" : "Enthält Ordnance-Survey-Daten, © Crown copyright and database right 2010",
	"attribution-routing-yours" : "Route von <a href=\"http://www.yournavigation.org/\"><acronym title=\"Yet Another OpenStreetMap Routing Service\">YOURS</acronym></a> (<a href=\"http://www.openstreetmap.org/\">OpenStreetMap</a>-Daten, CC-by-SA)",
	"attribution-routing-cloudmade" : "Route von <a href=\"http://cloudmade.com/\">CloudMade</a> (<a href=\"http://www.openstreetmap.org/\">OpenStreetMap</a>-Daten, CC-by-SA)",
	"attribution-routing-mapquest" : "Route von <a href=\"http://open.mapquest.co.uk/\">MapQuest Open</a> (<a href=\"http://www.openstreetmap.org/\">OpenStreetMap</a>-Daten, CC-by-SA)",
	"attribution-poi" : "POI-Karte von <a href=\"http://olm.openstreetmap.de/\">OpenLinkMap</a> (<a href=\"http://www.openstreetmap.org/\">OpenStreetMap</a>-Daten, CC-by-SA)",
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
	"Osmarender" : "Osmarender",
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
	"Yahoo Street" : "Yahoo Karte",
	"Yahoo Satellite" : "Yahoo Satellit",
	"Yahoo Hybrid" : "Yahoo Hybrid",
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
	"olm.address" : "Adresse",
	"olm.contact" : "Kontakt",
	"olm.fuel" : "Tankstelle",
	"olm.gastro" : "Gastronomie und Hotel",
	"olm.other" : "Anderes",
	"olm.geographic" : "Geographie",
	"olm.wheelchair" : "Barrierefreiheit",
	"olm.accessibility" : "Erreichbarkeit",
	"olm.operator" : "Betreiber",
	"olm.phone" : "Telefon",
	"olm.fax" : "Fax",
	"olm.homepage" : "Homepage",
	"olm.wikipedia" : "Wikipedia",
	"olm.opening" : "Öffnungszeiten",
	"olm.email" : "E-Mail",
	"olm.mobile" : "Mobiltelefon",
	"olm.cuisine" : "Küche",
	"olm.stars" : "Sterne",
	"olm.smoking" : "Rauchen",
	"olm.smokingyes" : "erlaubt",
	"olm.nosmoking" : "verboten",
	"olm.dedicatedsmoking" : "Raucher erwünscht",
	"olm.separatedsmoking" : "Raucherbereich",
	"olm.isolatedsmoking" : "Raucherräume",
	"olm.beer" : "Biersorten",
	"olm.microbrew" : "mit Hausbrauerei",
	"olm.american" : "Amerikanisch",
	"olm.asian" : "Asiatisch",
	"olm.bavarian" : "Bayerisch",
	"olm.burger" : "Hamburger",
	"olm.chicken" : "Hähnchen",
	"olm.chinese" : "Chinesisch",
	"olm.coffee_shop" : "Kaffee",
	"olm.crepe" : "Crêpe",
	"olm.donut" : "Donuts",
	"olm.fish" : "Fisch",
	"olm.fish_and_chips" : "Fish & Chips",
	"olm.french" : "Französisch",
	"olm.german" : "Deutsch",
	"olm.greek" : "Griechisch",
	"olm.ice_cream" : "Eis",
	"olm.indian" : "Indisch",
	"olm.italian" : "Italienisch",
	"olm.japanese" : "Japanisch",
	"olm.kebab" : "Döner",
	"olm.mexican" : "Mexikanisch",
	"olm.pizza" : "Pizza",
	"olm.regional" : "Regional",
	"olm.sandwich" : "Sandwich",
	"olm.seafood" : "Fisch und Meeresfrüchte",
	"olm.spanish" : "Spanisch",
	"olm.steak_house" : "Steak",
	"olm.sushi" : "Sushi",
	"olm.thai" : "Thai",
	"olm.turkish" : "Türkisch",
	"olm.vietnamese" : "Vietnamesisch",
	"olm.diesel" : "Diesel",
	"olm.gtldiesel" : "Diesel, teilsynthetisch",
	"olm.hgvdiesel" : "LKW-Diesel",
	"olm.biodiesel" : "Biodiesel",
	"olm.octane91" : "Normalbenzin",
	"olm.octane95" : "Super",
	"olm.octane98" : "Super+",
	"olm.octane100" : "Hochleistungs-Kraftstoff",
	"olm.octane98l" : "Super verbleit",
	"olm.fuel25" : "Zweitakt 1:25",
	"olm.fuel50" : "Zweitakt 1:50",
	"olm.alcohol" : "Alkohol",
	"olm.ethanol" : "Ethanol",
	"olm.methanol" : "Methanol",
	"olm.svo" : "Pflanzenöl",
	"olm.e85" : "Ethanol-Kraftstoff (85% Ethanol, 15% Benzin)",
	"olm.biogas" : "Biogas",
	"olm.lpg" : "Autogas",
	"olm.cng" : "Erdgas",
	"olm.electro" : "Stromtankstelle",
	"olm.adblue" : "AdBlue",
	"olm.carwash" : "Waschanlage",
	"olm.carrepair" : "Autoreparatur",
	"olm.kiosk" : "Verkaufsraum",
	"olm.capacity" : "Kapazität",
	"olm.terminal" : "Internetterminal vorhanden",
	"olm.wlan" : "WLAN-Hotspot",
	"olm.wired" : "drahtgebundener Internetzugang",
	"olm.internetservice" : "Internetzugang über das Personal",
	"olm.fee" : "kostenpflichtig",
	"olm.nofee" : "kostenlos",
	"olm.intervalfee" : "zeitweise kostenpflichtigs",
	"olm.toll" : "mautpflichtig",
	"olm.disused" : "ungenutzt",
	"olm.ref" : "Nummer",
	"olm.ele" : "Höhe über Meer",
	"olm.population" : "Einwohnerzahl",
	"olm.iata" : "IATA",
	"olm.icao" : "ICAO",
	"olm.wheelchair" : "Rollstuhlgerecht",
	"olm.wheelchairno" : "nicht Rollstuhlgerecht",
	"olm.wheelchairlimited" : "eingeschränkt Rollstuhlgerecht",
	"olm.wheelchairtoilets" : "Rollstuhlgerechte Toiletten",
	"olm.wheelchairtoiletsno" : "nicht rollstuhlgerechte Toiletten",
	"olm.wheelchairtoiletslimited" : "eingeschränkt rollstuhlgerechte Toiletten",
	"olm.wheelchairrooms" : "Rollstuhlgerechte Räume",
	"olm.wheelchairroomsno" : "nicht rollstuhlgerechte Räume",
	"olm.wheelchairroomslimited" : "eingeschränkt rollstuhlgerechte Räume",
	"olm.wheelchairaccess" : "Rollstuhlgerechter Zugang",
	"olm.wheelchairaccessno" : "nicht rollstuhlgerechter Zugang",
	"olm.wheelchairaccesslimited" : "eingeschränkt rollstuhlgerechter Zugang",
	"olm.wheelchairplaces" : "Rollstuhlgerechte Sitzplätze",
	"olm.wheelchairplacesno" : "nicht rollstuhlgerechte Sitzpätze",
	"olm.wheelchairplaceslimited" : "eingeschränkt rollstuhlgerechte Sitzplätze",
	"olm.busstops" : "Bushaltestellen",
	"olm.busstop" : "Bushaltestelle",
	"olm.stations" : "Bahnhöfe / Stationen",
	"olm.station" : "Bahnhof / Station",
	"olm.tramhalts" : "Straßenbahn-Haltestellen",
	"olm.tramhalt" : "Straßenbahn-Haltestelle",
	"olm.parkings" : "Parkplätze",
	"olm.parking" : "Parkplatz",
	"olm.fullarticle" : "Kompletter Artikel",
	"olm.image" : "Bild",
	"olm.moreimages" : "Weitere Bilder",
	"olm.fullscreen" : "Vollbild",
	"olm.copyrightandbig" : "Lizenz, Autor, Originalseite",
	"olm.mo" : "Mo",
	"olm.tu" : "Di",
	"olm.we" : "Mi",
	"olm.th" : "Do",
	"olm.fr" : "Fr",
	"olm.sa" : "Sa",
	"olm.su" : "So",
	"olm.off" : "geschlossen",
	"olm.ph" : "Feiertage",
	"olm.sh" : "Schulferien",
	"olm.+" : "Ende offen",
	"olm.and" : "und",
	"olm.247" : "Mo-Fr 00:00-24:00",
	"olm.open" : "Geöffnet",
	"olm.closed" : "Geschlossen",
	"olm.maybeopen" : "In den Ferien und an Feiertagen geöffnet",
	"olm.seconds" : "Sekunden",
	"olm.second" : "Sekunde",
	"olm.minutes" : "Minuten",
	"olm.minute" : "Minute",
	"olm.hours" : "Stunden",
	"olm.hour" : "Stunde",
	"olm.days" : "Tage",
	"olm.day" : "Tag",
	"olm.weeks" : "Wochen",
	"olm.week" : "Woche",
	"olm.months" : "Monate",
	"olm.month" : "Monat",
	"olm.ago" : "her",
	"olm.moreThan" : "mehr als"
});

$.each({
	"EG": "Ägypten",
	"GQ": "Äquatorialguinea",
	"ET": "Äthiopien",
	"AT": "Österreich",
	"AF": "Afghanistan",
	"AL": "Albanien",
	"DZ": "Algerien",
	"AS": "Amerikanisch-Samoa",
	"VI": "Amerikanische Jungferninseln",
	"AD": "Andorra",
	"AO": "Angola",
	"AI": "Anguilla",
	"AQ": "Antarktis",
	"AG": "Antigua und Barbuda",
	"AR": "Argentinien",
	"AM": "Armenien",
	"AW": "Aruba",
	"AZ": "Aserbaidschan",
	"AU": "Australien",
	"BS": "Bahamas",
	"BH": "Bahrain",
	"BD": "Bangladesch",
	"BB": "Barbados",
	"BY": "Belarus",
	"BE": "Belgien",
	"BZ": "Belize",
	"BJ": "Benin",
	"BM": "die Bermudas",
	"BT": "Bhutan",
	"BO": "Bolivien",
	"BA": "Bosnien und Herzegowina",
	"BW": "Botsuana",
	"BV": "Bouvetinsel",
	"BR": "Brasilien",
	"VG": "Britische Jungferninseln",
	"IO": "Britisches Territorium im Indischen Ozean",
	"BN": "Brunei Darussalam",
	"BG": "Bulgarien",
	"BF": "Burkina Faso",
	"BI": "Burundi",
	"CI": "Côte d'Ivoire",
	"CL": "Chile",
	"CN": "China",
	"CK": "Cookinseln",
	"CR": "Costa Rica",
	"DK": "Dänemark",
	"CD": "Demokratische Republik Kongo",
	"KP": "Demokratische Volksrepublik Korea",
	"DE": "Deutschland",
	"DM": "Dominica",
	"DO": "Dominikanische Republik",
	"DJ": "Dschibuti",
	"EC": "Ecuador",
	"SV": "El Salvador",
	"ER": "Eritrea",
	"EE": "Estland",
	"FO": "Färöer",
	"FK": "Falklandinseln",
	"FJ": "Fidschi",
	"FI": "Finnland",
	"FR": "Frankreich",
	"GF": "Französisch-Guayana",
	"PF": "Französisch-Polynesien",
	"TF": "Französische Gebiete im südlichen Indischen Ozean",
	"GA": "Gabun",
	"GM": "Gambia",
	"GE": "Georgien",
	"GH": "Ghana",
	"GI": "Gibraltar",
	"GL": "Grönland",
	"GD": "Grenada",
	"GR": "Griechenland",
	"GP": "Guadeloupe",
	"GU": "Guam",
	"GT": "Guatemala",
	"GN": "Guinea",
	"GW": "Guinea-Bissau",
	"GY": "Guyana",
	"HT": "Haiti",
	"HM": "Heard und McDonaldinseln",
	"HN": "Honduras",
	"HK": "Hongkong",
	"IN": "Indien",
	"ID": "Indonesien",
	"IQ": "Irak",
	"IR": "Iran",
	"IE": "Irland",
	"IS": "Island",
	"IL": "Israel",
	"IT": "Italien",
	"JM": "Jamaika",
	"JP": "Japan",
	"YE": "Jemen",
	"JO": "Jordanien",
	"YU": "Jugoslawien",
	"KY": "Kaimaninseln",
	"KH": "Kambodscha",
	"CM": "Kamerun",
	"CA": "Kanada",
	"CV": "Kap Verde",
	"KZ": "Kasachstan",
	"QA": "Katar",
	"KE": "Kenia",
	"KG": "Kirgisistan",
	"KI": "Kiribati",
	"UM": "Kleinere amerikanische Überseeinseln",
	"CC": "Kokosinseln",
	"CO": "Kolumbien",
	"KM": "Komoren",
	"CG": "Kongo",
	"HR": "Kroatien",
	"CU": "Kuba",
	"KW": "Kuwait",
	"LA": "Laos",
	"LS": "Lesotho",
	"LV": "Lettland",
	"LB": "Libanon",
	"LR": "Liberia",
	"LY": "Libyen",
	"LI": "Liechtenstein",
	"LT": "Litauen",
	"LU": "Luxemburg",
	"MO": "Macau",
	"MG": "Madagaskar",
	"MW": "Malawi",
	"MY": "Malaysia",
	"MV": "Malediven",
	"ML": "Mali",
	"MT": "Malta",
	"MK": "ehemalige jugoslawische Republik Mazedonien",
	"MA": "Marokko",
	"MH": "Marshallinseln",
	"MQ": "Martinique",
	"MR": "Mauretanien",
	"MU": "Mauritius",
	"YT": "Mayotte",
	"MX": "Mexiko",
	"FM": "Mikronesien",
	"MC": "Monaco",
	"MN": "Mongolei",
	"MS": "Montserrat",
	"MZ": "Mosambik",
	"MM": "Myanmar",
	"MP": "Nördliche Marianen",
	"NA": "Namibia",
	"NR": "Nauru",
	"NP": "Nepal",
	"NC": "Neukaledonien",
	"NZ": "Neuseeland",
	"NI": "Nicaragua",
	"AN": "Niederländische Antillen",
	"NL": "Niederlande",
	"NE": "Niger",
	"NG": "Nigeria",
	"NU": "Niue",
	"NF": "Norfolkinsel",
	"NO": "Norwegen",
	"OM": "Oman",
	"TL": "Osttimor",
	"PK": "Pakistan",
	"PW": "Palau",
	"PA": "Panama",
	"PG": "Papua-Neuguinea",
	"PY": "Paraguay",
	"PE": "Peru",
	"PH": "Philippinen",
	"PN": "Pitcairninseln",
	"PL": "Polen",
	"PT": "Portugal",
	"PR": "Puerto Rico",
	"RE": "Réunion",
	"KR": "Republik Korea",
	"MD": "Republik Moldau",
	"RW": "Ruanda",
	"RO": "Rumänien",
	"RU": "Russische Föderation",
	"ST": "São Tomé und Príncipe",
	"ZA": "Südafrika",
	"GS": "Südgeorgien und Südliche Sandwichinseln",
	"SB": "Salomonen",
	"ZM": "Sambia",
	"WS": "Samoa",
	"SM": "San Marino",
	"SA": "Saudi-Arabien",
	"SE": "Schweden",
	"CH": "Schweiz",
	"SN": "Senegal",
	"SC": "Seychellen",
	"SL": "Sierra Leone",
	"ZW": "Simbabwe",
	"SG": "Singapur",
	"SK": "Slowakei",
	"SI": "Slowenien",
	"SO": "Somalia",
	"ES": "Spanien",
	"LK": "Sri Lanka",
	"SH": "St. Helena",
	"KN": "St. Kitts und Nevis",
	"LC": "St. Lucia",
	"PM": "St. Pierre und Miquelon",
	"VC": "St. Vincent und die Grenadinen",
	"SD": "Sudan",
	"SR": "Suriname",
	"SJ": "Svalbard und Jan Mayen",
	"SZ": "Swasiland",
	"SY": "Syrien",
	"TR": "Türkei",
	"TJ": "Tadschikistan",
	"TW": "Taiwan",
	"TZ": "Tansania",
	"TH": "Thailand",
	"TG": "Togo",
	"TK": "Tokelau",
	"TO": "Tonga",
	"TT": "Trinidad und Tobago",
	"TD": "Tschad",
	"CZ": "Tschechische Republik",
	"TN": "Tunesien",
	"TM": "Turkmenistan",
	"TC": "Turks- und Caicosinseln",
	"TV": "Tuvalu",
	"UG": "Uganda",
	"UA": "Ukraine",
	"HU": "Ungarn",
	"UY": "Uruguay",
	"UZ": "Usbekistan",
	"VU": "Vanuatu",
	"VA": "Vatikanstadt",
	"VE": "Venezuela",
	"AE": "Vereinigte Arabische Emirate",
	"US": "Vereinigte Staaten",
	"GB": "Vereinigtes Königreich",
	"VN": "Vietnam",
	"WF": "Wallis und Futuna",
	"CX": "Weihnachtsinsel",
	"EH": "Westsahara",
	"CF": "Zentralafrikanische Republik",
	"CY": "Zypern"
}, function(i,it){ ol.Lang.de["country."+i.toLowerCase()] = it; });

})(FacilMap, OpenLayers, FacilMap.$);