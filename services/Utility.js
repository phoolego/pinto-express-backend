module.exports = {
    getCurrentTime(){
        // var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var tzoffset = -420 * 60000; // fix offset in milliseconds for Thailand
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString();
        return localISOTime;
    },
}