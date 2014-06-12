"use strict";angular.module("controllers").controller("MainCtrl",["$scope","ProductsFactory","ViewData",function(a,b,c){a.shoesProducts=[],a.clothingProducts=[],a.accessoriesProducts=[],a.fanGearProducts=[],a.mensProducts=[],a.womensProducts=[],a.kidsProducts=[],a.soccerProducts=[],a.basketballProducts=[],a.runningProducts=[],a.martialArtsProducts=[];b.getAll.then(function(b){b.forEach(function(b){switch(b.category){case"Shoes":a.shoesProducts.push(b);break;case"Clothing":a.clothingProducts.push(b);break;case"Accessories":a.accessoriesProducts.push(b);break;case"Fan Gear":a.fanGearProducts.push(b)}switch(b.user){case"men":a.mensProducts.push(b);break;case"women":a.womensProducts.push(b);break;case"children":a.kidsProducts.push(b)}switch(b.activity){case"Basketball":a.basketballProducts.push(b);break;case"Scoocer":a.soccerProducts.push(b);break;case"Running":a.runningProducts.push(b);case"Martial Arts":a.martialArtsProducts.push(b)}})}),c.miscViewData.then(function(b){var c=b.data.values;a.company=c.company.value,a.validEmailErrorMessage=c.emailErrorMessage.value,a.newsLetterSignupMessage=c.newsletterSignupMessage.value,a.signUpButton=c.signupButtonText.value,a.signUpTitle=c.signupTite.value}),c.corporateInfo.then(function(b){var c=b.data;a.corporateInfo=c}),c.customerServices.then(function(b){var c=b.data;a.customerServices=c}),c.popularProducts.then(function(b){var c=b.data;a.popularProducts=c})}]).controller("HeaderCtrl",["$scope","ViewData",function(a,b){a.search={};b.headerData.then(function(b){a.topNav=b.data.values.topNav,a.shopBar=b.data.values.mainNav.shopBar,a.runningBar=b.data.values.mainNav.runningBar,a.featuredSportsBar=b.data.values.mainNav.featuredSportsBar,a.mySportifBar=b.data.values.mainNav.mySportifBar});a.ShopBarComponent=!1,a.RunningBarComponent=!1,a.FeaturedSportsBarComponent=!1,a.MySportifBarComponent=!1,a.componentShow=function(b){switch(b){case"ShopBar":a.ShopBarComponent=!a.ShopBarComponent,a.RunningBarComponent=!1,a.FeaturedSportsBarComponent=!1,a.MySportifBarComponent=!1,console.log("ShopBar lead clicked");break;case"RunningBar":a.RunningBarComponent=!a.RunningBarComponent,a.ShopBarComponent=!1,a.FeaturedSportsBarComponent=!1,a.MySportifBarComponent=!1,console.log("RunningBar lead clicked");break;case"FeaturedSportsBar":a.FeaturedSportsBarComponent=!a.FeaturedSportsBarComponent,a.ShopBarComponent=!1,a.RunningBarComponent=!1,a.MySportifBarComponent=!1,console.log("FeaturedSportsBar lead clicked");break;case"MySportifBar":a.MySportifBarComponent=!a.MySportifBarComponent,a.ShopBarComponent=!1,a.RunningBarComponent=!1,a.FeaturedSportsBarComponent=!1,console.log("MySportifBar lead clicked")}},a.headerSearch=function(b){console.log(b.text.$modelValue),a.search.query=""}}]).controller("FooterCtrl",["$scope","ViewData",function(a,b){var c=new Date;a.year=c.getFullYear(),a.newsletter={},a.emailRegexValidation=/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,a.newsletterSignup=function(c){c.$valid&&(console.log(c.email.$modelValue),b.newsletterSignup(c.email.$modelValue),a.newsletter.email="")}}]).controller("HomeCtrl",["$scope","ViewData",function(a,b){b.homeMainData.then(function(b){var c=b.data.values;a.quadrantOneData=c.quadrantOneData,a.quadrantTwoData=c.quadrantTwoData,a.quadrantThreeData=c.quadrantThreeData,a.quadrantFourData=c.quadrantFourData})}]).controller("ShoesCtrl",["$scope","ViewData","ProductsFactory",function(a,b,c){a.shoesProducts=[],a.itemsPerPage=localStorage.getItem("itemsPerPage")?localStorage.getItem("itemsPerPage"):6;c.getAll.then(function(c){c.forEach(function(b){switch(b.category){case"Shoes":a.shoesProducts.push(b)}}),a.totalItems=a.shoesProducts.length,a.currentPage=localStorage.getItem("currentPage")?localStorage.getItem("currentPage"):1,a.$watch("currentPage",function(){localStorage.setItem("currentPage",a.currentPage);var c=[a.currentPage,a.itemsPerPage,a.shoesProducts];a.page=b.page(c)})})}]).controller("ProductListCtrl",["$scope","$rootScope","$localStorage","ProductListService","QuickBuyService",function(a,b,c,d,e){function f(){i=!0,a.$storage.sort={by:j,limit:k},a.products=[]}function g(b,c){c.products.length&&(a.products=c.products,a.moreResults=c.attributes.showMoreResultsButton,a.resultCount=c.resultCount)}function h(b,c){b===c||i||a.productListService.getProducts(a.$storage.filters,a.$storage.sort),i=!1}var i=!1,j="featured",k=0;a.$storage=c.$default({sort:{by:j,limit:k}}),a.quickBuyData=e.model,a.productListService=d,a.$on("productList.loaded",g),a.$on("productListData.reset",f),a.$watch("$storage.sort",h,!0),a.showMore=function(){a.$storage.sort.limit=a.resultCount},a.quickBuyBroadcast=function(){a.$parent.$broadcast("quick_buy")},a.getUrl=function(a){return globals.contextPath+a}}]).controller("ReturnsCtrl",["$scope","$http","returnData",function(a,b,c){a.returnForm=c,a.errors=!1,a.validateCurrentStep=function(){var b=!1;switch(a.currentStep){case 1:b=_.some(a.returnForm.items,function(a){return a.quantity>0});break;case 2:b=_.every(a.returnForm.items,function(a){return a.quantity>0?a.reason&&"null"!=a.reason:!0})}return a.moveStepAttempt&&(a.errors=b?!1:!0),b},a.test=function(){a.returnForm.orderAddress=!1},a.nextStep=function(){a.moveStepAttempt=!0;var b=a.validateCurrentStep();b&&(a.currentStep++,a.moveStepAttempt=!1)}}]).controller("ShoeFinderCtrl",["$scope","$rootScope","$location","$localStorage","ProductListService",function(a,b,c,d,e){function f(b){_.each(_.rest(a.views,b),function(b){a.$storage.filters[b.id]="check"===b.type?[]:null})}function g(a){c.path("/"+a)}function h(){a.productListService.getProducts(a.$storage.filters,a.$storage.sort)}function i(b){s=_.where(a.views,{id:b})[0]||a.views[0],f(_.indexOf(a.views,s)),s.data?h():a.currentView=s}function j(){return _.indexOf(a.views,_.where(a.views,{id:a.currentView.id})[0])}function k(){return j()===a.views.length-1}function l(a){i(a.replace("/",""))}function m(){a.loading=!0}function n(b,c){a.loading=!1,a.products=c.products,a.resultCount=c.resultCount,a.products.length?a.currentView=s:a.error=!0}function o(b,c){if(b&&b!==c){var d=j();if(0===d)return;var e=a.views[d-1],f=a.$storage.filters[e.id];if(p("virtual/shoefinder/"+a.currentView.url+"/step"+d),f){var g=_.isArray(f)?_.pluck(f,"id").join(","):f.id;q(e.url,g)}if(k()){var h=_.pluck(a.products,"name").splice(0,15).join(","),i=a.$storage.filters.experience.id;r(3,"Running Experience Level",i,1),q("Shoes Loaded",h)}}}function p(a){globals.googleAnalytics.trackPageview(a)}function q(a,b,c,d,e){globals.googleAnalytics.trackEvent("Shoe Finder",a,b,c,d,e)}function r(a,b,c,d){globals.googleAnalytics.setCustomVar(a,b,c,d)}a.views=[{id:"splash",url:"splash",menu:!1,data:!1},{id:"surface",url:"surface",menu:!0,label:"Surface",type:"check",data:!1},{id:"gender",url:"gender",menu:!0,label:"Gender",type:"radio",data:!1},{id:"experience",url:"experience",menu:!0,label:"Experience",type:"radio",data:!0},{id:"pro",url:"pronation",menu:!0,label:"Pronation",type:"radio",data:!0},{id:"results",url:"results",menu:!1,data:!0}],a.$storage=d.$default({filters:{surface:[],gender:null,bmi:null,type:null,experience:null,pro:null}}),a.location=c,a.productListService=e,a.error=!1,""===a.location.path()&&a.location.path("/");var s;a.$on("productList.loading",m),a.$on("productList.loaded",n),a.$watch("location.path()",l),a.$watch("currentView",o),a.next=function(){var c,d=j();d===a.views.length-1&&(d=-1,a.products=[],b.$broadcast("productListData.reset")),c=a.views[++d],g(c.id)},a.closeErrorMessage=function(){var b=_.indexOf(a.views,_.where(a.views,{id:a.currentView.id})[0]);a.error=!1,g(a.views[b].id)},a.isSelected=function(b,c){return _.where(a.$storage.filters[b],{id:c}).length}}]).controller("ProductSelector",["$rootScope","$scope","$http","$window","ProductService","QuickBuyService","CartService",function(a,b,c,d,e,f,g){b.addingInProgress=!1,Sportif.Common.urlParamsDetect();var h={addAttempted:!1,code:null,colours:null,data:{},query:window.location.search,selection:[],variants:null},i=function(a){b.defaultOneSizeCode=a.defaultOneSizeCode,"shoeWidthCode"==a.primaryColourOption.sizeOptions[0].variantOptionQualifiers[0].qualifier&&_.each(a.primaryColourOption.sizeOptions,function(a){a.variantOptionQualifiers.reverse()}),h.data=a,h.variants=k(a.primaryColourOption.sizeOptions),h.selection=l(a.primaryColourOption.sizeOptions[0].variantOptionQualifiers),m(a.defaultOneSizeCode),"object"==typeof Selectivizr&&setTimeout(function(){Selectivizr.init()},100)},j=function(a,b){var c=-1;return _.each(a,function(a,d){a.value==b&&(c=d)}),c},k=function(a){var b=[];return _.each(a,function(a,c){var d,e,f=a.styleNumber;_.each(a.variantOptionQualifiers,function(g,h){if(0===c){var i="shoeSizeCode"==g.qualifier||"shoeSizeCodeUK"==g.qualifier?"shoe-size-guide":"shoeWidthCode"==g.qualifier?"shoe-width-guide":"clothing-size-guide";b[h]={className:g.qualifier.replace(/([A-Z])/g,function(a){return"_"+a.toLowerCase()}),displayValue:g.name,guideUrl:globals.contextPath+"/"+i,sizes:[],value:g.qualifier},2==a.variantOptionQualifiers.length&&(b[h].subVariantIndex=Math.abs(h-1))}if(d=b[h].sizes,e=d[j(d,g.value)],e||(d.push({displayValue:g.displayValue,value:g.value,subVariants:{},styleNumber:f}),e=d[d.length-1]),1==a.variantOptionQualifiers.length)e.code=a.code,e.stock="outOfStock"!==a.stockLevelStatus.code;else{e.stock=e.stock||"outOfStock"!==a.stockLevelStatus.code;var k=a.variantOptionQualifiers[Math.abs(h-1)];e.subVariants[k.value]={code:a.variantCode,value:k.value,stock:"outOfStock"!==a.stockLevelStatus.code}}})}),b},l=function(a){var b=[];return _.each(a,function(a,c){b[c]={displayValue:a.name,key:a.qualifier,value:null}}),b},m=function(a){_.each(h.selection,function(b,c){Sportif.Common.urlParams[b.key]&&o(c,Sportif.Common.urlParams[b.key]),h.selection[c].value||("shoeWidthCode"==b.key&&(-1!==j(h.variants[c],"standard")?o(c,"standard"):o(c,h.variants[c].sizes[0].value)),"apparelSizeCode"==b.key&&o(c,a))})},n=function(){var a=[];_.each(h.selection,function(b){b.value||a.push(b.displayValue)}),h.unselectedMsg=a.join(" / ")},o=function(a,c,d){var e=h.variants[a],f=h.selection,g=e.sizes[j(e.sizes,c)];1!==h.variants.length||g||(b.selectedStyleNumber=0,f[0].styleNumber=e.sizes[0].styleNumber);var i=function(e){f[a].value=c,f[a].styleNumber=g.styleNumber,b.selectedStyleNumber=a,e&&(h.code=e),c!==d&&p(),h.addAttempted&&n(),(void 0==g.styleNumber||null==g.styleNumber||""==g.styleNumber)&&(f[a].styleNumber=h.data.styleNumber)};if(g&&g.stock)if(1==f.length)i(g.code);else{var k=f[Math.abs(a-1)].value;if(k){var l=g.subVariants[k];l.stock&&i(l.code)}else i()}},p=function(){h.query=[],_.each(h.selection,function(a){a.value&&h.query.push(a.key+"="+a.value)}),h.query=h.query.length?"?"+h.query.join("&"):""},q=function(a,b,c,d){globals.googleAnalytics.trackEvent("Cart",a,b,c,!0),globals.googleAnalytics.trackEvent("Cart",a,b,d,!0)},r=function(a,b){function c(a){return _.map(a,function(a){return a.quantity+"x"+a.product.name}).join(",")}function d(a){return _.pluck(_.pluck(_.pluck(a,"supercategories"),"0"),"name").join(",")}var e=h.data,f=g.model.contents.data,i=c(f.entries);b&&e.genderData&&(globals.mixpanel.people.set("Last item",new Date),globals.mixpanel.track("Add Item to Cart",{"Product id":e.code,"Product Name":e.name,Category:e.categoryNames,Gender:e.genderData.code,Sport:d(e.productTypes),Size:h.selection[0].value,"Item list":i,"Item count":f.totalItems}))};b.contextPath=globals.contextPath,b.cart=g.model,b.cartAddItem=g.addItem,b.quickBuyData=f.model,b.quickBuyBroadcast=function(){b.$parent.$broadcast("quick_buy")},b.productData=h,b.productQty=1,b.productGetSizeData=function(a){h.variants=null,e.getProductSizeData({productCode:a},i)},b.productSelectionChange=function(){b.cart.contents.messages&&(b.cart.contents.messages.itemAdd=null)},b.productSetVariant=o,b.productAdd=function(a,c,d){var e=h.data.name,f=h.data.price.value;if(h.addAttempted=!0,n(),!b.addingInProgress&&!h.unselectedMsg.length){var i="quickbuy"===d?"QuickBuy":"AddToCart";q(i,e,c,f),b.addingInProgress=!0,g.addItem(a,c)}},b.sizeSelectorUpdate=function(a){null!==this.selectedItem&&(b.productSetVariant(a,this.selectedItem.value),b.productSelectionChange(),p(),b.$emit("selectChanged",{index:a,item:this.selectedItem}))},b.$on("itemAddAttempted",function(c,d){b.addingInProgress=!1,a.$broadcast("openCart"),d.success&&r(d.data.entries,d.messages.itemAdd)}),b.clearProductAddData=function(){g.model.contents.messages&&(g.model.contents.messages.itemAdd=null),g.model.localMessages.itemAdd=!1,_.each(h.selection,function(a){a.value=null}),h.unselectedMsg=[],h.addAttempted=!1}}]).controller("ProductsData",["$scope","ProductsService","QuickBuyService",function(a,b,c){function d(a){a.products.length&&(e.contents.products||(e.contents.products=[]),_.each(a.products,function(a){a.url=globals.contextPath+a.url,e.contents.products.push(a)}),e.itemsTotal=a.total,e.pageTotalRendered+=Math.ceil(a.products.length/e.pageItems)),"object"==typeof Selectivizr&&Selectivizr.init()}var e={contents:{},pageTotalRendered:0};a.getProducts=function(a){var c=(page+1-e.pageTotalRendered,{});a&&(c.from=e.contents.products?e.contents.products.length:0,c.to=a),e.productCodes&&(c.productCodes=e.productCodes),e.categoryCodes&&(c.categoryCodes=e.categoryCodes),b.getProducts(c,d)};var f=12,g=1;a.productsData=e,a.ratingDisplayWidth=function(a){return a*f+(a-a%1)*g+"px"},a.quickBuyData=c.model,a.quickBuyBroadcast=function(){a.$parent.$broadcast("quick_buy")}}]).controller("ProductListing",["$scope","$http","$timeout","$window","QuickBuyService","TransitionEndService","GTMService","MixPanelService",function(a,b,c,d,e,f,g,h){function i(a){d.history.replaceState&&d.history.replaceState({query:a.results.query},"",d.location.pathname)}function j(a){h.update(a),p=a,k(),o(a)}function k(){!q&&p&&(a.coverDelay=!1,a.listing=p,l(p))}function l(){r&&d.history.pushState&&d.history.pushState({query:p.results.query},"",p.results.baseUrl+r)}function m(){a.loading&&(q?(q=!1,k()):p&&(a.loading=!1))}function n(){c(function(){q=!1,k(),a.loading=!1},500)}function o(a){var b=_.pluck(a.results.items,"code");g.updateDataLayer({searchterms:a.results.searchTerm}),g.updateDataLayer({event:"criteoProductList",productids:b.join("|")})}a.contextPath=globals.contextPath,a.init=function(b){h.update(b),a.listing=b,o(b),i(b)},a.hasAvailableAndStandardPrice=function(a){var b=!1;return a.purchasable&&null===a.wasPrice&&null!==a.price&&a.openPrice!==!0&&(b=!0,a.useDefault=!1),b},a.hasAvailableAndMarkedownPrice=function(a){var b=!1;return a.purchasable&&null!==a.wasPrice&&null!==a.price&&a.openPrice!==!0&&(b=!0,a.useDefault=!1),b},a.hasAvailableAndOpenPrice=function(a){var b=!1;return a.purchasable&&null!==a.price&&null!==a.wasPrice&&a.openPrice!==!0&&(b=!0,a.useDefault=!1),b},a.hasAvailableAndMarkedownAndOpenPrice=function(a){var b=!1;return a.purchasable&&null!==a.wasPrice&&null!==a.price&&a.openPrice===!0&&(b=!0,a.useDefault=!1),b},a.notAvailableAndOpenPrice=function(a){var b=!1;return a.purchasable||null!==a.wasPrice||null===a.price||a.openPrice!==!0||(b=!0,a.useDefault=!1),b},a.notAvailableAndStandardPrice=function(a){var b=!1;return a.purchasable||null!==a.wasPrice||null===a.price||a.openPrice===!0||(b=!0,a.useDefault=!1),b},a.listingView={facetShowAll:{},facetCollapse:{}},a.starWidth=12,a.starGap=1,a.loading=!1,a.coverDelay=!1;var p,q,r;a.update=function(c,d,e){c&&(a.loading||(a.loading=!0,p=null,r=null,e?(q=!1,b.get(a.listing.results.baseUrlAjax+c).success(function(a){j(a)}),a.loading=!1):(a.coverDelay=!0,q=!0,r=c,b.get(a.listing.results.baseUrlAjax+c).success(function(b){j(b),d||a.$broadcast("scrollToSearchTop")}),f||n())))},d.addEventListener&&d.addEventListener("popstate",function(b){b.state&&b.state.query!=a.listing.results.query&&(a.$$phase?a.update(b.state.query,!1,!0):a.$apply(function(){a.update(b.state.query,!1,!0)}))}),f&&a.$on("coverTransitionEnded",m),a.quickBuyData=e.model,a.quickBuyBroadcast=function(){a.$parent.$broadcast("quick_buy")}}]).controller("SocialFeeds",["$scope","SocialService",function(a){function b(a){var b=a;d.contents=b,d.pageTotalRendered=d.itemsTotal=a.length}var c=globals.sportifSocialTweets,d={contents:[],pageTotalRendered:0};a.getSocialFeed=function(a){"twitter"==a&&b(c)},a.socialFeeds=d}]).controller("MiniCart",["$scope","CartService",function(a,b){a.cart=b.model}]).controller("MainCart",["$scope","CartService",function(a,b){a.isPromotionsVisible=!1,a.showPromotions=function(){a.isPromotionsVisible=!0,globals.googleAnalytics.trackEvent("Discount Code","Tab Opened")},a.cart=b.model,a.cartUpdateLine=b.updateLine,a.cartAddCoupon=b.addCoupon,a.cartRemoveCoupon=b.removeCoupon}]).controller("Modal",["$scope",function(a){a.modalShown=!1,a.toggleModal=function(){a.modalShown=!a.modalShown}}]).controller("QuickShop",["$scope","QuickShopService","CartService",function(a,b,c){a.quickShop=b.model,a.cart=c.model,a.addingInProgress=!1,a.starWidth=12,a.starGap=1,a.contextPath=globals.contextPath;var d=function(){if(a.quickShop.contents.sizeWrapper){var b="shoeSizeCode"==a.quickShop.contents.sizeWrapper.sizes[0].qualifier||"shoeSizeCodeUK"==a.quickShop.contents.sizeWrapper.sizes[0].qualifier?"shoe-size-guide":"clothing-size-guide";a.quickShop.contents.sizeWrapper.guideUrl=globals.contextPath+"/"+b}else a.quickShop.contents.widthWrapper.guideUrl=globals.contextPath+"/shoe-width-guide",a.quickShop.contents.widthWrapper.widths[0].sizeWrapper.guideUrl=globals.contextPath+"/shoe-size-guide"},e=function(){void 0!==a.selectedWidth&&(delete a.selectedWidth,delete a.unselected),_.each(a.quickShop.contents.widthWrapper.widths,function(b,c){b.stockLevelStatus={code:"outOfStock"};{var d;b.sizeWrapper.sizes.length}for(d=0;d<b.sizeWrapper.sizes.length;d++)if("outOfStock"!=b.sizeWrapper.sizes[d].stockLevelStatus.code){b.stockLevelStatus.code="inStock",void 0===a.selectedWidth&&"standard"===b.code&&(a.selectedWidth=c);break}}),1===a.quickShop.contents.widthWrapper.widths.length?a.selectedWidth=0:void 0===a.selectedWidth&&(a.unselected=0)},f=function(b,d){var e,f=function(a){return _.map(a,function(a){return a.quantity+"x"+a.product.name}).join(",")},g=function(a){return _.pluck(_.pluck(_.pluck(a,"supercategories"),"0"),"name").join(",")},h=function(){var c,d;return a.quickShop.contents.widthWrapper?(d=a.quickShop.contents.widthWrapper.widths[a.selectedWidth].sizeWrapper.sizes[a.selectedSize],e=d.code):(d=a.quickShop.contents.sizeWrapper.sizes[a.selectedSize],e=d.code),_.each(b,function(a){return a.product.code===d.productCode?void(c=a.product):void 0}),c},i=h(),j=c.model.contents.data,k=f(j.entries);d&&i.genderData&&(globals.mixpanel.people.set("Last item",new Date),globals.mixpanel.track("Add Item to Cart",{"Product id":i.code,"Product Name":i.name,Category:i.categoryNames,Gender:i.genderData.code,Sport:g(i.productTypes),Size:e,"Item list":k,"Item count":j.totalItems}))},g=function(a,b,c,d){globals.googleAnalytics.trackEvent("Cart",a,b,c,!0),globals.googleAnalytics.trackEvent("Cart",a,b,d,!0)};a.changeWidth=function(b){"outOfStock"!=a.quickShop.contents.widthWrapper.widths[b].stockLevelStatus.code&&(null!==a.selectedSize?"outOfStock"!=a.quickShop.contents.widthWrapper.widths[b].sizeWrapper.sizes[a.selectedSize].stockLevelStatus.code&&(a.selectedWidth=b,0===a.unselected&&(delete a.unselected,delete a.quickShop.contents.unselectedMsg),a.cart.contents.messages&&delete a.cart.contents.messages):(a.selectedWidth=b,a.quickShop.contents.unselectedMsg&&(a.quickShop.contents.unselectedMsg=a.quickShop.contents.widthWrapper.widths[b].sizeWrapper.typeName),0===a.unselected&&delete a.unselected))},a.changeSize=function(b){a.quickShop.contents.sizeWrapper?"outOfStock"!=a.quickShop.contents.sizeWrapper.sizes[b].stockLevelStatus.code&&(a.selectedSize=b,a.quickShop.contents.unselectedMsg&&delete a.quickShop.contents.unselectedMsg,a.cart.contents.messages&&delete a.cart.contents.messages):void 0!==a.selectedWidth?"outOfStock"!=a.quickShop.contents.widthWrapper.widths[a.selectedWidth].sizeWrapper.sizes[b].stockLevelStatus.code&&(a.selectedSize=b,a.quickShop.contents.unselectedMsg&&delete a.quickShop.contents.unselectedMsg,a.cart.contents.messages&&delete a.cart.contents.messages):"outOfStock"!=a.quickShop.contents.widthWrapper.widths[0].sizeWrapper.sizes[b].stockLevelStatus.code&&(a.selectedSize=b,a.quickShop.contents.unselectedMsg&&(a.quickShop.contents.unselectedMsg=a.quickShop.contents.widthWrapper.typeName),a.cart.contents.messages&&delete a.cart.contents.messages)},a.productAdd=function(){a.addingInProgress||(a.quickShop.contents.sizeWrapper?null!==a.selectedSize?(a.addingInProgress=!0,c.addItem(a.quickShop.contents.sizeWrapper.sizes[a.selectedSize].productCode,1),g("quickbuy",a.quickShop.contents.name,1,a.quickShop.contents.price.value)):a.quickShop.contents.unselectedMsg=a.quickShop.contents.sizeWrapper.typeName:null!==a.selectedSize&&void 0!==a.selectedWidth?(a.addingInProgress=!0,c.addItem(a.quickShop.contents.widthWrapper.widths[a.selectedWidth].sizeWrapper.sizes[a.selectedSize].productCode,1),g("quickbuy",a.quickShop.contents.name,1,a.quickShop.contents.price.value)):a.quickShop.contents.unselectedMsg=null===a.selectedSize&&void 0===a.selectedWidth?a.quickShop.contents.widthWrapper.widths[0].sizeWrapper.typeName+" / "+a.quickShop.contents.widthWrapper.typeName:null===a.selectedSize?a.quickShop.contents.widthWrapper.widths[0].sizeWrapper.typeName:a.quickShop.contents.widthWrapper.typeName)},a.$watch("quickShop.contents",function(){a.quickShop.contents&&(a.quickShop.contents.widthWrapper?(e(),a.selectedSize=a.quickShop.contents.widthWrapper.widths[0].sizeWrapper.sizes.length>1?null:0):a.selectedSize=a.quickShop.contents.sizeWrapper.sizes.length>1?null:0,a.cart.contents.messages&&delete a.cart.contents.messages,d())}),a.$on("itemAddAttempted",function(b,c){a.addingInProgress=!1,c.success&&a.quickShop.contents&&f(c.data.entries,c.messages.itemAdd)})}]).controller("PostcodeAnywhereCapture",["$scope","PostcodeAnywhereCaptureService",function(a,b){function c(b){return b.Items.length?b.Items.length&&b.Items[0].Error?(a.addresses=[],void(a.results=0)):(a.addresses=b.Items,a.results=a.addresses.length,void(a.activeIndex=-1)):(a.addresses=[],void(a.results=1))}function d(b){if(a.address=b.Items[0],Sportif.PostcodeAnywhere.postcodeFilter)for(var c,d=0;d<Sportif.PostcodeAnywhere.postcodeFilter.length;d++)if(c=new RegExp("^"+Sportif.PostcodeAnywhere.postcodeFilter[d]),c.test(a.address.PostalCode)){a.address.noShippingArea=!0;break}a.updateAddressForm(),a.resetFind(),a.pacActive=!1,a.results=0}a.pacActive=!1,a.results=0,a.addresses=[],a.address=null,a.find=function(d,e){a.pacActive=!0,b.find(d,e?e:null,c)},a.retrieve=function(a){b.retrieve(a,d)},a.select=function(b){"Find"===b.Next?a.find(b.Text,b.Id):a.retrieve(b.Id)}}]);