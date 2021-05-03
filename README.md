# kaholo-plugin-vsphere
Kaholo Plugin for VMWare vSphere

## Settings:
1) User (String) **Required** - Username of user to connect with.
2) Password (Vault) **Required** - Password of user to connect with.
3) Host (String) **Required** - The hostname of the host to connect to(only host name, no need for https://).

## Methods: List datacenter
This method will list all your datacenters in your VSPhere.

### Parameters:
1. DC name (String) **Optional** - If provided, filter by name provided.

## Method: Create datacenter
This method will create a new Datacenter in your vsphere.

###  Parameters:
1. Datacenter name (String) **Required** - The name of the new datacenter to create.
2. Datacenter folder (String) **Required** - Path of folder to create the datacenter in.

## Method: Delete datacener
This method will delete a datacenter from your vsphere.

### Parameters:
1. Datacenter ID (String) **Required** - The name of the new datacenter to delete.
2. Force (Boolean) **Optional** - Should force delete. If specified delete the datacenter even if it is not empty. Default value is false.