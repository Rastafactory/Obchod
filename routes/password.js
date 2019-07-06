var express = require('express');
var router = express.Router();
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');

var User = require('../models/user');

router.post('/forgot', function (req, res, next) {
    async.waterfall([
      function (done) {
        crypto.randomBytes(20, function (err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function (token, done) {
        User.getUserByEmail(req.body.email, function (err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/password/forgot');
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          User.saveUpdatedUser(user, function (user, err) {
            done(err, token, user);
          })
        });
      },
      function (token, user, done) {
  
        var smtpTransport = nodemailer.createTransport({
          host: 'smtp.googlemail.com', // Gmail Host
          port: 465, // Port
          secure: true, // this is true as port is 465
          auth: {
            user: 'sportify.application@gmail.com', //Gmail username
            pass: 'Sportify123' // Gmail password
          },
          tls: {
            rejectUnauthorized: false
          }
        });
  
        var mailOptions = {
          to: user.email,
          from: 'sportify.application@gmail.com',
          subject: 'Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function (err) {
          req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
        });
      }
    ], function (err) {
      console.log(err)
      if (err) return next(err);
      res.redirect('/password/forgot');
    });
  });

  router.get('/forgot', function (req, res, next) {
    res.render('forgot', {});
  });

  router.get('/reset/:token', function (req, res) {
    User.findUserByToken(req.params.token, Date.now(), function (err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/password/forgot');
      }
      console.log(user)
      res.render('reset', {
        user: user
      });
    });
  });
  
  router.post('/reset/:token', function (req, res) {
    async.waterfall([
      function (done) {
        User.findUserByToken(req.params.token, Date.now(), function (err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
          // Form Validator
          req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
  
          //Check Errors
          var errors = req.validationErrors();
  
          if (errors) {
            console.log(errors);
            res.render('reset', {
              errors: errors,
              user: user
            });
          } else {
            user.password = req.body.password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
  
            User.saveUpdatedUserPassword(user, function (user, err) {
              done(err, user);
            })
          }
        });
      },
      function (user, done) {
  
        var smtpTransport = nodemailer.createTransport({
          host: 'smtp.googlemail.com', // Gmail Host
          port: 465, // Port
          secure: true, // this is true as port is 465
          auth: {
            user: 'sportify.application@gmail.com', //Gmail username
            pass: 'Sportify123' // Gmail password
          },
          tls: {
            rejectUnauthorized: false
          }
        });
  
        var mailOptions = {
          to: user.email,
          from: 'sportify.application@gmail.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function (err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function (err) {
      res.redirect('/');
    });
  });