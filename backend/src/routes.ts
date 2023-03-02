import { Router } from "express";
import multer from "multer";
import { CreateCategoryController } from "./controllers/category/CreateCategoryController";
import { ListCategoryController } from "./controllers/category/ListCategoryController";
import { CreateProductController } from "./controllers/producty/CreateProductController";
import { AuthController } from "./controllers/user/AuthController";
import { CreateUserController } from "./controllers/user/CreateUserController";
import { DetailUserController } from "./controllers/user/DetailUserController";
import { isAuthenticated } from "./middlewars/isAuthticated";
import uploadConfig from './config/multerconfig';
import { ListByCategoryController } from "./controllers/producty/ListByCategoryController";
import { CreateOrderController } from "./controllers/order/OrderCreateController";
import { RemoveOrderController } from "./controllers/order/RemoveOrderController";
import { AddItemController } from "./controllers/order/AddItemController";
import { RemoveItemController } from "./controllers/order/RemoveItemController";
import { SendOrderController } from "./controllers/order/SendOrderCOntroller";
import { ListOrdersController } from "./controllers/order/ListOrdersController";
import { DetailOrderController } from "./controllers/order/DetailOrderController";
import { FinishOrderController } from "./controllers/order/FinishOrderController";

export const router = Router();

const upload = multer(uploadConfig.upload('./tmp'))

//Rotas de User

router.post('/user', new CreateUserController().handle)

router.post('/session', new AuthController().handle)

router.get('/me', isAuthenticated, new DetailUserController().handle)

// Rotas de Category

router.post('/category', isAuthenticated, new CreateCategoryController().handle )  

router.get('/category', isAuthenticated, new ListCategoryController().handle )

//Rotas de Product

router.post('/product', isAuthenticated, upload.single('file') ,new CreateProductController().handle)

router.get('/category/product', isAuthenticated, new ListByCategoryController().handle )


// Rotas de Orders

router.post('/order', isAuthenticated, new CreateOrderController().handle )

router.delete('/delete', isAuthenticated, new RemoveOrderController().handle )

router.post('/order/add', isAuthenticated, new AddItemController().handle)

router.delete('/order/remove', isAuthenticated, new RemoveItemController().handle )

router.put('/order/send', isAuthenticated, new SendOrderController().handle )

router.get('/orders', isAuthenticated, new ListOrdersController().handle)

router.get('/order/detail', isAuthenticated, new DetailOrderController().handle)

router.put('/order/finish', isAuthenticated, new FinishOrderController().handle)