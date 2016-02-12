# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "nextgensp2"
  config.vm.network :forwarded_port, guest: 27017, host: 50003
  config.vm.network :forwarded_port, guest: 80, host: 6060
  config.vm.network :forwarded_port, guest: 90, host: 7070
  
  config.vm.provider :virtualbox do |vb|
    vb.customize [
      "modifyvm", :id,
      "--memory", "512"
    ]
  end
end
