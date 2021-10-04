const UserService = require("../services/UserService");
const ProductService = require("../services/ProductService");

module.exports = {
  async index(req, res) {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 10);
    res.send(`Pinto Bangkachao Express API V 1.0.0 ${(new Date(Date.now())).toISOString()}`);
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
      res.status(500).send({ message: err });
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
      res.status(500).send({ message: err });
    }
  },
  //Product
  async getProductType(req, res){
    try{
      result = await ProductService.getProductType();
      res.send(result);
    }catch(err){
      res.status(500).send({ message: err });
    }
  },
};
