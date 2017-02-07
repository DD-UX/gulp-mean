// =================================================================
// Get all the packages ============================================
// =================================================================
var config = require('../../config');

var mongoose	 = require('mongoose');
var FormSchema	 = require('../models/form');

// Node Mailer dependency and mail transporter
var nodemailer	 	= require('nodemailer');
var transporter		= nodemailer.createTransport(config.mailTransporter);

// Lodash
var _ = require('lodash');


// =================================================================
// Database connection =============================================
// =================================================================
mongoose.connect(config.database);

// =================================================================
// Set Form Mail export ==============================================
// =================================================================

exports.setFormMail = function(req, res){
	// Request body
	var body = req.body;

	req.check('name', 'Name is required').notEmpty();

	req.check('email')
		.notEmpty().withMessage('Email is required')
		.isEmail().withMessage('Email is invalid');

	req.check('location', 'City and country are required').notEmpty();

	req.check('twitter_user', 'Twitter username is required').notEmpty();

	req.check('comment', 'Comment is required').notEmpty();

	req.getValidationResult()
		.then(function(result) {
		    if (!result.isEmpty()) {
				return res
					.status(400)
					.json({
			            status: "error",
			            errors: result.array()
			        });

		    } else {
				// New Form Schema
				var form = new FormSchema({
					'_id': mongoose.Types.ObjectId(),
				    'timestamp': new Date(),
				    'name': body.name,
				    'email': body.email,
				    'location': body.location,
				    'twitter_user': body.twitter_user,
				    'comment': body.comment
				});

				// Mail to Me
				var mailToMe = {
				    from: 		'"' + body.name + '" <' + body.email + '>',
				    to: 		'"Me" <' + config.mailFrom + '>',
				    subject: 	'Join form ✔',
				    html: 		'<h2>New form</h2>'
				    		+	'<p><a href="https://twitter.com/'+ body.twitter_user +'">'+ body.name +'</a> wants to get in contact</p>'
				    	  	+ 	'<blockquote style="border-left: solid 3px #3b67a7; margin-left: 0; padding-left: 10px;">'
				    	  	+	'<p>'+ body.comment + '</p>'
				    	  	+	'<p><cite>'+ body.name +' - <small>From '+ body.location +'</small></cite></p>'
				    	  	+	'</blockquote>'
				};

				// Mail to User from Me
				var mailToUser = {
				    from: 		'"Me" <' + config.mailFrom + '>',
				    to: 		'"' + body.name + '" <' + body.email + '>',
				    subject: 	'Thanks for getting in contact ✔',
				    html: 		'<h2>Email received:</h2>'
				    	  	+ 	'<blockquote style="border-left: solid 3px #3b67a7; margin-left: 0; padding-left: 10px;">'
				    	  	+	'<p>'+ body.comment + '</p>'
				    	  	+	'<p><cite>'+ body.name +' - <small>From '+ body.location +'</small></cite></p>'
				    	  	+	'</blockquote>'
				};


				// Save form in DB
				form.save(save);

			    // Send mail with the transporter data coming from config file
			    if(!_.isEmpty(config.mailFrom) || !_.isEmpty(config.mailTransporter)){
					transporter.sendMail(mailToMe, mailCallback);
					transporter.sendMail(mailToUser, mailCallback);

					function mailCallback(err, info){
						if (err){
							res
				        		.status(500)
					        	.json({
						            status: "error",
						            error: err
						        });
						} else {
							res
				        	.status(200)
				        	.json({
					            status: 'success',
					            message: [{
					            	msg: 'Message sent: ' + info.response
					            }]
					        });
							console.log();				
						}
					}
			    }

				function save (err){
			        if (err){
			        	res
			        		.status(500)
				        	.json({
					            status: "error",
					            error: err
					        });
			        } else {
				        res
				        	.status(200)
				        	.json({
					            status: 'success',
					            message: [{
					            	msg: '<b>Success!</b> You are one step closer to become a Master Jedi ===|===============>'
					            }]
					        });
			        }
			    }
			}
    });
};