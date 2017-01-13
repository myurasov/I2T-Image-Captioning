# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
    config.vm.box = 'ubuntu/xenial64'
    config.vm.box_check_update = false

    config.vm.network 'forwarded_port', guest: 5000, host: 15_000
    config.vm.network 'forwarded_port', guest: 9181, host: 19_181

    config.vm.synced_folder '.', '/project'

    config.vm.provider 'virtualbox' do |vb|
        vb.gui = false
        vb.cpus = 2
        vb.memory = '4096'
    end

    config.vm.provision 'shell', inline: <<-SHELL
        # env
        echo 'ENVIRONMENT="development"' | sudo tee -a /etc/environment

        # hostname
        echo '127.0.0.1 i2t' | sudo tee -a /etc/hosts
        sudo hostname i2t
        echo 'i2t' | sudo tee /etc/hostname

        sudo apt-get update

        # misc
        sudo apt-get install -y htop redis-server nodejs nodejs-legacy npm

        # pm2
        sudo npm i -g pm2

        # python
        sudo apt-get install -y python3 python3-pip
        sudo -H pip3 install --upgrade pip

        # pip packages
        sudo -H pip3 install virtualenv
        
        # init virtualenv
        rm -rf /project/server/venv
        virtualenv /project/server/venv
        
        # enter virtualenv
        cd /project/server && source venv/bin/activate
        
        # app dependencies
        pip3 install https://storage.googleapis.com/tensorflow/linux/cpu/tensorflow-0.12.0rc1-cp35-cp35m-linux_x86_64.whl
        pip3 install -r requirements.development.txt
        
        # project starter
        echo 'cd /project/server && source venv/bin/activate && cd app' | sudo tee ~ubuntu/project
        sudo chmod +x ~ubuntu/project
        
        # autostart (modify /etc/rc.local)
        echo '#!/bin/sh -e' | sudo tee /etc/rc.local
        echo '# something ...' | sudo tee -a /etc/rc.local
        echo 'exit 0' | sudo tee -a /etc/rc.local
    SHELL
    
    # config.vm.provision 'shell', run: 'always', inline: <<-SHELL
    # SHELL
end
