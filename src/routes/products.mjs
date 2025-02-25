import {Router} from 'express';
import {mockproducts} from './utils/constants.mjs';
const router = Router();
export default router;
router.get('/api/products', (req, res) => {
    //grab cookies
    console.log(req.cookies);
    if(req.cookies.hello && req.cookies.hello === 'world'){
        console.log('cookies found');
        return res.send('cookies not found');

    }

  res.send(mockproducts);
});