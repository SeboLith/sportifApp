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
                    link : "http://www.ggsportif.com/shoes/running"
                },
                {
                    name : "Training Shoes",
                    link : "http://www.ggsportif.com/shoes/training"
                },
                {
                    name : "Kids Shoes",
                    link : "http://www.ggsportif.com/shoes/kids"
                },
                {
                    name : "Football Boots",
                    link : "http://www.ggsportif.com/shoes/football"
                },
                {
                    name : "Casual Shoes",
                    link : "http://www.ggsportif.com/shoes/tennis"
                },
                {
                    name : "Clothing",
                    link : "http://www.ggsportif.com/clothing"
                },
                {
                    name : "Accessories",
                    link : "http://www.ggsportif.com/accessories"
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
                }
            ]
        }
    },
    {
        data : {
            key: "Miscellaneous View Text",
            values: {
                company : {
                    key: "Company",
                    value: "G&G SPORTIF"
                },
                emailErrorMessage : {
                    key: "Valid Email Error Message",
                    value: "A valid email is required"
                },
                newsletterSignupMessage : {
                    key: "Newsletter Signup Message",
                    value: "Inscrivez-vous à la newsletter pour recevoir nos produits"
                },
                signupButtonText : {
                    key: "Signup Button Text",
                    value: "Sign Up"
                },
                signupTite : {
                    key: "Signup Title",
                    value: "Email newsletter"
                }
            }
        }
    },
    {
        data : {
            key: "Home Main",
            values: {
                quadrantOneData : [
                    {
                        link: "http://www.ggsportif.com/exercise",
                        src: "images/home-slider/exercise.jpg",
                        alt: "exercise"
                    },
                    {
                        link: "http://www.ggsportif.com/running/",
                        src: "images/home-slider/running.jpg",
                        alt: "running"
                    },
                    {
                        link: "http://www.ggsportif.com/soccer",
                        src: "images/home-slider/soccer.jpg",
                        alt: "Soccer"
                    }
                ],

                quadrantTwoData : [
                    {
                        link: "http://www.ggsportif.com/soccer",
                        src: "images/soccer_collection.jpg",
                        alt: "football",
                        mainTitle: "Football",
                        subTitle: "voir la collection"
                    },
                    {
                        link: "http://www.ggsportif.com/cat/mens",
                        src: "images/mens_soccer.jpg",
                        alt: "homme",
                        mainTitle: "Homme",
                        subTitle: "voir la collection"
                    },
                    {
                        link: "http://www.ggsportif.com/cat/womens",
                        src: "images/womens_soccer.jpg",
                        alt: "femme",
                        mainTitle: "Femme",
                        subTitle: "voir la collection"
                    },
                    {
                        link: "http://www.ggsportif.com/cat/kids",
                        src: "images/kids_soccer.jpg",
                        alt: "enfant",
                        mainTitle: "Enfant",
                        subTitle: "voir la collection"
                    }
                ],

                quadrantThreeData : [
                    {
                        link: "http://www.ggsportif.com/goldenball",
                        src: "images/golden-ball-graphic.png",
                        alt: "ballon d'or",
                        mainTitle: "Ballon D'or",
                        subTitle: "Best player awards",
                        body: "My SPORTIF is a free mobile app & online running service for runners. Create a fully customised training plan for marathon, half marathon, 10km and 5km distances, log your runs, and analyse your performance. Whether you’re looking to improve your run time or just starting to train for your first race, My SPORTIF helps runners to achieve their running goals. Download the app and create your training plan today!",
                        buttonText: "Get Started"
                    },
                    {
                        link: "http://www.ggsportif.com/promotions",
                        src: "images/promotions-graphic.png",
                        alt: "promotions",
                        mainTitle: "Promotions",
                        subTitle: "save on the hottest products",
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
        }
    },
    {
        data : {
            key: "Shoes Main",
            values: {
                sidebarData : {
                    sportSection: {
                        section: "Sport",
                        values: [
                            {
                                sport: "Running"
                            },
                            {
                                sport: "Training"
                            },
                            {
                                sport: "Basketball"
                            },
                            {
                                sport: "Football"
                            },
                            {
                                sport: "Martial Arts"
                            }
                        ]
                    },
                    userSection: {
                        section: "User",
                        values: [
                            {
                                user: "Male"
                            },
                            {
                                user: "Female"
                            },
                            {
                                user: "Kids"
                            }
                        ]
                    },
                    sizeSection: {
                        section: "Size",
                        values: [ 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 15, 16, 17, 18 ]
                    }
                }
            }
        }
    },
    {
        data : {
            key: "Clothing Main",
            values: {
                sidebarData : {
                    typesSection: {
                        section: "Type",
                        values: [
                            {
                                type: "Jersey Shirts"
                            },
                            {
                                type: "Jersey Shorts"
                            },
                            {
                                type: "Tights"
                            },
                            {
                                type: "Tees"
                            },
                            {
                                type: "Tank Tops"
                            }
                        ]
                    },
                    sportSection: {
                        section: "Sport",
                        values: [
                            {
                                sport: "Running"
                            },
                            {
                                sport: "Training"
                            },
                            {
                                sport: "Basketball"
                            },
                            {
                                sport: "Football"
                            },
                            {
                                sport: "Martial Arts"
                            }
                        ]
                    },
                    userSection: {
                        section: "User",
                        values: [
                            {
                                user: "Male"
                            },
                            {
                                user: "Female"
                            },
                            {
                                user: "Kids"
                            }
                        ]
                    },
                    sizeSection: {
                        section: "Size",
                        values: [ "small", "medium", "large", "x-large", "2x-large" ]
                    }
                }
            }
        }
    },
    {
        data : {
            key: "Accessories Main",
            values: {
                sidebarData : {
                    typesSection: {
                        section: "Type",
                        values: [
                            {
                                type: "Headbands"
                            },
                            {
                                type: "Socks"
                            },
                            {
                                type: "Towels"
                            },
                            {
                                type: "Belts"
                            },
                            {
                                type: "Bags"
                            },
                            {
                                type: "Hats"
                            },
                            {
                                type: "Bottles"
                            },
                            {
                                type: "Glasses"
                            },
                            {
                                type: "Lamps"
                            }
                        ]
                    },
                    sportSection: {
                        section: "Sport",
                        values: [
                            {
                                sport: "Running"
                            },
                            {
                                sport: "Training"
                            },
                            {
                                sport: "Basketball"
                            },
                            {
                                sport: "Football"
                            },
                            {
                                sport: "Martial Arts"
                            },
                            {
                                sport: "Any Sport"
                            }
                        ]
                    },
                    userSection: {
                        section: "User",
                        values: [
                            {
                                user: "Male"
                            },
                            {
                                user: "Female"
                            },
                            {
                                user: "Kids"
                            },
                            {
                                user: "Any User"
                            }
                        ]
                    },
                    sizeSection: {
                        section: "Size",
                        values: [ "small", "medium", "large", "x-large", "2x-large", "N/A" ]
                    }
                }
            }
        }
    },
    {
        data : {
            key: "Header",
            values: {
                topNav : [
                    {
                        link: "#",
                        iconClass: "fa fa-institution",
                        title: "nos magazins",
                        spanTitle: "Our Stores"
                    },
                    {
                        link: "https://twitter.com/ggsportif",
                        iconClass: "fa fa-twitter",
                        title: "twitter",
                        spanTitle: "Twitter"
                    },
                    {
                        link: "https://facebook.com/ggsportif",
                        iconClass: "fa fa-facebook",
                        title: "facebook",
                        spanTitle: "Facebook"
                    },
                    {
                        link: "https://youtube.com/ggsportif",
                        iconClass: "fa fa-youtube",
                        title: "youtube",
                        spanTitle: "YouTube"
                    }
                ],
                mainNav : {
                    shopBar: {
                        tabTitle: "Shop",
                        content: [
                            {
                                mainTitle: "Shop by Category",
                                subSection: [
                                    {
                                        subTitle: "Shoes",
                                        link: "shoes"
                                    },
                                    {
                                        subTitle: "Clothing",
                                        link: "clothing"
                                    },
                                    {
                                        subTitle: "Accessories",
                                        link: "accessories"
                                    }
                                ]
                            },
                            {
                                mainTitle: "Shop by User",
                                subSection: [
                                    {
                                        subTitle: "Men",
                                        link: "http://www.ggsportif.com/mens"
                                    },
                                    {
                                        subTitle: "Women",
                                        link: "http://www.ggsportif.com/womens"
                                    },
                                    {
                                        subTitle: "Kids",
                                        link: "http://www.ggsportif.com/kids"
                                    }
                                ]
                            },
                            {
                                mainTitle: "Shop by Brand",
                                subSection: [
                                    {
                                        subTitle: "Nike",
                                        link: "http://www.ggsportif.com/running"
                                    },
                                    {
                                        subTitle: "Adidas",
                                        link: "http://www.ggsportif.com/football"
                                    },
                                    {
                                        subTitle: "Puma",
                                        link: "http://www.ggsportif.com/training"
                                    },
                                    {
                                        subTitle: "Under Armor",
                                        link: "http://www.ggsportif.com/martial-arts"
                                    },
                                    {
                                        subTitle: "More",
                                        link: "http://www.ggsportif.com/indoor"
                                    }
                                ]
                            }
                        ]
                    },
                    runningBar: {
                        tabTitle: "Training",
                        content: [
                            {
                                mainTitle: "Training",
                                subSection: [
                                    {
                                        subTitle: "Shoes",
                                        link: "http://www.ggsportif.com/running/shoes"
                                    },
                                    {
                                        subTitle: "Clothing",
                                        link: "http://www.ggsportif.com/running/clothing"
                                    },
                                    {
                                        subTitle: "Accessories",
                                        link: "http://www.ggsportif.com/running/accessories"
                                    }
                                ]
                            },
                            {
                                mainTitle: "Shop by User",
                                subSection: [
                                    {
                                        subTitle: "Men",
                                        link: "http://www.ggsportif.com/running/mens"
                                    },
                                    {
                                        subTitle: "Women",
                                        link: "http://www.ggsportif.com/running/womens"
                                    },
                                    {
                                        subTitle: "Kids",
                                        link: "http://www.ggsportif.com/running/kids"
                                    }
                                ]
                            },
                            {
                                mainTitle: "Footwear Categories",
                                subSection: [
                                    {
                                        subTitle: "road",
                                        link: "http://www.ggsportif.com/running/road"
                                    },
                                    {
                                        subTitle: "speed",
                                        link: "http://www.ggsportif.com/running/speed"
                                    },
                                    {
                                        subTitle: "trail",
                                        link: "http://www.ggsportif.com/running/trail"
                                    },
                                    {
                                        subTitle: "natural",
                                        link: "http://www.ggsportif.com/running/natural"
                                    }
                                ]
                            }
                        ]
                    },
                    featuredSportsBar: {
                        tabTitle: "Featured Sports",
                        content: [
                            {
                                title: "Running",
                                link: "http://www.ggsportif.com/running",
                                src: "images/Navigation_140x90_Running.png"
                            },
                            {
                                title: "Training",
                                link: "http://www.ggsportif.com/trainning",
                                src: "images/140x90-nav-training-v2.png"
                            },
                            {
                                title: "Basketball",
                                link: "http://www.ggsportif.com/basketball",
                                src: "images/Navigation_140x90_Netball.png"
                            },
                            {
                                title: "Football",
                                link: "http://www.ggsportif.com/football",
                                src: "images/Navigation_140x90_Football.png"
                            }
                        ]
                    },
                    mySportifBar: {
                        tabTitle: "My Sportif",
                        content: [
                            {
                                title: "more about my sportif",
                                link: "http://www.ggsportif.com/about-mysportif",
                                src: "images/nav_140x90_find_out_more.png"
                            },
                            {
                                title: "download from google play",
                                link: "https://play.google.com/store/apps/details?id=com.sportif.mysportif&amp;hl=en",
                                src: "images/nav_140x90_google_play.png"
                            },
                            {
                                title: "download from app store",
                                link: "https://itunes.apple.com/us/app/my-sportif/id466664337?mt=8",
                                src: "images/nav_140x90_app_store.png"
                            },
                            {
                                title: "start your training plan",
                                link: "http://my.sportif.com/",
                                src: "images/nav_140x90_get_started.png"
                            }
                        ]
                    }
                }
            }
        }
    },
    function() {
      console.log("finished populating viewData");
    }
  );
});
