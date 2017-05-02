var mongoose = require('mongoose');

var AdminSchema = new mongoose.Schema({
    user: String,
    password: String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

AdminSchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    }else{
        this.meta.updateAt = Date.now()
    }
    
    next();
});

AdminSchema.statics = {
    findByUser: function(username, cb){
        return this
            .findOne({user: username})
            .exec(cb)
    }
};

module.exports = AdminSchema;