module.exports = {
    async getAllFarmRequest(){
        try{
            let sql =`SELECT user.user_id, firstname, lastname, email, address, contact, farm_name, max_area
            FROM user
            LEFT JOIN farmer ON user.user_id = farmer.user_id
            WHERE role = 'REQ-FARMER'`;
            return await db.pintodb.query(sql,[email]);
        }catch(err){
            throw err.message;
        }
    },
    async approveFarmRequest(userId){
        try{
            let sql =`UPDATE user
            SET role = 'FARMER' 
            WHERE role = 'REQ-FARMER' AND user_id=?`;
            return await db.pintodb.query(sql,[userId]);
        }catch(err){
            throw err.message;
        }
    },
}