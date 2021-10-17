const FarmProductService = require("../services/FarmProductService");
module.exports = {
    async getFarmerProduct(req, res){
        try{
            const farmerId = req.farmerId;
            if(farmerId){
                result = await FarmProductService.getFarmerProduct(farmerId);
                res.send(result);
            }else{
                res.status(403).send({message: 'missing parameter farmerId'});
            }
        }catch(err){
            res.status(500).send({ message: err });
        }
    },
    async getFarmerProductDetail(req, res){
        try{
            const productId = req.query.productId;
            if(productId){
                result = await FarmProductService.getFarmerProductDetail(productId);
                res.send(result);
            }else{
                res.status(403).send({message: 'missing parameter productId'});
            }
        }catch(err){
            res.status(500).send({ message: err });
        }
    },
    async insertFarmerProduct(req, res){
        try{
            const farmerId = req.farmerId;
            const param = req.body;
            if(farmerId && param.productType && param.area && param.plantDate && param.predictHarvestDate && param.predictAmount){
                result = await FarmProductService.insertFarmerProduct(farmerId, param.productType, param.area, param.plantDate,param.predictHarvestDate,param.predictAmount);
                res.send(result);
            }else{
                res.status(403).send({
                    message: `missing parameter${farmerId?'':' farmerId'}${param.productType?'':' productType'}${param.area?'':' area'}${param.plantDate?'':' plantDate'}`+
                    `${param.predictHarvestDate?'':' predictHarvestDate'}${param.predictAmount?'':' predictAmount'}`,
                });
            }
        }catch(err){
            res.status(500).send({ message: err });
        }
    },
    async harvestFarmerProduct(req, res){
        try{
            const param = req.body;
            if(param.productId && param.harvestDate && param.harvestAmount){
                result = await FarmProductService.harvestFarmerProduct(param.productId,param.harvestDate, param.harvestAmount);
                res.send(result);
            }else{
                res.status(403).send({
                    message: `missing parameter${param.productId?'':' productId'}${param.harvestDate?'':' harvestDate'}${param.harvestAmount?'':' harvestAmount'}`,
                });
            }
        }catch(err){
            res.status(500).send({ message: err });
        }
    },
    async disposeFarmerProduct(req, res){
        try{
            const param = req.body;
            if(param.productId){
                result = await FarmProductService.disposedProduct(param.productId);
                res.send(result);
            }else{
                res.status(403).send({
                    message: `missing parameter${param.productId?'':' productId'}`,
                });
            }
        }catch(err){
            res.status(500).send({ message: err });
        }
    },
    async getSendStockProduct(req, res){
        try{
            const param = req.query;
            if(param.productId){
                result = await FarmProductService.getSendStockProduct(param.productId);
                res.send(result);
            }else{
                res.status(403).send({
                    message: `missing parameter${param.productId?'':' productId'}`,
                });
            }
        }catch(err){
            res.status(500).send({ message: err });
        }
    },
    async insertSendStockProduct(req, res){
        try{
            const param = req.body;
            if(param.productId && param.sspAmount && param.sspPrice){
                result = await FarmProductService.insertSendStockProduct(param.productId,param.sspAmount, param.sspPrice);
                res.send(result);
            }else{
                res.status(403).send({
                    message: `missing parameter${param.productId?'':' productId'}${param.sspAmount?'':' sspAmount'}${param.sspPrice?'':' sspPrice'}`,
                });
            }
        }catch(err){
            res.status(500).send({ message: err });
        }
    },
    async cancelSendStockProduct(req, res){
        try{
            const param = req.body;
            if(param.sspId){
                result = await FarmProductService.cancelSendStockProduct(param.sspId);
                res.send(result);
            }else{
                res.status(403).send({
                    message: `missing parameter${param.sspId?'':' sspId'}`,
                });
            }
        }catch(err){
            res.status(500).send({ message: err });
        }
    }
}