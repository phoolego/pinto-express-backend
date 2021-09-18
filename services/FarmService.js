module.exports = {
    async insertFarm(farmName,maxArea,userId){
        try{
            const userRole = await db.pintodb.query(`SELECT role FROM user WHERE user_id = ?`,[userId]);
            if(userRole[0]['role']==='FARMER' || userRole[0]['role']==='ADMIN'){
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
    async updateFarm(farmName,maxArea,farmerId){
        try{
            let sql = `UPDATE farmer 
            SET farm_name=?, max_area=?
            WHERE farmer_id=?;`;
            return await db.pintodb.query(sql,[farmName, maxArea, farmerId]);
        }catch(err){
            throw err.message;
        }
    },
    async getFarmProduct(farmerId){
        try{
            let sql = `SELECT product_id, area, plant_date, predict_harvest_date, harvest_date, harvest_amount, predict_amount, type_of_product, farmer_id 
            FROM product
            WHERE farmer_id=?;`;
            return await db.pintodb.query(sql,[farmerId]);
        }catch(err){
            throw err.message;
        }
    }
}