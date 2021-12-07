const Utility = require('./Utility');
module.exports = {
    async insertPreOrder(productType,amount,userId,sellingDate){
        try{
            let sql = `SELECT preorder_amount
            FROM stock
            WHERE product_type = ?
            ;`;
            const remainPreOrder = (await db.pintodb.query(sql,[productType]))[0];
            if(remainPreOrder>=amount){
                let sql = `INSERT INTO product_pre_order (user_id,type_of_product,amount,status,selling_date)
                VALUE(?,?,?,'ACTIVE',?)
                ;`;
                return await db.pintodb.query(sql,[userId,productType,amount,sellingDate]);
            }else{
                throw new Error('not enough preorder_amount');
            }
        }catch(err){
            throw err.message;
        }
    },
    async turnWaitPreOrder(ppoId){
        try{
            let sql = `UPDATE product_pre_order
            SET status = 'WAIT'
            WHERE ppo_id = ?
            ;`;
            return remainPreOrder = (await db.pintodb.query(sql,[ppoId]))[0];
        }catch(err){
            throw err.message;
        }
    },
    async turnCompletedPreOrder(ppoId){
        try{
            let sql = `UPDATE product_pre_order
            SET status = 'COMPLETED'
            WHERE ppo_id = ?
            ;`;
            return remainPreOrder = (await db.pintodb.query(sql,[ppoId]))[0];
        }catch(err){
            throw err.message;
        }
    },
    async getActivePreOrder(productType, sellingDate){
        let sql = `SELECT ppo_id, user_id, type_of_product, amount, status, selling_date
        FROM product_pre_order
        where type_of_product = ? AND status = 'ACTIVE' AND selling_date = 
        ;`;
        return await db.pintodb.query(sql,[productType,sellingDate]);
    },
    async getTotalAmountInActivePreOrder(productType){
        let sql = `SELECT sum(amount) as amount
        FROM product_pre_order
        where type_of_product = ? AND (status = 'ACTIVE' OR status = 'WAIT')
        ;`;
        return (await db.pintodb.query(sql,[productType]))[0]['amount'] || 0;
    },
    async getTotalAmountInRecentPreOrder(productType){
        let sql = `SELECT sum(amount) as amount
        FROM product_pre_order
        where type_of_product = ? AND (status = 'ACTIVE' OR status = 'WAIT')
        AND now() >= selling_date
        ;`;
        return (await db.pintodb.query(sql,[productType]))[0]['amount'] || 0;
    },
    async getTotalAmountInScopePreOrder(productType,sellingDate){
        console.log(productType,sellingDate);
        let sql = `SELECT sum(amount) as amount
        FROM product_pre_order
        where type_of_product = ? AND (status = 'ACTIVE' OR status = 'WAIT')
        AND selling_date = ?
        ;`;
        return (await db.pintodb.query(sql,[productType,sellingDate]))[0]['amount'] || 0;
    },
    async getTotalWaitAmountInScopePreOrder(productType,sellingDate){
        console.log(productType,sellingDate);
        let sql = `SELECT sum(amount) as amount
        FROM product_pre_order
        where type_of_product = ? AND status = 'WAIT'
        AND selling_date = ?
        ;`;
        return (await db.pintodb.query(sql,[productType,sellingDate]))[0]['amount'] || 0;
    },
}