//All middlewares and important libraries to be loaded
const bcrypt =require('bcrypt');
const express=require('express');
const uri = process.env.MONGODB_CONNECTION_URI;
//const xlsxFile =require('read-excel-file/node') ;
const jwt=require('jsonwebtoken');
const mongoose = require("mongoose");

const { Int32 } = require('mongodb');
const cors=require('cors');
const restaurentdata=require('./Data/restaurent');
const saltRounds = 10;
const dbCon=require('./Connection/dbcon')
const POST=3000
const dotenv=require('dotenv');
// app.use(dbCon)



//getting all the routes
const userRoute=require('./routes/userRoute')
const restaurantRoute=require('./routes/restaurentRoute');



//Dummy data
const timings = {
    'BRF': 'BRF',
    'LCH': 'LCH',
    'DNR': 'DNR',
    'NGT': 'NGT',
    'SKS': 'SKS',
    'DRK': 'DRK',
};

const locationCodes = {
    'BLR': 'BLR',
    'MUM': 'MUM',
    'CHN': 'CHN',
    'AP': 'AP'
};

const quickResturantFilters = [
    {
        'timing': 'Breakfast',
        'code': timings.BRF,
        'image': 'https://github.com/DivyashantKumar/assignment-first/blob/main/images/1image.png?raw=true',
        'description': 'Start Your day with exclusive breakfast options'
    },
    {
        'timing': 'Lunch',
        'code': timings.LCH,
        'image': 'https://github.com/DivyashantKumar/assignment-first/blob/main/images/2image.png?raw=true',
        'description': 'Start Your day with exclusive breakfast options'
    },
    {
        'timing': 'Dinner',
        'code': timings.DNR,
        'image': 'https://github.com/DivyashantKumar/assignment-first/blob/main/images/3image.png?raw=true',
        'description': 'Start Your day with exclusive breakfast options'
    },
    {
        'timing': 'Snacks',
        'code': timings.SKS,
        'image': 'https://github.com/DivyashantKumar/assignment-first/blob/main/images/4image.png?raw=true',
        'description': 'Start Your day with exclusive breakfast options'
    },
    {
        'timing': 'Drinks',
        'code': timings.DRK,   
        'image': 'https://github.com/DivyashantKumar/assignment-first/blob/main/images/5image.png?raw=true',
        'description': 'Start Your day with exclusive breakfast options'
    },
    {
        'timing': 'Night',
        'code': timings.NGT,
        'image': 'https://github.com/DivyashantKumar/assignment-first/blob/main/images/6image.png?raw=true',
        'description': 'Start Your day with exclusive breakfast options'
    }
]

//const client = new MongoClient(uri, {});

const app = express();
const PORT =  process.env.PORT || 8000;

//middlewares used 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
require('dotenv').config();

//const db='foods';

//Connection to mongodb
const dbURL=process.env.DB_URL;
const Database=mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });
  //schema for database
//   const userSchema = mongoose.Schema({
//     username: String,
//     password: String,
//     role: { type: String, default: 'user' } // Providing a default value for the role field
// });


//Collection for User to be used...
//const User = mongoose.model('User', userSchema);


//
function getHeaderFromToken(token) {
    const decodedToken = jwt.decode(token, {
        complete: true
    });

    if (!decodedToken) {
        throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, `provided token does not decode as JWT`);
    }

    return decodedToken;
}


//Modal
const db1=require('./models/restaurentSchema')




// END POINTS
app.get('/getFood', async (req, res) => {
    try {
        console.log(req.headers.token)
        const tokenHeaders = getHeaderFromToken(req.headers.token);
        console.log(tokenHeaders);
        const limitGiven = parseInt(req.query.limit) || 100;
        const pageGiven = parseInt(req.query.page) || 1;
        const itemsToSkip = (pageGiven - 1) * limitGiven;

        const totalRecord = await (await db.collection('food').find({}).toArray()).length;
        const foods = await db.collection('food').find({}).skip(itemsToSkip).limit(limitGiven).toArray();
        res.send({
            'status': 200,
            'data': foods,
            'total': totalRecord
        })
    } catch (e) {
        res.send({
            'status': 500,
            'data': e
        })
    }
});

