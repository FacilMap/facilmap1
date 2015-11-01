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
 * An implementation of the NameFinder that contacts Nominatim (http://wiki.openstreetmap.org/wiki/Nominatim).
*/

FacilMap.NameFinder.Nominatim = ol.Class(fm.NameFinder, {
	nameFinderURL : "https://nominatim.openstreetmap.org/search",
	limit : 25,
	attribution : ol.String.format(ol.i18n("attribution-osm"), { rendering: "<a href=\"https://nominatim.openstreetmap.org/search\">OpenStreetMap Nominatim</a>" }),

	stateAbbr : {
		"us" : {
			"alabama" : "AL",
			"alaska" : "AK",
			"arizona" : "AZ",
			"arkansas" : "AR",
			"california" : "CA",
			"colorado" : "CO",
			"connecticut" : "CT",
			"delaware" : "DE",
			"florida" : "FL",
			"georgia" : "GA",
			"hawaii" : "HI",
			"idaho" : "ID",
			"illinois" : "IL",
			"indiana" : "IN",
			"iowa" : "IA",
			"kansas" : "KS",
			"kentucky" : "KY",
			"louisiana" : "LA",
			"maine" : "ME",
			"maryland" : "MD",
			"massachusetts" : "MA",
			"michigan" : "MI",
			"minnesota" : "MN",
			"mississippi" : "MS",
			"missouri" : "MO",
			"montana" : "MT",
			"nebraska" : "NE",
			"nevada" : "NV",
			"new hampshire" : "NH",
			"new jersey" : "NJ",
			"new mexico" : "NM",
			"new york" : "NY",
			"north carolina" : "NC",
			"north dakota" : "ND",
			"ohio" : "OH",
			"oklahoma" : "OK",
			"oregon" : "OR",
			"pennsylvania" : "PA",
			"rhode island" : "RI",
			"south carolina" : "SC",
			"south dakota" : "SD",
			"tennessee" : "TN",
			"texas" : "TX",
			"utah" : "UT",
			"vermont" : "VT",
			"virginia" : "VA",
			"washington" : "WA",
			"west virginia" : "WV",
			"wisconsin" : "WI",
			"wyoming" : "WY"
		},
		"it" : {
			"agrigento" : "AG",
			"alessandria" : "AL",
			"ancona" : "AN",
			"aosta" : "AO",
			"arezzo" : "AR",
			"ascoli piceno" : "AP",
			"asti" : "AT",
			"avellino" : "AV",
			"bari" : "BA",
			"barletta" : "BT",
			"barletta-andria-trani" : "BT",
			"belluno" : "BL",
			"benevento" : "BN",
			"bergamo" : "BG",
			"biella" : "BI",
			"bologna" : "BO",
			"bolzano" : "BZ",
			"brescia" : "BS",
			"brindisi" : "BR",
			"cagliari" : "CA",
			"caltanissetta" : "CL",
			"campobasso" : "CB",
			"carbonia-iglesias" : "CI",
			"caserta" : "CE",
			"catania" : "CT",
			"catanzaro" : "CZ",
			"chieti" : "CH",
			"como" : "CO",
			"cosenza" : "CS",
			"cremona" : "CR",
			"crotone" : "KR",
			"cuneo" : "CN",
			"enna" : "EN",
			"fermo" : "FM",
			"ferrara" : "FE",
			"firenze" : "FI",
			"foggia" : "FG",
			"forli-cesena" : "FC",
			"frosinone" : "FR",
			"genova" : "GE",
			"gorizia" : "GO",
			"grosseto" : "GR",
			"imperia" : "IM",
			"isernia" : "IS",
			"la spezia" : "SP",
			"l'aquila" : "AQ",
			"latina" : "LT",
			"lecce" : "LE",
			"lecco" : "LC",
			"livorno" : "LI",
			"lodi" : "LO",
			"lucca" : "LU",
			"macerata" : "MC",
			"mantova" : "MN",
			"massa e carrara" : "MS",
			"matera" : "MT",
			"medio campidano" : "VS",
			"messina" : "ME",
			"milano" : "MI",
			"modena" : "MO",
			"monza e brianza" : "MB",
			"napoli" : "NA",
			"novara" : "NO",
			"nuoro" : "NU",
			"ogliastra" : "OG",
			"olbia-tempio" : "OT",
			"oristano" : "OR",
			"padova" : "PD",
			"palermo" : "PA",
			"parma" : "PR",
			"pavia" : "PV",
			"perugia" : "PG",
			"pesaro e urbino" : "PU",
			"pescara" : "PE",
			"piacenza" : "PC",
			"pisa" : "PI",
			"pistoia" : "PT",
			"pordenone" : "PN",
			"potenza" : "PZ",
			"prato" : "PO",
			"ragusa" : "RG",
			"ravenna" : "RA",
			"reggio calabria" : "RC",
			"reggio emilia" : "RE",
			"rieti" : "RI",
			"rimini" : "RN",
			"roma" : "RM",
			"rovigo" : "RO",
			"salerno" : "SA",
			"sassari" : "SS",
			"savona" : "SV",
			"siena" : "SI",
			"siracusa" : "SR",
			"sondrio" : "SO",
			"taranto" : "TA",
			"teramo" : "TE",
			"terni" : "TR",
			"torino" : "TO",
			"trapani" : "TP",
			"trento" : "TN",
			"treviso" : "TV",
			"trieste" : "TS",
			"udine" : "UD",
			"varese" : "VA",
			"venezia" : "VE",
			"verbano" : "VB",
			"verbano-cusio-ossola" : "VB",
			"vercelli" : "VC",
			"verona" : "VR",
			"vibo valentia" : "VV",
			"vicenza" : "VI",
			"viterbo" : "VT"
		},
		"ca" : {
			"ontario" : "ON",
			"quebec" : "QC",
			"nova scotia" : "NS",
			"new brunswick" : "NB",
			"manitoba" : "MB",
			"british columbia" : "BC",
			"prince edward island" : "PE",
			"saskatchewan" : "SK",
			"alberta" : "AB",
			"newfoundland and labrador" : "NL"
		},
		"au" : {
			"australian capital territory" : "ACT",
			"jervis bay territory" : "JBT",
			"new south wales" : "NSW",
			"northern territory" : "NT",
			"queensland" : "QLD",
			"south australia" : "SA",
			"tasmania" : "TAS",
			"victoria" : "VIC",
			"western australia" : "WA"
		}
	},

	find : function(query, callbackFunction) {
		query.replace(/^\s+/, "").replace(/\s+$/, "");

		var t = this;

		fm.NameFinder.prototype.find.apply(this, [ query, function(results) {
			if(results != undefined && results.length > 0)
				callbackFunction(results);
			else
			{ // NameFinder
				ol.Request.GET({
					url : t.nameFinderURL,
					params : { "q": query, "format" : "xml", "polygon" : "0", "addressdetails" : "1", "limit" : t.limit },
					success : function(request) {
						var results = [ ];
						$("searchresults > place", request.responseXML).each(function(){
							var place = $(this);

							var box = place.attr("boundingbox").split(",");
							results.push({
								id : place.attr("place_id"),
								lonlat : new ol.LonLat(place.attr("lon"), place.attr("lat")),
								info : place.attr("type"),
								icon : place.attr("icon"),
								name : t.makeDisplayName(place),
								getZoom : function(map) {
									return map.getZoomForExtent(fm.Util.toMapProjection(new ol.Bounds(box[2], box[1], box[3], box[0]), map));
								},
								osm : null,
								rank : 1*place.attr("place_rank")
							});
						});

						for(var i=0; i<results.length; i++)
						{
							for(var j=i; j > 0 && results[j-1].rank > results[j].rank; j--)
							{
								var tmp = results[j];
								results[j] = results[j-1];
								results[j-1] = tmp;
							}
						}

						callbackFunction(results);
					},
					failure : function() {
						callbackFunction();
					}
				});
			}
		} ]);
	},

	findNear : function(query, near, callback) {
		var lonlat = this.isLonLatQuery(near);
		if(lonlat)
			near = "["+lonlat.lonlat.lat+","+lonlat.lonlat.lon+"]";
		this.find(query+" near "+near, callback);
	},

	/**
	 * Tries to format a search result in a readable way according to the address notation habits in
	 * the appropriate country.
	 * @param xmlResult {Element} A place XML element as returned by Nominatim
	 * @return {String} A readable name for the search result
	 */
	makeDisplayName : function(xmlResult) {
		// See http://en.wikipedia.org/wiki/Address_%28geography%29#Mailing_address_format_by_country for
		// address notation guidelines

		var first = $(">:first-child", xmlResult);
		var type = first[0].tagName;
		var name = first.text();
		var countryCode = $("country_code", xmlResult).text();

		var road = $("road", xmlResult).text();
		var housenumber = $("house_number", xmlResult).text();
		var suburb = $($("town,suburb,village,hamlet,residential", xmlResult)[0]).text();
		var postcode = $("postcode", xmlResult).text();
		var city = $("city", xmlResult).text();
		var county = $("county", xmlResult).text();
		var state = $("state", xmlResult).text();

		if($.inArray(type, [ "road", "residential", "town", "suburb", "village", "hamlet", "residential", "city", "county", "state" ]) != -1)
			name = "";

		if(!city && suburb)
		{
			city = suburb;
			suburb = "";
		}

		if(road)
		{
			switch(countryCode)
			{
				case "pl":
					road = "ul. "+road;
					break;
				case "ro":
					road = "str. "+road;
					break;
			}
		}

		// Add house number to road
		if(road && housenumber)
		{
			switch(countryCode)
			{
				case "ar":
				case "at":
				case "ca":
				case "de":
				case "hr":
				case "cz":
				case "dk":
				case "fi":
				case "is":
				case "il":
				case "it":
				case "nl":
				case "no":
				case "pe":
				case "pl":
				case "sk":
				case "si":
				case "se":
				case "tr":
					road += " "+housenumber;
					break;
				case "be":
				case "es":
					road += ", "+housenumber;
					break;
				case "cl":
					road += " N° "+housenumber;
					break;
				case "hu":
					road += " "+housenumber+".";
					break;
				case "id":
					road += " No. "+housenumber;
					break;
				case "my":
					road = "No." +housenumber+", "+road;
					break;
				case "ro":
					road += ", nr. "+road;
					break;
				case "au":
				case "fr":
				case "hk":
				case "ie":
				case "in":
				case "nz":
				case "sg":
				case "lk":
				case "tw":
				case "gb":
				case "us":
				default:
					road += housenumber+" "+road;
					break;
			}
		}

		// Add postcode and districts to city
		switch(countryCode)
		{
			case "ar":
				if(postcode && city)
					city = postcode+", "+city;
				else if(postcode)
					city = postcode;
				break;
			case "at":
			case "ch":
			case "de":
				if(city)
				{
					if(suburb)
						city += "-"+(suburb);
					suburb = null;
					if(type == "suburb" || type == "residential")
						type = "city";

					if(postcode)
						city = postcode+" "+city;
				}
				break;
			case "be":
			case "hr":
			case "cz":
			case "dk":
			case "fi":
			case "fr":
			case "hu":
			case "is":
			case "il":
			case "my":
			case "nl":
			case "no":
			case "sk":
			case "si":
			case "es":
			case "se":
			case "tr":
				if(city && postcode)
					city = postcode+" "+city;
				break;
			case "au":
			case "ca":
			case "us":
				if(city && state)
				{
					var stateAbbr = this.stateAbbr[countryCode][state.toLowerCase()];
					if(stateAbbr)
					{
						city += " "+stateAbbr;
						state = null;
					}
				}
				if(city && postcode)
					city += " "+postcode;
				else if(postcode)
					city = postcode;
				break;
			case "it":
				if(city)
				{
					if(county)
					{
						var countyAbbr = this.stateAbbr.it[county.toLowerCase().replace(/ì/g, "i")];
						if(countyAbbr)
						{
							city += " ("+countyAbbr+")";
							county = null;
						}
					}
					if(postcode)
						city  = postcode+" "+city;
				}
				break;
			case "ro":
				if(city && county)
				{
					city += ", jud. "+county;
					county = null;
				}
				if(city && postcode)
					city += ", "+postcode;
				break;
			case "cl":
			case "hk":
				// Postcode rarely/not used
			case "ie":
			case "in":
			case "id":
			case "nz":
			case "pe":
			case "sg":
			case "lk":
			case "tw":
			case "gb":
			default:
				if(city && postcode)
					city = city+" "+postcode;
				else if(postcode)
					city = postcode;
				break;
		}

		var result = [ ];

		if(name)
			result.push(name);
		if(road)
			result.push(road);
		if(suburb)
			result.push(suburb);
		if(city)
			result.push(city);
		if($.inArray(type, [ "residential", "town", "suburb", "village", "hamlet", "residential", "city", "county", "state" ]) != -1)
		{ // Searching for a town
			if(county && county != city)
				result.push(county);
			if(state && state != city)
				result.push(state);
		}

		if(countryCode)
			result.push(ol.i18n("country."+countryCode));

		return result.join(", ");
	},

	CLASS_NAME : "FacilMap.NameFinder.Nominatim"
});

})(FacilMap, OpenLayers, FacilMap.$);