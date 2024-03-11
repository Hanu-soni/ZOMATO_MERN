const mongoose = require("mongoose");
const restaurentSchema=mongoose.Schema(
    {
        
            name: String,
            code: String,
            location_codes: Array,
            timing_codes:{type:Array,},
            cuisine:{type:Array,},
            cost:Number,
            overview:String,
            images:{type:Array,},
            address:String,

        
    }
)
exports.Restaurent = mongoose.model('resturant_details1',restaurentSchema);
