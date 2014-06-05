'use strict';

var mongoose = require('mongoose'),
  ViewData = mongoose.model('ViewData');

/**
 * Populate database with sample application data
 */

// Clear old item names, then add a default names
ViewData.find({}).remove(function() {
  ViewData.create(
    {
        "data" : {
            key: 'company',
            value: 'G&G SPORTIF'
        }
    },
    {
        "data" : {
            key: 'validEmailErrorMessage',
            value: 'A valid email is required'
        }
    },
    {
        "data" : {
            key: 'newsLetterSignupMessage',
            value: 'Signup for our newsletter and receive special offers and exclusive news about our products'
        }
    },
    {
        "data" : {
            key: 'popularProducts',
            value: [
                {
                    name : 'Running Shoes',
                    link : 'http://www.ggsportif.com/running/cat/runningshoes'
                },
                {
                    name : 'Training Shoes',
                    link : 'http://www.ggsportif.com/training/cat/trainingshoes'
                },
                {
                    name : 'Kids Shoes',
                    link : 'http://www.ggsportif.com/shoes/cat/genderkidsshoes'
                },
                {
                    name : 'Football Boots',
                    link : 'http://www.ggsportif.com/football/cat/footballshoes'
                },
                {
                    name : 'Netball Shoes',
                    link : 'http://www.ggsportif.com/netball/cat/netballshoes'
                },
                {
                    name : 'Health & Leisure Shoes',
                    link : 'http://www.ggsportif.com/health-%26-leisure/cat/healthleisureshoes'
                },
                {
                    name : 'Tennis Shoes',
                    link : 'http://www.ggsportif.com/tennis/cat/tennisshoes'
                },
                {
                    name : 'Clothing',
                    link : 'http://www.ggsportif.com/clothing/cat/clothing'
                },
                {
                    name : 'Accessories',
                    link : 'http://www.ggsportif.com/accessories/cat/accessories'
                }
            ]
        }
    },
    {
        "data" : {
            key: 'customerServices',
            value: [
                {
                    name : 'Contact SPORTIF',
                    link : 'http://www.ggsportif.com/contact-sportif'
                },
                {
                    name : 'Store Locator',
                    link : 'http://www.ggsportif.com/store-finder'
                },
                {
                    name : 'Returns Policy',
                    link : 'http://www.ggsportif.com/returns'
                },
                {
                    name : 'Delivery Information',
                    link : 'http://www.ggsportif.com/delivery-info'
                },
                {
                    name : 'Shoe Size Guide',
                    link : 'http://www.ggsportif.com/shoe-size-guide'
                },
                {
                    name : 'Shoe Width Guide',
                    link : 'http://www.ggsportif.com/shoe-width-guide'
                },
                {
                    name : 'Clothing Size Guide',
                    link : 'http://www.ggsportif.com/clothing-size-guide'
                }
            ]
        }
    },
    {
        "data" : {
            key: 'corporateInfo',
            value: [
                {
                    name : 'About G&G SPORTIF',
                    link : 'http://www.ggsportif.com/about-sportif'
                },
                {
                    name : 'News',
                    link : 'http://www.ggsportif.com/news'
                },
                {
                    name : 'Partnerships',
                    link : 'http://www.ggsportif.com/partnerships'
                },
                {
                    name : 'Corporate Responsibility',
                    link : 'http://www.ggsportif.com/en/csr'
                },
                {
                    name : 'Careers',
                    link : 'http://www.ggsportif.com/careers-why-join'
                },
                {
                    name : 'Privacy Policy',
                    link : 'http://www.ggsportif.com/terms-of-sale'
                },
                {
                    name : 'Terms of Use',
                    link : 'http://www.ggsportif.com/terms-of-use'
                }
            ]
        }
    },
    function() {
      console.log('finished populating viewData');
    }
  );
});