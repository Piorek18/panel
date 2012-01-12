Utils.Event.add(window, "load", function () {

	Utils.Ajax.load({
		sType: "post",
		sUrl: "test.php",
		sParams: "nazwa1=abcdefg&nazwa2=hehehe&abc1=123&abc2=qwe",
		fnDone: function (sData) {
			console.log(sData);
		}
	});

}, true);
