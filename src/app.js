var auth = require('./resources/authentication');
var vm = require('./resources/vms');


function findVMByName(vmName) {
  return vm.find('filter.names.1=' + vmName).then(resp => {
     if (null !== resp && null !== resp.body.value && resp.body.value.length > 0) {
       return resp.body.value[0].vm;
     }
     throw "VM not found"
 });
}

function powerOn(vmName){
  return vm.powerOn(vmName);
}

function powerOff(vmName){
  return vm.powerOff(vmName);
}

function execPowerOn(action, settings) {
    return auth.login(action,settings).then(()=>{
      return findVMByName(action.params.vmName)
    }).then(vm=>{
      return powerOn(action.params.vmName);
    })
 }

 function execPowerOff(action, settings) {
  return auth.login(action,settings).then(()=>{
    return findVMByName(action.params.vmName)
  }).then(vm=>{
    return powerOff(action.params.vmName);
  })
}

module.exports = {
  execPowerOff,
  execPowerOn
}