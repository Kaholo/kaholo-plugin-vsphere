const request = require('request')

async function listDC (action, settings) {
  const host = settings.host;
  const cookie = await getCookie(settings);
  const url = `https://${host}/rest/vcenter/datacenter${action.params.DCname ? `?filter.names.1=${action.params.DCname}` : ""}`;
      
  const dcObj = {
    uri : url,
    method: 'GET',
    rejectUnauthorized: false,
    headers : {
      'Cookie' : `${cookie}`
    }
  }
  return makeReuqest(dcObj)
}

async function createDC (action, settings) {
  const host = settings.host;
  const cookie = await getCookie(settings);
  const dcFolder = action.params.folder || "group-d1";
  const dcName = action.params.name;
  let dcObj = {
    url : `https://${host}/rest/vcenter/datacenter`,
    method: 'POST',
    rejectUnauthorized : false,
    headers : {
      'Cookie' : `${cookie}`,
      'Content-Type': 'application/json'
    },
    
    body: JSON.stringify({
      "spec":{
        "name":dcName,
        "folder":dcFolder
      }
    })
  };
  return makeReuqest(dcObj)
}

async function deleteDC (action, settings) {
  const host = settings.host;
  const cookie = await getCookie(settings);
  const dcName = action.params.ID;
  const force = action.params.force;
  let uri = "";
  force ? uri = `https://${host}/rest/vcenter/datacenter/${dcName}?force` : uri = `https://${host}/rest/vcenter/datacenter/${dcName}`
  const dcObj = {
    url : `${uri}`,
    method: 'DELETE',
    rejectUnauthorized : false,
    headers : {
      'Cookie' : `${cookie}`,
    }
  };
  console.log(dcObj)
  return makeReuqest(dcObj)
}


//////////// HELPERS ////////////

async function getCookie (settings) {
  const host = settings.host;
  const user = settings.user;
  const password = settings.password;
  const httpReq = {
    uri: `https://${host}/rest/com/vmware/cis/session`,
    method: 'POST',
    rejectUnauthorized: false,
    auth : {
      user : `${user}`, 
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
      const cookieValue = response.headers['set-cookie'];
      httpReq.headers = {'Cookie': cookieValue};
      httpReq.auth = {};
      resolve(response.headers["set-cookie"][0])
    });
  });
}

function makeReuqest(my_http_options){
  return new Promise((resolve,reject)=>{
    request(my_http_options, function (err, response, body) {
      if(err){
          return reject(err);
      }
      if(response.statusCode < 200 || response.statusCode > 300){
        const b = JSON.stringify(response.body)
        console.log(`Body: ${b}`)
        console.log(response.statusCode)
        return reject(response.statusMessage);
      }
      resolve(response);
    });
  });
}

module.exports = {
  LIST_DATACENTER: listDC,
  CREATE_DATACENTER: createDC,
  DELETE_DATACENTER: deleteDC
};