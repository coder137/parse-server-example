Parse.Cloud.define('hello', function (request, response) {
  response.success("Hello World");
});


// NOTE, We will only be getting the following data
// mac_address, local_ip
// ! IMPORTANT
// NOT GET, DeviceName, pin1, pin2, pin3, pin4, roomName, pin1Asset, pin2Asset, pin3Asset, pin4Asset
// TODO, Add variable addition of the above variables
Parse.Cloud.define('registerDevice', async function (request, response) {

  var params = request.params;
  var currentuser = request.user;

  // ? debugging
  // console.log(params);
  // console.log(currentuser);

  if (currentuser == undefined) {
    response.error("Supply the current user");
    return;
  }

  var deviceMac = params.mac;
  var localIp = params.local_ip;

  // Check if params are supplied
  if (deviceMac == undefined || localIp == undefined) {
    response.error("Supply mac and local_ip parameters");
    return;
  }

  /// Check if device is already registered
  var query = new Parse.Query("Devices");
  query.equalTo("mac", deviceMac);
  try {
    const count = await query.count({ useMasterKey: true });
    if (count != 0) {
      response.error("Device is already registered");
      return;
    }
  } catch (err) {
    response.error(err);
    return;
  }

  var pinConst = {
    "pin_name": "",
    "type": "switch",
    "value": 0
  };

  const Devices = Parse.Object.extend("Devices", { useMasterKey: true });
  const device = new Devices();

  // Set the Schema here
  device.set("mac", deviceMac);
  device.set("local_ip", localIp);

  device.set("device_name", "");
  device.set("pin1", pinConst);
  device.set("pin2", pinConst);
  device.set("pin3", pinConst);
  device.set("pin4", pinConst);

  device.set("roomName", "");
  device.set("pin1Asset", 0);
  device.set("pin2Asset", 0);
  device.set("pin3Asset", 0);
  device.set("pin4Asset", 0);

  var acl = currentuser.getACL();
  acl.setPublicReadAccess(false);
  acl.setPublicWriteAccess(false);
  acl.setWriteAccess(currentuser.id, true)
  acl.setReadAccess(currentuser.id, true);
  device.setACL(acl);

  try {
    var savedObject = await device.save(null, { useMasterKey: true });
    response.success("Created device: " + savedObject.id);
  } catch (err) {
    response.error(err);
    return;
  }
});
