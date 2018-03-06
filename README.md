# bfp4f-reverse
CREDITS TO WARRANTY VOIDER
files and info for bfp4f reversing
For bypassing SSL check the fake cert, zlib.dll was chosen to inject code to bypass it - so the dll with the bypass has to be called "zlib.dll" (so it gets loaded first, like a proxy) and the original dll has to be renamed to "zlib_org.dll" - you can control the game exe from the webbrowser, from within memory via zlib.dll or by settings in blaze packets - blaze is a protocol which essentially mimics remote procdure(RPC) calls with a custom binary xml format - blaze does no ingame traffic, like position updates or shots, instead its for all the "managing" around a match, the actual game traffic is usually UDP anyway


- blaze packets contain a header and a payload, the header tells which procedure to tell, the payload contains its calling data - the header defines a combination of "component"
and "command", like f.e.
"AuthComponent"
and its member
function "preAuth" - you need to implement all called functions from all used components

 - in order to guess at least the structure you need to find the TdfInfoMaps(see taginfomaps.txt) - in order to guess its content you need to find the actual handler functions(see taginfomaps.txt) - payload has a treelike structure of "fields"
that have a label and data, the data in turn can be f.e.a list of more fields, etc. - the labels are always 4 uppercase letters(including space) and are encoded in 3 bytes (see packetviewer)
 
    -for converting those, or blazelib code) - 
EA own SSL is called "ProtoSSL" (see download.txt), this can be used to find the functions - there is a 2015 and 2010 client, but only a 2010 server, that got leaked, and all my re is done mostly on the 2015 client alone, the server should behave similar, just asksfor other commands ofc-as for bfp4f theres no live server to watch traffic from, you can make assumption by comparing with bf4 and me3 blaze emulator(see download.txt)
 
 127.0.0.1 gosredirector.ea.com
 127.0.0.1 battlefield.play4free.ea.com
 127.0.0.1 battlefield.com

redirection in hosts file makes the OS return where the Client want's to connect