app.get('/getQuickResurantFilters', async (req, res) => {
    try {
        res.send({
            'status': 200,
            'data': quickResturantFilters,
        })
    } catch (e) {
        res.send({
            'status': 200,
            'data': quickResturantFilters
        })
    }
});

app.get('/getLocations', async (req, res) => {
    const locations = [
        {
            'name': 'Bangalore',
            'code': locationCodes.BLR
        },
        {
            'name': 'Chennai',
            'code': locationCodes.CHN
        },
        {
            'name': 'Andra',
            'code': locationCodes.AP
        },
        {
            'name': 'Mumbai',
            'code': locationCodes.MUM
        }

    ]
    try {
        res.send({
            'status': 200,
            'data': locations,
        })
    } catch (e) {
        res.send({
            'status': 200,
            'data': locations
        })
    }
});





//require-now
// app.post('/addRestaurants', async (req, res) => {
//     let result = '';
//     result = await db.collection('restaurants').insertMany([...restuarants]);
//     res.send({
//         'status': 200,
//         'message': 'Food item addded successfully',
//         'resultWeGot': result
//     })
// });



//require-now
// app.delete('/deleteAllRestaurants', async (req, res) => {
//     const result = await db.collection('restaurants').deleteMany({})
//     if (result.acknowledged) {
//         res.send({
//             'status': 200,
//             'message': 'All restaurants details deleted successfully',
//             'result': result
//         });
//     } else {
//         res.send({
//             'status': 500,
//             'message': 'MULTIPLE DELETE OPERATION FAILED',
//             'result': result
//         });
//     }
// });

//const db1=mongoose.model('resturant_details1',restaurentSchema);
console.log(restaurentdata)


//require-now
// db1.insertMany(restaurentdata).then(() => {
//     console.log('Demo data inserted successfully.');
//   })
//   .catch(error => {
//     console.error('Error inserting demo data:', error);
//   });

let location_code=[],timing_code=[],selectedCuisine=[];







//require-now
// app.get('/getRestaurants', async (req, res) => {
     
   
//      location_code = [...location_code,req.query?.location_code];
//     const timing_code = req.query?.timing_codes;
//     const selectedCuisine = req.query?.selectedCuisine;
//     const sortBy = req.query?.sortBy;
//     const result = await db1.find();
//    // console.log(result)
//     //result=result.toArray();
//     //console.log(result);

//     const page = req.query?.page || 1;
//     const limit = req.query?.limit || 2;

//     let costFilter = req.query?.selectedCostRange;

//     let filters = {};
//     if (location_code) {
//         filters['location_codes'] = location_code.join(',');
//     }
//     if (timing_code) {
//         filters['timing_codes'] = timing_code.join(',');
//     }
//     if (selectedCuisine) {
//         filters['cuisine'] = selectedCuisine.join(',');
//     }
//     // console.log(filters)

    

//     let filtered_restuarants = [];

//     // These are filter applied
//     filtered_restuarants = result.filter(resturant => {
//         return Object.keys(filters).every(filter => {
//             //  return resturant[filter].includes(filters[filter])
//             return resturant[filter].some((item, index) => satisfyCallBack(item, index, filters[filter]))
//         });
//     });

//     //sorted Restaurants 
//     if(sortBy === 'lowtohigh'){
//         filtered_restuarants = filtered_restuarants.sort((item,nextItem) => {
//             return item.cost - nextItem.cost;
//         })
//     }else if(sortBy === 'hightolow'){
//         filtered_restuarants = filtered_restuarants.sort((item,nextItem) => {
//             return nextItem.cost - item.cost;
//         })
//     }

//     // cost filters
//     if (costFilter) {
//         console.log(costFilter)
//         costFilter = JSON.parse(costFilter)
//         filtered_restuarants = filtered_restuarants.filter((item) => {
//             // console.log(costFilter.from)
//             return (item.cost >= costFilter.from && item.cost <= costFilter.to)
//         });
//     }

//     // const skip = (page-1)*limit;
//     // const tempFr = [...filtered_restuarants];
//     // tempFr.splice(0,skip);// To skip
//     // //give 0 - limit-1 items
//     // const limitAppliedItems = tempFr.slice(0,limit)
//     // const finalfilter=filtered_restuarants;
//     // on top of applying filters i also need specific page data

