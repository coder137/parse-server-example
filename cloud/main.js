/*
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
Parse.Cloud.define('addUser', function(request, response) {

	var params = request.params;
	if (!params.username || !params.email || !params.password)
		return response.error("Missing parameters: need username, email, password");

	var user = new Parse.User({
		username : params.username,
		password : params.password,
		email : params.email 
	});

	user.signUp(null, {useMasterKey : true}).then((prof) => response.success(prof));
});


/*
	Sets the ACL for the users.
	Input : JSON (username, password, email)
	Output : None.
*/
Parse.Cloud.define('addACLUser', function(request, response) {
	var params = request.params;
	var user = new Parse.User({
		username : params.username,
		password : params.password,
		email :params.email
	});
	var objectId = user._getId();
	var acl = new Parse.ACL(user);
	var success = user.setACL(acl, set({
		ACL : objectId
	}))
});


/*
	Set device ACL.
*/
Parse.Cloud.define('setDeviceACL', function(request, response) {
	var params = request.params;
	const Device = Parse.Object.extends("Device");
	var user = new Parse.user();
	var device = const new Device();
	device.set("Name" : params.name)
	device.setACL(new Parse.ACL(Parse.User.Current()));
	device.save();
});




