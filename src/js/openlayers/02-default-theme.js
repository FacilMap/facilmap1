(function(undefined) {

	var initializeBkp = OpenLayers.Map.prototype.initialize;

	OpenLayers.Map.prototype.initialize = function(div, options) {
		if(options.theme === undefined)
			options.theme = null;

		return initializeBkp.apply(this, arguments);
	};

	OpenLayers._fm = true;

})();