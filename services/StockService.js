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
    },
    async getStockList(){
        try{
            let sql = `SELECT name, name_eng, selling_amount, preorder_amount, unit
            FROM type_of_product
            INNER JOIN stock ON type_of_product.name = stock.product_type;`;
            return await db.pintodb.query(sql,[]);
        }catch(err){
            throw err.message;
        }
    },
    async getStockDetail(ProductType){
        try{
            let sql = `SELECT name, name_eng, selling_amount, preorder_amount, unit
            FROM type_of_product
            INNER JOIN stock ON type_of_product.name = stock.product_type
            WHERE stock.product_type = ?;`;
            const detail = (await db.pintodb.query(sql,[ProductType]))[0];
            sql = `SELECT farmer.farmer_id, farmer.farm_name, send_stock_product.ssp_status, sum(ssp_amount) AS amount
            FROM farmer
            INNER JOIN product ON product.farmer_id = farmer.farmer_id
            INNER JOIN send_stock_product ON send_stock_product.product_id = product.product_id
            WHERE NOT product.status = 'DISPOSED' AND product.type_of_product = ?
            GROUP BY farmer.farmer_id, send_stock_product.ssp_status;`;
            const farmers = await db.pintodb.query(sql,[ProductType]);
            return {...detail,farmers};
        }catch(err){
            throw err.message
        }
    }
}