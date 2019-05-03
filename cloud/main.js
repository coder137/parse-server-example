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

  // Check if params are supplied
  if (deviceMac == undefined) {
    response.error("Supply mac parameter");
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

  var localIp = getString(params.local_ip);
  var deviceName = getString(params.device_name);
  var roomName = getString(params.roomName);

  var pin1 = getPinValue(params.pin1_name, params.pin1_type);
  var pin2 = getPinValue(params.pin2_name, params.pin2_type);
  var pin3 = getPinValue(params.pin3_name, params.pin3_type);
  var pin4 = getPinValue(params.pin4_name, params.pin4_type);

  var pin1Asset = getPinAsset(params.pin1Asset);
  var pin2Asset = getPinAsset(params.pin2Asset);
  var pin3Asset = getPinAsset(params.pin3Asset);
  var pin4Asset = getPinAsset(params.pin4Asset);

  const Devices = Parse.Object.extend("Devices", { useMasterKey: true });
  const device = new Devices();

  // Set the Schema here
  device.set("mac", deviceMac);
  device.set("local_ip", localIp);

  device.set("device_name", deviceName);
  device.set("pin1", pin1);
  device.set("pin2", pin2);
  device.set("pin3", pin3);
  device.set("pin4", pin4);

  device.set("roomName", roomName);
  device.set("pin1Asset", pin1Asset);
  device.set("pin2Asset", pin2Asset);
  device.set("pin3Asset", pin3Asset);
  device.set("pin4Asset", pin4Asset);

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

function getString(assetName) {
  if (assetName == undefined) assetName = "";
  return assetName;
}

function getPinAsset(assetNumber) {
  if (assetNumber == undefined) assetNumber = 0;
  return assetNumber;
}


function getPinValue(pinName, pinType) {
  if (pinName == undefined) pinName = "";
  if (pinType == undefined) pinType = "";
  return {
    "pin_name": pinName,
    "type": pinType,
    "value": 0
  };
}
