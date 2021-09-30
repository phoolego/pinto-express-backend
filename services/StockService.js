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
            let sql = `UPDATE stock
            SET preorder_amount=preorder_amount-?, selling_amount=selling_amount+?
            WHERE product_type=?;`;
            return await db.pintodb.query(sql,[preOrderAmount,productType]);
        }catch(err){
            throw err.message
        }
    },
    async cancelStock(productType,cancelAmount){
        try{
            let sql = `SELECT preorder_amount
            FROM stock
            WHERE product_type=?`;
            const currentPreorder = (await db.pintodb.query(sql,[productType]))[0]['preorder_amount'];
            if(currentPreorder && currentPreorder-cancelAmount>=0){
                let sql = `UPDATE stock
                SET preorder_amount=preorder_amount-?
                WHERE product_type=?;`;
                return await db.pintodb.query(sql,[cancelAmount,productType]);
            }else{
                throw new Error('This strock cannot be cancel');
            }
        }catch(err){
            throw err.message
        }
    },
    async disposeStock(productType,disposedAmount){
        try{
            let sql = `SELECT selling_amount
            FROM stock
            WHERE product_type=?`;
            const currentSelling = (await db.pintodb.query(sql,[productType]))[0]['selling_amount'];
            if(currentSelling && currentSelling-disposedAmount>=0){
                let sql = `UPDATE stock
                SET selling_amount=selling_amount-?
                WHERE product_type=?;`;
                return await db.pintodb.query(sql,[disposedAmount,productType]);
            }else{
                throw new Error('This strock cannot be disposed');
            }
        }catch(err){
            throw err.message
        }
    }
}