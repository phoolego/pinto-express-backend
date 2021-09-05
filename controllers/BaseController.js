const UserService = require("../services/UserService");

module.exports = {
  async index(req, res) {
    res.send('Pinto Bangkachao Express API V 1.0.0');
  },
  async insertUser(req, res){
    try{
      param = req.body
      result = await UserService.insertUser(param.username, param.email, param.password, param.address, param.contact, param.role);
      res.send(result);
    }catch(err){
      res.status(500).send({ message: err });
    }
  }
};
