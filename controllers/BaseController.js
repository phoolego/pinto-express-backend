const UserService = require("../services/UserService");
const ProductService = require("../services/ProductService");

module.exports = {
  async index(req, res) {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString();
    res.send(`Pinto Bangkachao Express API V 1.0.0 ${localISOTime} offset = ${(new Date()).getTimezoneOffset()}
    ${Intl.DateTimeFormat().resolvedOptions().timeZone}`);
  },
  //User
  async insertUser(req, res){
    try{
      param = req.body
      if(param.firstname && param.lastname && param.email && param.password && param.address && param.contact && param.role){
        result = await UserService.insertUser(param.firstname, param.lastname, param.email, param.password, param.address, param.contact, param.role);
        res.send(result);
      }else{
        res.status(403).send({
          message: `missing parameter${param.firstname?'':' firstname'}${param.lastname?'':' lastname'}${param.email?'':' email'}${param.password?'':' password'}${param.address?'':' address'}${param.contact?'':' contact'}${param.role?'':' role'}`
        });
      }
    }catch(err){
      if(err.message){
        res.status(500).send({ message: err.message });
      }else{
        res.status(500).send({ message: err });
      }
    }
  },
  async updateUser(req, res){
    try{
      param = req.body
      if(param.firstname && param.lastname && param.address && param.contact && param.userId){
        await UserService.updateUser(param.firstname, param.lastname, param.address, param.contact, param.userId);
        const result = await UserService.getUser(param.userId);
        res.send(result);
      }else{
        res.status(403).send({
          message: `missing parameter${param.firstname?'':' firstname'}${param.lastname?'':' lastname'}${param.address?'':' address'}${param.contact?'':' contact'}${param.userId?'':' userId'}`
        });
      }
    }catch(err){
      if(err.message){
        res.status(500).send({ message: err.message });
      }else{
        res.status(500).send({ message: err });
      }
    }
  },
  async loginEmail(req, res){
    try{
      param = req.body
      if(param.email && param.password){
        result = await UserService.loginEmail(param.email, param.password);
        res.send(result);
      }else{
        res.status(403).send({
          message: `missing parameter${param.email?'':' email'}${param.password?'':' password'}`
        });
      }
    }catch(err){
      if(err.message){
        res.status(500).send({ message: err.message });
      }else{
        res.status(500).send({ message: err });
      }
    }
  },
  //Product
  async getProductType(req, res){
    try{
      result = await ProductService.getProductType();
      res.send(result);
    }catch(err){
      if(err.message){
        res.status(500).send({ message: err.message });
      }else{
        res.status(500).send({ message: err });
      }
    }
  },
  //Address
  async getAddress(req, res){
    try{
      const header = req.headers;
      if(header.userid){
        result = await UserService.getAddress(header.userid);
      }else{
        res.status(403).send({
          message: `missing parameter${header.userid?'':' userid'}`
        });
      }
      res.send(result);
    }catch(err){
      if(err.message){
        res.status(500).send({ message: err.message });
      }else{
        res.status(500).send({ message: err });
      }
    }
  },
  async insertAddress(req, res){
    try{
      const header = req.headers;
      const param = req.body
      if(header.userid && param.addressName && param.address){
        result = await UserService.insertAddress(header.userid,param.addressName,param.address);
      }else{
        res.status(403).send({
          message: `missing parameter${header.userid?'':' userid'}${param.addressName?'':' addressName'}${param.address?'':' address'}`
        });
      }
      res.send(result);
    }catch(err){
      if(err.message){
        res.status(500).send({ message: err.message });
      }else{
        res.status(500).send({ message: err });
      }
    }
  },
  async updateAddress(req, res){
    try{
      const param = req.body
      if(param.id && param.addressName && param.address){
        result = await UserService.updateAddress(param.id, param.addressName, param.address);
      }else{
        res.status(403).send({
          message: `missing parameter${param.id?'':' id'}${param.addressName?'':' addressName'}${param.address?'':' address'}`
        });
      }
      res.send(result);
    }catch(err){
      if(err.message){
        res.status(500).send({ message: err.message });
      }else{
        res.status(500).send({ message: err });
      }
    }
  },
  async deleteAddress(req, res){
    try{
      const param = req.body
      if(param.id){
        result = await UserService.deleteAddress(param.id);
      }else{
        res.status(403).send({
          message: `missing parameter${param.id?'':' id'}`
        });
      }
      res.send(result);
    }catch(err){
      if(err.message){
        res.status(500).send({ message: err.message });
      }else{
        res.status(500).send({ message: err });
      }
    }
  },
  async setDefaultAddress(req, res){
    try{
      const header = req.headers;
      const param = req.body
      if(param.id && header.userid){
        result = await UserService.setDefaultAddress(param.id,header.userid);
      }else{
        res.status(403).send({
          message: `missing parameter${param.id?'':' id'}${header.userid?'':' userid'}`
        });
      }
      res.send(result);
    }catch(err){
      if(err.message){
        res.status(500).send({ message: err.message });
      }else{
        res.status(500).send({ message: err });
      }
    }
  },
};
