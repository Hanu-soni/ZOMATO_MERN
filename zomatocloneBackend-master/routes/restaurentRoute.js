const {Restaurent} = require('../models/restaurentSchema');
const express = require('express');
const router = express.Router();
//router.use(bcrypt);
const restaurentdata=require('../Data/restaurent');
console.log(restaurentdata)




Restaurent.insertMany(restaurentdata).then(() => {
    console.log('Demo data inserted successfully.');
  })
  .catch(error => {
    console.error('Error inserting demo data:', error);
  });

router.get('/getRestaurants', async (req, res) => {
     
   
    location_code = [...location_code,req.query?.location_code];
   const timing_code = req.query?.timing_codes;
   const selectedCuisine = req.query?.selectedCuisine;
   const sortBy = req.query?.sortBy;
   const result = await Restaurent.find();
  // console.log(result)
   //result=result.toArray();
   //console.log(result);

   const page = req.query?.page || 1;
   const limit = req.query?.limit || 2;

   let costFilter = req.query?.selectedCostRange;

   let filters = {};
   if (location_code) {
       filters['location_codes'] = location_code.join(',');
   }
   if (timing_code) {
       filters['timing_codes'] = timing_code.join(',');
   }
   if (selectedCuisine) {
       filters['cuisine'] = selectedCuisine.join(',');
   }
   // console.log(filters)

   

   let filtered_restuarants = [];

   // These are filter applied
   filtered_restuarants = result.filter(resturant => {
       return Object.keys(filters).every(filter => {
           //  return resturant[filter].includes(filters[filter])
           return resturant[filter].some((item, index) => satisfyCallBack(item, index, filters[filter]))
       });
   });

   //sorted Restaurants 
   if(sortBy === 'lowtohigh'){
       filtered_restuarants = filtered_restuarants.sort((item,nextItem) => {
           return item.cost - nextItem.cost;
       })
   }else if(sortBy === 'hightolow'){
       filtered_restuarants = filtered_restuarants.sort((item,nextItem) => {
           return nextItem.cost - item.cost;
       })
   }

   // cost filters
   if (costFilter) {
       console.log(costFilter)
       costFilter = JSON.parse(costFilter)
       filtered_restuarants = filtered_restuarants.filter((item) => {
           // console.log(costFilter.from)
           return (item.cost >= costFilter.from && item.cost <= costFilter.to)
       });
   }

   // const skip = (page-1)*limit;
   // const tempFr = [...filtered_restuarants];
   // tempFr.splice(0,skip);// To skip
   // //give 0 - limit-1 items
   // const limitAppliedItems = tempFr.slice(0,limit)
   // const finalfilter=filtered_restuarants;
   // on top of applying filters i also need specific page data

   try {
       res.send({
           'status': 200,
           'data': {
               'resturant':filtered_restuarants,
               'total':filtered_restuarants.length
           },
       })
   } catch (e) {
       console.error(e)
       res.send({
           'status': 200,
           'data': filtered_restuarants
       })
   }
});





router.delete('/deleteAllRestaurants', async (req, res) => {
    const result = await Restaurent.collection('restaurants').deleteMany({})
    if (result.acknowledged) {
        res.send({
            'status': 200,
            'message': 'All restaurants details deleted successfully',
            'result': result
        });
    } else {
        res.send({
            'status': 500,
            'message': 'MULTIPLE DELETE OPERATION FAILED',
            'result': result
        });
    }
});




router.post('/addRestaurants', async (req, res) => {
    let result = '';
    result = await Restaurent.collection('restaurants').insertMany([...restuarants]);
    res.send({
        'status': 200,
        'message': 'Food item addded successfully',
        'resultWeGot': result
    })
});




router.get('/getRestaurantDetails', async (req, res) => {
    // const resturantCode = req.query.code;

    let resturantDetails = await db1.find({'code':req.query.code});
    resturantDetails = Object.keys(resturantDetails).map((key) => [key, resturantDetails[key]]);
    // console.log(resrurantDetails);
    try {
        res.send({
            'status': 200,
            'data': resturantDetails,
        })
    } catch (e) {
        res.send({
            'status': 200,
            'data':resturantDetails,
        })
    }
});

module.exports=router;