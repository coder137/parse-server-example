/*
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
	Adds a new user to the database.
	Input : JSON (username, password, email)
	Output : None.
*/
// Parse.Cloud.define('addUser', function(request, response) {

// 	var params = request.params;
// 	if (!params.username || !params.email || !params.password)
// 		return response.error("Missing parameters: need username, email, password");

// 	var user = new Parse.User({
// 		username : params.username,
// 		password : params.password,
// 		email : params.email 
// 	});

// 	user.signUp(null, {useMasterKey : true}).then((prof) => response.success(prof));
// });


/*
	Sets the ACL for the users.
	Input : JSON (username, password, email)
	Output : None.
*/
// Parse.Cloud.define('addACLUser', function(request, response) {
// 	var Note = Parse.Object.extend("User")
// 	var user = new Note();
// 	// var objectId = user.objectId;
// 	user.setACL(new Parse.ACL(Parse.User.current()));
// 	var acl = new Parse.ACL(Parse.User.current());
// 	acl.setPublicReadAccess(false);
// 	user.save().then((us) => response.success(us));
// });


/*
	Set device ACL.
*/
// Parse.Cloud.define('setDeviceACL', function(request, response) {
// 	var params = request.params;
// 	const Device = Parse.Object.extends("Device");
// 	var user = new Parse.user();
// 	var device = new Device();
// 	device.set("Name", params.name)
// 	device.setACL(new Parse.ACL(Parse.User.current(), set({
// 		useMasterKey: true
// 	})));
// 	device.save().then((dev) => response.success(dev));
// });


/*
	Querying Device Table.
*/
Parse.Cloud.define('registerDevice', function(request, response) {
	// Parse.Cloud.useMasterKey();
	if(!request.params.user) {
		throw "Enter username.";
		// Console.log("Enter username.")
	}
	var Device = Parse.Object.extend("Device");
	const device = new Device;
	var query = new Parse.Query(Device);
	query.equalTo("mac", request.params.mac);
	query.find().then(
		function(success){
			Console.log("Error. It exists.");
		},
		function(error){
			Console.log("Error.");
		}

	);
	var username = request.params.user;
	var acl = new Parse.ACL();
	acl.setPublicReadAccess(false);
	getId(username).then
	(
		function(user) {
			response.success(user);
			acl.setWriteAccess(user.id, true);
			acl.setReadAccess(user.id, true);
			device.setACL(acl);
			device.save();
			// Console.log(objectId);
		},
		function(error) {
			response.error(error);
		}

	);

	device.set("mac", request.params.mac);
	device.set("local_ip", request.params.local_ip);
	device.set("pin1", request.params.pin1);
	device.set("pin2", request.params.pin2);
	device.set("pin3", request.params.pin3);
	device.set("device_name", request.params.room);

	device.save()
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
			return error
		}
	});
};



