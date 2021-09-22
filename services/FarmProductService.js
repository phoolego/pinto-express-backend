module.exports={
    async getFarmerProduct(farmerId){
        try{
            let sql = `SELECT product_id, area, plant_date, predict_harvest_date, harvest_date, harvest_amount, predict_amount, type_of_product, farmer_id 
            FROM product
            WHERE farmer_id=?;`;
            return await db.pintodb.query(sql,[farmerId]);
        }catch(err){
            throw err.message;
        }
    },
    async insertFarmerProduct(farmerId,productType,area,plantDate){
        try{
            let sql = `INSERT INTO product (farmer_id, type_of_product, area, plant_date,status)
            VALUE(?,?,?,?,?);`;
            return await db.pintodb.query(sql,[farmerId,productType,area,plantDate,'PLANTING']);
        }catch(err){
            throw err.message;
        }
    }
}