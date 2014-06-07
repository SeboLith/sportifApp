"use strict";

var mongoose = require("mongoose"),
  ViewData = mongoose.model("ViewData");

/**
 * Populate database with sample application data
 */

// Clear old item names, then add a default names
ViewData.find({}).remove(function() {
  ViewData.create(
    {
        data : {
            key: "Popular Products",
            values: [
                {
                    name : "Running Shoes",
                    link : "http://www.ggsportif.com/running/cat/runningshoes"
                },
                {
                    name : "Training Shoes",
                    link : "http://www.ggsportif.com/training/cat/trainingshoes"
                },
                {
                    name : "Kids Shoes",
                    link : "http://www.ggsportif.com/shoes/cat/genderkidsshoes"
                },
                {
                    name : "Football Boots",
                    link : "http://www.ggsportif.com/football/cat/footballshoes"
                },
                {
                    name : "Netball Shoes",
                    link : "http://www.ggsportif.com/netball/cat/netballshoes"
                },
                {
                    name : "Health & Leisure Shoes",
                    link : "http://www.ggsportif.com/health-%26-leisure/cat/healthleisureshoes"
                },
                {
                    name : "Tennis Shoes",
                    link : "http://www.ggsportif.com/tennis/cat/tennisshoes"
                },
                {
                    name : "Clothing",
                    link : "http://www.ggsportif.com/clothing/cat/clothing"
                },
                {
                    name : "Accessories",
                    link : "http://www.ggsportif.com/accessories/cat/accessories"
                }
            ]
        }
    },
    {
        data : {
            key: "Customer Services",
            values: [
                {
                    name : "Contact SPORTIF",
                    link : "http://www.ggsportif.com/contact-sportif"
                },
                {
                    name : "Store Locator",
                    link : "http://www.ggsportif.com/store-finder"
                },
                {
                    name : "Returns Policy",
                    link : "http://www.ggsportif.com/returns"
                },
                {
                    name : "Delivery Information",
                    link : "http://www.ggsportif.com/delivery-info"
                },
                {
                    name : "Shoe Size Guide",
                    link : "http://www.ggsportif.com/shoe-size-guide"
                },
                {
                    name : "Shoe Width Guide",
                    link : "http://www.ggsportif.com/shoe-width-guide"
                },
                {
                    name : "Clothing Size Guide",
                    link : "http://www.ggsportif.com/clothing-size-guide"
                }
            ]
        }
    },
    {
        data : {
            key: "Corporate Info",
            values: [
                {
                    name : "About G&G SPORTIF",
                    link : "http://www.ggsportif.com/about-sportif"
                },
                {
                    name : "News",
                    link : "http://www.ggsportif.com/news"
                },
                {
                    name : "Partnerships",
                    link : "http://www.ggsportif.com/partnerships"
                },
                {
                    name : "Corporate Responsibility",
                    link : "http://www.ggsportif.com/en/csr"
                },
                {
                    name : "Careers",
                    link : "http://www.ggsportif.com/careers-why-join"
                },
                {
                    name : "Privacy Policy",
                    link : "http://www.ggsportif.com/terms-of-sale"
                },
                {
                    name : "Terms of Use",
                    link : "http://www.ggsportif.com/terms-of-use"
                }
            ]
        }
    },
    {
        data : {
            key: "Miscellaneous View Text",
            values: [
                {
                    data : {
                        key: "Company",
                        value: "G&G SPORTIF"
                    }
                },
                {
                    data : {
                        key: "Valid Email Error Message",
                        value: "A valid email is required"
                    }
                },
                {
                    data : {
                        key: "Newsletter Signup Message",
                        value: "Signup for our newsletter and receive special offers and exclusive news about our products"
                    }
                },
                {
                    data : {
                        key: "Signup Button Text",
                        value: "Sign Up"
                    }
                },
                {
                    data : {
                        key: "Signup Title",
                        value: "Email newsletter"
                    }
                }
            ]
        }
    },
    {
        data : {
            key: "Home Main",
            values: [
                {
                    quadrantOneData : [
                        {
                            link: "http://www.ggsportif.com/wallabies/cat/wallabieslicensedreplica",
                            src: "images/hero-wallabies-partnership.jpg",
                            alt: "wallabies"
                        },
                        {
                            link: "http://www.ggsportif.com/gel-nimbus-16/cat/gelnimbus16",
                            src: "images/hero-gel-nimbus-16-womens.jpg",
                            alt: "gel-nimbus 16"
                        },
                        {
                            link: "http://www.ggsportif.com/running/cat/sportrunning",
                            src: "images/Hero_Banner_940x395_Night_Before.png",
                            alt: "Running"
                        }
                    ],

                    quadrantTwoData : [
                        {
                            link: "http://www.ggsportif.com/hockey",
                            src: "images/content_highlight_container_hockey.jpg",
                            alt: "hockey",
                            mainTitle: "Hockey Collection",
                            subTitle: "shop now"
                        },
                        {
                            link: "http://www.ggsportif.com/cat/mensgender",
                            src: "images/Mens-1.png",
                            alt: "mens products",
                            mainTitle: "Men's Products",
                            subTitle: "shop now"
                        },
                        {
                            link: "http://www.ggsportif.com/cat/womensgender",
                            src: "images/Womens-2.png",
                            alt: "womens products",
                            mainTitle: "Women's Products",
                            subTitle: "shop now"
                        },
                        {
                            link: "http://www.youtube.com/embed/HEt_DLSuceE?rel=0&amp;autoplay=1",
                            src: "images/220x260-wallabies-tvc.jpg",
                            alt: "kids products",
                            mainTitle: "Kids' Products",
                            subTitle: "shop now"
                        }
                    ],

                    quadrantThreeData : [
                        {
                            link: "http://my.sportif.com/",
                            src: "images/6_column_content_banner_MY_SPORTIF.png",
                            alt: "Get Started",
                            mainTitle: "MY SPORTIF",
                            subTitle: "ACHIEVE YOUR RUNNING GOALS",
                            body: "My SPORTIF is a free mobile app & online running service for runners. Create a fully customised training plan for marathon, half marathon, 10km and 5km distances, log your runs, and analyse your performance. Whether you’re looking to improve your run time or just starting to train for your first race, My SPORTIF helps runners to achieve their running goals. Download the app and create your training plan today!",
                            buttonText: "Get Started"
                        },
                        {
                            link: "http://www.ggsportif.com/made-of-sport",
                            src: "images/6_column_content_banner_MOS.png",
                            alt: "Shop Catalogue",
                            mainTitle: "Made of Sport Magazine",
                            subTitle: "get the latest look this season",
                            body: "In the latest issue of the SPORTIF Made Of Sport Magazine we introduce our new AW 2014 Sportswear collection - another season of running, walking, exercising or doing whatever it is you do to stay inspired in mind and body. Shop head-to-toe imagery from our clothing range, and check out out the seasonal highlights from our running shoes, cross-training shoes or football boot collection and more.",
                            buttonText: "Shop Catalogue"
                        }
                    ],

                    quadrantFourData : {
                        header: "The world of SPORTIF",
                        values: [
                            {
                                link: "http://www.onitsukatiger.com/en-au",
                                src: "images/Onitsuka_Tiger_Logo_220x260_Highlight_Content_Container.png",
                                alt: "VISIT THE SITE",
                                mainTitle: "Onitsuka Tiger",
                                subTitle: "Visit The Site"
                            },
                            {
                                link: "http://www.youtube.com/embed/PVOmtaBaAZ4?rel=0&amp;autoplay=1",
                                src: "images/Content_Highlight_Banner_220x260_MY_SPORTIF-V2.png",
                                alt: "my sportif",
                                mainTitle: "My Sportif",
                                subTitle: "Visit The Site"
                            },
                            {
                                link: "http://www.youtube.com/embed/hQX6nULAi-o?rel=0&amp;autoplay=1",
                                src: "images/Flag_Ship_Store_Foot_ID.png",
                                alt: "sportif foot id",
                                mainTitle: "Sportif Foot ID",
                                subTitle: "Visit The Site"
                            },
                            {
                                link: "http://www.youtube.com/embed/n34fe7xhlQ0?rel=0&amp;autoplay=1",
                                src: "images/220x260-mms-tvc.dms",
                                alt: "run",
                                mainTitle: "Sportif Foot ID",
                                subTitle: "Visit The Site"
                            }
                        ]
                    }
                }
            ]
        }
    },
    function() {
      console.log("finished populating viewData");
    }
  );
});
