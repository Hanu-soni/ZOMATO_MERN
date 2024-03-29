const mongoose = require("mongoose");
const restaurentSchema=mongoose.Schema(
    {
        
            name: String,
            code: String,
            location_codes: Array,
            timing_codes:{type:Array,},
            cuisine:{type:Array,},
            foodInfo: [{
                name: {
                  type: String,
                  required: true
                },
                price: {
                  type: Number,
                  required: true
                },
                img: {
                    type: String,
                  required: true
                }}],
            cost:Number,
            overview:String,
            images:{type:Array,},
            address:String,

        
    }
)
exports.Restaurent = mongoose.model('resturant_details1',restaurentSchema);
