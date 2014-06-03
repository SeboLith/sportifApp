'use strict';

var htmlClass = 'js';
if (window.Touch !== undefined) htmlClass += ' touch';
if (navigator.appName == 'Microsoft Internet Explorer') {
    htmlClass += ' ie';
    if (!document.addEventListener) {
        htmlClass += ' ie_lt9';
        document.write('<script src="html5shiv.js"><\/script>');
        document.write('<script id="ie8s" src="selectivizr.js"><\/script>');
    }
}
document.documentElement.className = htmlClass;

var globals = {
    sportifSocialTweets: [],
    autocompleteURL: '/search/autocomplete',
    autoplayInterval: 6000,
    ieLt9: (navigator.appName == 'Microsoft Internet Explorer' && !document.addEventListener),
    contextPath: '',
    languageISO: 'en'
};

function debug() {
	$("#content").toggleClass("show_grid");
	return $("#content").hasClass("show_grid");
};

function registerNewsletter() {
	var register;
    if( $('#newsletter').attr('checked')){
    	register=true;
    }
    else {
    	register=false;
    }
    $.ajax({
    	url: 'newsletter',
        data: ({newsletter : register})
    });
}

var Sportif = {

	Common : {

		init : function(){

			/* Visual */
			Sportif.Common.heightMatch('footer nav#tertiary li.level_1');
			Sportif.Common.heightMatch('#address_list_other div.vcard');
			//Sportif.Common.heightMatch('#store_results li.store');
			Sportif.Common.heightMatch('#product_technologies .technology h3');
			Sportif.Common.heightMatch('div.editorial_navigation ul.navigation li div');
			Sportif.Common.widthMatch("div.actions.join");
			Sportif.Common.quote();
			Sportif.Common.languageSelector();

			/* Interactions */
			Sportif.Common.navigationPrimary();
			Sportif.Common.cookie();
			Sportif.Common.searchAutocomplete();
			Sportif.Common.searchResultsTabs();
			Sportif.Common.videoContent('div.item.video');
			Sportif.Common.newsletterSignup();
			Sportif.Common.countrySelector();
			Sportif.Common.login();
			Sportif.Common.heroAnalytics();
			Sportif.Common.highlightsAnalytics();
			Sportif.Common.PDPAnalytics();
			Sportif.Common.navigationAnalytics();
			Sportif.Common.trackOutboundLinks();
			Sportif.Common.eventsPageAnalytics();
			Sportif.Common.athletesPageAnalytics();
			Sportif.Form.init();
			Sportif.IsotopeFiltering.init();
			Sportif.Filtering.init();
			Sportif.StoreFinder.init();
			Sportif.ProductDetail.init();
			Sportif.Checkout.init();
		},

		cookie: function() {
			var cookieBar = $('#cookie-bar');
			var policyMessage = cookieBar.find('p.policy');
			var warningMessage = cookieBar.find('p.warning');

			// Are cookies enabled?
			if(!isCookieEnabled()){
				policyMessage.hide();
				warningMessage.show();
			}else{
				warningMessage.hide();
				if (cookieBar.length > 0) {
					if ($.cookie('policy') == 'false' || $.cookie('policy') == undefined) {
						$.cookie('policy', 'false');
						policyMessage.show();
						cookieBar.find('.cb-enable').click(function(event) {
							event.preventDefault();
							$.cookie("policy", "true", { expires: 365 });
							policyMessage.hide();
						});
					}
				}
			}

			function isCookieEnabled()
			{
			    var cookieEnabled = false;
			    document.cookie="testcookie=1; path=/";
			    cookieEnabled = (document.cookie.indexOf("testcookie") != -1) ? true : false;
			    return (cookieEnabled);
			}
		},

		urlParamsDetect: function(){
			if (!Sportif.Common.urlParams) {
				Sportif.Common.urlParams = {};
				var match,
					pl     = /\+/g, // Regex for replacing addition symbol with a space
					search = /([^&=]+)=?([^&]*)/g,
					decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
					query  = window.location.search.substring(1);
				while (match = search.exec(query))
					Sportif.Common.urlParams[decode(match[1])] = decode(match[2]);
			}
		},

		videoContent: function(elements) {
			var videoPlayer, videoInner, top;
			$(elements).each(function() {
				var item = $(this);
				var links = item.find('a.launch_video');
				var videoURL = links.attr('href');
				var videoHeight = links.attr('data-videoheight');
				if (!videoHeight) videoHeight = 558;
				links.click(function(e) {
					e.preventDefault();
					// GoogleAnalytics for video interaction
					var title = item.find('div.header h3').text();
					globals.googleAnalytics.trackEvent('Video', 'Play', title, null,true);
					if (videoURL) {
						if (!videoPlayer) {
							videoPlayer = $('<div class="video_player"></div>').insertAfter(item);
							videoInner = $('<iframe src="' + videoURL + '" width="940" height="' + videoHeight + '" />').appendTo(videoPlayer);
							$('<a class="button">Close Video</a>').appendTo(videoPlayer).click(function(e) {
								e.preventDefault();
								videoInner.attr("src", "");
								videoPlayer.hide().siblings('.video_active').css({'height': 'auto'}).removeClass('video_active');
							});
						} else {
							videoPlayer.siblings('.video_active').css({'height': 'auto'}).removeClass('video_active');
							videoPlayer.insertAfter(item);
							videoInner.attr('src', videoURL);
						}
						videoPlayer.show().css({'top': item.position().top});
						item.css({'height': parseInt(videoHeight) + 50 + 'px'}).addClass('video_active');
						top = item.offset().top;

						item.siblings('.editorial').each(function(){
							var sibling = $(this)
							if(sibling.offset().top == top){
								sibling.css({'height': item.height() + 'px'}).addClass('video_active');
							}
						});

					}
				});
			});
		},

		navigationPrimary: function() {
			var links = $('#primary li, body:not(.cart) #minicart, #cart #continue_shopping');

			links.bind('click', function(e) {
				Sportif.Nav.panelsAnimation(e, this, links);
			});
		},

		quote: function() {
			$('.quote > p').contents().unwrap();
		},

		languageSelector: function() {
			var action = {
				check: function() {
					if ($(window).height() < $('#languageSelector').height()) {
						$('#languageSelector').css('height', $(window).height()-parseInt($('#languageSelector').css('border-top')));
					}
				},
				show: function(){
					this.check();
					$('#languageSelector').show();
				},
				hide: function(){
					$('#languageSelector').hide();
				}
			}

			$('#website_country').bind('click', function(event) {
				event.stopPropagation()
				action.show();

				$("header, #content, #closeChangeLanguage").not('#languageSelector').one('click', function(event) {
  					action.hide();
				});
			});
		},

		// Old version didn't take into account rows
		heightMatch: function(elements) {
			var e = $(elements);
			var maxHeight = 0;
			e.each(function(e, i) {
				maxHeight = Math.max($(this).height(), maxHeight);
			});
			// Underscore Version (not working)
			// var maxHeight = _.max(_.map(e, function(){
			// 	$(this).height();
			// }));
			e.css('min-height', maxHeight +'px');
		},

		widthMatch: function(elements) {
			var e = $(elements);
			var first = e.first();
			var maxWidth = Math.max(first.find('a').eq(0).width() , first.find('a').eq(1).width());
			e.find('a').css('width', maxWidth);
		},

		refreshScreenReaderBuffer: function() {
			$('#screen_reader_refresh').attr('value', new Date().getTime());
		},

		searchAutocomplete: function() {
			var search = $('#search');
			var searchForm = $('form', search);
			var searchInput = $('#search_query', search);
			var socialLinks = $('#social_links, #tiger_link');
			var searchBoxOrigWidth = searchInput.width();
			var searchBoxTargetWidth = 282;
			var moreButton = $('#autocomplete_more_button', search);

			// New search URLs
			searchForm.submit(function(e){
				e.preventDefault();
				var term = $.trim(searchInput.val().replace(/\//g, ' '));
				window.location.href = searchForm.attr('action') +
					((term.length)
						? '/' + encodeURIComponent(term).replace(/\%20/g, '+')
						: ''
					);
				return term.length > 0; // Force coalesce to boolean for safety.
			});

			searchInput.on('focus', function(){
				socialLinks.fadeOut('fast').not('#tiger_link').css({'position': 'absolute', 'right': 240})
				$(this).animate({width: searchBoxTargetWidth + 'px', borderTopLeftRadius: 0, borderBottomLeftRadius: 0});
				sendAnalytics('Search Initiated');
			}).on('blur', function(){
				$(this).animate({width: searchBoxOrigWidth + 'px', borderTopLeftRadius: 13, borderBottomLeftRadius: 13}, function(){
					socialLinks.removeAttr('style').fadeIn('fast');
				});
			}).autocomplete({
				// appendTo: '#page',
				messages: {
			        noResults: '',
			        results: function() {}
			    },
				source: function( request, response ) {
					$.getJSON( globals.autocompleteURL, {
						term: searchInput.val()
					}, function(data) {
						response(data);
						format(data);
					});
				},
				minLength: 3,
				open: function(event, ui) {
					$(".ui-menu").css({
						"z-index": 10000,
						"position": "absolute",
						"top": searchInput.offset().top + searchInput.outerHeight()
					});
				},
				close: function(event, ui) { $(".ui-menu").css({"z-index": -1}); },
				select: function(event, ui) {
					window.location.href = globals.contextPath + ui.item.url;
				},
				autoFocus: false
			});

			// List of products displayed on search and more button
			$('#ui-id-1').on('click', 'li a', function(e) {
				e.preventDefault();

				var href = $(this).attr('href');

				// submit search form on click of more button and override href
				if($(this).attr('id') == 'more_button') {
					href = undefined;
					$('form[name=search_form]').submit();
				}

				sendAnalytics('Search Completed', searchInput.val(), href);
			});

			function sendAnalytics(action, label, href) {
				globals.googleAnalytics.trackEvent(
					'Internal Site Search',
					action,
					label,
					null,
					null,
					href
				);
			}

			function format(data) {
				var container = $('.ui-menu');
				_.each(data, function(element, index){
					container.find('.ui-menu-item')
						.eq(index).find('a')
						.attr('href', globals.contextPath + element.url)
						.append(template(element));
				})
				container.append(moreButton);

				$('li', container).each(function(index, element){
					$(this).delay(30*index).hide().fadeIn(100);
				});
			}

			function template(item) {
				var temp = '<img src="' + item.imageUrl + '" width="105" height="60"/><h4>' + item.name + '</h4><p>' + item.shortDescription + '</p>';
				return temp;
			}

		},

		login: function() {
			$('#loginForm').each(function(e){
				var form = $(this);
				var email = form.find('#j_username');
				var pwd = form.find('#j_password');
				var error = form.find('.validate.field_error');

				form.find('input[type=submit]').on('click', function(event){
					event.preventDefault();
					form.find('p.field_error').hide();

					if(isValidEmailAddress(email.val())){
						form.submit();
					}else{
						email.closest('li').addClass('field_error');
						error.show();
					}
				});

				// set a cookie to which can be checked later, to determine if user just logged in for analytics purposes
				var date = new Date();
				date.setTime(date.getTime() + 5000);
				$.cookie("login", "attempted", { expires: date, path: '/' });

				function isValidEmailAddress(email){
	            	var emailRegex = /^\S+@\S+\.\S+$/;
    	        	return emailRegex.test(email);
        	    }
			});
		},

		loginAnalytics: function() {
			if($.cookie('login') == 'attempted'){
				$.removeCookie('login', {path: '/'});
				globals.googleAnalytics.trackEvent('Login', 'Submit', 'Returning SPORTIF Customers', 4, true);
			}
		},

		searchResultsTabs: function() {

			// Search page tabs (matching products / matching content)
			$('.search .tab').click(function(e) {

				var $this = $(this);

				globals.googleAnalytics.trackEvent(
					'Tab Interaction',
					$this.data('ga-action'),
					null,
					null,
					null,
					$this.attr('href')
				);

				e.preventDefault();
			});
		},

		newsletterSignup: function() {
			var form = $(".newsletter_signup_form");
			var messageHtml = "<p class='message'></p>";
			var messageElement = "";

			// Unchecked newsletter
			//$('#registerForm').find('input#newsletter').prop("checked", false);

			form.on("submit", function(event){
				var email = $(this).find('input').val();
				event.preventDefault();
				form = $(this);

				$.ajax({
					dataType: "json",
					url: form.attr("action"),
					data: {email: email},
					success: function(data){
						messageElement = getMessage();
						if (data.type == "success"){
							form.find("input, .button").hide();
							messageElement.addClass("success").html("<span class='icon'></span>" + data.text);
							globals.googleAnalytics.trackEvent('Email-Signup', 'Newsletter', null, null, true);
							globals.mixpanel.track('Newsletter subscribed', { email: email });
						} else {
							messageElement.addClass("error").html("<span class='icon'>!</span>" + data.text);
						}
					},
					error: function(){
						messageElement = getMessage();
						messageElement.addClass("error").html("<span class='icon'>!</span>Error");
					}
				});
				function getMessage() {
					var $element = '';
					if (!(form.parent().attr('id') == 'newsletter_signup')) {
						$element = form.find('.message.error').remove().end().find('input[type=submit]').before(messageHtml);
					} else {
						$element = form.find('.message.error').remove().end().find('input[type=submit]').parent().after(messageHtml);
					}
					if (form.find("p").length == 0) $element;
					return form.find("p");
				};
			});
		},

		// Add ga and mixpanel tagging to carousel
		heroAnalytics: function() {

			var $slider = $('.home .hero_slider'),
				$banner = $('.home .hero_banner');

			// Mixpanel we set the selected image title as a super property
			$slider.find('.image_link').on('click', function() {
				globals.mixpanel.register({
					'Search-Currently advertised': $(this).attr('title')
				});
			});

			// Disabled as per ACE-251

			// $slider.find('area, a').on('click', function(e) {
			// 	sendAnalytics('Hero Banner', this.href);
			// });

			// $banner.find('area, a').on('click', function(e) {
			// 	sendAnalytics('Sales Banner', this.href);
			// });

			// function sendAnalytics(type, url) {
			// 	// These would ideally be set to 2 - session level custom var
			// 	// For some reason level 2 custom variables don't appear to persist
			// 	// so as a workaround these are being set as as level 1 - visitor
			// 	// level.
			// 	globals.googleAnalytics.setCustomVar(5, type, url, 1);
			// }


			// Event version, this is broken because the event tracking code is a mess

			// function sendAnalytics(type, url) {
			// 	globals.googleAnalytics.trackEvent('Banner Interaction', type, url, null, true, url);
			// }

		},

		// Add mixpanel tagging to highlights block
		highlightsAnalytics: function() {
			$('.home .editorial_highlights .contents .item.editorial').on('click', function() {
				globals.mixpanel.register({
					'Search-Currently advertised': $(this).find('.header h3').text()
				});
			});
		},

		PDPAnalytics: function() {
			var productPanel = $('#product_lead');
			var productName = productPanel.find('h1[itemprop="name"]').text();

			// tag interaction with the accordion tabs
			$('#product_information .accordion_header', productPanel).click(function(){
				var tabName = $(this).text();
				globals.googleAnalytics.trackEvent('Additional content', tabName, productName, null, true);
			})

			// tag interaction with the find in store link
			$('#product_instore_link a', productPanel).click(function(){
				globals.googleAnalytics.trackEvent('Find item in store', 'click', productName, null, true);
			})
		},

		navigationAnalytics: function() {

			var $this, href, action, label, header = $('header');

			header.find('#secondary a').on('click', function(e) {
				// If href is an external site the link is tracked by outbound link tracking (see below)
				if (e.currentTarget.host === window.location.host) {
					$this = $(this);
					href = $this.attr('href');

					// don't track autocomplete more button
					if($this.attr('id') == 'more_button'){
						return;
					}

					globals.googleAnalytics.trackEvent('Global Navigation', $(this).text(), null, null, true, href);
				}
			});

			header.find('#areas a').on('click', function(e){
				e.preventDefault();
				$this = $(this);
				href = $this.attr('href');

				if(href.indexOf('#') == 0) {
					href = null;
				}

				action = ($this.find('span').length) ? $this.find('span').text() : $this.text();

				globals.googleAnalytics.trackEvent('Global Navigation', action, null, null, true, href);
			});

			header.find('#panels ul.level_3 a').on('click', function(){
				$this = $(this);
				href = $this.attr('href');
				action = $this.closest('div.listing').find('h3').text();
				label = $this.text();

				globals.googleAnalytics.trackEvent('Global Navigation', action, label, null, true, href);
			});

			$('footer #tertiary a').on('click', function(){
				globals.googleAnalytics.trackEvent('Footer Navigation', $(this).text(), null, null, true, href);
			});
		},

		trackOutboundLinks: function() {

			// e.currentTarget.host in IE8 amd IE9 includes port number.
			// Safest option would seem to be to remove it, if present, from
			// both sides of the assignment.
			function stripPortNumber(host) {
				return host.split(':')[0];
			}

			$('a').on('click',function(e){
				var $this = $(this),
		        	href = $this.attr('href'),
		        	target = $this.attr('target');


		        // If the domains names are different, it assumes it is an external link
		        // Be careful with this if you use subdomains
		        if (stripPortNumber(e.currentTarget.host) !== stripPortNumber(window.location.host)) {

		        	// add special cases below, first up is video which has its own logic
		        	// to open in an overlay
		            if ($this.hasClass('launch_video')
		            	|| target === '_blank'
		            	|| target === '_new') {
			            	// preserve url for output but not for linking
			            	var url = href;
			            	href = undefined;
		            } else {
		            	e.preventDefault();
		            }

		            globals.googleAnalytics.trackEvent('External', url, null, 1, true, href);
		        }
		    });
		},

		eventsPageAnalytics: function() {

			// If we're on the events page, register a super property containing event name.
			// Although the property name is race, it will register any event as there is no
			// way of distinguishing it is a race.
			if ($('body.event').length) {
				globals.mixpanel.register({
					'Search-Race name': $('#event_details > .item:first-child h2').text()
				});
			}
		},

		athletesPageAnalytics: function() {

			// For most markets teams and athletes appear on the same page so we track 'em
			// both, even if the super property name is a bit misleading.
			if ($('body.athlete').length) {
				sendAnalytics($('#athlete_details > .item:first-child h1 span').text());
			} else if ($('body.team').length) {
				sendAnalytics($('#team_details > .item:first-child h2').text());
			}

			function sendAnalytics(title) {
				globals.mixpanel.register({
					'Search-Athlete name': title
				});
			}
		},

		countrySelector: function() {
			var countrySelect = $('#country_select');

			countrySelect.find('#website_country').on('click', function() {
				var list = $(this).siblings('ol').show();
				list.on('mouseleave', function() {
					$(this).hide();
				});
			});

			// track selected country with Google Analytics
			countrySelect.find('#languageSelector a').on('click', function(e){
				e.preventDefault();
				var href = $(this).attr('href');
				globals.googleAnalytics.trackEvent('Change Country', 'Select', $(this).text(), null, true, href);
			});
		}
	},

	Nav: {
		splitArray: [],
		animateScrollTop: function(e) {
			var scrollTo = 0;
			var $viewport = $('html, body');
			var preventDefaultAction = function(e) {e.preventDefault()};

			if (e) scrollTo = $('#top').outerHeight();

			$viewport
				.bind('mousewheel scroll mousedown',preventDefaultAction) //disable manual scroll while automated scroll happening
				.animate({scrollTop:scrollTo}, 400, function() {
					$('#minicart').not('.quick').click();
					$(this).unbind('mousewheel scroll mousedown',preventDefaultAction); //enable manual scroll when automated scroll finished
				});
		},
		updateCartHeight: function() {
			if ($('#panels > div:visible').length > 0) {
	            setTimeout(function(){
	                $('#panels').stop().animate({'height':$('#cart_panel').outerHeight()}, 500);
	            }, 50);
	        }
		},
		panelsAnimation: function(e, that, links) {
			var panels = $('div#panels'),
				panel = 0,
				speed = 250,
				fadeSpeed = speed,
				animationSpeed = speed*2,
				li = $(that),
				a = li.find('a'),
				panel = li.parent().children('.active').index(li)+1,
				$element = $('#panels > div:nth-child('+panel+')');

				if (panels.queue().length < 1) {
					if (e.currentTarget.id == "minicart") {
						$element = $('#cart_panel');
						$('#lead').toggleClass('cart_panel_open').find('#minicart').toggleClass('quick');
					} else if ($(a).is('#cartCouponLink')) {
						$('#lead').addClass('cart_panel_open');
	 	 			} else if (e.currentTarget.id == "continue_shopping") {
	 	 				e.preventDefault();
	 	 				$('#minicart').click();
					} else {
						$('#lead').removeClass('cart_panel_open').find('#minicart').removeClass('quick');
					}

	  				if (a.hasClass('panel_link')) {
	  					e.preventDefault();
	  					a.toggleClass('panel_active active');
	  					if (a.hasClass('panel_active')) {
	  						if (links.find('a.panel_active').length > 1) {
	  							// setup for read element width
	  							if (!$element.hasClass('split')) {
	  								$element.css({
	  									position: "absolute",
	  									visibility: "hidden",
	  									display: "block"
	  								});
	  							}

	  							$('#panels > div:visible').fadeOut(fadeSpeed, function() {
	  								$element.removeAttr('style').fadeIn(fadeSpeed);
	  							});
	  						} else {
	  							$element.fadeIn(fadeSpeed);
	  						}

	  						if (!$element.hasClass('split')) {
	  							this.splitColumn($element);
	  							$element.addClass('split');
	  							this.setMinSize($element);
	  						}

	  						links.find('a').not(a).removeClass('panel_active active');
	  						panels.animate({'height': $element.outerHeight()},animationSpeed);
	  					} else {
	  						panels.animate({'height': 0},animationSpeed).find('> div').fadeOut(fadeSpeed);
	  					}
	  				} else {
	  					if ($(a).is('#cartCouponLink')) {
	  						e.preventDefault();
	  					}
	  				}
	  			}
		},
		splitColumn: function(component) {
			var dataJsSplit = $(component).find('.listing ul').attr('data-js-split');
			var wrapper = '<ul class="level_3"></ul>';

			if(dataJsSplit !== undefined){
				this.splitArray = dataJsSplit.split(',');
			}

			var $navigationGroup = $(component).find('.navigation_group');
			var $listingsContainer = $navigationGroup.find('.listing');
			var numberOfContainers = $listingsContainer.length;

			if (this.splitArray.length === numberOfContainers) {
				for (var i = 0; i < numberOfContainers; i++) {

					if (parseInt(this.splitArray[i]) !== 0) {
						var $list = $listingsContainer.eq(i).find('ul li');
						var size = $list.length;

						for (var j = 0; j < size; j++) {
							if ((j % this.splitArray[i]) === 0) {
								if (j === 0) {
									$list.unwrap();
								};
								$listingsContainer.eq(i).find('li').slice(j, (j + parseInt(this.splitArray[i]))).wrapAll(wrapper);
							};
						};
					};
				};
			};
			this.splitArray = [];
		},
		setMinSize: function(component) {
			var $element = $(component).find('.navigation_group').find('.listing'),
			minHeight = 0,
			minWidth = 0;

			for (var i = 0; i < $element.length; i++) {
				if (minHeight <= $element.eq(i).outerHeight()) {
					minHeight = $element.eq(i).outerHeight();
				};

				if (parseInt($element.eq(i).css('min-width')) < 140) {
					minWidth = 140;
				} else {
					minWidth = parseInt($element.eq(i).css('min-width'));
				};

				$element.eq(i).css({'min-width': (minWidth*($element.eq(i).children().length-1))});
			};

			$element.css({'min-height': minHeight});
			this.setMargin(component);
		},
		setMargin: function(component) {
			var $element = $(component).find('.navigation_group:visible').find('.listing'),
			length = ($element.find('.featured').length == 0 ? $element.find('ul.level_3').length : $element.find('ul.level_3').length-1);

			if ($element.length%length !== 0) {
				var number = 0;
				for (var j = 0; j < $element.length+1; j++) {
					if (number <= $('.navigation_group:visible').width()) {
						for (var i = 0; i < $element.eq(j).find('ul.level_3').length; i++) {
							number+=$('.listing').find('ul li').width()+20;
						}
					} else {
						$element.eq(j-1).css({'margin-right': 0, 'border-right': 'none'});
					}
				}
			}
		}
	},

	Form: {

		init: function(){
			Sportif.Form.dropdowns.enableAll();
			Sportif.Form.focusField();
			Sportif.Form.submitLink();
			Sportif.Form.updateSecurityIcon();
		},

		dropdowns: {
			enableDropdown: function(select) {
				function updateDropdown(select, init) {
					var label = select.find('option:selected').text()
					if (!init) {
				 		var model = select.attr('data-model');
				 		if (model && model.length) { select = $('select[data-model="' + model + '"]'); }
					}
			 		select.siblings('.select_ui').find('span.label').text(label);
				};
				select.css('opacity', 0);
				updateDropdown(select, true);
				select.on('change', function() {
			 		updateDropdown(select);
			 	});
			},
			enableAll: function() {
				$('select').not('.facet, [data-select]').each(function(i, e) {
					Sportif.Form.dropdowns.enableDropdown($(this));
				});
			}
		},

		focusField: function(){
			$('input.text, input:checkbox, input:radio, select').focus( function() {
				$(this).addClass('focus').closest('li').addClass('focus');
			}).blur( function() {
				$(this).removeClass('focus').closest('li').removeClass('focus');
			});
		},

		submitLink: function(){
			$('a.submit_link', 'form').click(function(e) {
				e.preventDefault();
				$(this).closest('form').submit();
			});
		},

		updateSecurityIcon: function() {
			var amex = '.amex';
			$('select[name=cardTypeCode]').on('change', function(event){
				var item = $(this).find('option:selected');
				if(item.val() == 'amex') {
					$('dl.card_cvv' + amex).css({display:'inline-block'});
					$('dl.card_cvv').not(amex).hide();
				}else{
					$('dl.card_cvv' + amex).hide();
					$('dl.card_cvv').not(amex).css({display:'inline-block'});
				}
			})
		}

	},

	ProductDetail: {

		init: function() {
			Sportif.ProductDetail.zoom();
		},

		zoom: function() {
			var zoomLink = $('#zoom_link');
			if (zoomLink.length) {
			var zoomLinkSpans = zoomLink.children('span');
			var zoomViewer;
			var primaryImages = $('#product_image_list > li.primary');
			zoomLink.on('click', function(e) {
				e.preventDefault();
				if (primaryImages.length == 1) {
					zoomViewer = $('<li class="primary zoom"><img src="'+ zoomLink.attr('href') + '" alt=""></li>')
						.insertBefore('li.primary').css({'height': primaryImages.height()});
					zoomViewer.children('img').load(function() {
						zoomViewer.viewport().viewport('content').draggable({containment: 'parent'});
					});
					primaryImages = primaryImages.add(zoomViewer);
				}
				primaryImages.add(zoomLinkSpans).toggleClass('active');
			});
		}
		}

	},

	Checkout: {

		init : function() {
			Sportif.Checkout.deliveryMethods();
            Sportif.Checkout.ajpPaymentMethods();
			Sportif.Checkout.billingAddress();
            Sportif.Checkout.aopPaymentDetails();
		},

		deliveryMethods : function() {
			$('input[name="delivery_method"]','#selectDeliveryMethodForm').change(function(){
				$(this).closest('li').addClass('selected').siblings().removeClass('selected');
				// Update cart
			});
		},

        ajpPaymentMethods : function() {
            $('input[name="paymentType"]','#selectPaymentMethodForm').change(function(){
                $(this).closest('li').addClass('selected').siblings().removeClass('selected');
                // Update cart
            });
        },

		billingAddress : function() {
            $('#checkout_billing_details_add').each(function() {
				var form = $(this);
				var toggle = form.find('#useShippingAddress');
				var area = form.find('.billing_address_field');

                // To provide extra behaviour
                var afterRefreshAddressForm = function(){};
                var extraRefreshAddressForm = function(){};

				// is this AOP? if not use default
				if(typeof(Sportif.AOP) !== "undefined" && typeof(Sportif.AOP.storeDeliveryAddress) === "function") {
					Sportif.AOP.storeDeliveryAddress();
				}else{
					area.find(':input').each(function() {
						var input = $(this);
						input.attr('data-value', input.val());
					});
				}
                // is this AAC
                if(typeof(Sportif.AAC) !== "undefined") {
                    var country = form.find('.select.address-country');
                    var state = area.filter('.select.address-state');
                    afterRefreshAddressForm = function(){
                        var currentCountrySelection = area.filter('.select.address-country').find('select option:selected').text();
                        if (currentCountrySelection !== "United States") {
                            state.addClass('disabled').find(':input').attr('disabled', 'disabled').each(function() {
                                var input = $(this);
                                input.val(null);
                            });
                            var stateSelect = area.filter('.select.address-state');
                            stateSelect.find('span.label').text('');
                        } else {
                            state.removeClass('disabled').find(':input').removeAttr('disabled');
                            var stateSelect = area.filter('.select.address-state');
                            stateSelect.find('span.label').text(stateSelect.find('select option:selected').text());
                        }
                    };
                    country.change(function() {
                        afterRefreshAddressForm();
                    });
                    extraRefreshAddressForm = function(){
                        var countrySelect = area.filter('.select.address-country');
                        countrySelect.find('span.label').text(countrySelect.find('select option:selected').text());
                    }
                }

				function refreshAddressForm() {
					if (toggle.attr('checked')) {
						area.addClass('disabled').find(':input').attr('disabled', 'disabled').each(function() {
							var input = $(this);
							input.val(input.attr('data-value'));
						});
						var state = area.filter('.select.address-state');
						state.find('span.label').text(state.find('select option:selected').text());
                        extraRefreshAddressForm();
					} else {
						area.removeClass('disabled').find(':input').removeAttr('disabled').each(function() {
                            var input = $(this);
                            input.val('');
                        });
                        document.getElementById("address.state").options[0].selected = true;
                        var state = area.filter('.select');
                        state.each(function() {
                        	var $this = $(this);
                        	$this.find('span.label').text($this.find('select option:selected').text());
                        });
					}
				}

				toggle.change(function() {
					refreshAddressForm();
				});

				refreshAddressForm();
			});
		},

        aopPaymentDetails : function() {
            var form = $("#checkout_billing_details_add form");
            form.submit( function()  {
                form.find('input:disabled, select:disabled').each(function() {
                    var field = $(this);
                    $('<input />').attr('type', 'hidden').attr('name', field.attr('name')).attr('value', field.val()).appendTo(form);
                }) ;
                return true;
            });
        }
	},

	StoreFinder: {

		init: function() {
			var storeFinderForm = $('#storeFinderForm');
			storeFinderForm.find('input.text').on("focus", function(){
				storeFinderForm.find('select').val('').change();
			});
		}

	},

	IsotopeFiltering: {

		init: function() {
			var container = $('body.athletes #athletes');
			var isotopeContainer = container.find('.isotope-container');
			var viewContainer = container.find('.item.view');
			var resultsCount = viewContainer.find('h5 span.count');
			var singularTitle = viewContainer.find('h5 span.singular');
			var pluralTitle = viewContainer.find('h5 span.plural');
			var sortRadioButtons = viewContainer.find('form.sort_name input:radio');

			isotopeContainer.isotope({
				layoutMode : 'fitRows',
				itemSelector: '.isotope-item',
				getSortData : {
					firstName: function($element) {
						return $element.attr('data-firstName');
					},
					lastName: function($element) {
						return $element.attr('data-lastName');
					}
				}
			});

			$('body.athletes input:radio').on('click', function(event) {
				var item = $(this);
				var id = item.attr('id');
				var allItemsId = 'allSports';
				var options;

				if (item.attr('name') == 'sort') {
					options = { sortBy: id };
				} else {
					if (id == allItemsId){
						options = { filter:  '' };
					} else {
						options = { filter:  '.' + id };
					}
				}

				isotopeContainer.isotope(options, function(items) {
					var len = items.length;
					if (len == 1) {
						sortRadioButtons.attr('disabled', true);
						singularTitle.show();
						pluralTitle.hide();
					} else {
						sortRadioButtons.attr('disabled', false);
						singularTitle.hide();
						pluralTitle.show();
					}
					resultsCount.text(items.length);
			});
			});
		}

	},

	Filtering: {

		init: function() {
			var container = $('body.events #sport_events');
			var resultsContainer = container.find('.item.view h5');
			var resultsCount = resultsContainer.find('span.count');
			var singularTitle = resultsContainer.find('span.singular');
			var pluralTitle = resultsContainer.find('span.plural');

			var allEvents = container.find('.event');
			var upcomingTitle = container.find('.events h2');
			var pastTitle = container.find('.past_events h2');
			var showMore = container.find('#showMoreEvents');
			var allItemsId = 'allSports';
			var upcomingEventsPagination = 12;
			var pastEventsMax = 6;
			var filterType = allItemsId;
			var eventsCount = upcomingEventsPagination;

			showEvents(filterType);

			container.find('input:radio').each(function(index, element){
				$(this).on('click', function(event){
					showEvents(event.currentTarget.id);
				});
			});

			showMore.on('click', function(event){
				event.preventDefault();
				eventsCount += upcomingEventsPagination;
				showEvents(filterType);
			});

			function showEvents(type) {
				// hide all events first
				allEvents.hide();

				var events = (type == allItemsId) ? allEvents : allEvents.filter('.' + type);

				// cap past events
				var past = events.filter('.past_event').slice(0, pastEventsMax).show();
				var pastLength = past.length;

				// cap upcoming events based on filter and pagination
				var upcoming = events.filter('.upcoming_event');
				var upcomingLength = upcoming.length;
				upcoming.slice(0, eventsCount).show();

				// handle count and results label
				var len = upcomingLength + pastLength;
				resultsCount.text(len);
				if (len == 1) {
					singularTitle.show();
					pluralTitle.hide();
				} else {
					singularTitle.hide();
					pluralTitle.show();
				}

				// handle upcoming and past titles
				(upcomingLength > 0) ? upcomingTitle.show() : upcomingTitle.hide();
				(past.length > 0) ? pastTitle.show() : pastTitle.hide();

				// handle showMore button
				if (eventsCount >= upcomingLength) {
					showMore.css({visibility: 'hidden'});
				} else {
					showMore.css({visibility: 'visible'});
				}
			}
		}
	}
}

/* Init */
$(function() {
	Sportif.Common.init();
});

/* Undersocre Mixins */

_.mixin({

  // Get/set the value of a nested property
  deep: function (obj, key, value) {

    var keys = key.replace(/\[(["']?)([^\1]+?)\1?\]/g, '.$2').replace(/^\./, '').split('.'),
        root,
        i = 0,
        n = keys.length;

    // Set deep value
    if (arguments.length > 2) {

      root = obj;
      n--;

      while (i < n) {
        key = keys[i++];
        obj = obj[key] = _.isObject(obj[key]) ? obj[key] : {};
      }

      obj[keys[i]] = value;

      value = root;

    // Get deep value
    } else {
      while ((obj = obj[keys[i++]]) != null && i < n) {};
      value = i < n ? void 0 : obj;
    }

    return value;
  }

});

_.mixin({
  pluckDeep: function (obj, key) {
    return _.map(obj, function (value) { return _.deep(value, key); });
  }
});