//     try {
//         res.send({
//             'status': 200,
//             'data': {
//                 'resturant':filtered_restuarants,
//                 'total':filtered_restuarants.length
//             },
//         })
//     } catch (e) {
//         console.error(e)
//         res.send({
//             'status': 200,
//             'data': filtered_restuarants
//         })
//     }
// });

function satisfyCallBack(resturantItem, index, filterItem) {
    let flag = false;
    const splitArray = filterItem.split(',');
    splitArray.forEach(element => {
        flag = flag || (element === resturantItem);
    });
    return (flag);
}



//require-now
app.get('/getRestaurantDetails', async (req, res) => {
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



// app.put('/updateRestaurant', async (req, res) => {

//     const mongoObjectToUpdate = mongodb.ObjectId(req.body._id);
//     console.error(req.body);
//     // What to update with
//     const foodCollection = db.collection('restaurants');

//     // let updatedObject = {
//     //     'name': req.body.name,
//     // }

//     // If new value comes take it ... else please dont give the key itself such that i can keep the old values

//     // add if item is [greater than 5 and less than 10]


//     // if (req.body.cuisine) {
//     //     updatedObject = { ...updatedObject, 'cuisine': req.body.cuisine }
//     // }

//     // if (req.body.cost) {
//     //     updatedObject = { ...updatedObject, 'cost': req.body.cost }
//     // }

//     const result = await foodCollection.updateOne(
//         { _id: mongoObjectToUpdate },
//         {
//             $set: {
//                 menu: [
//                     {
//                         'name': 'Gobi Manchurian',
//                         'cost': '89',
//                         'disc': 'Deep-fried cauliflower florets tossed in pungent spices to form a flavorsome dry curry',
//                         'image':'https://github.com/DivyashantKumar/assignment-first/blob/main/2image2x.png?raw=true'
//                     },
//                     {
//                         'name': 'Gobi Manchurian',
//                         'cost': '89',
//                         'disc': 'Deep-fried cauliflower florets tossed in pungent spices to form a flavorsome dry curry',
//                         'image':'https://github.com/DivyashantKumar/assignment-first/blob/main/2image2x.png?raw=true'
//                     },
//                     {
//                         'name': 'Gobi Manchurian',
//                         'cost': '89',
//                         'disc': 'Deep-fried cauliflower florets tossed in pungent spices to form a flavorsome dry curry',
//                         'image':'https://github.com/DivyashantKumar/assignment-first/blob/main/2image2x.png?raw=true'
//                     }
//                 ]
//             }
//         }
//     );

//     if (result.acknowledged && result.modifiedCount == 1) {
//         res.send({
//             'status': 200,
//             'message': 'Food item modified successfully'
//         });
//     } else {
//         res.send({
//             'status': 500,
//             'message': 'Modification operation failed'
//         });
//     }
// });



app.get('/filterFood', async (req, res) => {
    const foods = await db.collection('food').find({ 'cuisine': 'breakfast', 'cost': '200' }).toArray();

    res.send({
        'status': 200,
        'data': foods
    })
});

app.post('/addFood', async (req, res) => {
    const result = await db.collection('food').insertOne({ ...req.body })
    res.send({
        'status': 200,
        'message': 'Food item addded successfully',
        'data': result.insertedId
    })
});


app.use(userRoute)
app.use(restaurantRoute);

// app.post('/signup', async (req, res) => {
//     console.log(req.body);
//     // if username exists ....
//     bcrypt.genSalt(saltRounds, function (err, salt) {
//         bcrypt.hash(req.body.password, salt, async function (err, hash) {
//             if (err) {
//                 console.error("Error hashing password:", err);
//                 return res.status(500).send({
//                     'status': 500,
//                     'message': 'Internal server error',
//                 });
//             }

//             try {
//                 const result = await User.create({ ...req.body, 'password': hash });
//                 res.status(200).send({
//                     'status': 200,
//                     'message': 'User item added successfully',
//                     'data': result // Optionally, you can send back the created user data
//                 });
//             } catch (error) {
//                 console.error("Error inserting user:", error);
//                 return res.status(500).send({
//                     'status': 500,
//                     'message': 'Error inserting user',
//                 });
//             }
//         });
//     });
// });



// app.post('/login', async (req, res) => {
//     let result;
//     let user = await User.find({ 'username': req.body.username }).limit(1);
//     console.log(user)
//     user= Object.keys(user).map((key) => [key, user[key]]);

//     if (user) {
//         bcrypt.compare(req.body.password, user[0].password, function (err, result) {
//             if (result) {

//                 const tokenSignature = {
//                                     'userDetails':{
//                                         'firstName':user[0].username,
//                                         'lastName':user[0].username,
//                                         'userName':user[0].username,
//                                         'email':user[0].username,
//                                     },
//                                     'authorizationDetails':{
//                                             'routes': ['resturantList', 'addResturant','addFilters'] 
//                                     }
//                 }
//                 const token = jwt.sign(tokenSignature, 'secret');
//                 console.log(token)
//                 result = {
//                     'status': 200,
//                     'data': {
//                         'token': token
//                     },

//                 }
//                 res.send({ ...result })
//             } else {
//                 result = {
//                     'status': 401,
//                     'data': 'Passwword mismatch'
//                 }
//                 res.send({ ...result })
//             }
//         });

//     } else {
//         result = {
//             'status':401,
//             'data': 'No user found'
//         }
//         res.send({ ...result })
//     }
// });


app.post('/addFoods', async (req, res) => {
    let result = '';
    const schema = {
        'name': {
            prop: 'name',
            type: String
        },
        'cuisine': {
            prop: 'cuisine',
            type: Array
        },
        'cost': {
            prop: 'cost',
            type: Number
        },
        'index': {
            prop: 'index',
            type: Number
        },
        'description': {
            prop: 'index',
            type: Number
        },
        'overview': {
            prop: 'index',
            type: Number
        }
    }
    xlsxFile('./foods.xlsx', { schema }).then((rows) => {
        //const result = await db.collection('food').insertOne({...rows}])
        result = db.collection('food').insertMany([...rows.rows])
        //rows.e(element => {
        // console.log(element)
        //const result = db.collection('food').insertOne({...element})
        //console.table(result);
        // });
        //const result = db.collection('food').insertMany([...rows])
        //console.table(rows);
    })

    //const result1 = ''//await db.collection('food').insertMany([{...req.body},{...req.body},{...req.body}])
    res.send({
        'status': 200,
        'message': 'Food item addded successfully',
        'resultWeGot': result
    })
});

app.delete('/deleteFood', async (req, res) => {
    const mongoObjectToDelete = mongodb.ObjectId(req.body.deleteId);
    const foodCollection = db.collection('food');
    const result = await foodCollection.deleteOne({ _id: mongoObjectToDelete })
    if (result.acknowledged && result.deletedCount == 1) {
        res.send({
            'status': 200,
            'message': 'Food item deleted successfully'
        });
    } else {
        res.send({
            'status': 500,
            'message': 'DELETE OPERATION FAILED'
        });
    }
});

app.delete('/deleteAllFood', async (req, res) => {
    const foodCollection = db.collection('food');
    const result = await foodCollection.deleteMany({})
    if (result.acknowledged) {
        res.send({
            'status': 200,
            'message': 'All Food item deleted successfully',
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

app.put('/updateFood', async (req, res) => {

    const mongoObjectToUpdate = mongodb.ObjectId(req.body._id);
    console.error(req.body);
    // What to update with
    const foodCollection = db.collection('food');

    let updatedObject = {
        'name': req.body.name,
    }

    // If new value comes take it ... else please dont give the key itself such that i can keep the old values

    // add if item is [greater than 5 and less than 10]


    if (req.body.cuisine) {
        updatedObject = { ...updatedObject, 'cuisine': req.body.cuisine }
    }

    if (req.body.cost) {
        updatedObject = { ...updatedObject, 'cost': req.body.cost }
    }

    const result = await foodCollection.updateOne(
        { _id: mongoObjectToUpdate },
        {
            $set: updatedObject
        }
    );

    if (result.acknowledged && result.modifiedCount == 1) {
        res.send({
            'status': 200,
            'message': 'Food item modified successfully'
        });
    } else {
        res.send({
            'status': 500,
            'message': 'Modification operation failed'
        });
    }
});


app.listen(PORT, function (err) {
    if (err) console.error(err)
    console.log("Server is running in port", PORT)
});
