const bcrypt = require('bcrypt');

module.exports = {
    async insertUser(firstname, lastname, email, password, address, contact, role){
        try{
            const saltRounds = 10;
            const hash_pwd = bcrypt.hashSync(password, saltRounds);
            let sql = `INSERT INTO user (firstname, lastname, email, password, address, contact, role)
            VALUES (?, ?, ?, ?, ?, ?, ?);`;
            return await db.pintodb.query(sql,[firstname, lastname, email, hash_pwd, address, contact, role]);
        }catch(err){
            if(err.code=='ER_DUP_ENTRY'){
                throw `this email was used`;
            }
        }
    },
    async updateUser(firstname, lastname, address, contact, userId){
        let sql = `UPDATE user 
        SET firstname = ?, lastname = ?, address = ?, contact = ?
        WHERE user_id = ?;`;
        return await db.pintodb.query(sql,[firstname, lastname, address, contact, userId]);
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
                    let sql = `SELECT user_id, firstname, lastname, email, address, contact, role
                    FROM user
                    WHERE email = ?`;
                    const user = (await db.pintodb.query(sql,[email]))[0];
                    return user;
                }else{
                    throw new Error('wrong password');
                }
            }else{
                throw new Error('no user found');
            }
        }catch(err){
            throw err.message;
        }
    },
    async loginEmailFarmer(email, password){
        try{
            let passSql = `SELECT password, role
            FROM user
            WHERE email = ?`;
            const hashPass = await db.pintodb.query(passSql,[email]);
            if (hashPass.length>0){
                if(hashPass[0]['role']==='FARMER' || hashPass[0]['role']==='ADMIN'){
                    const match = await bcrypt.compare(password, hashPass[0]['password']);
                    if(match){
                        let sql = `SELECT user.user_id, firstname, lastname, email, address, contact, role, farmer_id, farm_name, max_area
                        FROM user
                        LEFT JOIN farmer ON user.user_id = farmer.user_id
                        WHERE email = ?`;
                        const user = (await db.pintodb.query(sql,[email]))[0];
                        return user;
                    }else{
                        throw new Error('wrong password');
                    }
                }else{
                    throw new Error('Do not have permission');
                }
            }else{
                throw new Error('no user found');
            }
        }catch(err){
            throw err.message;
        }
    },
    async loginEmailAdmin(email, password){
        try{
            let passSql = `SELECT password, role
            FROM user
            WHERE email = ?`;
            const hashPass = await db.pintodb.query(passSql,[email]);
            if (hashPass.length>0){
                if(hashPass[0]['role']==='ADMIN'){
                    const match = await bcrypt.compare(password, hashPass[0]['password']);
                    if(match){
                        let sql = `SELECT user_id, firstname, lastname, email, address, contact, role
                        FROM user
                        WHERE email = ?`;
                        const user = (await db.pintodb.query(sql,[email]))[0];
                        return user;
                    }else{
                        throw new Error('wrong password');
                    }
                }else{
                    throw new Error('Do not have permission');
                }
            }else{
                throw new Error('no user found');
            }
        }catch(err){
            throw err.message;
        }
    },
}