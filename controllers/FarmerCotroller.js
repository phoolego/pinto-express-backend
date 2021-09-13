const UserService = require("../services/UserService");
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
  };