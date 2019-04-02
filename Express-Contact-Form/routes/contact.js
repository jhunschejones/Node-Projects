var express = require('express');
var router = express.Router();

// GET CONTACT PAGE
router.get('/', function(req, res, next) {
  res.render('contact', { title: 'Contact Us' });
});

// GET THANKS PAGE
router.get('/thanks', function(req, res, next) {
  res.render('thanks', { title: 'Thank You' });
});

// POST TO CONTACT PAGE :: VALIDATION
router.post('/', function(req, res, next) {
  const { email, message, name } = req.body;
  const errors = {
    count: 0,
    list: [],
  }

  if (!email || email === '') {
    errors.count += 1;
    errors.list.push('Email missing.');
  }
  if (!message || message === '') {
    errors.count += 1;
    errors.list.push('Message missing.');
  }
  if (!name || name === '') {
    errors.count += 1;
    errors.list.push('Name missing.');
  }
  const re = /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!re.test(String(email).toLowerCase())) {
    errors.count += 1;
    errors.list.push('Malformed missing.');
  }
  if (errors.count > 0) {
    return res.json(errors);
  }

  next();
});

// POST TO CONTACT PAGE :: PASS DATA
router.post('/', function(req, res, next) {
  // making sure request body is coming through with expected data
  console.log(req.body);
  res.redirect('/contact/thanks');
})

module.exports = router;