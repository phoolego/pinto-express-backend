const UserService = require("../services/UserService");
const FarmService = require("../services/FarmService");
module.exports = {
    async loginEmailFarmer(req, res){
      try{
        console.log(req.body);
        param = req.body
        if(param.email && param.password){
          result = await UserService.loginEmailFarmer(param.email, param.password);
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
    async insertFarmer(req, res){
      try{
        param = req.body
        if(param.farmName && param.maxArea && param.userId){
          result = await FarmService.insertFarm(param.farmName, param.maxArea, param.userId);
          res.send(result);
        }else{
          res.status(403).send({
            message: `missing parameter${param.farmName?'':' farmName'}${param.maxArea?'':' maxArea'}${param.userId?'':' userId'}`
          });
        }
      }catch(err){
        res.status(500).send({ message: err });
      }
    },
    async updateFarmer(req, res){
      try{
        param = req.body
        if(param.farmName && param.maxArea && param.farmerId){
          result = await FarmService.updateFarm(param.farmName, param.maxArea,param.farmerId);
          res.send(result);
        }else{
          res.status(403).send({
            message: `missing parameter${param.farmName?'':' farmName'}${param.maxArea?'':' maxArea'}${param.farmerId?'':' farmerId'}`
          });
        }
      }catch(err){
        res.status(500).send({ message: err });
      }
    },
    async registerFarmer(req, res){
      try{
        param = req.body
        if(param.firstname && param.lastname && param.email && param.password && param.address && param.contact && param.farmName && param.maxArea){
          const user = await UserService.insertUser(param.firstname, param.lastname, param.email, param.password, param.address, param.contact,'REQ-FARMER');
          const farm = await FarmService.insertFarm(param.farmName, param.maxArea, user['insertId']);
          res.send({user_id:user['insertId'],farm_id:farm['insertId']});
        }else{
          res.status(403).send({
            message: `missing parameter${param.firstname?'':' firstname'}${param.lastname?'':' lastname'}${param.email?'':' email'}${param.password?'':' password'}${param.address?'':' address'}${param.contact?'':' contact'}`+
            `${param.farmName?'':' farmName'}${param.maxArea?'':' maxArea'}`
          });
        }
      }catch(err){
        res.status(500).send({ message: err });
      }
    },
    async requestFarmerRole(req, res){
      try{
        param = req.body
        if(param.email && param.password){
          const role = await FarmService.requestFarmerRole(param.email, param.password);
          const farm = await FarmService.insertFarm(param.farmName, param.maxArea, role['user_id']);
          res.send([{
            ...role,
            farm_id:farm['insertId']
          }]);
        }else{
          res.status(403).send({
            message: `missing parameter${param.email?'':' email'}${param.password?'':' password'}`
          });
        }
      }catch(err){
        res.status(500).send({ message: err });
      }
    }
  };