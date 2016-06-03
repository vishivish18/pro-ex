var router = require('express').Router()
var Script = require('../../models/script')


//Save details for new data (CREATE)
router.post('/', function(req, res, next) {

    var script = new Script({

        url: req.body.url,
        class: req.body.class
        
    })
    
    script.save(function(err, data) {
        if (err) {
            return res.status(500).send(err);
        }
        // res.send(201)
        res.json(data);

    })
})

/*router.get('/', function(req, res, next) {

    Script.find({
        username: req.auth.username
    }, function(err, data) {
        if (err) {
            return next(err)
        } else {            
            res.json(data)
        }

    })


})
*/

module.exports = router
