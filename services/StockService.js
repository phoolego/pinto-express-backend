module.exports={
    async addPreorderStock(productType,preOrderAmount){
        try{
            let sql = `UPDATE stock
            SET preorder_amount=preorder_amount+?
            WHERE product_type=?;`;
            return await db.pintodb.query(sql,[preOrderAmount,productType]);
        }catch(err){
            throw err.message
        }
    },
    async setPreorderToSell(productType,preOrderAmount,sellAmount){
        try{
        }catch(err){
        }
    },
    async disposeStock(productType,disposedAount){
        try{
        }catch(err){
        }
    }
}