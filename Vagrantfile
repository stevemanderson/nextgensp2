# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "nextgensp5"
  config.vm.network :forwarded_port, guest: 5432, host: 5432
  config.vm.network :forwarded_port, guest: 27017, host: 50003
  config.vm.network :forwarded_port, guest: 80, host: 8181
  config.vm.network :forwarded_port, guest: 90, host: 9191
  config.vm.network :forwarded_port, guest: 15672, host: 15672
  config.vm.network :forwarded_port, guest: 61614, host: 61614
  config.vm.network :forwarded_port, guest: 15670, host: 15670
  config.vm.network :forwarded_port, guest: 15674, host: 15674
  config.vm.provider :virtualbox do |vb|
    vb.customize [
      "modifyvm", :id,
      "--memory", "512"
    ]
  end
end
