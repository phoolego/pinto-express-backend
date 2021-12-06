const Utility = require('./Utility');
module.exports = {
    async getProductType(){
        try{
            let sql = `SELECT name, name_eng, price_buy, price_sell, unit, CONCAT(? , picture_of_product) AS picture_of_product
            FROM type_of_product;`;
            return await db.pintodb.query(sql,[process.env.BASE_URL]);
        }catch(err){
            throw err.message;
        }
    },
    async insertProductType(name, nameEng, priceBuy, priceSell, unit){
        try{
            let sql = `INSERT INTO type_of_product (name, name_eng, price_buy, price_sell, unit)
            VALUE(?,?,?,?,?);`;
            await db.pintodb.query(sql,[name, nameEng, priceBuy, priceSell, unit]);
            sql = `INSERT INTO stock (product_type)
            VALUE(?);`;
            return await db.pintodb.query(sql,[name]);
        }catch(err){
            if(err.code=='ER_DUP_ENTRY'){
                throw `duplicate named`;
            }
            throw err.message;
        }
    },
    async updateProductType(oldName,name, nameEng, priceBuy, priceSell, unit){
        try{
            let sql =`UPDATE type_of_product
            SET name=?, name_eng=?, price_buy=?, price_sell=?, unit=?
            WHERE name = ?;`;
            return await db.pintodb.query(sql,[name, nameEng, priceBuy, priceSell, unit, oldName]);
        }catch(err){
            throw err.message;
        }
    },
    async updateProductTypePic(name, productPic){
        try{
            let sql =`UPDATE type_of_product
            SET picture_of_product=?
            WHERE name = ?;`;
            return await db.pintodb.query(sql,[productPic,name]);
        }catch(err){
            throw err.message;
        }
    },
    async getSellProduct(){
        try{
            let sql = `SELECT name, name_eng, price_sell, unit, selling_amount, CONCAT(? , picture_of_product) AS picture_of_product, 'SELLING' as sell_type
            FROM type_of_product
            JOIN stock ON stock.product_type = type_of_product.name
            where selling_amount > 0
            ;`;
            return await db.pintodb.query(sql,[process.env.BASE_URL]);
        }catch(err){
            throw err.message;
        }
    },
    async getSellProductDetail(productType){
        try{
            let sql = `SELECT name, name_eng, price_sell, unit, selling_amount, CONCAT(? , picture_of_product) AS picture_of_product
            FROM type_of_product
            JOIN stock ON stock.product_type = type_of_product.name
            where stock.product_type = ?
            ;`;
            const productDetail = (await db.pintodb.query(sql,[process.env.BASE_URL,productType]))[0];
            sql = `SELECT max(plant_date) as plant_date, max(harvest_date) as harvest_date, farm_name
            FROM send_stock_product as ssp
            JOIN product ON ssp.product_id = product.product_id
            JOIN farmer ON product.farmer_id = farmer.farmer_id
            where product.type_of_product = ? AND (ssp_status = 'DELIVERED' OR ssp_status = 'PAID') AND NOT product.status = 'DISPOSED'
            GROUP BY farm_name
            ;`;
            const sourceFarm = await db.pintodb.query(sql,[productType]);
            return {...productDetail,sourceFarm:sourceFarm};
        }catch(err){
            throw err.message;
        }
    },
    async getpreOrderProduct(){
        try{
            let sql = `SELECT name, name_eng, price_sell, unit, CONCAT(? , picture_of_product) AS picture_of_product, recent_date.predict_harvest_date, 'PRE-ORDER' as sell_type
            FROM type_of_product
            JOIN stock ON stock.product_type = type_of_product.name
            JOIN (
                SELECT min(predict_harvest_date) as predict_harvest_date, type_of_product
                FROM send_stock_product as ssp
                JOIN product ON ssp.product_id = product.product_id
                WHERE ssp_status = 'PREPARE'
                group by type_of_product
            ) as recent_date ON recent_date.type_of_product = type_of_product.name
            where preorder_amount > 0
            ;`;
            result = await db.pintodb.query(sql,[process.env.BASE_URL]);
            for(let i=0 ; i<result.length ; i++){
                startDate = Utility.getLocalTime(Utility.findWeekinMonth(result[i]['predict_harvest_date']));
                let sql = `SELECT sum(ssp_amount) as ssp_amount
                FROM pinto_project.send_stock_product as ssp
                JOIN pinto_project.product ON ssp.product_id = product.product_id
                where ssp_status = 'PREPARE' AND predict_harvest_date BETWEEN ? AND DATE(? + INTERVAL 6 DAY)
                AND type_of_product = ?
                group by type_of_product
                ;`;
                currentAmount = (await db.pintodb.query(sql,[startDate,startDate,result[i]['name']]))[0];
                result[i]['pre_order_amount'] = currentAmount['ssp_amount'];
                result[i]['predict_harvest_date'] = Utility.findWeekinMonth(result[i]['predict_harvest_date']);
            }
            return result
        }catch(err){
            throw err.message;
        }
    },
    async getpreOrderProductDetail(productType){
        try{
            let sql = `SELECT name, name_eng, price_sell, unit, CONCAT(? , picture_of_product) AS picture_of_product, recent_date.predict_harvest_date, 'PRE-ORDER' as sell_type
            FROM type_of_product
            JOIN stock ON stock.product_type = type_of_product.name
            JOIN (
                SELECT min(predict_harvest_date) as predict_harvest_date, type_of_product
                FROM send_stock_product as ssp
                JOIN product ON ssp.product_id = product.product_id
                WHERE ssp_status = 'PREPARE'
                group by type_of_product
            ) as recent_date ON recent_date.type_of_product = type_of_product.name
            where stock.product_type = ?
            ;`;
            result = (await db.pintodb.query(sql,[process.env.BASE_URL,productType]))[0];

            startDate = Utility.getLocalTime(Utility.findWeekinMonth(result['predict_harvest_date']));
            sql = `SELECT sum(ssp_amount) as ssp_amount
            FROM pinto_project.send_stock_product as ssp
            JOIN pinto_project.product ON ssp.product_id = product.product_id
            where ssp_status = 'PREPARE' AND predict_harvest_date BETWEEN ? AND DATE(? + INTERVAL 6 DAY)
            AND type_of_product = ?
            group by type_of_product
            ;`;
            currentAmount = (await db.pintodb.query(sql,[startDate,startDate,result['name']]))[0];
            result['pre_order_amount'] = currentAmount['ssp_amount'];
            result['predict_harvest_date'] = Utility.findWeekinMonth(result['predict_harvest_date']);

            sql = `SELECT max(plant_date) as plant_date, max(predict_harvest_date) as harvest_date, farm_name
            FROM send_stock_product as ssp
            JOIN product ON ssp.product_id = product.product_id
            JOIN farmer ON product.farmer_id = farmer.farmer_id
            where product.type_of_product = ? AND (ssp_status = 'PREPARE') AND NOT product.status = 'DISPOSED'
            AND predict_harvest_date BETWEEN ? AND DATE(? + INTERVAL 6 DAY)
            GROUP BY farm_name
            ;`;
            const sourceFarm = await db.pintodb.query(sql,[productType,startDate,startDate]);
            return {...result, sourceFarm:sourceFarm};
        }catch(err){
            throw err.message;
        }
    },
}