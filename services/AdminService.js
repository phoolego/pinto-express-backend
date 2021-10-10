const StockService = require("../services/StockService");
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
    async receiveSendStockProduct(sspId){
        try{
            let sql = `SELECT ssp_status, type_of_product, ssp_amount
            FROM send_stock_product
            INNER JOIN product ON product.product_id = send_stock_product.product_id
            WHERE ssp_id=?;`;
            const ssp = (await db.pintodb.query(sql,[sspId]))[0];
            if(ssp){
                if(ssp['ssp_status']=='PREPARE'){
                    await StockService.setPreorderToSell(ssp['type_of_product'],ssp['ssp_amount'],ssp['ssp_amount']);
                    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
                    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 10);
                    console.log(localISOTime);
                    sql = `UPDATE send_stock_product
                    SET ssp_status='DELIVERED', ssp_delivered_date=?
                    WHERE ssp_id=?;`;
                    return await db.pintodb.query(sql,[localISOTime,sspId]);
                }else{
                    throw new Error('This send strock cannot deliver');
                }
            }else{
                throw new Error('Invalid sspId');
            }
        }catch(err){
            throw err.message;
        }
    },
    async paySendStockProduct(sspId){
        try{
            let sql = `SELECT ssp_status
            FROM send_stock_product
            WHERE ssp_id=?;`;
            const ssp = (await db.pintodb.query(sql,[sspId]))[0];
            if(ssp){
                if(ssp['ssp_status']=='DELIVERED'){
                    sql = `UPDATE send_stock_product
                    SET ssp_status='PAID'
                    WHERE ssp_id=?;`;
                    return await db.pintodb.query(sql,[sspId]);
                }else{
                    throw new Error('This send strock cannot pay');
                }
            }else{
                throw new Error('Invalid sspId');
            }
        }catch(err){
            throw err.message;
        }
    },
}