module.exports = {
    async getTotalAmountInActiveOrder(productType){
        let sql = `SELECT sum(amount) as amount
        FROM product_order
        JOIN product_order_item ON product_order_item.order_id = product_order.order_id
        where product_order_item.type_of_product = ? AND product_order.status = 'ACTIVE'
        ;`;
        return (await db.pintodb.query(sql,[productType]))[0]['amount'] || 0;
    }
}