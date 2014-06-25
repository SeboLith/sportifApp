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
                    link : "#"
                },
                {
                    name : "Training Shoes",
                    link : "#"
                },
                {
                    name : "Kids Shoes",
                    link : "#"
                },
                {
                    name : "Football Boots",
                    link : "#"
                },
                {
                    name : "Casual Shoes",
                    link : "#"
                },
                {
                    name : "Clothing",
                    link : "#"
                },
                {
                    name : "Accessories",
                    link : "#"
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
                    link : "#"
                },
                {
                    name : "Store Locator",
                    link : "#"
                },
                {
                    name : "Returns Policy",
                    link : "#"
                },
                {
                    name : "Delivery Information",
                    link : "#"
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
                    link : "#"
                },
                {
                    name : "News",
                    link : "#"
                },
                {
                    name : "Partnerships",
                    link : "#"
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
                        link: "#",
                        src: "images/home-slider/exercise.jpg",
                        alt: "exercise"
                    },
                    {
                        link: "#",
                        src: "images/home-slider/running.jpg",
                        alt: "running"
                    },
                    {
                        link: "#",
                        src: "images/home-slider/soccer.jpg",
                        alt: "Soccer"
                    }
                ],

                quadrantTwoData : [
                    {
                        link: "#",
                        src: "images/soccer_collection.jpg",
                        alt: "football",
                        mainTitle: "Football",
                        subTitle: "voir la collection"
                    },
                    {
                        link: "#",
                        src: "images/mens_soccer.jpg",
                        alt: "homme",
                        mainTitle: "Homme",
                        subTitle: "voir la collection"
                    },
                    {
                        link: "#",
                        src: "images/womens_soccer.jpg",
                        alt: "femme",
                        mainTitle: "Femme",
                        subTitle: "voir la collection"
                    },
                    {
                        link: "#",
                        src: "images/kids_soccer.jpg",
                        alt: "enfant",
                        mainTitle: "Enfant",
                        subTitle: "voir la collection"
                    }
                ],

                quadrantThreeData : [
                    {
                        link: "#",
                        src: "images/golden-ball-graphic.png",
                        alt: "ballon d'or",
                        mainTitle: "Ballon D'or",
                        subTitle: "Best player awards",
                        body: "My SPORTIF is a free mobile app & online running service for runners. Create a fully customised training plan for marathon, half marathon, 10km and 5km distances, log your runs, and analyse your performance. Whether you’re looking to improve your run time or just starting to train for your first race, My SPORTIF helps runners to achieve their running goals. Download the app and create your training plan today!",
                        buttonText: "Get Started"
                    },
                    {
                        link: "#",
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
                            link: "#",
                            src: "images/Onitsuka_Tiger_Logo_220x260_Highlight_Content_Container.png",
                            alt: "VISIT THE SITE",
                            mainTitle: "Onitsuka Tiger",
                            subTitle: "Visit The Site"
                        },
                        {
                            link: "#",
                            src: "images/Content_Highlight_Banner_220x260_MY_SPORTIF-V2.png",
                            alt: "my sportif",
                            mainTitle: "My Sportif",
                            subTitle: "Visit The Site"
                        },
                        {
                            link: "#",
                            src: "images/Flag_Ship_Store_Foot_ID.png",
                            alt: "sportif foot id",
                            mainTitle: "Sportif Foot ID",
                            subTitle: "Visit The Site"
                        },
                        {
                            link: "#",
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
            key: "Men Main",
            values: {
                sidebarData : {
                    productSection: {
                        section: "Product",
                        values: [
                            {
                                product: "Shoes"
                            },
                            {
                                product: "Clothing"
                            },
                            {
                                product: "Accessories"
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
                    typeSection: {
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
                            },
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
                    sizeSection: {
                        section: "Size",
                        values: [ 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 15, 16, 17, 18, "small", "medium", "large", "x-large", "2x-large", "N/A" ]
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
                        link: "#",
                        iconClass: "fa fa-twitter",
                        title: "twitter",
                        spanTitle: "Twitter"
                    },
                    {
                        link: "#",
                        iconClass: "fa fa-facebook",
                        title: "facebook",
                        spanTitle: "Facebook"
                    },
                    {
                        link: "#",
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
                                        link: "men"
                                    },
                                    {
                                        subTitle: "Women",
                                        link: "#"
                                    },
                                    {
                                        subTitle: "Kids",
                                        link: "#"
                                    }
                                ]
                            },
                            {
                                mainTitle: "Shop by Brand",
                                subSection: [
                                    {
                                        subTitle: "Nike",
                                        link: "#"
                                    },
                                    {
                                        subTitle: "Adidas",
                                        link: "#"
                                    },
                                    {
                                        subTitle: "Puma",
                                        link: "#"
                                    },
                                    {
                                        subTitle: "Under Armor",
                                        link: "#"
                                    },
                                    {
                                        subTitle: "More",
                                        link: "#"
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
                                        link: "#"
                                    },
                                    {
                                        subTitle: "Clothing",
                                        link: "#"
                                    },
                                    {
                                        subTitle: "Accessories",
                                        link: "#"
                                    }
                                ]
                            },
                            {
                                mainTitle: "Shop by User",
                                subSection: [
                                    {
                                        subTitle: "Men",
                                        link: "#"
                                    },
                                    {
                                        subTitle: "Women",
                                        link: "#"
                                    },
                                    {
                                        subTitle: "Kids",
                                        link: "#"
                                    }
                                ]
                            },
                            {
                                mainTitle: "Footwear Categories",
                                subSection: [
                                    {
                                        subTitle: "road",
                                        link: "#"
                                    },
                                    {
                                        subTitle: "speed",
                                        link: "#"
                                    },
                                    {
                                        subTitle: "trail",
                                        link: "#"
                                    },
                                    {
                                        subTitle: "natural",
                                        link: "#"
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
                                link: "#",
                                src: "images/Navigation_140x90_Running.png"
                            },
                            {
                                title: "Training",
                                link: "#",
                                src: "images/140x90-nav-training-v2.png"
                            },
                            {
                                title: "Basketball",
                                link: "#",
                                src: "images/Navigation_140x90_Netball.png"
                            },
                            {
                                title: "Football",
                                link: "#",
                                src: "images/Navigation_140x90_Football.png"
                            }
                        ]
                    },
                    mySportifBar: {
                        tabTitle: "My Sportif",
                        content: [
                            {
                                title: "more about my sportif",
                                link: "#",
                                src: "images/nav_140x90_find_out_more.png"
                            },
                            {
                                title: "download from google play",
                                link: "#",
                                src: "images/nav_140x90_google_play.png"
                            },
                            {
                                title: "download from app store",
                                link: "#",
                                src: "images/nav_140x90_app_store.png"
                            },
                            {
                                title: "start your training plan",
                                link: "#",
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
