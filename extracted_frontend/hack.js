function Log(text)
{
    var t = document.createElement("LI");
    t.appendChild(document.createTextNode(text));
    document.body.appendChild(t);
}
 
function PrintObj(object)
{
    Log("Properties of object " + object.constructor.name);
    var props = '';
    for (var property in object) {
        Log("# " + property + ", type of " + (typeof property));     
    }
}
 
function hackMain() {
    Log("Starting...");
    if (typeof jQuery === 'undefined') {
      Log("jQuery is NOT available");
      return;
    } else {
      Log("jQuery is available");
    }
	var root = this;
    if (typeof root === 'undefined') {
      Log("root is NOT available");
      return;
    } else {
      Log("root is available");
    }
	var backend = root.backend;
    if (typeof backend === 'undefined') {
      Log("backend is NOT available");
      return;
    } else {
      Log("backend is available");
    }	
	PrintObj(backend);
    Log("Done.");
}