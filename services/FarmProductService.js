const StockService = require("../services/StockService");
module.exports={
    async getFarmerProduct(farmerId){
        try{
            let sql = `SELECT product_id, area, plant_date, predict_harvest_date, harvest_date, harvest_amount, predict_amount, type_of_product, status, farmer_id, price_buy, unit
            FROM product
            INNER JOIN type_of_product ON  product.type_of_product = type_of_product.name
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
    },
    async disposedProduct(productId){
        try{
            let sql = `UPDATE product
            SET status=?
            WHERE product_id=?;`;
            return await db.pintodb.query(sql,['DISPOSED',productId]);
        }catch(err){
            throw err.message;
        }
    },
    async getSendStockProduct(productId){
        try{
            let sql = `SELECT ssp_id, ssp_amount, ssp_price, ssp_status, ssp_tran_pic
            FROM send_stock_product
            WHERE product_id=?`;
            return await db.pintodb.query(sql,[productId]); 
        }catch(err){
            throw err.message;
        }
    },
    async insertSendStockProduct(productId,sspAmount,sspPrice){
        try{
            let sql = `SELECT predict_amount,harvest_amount ,type_of_product.name
            FROM product
            INNER JOIN type_of_product ON product.type_of_product = type_of_product.name
            WHERE product_id=? AND NOT status = 'DISPOSED';`;
            const product = await db.pintodb.query(sql,[productId]);
            if(product.length>0){
                let totalSentProduct = 0;
                sql = `SELECT ssp_amount 
                FROM send_stock_product
                WHERE product_id=?;`;
                const sentProducts = await db.pintodb.query(sql,[productId]);
                sentProducts.forEach(product => totalSentProduct+=product['ssp_amount']);
                if((product[0]['harvest_amount'] && product[0]['harvest_amount']-totalSentProduct>=sspAmount)||
                (product[0]['predict_amount'] && product[0]['predict_amount']-totalSentProduct>=sspAmount)){
                    sql = `INSERT INTO send_stock_product (product_id, ssp_amount, ssp_price, ssp_status)
                    VALUE(?,?,?,?);`;
                    const sspResult = await db.pintodb.query(sql,[productId,sspAmount,sspPrice,'PREPARE']);
                    const StockResult = await StockService.addPreorderStock(product[0]['name'],sspAmount);
                    return{sspResult,StockResult};
                }else{
                    throw new Error('This product does not have enough number to send');
                }
            }else{
                throw new Error('This product is not available');
            }
        }catch(err){
            throw err.message;
        }
    }
}