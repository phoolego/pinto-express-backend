const PreOrderService = require("./PreOrderService");
const Utility = require("./Utility");
module.exports = {
    async getTotalAmountInActiveOrder(productType){
        try{
            let sql = `SELECT sum(amount) as amount
            FROM product_order
            JOIN product_order_item ON product_order_item.order_id = product_order.order_id
            where product_order_item.type_of_product = ? AND product_order.status in ('WAIT','PAID','VERIFIED')
            ;`;
            return (await db.pintodb.query(sql,[productType]))[0]['amount'] || 0;
        }catch(err){
            throw err.message;
        }
    },
    async getUserOrder(userId,status){
        let sql = `SELECT order_id, payment_type, status, delivery_type, created_date, user_id, CONCAT(? , tran_pic) AS tran_pic, delivery_price, destination
        FROM product_order
        where user_id = ? `;
        if(status){
            sql += `AND status = ?;`
        }
        let order = await db.pintodb.query(sql,[process.env.BASE_URL,userId,status]);
        for(let i=0 ; i<order.length ; i++){
            let sql = `SELECT order_item_id, order_id, type_of_product, amount, unit, price, ppo_id
            FROM product_order_item
            where order_id = ? ;`;
            order[i]['orderItem'] = await db.pintodb.query(sql,[order[i]['order_id']]);
        }
        return order;
    },
    async getAllUserOrder(status){
        let sql = `SELECT order_id, payment_type, status, delivery_type, created_date, user.user_id, CONCAT(? , tran_pic) AS tran_pic, delivery_price, destination,
        firstname, lastname, email, address, contact
        FROM product_order
        JOIN user ON product_order.user_id = user.user_id
        `;
        if(status){
            sql += `WHERE status = ?`
        }
        sql += `ORDER BY created_date`;
        let order = await db.pintodb.query(sql,[process.env.BASE_URL,status]);
        for(let i=0 ; i<order.length ; i++){
            let sql = `SELECT order_item_id, order_id, type_of_product, amount, unit, price, ppo_id
            FROM product_order_item
            where order_id = ? ;`;
            order[i]['orderItem'] = await db.pintodb.query(sql,[order[i]['order_id']]);
        }
        return order;
    },
    async insertOrder(userId,paymentType,deliveryType,deliveryPrice,orderItem,destination){
        try{
            for(let i=0 ; i<orderItem.length ; i++){
                let sql = `SELECT selling_amount
                FROM stock
                where product_type = ?
                ;`;
                const productSell = (await db.pintodb.query(sql,[orderItem[i]['type_of_product']]))[0]['selling_amount'];
                const totalOrderAmount = await this.getTotalAmountInActiveOrder(orderItem[i]['type_of_product']);
                const totalPreOrderAmount = await PreOrderService.getTotalAmountInRecentPreOrder(orderItem[i]['type_of_product']);
                let preOrder = 0;
                if(orderItem[i]['ppo_id']!=null){
                    preOrder = (await PreOrderService.getPreOrder(orderItem[i]['ppo_id']))['amount'];
                }
                if(orderItem[i]['amount']>productSell+preOrder-totalOrderAmount-totalPreOrderAmount){
                    throw new Error('not enough product');
                }
            }
            let sql =`INSERT INTO product_order (payment_type, status, delivery_type, created_date, user_id, delivery_price, destination)
            VALUE(?,?,?,?,?,?,?)
            `;
            const insert = await db.pintodb.query(sql,[paymentType,'WAIT',deliveryType,Utility.getCurrentTime(),userId,deliveryPrice,destination]);
            for(let i=0 ; i<orderItem.length ; i++){
                let sql = `INSERT INTO product_order_item (order_id, type_of_product, amount, unit, price)
                VALUE(?,?,?,?,?)
                ;`;
                await db.pintodb.query(sql,[
                    insert['insertId'],
                    orderItem[i]['type_of_product'],
                    orderItem[i]['amount'],
                    orderItem[i]['unit'],
                    orderItem[i]['price']
                ]);
                if(orderItem[i]['ppo_id']!=null){
                    await PreOrderService.turnCompletedPreOrder(orderItem[i]['ppo_id']);
                }
            }
            return insert;
        }catch(err){
            throw err.message;
        }
    },
    async updateOrderTransactionImage(orderId,imagePath){
        let sql =`UPDATE product_order
        SET tran_pic = ?, status = 'PAID'
        WHERE order_id = ?
        `;
        return await db.pintodb.query(sql,[imagePath,orderId]);
    },
    async validateOrder(orderId){
        let sql =`UPDATE product_order
        SET status = 'VALIDATE'
        WHERE order_id = ?
        `;
        return await db.pintodb.query(sql,[orderId]);
    },
    async completeOrder(orderId){
        let sql =`UPDATE product_order
        SET status = 'COMPLETE'
        WHERE order_id = ?
        `;
        return await db.pintodb.query(sql,[orderId]);
    }
}