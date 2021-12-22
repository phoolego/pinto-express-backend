module.exports = {
    getCurrentTime(){
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        // var tzoffset = -420 * 60000; // fixed offset in milliseconds for Thailand
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 19).replace('T', ' ');
        return localISOTime;
    },
    getLocalTime(date){
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var localISOTime = (new Date(date - tzoffset)).toISOString().slice(0, 19).replace('T', ' ');
        return localISOTime;
    },
    findWeekInMonth(date){
        week1 = new Date(date.getFullYear(),date.getMonth(),'1');
        week2 = new Date(date.getFullYear(),date.getMonth(),'8');
        week3 = new Date(date.getFullYear(),date.getMonth(),'15');
        week4 = new Date(date.getFullYear(),date.getMonth(),'22');
        if(date >= week4){
            return week4;
        }
        else if(date >= week3){
            return week3;
        }
        else if(date >= week2){
            return week2;
        }
        else{
            return week1
        }
    },
    findWeekendInMonth(date){
        week1 = new Date(date.getFullYear(),date.getMonth(),'7');
        week2 = new Date(date.getFullYear(),date.getMonth(),'14');
        week3 = new Date(date.getFullYear(),date.getMonth(),'21');
        week4 = new Date(date.getFullYear(),date.getMonth()+1,'0');
        if(date >= week4){
            return week4;
        }
        else if(date >= week3){
            return week3;
        }
        else if(date >= week2){
            return week2;
        }
        else{
            return week1
        }
    }
}