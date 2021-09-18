const UserService = require("../services/UserService");
const FarmService = require("../services/FarmService");
module.exports = {
    async loginEmailFarmer(req, res){
      try{
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
  };