# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "nextgensp2"
  config.vm.network :forwarded_port, guest: 5432, host: 5432
  config.vm.network :forwarded_port, guest: 27017, host: 50003
  config.vm.network :forwarded_port, guest: 80, host: 8181
  config.vm.network :forwarded_port, guest: 90, host: 9191
  config.vm.provider :virtualbox do |vb|
    vb.customize [
      "modifyvm", :id,
      "--memory", "512"
    ]
  end
end
