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
        result = await UserService.updateUser(param.firstname, param.lastname, param.address, param.contact, param.userId);
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
};
