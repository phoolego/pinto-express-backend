const UserService = require("../services/UserService");
const StockService = require("../services/StockService");
const AdminSerivce = require("../services/AdminService");
const ProductService = require("../services/ProductService");

module.exports = {
  async loginEmailAdmin(req, res){
    try{
      param = req.body
      if(param.email && param.password){
        result = await UserService.loginEmailAdmin(param.email, param.password);
        res.send(result);
      }else{
        res.status(403).send({
          message: `missing parameter${param.email?'':' email'}${param.password?'':' password'}`
        });
      }
    }catch(err){
      res.status(500).send({ message: err });
    }
  },
  async insertProductType(req, res){
    try{
      productPic = req.file.path.replace(/\\\\/g,'/').replace(/\.\./g,'');
      console.log(productPic);
      const param = req.body;
      if(param.name && param.nameEng && param.priceBuy && param.priceSell && param.unit){
        // productPic = req.file.path.replace(/\\\\/g,'/').replace(/\.\./g,'');
        // console.log(productPic);
        result = await ProductService.insertProductType(param.name, param.nameEng, param.priceBuy,param.priceSell,param.unit,productPic);
        res.send(result);
      }else{
        res.status(403).send({
          message: `missing parameter${param.name?'':' name'}${param.nameEng?'':' nameEng'}${param.priceBuy?'':' priceBuy'}`+
          `${param.priceSell?'':' priceSell'}${param.unit?'':' unit'}`,
        });
      }
    }catch(err){
        res.status(500).send({ message: err });
    }
},
  async getStockList(req, res){
    try{
      result = await StockService.getStockList();
      res.send(result);
    }catch(err){
      res.status(500).send({ message: err });
    }
  },
  async getStockDetail(req, res){
    try{
        const param = req.query;
        if(param.productType){
            result = await StockService.getStockDetail(param.productType);
            res.send(result);
        }else{
            res.status(403).send({
                message: `missing parameter${param.productType?'':' productType'}`,
            });
        }
    }catch(err){
        res.status(500).send({ message: err });
    }
  },
  async getFarmStockProduct(req, res){
    try{
        const param = req.query;
        if(param.productId && param.farmerId){
            result = await StockService.getFarmStockProduct(param.productId,param.farmerId);
            res.send(result);
        }else{
            res.status(403).send({
                message: `missing parameter${param.productType?'':' productType'}${param.farmerId?'':' farmerId'}`,
            });
        }
    }catch(err){
        res.status(500).send({ message: err });
    }
  },
  async receiveSendStockProduct(req, res){
    try{
      const param = req.body;
      if(param.sspId){
          result = await AdminSerivce.receiveSendStockProduct(param.sspId);
          res.send(result);
      }else{
          res.status(403).send({
              message: `missing parameter${param.sspId?'':' sspId'}`,
          });
      }
    }catch(err){
        res.status(500).send({ message: err });
    }
  },
  async receiveSendStockProduct(req, res){
    try{
      const param = req.body;
      if(param.sspId){
          result = await AdminSerivce.receiveSendStockProduct(param.sspId);
          res.send(result);
      }else{
          res.status(403).send({
              message: `missing parameter${param.sspId?'':' sspId'}`,
          });
      }
    }catch(err){
        res.status(500).send({ message: err });
    }
  },
  async paySendStockProduct(req, res){
    try{
      const param = req.body;
      if(param.sspId){
          result = await AdminSerivce.paySendStockProduct(param.sspId);
          res.send(result);
      }else{
          res.status(403).send({
              message: `missing parameter${param.sspId?'':' sspId'}`,
          });
      }
    }catch(err){
        res.status(500).send({ message: err });
    }
  },
};
  