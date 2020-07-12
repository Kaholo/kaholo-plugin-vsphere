var request = require('request')

async function getDC (action, settings) {
  let host = action.params.host || settings.host
  let connect = await initialConnect(action, settings);
  const token = JSON.parse(connect.body).value
  const cookie = `vmware-api-session-id=${token}`
  let dcObj = {
    uri : `https://${host}/rest/vcenter/datacenter`,
    method: 'GET',
    rejectUnauthorized: false,
    headers : {
      'Authorization': `Bearer ${token}`,
      'Cookie' : `${cookie}`
    }
  }
  return makeReuqest(dcObj)
}

async function createDC (action, settings) {
  let host = action.params.host || settings.host
  let connect = await initialConnect(action, settings);
  //const token = connect.headers["set-cookie"][0]
  const token = JSON.parse(connect.body).value
  const cookie = `vmware-api-session-id=${token}`
  const dcFolder = action.params.folder
  const dcName = action.params.name
  let dcObj = {
    url : `https://${host}/rest/vcenter/datacenter`,
    method: 'POST',
    rejectUnauthorized : false,
    headers : {
      //'Cookie' : `${token}`,
      'Cookie' : `${cookie}`,
      'Content-Type': 'application/json'
    },
    
    body: JSON.stringify({
      "spec":{
        "name":`${dcName}`,
        "folder":`${dcFolder}`
      }
    })
  };
  return makeReuqest(dcObj)
}



//////////// HELPERS ////////////

async function initialConnect (action, settings) {
  let host = action.params.host || settings.host
  let user = action.params.user || settings.user
  let password = action.params.password || settings.password
  let httpReq = {
    uri: `https://${host}/rest/com/vmware/cis/session`,
    method: 'POST',
    rejectUnauthorized: false,
    auth : {
      user : `${user}`,  //'administrator@vsphere.local',
      password: `${password}`
    }
  }; 
  return new Promise((resolve,reject)=>{
    request(httpReq, function (err, response, body) {
      if(err){
          return reject(err);
      }
      if(response.statusCode < 200 || response.statusCode > 300){
        return reject(response.message);
      }
      var cookieValue = response.headers['set-cookie'];
      httpReq.headers = {'Cookie': cookieValue};
      // Remove username-password authentication.
      httpReq.auth = {};
      resolve(response)
    });
  });
}

function makeReuqest(my_http_options){
  var x = JSON.stringify(my_http_options)
  return new Promise((resolve,reject)=>{
    request(my_http_options, function (err, response, body) {
      if(err){
          return reject(err);
      }
      if(response.statusCode < 200 || response.statusCode > 300){
        var b = JSON.stringify(response.body)
        console.log(`Body: ${b}`)
        console.log(response.statusCode)
        return reject(response.statusMessage);
      }
      resolve(response);
    });
  });
}

module.exports = {
  LIST_DATACENTER_INFO: getDC,
  CREATE_DATACENTER: createDC
};
