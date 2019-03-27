/*
Version 1.4
	Kshitij Bantupalli
		Fixed CPL permissions.
		Added "useMasterKey" for updating.
		Removed unnecessary code.

Version 1.3
	Kshitij Bantupalli
		I think I did it lads.
		When you call registerDevice() it queries the Device table it adds a new row and
		sets the device ACL to the user.


Version 1.2
	Kshitij Bantupalli
		Fixed typos.


Version 1.1
	Kshitij Bantupalli
		Refactored code for user ACL and fixed a bunch of permission stuff.
		Added promises for saves and master key permissions.


Version 1.0
	Last Edit : Kshitij Bantupalli
	TO DO: Fix potential bugs, need to test it.

*/


Parse.Cloud.define('hello', function(request, response) {
  response.success("Hello World");
});


/*
	Querying Device Table.
*/
Parse.Cloud.define('registerDevice', function(request, response) {
	// Parse.Cloud.useMasterKey();
	if(!request.params.user || !request.params.pin1 || !request.params.pin2 || !request.params.pin3 || !request.params.room) {
		throw "Missing data. Cannot continue.";
		// Console.log("Enter username.")
	}
	var Device = Parse.Object.extend("Device", {useMasterKey: true});
	console.log("Check 1");
	const device = new Device;
	var query = new Parse.Query(Device);
	query.equalTo("mac", request.params.mac);
	query.find().then(
		function(success){
			console.log("Error. It exists.");
		},
		function(error){
			console.log("Error.");
		}

	);
	console.log("Check 2");
	var username = request.params.user;
	var acl = new Parse.ACL({useMasterKey: true});
	acl.setPublicReadAccess(false, {useMasterKey: true});
	getId(username).then
	(
		function(user) {
			response.success(user);
			acl.setWriteAccess(user.id, true, 
				{useMasterKey: true});
			acl.setReadAccess(user.id, true, {useMasterKey: true});
			device.setACL(acl, {useMasterKey: true});
			device.save(null, {useMasterKey: true});
			// Console.log(objectId);
		},
		function(error) {
			throw "Cant access ACL's";
		}

	);

	console.log("Check 3");
	device.set("mac", request.params.mac, {useMasterKey : true});
	device.set("local_ip", request.params.local_ip, {useMasterKey: true});
	device.set("pin1", request.params.pin1, {useMasterKey: true});
	device.set("pin2", request.params.pin2, {useMasterKey: true});
	device.set("pin3", request.params.pin3, {useMasterKey: true});
	device.set("device_name", request.params.room, {useMasterKey: true});

	console.log("Check 4");
	device.save(null, {useMasterKey: true})
	.then((device) => {
		alert("Device created successfully.");
	}, (error) => {
		alert("Failure to create device.");
	});
});

function getId(user) {
	var userQuery = new Parse.Query(Parse.User);
	userQuery.equalTo("username", user);
	return userQuery.first
	({
		success: function(userRetrieved)
		{
			return userRetrieved;
		},
		error: function(error)
		{
			return "Couldn't execute first()."
		}
	});
};



