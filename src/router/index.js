/*
import Vue from 'vue'
import Router from 'vue-router'
import purchase from '@/components/purchase'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'purchase',
      component: purchase
    }
  ]
})
*/
var express = require('express');
var router = express.Router();
var path = require('path');

const querystring = require('querystring');

/* GET home page. */
router.get('/', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    console.log('hello');
    res.sendFile(path.resolve('../creative4/public/index.html'));
});


module.exports = router;

