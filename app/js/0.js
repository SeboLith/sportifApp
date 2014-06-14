"use strict";function debug(){return $("#content").toggleClass("show_grid"),$("#content").hasClass("show_grid")}function registerNewsletter(){var a;a=$("#newsletter").attr("checked")?!0:!1,$.ajax({url:"newsletter",data:{newsletter:a}})}angular.module("SportifStore",["ngSanitize","ui.router","ui.bootstrap","restangular","directives","controllers","factories"]),angular.module("controllers",[]),angular.module("directives",[]),angular.module("factories",[]),angular.module("filters",[]);var htmlClass="js";void 0!==window.Touch&&(htmlClass+=" touch"),"Microsoft Internet Explorer"==navigator.appName&&(htmlClass+=" ie",document.addEventListener||(htmlClass+=" ie_lt9",document.write('<script src="html5shiv.js"></script>'),document.write('<script id="ie8s" src="selectivizr.js"></script>'))),document.documentElement.className=htmlClass;var globals={sportifSocialTweets:[],autocompleteURL:"/search/autocomplete",autoplayInterval:6e3,ieLt9:"Microsoft Internet Explorer"==navigator.appName&&!document.addEventListener,contextPath:"",languageISO:"en"},Sportif={Common:{cookie:function(){function a(){var a=!1;return document.cookie="testcookie=1; path=/",a=-1!=document.cookie.indexOf("testcookie")?!0:!1}var b=$("#cookie-bar"),c=b.find("p.policy"),d=b.find("p.warning");a()?(d.hide(),b.length>0&&("false"==$.cookie("policy")||void 0==$.cookie("policy"))&&($.cookie("policy","false"),c.show(),b.find(".cb-enable").click(function(a){a.preventDefault(),$.cookie("policy","true",{expires:365}),c.hide()}))):(c.hide(),d.show())},urlParamsDetect:function(){if(!Sportif.Common.urlParams){Sportif.Common.urlParams={};for(var a,b=/\+/g,c=/([^&=]+)=?([^&]*)/g,d=function(a){return decodeURIComponent(a.replace(b," "))},e=window.location.search.substring(1);a=c.exec(e);)Sportif.Common.urlParams[d(a[1])]=d(a[2])}},videoContent:function(a){var b,c,d;$(a).each(function(){var a=$(this),e=a.find("a.launch_video"),f=e.attr("href"),g=e.attr("data-videoheight");g||(g=558),e.click(function(e){e.preventDefault();var h=a.find("div.header h3").text();globals.googleAnalytics.trackEvent("Video","Play",h,null,!0),f&&(b?(b.siblings(".video_active").css({height:"auto"}).removeClass("video_active"),b.insertAfter(a),c.attr("src",f)):(b=$('<div class="video_player"></div>').insertAfter(a),c=$('<iframe src="'+f+'" width="940" height="'+g+'" />').appendTo(b),$('<a class="button">Close Video</a>').appendTo(b).click(function(a){a.preventDefault(),c.attr("src",""),b.hide().siblings(".video_active").css({height:"auto"}).removeClass("video_active")})),b.show().css({top:a.position().top}),a.css({height:parseInt(g)+50+"px"}).addClass("video_active"),d=a.offset().top,a.siblings(".editorial").each(function(){var b=$(this);b.offset().top==d&&b.css({height:a.height()+"px"}).addClass("video_active")}))})})},navigationPrimary:function(){var a=$("#primary li, body:not(.cart) #minicart, #cart #continue_shopping");a.bind("click",function(b){Sportif.Nav.panelsAnimation(b,this,a)})},quote:function(){$(".quote > p").contents().unwrap()},languageSelector:function(){var a={check:function(){$(window).height()<$("#languageSelector").height()&&$("#languageSelector").css("height",$(window).height()-parseInt($("#languageSelector").css("border-top")))},show:function(){this.check(),$("#languageSelector").show()},hide:function(){$("#languageSelector").hide()}};$("#website_country").bind("click",function(b){b.stopPropagation(),a.show(),$("header, #content, #closeChangeLanguage").not("#languageSelector").one("click",function(){a.hide()})})},heightMatch:function(a){var b=$(a),c=0;b.each(function(){c=Math.max($(this).height(),c)}),b.css("min-height",c+"px")},widthMatch:function(a){var b=$(a),c=b.first(),d=Math.max(c.find("a").eq(0).width(),c.find("a").eq(1).width());b.find("a").css("width",d)},refreshScreenReaderBuffer:function(){$("#screen_reader_refresh").attr("value",(new Date).getTime())},searchAutocomplete:function(){function a(a,b,c){globals.googleAnalytics.trackEvent("Internal Site Search",a,b,null,null,c)}function b(a){var b=$(".ui-menu");_.each(a,function(a,d){b.find(".ui-menu-item").eq(d).find("a").attr("href",globals.contextPath+a.url).append(c(a))}),b.append(j),$("li",b).each(function(a){$(this).delay(30*a).hide().fadeIn(100)})}function c(a){var b='<img src="'+a.imageUrl+'" width="105" height="60"/><h4>'+a.name+"</h4><p>"+a.shortDescription+"</p>";return b}var d=$("#search"),e=$("form",d),f=$("#search_query",d),g=$("#social_links, #tiger_link"),h=f.width(),i=282,j=$("#autocomplete_more_button",d);e.submit(function(a){a.preventDefault();var b=$.trim(f.val().replace(/\//g," "));return window.location.href=e.attr("action")+(b.length?"/"+encodeURIComponent(b).replace(/\%20/g,"+"):""),b.length>0}),f.on("focus",function(){g.fadeOut("fast").not("#tiger_link").css({position:"absolute",right:240}),$(this).animate({width:i+"px",borderTopLeftRadius:0,borderBottomLeftRadius:0}),a("Search Initiated")}).on("blur",function(){$(this).animate({width:h+"px",borderTopLeftRadius:13,borderBottomLeftRadius:13},function(){g.removeAttr("style").fadeIn("fast")})}).autocomplete({messages:{noResults:"",results:function(){}},source:function(a,c){$.getJSON(globals.autocompleteURL,{term:f.val()},function(a){c(a),b(a)})},minLength:3,open:function(){$(".ui-menu").css({"z-index":1e4,position:"absolute",top:f.offset().top+f.outerHeight()})},close:function(){$(".ui-menu").css({"z-index":-1})},select:function(a,b){window.location.href=globals.contextPath+b.item.url},autoFocus:!1}),$("#ui-id-1").on("click","li a",function(b){b.preventDefault();var c=$(this).attr("href");"more_button"==$(this).attr("id")&&(c=void 0,$("form[name=search_form]").submit()),a("Search Completed",f.val(),c)})},login:function(){$("#loginForm").each(function(){function a(a){var b=/^\S+@\S+\.\S+$/;return b.test(a)}var b=$(this),c=b.find("#j_username"),d=(b.find("#j_password"),b.find(".validate.field_error"));b.find("input[type=submit]").on("click",function(e){e.preventDefault(),b.find("p.field_error").hide(),a(c.val())?b.submit():(c.closest("li").addClass("field_error"),d.show())});var e=new Date;e.setTime(e.getTime()+5e3),$.cookie("login","attempted",{expires:e,path:"/"})})},loginAnalytics:function(){"attempted"==$.cookie("login")&&($.removeCookie("login",{path:"/"}),globals.googleAnalytics.trackEvent("Login","Submit","Returning SPORTIF Customers",4,!0))},searchResultsTabs:function(){$(".search .tab").click(function(a){var b=$(this);globals.googleAnalytics.trackEvent("Tab Interaction",b.data("ga-action"),null,null,null,b.attr("href")),a.preventDefault()})},newsletterSignup:function(){var a=$(".newsletter_signup_form"),b="<p class='message'></p>",c="";a.on("submit",function(d){function e(){var c="";return c="newsletter_signup"!=a.parent().attr("id")?a.find(".message.error").remove().end().find("input[type=submit]").before(b):a.find(".message.error").remove().end().find("input[type=submit]").parent().after(b),0==a.find("p").length,a.find("p")}var f=$(this).find("input").val();d.preventDefault(),a=$(this),$.ajax({dataType:"json",url:a.attr("action"),data:{email:f},success:function(b){c=e(),"success"==b.type?(a.find("input, .button").hide(),c.addClass("success").html("<span class='icon'></span>"+b.text),globals.googleAnalytics.trackEvent("Email-Signup","Newsletter",null,null,!0),globals.mixpanel.track("Newsletter subscribed",{email:f})):c.addClass("error").html("<span class='icon'>!</span>"+b.text)},error:function(){c=e(),c.addClass("error").html("<span class='icon'>!</span>Error")}})})},trackOutboundLinks:function(){function a(a){return a.split(":")[0]}$("a").on("click",function(b){var c=$(this),d=c.attr("href"),e=c.attr("target");if(a(b.currentTarget.host)!==a(window.location.host)){if(c.hasClass("launch_video")||"_blank"===e||"_new"===e){var f=d;d=void 0}else b.preventDefault();globals.googleAnalytics.trackEvent("External",f,null,1,!0,d)}})},eventsPageAnalytics:function(){$("body.event").length&&globals.mixpanel.register({"Search-Race name":$("#event_details > .item:first-child h2").text()})},athletesPageAnalytics:function(){function a(a){globals.mixpanel.register({"Search-Athlete name":a})}$("body.athlete").length?a($("#athlete_details > .item:first-child h1 span").text()):$("body.team").length&&a($("#team_details > .item:first-child h2").text())},countrySelector:function(){var a=$("#country_select");a.find("#website_country").on("click",function(){var a=$(this).siblings("ol").show();a.on("mouseleave",function(){$(this).hide()})}),a.find("#languageSelector a").on("click",function(a){a.preventDefault();var b=$(this).attr("href");globals.googleAnalytics.trackEvent("Change Country","Select",$(this).text(),null,!0,b)})}},Nav:{splitArray:[],updateCartHeight:function(){$("#panels > div:visible").length>0&&setTimeout(function(){$("#panels").stop().animate({height:$("#cart_panel").outerHeight()},500)},50)},panelsAnimation:function(a,b,c){var d=$("div#panels"),e=0,f=250,g=f,h=2*f,i=$(b),j=i.find("a"),e=i.parent().children(".active").index(i)+1,k=$("#panels > div:nth-child("+e+")");d.queue().length<1&&("minicart"==a.currentTarget.id?(k=$("#cart_panel"),$("#lead").toggleClass("cart_panel_open").find("#minicart").toggleClass("quick")):$(j).is("#cartCouponLink")?$("#lead").addClass("cart_panel_open"):"continue_shopping"==a.currentTarget.id?(a.preventDefault(),$("#minicart").click()):$("#lead").removeClass("cart_panel_open").find("#minicart").removeClass("quick"),j.hasClass("panel_link")?(a.preventDefault(),j.toggleClass("panel_active active"),j.hasClass("panel_active")?(c.find("a.panel_active").length>1?(k.hasClass("split")||k.css({position:"absolute",visibility:"hidden",display:"block"}),$("#panels > div:visible").fadeOut(g,function(){k.removeAttr("style").fadeIn(g)})):k.fadeIn(g),k.hasClass("split")||(this.splitColumn(k),k.addClass("split"),this.setMinSize(k)),c.find("a").not(j).removeClass("panel_active active"),d.animate({height:k.outerHeight()},h)):d.animate({height:0},h).find("> div").fadeOut(g)):$(j).is("#cartCouponLink")&&a.preventDefault())},splitColumn:function(a){var b=$(a).find(".listing ul").attr("data-js-split"),c='<ul class="level_3"></ul>';void 0!==b&&(this.splitArray=b.split(","));var d=$(a).find(".navigation_group"),e=d.find(".listing"),f=e.length;if(this.splitArray.length===f)for(var g=0;f>g;g++)if(0!==parseInt(this.splitArray[g]))for(var h=e.eq(g).find("ul li"),i=h.length,j=0;i>j;j++)j%this.splitArray[g]===0&&(0===j&&h.unwrap(),e.eq(g).find("li").slice(j,j+parseInt(this.splitArray[g])).wrapAll(c));this.splitArray=[]},setMinSize:function(a){for(var b=$(a).find(".navigation_group").find(".listing"),c=0,d=0,e=0;e<b.length;e++)c<=b.eq(e).outerHeight()&&(c=b.eq(e).outerHeight()),d=parseInt(b.eq(e).css("min-width"))<140?140:parseInt(b.eq(e).css("min-width")),b.eq(e).css({"min-width":d*(b.eq(e).children().length-1)});b.css({"min-height":c}),this.setMargin(a)},setMargin:function(a){var b=$(a).find(".navigation_group:visible").find(".listing"),c=0==b.find(".featured").length?b.find("ul.level_3").length:b.find("ul.level_3").length-1;if(b.length%c!==0)for(var d=0,e=0;e<b.length+1;e++)if(d<=$(".navigation_group:visible").width())for(var f=0;f<b.eq(e).find("ul.level_3").length;f++)d+=$(".listing").find("ul li").width()+20;else b.eq(e-1).css({"margin-right":0,"border-right":"none"})}},Form:{init:function(){Sportif.Form.dropdowns.enableAll(),Sportif.Form.focusField(),Sportif.Form.submitLink(),Sportif.Form.updateSecurityIcon()},dropdowns:{enableDropdown:function(a){function b(a,b){var c=a.find("option:selected").text();if(!b){var d=a.attr("data-model");d&&d.length&&(a=$('select[data-model="'+d+'"]'))}a.siblings(".select_ui").find("span.label").text(c)}a.css("opacity",0),b(a,!0),a.on("change",function(){b(a)})},enableAll:function(){$("select").not(".facet, [data-select]").each(function(){Sportif.Form.dropdowns.enableDropdown($(this))})}},focusField:function(){$("input.text, input:checkbox, input:radio, select").focus(function(){$(this).addClass("focus").closest("li").addClass("focus")}).blur(function(){$(this).removeClass("focus").closest("li").removeClass("focus")})},submitLink:function(){$("a.submit_link","form").click(function(a){a.preventDefault(),$(this).closest("form").submit()})},updateSecurityIcon:function(){var a=".amex";$("select[name=cardTypeCode]").on("change",function(){var b=$(this).find("option:selected");"amex"==b.val()?($("dl.card_cvv"+a).css({display:"inline-block"}),$("dl.card_cvv").not(a).hide()):($("dl.card_cvv"+a).hide(),$("dl.card_cvv").not(a).css({display:"inline-block"}))})}},ProductDetail:{init:function(){Sportif.ProductDetail.zoom()},zoom:function(){var a=$("#zoom_link");if(a.length){var b,c=a.children("span"),d=$("#product_image_list > li.primary");a.on("click",function(e){e.preventDefault(),1==d.length&&(b=$('<li class="primary zoom"><img src="'+a.attr("href")+'" alt=""></li>').insertBefore("li.primary").css({height:d.height()}),b.children("img").load(function(){b.viewport().viewport("content").draggable({containment:"parent"})}),d=d.add(b)),d.add(c).toggleClass("active")})}}},Checkout:{init:function(){Sportif.Checkout.deliveryMethods(),Sportif.Checkout.ajpPaymentMethods(),Sportif.Checkout.billingAddress(),Sportif.Checkout.aopPaymentDetails()},deliveryMethods:function(){$('input[name="delivery_method"]',"#selectDeliveryMethodForm").change(function(){$(this).closest("li").addClass("selected").siblings().removeClass("selected")})},ajpPaymentMethods:function(){$('input[name="paymentType"]',"#selectPaymentMethodForm").change(function(){$(this).closest("li").addClass("selected").siblings().removeClass("selected")})},billingAddress:function(){$("#checkout_billing_details_add").each(function(){function a(){if(c.attr("checked")){d.addClass("disabled").find(":input").attr("disabled","disabled").each(function(){var a=$(this);a.val(a.attr("data-value"))});var a=d.filter(".select.address-state");a.find("span.label").text(a.find("select option:selected").text()),f()}else{d.removeClass("disabled").find(":input").removeAttr("disabled").each(function(){var a=$(this);a.val("")}),document.getElementById("address.state").options[0].selected=!0;var a=d.filter(".select");a.each(function(){var a=$(this);a.find("span.label").text(a.find("select option:selected").text())})}}var b=$(this),c=b.find("#useShippingAddress"),d=b.find(".billing_address_field"),e=function(){},f=function(){};if("undefined"!=typeof Sportif.AOP&&"function"==typeof Sportif.AOP.storeDeliveryAddress?Sportif.AOP.storeDeliveryAddress():d.find(":input").each(function(){var a=$(this);a.attr("data-value",a.val())}),"undefined"!=typeof Sportif.AAC){var g=b.find(".select.address-country"),h=d.filter(".select.address-state");e=function(){var a=d.filter(".select.address-country").find("select option:selected").text();if("United States"!==a){h.addClass("disabled").find(":input").attr("disabled","disabled").each(function(){var a=$(this);a.val(null)});var b=d.filter(".select.address-state");b.find("span.label").text("")}else{h.removeClass("disabled").find(":input").removeAttr("disabled");var b=d.filter(".select.address-state");b.find("span.label").text(b.find("select option:selected").text())}},g.change(function(){e()}),f=function(){var a=d.filter(".select.address-country");a.find("span.label").text(a.find("select option:selected").text())}}c.change(function(){a()}),a()})},aopPaymentDetails:function(){var a=$("#checkout_billing_details_add form");a.submit(function(){return a.find("input:disabled, select:disabled").each(function(){var b=$(this);$("<input />").attr("type","hidden").attr("name",b.attr("name")).attr("value",b.val()).appendTo(a)}),!0})}},StoreFinder:{init:function(){var a=$("#storeFinderForm");a.find("input.text").on("focus",function(){a.find("select").val("").change()})}},IsotopeFiltering:{init:function(){var a=$("body.athletes #athletes"),b=a.find(".isotope-container"),c=a.find(".item.view"),d=c.find("h5 span.count"),e=c.find("h5 span.singular"),f=c.find("h5 span.plural"),g=c.find("form.sort_name input:radio");b.isotope({layoutMode:"fitRows",itemSelector:".isotope-item",getSortData:{firstName:function(a){return a.attr("data-firstName")},lastName:function(a){return a.attr("data-lastName")}}}),$("body.athletes input:radio").on("click",function(){var a,c=$(this),h=c.attr("id"),i="allSports";a="sort"==c.attr("name")?{sortBy:h}:h==i?{filter:""}:{filter:"."+h},b.isotope(a,function(a){var b=a.length;1==b?(g.attr("disabled",!0),e.show(),f.hide()):(g.attr("disabled",!1),e.hide(),f.show()),d.text(a.length)})})}},Filtering:{init:function(){function a(a){g.hide();var b=a==k?g:g.filter("."+a),c=b.filter(".past_event").slice(0,m).show(),l=c.length,n=b.filter(".upcoming_event"),p=n.length;n.slice(0,o).show();var q=p+l;d.text(q),1==q?(e.show(),f.hide()):(e.hide(),f.show()),p>0?h.show():h.hide(),c.length>0?i.show():i.hide(),j.css(o>=p?{visibility:"hidden"}:{visibility:"visible"})}var b=$("body.events #sport_events"),c=b.find(".item.view h5"),d=c.find("span.count"),e=c.find("span.singular"),f=c.find("span.plural"),g=b.find(".event"),h=b.find(".events h2"),i=b.find(".past_events h2"),j=b.find("#showMoreEvents"),k="allSports",l=12,m=6,n=k,o=l;a(n),b.find("input:radio").each(function(){$(this).on("click",function(b){a(b.currentTarget.id)})}),j.on("click",function(b){b.preventDefault(),o+=l,a(n)})}}};_.mixin({deep:function(a,b,c){var d,e=b.replace(/\[(["']?)([^\1]+?)\1?\]/g,".$2").replace(/^\./,"").split("."),f=0,g=e.length;if(arguments.length>2){for(d=a,g--;g>f;)b=e[f++],a=a[b]=_.isObject(a[b])?a[b]:{};a[e[f]]=c,c=d}else{for(;null!=(a=a[e[f++]])&&g>f;);c=g>f?void 0:a}return c}}),_.mixin({pluckDeep:function(a,b){return _.map(a,function(a){return _.deep(a,b)})}});var app=angular.module("SportifStore");app.config(["$locationProvider",function(a){a.html5Mode(!0)}]),app.config(["$stateProvider","$urlRouterProvider",function(a,b){b.otherwise("/"),a.state("home",{url:"/",views:{"":{templateUrl:"views/partials/home.html"},"header@home":{templateUrl:"views/partials/header/header.html",controller:"HeaderCtrl"},"homeMain@home":{templateUrl:"views/partials/home_main/homeMain.html",controller:"HomeCtrl"},"footer@home":{templateUrl:"views/partials/footer/footer.html",controller:"FooterCtrl"}}}).state("shoes",{url:"/shoes",views:{"":{templateUrl:"views/partials/shoes.html"},"header@shoes":{templateUrl:"views/partials/header/header.html",controller:"HeaderCtrl"},"shoesMain@shoes":{templateUrl:"views/partials/shoes_main/shoesMain.html",controller:"ShoesCtrl"},"footer@shoes":{templateUrl:"views/partials/footer/footer.html",controller:"FooterCtrl"}}})}]),angular.module("controllers").controller("FooterCtrl",["$scope","ViewData",function(a,b){var c=new Date;a.year=c.getFullYear(),a.newsletter={},a.emailRegexValidation=/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,a.newsletterSignup=function(c){c.$valid&&(console.log(c.email.$modelValue),b.newsletterSignup(c.email.$modelValue),a.newsletter.email="")}}]).controller("ProductListCtrl",["$scope","$rootScope","$localStorage","ProductListService","QuickBuyService",function(a,b,c,d,e){function f(){i=!0,a.$storage.sort={by:j,limit:k},a.products=[]}function g(b,c){c.products.length&&(a.products=c.products,a.moreResults=c.attributes.showMoreResultsButton,a.resultCount=c.resultCount)}function h(b,c){b===c||i||a.productListService.getProducts(a.$storage.filters,a.$storage.sort),i=!1}var i=!1,j="featured",k=0;a.$storage=c.$default({sort:{by:j,limit:k}}),a.quickBuyData=e.model,a.productListService=d,a.$on("productList.loaded",g),a.$on("productListData.reset",f),a.$watch("$storage.sort",h,!0),a.showMore=function(){a.$storage.sort.limit=a.resultCount},a.quickBuyBroadcast=function(){a.$parent.$broadcast("quick_buy")},a.getUrl=function(a){return globals.contextPath+a}}]),angular.module("controllers").controller("HeaderCtrl",["$scope","ViewData",function(a,b){a.search={};b.headerData.then(function(b){a.topNav=b.data.values.topNav,a.shopBar=b.data.values.mainNav.shopBar,a.runningBar=b.data.values.mainNav.runningBar,a.featuredSportsBar=b.data.values.mainNav.featuredSportsBar,a.mySportifBar=b.data.values.mainNav.mySportifBar});a.ShopBarComponent=!1,a.RunningBarComponent=!1,a.FeaturedSportsBarComponent=!1,a.MySportifBarComponent=!1,a.componentShow=function(b){switch(b){case"ShopBar":a.ShopBarComponent=!a.ShopBarComponent,a.RunningBarComponent=!1,a.FeaturedSportsBarComponent=!1,a.MySportifBarComponent=!1,console.log("ShopBar lead clicked");break;case"RunningBar":a.RunningBarComponent=!a.RunningBarComponent,a.ShopBarComponent=!1,a.FeaturedSportsBarComponent=!1,a.MySportifBarComponent=!1,console.log("RunningBar lead clicked");break;case"FeaturedSportsBar":a.FeaturedSportsBarComponent=!a.FeaturedSportsBarComponent,a.ShopBarComponent=!1,a.RunningBarComponent=!1,a.MySportifBarComponent=!1,console.log("FeaturedSportsBar lead clicked");break;case"MySportifBar":a.MySportifBarComponent=!a.MySportifBarComponent,a.ShopBarComponent=!1,a.RunningBarComponent=!1,a.FeaturedSportsBarComponent=!1,console.log("MySportifBar lead clicked")}},a.headerSearch=function(b){console.log(b.text.$modelValue),a.search.query=""}}]),angular.module("controllers").controller("HomeCtrl",["$scope","ViewData",function(a,b){b.homeMainData.then(function(b){var c=b.data.values;a.quadrantOneData=c.quadrantOneData,a.quadrantTwoData=c.quadrantTwoData,a.quadrantThreeData=c.quadrantThreeData,a.quadrantFourData=c.quadrantFourData})}]),angular.module("controllers").controller("MainCtrl",["$scope","ProductsFactory","ViewData",function(a,b,c){a.shoesProducts=[],a.clothingProducts=[],a.accessoriesProducts=[],a.fanGearProducts=[],a.mensProducts=[],a.womensProducts=[],a.kidsProducts=[],a.soccerProducts=[],a.basketballProducts=[],a.runningProducts=[],a.martialArtsProducts=[];b.getAll.then(function(b){b.forEach(function(b){switch(b.category){case"Shoes":a.shoesProducts.push(b);break;case"Clothing":a.clothingProducts.push(b);break;case"Accessories":a.accessoriesProducts.push(b);break;case"Fan Gear":a.fanGearProducts.push(b)}switch(b.user){case"men":a.mensProducts.push(b);break;case"women":a.womensProducts.push(b);break;case"children":a.kidsProducts.push(b)}switch(b.activity){case"Basketball":a.basketballProducts.push(b);break;case"Scoocer":a.soccerProducts.push(b);break;case"Running":a.runningProducts.push(b);case"Martial Arts":a.martialArtsProducts.push(b)}})}),c.miscViewData.then(function(b){var c=b.data.values;a.company=c.company.value,a.validEmailErrorMessage=c.emailErrorMessage.value,a.newsLetterSignupMessage=c.newsletterSignupMessage.value,a.signUpButton=c.signupButtonText.value,a.signUpTitle=c.signupTite.value}),c.corporateInfo.then(function(b){var c=b.data;a.corporateInfo=c}),c.customerServices.then(function(b){var c=b.data;a.customerServices=c}),c.popularProducts.then(function(b){var c=b.data;a.popularProducts=c})}]),angular.module("controllers").controller("ShoesCtrl",["$scope","ViewData","SidebarService","ProductsFactory",function(a,b,c,d){var e=(b.shoesMainData.then(function(b){var c=b.data.values;a.sidebarData=c.sidebarData}),[]);a.shoesProducts=[],a.itemsPerPage=localStorage.getItem("itemsPerPage")?localStorage.getItem("itemsPerPage"):9,a.shoes={};d.getAll.then(function(c){c.forEach(function(a){switch(a.category){case"Shoes":e.push(a)}}),e.forEach(function(b){switch(b.available){case!0:a.shoesProducts.push(b)}}),a.totalItems=a.shoesProducts.length,a.shoes.currentPage=localStorage.getItem("shoes.pagination.page")?localStorage.getItem("shoes.pagination.page"):1,a.$watch("shoes.currentPage",function(){localStorage.setItem("shoes.pagination.page",a.shoes.currentPage);var c=[a.shoes.currentPage,a.itemsPerPage,a.shoesProducts];a.shoesProductsShow=b.page(c)})});a.sports=b.sportsCheckboxes,a.sportSelected=function(d,f){a.sports[d].selected=!f,b.processCheckbox(d,f);var g=localStorage.getItem("shoes.sidebar.size.selected");a.shoesProducts=c.shoeFilter(e,a.sports,a.users,g)},a.users=b.usersCheckboxes,a.size={selected:localStorage.getItem("shoes.sidebar.size.selected")?localStorage.getItem("shoes.sidebar.size.selected"):""},a.userSelected=function(c,d){a.users[c].selected=!d,b.processCheckbox(c,d)},a.sizeChange=function(a){localStorage.setItem("shoes.sidebar.size.selected",a)}}]),angular.module("directives").directive("homeSlider",["$document","$q","$rootScope","$timeout","SliderPanelService",function(a,b,c,d,e){return{restrict:"A",link:function(f,g){var h=g.find(".slider_image_container"),i=b.defer(),j=function(){g.css({top:e.panel.top,left:e.panel.left}),g.height(h.outerHeight()),openPanel()},k=c.$on("quickShopImageLoaded",function(){i.resolve(),k()});f.$on("quickShopDataLoaded",function(a,c){d(function(){var a=h.find(".slider_image").attr("src");(""===a||void 0===a)&&i.resolve()},500),b.all([c,i.promise]).then(function(){d(function(){j()})})}),a.keyup(function(a){27==a.keyCode&&closePanel()})}}}]),angular.module("factories").factory("SliderPanelService",[function(){var a={left:0,top:0,width:0,setLeft:function(b){a.left=b},setTop:function(b){a.top=b},setWidth:function(b){a.width=b}};return{panel:a}}]),angular.module("factories").factory("ProductsFactory",["Restangular",function(a){var b="/api",c=a.withConfig(function(a){a.setBaseUrl(b)}),d="products",e=c.all(d).getList();return{getAll:e}}]),angular.module("factories").factory("SidebarService",[function(){return{shoeFilter:function(a,b,c,d){function e(a){f.forEach(function(b){b.activity==a&&f.splice(b,1)})}var f=[],g=[],h={selector:"Running",category:"Sports",val:b.Running.selected},i={selector:"Training",category:"Sports",val:b.Training.selected},j={selector:"Basketball",category:"Sports",val:b.Basketball.selected},k={selector:"Football",category:"Sports",val:b.Football.selected},l={selector:"Martial Arts",category:"Sports Arts",val:b["Martial Arts"].selected},m={selector:"Men",category:"User",val:c.Male.selected},n={selector:"Women",category:"User",val:c.Female.selected},o={selector:"Kids",category:"User",val:c.Kids.selected};return g.push(h),g.push(i),g.push(j),g.push(k),g.push(l),g.push(m),g.push(n),g.push(o),a.forEach(function(a){switch(a.available){case!0:f.push(a)}}),g.forEach(function(a){switch(a.val){case!1:e(a.selector)}}),f}}}]),angular.module("factories").factory("ViewData",["Restangular",function(a){var b="/api",c=a.withConfig(function(a){a.setBaseUrl(b)}),d="viewdata",e="viewdata/header",f="viewdata/homemain",g="viewdata/shoesmain",h="viewdata/miscdata",i="viewdata/corporateinfo",j="viewdata/customerservices",k="viewdata/popularproducts",l=c.all(d).getList(),m=c.one(e).get(),n=c.one(f).get(),o=c.one(g).get(),p=c.one(h).get(),q=c.one(i).get(),r=c.one(j).get(),s=c.one(k).get(),t={Running:{selected:"true"==localStorage.getItem("shoes.sidebar.sport.Running.selected")?!1:!0},Training:{selected:"true"==localStorage.getItem("shoes.sidebar.sport.Training.selected")?!1:!0},Basketball:{selected:"true"==localStorage.getItem("shoes.sidebar.sport.Basketball.selected")?!1:!0},Football:{selected:"true"==localStorage.getItem("shoes.sidebar.sport.Football.selected")?!1:!0},"Martial Arts":{selected:"true"==localStorage.getItem("shoes.sidebar.sport.MartialArts.selected")?!1:!0}},u={Male:{selected:"true"==localStorage.getItem("shoes.sidebar.user.Male.selected")?!1:!0},Female:{selected:"true"==localStorage.getItem("shoes.sidebar.user.Female.selected")?!1:!0},Kids:{selected:"true"==localStorage.getItem("shoes.sidebar.user.Kids.selected")?!1:!0}};return{returnedData:l,headerData:m,homeMainData:n,shoesMainData:o,miscViewData:p,corporateInfo:q,customerServices:r,popularProducts:s,sportsCheckboxes:t,usersCheckboxes:u,newsletterSignup:function(a){console.log("Email: "+a+" received by ViewData newsletterSignup function")},page:function(a){var b=a[0]*a[1]-a[1],c=a[0]*a[1];return a[2].slice(b,c)},processCheckbox:function(a,b){switch(a){case"Running":localStorage.setItem("shoes.sidebar.sport.Running.selected",b);break;case"Training":localStorage.setItem("shoes.sidebar.sport.Training.selected",b);break;case"Basketball":localStorage.setItem("shoes.sidebar.sport.Basketball.selected",b);break;case"Football":localStorage.setItem("shoes.sidebar.sport.Football.selected",b);break;case"Martial Arts":localStorage.setItem("shoes.sidebar.sport.MartialArts.selected",b);break;case"Male":localStorage.setItem("shoes.sidebar.user.Male.selected",b);break;case"Female":localStorage.setItem("shoes.sidebar.user.Female.selected",b);break;case"Kids":localStorage.setItem("shoes.sidebar.user.Kids.selected",b)}}}}]),angular.module("filters").filter("selections",function(){return function(a){return _.isArray(a)?_.pluck(a,"label").join(" / "):a&&a.id||""}}),angular.module("directives").filter("limitToIf",function(){return function(a,b,c){if(c&&a.length>b)for(var d=!1,e=b;e<a.length;e++)if(a[e].active){d=!0;break}return c&&!d?a.slice(0,b):a}}).filter("increment",function(){return function(a,b){return b&&a++,a}});