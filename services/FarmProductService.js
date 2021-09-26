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
    async insertFarmerProduct(farmerId,productType,area,plantDate,predictHarvestDate,predictAmount){
        try{
            let sql = `SELECT area 
            FROM product
            WHERE farmer_id=? AND status = 'PLANTING';`;
            const productAreas = await db.pintodb.query(sql,[farmerId]);
            let usedArea = 0;
            productAreas.forEach(product => usedArea+=product['area']);
            sql = `SELECT max_area 
            FROM farmer
            WHERE farmer_id=?;`;
            const maxArea = (await db.pintodb.query(sql,[farmerId]))[0]['max_area'];
            if(maxArea-usedArea>=area){
                sql = `INSERT INTO product (farmer_id, type_of_product, area, plant_date,predict_harvest_date,predict_amount,status)
                VALUE(?,?,?,?,?,?,?);`;
                return await db.pintodb.query(sql,[farmerId,productType,area,plantDate,predictHarvestDate,predictAmount,'PLANTING']);
            }else{
                throw new Error('not enough area');
            }
        }catch(err){
            throw err.message;
        }
    },
    async harvestFarmerProduct(productId,harvestDate,harvestAmount){
        try{
            let sql = `UPDATE product
            SET harvest_date=?, harvest_amount=?, status=?
            WHERE product_id=?;`;
            return await db.pintodb.query(sql,[harvestDate,harvestAmount,'HARVESTED',productId]);
        }catch(err){
            throw err.message;
        }
    }
}