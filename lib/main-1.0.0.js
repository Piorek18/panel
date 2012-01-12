var lib = this.lib || {};

lib.Utils = {
	sAuthor: "Konrad Kowalski",
	sWww: "http://konrad-kowalski.com/",
	sEmail: "kkowalskipl@gmail.com",
	sVersion: "1.0.0"
};


var Utils = lib.Utils || {};

Utils.Event = (function () {

	return {

		add: function (oTarget, sEventType, fnHandler, bCapture) {
			bCapture = bCapture || false;

			if (oTarget.attachEvent) { // IE browser
				oTarget.attachEvent("on" + sEventType, function () {
					fnHandler.call(oTarget);
				});
			} else if (oTarget.addEventListener) { // comply with DOM
				oTarget.addEventListener(sEventType, fnHandler, bCapture);
			} else { // other browser
				oTarget["on" + sEventType] = fnHandler;
			}
		},

		remove: function (oTarget, sEventType, fnHandler, bCapture) {
			bCapture = bCapture || false;
			
			if (oTarget.detachEvent) { // IE browser
				oTarget.detachEvent("on" + sEventType, function () {
					fnHandler.call(oTarget);
				});
			} else if (oTarget.removeEventListener) { // comply with DOM
				oTarget.removeEventListener(sEventType, fnHandler, bCapture);
			} else { // other browser
				oTarget["on" + sEventType] = null;
			}
		}

	};

})();

Utils.Array = (function () {

	return {

		isArray: function (oObj) {
			return typeof oObj === "object" && oObj !== null && typeof oObj.length !== "undefined" && typeof oObj.slice !== "undefined";
		},

		inArray: function (sParam, oArray) {
			for (var i = 0, iLen = oArray.length; i < iLen; i += 1) {
				if (oArray[i] === sParam) {
					return true;
				}
			}
			return false;
		},

		mixin: function (oTarget, aSource) {
			if (this.isArray(oTarget) && this.isArray(aSource)) {
				for (var i = 0, iLen = aSource.length, sElement; i < iLen; i += 1) {
					sElement = aSource[i];
					if (!this.inArray(sElement, oTarget)) {
						oTarget.push(sElement);
					}
				}
				oTarget.sort();
				return oTarget;
			} else {
				for (var sItem in aSource) {
					if (aSource.hasOwnProperty(sItem)) {
						oTarget[sItem] = aSource[sItem];
					}
				}
				return oTarget;
			}
		}

	};

})();

Utils.Ajax = (function () {
	var aCache = [];

	var handler = function (oSettings, oXhr) {
		var sMethod = "responseText";

		if (((oXhr.readyState === 4) || (oXhr.readyState === "complete")) && (oXhr.status === 200)) {
			aCache[oSettings.url] = oXhr;

			var bCt = oXhr.getResponseHeader("Content-Type");
			var aXmlct = ["application/xml", "text/xml"];

			if (Utils.Array.inArray(bCt, aXmlct)) {
				sMethod = "responseXML";
			}

			oSettings.fnDone.call(null, oXhr[sMethod]);
		}
	}

	var getXhr = function () {
		var oXhr;
		try {
			oXhr = new XMLHttpRequest();
		} catch (f) {
			try {
				oXhr = new ActiveXObject("Msxml2.XMLHTTP");
			} catch (a) {
				try {
					oXhr = new ActiveXObject("Microsoft.XMLHTTP");
				} catch (b) {
					// not support ajax
					return null;
				}
			}
		}
		return oXhr;
	}

	return {

		load: function (oConfig) {
			var oClient = null,
				oSettings = {
					sType: "post",
					bAsync: true,
					bCache: false,
					sUrl: null,
					sParams: '',
					oHeaders: {},
					fnDone: function (sData) {
						console.log(sData);
					}
				};

			oSettings = Utils.Array.mixin(oSettings, oConfig);
			oSettings.sType = oSettings.sType.toUpperCase();

			if (oSettings.bCache && aCache[oSettings.sUrl]) {
				handler.call(null, oSettings, aCache[oSettings.sUrl]);
			} else {
				oClient = getXhr();
				oClient.onreadystatechange = function () {
					handler.call(null, oSettings, oClient);
				};

				if (oSettings.sType == "GET")
					oSettings.sUrl += ('?' + oSettings.sParams);
				oClient.open(oSettings.sType, oSettings.sUrl, oSettings.bAsync);

				if (oSettings.oHeaders !== null) {
					for (var sHeader in oSettings.oHeaders) {
						if (oSettings.oHeaders.hasOwnProperty(sHeader)) {
							oClient.setRequestHeader(sHeader, oSettings.oHeaders[sHeader]);
						}
					}
				}

				if (oSettings.sType == "POST") {
					oClient.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
					oClient.setRequestHeader("Content-length", oSettings.sParams.length);
					oClient.setRequestHeader("Connection", "close");
					oClient.send(oSettings.sParams);
				} else {
					oClient.send(null);
				}
			}
		}

	};

})();

Utils.Browser = (function () {
	var aBrowsers = ["msie", "chrome", "safari", "opera", "mozilla", "konqueror"],
		sUserAgent = navigator.userAgent.toLowerCase(),
		sBrowser;

	return {

		getName: function () {
			for (var i = 0, iLen = aBrowsers.length; i < iLen; i += 1) {
				sBrowser = aBrowsers[i];
				if (new RegExp(sBrowser).test(sUserAgent)) {
					return sBrowser;
				}
			}
			return false;
		},

		getVersion: function () {
			var iCur;

			for (var i = 0, iLen = aBrowsers.length; i < iLen; i += 1) {
				sBrowser = aBrowsers[i];
				iCur = sUserAgent.indexOf(sBrowser);
				if (iCur !== -1) {
					return sUserAgent.substr(iCur + iLen + 1, 3);
				}
			}
			return false;
		}

	};

})();
