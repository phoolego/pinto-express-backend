
// const api = require('./api.js');
module.exports = {
    async sendOTP(){
        // var smsApi = new api.SMSApi("chphuri@gmail.com", "CC702303-3797-30B7-8066-B4502D698F79");

        // var smsMessage = new api.SmsMessage();
        
        // smsMessage.source = "sdk";
        // smsMessage.from = 'Course Square';
        // smsMessage.to = "+66931383100";
        // smsMessage.body = "Test OTP send";
        
        // var smsCollection = new api.SmsMessageCollection();
        
        // smsCollection.messages = [smsMessage];
        
        // smsApi.smsSendPost(smsCollection).then(function(response) {
        //   console.log(response.body);
        // }).catch(function(err){
        //   console.error(err.body);
        // });
        // return check;
        result = await axios.post('https://api-mapper.clicksend.com/http/v2/send.php',
        {
            username:'chphuri@gmail.com',
            key:'CC702303-3797-30B7-8066-B4502D698F79',
            to:'66931383100',
            text:`Test send OTP Clicksend ${otp}`,
            senderid:'phoolego',
        });
        console.log(result.data);
        return result.data;
    },
    status(message){
        console.log("Callback: "+message.MessageStatus);
        return message.MessageStatus;
    }
}