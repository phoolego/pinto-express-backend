const ClicksendService = require('../services/ClicksendService');
const BulkgateService = require('../services/BulkgateService');

module.exports = {
  async index(req, res) {
    res.send('CourseSquare sms OTP Express API V 1.0.0');
  },
  async bulkgate(req, res){
    try{
      result = await BulkgateService.sendOTP(req.body.otp);
      res.send(JSON.stringify(result));
    }catch(error){
      console.log(error);
      res.send(error);
    }
  }
};
