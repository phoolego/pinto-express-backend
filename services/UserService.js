const bcrypt = require('bcrypt');

module.exports = {
    async insertUser(username, email, password, address, contact, role){
        try{
            const saltRounds = 10;
            const hash_pwd = bcrypt.hashSync(password, saltRounds);
            let sql = `INSERT INTO user (username, email, password, address, contact, role)
            VALUES (?, ?, ?, ?, ?, ?);`;
            return await db.pintodb.query(sql,[username, email, hash_pwd, address, contact, role]);
        }catch(err){
            if(err.code=='ER_DUP_ENTRY'){
                throw `this email ${email} was used`;
            }
            throw err.message;
        }
    },
    async loginEmail(email, password){
        try{
            let passSql = `SELECT password
            FROM user
            WHERE email = ?`;
            const hashPass = await db.pintodb.query(passSql,[email]);
            if (hashPass.length>0){
                const match = await bcrypt.compare(password, hashPass[0]['password']);
                if(match){
                    let sql = `SELECT user_id, username, email, address, contact, role
                    FROM user
                    WHERE email = ?`;
                    const user = (await db.pintodb.query(sql,[email]))[0];
                    return user;
                }else{
                    throw 'wrong password';
                }
            }else{
                throw 'no user found';
            }
        }catch(err){
            if(err.code=='ER_DUP_ENTRY'){
                throw `this email ${email} was used`;
            }
            throw err.message;
        }
    },
}