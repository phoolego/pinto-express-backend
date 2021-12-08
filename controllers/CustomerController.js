const UserService = require("../services/UserService");
const StockService = require("../services/StockService");
const ProductService = require("../services/ProductService");
const PreOrderService = require("../services/PreOrderService");
const UploadFile = require('../services/FileUpload');
const OrderService = require("../services/OrderService");

module.exports = {
  async registerUser(req, res){
    try{
      param = req.body
      if(param.firstname && param.lastname && param.email && param.password && param.address && param.contact){
        result = await UserService.insertUser(param.firstname, param.lastname, param.email, param.password, param.address, param.contact, 'CUSTOMER');
        res.send(result);
      }else{
        res.status(403).send({
          message: `missing parameter${param.firstname?'':' firstname'}${param.lastname?'':' lastname'}${param.email?'':' email'}${param.password?'':' password'}${param.address?'':' address'}${param.contact?'':' contact'}`
        });
      }
    }catch(err){
      if(err.message){
        res.status(500).send({ message: err.message });
      }else{
        res.status(500).send({ message: err });
      }
    }
  },
  async getSellProduct(req, res){
    try{
      sellProduct = await ProductService.getSellProduct();
      preOrderProduct = await ProductService.getPreOrderProduct()
      result = sellProduct.concat(preOrderProduct);
      res.send(result);
    }catch(err){
      if(err.message){
        res.status(500).send({ message: err.message });
      }else{
        res.status(500).send({ message: err });
      }
    }
  },
  async getSellProductDetail(req, res){
    try{
      if(req.query.productType)
      {
        result = await ProductService.getSellProductDetail(req.query.productType);
        res.send(result);
      }else{
        res.status(403).send({
          message: `missing parameter${req.query.productType?'':' productType'}`
        });
      }
    }catch(err){
      if(err.message){
        res.status(500).send({ message: err.message });
      }else{
        res.status(500).send({ message: err });
      }
    }
  },
  async getPreOrderProductDetail(req, res){
    try{
      if(req.query.productType)
      {
        result = await ProductService.getPreOrderProductDetail(req.query.productType);
        res.send(result);
      }else{
        res.status(403).send({
          message: `missing parameter${req.query.productType?'':' productType'}`
        });
      }
    }catch(err){
      if(err.message){
        res.status(500).send({ message: err.message });
      }else{
        res.status(500).send({ message: err });
      }
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
      if(err.message){
        res.status(500).send({ message: err.message });
      }else{
        res.status(500).send({ message: err });
      }
    }
  },
  async getUserPreOrder(req, res){
    try{
      const param = req.query;
      const header = req.headers;
      if(header.userid){
          result = await PreOrderService.getUserPreOrder(header.userid,param.status);
          res.send(result);
      }else{
          res.status(403).send({
              message: `missing parameter${header.userid?'':' userId'}`,
          });
      }
    }catch(err){
      if(err.message){
        res.status(500).send({ message: err.message });
      }else{
        res.status(500).send({ message: err });
      }
    }
  },
  async insertPreOrder(req, res){
    try{
      const param = req.body;
      const header = req.headers;
      if(param.productType && param.amount && header.userid && param.sellingDate){
          result = await PreOrderService.insertPreOrder(param.productType,param.amount,header.userid,param.sellingDate);
          res.send(result);
      }else{
          res.status(403).send({
              message: `missing parameter${param.productType?'':' productType'}${param.amount?'':' amount'}${header.userid?'':' userId'}${param.sellingDate?'':' sellingDate'}`,
          });
      }
    }catch(err){
      if(err.message){
        res.status(500).send({ message: err.message });
      }else{
        res.status(500).send({ message: err });
      }
    }
  },
  // async waitPreOrder(req, res){
  //   try{
  //     const param = req.body;
  //     if(param.ppoId){
  //         result = await PreOrderService.insertPreOrder(param.ppoId);
  //         res.send(result);
  //     }else{
  //         res.status(403).send({
  //             message: `missing parameter${param.ppoId?'':' ppoId'}`,
  //         });
  //     }
  //   }catch(err){
  //     if(err.message){
  //       res.status(500).send({ message: err.message });
  //     }else{
  //       res.status(500).send({ message: err });
  //     }
  //   }
  // },
  async getUserOrder(req, res){
    try{
      const param = req.query;
      const header = req.headers;
      if(header.userid){
          result = await OrderService.getUserOrder(header.userid,param.status);
          res.send(result);
      }else{
          res.status(403).send({
              message: `missing parameter${header.userid?'':' userId'}`,
          });
      }
    }catch(err){
      if(err.message){
        res.status(500).send({ message: err.message });
      }else{
        res.status(500).send({ message: err });
      }
    }
  },
  async insertOrder(req, res){
    try{
      const param = req.body;
      const header = req.headers;
      let orderItem = JSON.parse(param.orderItem);
      if(param.paymentType && param.deliveryType && param.deliveryPrice!=null && header.userid && orderItem && orderItem.length>0){
          const result = await OrderService.insertOrder(header.userid,param.paymentType,param.deliveryType,param.deliveryPrice,orderItem);
          res.send(result);
      }else{
          res.status(403).send({
              message: `missing parameter${param.paymentType?'':' paymentType'}${param.deliveryType?'':' deliveryType'}${header.userid?'':' userId'}${orderItem?'':' orderItem'}`
              +`${orderItem.length>0?'':' empty orderItem'}${param.deliveryPrice!=null?'':' deliveryPrice'}`,
          });
      }
    }catch(err){
      if(err.message){
        res.status(500).send({ message: err.message });
      }else{
        res.status(500).send({ message: err });
      }
    }
  },
};
  