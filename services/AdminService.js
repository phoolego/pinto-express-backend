const OrderService = require("./OrderService");
const PreOrderService = require("./PreOrderService");
const StockService = require("./StockService");
const Utility = require("./Utility");
module.exports = {
    async getAllFarmRequest(){
        try{
            let sql =`SELECT user.user_id, firstname, lastname, email, address, contact, farm_name, max_area, role
            FROM user
            LEFT JOIN farmer ON user.user_id = farmer.user_id
            WHERE role = 'REQ-FARMER'`;
            return await db.pintodb.query(sql);
        }catch(err){
            throw err.message;
        }
    },
    async getAllFarmer(){
        try{
            let sql =`SELECT user.user_id, firstname, lastname, email, address, contact, farm_name, max_area, role
            FROM user
            LEFT JOIN farmer ON user.user_id = farmer.user_id
            WHERE role = 'FARMER' OR role = 'ADMIN'`;
            return await db.pintodb.query(sql);
        }catch(err){
            throw err.message;
        }
    },
    async approveFarmRequest(userId){
        try{
            let sql = `SELECT user_id, role
            FROM user
            WHERE user_id = ?`;
            const user = (await db.pintodb.query(sql,[userId]))[0];
            if(user['role']==='FARMER' || user['role']==='ADMIN'){
                throw new Error('you already have farmer permission');
            }else if(user['role']==='CUSTOMER'){
                throw new Error('cannot gain permission');
            }else{
                sql = `UPDATE user 
                SET role = 'FARMER' 
                WHERE role = 'REQ-FARMER' AND user_id=?`;
                await db.pintodb.query(sql,[userId]);
                return (await db.pintodb.query(
                    `SELECT user_id, role
                    FROM user
                    WHERE user_id = ?`,
                    [userId]
                ))[0];
            }
        }catch(err){
            throw err.message;
        }
    },
    async receiveSendStockProduct(sspId){
        try{
            let sql = `SELECT ssp_status, type_of_product, ssp_amount, predict_harvest_date
            FROM send_stock_product
            INNER JOIN product ON product.product_id = send_stock_product.product_id
            WHERE ssp_id=?;`;
            const ssp = (await db.pintodb.query(sql,[sspId]))[0];
            if(ssp){
                if(ssp['ssp_status']=='PREPARE'){
                    const sellingDate = Utility.getLocalTime(Utility.findWeekInMonth(ssp['predict_harvest_date']));
                    const allWaitPreOrder = await PreOrderService.getTotalWaitAmountInScopePreOrder(ssp['type_of_product'],sellingDate);
                    const allOrder = await OrderService.getTotalAmountInActiveOrder(ssp['type_of_product']);
                    const productPreOrder = await PreOrderService.getActivePreOrder(ssp['type_of_product'],sellingDate);
                    await StockService.setPreorderToSell(ssp['type_of_product'],ssp['ssp_amount'],ssp['ssp_amount']);
                    const stock = await StockService.getStockDetail(ssp['type_of_product']);
                    let remainAmount = stock['selling_amount'] - allWaitPreOrder - allOrder;
                    for(let i=0 ; i<productPreOrder.length ; i++){
                        if(remainAmount >= productPreOrder[i]['amount']){
                            await PreOrderService.turnWaitPreOrder(productPreOrder[i]['ppo_id']);
                            remainAmount -= productPreOrder[i]['amount'];
                        }else{
                            break;
                        }
                    }
                    sql = `UPDATE send_stock_product
                    SET ssp_status='DELIVERED', ssp_delivered_date=?
                    WHERE ssp_id=?;`;
                    return await db.pintodb.query(sql,[Utility.getCurrentTime(),sspId]);
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
    async paySendStockProduct(sspId,farmerTransaction){
        try{
            let sql = `SELECT ssp_status
            FROM send_stock_product
            WHERE ssp_id=?;`;
            const ssp = (await db.pintodb.query(sql,[sspId]))[0];
            if(ssp){
                if(ssp['ssp_status']=='DELIVERED'){
                    sql = `UPDATE send_stock_product
                    SET ssp_status='PAID', ssp_tran_pic=?
                    WHERE ssp_id=?;`;
                    return await db.pintodb.query(sql,[farmerTransaction,sspId]);
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