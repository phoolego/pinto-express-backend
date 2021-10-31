const bcrypt = require('bcrypt');
module.exports = {
    async insertFarm(farmName,maxArea,userId){
        try{
            const userRole = await db.pintodb.query(`SELECT role FROM user WHERE user_id = ?`,[userId]);
            if(userRole[0]['role']==='FARMER' || userRole[0]['role']==='ADMIN' || userRole[0]['role']==='REQ-FARMER'){
                let sql = `INSERT INTO farmer (farm_name, max_area, user_id)
                VALUES (?, ?, ?);`;
                return await db.pintodb.query(sql,[farmName, maxArea, userId]);
            }else{
                throw new Error('this userId is not a farmer');
            }
        }catch(err){
            throw err.message;
        }
    },
    async requestFarmerRole(email,password){
        try{
            let passSql = `SELECT password
            FROM user
            WHERE email = ?`;
            const hashPass = await db.pintodb.query(passSql,[email]);
            if (hashPass.length>0){
                const match = await bcrypt.compare(password, hashPass[0]['password']);
                if(match){
                    let sql = `SELECT user_id, role
                    FROM user
                    WHERE email = ?`;
                    const user = (await db.pintodb.query(sql,[email]))[0];
                    if(user['role']==='FARMER' || user['role']==='ADMIN'){
                        throw new Error('you already have farmer permission');
                    }else if(user['role']==='REQ-FARMER'){
                        throw new Error('wait for request response');
                    }else{
                        sql = `UPDATE user 
                        SET role='REQ-FARMER'
                        WHERE user_id=?;`;
                        await db.pintodb.query(sql,[user['user_id']]);
                        return (await db.pintodb.query(
                            `SELECT user_id, role
                            FROM user
                            WHERE user_id = ?`,
                            [user['user_id']]
                        ))[0];
                    }
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
    async updateFarm(farmName,maxArea,userId){
        try{
            let sql = `UPDATE farmer 
            SET farm_name=?, max_area=?
            WHERE user_id=?;`;
            return await db.pintodb.query(sql,[farmName, maxArea, userId]);
        }catch(err){
            throw err.message;
        }
    },
    async getFarmerDetail(userId){
        let sql = `SELECT user.user_id, firstname, lastname, email, address, contact, role, farmer_id, farm_name, max_area
        FROM user
        LEFT JOIN farmer ON user.user_id = farmer.user_id
        WHERE user.user_id = ?`;
        const user = (await db.pintodb.query(sql,[userId]))[0];
        return user;
    }
}