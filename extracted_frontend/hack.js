function Log(text)
{
    var t = document.createElement("LI");
    t.appendChild(document.createTextNode(text));
    document.body.appendChild(t); 
}

function hackRefreshPage()
{
    window.location.reload(true);
}

function hackMain() {
    Log("Starting...");
    if (typeof jQuery === 'undefined') {
      Log("jQuery is NOT available");
      return;
    } else {
      Log("jQuery is available");
    }
	var test = this;
    if (typeof test === 'undefined') {
      Log("test is NOT available");
      return;
    } else {
      Log("test is available");
    }
	Log(test.constructor.name);
    var array = Object.getOwnPropertyNames(test);
    array.sort();
    var arrayLength = array.length;
    Log(arrayLength);
    for (var i = 0; i < arrayLength; i++) {
        Log(array[i]);
    }
    Log("Done.");
}

function hackTest()
{
	this.game.playNow();
	Log("Ok");
}