const bcrypt = require('bcrypt');

module.exports = {
    async insertUser(firstname, lastname, email, password, address, contact, role){
        try{
            const saltRounds = 10;
            const hash_pwd = bcrypt.hashSync(password, saltRounds);
            let sql = `INSERT INTO user (firstname, lastname, email, password, address, contact, role)
            VALUES (?, ?, ?, ?, ?, ?, ?);`;
            const user = await db.pintodb.query(sql,[firstname, lastname, email, hash_pwd, address, contact, role]);
            await this.insertAddress(user['insertId'],'Home',address);
            return user;
        }catch(err){
            if(err.code=='ER_DUP_ENTRY'){
                throw `this email was used`;
            }
            else{
                throw err.message;
            }
        }
    },
    async getUser(userId){
        try{
            let sql = `SELECT user_id, firstname, lastname, email, address, contact, role
            FROM user
            WHERE user_id = ?;`;
            return (await db.pintodb.query(sql,[userId]))[0];
        }catch(err){
            throw err.message;
        }
    },
    async updateUser(firstname, lastname, address, contact, userId){
        try{
            let sql = `UPDATE user 
            SET firstname = ?, lastname = ?, address = ?, contact = ?
            WHERE user_id = ?;`;
            await db.pintodb.query(sql,[firstname, lastname, address, contact, userId]);
            sql = `UPDATE user_address 
            SET address = ?
            WHERE in_use = 1;`;
            await db.pintodb.query(sql,[address, userId]);
        }catch(err){
            throw err.message;
        }
    },
    async setRole(userId,role){
        try{
            let sql = `UPDATE user 
            SET role = ?
            WHERE user_id = ?;`;
            return await db.pintodb.query(sql,[role, userId]);
        }catch(err){
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
    async getAddress(userId){
        try{
            let sql = `SELECT id, user_id, address_name, address, in_use
            FROM user_address
            WHERE user_id = ?
            ;`
            return await db.pintodb.query(sql,[userId]);
        }catch(err){
            throw err.message;
        }
    },
    async insertAddress(userId,addressName,address){
        try{
            let sql = `INSERT INTO user_address (user_id, address_name, address, in_use)
            VALUE(?,?,?,0)
            ;`
            const insert = await db.pintodb.query(sql,[userId,addressName,address]);
            this.setDefaultAddress(insert['insertId'],userId);
            return insert;
        }catch(err){
            throw err.message;
        }
    },
    async updateAddress(id,addressName,address){
        try{
            let sql = `UPDATE user_address 
            SET address_name = ?, address = ?
            WHERE id = ?
            ;`
            const insert = await db.pintodb.query(sql,[addressName,address,id]);
            return insert;
        }catch(err){
            throw err.message;
        }
    },
    async deleteAddress(id){
        try{
            let sql = `SELECT id, in_use
            FROM user_address
            WHERE id = ?
            ;`
            const userAddress = (await db.pintodb.query(sql,[id]))[0];
            if(userAddress['in_use']!=1){
                sql = `DELETE FROM user_address
                WHERE id = ?
                ;`
                const insert = await db.pintodb.query(sql,[id]);
                return insert;
            }else{
                throw new Error('cannot delete in use address');
            }
        }catch(err){
            throw err.message;
        }
    },
    async setDefaultAddress(id,userId){
        try{
            let sql = `UPDATE user_address 
            SET in_use = 0
            WHERE NOT id = ? AND user_id = ?
            ;`
            await db.pintodb.query(sql,[id,userId]);
            sql = `UPDATE user_address 
            SET in_use = 1
            WHERE id = ? AND user_id = ?
            ;`
            return await db.pintodb.query(sql,[id,userId]);
        }catch(err){
            throw err.message;
        }
    }
}