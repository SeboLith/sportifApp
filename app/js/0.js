'use strict';

/* App Module */
angular.module('SportifStore', [
    'ngSanitize',
    'ui.router',
    'ui.bootstrap',
    'restangular',
    'directives',
    'controllers',
    'factories'
]);

angular.module('controllers', []);
angular.module('directives', []);
angular.module('factories', []);
angular.module('filters', []);

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
	asicsSocialTweets: [],
	autocompleteURL: '/search/autocomplete',
	contextPath: '',
	languageISO: 'en',
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

'use strict';

/* Application Configuration Settings */
var app = angular.module('SportifStore');

// Enable HTML5 Mode.
app.config(['$locationProvider', function ($locationProvider) {
  $locationProvider.html5Mode(true);
}]);

// configure the application using ui.router.
app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('home', {
      url: '/',
      views: {
        '': {
          templateUrl: 'views/partials/home.html'
        },
        'header@home': {
          templateUrl: 'views/partials/header/header.html',
          controller: 'HeaderCtrl'
        },
        'homeMain@home': {
          templateUrl: 'views/partials/home_main/homeMain.html',
          controller: 'HomeCtrl'
        },
        'footer@home': {
          templateUrl: 'views/partials/footer/footer.html',
          controller: 'FooterCtrl'
        }
      }
    })
    .state('shoes', {
      url: '/shoes',
      views: {
        '': {
          templateUrl: 'views/partials/shoes.html'
        },
        'header@shoes': {
          templateUrl: 'views/partials/header/header.html',
          controller: 'HeaderCtrl'
        },
        'shoesMain@shoes': {
          templateUrl: 'views/partials/shoes_main/shoesMain.html',
          controller: 'ShoesCtrl'
        },
        'footer@shoes': {
          templateUrl: 'views/partials/footer/footer.html',
          controller: 'FooterCtrl'
        }
      }
    })
    .state('clothing', {
      url: '/clothing',
      views: {
        '': {
          templateUrl: 'views/partials/clothing.html'
        },
        'header@clothing': {
          templateUrl: 'views/partials/header/header.html',
          controller: 'HeaderCtrl'
        },
        'clothingMain@clothing': {
          templateUrl: 'views/partials/clothing_main/clothingMain.html',
          controller: 'ClothingCtrl'
        },
        'footer@clothing': {
          templateUrl: 'views/partials/footer/footer.html',
          controller: 'FooterCtrl'
        }
      }
    });
}]);

'use strict';

/* Controllers */
angular.module('controllers')
    /*
        CLOTHING CONTROLLER
    ----------------------------------------------------------------------------
    ============================================================================ */
    .controller('ClothingCtrl', ['$scope', "$injector", function ($scope, $injector){

        var ClothingSidebarService = $injector.get("ClothingSidebarService"),
            ViewData               = $injector.get("ViewData"),
            ProductsFactory        = $injector.get("ProductsFactory");

        if (!$scope.clothing) {

            var returnedViewData = ViewData.clothingMainData.then(function(clothingMainData){

                var promise = clothingMainData.data.values;

                $scope.sidebarData = promise.sidebarData;
            });

            // temp array to hold all clothing
            var tempClothing = [];

            // scope array to hold available clothing
            $scope.clothingProducts = localStorage.getItem('clothing.clothingProducts') ? JSON.parse(localStorage.getItem('clothing.clothingProducts')) : [];

            // set the number of items per page
            $scope.itemsPerPage = localStorage.getItem("itemsPerPage") ? localStorage.getItem("itemsPerPage") : 18;

            $scope.clothing = {};

            var returnedProducts = ProductsFactory.getAll.then(function(data){
                // filter products and assign all clothing to tempClothing
                data.forEach( function (product) {
                    switch (product.category) {
                        case "Clothing":
                            tempClothing.push(product);
                            break;
                    }
                });

                // filter clothing and assign available clothing to $scope.clothingProducts
                tempClothing.forEach( function (item) {
                    switch (item.available) {
                        case true:
                            $scope.clothingProducts.push(item);
                            break;
                    }
                });

                // assign the number of members to a variable for pagination purposes
                $scope.totalItems = $scope.clothingProducts.length;

                // get the current page using local storage; if none exists, set it to 1
                $scope.clothing.currentPage = localStorage.getItem("clothing.pagination.page") ? localStorage.getItem("clothing.pagination.page") : 1;
            });
        }

        // watch for the change in current page to update the members per page
        $scope.$watch("clothing.currentPage", function() {
            // set the current page using local storage
            localStorage.setItem("clothing.pagination.page", $scope.clothing.currentPage);

            // set the size select value to false to show all sizes
            localStorage.setItem('clothing.sidebar.size.selected', false);

            updatePage();

        });

        /* default selected values for sports checkboxes */
        $scope.sports = ClothingSidebarService.sportsCheckboxes;

        $scope.sportSelected = function(checkbox, currentValue) {

            // change the selected value of "this" checkbox
            // from the current value to its opposite
            $scope.sports[checkbox].selected = !currentValue;

            // store the checkbox's value in localstorage
            ClothingSidebarService.processCheckbox(checkbox, currentValue);

            updatePage();
        };

        /* default selected values for users checkboxes */
        $scope.users = ClothingSidebarService.usersCheckboxes;

        $scope.userSelected = function(checkbox, currentValue) {

            // change the selected value of "this" checkbox
            // from the current value to its opposite
            $scope.users[checkbox].selected = !currentValue;

            // store the checkbox's value in localstorage
            ClothingSidebarService.processCheckbox(checkbox, currentValue);

            updatePage();
        };

        $scope.size = {selected: localStorage.getItem('clothing.sidebar.size.selected') ? localStorage.getItem('clothing.sidebar.size.selected').replace(/(^\s+|\s+$)/g,'' /*remove blank spaces from size value*/) : false};

        $scope.sizeChange = function(selectedSize) {

            localStorage.setItem('clothing.sidebar.size.selected', selectedSize);

            updatePage();
        };

        $scope.sizeReset = function() {

            // set the size select value to false to show all sizes
            localStorage.setItem('clothing.sidebar.size.selected', false);

            // set the value to false to show the select a size option
            $scope.size.selected = false;

            updatePage();
        };

        function updatePage () {

            // get the selected size by which to filter available clothing
            var selectedSize = localStorage.getItem('clothing.sidebar.size.selected');

            /*  Filter available clothing based on user's selections */
            var clothingProducts = ClothingSidebarService.clothingFilter(tempClothing, $scope.sports, $scope.users, selectedSize);

            localStorage.setItem('clothing.clothingProducts', JSON.stringify(clothingProducts.availableClothing));

            // quantities to show next to selector values
            $scope.quantities = clothingProducts.quantities;

            // all available clothing to display on all pages
            $scope.clothingProducts = JSON.parse(localStorage.getItem('clothing.clothingProducts'));

            // data array to be passed into the ViewData.page() function
            var data = [$scope.clothing.currentPage, $scope.itemsPerPage, $scope.clothingProducts];

            // set the members segment array for the current page
            var clothingProductsShow = ViewData.page(data);

            localStorage.setItem('clothing.clothingProductsShow', JSON.stringify(clothingProductsShow));

            $scope.clothingProductsShow = JSON.parse(localStorage.getItem('clothing.clothingProductsShow'));

            // assign the number of members to a variable for pagination purposes
            $scope.totalItems = $scope.clothingProducts.length;
        };
    }]);

// 'use strict';

// /* Controllers */
// angular.module('controllers')
// 	// Define the Returns controller
// 	.controller('ReturnsCtrl', ['$scope', '$http', 'returnData', function ($scope, $http, returnData) {

// 	    $scope.returnForm = returnData;
// 	    $scope.errors = false;

// 	    $scope.validateCurrentStep = function() {
// 	        var isDataValid = false;
// 	        switch ($scope.currentStep) {
// 	            case 1:
// 	                isDataValid = _.some($scope.returnForm.items, function(item) {
// 	                    return item.quantity > 0;
// 	                });
// 	                break;
// 	            case 2:
// 	                isDataValid = _.every($scope.returnForm.items, function(item) {
// 	                    if (item.quantity > 0)
// 	                        return (item.reason && item.reason != 'null');
// 	                    else return true;
// 	                });
// 	                break;
// 	        }
// 	        if ($scope.moveStepAttempt) {
// 	            if (isDataValid) $scope.errors = false;
// 	            else $scope.errors = true;
// 	        }
// 	        return isDataValid;
// 	    }

//         $scope.test = function() {
//            $scope.returnForm.orderAddress=false;
//         }

// 	    $scope.nextStep = function() {
// 	        $scope.moveStepAttempt = true;
// 	        var isDataValid = $scope.validateCurrentStep();
// 	        if (isDataValid) {
// 	            $scope.currentStep++;
// 	            $scope.moveStepAttempt = false;
// 	        }
// 	    }

// 	}])
// 	// Define the main ShoeFinder controller
// 	.controller('ShoeFinderCtrl', ['$scope', '$rootScope', '$location', '$localStorage', 'ProductListService', function ($scope, $rootScope, $location, $localStorage, ProductListService) {

// 		// Define the views which make up the application
// 		// Ultimately this could be written to containing page from JSP template
// 		$scope.views = [
// 			{ id: 'splash', url: 'splash', menu: false, data: false },
// 			{ id: 'surface', url: 'surface', menu: true, label: 'Surface', type: 'check', data: false },
// 			{ id: 'gender', url: 'gender', menu: true, label: 'Gender', type: 'radio', data: false },
// 			{ id: 'experience', url: 'experience', menu: true, label: 'Experience', type: 'radio', data: true },
// 			{ id: 'pro', url: 'pronation', menu: true, label: 'Pronation', type: 'radio', data: true },
// 			{ id: 'results', url: 'results', menu: false, data: true }
// 		];

// 		// We'll persist filter data to local storage
// 		$scope.$storage = $localStorage.$default({
// 			filters: {
// 				surface: [],
// 				gender: null,
// 				bmi: null,
// 				type: null,
// 				experience: null,
// 				pro: null
// 			}
// 		});

// 		$scope.location = $location;
// 		$scope.productListService = ProductListService;
// 		$scope.error = false;

// 		if ($scope.location.path() === '') {
// 			$scope.location.path('/');
// 		}

// 		var nextView; // If data is loading we need to store incoming view until it completes

// 		function resetFrom(index) {
// 			// Loop over views including and after the index and reset user filter data
// 			_.each(_.rest($scope.views, index), function(val/*, key */) {
// 				$scope.$storage.filters[val.id] = (val.type === 'check') ? [] : null;
// 			});
// 		}

// 		// Update URL according to supplied id
// 		function setLocation(id) {
// 			$location.path('/' + id);
// 		}

// 		// Call the product list service with the currently
// 		// selected filters and sort options
// 		function getData() {
// 			$scope.productListService.getProducts(
// 				$scope.$storage.filters,
// 				$scope.$storage.sort
// 			);
// 		}

// 		// Converts current path to valid and active view, defaults to splash if path is invalid
// 		function setCurrentView(id) {

// 			// Get the view which relates to the supplied id if it's valid.
// 			// If view is not valid, default to first view in the view list
// 			nextView = _.where($scope.views, { id: id })[0] || $scope.views[0];

// 			// Reset filters from this point forwards
// 			resetFrom(_.indexOf($scope.views, nextView));

// 			// Load product data if required for this particular view.
// 			// If no data is to be loaded for this view, we simply advance
// 			if (nextView.data) {
// 				getData();
// 			} else {
// 				$scope.currentView = nextView;
// 			}
// 		}

// 		// Returns the index of the current view
// 		function getCurrentIndex() {
// 			return _.indexOf($scope.views, _.where($scope.views,
// 				{ id: $scope.currentView.id })[0]);
// 		}

// 		function isResultsView() {
// 			return getCurrentIndex() === $scope.views.length - 1;
// 		}

// 		// Implement our own routing using the location service
// 		function handlePathChange(path) {
// 			// console.log('Current path:', path);
// 			setCurrentView(path.replace('/', ''));
// 		}

// 		function handleProductsLoading(/*event*/) {
// 			$scope.loading = true;
// 		}

// 		function handleProductsLoaded(event, result) {

// 			$scope.loading = false;
// 			$scope.products = result.products;
// 			$scope.resultCount = result.resultCount;

// 			// Only move to the next view if we have results,
// 			// otherwise show an error.
// 			if ($scope.products.length) {
// 				$scope.currentView = nextView;
// 			} else {
// 				$scope.error = true;
// 			}
// 		}

// 		// Handles analytics required on view changes
// 		function handleViewAnalytics(newValue, oldValue) {

// 			if (newValue && newValue !== oldValue) {

// 				var index = getCurrentIndex();

// 				// Splash screen is not included in analytics
// 				if (index === 0) { return; }

// 				// The filter data we need was set on the previous view
// 				var previousView = $scope.views[index - 1],
// 					filter = $scope.$storage.filters[previousView.id];

// 				trackPageview('virtual/shoefinder/' + $scope.currentView.url + '/step' + index);

// 				// Send filters set on previous step
// 				if (filter) {
// 					var selections = _.isArray(filter) ? _.pluck(filter, 'id').join(',') : filter.id;
// 					trackEvent(previousView.url, selections);
// 				}

// 				// Only happens on results view
// 				if (isResultsView()) {
// 					// Concatenate names of first 15 products returned
// 					var products = _.pluck($scope.products, 'name').splice(0, 15).join(',');
// 					var experience = $scope.$storage.filters.experience.id;

// 					setCustomVar(3, 'Running Experience Level', experience, 1);
// 					trackEvent('Shoes Loaded', products);
// 				}
// 			}
// 		}

// 		// Helper methods for google analytics - not entirely necessary, but useful in dev
// 		// as sportifAnalytics object was not available in this branch.
// 		function trackPageview(pageURL) {
// 			globals.googleAnalytics.trackPageview(pageURL);
// 			// console.log('shoe-finder trackPageView:', pageURL);
// 		}

// 		function trackEvent(action, label, value, noninteraction, url) {
// 			globals.googleAnalytics.trackEvent('Shoe Finder', action, label, value, noninteraction, url);
// 			// console.log('shoe-finder trackEvent:', 'Shoe Finder', action, label, value, noninteraction);
// 		}

// 		function setCustomVar(slot, name, value, scope) {
// 			globals.googleAnalytics.setCustomVar(slot, name, value, scope);
// 			// console.log('shoe-finder setCustomVar:', slot, name, value, scope);
// 		}

// 		// Set up listeners and watches.
// 		$scope.$on('productList.loading', handleProductsLoading);
// 		$scope.$on('productList.loaded', handleProductsLoaded);

// 		$scope.$watch('location.path()', handlePathChange);
// 		$scope.$watch('currentView', handleViewAnalytics);

// 		// Advances to the next view
// 		$scope.next = function() {

// 			// Get the index of the current view
// 			var index = getCurrentIndex();
// 			var view;

// 			// Reset the index if we're currently on the final view
// 			if (index === $scope.views.length - 1) {
// 				index = -1;
// 				$scope.products = [];
// 				$rootScope.$broadcast('productListData.reset');
// 			}

// 			// Resolve the next view
// 			view = $scope.views[++ index];

// 			// Now update the URL
// 			setLocation(view.id);
// 		};

// 		// Closes the error message and returns to previous view (ie. current index)
// 		$scope.closeErrorMessage = function() {

// 			// Get the index of the current view
// 			var index = _.indexOf($scope.views, _.where($scope.views,
// 				{ id: $scope.currentView.id })[0]);

// 			$scope.error = false;

// 			// Only URL has updated, not view index - set location to url of current index
// 			setLocation($scope.views[index].id);
// 		};

// 		// returns true if element of supplied group and property is selected
// 		$scope.isSelected = function(group, prop) {
// 			return _.where($scope.$storage.filters[group], { id: prop }).length;
// 		};
// 	}])
// 	.controller('ProductSelector', ['$rootScope', '$scope', '$http', '$window', 'ProductService', 'QuickBuyService', 'CartService', function ($rootScope, $scope, $http, $window, ProductService, QuickBuyService, CartService) {

// 		$scope.addingInProgress = false;
// 		// Sizing Processing

// 		Sportif.Common.urlParamsDetect();

// 		var model = {
// 			addAttempted: false,
// 			code: null,
// 			colours: null,
// 			data: {},
// 			query: window.location.search,
// 			selection: [],
// 			variants: null
// 		};

// 		var success = function(data) {
// 			// collect for use in dropdown selectors default settings
// 			$scope.defaultOneSizeCode = data.defaultOneSizeCode;

// 			if (data.primaryColourOption.sizeOptions[0].variantOptionQualifiers[0].qualifier == 'shoeWidthCode') {
// 				_.each(data.primaryColourOption.sizeOptions, function(size, s) {
// 					size.variantOptionQualifiers.reverse();
// 				});
// 			}
// 			model.data = data;
// 			model.variants = createVariantTrees(data.primaryColourOption.sizeOptions);
// 			model.selection = createSelection(data.primaryColourOption.sizeOptions[0].variantOptionQualifiers);
// 			preSetSelection(data.defaultOneSizeCode);

// 			// if Selectivizr being used (ie8), refresh the DOM
// 			if(typeof Selectivizr == 'object'){
// 				setTimeout(function(){
// 					Selectivizr.init();
// 				}, 100);
// 			}
// 		};

// 		var getOptionIndex = function(array, value) {
// 			var i = -1;
// 			_.each(array, function(option, o) { if (option.value == value) i = o; });
// 			return i;
// 		};

// 		var createVariantTrees = function(sizeOptions) {

// 			var variants = [];
// 			// Loop variant rows
// 			_.each(sizeOptions, function(size, s) {
// 				var options,
// 					option,
// 					styleNumber = size.styleNumber;
// 				// Collate into arrays (per qualifier)
// 				_.each(size.variantOptionQualifiers, function(qualifier, q) {
// 					// Create variant arrays
// 					if (s === 0) {
// 						var guidePage = (qualifier.qualifier == 'shoeSizeCode' || qualifier.qualifier == 'shoeSizeCodeUK' ) ? 'shoe-size-guide' :
// 							(qualifier.qualifier == 'shoeWidthCode') ? 'shoe-width-guide' : 'clothing-size-guide';
// 						variants[q] = {
// 							className: qualifier.qualifier.replace(/([A-Z])/g, function($1){ return "_" + $1.toLowerCase(); }),
// 							displayValue: qualifier.name,
// 							guideUrl: globals.contextPath + '/' + guidePage,
// 							sizes: [],
// 							value: qualifier.qualifier
// 						};
// 						if (size.variantOptionQualifiers.length == 2) variants[q].subVariantIndex = Math.abs(q - 1);
// 					}
// 					// Create/Update variant option
// 					options = variants[q].sizes;
// 					option = options[getOptionIndex(options, qualifier.value)];
// 					if (!option) {
// 						options.push({
// 							displayValue: qualifier.displayValue,
// 							value: qualifier.value,
// 							subVariants: {},
// 							styleNumber : styleNumber
// 						});
// 						option = options[options.length - 1];
// 					}
// 					if (size.variantOptionQualifiers.length == 1) {
// 						option.code = size.code;
// 						option.stock = (size.stockLevelStatus.code !== 'outOfStock');
// 					} else {
// 						option.stock = (option.stock || size.stockLevelStatus.code !== 'outOfStock');
// 						var subVariant = size.variantOptionQualifiers[Math.abs(q - 1)];
// 						option.subVariants[subVariant.value] = {
// 							code: size.variantCode,
// 							value: subVariant.value,
// 							stock: (size.stockLevelStatus.code !== 'outOfStock')
// 						};
// 					}
// 				});
// 			});
// 			return variants;
// 		};

// 		var createSelection = function(qualifiers) {
// 			var selection = [];
// 			_.each(qualifiers, function(qualifier, q) {
// 				selection[q] = {
// 					displayValue: qualifier.name,
// 					key: qualifier.qualifier,
// 					value: null
// 				};
// 			});
// 			return selection;
// 		};

// 		var preSetSelection = function(defaultOneSizeCode) {
// 			_.each(model.selection, function(qualifier, q) {
// 				if (Sportif.Common.urlParams[qualifier.key]) setVariant(q, Sportif.Common.urlParams[qualifier.key]);
// 				if (!model.selection[q].value) {
// 					if (qualifier.key == 'shoeWidthCode'  ) {
// 						if( getOptionIndex( model.variants[q], 'standard') !== -1) {
// 							setVariant(q, 'standard');
// 						}
// 						else {
// 							setVariant(q, model.variants[q].sizes[0].value);
// 						}
// 					};
// 					if (qualifier.key == 'apparelSizeCode') setVariant(q, defaultOneSizeCode);
// 				}
// 			});
// 		};

// 		var updateUnselectedMsg = function() {
// 			var msg = [];
// 			_.each(model.selection, function(s) { if (!s.value) msg.push(s.displayValue); });
// 			model.unselectedMsg = msg.join(' / ');
// 		};

// 		var setVariant = function(index, value, defaultOneSizeCode) {
// 			var selector = model.variants[index];
// 			var selected = model.selection;
// 			var variant = selector.sizes[getOptionIndex(selector.sizes, value)];
// 			if(model.variants.length === 1 && !variant) {
// 				$scope.selectedStyleNumber = 0;
// 				selected[0].styleNumber = selector.sizes[0].styleNumber;
// 			}
// 			var set = function(code) {
// 				selected[index].value = value;
// 				selected[index].styleNumber = variant.styleNumber;
// 				$scope.selectedStyleNumber = index;
// 				if (code) model.code = code;
// 				if (value !== defaultOneSizeCode) updateParams();
// 				if (model.addAttempted) updateUnselectedMsg();
// 	            if (variant.styleNumber == undefined || variant.styleNumber == null || variant.styleNumber == '') {
// 	                selected[index].styleNumber = model.data.styleNumber;
// 	            }
// 			};
// 			if (variant && variant.stock) {
// 				if (selected.length == 1) {
// 					set(variant.code);
// 				} else {
// 					var selectedOther = selected[Math.abs(index - 1)].value;
// 					if (selectedOther) {
// 						var selectedProduct = variant.subVariants[selectedOther];
// 						if (selectedProduct.stock) set(selectedProduct.code);
// 					} else {
// 						set();
// 					}
// 				}
// 			}
// 		};

// 		var updateParams = function() {
// 			model.query = [];
// 			_.each(model.selection, function(s) { if (s.value) model.query.push(s.key + '=' + s.value); })
// 			model.query = (model.query.length) ? '?' + model.query.join('&') : '';
// 		};

// 		var sendGoogleAnalytics = function(category, label, qty, price) {
// 			globals.googleAnalytics.trackEvent('Cart', category, label, qty, true);
// 			globals.googleAnalytics.trackEvent('Cart', category, label, price, true);
// 		};

// 		var sendMixpanelAnalytics = function(items, add) {

// 			function getItemList(items) {
// 				return _.map(items, function(item) {
// 					return item.quantity + 'x' + item.product.name;
// 				}).join(',');
// 			}

// 			function getSport(productTypes) {
// 				return _.pluck(_.pluck(_.pluck(productTypes,
// 					'supercategories'), '0'), 'name').join(',');
// 			}

// 			var itemData = model.data,
// 				cart = CartService.model.contents.data,
// 				itemList = getItemList(cart.entries);

// 			// Only fire these if an item has been added.
// 			// itemAddAttempted event is fired twice (see comment below on handler)
// 			// and for reasons unknown, genderData property is undefined the second
// 			// time the handler is invoked. This provides us a hook to prevent the
// 			// analytics being called twice, though long-term a solution for the
// 			// repeated event should be found.
// 			if (add && itemData.genderData) {

// 				globals.mixpanel.people.set('Last item', new Date());

// 				globals.mixpanel.track('Add Item to Cart', {
// 					'Product id': itemData.code,
// 					'Product Name': itemData.name,
// 					'Category': itemData.categoryNames,
// 					'Gender': itemData.genderData.code,
// 					'Sport': getSport(itemData.productTypes),
// 					'Size': model.selection[0].value,
// 					'Item list': itemList,
// 					'Item count': cart.totalItems
// 				});
// 			}
// 		};

// 		// Scope: Global
// 		$scope.contextPath = globals.contextPath;

// 		// Scope: Cart
// 		$scope.cart = CartService.model;
// 		$scope.cartAddItem = CartService.addItem;

// 		// Scope: Quick Buy
// 		$scope.quickBuyData = QuickBuyService.model;
// 		$scope.quickBuyBroadcast = function() { $scope.$parent.$broadcast('quick_buy'); };

// 		// Scope: Selector
// 		$scope.productData = model;
// 		$scope.productQty = 1;
// 		$scope.productGetSizeData = function(code) {
// 			model.variants = null;
// 			ProductService.getProductSizeData({productCode: code}, success);
// 		};
// 		$scope.productSelectionChange = function(value) {
// 			if ($scope.cart.contents.messages) $scope.cart.contents.messages.itemAdd = null;
// 		};
// 		$scope.productSetVariant = setVariant;
// 		$scope.productAdd = function(code, qty, parent) {

// 			var name = model.data.name,
// 				price = model.data.price.value;

// 			model.addAttempted = true;
// 			updateUnselectedMsg();

// 			if (!$scope.addingInProgress && !model.unselectedMsg.length) {
// 				// Analytics
// 				var category = (parent === 'quickbuy') ? 'QuickBuy' : 'AddToCart';
// 				sendGoogleAnalytics(category, name, qty, price);

// 				// Cart Add - set flag to avoid user trying to add again
// 				$scope.addingInProgress = true;
// 				CartService.addItem(code, qty);
// 			}
// 		};

// 		// Scope: html size selector
// 		$scope.sizeSelectorUpdate = function(index) {
// 			if(this.selectedItem !== null) {
// 				$scope.productSetVariant(index, this.selectedItem.value);
// 				$scope.productSelectionChange();
// 				updateParams();
// 				$scope.$emit('selectChanged', {index: index, item: this.selectedItem});
// 			}
// 		};
// 		// This, despite the misleading name, is fired on success of any of the following
// 		// methods in CartService:- updateLine, addCoupon, removeCoupon, addItem
// 		// It's also fired twice on pages with two instances of this controller, such as the
// 		// ProductDetails page on the desktop version of the site.
// 		// Too close to release to deal with it now, but addressing these issues shoule be a
// 		// priority as they are likely to cause further issues in the longer term.
// 		$scope.$on('itemAddAttempted', function(e, data){
// 			// reset flag, so user may add again then broadcast for the cart to be opened if successful message received
// 			$scope.addingInProgress = false;
// 			$rootScope.$broadcast('openCart');

// 			if (data.success) {
// 				sendMixpanelAnalytics(data.data.entries, data.messages.itemAdd);
// 			}
// 		});
// 		$scope.clearProductAddData = function() {
// 			if (CartService.model.contents.messages) CartService.model.contents.messages.itemAdd = null;
// 			CartService.model.localMessages.itemAdd = false;
// 			_.each(model.selection, function(qualifier, q) { qualifier.value = null; });
// 			model.unselectedMsg = [];
// 			model.addAttempted = false;
// 		};

// 	}])
// 	.controller('ProductsData', ['$scope', 'ProductsService', 'QuickBuyService', function ($scope, ProductsService, QuickBuyService) {

// 		// Model
// 		var model = {
// 			contents: {},
// 			pageTotalRendered: 0
// 		};
// 		function success(data) {
// 			if (data.products.length) {
// 				if (!model.contents.products) model.contents.products = [];
// 				_.each(data.products, function(product) {
// 					product.url = globals.contextPath + product.url;
// 					model.contents.products.push(product);
// 				});
// 				model.itemsTotal = data.total;
// 				model.pageTotalRendered += Math.ceil(data.products.length / model.pageItems);
// 			}
// 			// if Selectivizr being used (ie8), refresh the DOM
// 			if(typeof Selectivizr == 'object'){
// 				Selectivizr.init();
// 			}
// 		}
// 		$scope.getProducts = function(to) {
// 			var pageShift = (page + 1) - model.pageTotalRendered,
// 				query = {};
// 			if (to) {
// 				query.from = (model.contents.products) ? model.contents.products.length : 0;
// 				query.to = to;
// 			}
// 			if (model.productCodes) query.productCodes = model.productCodes;
// 			if (model.categoryCodes) query.categoryCodes = model.categoryCodes;
// 			ProductsService.getProducts(query, success);
// 		};
// 		var starWidth = 12;
// 		var starGap = 1;

// 		// Scope: Products
// 		$scope.productsData = model;
// 		$scope.ratingDisplayWidth = function(rating) {
// 			return ((rating * starWidth) + ((rating - ( rating % 1 )) * starGap)) + 'px';
// 		};

// 		// Scope: Quick Buy
// 		$scope.quickBuyData = QuickBuyService.model;
// 		$scope.quickBuyBroadcast = function() { $scope.$parent.$broadcast('quick_buy'); };

// 	}]).controller('ProductListing', ['$scope', '$http', '$timeout', '$window', 'QuickBuyService', 'TransitionEndService', 'GTMService', 'MixPanelService', function ($scope, $http, $timeout, $window, QuickBuyService, TransitionEndService, GTMService, MixPanelService) {

// 		// Setup

// 		$scope.contextPath = globals.contextPath;

// 		$scope.init = function(listing) {
// 			MixPanelService.update(listing);
// 			$scope.listing = listing;
// 			criteoProductList(listing);
// 			setHistoryState(listing);
// 		};

// 		$scope.hasAvailableAndStandardPrice = function(product){
// 			// product.purchasable and product.wasPrice eq null and product.price ne null and product.openPrice ne true
// 			var returnValue = false;
// 			if(product.purchasable && product.wasPrice === null && product.price !== null && product.openPrice !== true){
// 				returnValue = true;
// 				product.useDefault = false;
// 			}
// 			return returnValue;
// 		};

// 		$scope.hasAvailableAndMarkedownPrice = function(product){
// 			// product.purchasable and product.wasPrice ne null and product.price ne null  and product.openPrice ne true
// 			var returnValue = false;
// 			if(product.purchasable && product.wasPrice !== null && product.price !== null && product.openPrice !== true){
// 				returnValue = true;
// 				product.useDefault = false;
// 			}
// 			return returnValue;
// 		};

// 		$scope.hasAvailableAndOpenPrice = function(product){
// 			// product.purchasable and product.price ne null and product.wasPrice eq null and product.openPrice eq true
// 			var returnValue = false;
// 			if(product.purchasable && product.price !== null && product.wasPrice !== null && product.openPrice !== true){
// 				returnValue = true;
// 				product.useDefault = false;
// 			}
// 			return returnValue;
// 		};

// 		$scope.hasAvailableAndMarkedownAndOpenPrice = function(product){
// 			// product.purchasable and product.wasPrice ne null and product.price ne null and product.openPrice eq true
// 			var returnValue = false;
// 			if(product.purchasable && product.wasPrice !== null && product.price !== null && product.openPrice === true){
// 				returnValue = true;
// 				product.useDefault = false;
// 			}
// 			return returnValue;
// 		};

// 		$scope.notAvailableAndOpenPrice = function(product){
// 			// not product.purchasable and product.wasPrice eq null and product.price ne null and product.openPrice eq true
// 			var returnValue = false;
// 			if(!product.purchasable && product.wasPrice === null && product.price !== null && product.openPrice === true){
// 				returnValue = true;
// 				product.useDefault = false;
// 			}
// 			return returnValue;
// 		};

// 		$scope.notAvailableAndStandardPrice = function(product){
// 			// not product.purchasable and product.wasPrice eq null and product.price ne null and product.openPrice ne true
// 			var returnValue = false;
// 			if(!product.purchasable && product.wasPrice === null && product.price !== null && product.openPrice !== true){
// 				returnValue = true;
// 				product.useDefault = false;
// 			}
// 			return returnValue;
// 		};

// 		// Listing

// 		$scope.listingView = { // For holding/sharing state (as listing gets replaced on change)
// 			facetShowAll : {},
// 			facetCollapse : {}
// 		};

// 		$scope.starWidth = 12;
// 		$scope.starGap = 1;

// 		function setHistoryState(listing) {
// 			if ($window.history.replaceState) {
// 				$window.history.replaceState({query: listing.results.query}, '', $window.location.pathname);
// 			}
// 		}


// 		// Listing Update

// 		$scope.loading = false;
// 		$scope.coverDelay = false;

// 		var newListing,
// 			delay,
// 			newURL;

// 		$scope.update = function(url, preventScroll, state) {
// 			if (!url) return;
// 			if ($scope.loading) { return; }
// 			$scope.loading = true;
// 			newListing = null;
// 			newURL = null;
// 			if (!state) {
// 				$scope.coverDelay = true;
// 				delay = true;
// 				newURL = url;
// 				$http.get($scope.listing.results.baseUrlAjax + url).success(function(response) {
// 					updateListing(response);
// 					if (!preventScroll) $scope.$broadcast('scrollToSearchTop');
// 				});
// 				if (!TransitionEndService) {
// 					updateDelay();
// 				}
// 			} else {
// 				delay = false;
// 				$http.get($scope.listing.results.baseUrlAjax + url).success(function(response) {
// 					updateListing(response);
// 				});
// 				$scope.loading = false;
// 			}
// 		};

// 		if ($window.addEventListener) {
// 			$window.addEventListener('popstate', function(e) {
// 				if (e.state && e.state.query != $scope.listing.results.query) {
// 					if ($scope.$$phase) {
// 						$scope.update(e.state.query, false, true);
// 					} else {
// 						$scope.$apply(function() {
// 							$scope.update(e.state.query, false, true);
// 						});
// 					}
// 				}
// 			});
// 		}

// 		function updateListing(response) {
// 			MixPanelService.update(response);
// 			newListing = response;
// 			updateComplete();
// 			criteoProductList(response);
// 		}

// 		function updateComplete() {
// 			if (delay || !newListing) { return; }
// 			$scope.coverDelay = false;
// 			$scope.listing = newListing;
// 			updateHistory(newListing);
// 		}

// 		function updateHistory() {
// 			if (!newURL) { return; }
// 			if ($window.history.pushState) {
// 				$window.history.pushState({query: newListing.results.query}, '', newListing.results.baseUrl + newURL);
// 			}
// 		}

// 		function updateKeypoints() {
// 			if ($scope.loading) {
// 				if (delay) {
// 					delay = false;
// 					updateComplete();
// 				} else if (newListing) {
// 					$scope.loading = false;
// 				}
// 			}
// 		}

// 		function updateDelay() {
// 			$timeout(function(){
// 				delay = false;
// 				updateComplete();
// 				$scope.loading = false;
// 			}, 500);
// 		}

// 		if (TransitionEndService) {
// 			$scope.$on('coverTransitionEnded', updateKeypoints);
// 		}


// 		// Quickbuy

// 		$scope.quickBuyData = QuickBuyService.model;
// 		$scope.quickBuyBroadcast = function() { $scope.$parent.$broadcast('quick_buy'); };


// 		// Tracking

// 		function criteoProductList(listing) {
// 			var productids = _.pluck(listing.results.items,'code');
// 			GTMService.updateDataLayer({'searchterms': listing.results.searchTerm});
// 			GTMService.updateDataLayer({'event': 'criteoProductList', 'productids': productids.join( "|" )});
// 		}
// 	}])
// 	.controller('SocialFeeds', ['$scope', 'SocialService', function ($scope, SocialService) {

// 		// Global namespace to collect tweets
// 		var tweets = globals.sportifSocialTweets;

// 		// Model
// 		var model = {
// 			contents: [],
// 			pageTotalRendered: 0
// 		};

// 		// Processing
// 		function successTwitter(data) {
// 			var statuses = data;
// 			model.contents = statuses;
// 			model.pageTotalRendered = model.itemsTotal = data.length;
// 		}

// 		// Scope: Social Feeds
// 		$scope.getSocialFeed = function(type, id) {
// 			// previous implementation called SocialService to get the tweets using Twitter v1.0
// 			// Tweets are now passed through from the page as they are loaded by the backend.
// 			if (type == 'twitter') {
// 				successTwitter(tweets);
// 			}
// 		};
// 		$scope.socialFeeds = model;

// 	}])
// 	.controller('MiniCart', ['$scope', 'CartService', function ($scope, CartService) {
// 		$scope.cart = CartService.model;
// 	}])
// 	.controller('MainCart', ['$scope', 'CartService', function ($scope, CartService) {
// 		// Scope: Promotions form
// 		$scope.isPromotionsVisible = false;
// 		$scope.showPromotions = function() {
// 			$scope.isPromotionsVisible = true;
// 			globals.googleAnalytics.trackEvent('Discount Code', 'Tab Opened');
// 		};
// 		$scope.cart = CartService.model;
// 		$scope.cartUpdateLine = CartService.updateLine;
// 		$scope.cartAddCoupon = CartService.addCoupon;
// 		$scope.cartRemoveCoupon = CartService.removeCoupon;
// 	}])
// 	.controller( 'Modal', ['$scope', function ($scope) {
// 		$scope.modalShown = false;

// 		$scope.toggleModal = function () {
// 			$scope.modalShown = !$scope.modalShown;
// 		};
// 	}])
// 	.controller('QuickShop', ['$scope', 'QuickShopService', 'CartService', function ($scope, QuickShopService, CartService) {

// 		$scope.quickShop = QuickShopService.model;
// 		$scope.cart = CartService.model;
// 		$scope.addingInProgress = false;
// 		$scope.starWidth = 12;
// 		$scope.starGap = 1;
// 		$scope.contextPath = globals.contextPath;

// 		var guidePageUrl = function () {
// 			if( $scope.quickShop.contents.sizeWrapper ) {
// 				var sizeGuide = ( $scope.quickShop.contents.sizeWrapper.sizes[0].qualifier == 'shoeSizeCode' ||
// 					$scope.quickShop.contents.sizeWrapper.sizes[0].qualifier == 'shoeSizeCodeUK' ) ? 'shoe-size-guide' : 'clothing-size-guide';

// 				$scope.quickShop.contents.sizeWrapper.guideUrl = globals.contextPath + '/' + sizeGuide;
// 			}
// 			else {
// 				$scope.quickShop.contents.widthWrapper.guideUrl = globals.contextPath + '/shoe-width-guide';
// 				$scope.quickShop.contents.widthWrapper.widths[0].sizeWrapper.guideUrl = globals.contextPath + '/shoe-size-guide';
// 			}
// 		};

// 		var widthStockCheck = function () {
// 			if ( $scope.selectedWidth !== undefined ) {
// 				delete $scope.selectedWidth;
// 				delete $scope.unselected;
// 			}
// 			_.each( $scope.quickShop.contents.widthWrapper.widths, function ( width , index ) {
// 				width.stockLevelStatus = { 'code' : 'outOfStock' };
// 				var i,
// 					length = width.sizeWrapper.sizes.length;

// 				for( i=0; i < width.sizeWrapper.sizes.length; i++ ) {
// 					if( width.sizeWrapper.sizes[i].stockLevelStatus.code != 'outOfStock' ) {
// 						width.stockLevelStatus.code = 'inStock';
// 						if( $scope.selectedWidth === undefined && width.code === 'standard' ) {
// 							$scope.selectedWidth = index;
// 						}
// 						break;
// 					}
// 				}
// 			});
// 			if( $scope.quickShop.contents.widthWrapper.widths.length === 1 ){
// 				$scope.selectedWidth = 0;
// 			}else {
// 				if( $scope.selectedWidth  === undefined) {
// 					$scope.unselected = 0;
// 				}
// 			}
// 		};

// 		var sendMixpanelAnalytics = function ( items, add ) {

// 			var getItemList = function ( items ) {
// 				return _.map(items, function ( item ) {
// 					return item.quantity + 'x' + item.product.name;
// 				}).join(',');
// 			};

// 			var getSport  = function ( productTypes ) {
// 				return _.pluck( _.pluck( _.pluck( productTypes,
// 					'supercategories' ), '0' ), 'name' ).join( ',' );
// 			};

// 			var getItemData = function() {
// 				var product;
// 				var variant;
// 				if( $scope.quickShop.contents.widthWrapper ) {
// 					variant = $scope.quickShop.contents.widthWrapper.widths[$scope.selectedWidth].sizeWrapper.sizes[$scope.selectedSize];
// 					productSize = variant.code;
// 				}
// 				else {
// 					variant = $scope.quickShop.contents.sizeWrapper.sizes[$scope.selectedSize];
// 					productSize = variant.code;
// 				}
// 				_.each( items , function ( item ) {
// 					if ( item.product.code === variant.productCode ){
// 						product = item.product;
// 						return;
// 					}
// 				});

// 				return product;
// 			};
// 			var productSize,
// 				itemData = getItemData(),
// 				cart = CartService.model.contents.data,
// 				itemList = getItemList( cart.entries );

// 			// Only fire these if an item has been added.
// 			// itemAddAttempted event is fired twice (see comment below on handler)
// 			// and for reasons unknown, genderData property is undefined the second
// 			// time the handler is invoked. This provides us a hook to prevent the
// 			// analytics being called twice, though long-term a solution for the
// 			// repeated event should be found.
// 			if ( add && itemData.genderData ) {

// 				globals.mixpanel.people.set( 'Last item', new Date() );

// 				globals.mixpanel.track( 'Add Item to Cart', {
// 					'Product id': itemData.code,
// 					'Product Name': itemData.name,
// 					'Category': itemData.categoryNames,
// 					'Gender': itemData.genderData.code,
// 					'Sport': getSport(itemData.productTypes),
// 					'Size': productSize,
// 					'Item list': itemList,
// 					'Item count': cart.totalItems
// 				} );
// 			}
// 		};

// 		var sendGoogleAnalytics = function(category, label, qty, price) {
// 			globals.googleAnalytics.trackEvent('Cart', category, label, qty, true);
// 			globals.googleAnalytics.trackEvent('Cart', category, label, price, true);
// 		};

// 		$scope.changeWidth = function ( width ) {
// 			if ( $scope.quickShop.contents.widthWrapper.widths[ width ].stockLevelStatus.code != 'outOfStock' ) {
// 				if ( $scope.selectedSize !==null ) {
// 					if ( $scope.quickShop.contents.widthWrapper.widths[ width ].sizeWrapper.sizes[ $scope.selectedSize ].stockLevelStatus.code != 'outOfStock' ) {
// 						$scope.selectedWidth = width;
// 						if ( $scope.unselected === 0 ) {
// 							delete $scope.unselected;
// 							delete $scope.quickShop.contents.unselectedMsg;
// 						}
// 						if( $scope.cart.contents.messages ) {
// 							delete $scope.cart.contents.messages;
// 						}
// 					}
// 				}
// 				else {
// 					$scope.selectedWidth = width;
// 					if ( $scope.quickShop.contents.unselectedMsg ) {
// 						$scope.quickShop.contents.unselectedMsg = $scope.quickShop.contents.widthWrapper.widths[ width ].sizeWrapper.typeName;
// 					}
// 					if ( $scope.unselected === 0 ) {
// 						delete $scope.unselected;
// 					}
// 				}
// 			}
// 		};

// 		$scope.changeSize = function ( size ) {
// 			if ( $scope.quickShop.contents.sizeWrapper ) {
// 				if ( $scope.quickShop.contents.sizeWrapper.sizes[ size ].stockLevelStatus.code != 'outOfStock' ) {
// 					$scope.selectedSize = size;
// 					if( $scope.quickShop.contents.unselectedMsg ) {
// 						delete $scope.quickShop.contents.unselectedMsg;
// 					}
// 					if( $scope.cart.contents.messages ) {
// 						delete $scope.cart.contents.messages;
// 					}
// 				}
// 			}
// 			else {
// 				if( $scope.selectedWidth !== undefined ) {
// 					if( $scope.quickShop.contents.widthWrapper.widths[ $scope.selectedWidth ].sizeWrapper.sizes[ size ].stockLevelStatus.code != 'outOfStock' ) {
// 						$scope.selectedSize = size;
// 						if( $scope.quickShop.contents.unselectedMsg ) {
// 							delete $scope.quickShop.contents.unselectedMsg;
// 						}
// 						if( $scope.cart.contents.messages ) {
// 							delete $scope.cart.contents.messages;
// 						}
// 					}
// 				}
// 				else {
// 					if( $scope.quickShop.contents.widthWrapper.widths[ 0 ].sizeWrapper.sizes[ size ].stockLevelStatus.code != 'outOfStock' ) {
// 						$scope.selectedSize = size;
// 						if( $scope.quickShop.contents.unselectedMsg ) {
// 							$scope.quickShop.contents.unselectedMsg = $scope.quickShop.contents.widthWrapper.typeName;
// 						}
// 						if( $scope.cart.contents.messages ) {
// 							delete $scope.cart.contents.messages;
// 						}
// 					}
// 				}
// 			}
// 		};

// 		$scope.productAdd = function() {
// 			if ( !$scope.addingInProgress ) {
// 				if ( $scope.quickShop.contents.sizeWrapper ) {
// 					if( $scope.selectedSize !== null ) {
// 						$scope.addingInProgress = true;
// 						CartService.addItem( $scope.quickShop.contents.sizeWrapper.sizes[ $scope.selectedSize ].productCode, 1);
// 						sendGoogleAnalytics( 'quickbuy', $scope.quickShop.contents.name, 1, $scope.quickShop.contents.price.value );
// 					}
// 					else {
// 						$scope.quickShop.contents.unselectedMsg = $scope.quickShop.contents.sizeWrapper.typeName;
// 					}
// 				}
// 				else {
// 					if ( $scope.selectedSize !== null && $scope.selectedWidth !== undefined ) {
// 						$scope.addingInProgress = true;
// 						CartService.addItem( $scope.quickShop.contents.widthWrapper.widths[ $scope.selectedWidth ].sizeWrapper.sizes[ $scope.selectedSize ].productCode, 1);
// 						sendGoogleAnalytics( 'quickbuy', $scope.quickShop.contents.name, 1, $scope.quickShop.contents.price.value );
// 					}
// 					else {
// 						if( $scope.selectedSize === null && $scope.selectedWidth === undefined ){
// 							$scope.quickShop.contents.unselectedMsg = $scope.quickShop.contents.widthWrapper.widths[ 0 ].sizeWrapper.typeName +
// 								' / ' + $scope.quickShop.contents.widthWrapper.typeName;

// 						}
// 						else {
// 							if( $scope.selectedSize === null ) {
// 								$scope.quickShop.contents.unselectedMsg = $scope.quickShop.contents.widthWrapper.widths[ 0 ].sizeWrapper.typeName;
// 							}
// 							else {
// 								$scope.quickShop.contents.unselectedMsg = $scope.quickShop.contents.widthWrapper.typeName;
// 							}
// 						}
// 					}
// 				}
// 			}
// 		};

// 		$scope.$watch('quickShop.contents', function ( value ) {
// 			if( $scope.quickShop.contents ){
// 				if ( $scope.quickShop.contents.widthWrapper ){
// 					widthStockCheck();
// 					$scope.selectedSize = $scope.quickShop.contents.widthWrapper.widths[0].sizeWrapper.sizes.length > 1 ? null : 0;
// 				}
// 				else {
// 					$scope.selectedSize = $scope.quickShop.contents.sizeWrapper.sizes.length > 1 ? null : 0;
// 				}
// 				if( $scope.cart.contents.messages ) {
// 					delete $scope.cart.contents.messages;
// 				}
// 				guidePageUrl();
// 			}
// 		});

// 		$scope.$on('itemAddAttempted', function ( event, data ){
// 			// reset flag, so user may add again then broadcast for the cart to be opened if successful message received
// 			$scope.addingInProgress = false;

// 			if ( data.success && $scope.quickShop.contents ) {
// 				sendMixpanelAnalytics( data.data.entries, data.messages.itemAdd );
// 			}
// 		});
// 	}])
// 	.controller('PostcodeAnywhereCapture', ['$scope', 'PostcodeAnywhereCaptureService',
// 		function($scope, PostcodeAnywhereCaptureService) {

// 			$scope.pacActive = false;
// 			$scope.results = 0;
// 			$scope.addresses = [];
// 			$scope.address = null;

// 			$scope.find = function (searchTerm, lastId) {
// 				$scope.pacActive = true;
// 				PostcodeAnywhereCaptureService.find(searchTerm, lastId ? lastId : null, findSuccess);
// 			};

// 			function findSuccess (response) {
// 				if (!response.Items.length) {
// 					$scope.addresses = [];
// 					$scope.results = 1;
// 					return;
// 				}
// 				else if (response.Items.length && response.Items[0].Error) {
// 					$scope.addresses = [];
// 					$scope.results = 0;
// 					return;
// 				}
// 				$scope.addresses = response.Items;
// 				$scope.results = $scope.addresses.length;
// 				$scope.activeIndex = -1;
// 			}

// 			$scope.retrieve = function (id) {
// 				PostcodeAnywhereCaptureService.retrieve(id, retrieveSuccess);
// 			};

// 			function retrieveSuccess (response) {
// 				$scope.address = response.Items[0];

// 				if (Sportif.PostcodeAnywhere.postcodeFilter) {
// 					var regex;
// 					for(var i=0; i<Sportif.PostcodeAnywhere.postcodeFilter.length; i++) {
// 						regex = new RegExp('^' + Sportif.PostcodeAnywhere.postcodeFilter[i]);
// 						if (regex.test($scope.address.PostalCode)) {
// 							$scope.address.noShippingArea = true;
// 							break;
// 						}
// 					};
// 				}
// 				$scope.updateAddressForm();
// 				$scope.resetFind();
// 				$scope.pacActive = false;
// 				$scope.results = 0;
// 			}

// 			$scope.select = function (address) {
// 				if (address.Next === 'Find') {
// 					$scope.find(address.Text, address.Id);
// 				}
// 				else {
// 					$scope.retrieve(address.Id);
// 				}
// 			};
// 		}
// 	]);

'use strict';

/* Controllers */
angular.module('controllers')
    /*
        FOOTER CONTROLLER
    ----------------------------------------------------------------------------
    ============================================================================ */
    .controller('FooterCtrl', ['$scope', 'ViewData', function ($scope, ViewData) {

        // // set the current date
        var currentDate = new Date();
        $scope.year = currentDate.getFullYear();

        $scope.newsletter = {};

        $scope.emailRegexValidation = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

        $scope.newsletterSignup = function(newsletterSignupForm) {

            if(newsletterSignupForm.$valid) {

                console.log(newsletterSignupForm.email.$modelValue);
                ViewData.newsletterSignup(newsletterSignupForm.email.$modelValue);
                // clear the email signup field
                $scope.newsletter.email = '';
            }
        };
    }])
    // Define the main ProductList controller
    .controller('ProductListCtrl', ['$scope', '$rootScope', '$localStorage', 'ProductListService', 'QuickBuyService', function ($scope, $rootScope, $localStorage, ProductListService, QuickBuyService) {

        var resetting = false;

        // Defaults
        var sortBy = 'featured';
        var sortLimit = 0;

        // We'll persist sort data to local storage
        $scope.$storage = $localStorage.$default({
            // Backend is effectively hardcoded to return 15
            // results by default, so limit is a bit redundant
            // until we request all ( * )
            sort: {
                by: sortBy,
                limit: sortLimit
            }
        });

        $scope.quickBuyData = QuickBuyService.model;
        $scope.productListService = ProductListService;

        function handleReset() {
            resetting = true;
            $scope.$storage.sort = { by: sortBy, limit: sortLimit };
            $scope.products = [];
        }

        function handleProductsLoaded(event, result) {
            if (result.products.length) {
                $scope.products = result.products;
                $scope.moreResults = result.attributes.showMoreResultsButton;
                $scope.resultCount = result.resultCount;
            }
        }

        // Handles changes to sort options
        function handleSortChange(newValue, oldValue) {

            // Stops this firing on init or when sort property has
            // been reset programmatically.
            if (newValue !== oldValue && !resetting) {
                // We fire off an AJAX call each time sort property changes
                $scope.productListService.getProducts(
                    $scope.$storage.filters,
                    $scope.$storage.sort
                );
            }
            resetting = false;
        }

        // Set up listeners and watches.
        $scope.$on('productList.loaded', handleProductsLoaded);
        $scope.$on('productListData.reset', handleReset);

        $scope.$watch('$storage.sort', handleSortChange, true);

        // Invoked by show more button (in fact, it shows all)
        $scope.showMore = function() {
            // Set limit to no-limit (there's no limit)
            $scope.$storage.sort.limit = $scope.resultCount;
        };

        // Integrate with existing quick buy functionality
        $scope.quickBuyBroadcast = function() {
            $scope.$parent.$broadcast('quick_buy');
        };

        // Prepends correct context to supplied URL
        $scope.getUrl = function(url) {
            return globals.contextPath + url;
        };
    }]);

'use strict';

/* Controllers */
angular.module('controllers')
    /*
        HEADER CONTROLLER
    ----------------------------------------------------------------------------
    ============================================================================ */
    .controller('HeaderCtrl', ['$scope', 'ViewData', function ($scope, ViewData) {

        $scope.search = {};

        var returnedHeaderData = ViewData.headerData.then(function(headerData){

            $scope.topNav            = headerData.data.values.topNav;
            $scope.shopBar           = headerData.data.values.mainNav.shopBar;
            $scope.runningBar        = headerData.data.values.mainNav.runningBar;
            $scope.featuredSportsBar = headerData.data.values.mainNav.featuredSportsBar;
            $scope.mySportifBar      = headerData.data.values.mainNav.mySportifBar;

        });

        $scope.ShopBarComponent = false;
        $scope.RunningBarComponent = false;
        $scope.FeaturedSportsBarComponent = false;
        $scope.MySportifBarComponent = false;

        $scope.componentShow = function(componentName) {

            // reset the component values

            // set the show value for the clicked component to true
            switch (componentName) {
                case "ShopBar":
                    $scope.ShopBarComponent = !$scope.ShopBarComponent;
                    $scope.RunningBarComponent = false;
                    $scope.FeaturedSportsBarComponent = false;
                    $scope.MySportifBarComponent = false;
                    break;
                case "RunningBar":
                    $scope.RunningBarComponent = !$scope.RunningBarComponent;
                    $scope.ShopBarComponent = false;
                    $scope.FeaturedSportsBarComponent = false;
                    $scope.MySportifBarComponent = false;
                    break;
                case "FeaturedSportsBar":
                    $scope.FeaturedSportsBarComponent = !$scope.FeaturedSportsBarComponent;
                    $scope.ShopBarComponent = false;
                    $scope.RunningBarComponent = false;
                    $scope.MySportifBarComponent = false;
                    break;
                case "MySportifBar":
                    $scope.MySportifBarComponent = !$scope.MySportifBarComponent;
                    $scope.ShopBarComponent = false;
                    $scope.RunningBarComponent = false;
                    $scope.FeaturedSportsBarComponent = false;
                    break;
            }
        };

        $scope.headerSearch = function(searchQuery) {

            console.log(searchQuery.text.$modelValue);
            // clear the search query field
            $scope.search.query = '';
        };
    }]);

'use strict';

/* Controllers */
angular.module('controllers')
    /*
        HOME CONTROLLER
    ----------------------------------------------------------------------------
    ============================================================================ */
    .controller('HomeCtrl', ['$scope', 'ViewData', function ($scope, ViewData){


        var returnedViewData = ViewData.homeMainData.then(function(homeMainData){

        var promise = homeMainData.data.values;

        $scope.quadrantOneData = promise.quadrantOneData;
        $scope.quadrantTwoData = promise.quadrantTwoData;
        $scope.quadrantThreeData = promise.quadrantThreeData;
        $scope.quadrantFourData = promise.quadrantFourData;
        });
    }]);








'use strict';

/* Controllers */
angular.module('controllers')
    /*
        MAIN CONTROLLER
    ----------------------------------------------------------------------------
    ============================================================================ */
    .controller('MainCtrl', ['$scope', 'ProductsFactory', 'ViewData', function ($scope, ProductsFactory, ViewData) {

        var returnedMiscViewData = ViewData.miscViewData.then(function(miscViewData){

            var promise = miscViewData.data.values;

            $scope.company                 = promise.company.value;
            $scope.validEmailErrorMessage  = promise.emailErrorMessage.value;
            $scope.newsLetterSignupMessage = promise.newsletterSignupMessage.value;
            $scope.signUpButton            = promise.signupButtonText.value;
            $scope.signUpTitle             = promise.signupTite.value;

        });

        var returnedCorporateInfo = ViewData.corporateInfo.then(function(corporateInfo){

            var promise = corporateInfo.data;

            $scope.corporateInfo  = promise;
        });

        var returnedCustomerServices = ViewData.customerServices.then(function(customerServices){

            var promise = customerServices.data;

            $scope.customerServices  = promise;
        });

        var returnedPopularProducts = ViewData.popularProducts.then(function(popularProducts){

            var promise = popularProducts.data;

            $scope.popularProducts  = promise;
        });
    }]);

'use strict';

/* Controllers */
angular.module('controllers')
    /*
        SHOES CONTROLLER
    ----------------------------------------------------------------------------
    ============================================================================ */
    .controller('ShoesCtrl', ['$scope', "$injector", function ($scope, $injector){

        var ShoesSidebarService = $injector.get("ShoesSidebarService"),
            ViewData            = $injector.get("ViewData"),
            ProductsFactory     = $injector.get("ProductsFactory");

        if (!$scope.shoes) {

            var returnedViewData = ViewData.shoesMainData.then(function(shoesMainData){

                var promise = shoesMainData.data.values;

                $scope.sidebarData = promise.sidebarData;
            });

            // temp array to hold all shoes
            var tempShoes = [];

            // scope array to hold available shoes
            $scope.shoesProducts = localStorage.getItem('shoes.shoesProducts') ? JSON.parse(localStorage.getItem('shoes.shoesProducts')) : [];

            // set the number of items per page
            $scope.itemsPerPage = localStorage.getItem("itemsPerPage") ? localStorage.getItem("itemsPerPage") : 18;

            $scope.shoes = {};

            var returnedProducts = ProductsFactory.getAll.then(function(data){
                // filter products and assign all shoes to tempShoes
                data.forEach( function (product) {
                    switch (product.category) {
                        case "Shoes":
                            tempShoes.push(product);
                            break;
                    }
                });

                // filter shoes and assign available shoes to $scope.shoesProducts
                tempShoes.forEach( function (shoe) {
                    switch (shoe.available) {
                        case true:
                            $scope.shoesProducts.push(shoe);
                            break;
                    }
                });

                // assign the number of members to a variable for pagination purposes
                $scope.totalItems = $scope.shoesProducts.length;

                // get the current page using local storage; if none exists, set it to 1
                $scope.shoes.currentPage = localStorage.getItem("shoes.pagination.page") ? localStorage.getItem("shoes.pagination.page") : 1;
            });
        }

        // watch for the change in current page to update the members per page
        $scope.$watch("shoes.currentPage", function() {
            // set the current page using local storage
            localStorage.setItem("shoes.pagination.page", $scope.shoes.currentPage);

            // set the size select value to false to show all sizes
            localStorage.setItem('shoes.sidebar.size.selected', false);

            updatePage();

        });

        /* default selected values for sports checkboxes */
        $scope.sports = ShoesSidebarService.sportsCheckboxes;

        $scope.sportSelected = function(checkbox, currentValue) {

            // change the selected value of "this" checkbox
            // from the current value to its opposite
            $scope.sports[checkbox].selected = !currentValue;

            // store the checkbox's value in localstorage
            ShoesSidebarService.processCheckbox(checkbox, currentValue);

            updatePage();
        };

        /* default selected values for users checkboxes */
        $scope.users = ShoesSidebarService.usersCheckboxes;

        $scope.userSelected = function(checkbox, currentValue) {

            // change the selected value of "this" checkbox
            // from the current value to its opposite
            $scope.users[checkbox].selected = !currentValue;

            // store the checkbox's value in localstorage
            ShoesSidebarService.processCheckbox(checkbox, currentValue);

            updatePage();
        };

        $scope.size = {selected: localStorage.getItem('shoes.sidebar.size.selected') ? localStorage.getItem('shoes.sidebar.size.selected') : false};

        $scope.sizeChange = function(selectedSize) {

            localStorage.setItem('shoes.sidebar.size.selected', selectedSize);

            updatePage();
        };

        $scope.sizeReset = function() {

            // set the size select value to false to show all sizes
            localStorage.setItem('shoes.sidebar.size.selected', false);

            // set the value to false to show the select a size option
            $scope.size.selected = false;

            updatePage();
        };

        function updatePage () {

            // get the selected size by which to filter available shoes
            var selectedSize = localStorage.getItem('shoes.sidebar.size.selected');

            /*  Filter available shoes based on user's selections */
            var shoesProducts = ShoesSidebarService.shoeFilter(tempShoes, $scope.sports, $scope.users, selectedSize);

            localStorage.setItem('shoes.shoesProducts', JSON.stringify(shoesProducts.availableShoes));

            // quantities to show next to selector values
            $scope.quantities = shoesProducts.quantities;

            // all available shoes to display on all pages
            $scope.shoesProducts = JSON.parse(localStorage.getItem('shoes.shoesProducts'));

            // data array to be passed into the ViewData.page() function
            var data = [$scope.shoes.currentPage, $scope.itemsPerPage, $scope.shoesProducts];

            // set the members segment array for the current page
            var shoesProductsShow = ViewData.page(data);

            localStorage.setItem('shoes.shoesProductsShow', JSON.stringify(shoesProductsShow));

            $scope.shoesProductsShow = JSON.parse(localStorage.getItem('shoes.shoesProductsShow'));

            // assign the number of members to a variable for pagination purposes
            $scope.totalItems = $scope.shoesProducts.length;
        };
    }]);

'use strict';

/* Directives */
angular.module('directives')
    /*
        ARTICLE-LOAD DIRECTIVE
    ----------------------------------------------------------------------------
    ============================================================================ */
    .directive('articleLoadAnimate', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                // listen for the "last_article_on_page_loaded" event
                // prior to applying transition effects
                scope.$on('last_article_on_page_loaded', function( domainElement ) {
                    // assign the articles to a variable
                    var articles = element.children();

                    // animate the loading of articles on pagination
                    articles.css("opacity", 0).velocity("transition.slideUpBigIn", { stagger: 60   , duration: 350 });
                });
            }
        };
    })
    /*
        ON-REPEAT-DONE DIRECTIVE
    ----------------------------------------------------------------------------
    ============================================================================ */
    .directive("onRepeatDone", function() {
        return {
            restriction: 'A',
            link: function(scope, element, attributes ) {
                // emit the event named in the "on-repeat-done" directive
                scope.$emit(attributes["onRepeatDone"], element);
            }
        }
    });

'use strict';

/* DATA PULLED IN FROM CUSTOM.JS.GLOBALS */

/* Directives */
angular.module('directives')
    /*
        AUTOPLAY DIRECTIVE
    ----------------------------------------------------------------------------
    ============================================================================ */
    .directive('autoplay', ["$injector", function($injector) {
        return {
            restrict: 'A',
            // create a *new* scope that prototypically inherits from the scope of the parent
            scope: true,
            link: function(scope, element, attrs) {

                var rScope = $injector.get('$rootScope'),
                    autoplayTimer;

                function autoplayBroadcast() {
                    autoplayTimer = setTimeout(function() {
                        rScope.$broadcast('autoplay');
                        // recursively call this function to run it repeatedly after the set interval
                        autoplayBroadcast();
                    }, 5000);
                }
                // if autoplayTimer hasn't been initialized,
                // run the autoplayBroadcast function
                if (!autoplayTimer) {
                    autoplayBroadcast();
                }
            }
        };
    }])
    /*
        CAROUSEL DIRECTIVE
    ----------------------------------------------------------------------------
    ============================================================================ */
    .directive('carousel', ["$injector", function($injector) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                var rScope = $injector.get('$rootScope'),
                    viewData = $injector.get('ViewData');

                // listen for the "last_slide_loaded" event
                // prior to applying carousel effects
                rScope.$on('last_slide_loaded', function( domainElement ) {

                    var data,
                        carousel  = element,
                        container = carousel.hasClass('.item') ? carousel : carousel.closest('div.item'),
                        dynamic   = carousel.hasClass('dynamic'),
                        viewport  = carousel.find(".viewport"),
                        slides    = carousel.find(".slides"),
                        controls,
                        pageWidth   = attrs.carouselPageWidth || viewport.width(),
                        pageCurrent = 0,
                        pageTarget,
                        pageTotal,
                        timer;

                    //Verify pageWidth is divisble by 10, otherwise add 1 pixel to pageWidth as it was rounded down by browser
                    //during page zoom out. This is based on hardcoded css widths which are all multiples of 10.
                    //(See: http://tylertate.com/blog/2012/01/05/subpixel-rounding.html for details on problem.)
                    if (pageWidth % 10 != 0) {
                        pageWidth += 1;
                    }
                    if (dynamic) {
                            // Product (Multi)
                            scope.$on('updated', function(event) {
                                changePage();
                                Asics.Common.widthMatch('div.actions.join');
                            });
                    } else {
                        data = {
                            itemsTotal: slides.children().length,
                            pageItems: parseInt(attrs.carouselPageItems) || 1
                        }
                        if (viewData.ieLt9 && data.pageItems > 1) slides.children(':nth-child(3n+1)').addClass('first_of_page');
                        init();
                    }

                    function init() {
                        if (data.itemsTotal > 1) {
                            carousel.addClass('active');
                            pageTotal = Math.ceil(data.itemsTotal / data.pageItems);
                            slides.css({ 'width': pageTotal * pageWidth });
                        }
                        if (data.itemsTotal > data.pageItems) {
                            interaction();
                            autoplay();
                        }
                    }

                    function interaction() {
                        var li = ''; for (var i = 0; i < pageTotal; i++) li += '<li><span>' + (i + 1) + '</span></li>';
                        $('<ol class="controls">' + li + '</ol>').appendTo(carousel);
                        controls = carousel.children('ol.controls').children();
                        controls.each(function(i, e) {
                            var control = $(this).on('click', function() {
                                if (!carousel.hasClass('paused')) {
                                    pageTarget = i;
                                    if (dynamic && i > data.pageTotalRendered - 1) {
                                        scope.getProducts(i * data.pageItems + data.pageItems -1);
                                        carousel.addClass('paused');
                                    } else {
                                        changePage();
                                    }
                                }
                            });
                        }).first().addClass('active');
                    }

                    function autoplay() {
                        carousel.on('load', function() {
                            if (timer) clearTimeout(timer);
                            container.addClass('hover');
                        }).on('mouseleave', function() {
                            if (timer) clearTimeout(timer);
                            timer = setTimeout(function(){ container.removeClass('hover'); }, 1000);
                        })
                        if (attrs.autoplay !== undefined && attrs.autoplay !== false) {
                            scope.$on('autoplay', function() {
                                if (!container.hasClass('hover')) {
                                    pageTarget = pageCurrent + 1;
                                    if (pageTarget > pageTotal - 1) pageTarget = 0;
                                    changePage();
                                }
                            });
                        }
                    }

                    function changePage() {
                        carousel.removeClass('paused');
                        if (pageCurrent !== pageTarget) {
                            slides.stop().animate({'left': - (pageWidth * pageTarget)}, 400);
                            controls.eq(pageTarget).addClass('active').siblings().removeClass('active');
                            pageCurrent = pageTarget;
                        }
                    }
                });
            }
        };
    }]);

'use strict';

/* Factories */
angular.module('factories')
    /*
        CLOTHING SIDEBAR SERVICE
    ----------------------------------------------------------------------------
    ============================================================================ */
    .factory("ClothingSidebarService", [function () {

            // set localStorage values to false if checkboxes are checked
        var sportsCheckboxes = {
            Running: {
                selected: localStorage.getItem('clothing.sidebar.sport.Running.unselected') == "true" ? false : true
            },
            Training: {
                selected: localStorage.getItem('clothing.sidebar.sport.Training.unselected') == "true" ? false : true
            },
            Basketball: {
                selected: localStorage.getItem('clothing.sidebar.sport.Basketball.unselected') == "true" ? false : true
            },
            Football: {
                selected: localStorage.getItem('clothing.sidebar.sport.Football.unselected') == "true" ? false : true
            },
            "Martial Arts": {
                selected: localStorage.getItem('clothing.sidebar.sport.MartialArts.unselected') == "true" ? false : true
            }
        };

        var usersCheckboxes = {
            Male: {
                selected: localStorage.getItem('clothing.sidebar.user.Male.unselected') == "true" ? false : true
            },
            Female: {
                selected: localStorage.getItem('clothing.sidebar.user.Female.unselected') == "true" ? false : true
            },
            Kids: {
                selected: localStorage.getItem('clothing.sidebar.user.Kids.unselected') == "true" ? false : true
            }
        };

        var sizeSelections = {
            small: {
                selected: localStorage.getItem('clothing.sidebar.size.selected') == "small" ? true : false
            },
            medium: {
                selected: localStorage.getItem('clothing.sidebar.size.selected') == "medium" ? true : false
            },
            large: {
                selected: localStorage.getItem('clothing.sidebar.size.selected') == "large" ? true : false
            },
            "x-large": {
                selected: localStorage.getItem('clothing.sidebar.size.selected') == "x-large" ? true : false
            },
            "2x-large": {
                selected: localStorage.getItem('clothing.sidebar.size.selected') == "2x-large" ? true : false
            }
        };

        return {

            sportsCheckboxes : sportsCheckboxes,

            usersCheckboxes  : usersCheckboxes,

            sizeSelections   : sizeSelections,

            clothingFilter : function(tempClothing, sports, users, selectedSize) {

                var availableClothing  = [],
                    checkboxSelections = [],
                    matchedSizes       = [],
                    clothing           = {availableClothing: [], quantities: {}},

                    runningVal         = {
                            selector   : "Running",
                            category   : "Sports",
                            val        : sports.Running.selected,
                            updatedQty : 0
                    },
                    trainingVal        = {
                            selector   : "Training",
                            category   : "Sports",
                            val        : sports.Training.selected,
                            updatedQty : 0
                    },
                    basketballVal      = {
                            selector   : "Basketball",
                            category   : "Sports",
                            val        : sports.Basketball.selected,
                            updatedQty : 0
                    },
                    footballVal        = {
                            selector   : "Football",
                            category   : "Sports",
                            val        : sports.Football.selected,
                            updatedQty : 0
                    },
                    martialArtsVal     = {
                            selector   : "Martial Arts",
                            category   : "Sports",
                            val        : sports["Martial Arts"].selected,
                            updatedQty : 0
                    },
                    menVal             = {
                            selector   : "Men",
                            category   : "User",
                            val        : users.Male.selected,
                            updatedQty : 0
                    },
                    womenVal           = {
                            selector   : "Women",
                            category   : "User",
                            val        : users.Female.selected,
                            updatedQty : 0
                    },
                    kidsVal            = {
                            selector   : "Kids",
                            category   : "User",
                            val        : users.Kids.selected,
                            updatedQty : 0
                    },
                    sizeVal            = {
                            selector   : "Clothing Size",
                            category   : "Size",
                            val        : selectedSize.replace(/(^\s+|\s+$)/g,'') /*remove blank spaces from size value*/,
                            updatedQty : 0
                    };

                // build an array of checkbox selections to compare against clothing
                checkboxSelections.push(runningVal);
                checkboxSelections.push(trainingVal);
                checkboxSelections.push(basketballVal);
                checkboxSelections.push(footballVal);
                checkboxSelections.push(martialArtsVal);
                checkboxSelections.push(menVal);
                checkboxSelections.push(womenVal);
                checkboxSelections.push(kidsVal);

                // assign available clothing to an array
                tempClothing.forEach( function (item) {
                    switch (item.available) {
                        case true:
                            availableClothing.push(item);
                            break;
                    }
                });

                // compare checkbox selections against item values
                checkboxSelections.forEach( function (checkbox) {
                    switch (checkbox.val) {
                        case false:
                            matchBySport(checkbox);
                            matchByUser(checkbox);
                            break;
                    }
                });

                function matchBySport (checkbox) {
                    // remove every element matching the deselected sport from the available clothing array
                    for (var i = availableClothing.length - 1; i >= 0; i--) {
                        if (availableClothing[i].activity === checkbox.selector) {
                           availableClothing.splice(i, 1);
                        }
                    }
                };

                function matchByUser (checkbox) {
                    // remove every element matching the deselected user from the available clothing array
                    for (var i = availableClothing.length - 1; i >= 0; i--) {
                        if (availableClothing[i].user === checkbox.selector) {
                           availableClothing.splice(i, 1);
                        }
                    }
                };

                Array.prototype.contains = function ( needle ) {
                   for (var i in this) {
                       if (this[i] == needle) return true;
                   }
                   return false;
                };

                function matchBySize () {
                    // remove every element matching the deselected user from the available clothing array
                    for (var i = availableClothing.length - 1; i >= 0; i--) {

                        if (availableClothing[i].sizes.contains(sizeVal.val)) {
                            matchedSizes.push(availableClothing[i]);
                        }
                    }
                    if (matchedSizes.length > 0) {
                        availableClothing = matchedSizes;
                    }

                };
                matchBySize();

                function updateProductQuantity () {
                    // remove every element matching the deselected user from the available clothing array
                    availableClothing.forEach( function (item) {
                        switch (item.activity) {
                            case "Running":
                                runningVal.updatedQty += 1;
                                break;
                            case "Training":
                                trainingVal.updatedQty += 1;
                                break;
                            case "Basketball":
                                basketballVal.updatedQty += 1;
                                break;
                            case "Football":
                                footballVal.updatedQty += 1;
                                break;
                            case "Martial Arts":
                                martialArtsVal.updatedQty += 1;
                                break;
                        }
                        switch (item.user) {
                            case "Men":
                                menVal.updatedQty += 1;
                                break;
                            case "Women":
                                womenVal.updatedQty += 1;
                                break;
                            case "Kids":
                                kidsVal.updatedQty += 1;
                                break;
                        }
                    });
                };
                updateProductQuantity();

                clothing.availableClothing          = availableClothing;
                clothing.quantities.Running         = runningVal.updatedQty;
                clothing.quantities.Training        = trainingVal.updatedQty;
                clothing.quantities.Basketball      = basketballVal.updatedQty;
                clothing.quantities.Football        = footballVal.updatedQty;
                clothing.quantities["Martial Arts"] = martialArtsVal.updatedQty;
                clothing.quantities.Male            = menVal.updatedQty;
                clothing.quantities.Female          = womenVal.updatedQty;
                clothing.quantities.Kids            = kidsVal.updatedQty;

                return clothing;
            },

            processCheckbox : function(checkbox, currentValue) {
                /*
                 * store the checkbox value in localstorage
                 */

                switch (checkbox) {
                    case "Running":
                        // set the changed value of the checkbox on the in localStorage
                        localStorage.setItem('clothing.sidebar.sport.Running.unselected', currentValue);
                        break;
                    case "Training":
                        // set the changed value of the checkbox on the in localStorage
                        localStorage.setItem('clothing.sidebar.sport.Training.unselected', currentValue);
                        break;
                    case "Basketball":
                        // set the changed value of the checkbox on the in localStorage
                        localStorage.setItem('clothing.sidebar.sport.Basketball.unselected', currentValue);
                        break;
                    case "Football":
                        // set the changed value of the checkbox on the in localStorage
                        localStorage.setItem('clothing.sidebar.sport.Football.unselected', currentValue);
                        break;
                    case "Martial Arts":
                        // set the changed value of the checkbox on the in localStorage
                        localStorage.setItem('clothing.sidebar.sport.MartialArts.unselected', currentValue);
                        break;
                        case "Male":
                        // set the changed value of the checkbox on the in localStorage
                        localStorage.setItem('clothing.sidebar.user.Male.unselected', currentValue);
                        break;
                    case "Female":
                        // set the changed value of the checkbox on the in localStorage
                        localStorage.setItem('clothing.sidebar.user.Female.unselected', currentValue);
                        break;
                    case "Kids":
                        // set the changed value of the checkbox on the in localStorage
                        localStorage.setItem('clothing.sidebar.user.Kids.unselected', currentValue);
                        break;
                }
            }
        }
    }]);

'use strict';

/* Factories */
angular.module('factories')
    /*
        PRODUCTS FACTORY
    ----------------------------------------------------------------------------
    ============================================================================ */
    .factory("ProductsFactory", ["Restangular", function (Restangular) {
        var baseUrl = "/api",
            productsCollection = Restangular.withConfig(function (configurer) {
                configurer.setBaseUrl(baseUrl)
            }),
            productsRoute = "products",
            returnedData = productsCollection.all(productsRoute).getList();
        return {
            getAll: returnedData
        }
    }]);

'use strict';

/* Factories */
angular.module('factories')
    /*
        SHOE SIDEBAR SERVICE
    ----------------------------------------------------------------------------
    ============================================================================ */
    .factory("ShoesSidebarService", [function () {

            // set localStorage values to false if checkboxes are checked
        var sportsCheckboxes = {
            Running: {
                selected: localStorage.getItem('shoes.sidebar.sport.Running.unselected') == "true" ? false : true
            },
            Training: {
                selected: localStorage.getItem('shoes.sidebar.sport.Training.unselected') == "true" ? false : true
            },
            Basketball: {
                selected: localStorage.getItem('shoes.sidebar.sport.Basketball.unselected') == "true" ? false : true
            },
            Football: {
                selected: localStorage.getItem('shoes.sidebar.sport.Football.unselected') == "true" ? false : true
            },
            "Martial Arts": {
                selected: localStorage.getItem('shoes.sidebar.sport.MartialArts.unselected') == "true" ? false : true
            }
        };

        var usersCheckboxes = {
            Male: {
                selected: localStorage.getItem('shoes.sidebar.user.Male.unselected') == "true" ? false : true
            },
            Female: {
                selected: localStorage.getItem('shoes.sidebar.user.Female.unselected') == "true" ? false : true
            },
            Kids: {
                selected: localStorage.getItem('shoes.sidebar.user.Kids.unselected') == "true" ? false : true
            }
        };

        return {

            sportsCheckboxes: sportsCheckboxes,

            usersCheckboxes: usersCheckboxes,

            shoeFilter : function(tempShoes, sports, users, selectedSize) {

                var availableShoes     = [],
                    checkboxSelections = [],
                    matchedSizes       = [],
                    shoes              = {availableShoes: [], quantities: {}},

                    runningVal         = {
                            selector   : "Running",
                            category   : "Sports",
                            val        : sports.Running.selected,
                            updatedQty : 0
                    },
                    trainingVal        = {
                            selector   : "Training",
                            category   : "Sports",
                            val        : sports.Training.selected,
                            updatedQty : 0
                    },
                    basketballVal      = {
                            selector   : "Basketball",
                            category   : "Sports",
                            val        : sports.Basketball.selected,
                            updatedQty : 0
                    },
                    footballVal        = {
                            selector   : "Football",
                            category   : "Sports",
                            val        : sports.Football.selected,
                            updatedQty : 0
                    },
                    martialArtsVal     = {
                            selector   : "Martial Arts",
                            category   : "Sports",
                            val        : sports["Martial Arts"].selected,
                            updatedQty : 0
                    },
                    menVal             = {
                            selector   : "Men",
                            category   : "User",
                            val        : users.Male.selected,
                            updatedQty : 0
                    },
                    womenVal           = {
                            selector   : "Women",
                            category   : "User",
                            val        : users.Female.selected,
                            updatedQty : 0
                    },
                    kidsVal            = {
                            selector   : "Kids",
                            category   : "User",
                            val        : users.Kids.selected,
                            updatedQty : 0
                    },
                    sizeVal            = {
                            selector   : "Shoe Size",
                            category   : "Size",
                            val        : selectedSize,
                            updatedQty : 0
                    };

                // build an array of checkbox selections to compare against shoes
                checkboxSelections.push(runningVal);
                checkboxSelections.push(trainingVal);
                checkboxSelections.push(basketballVal);
                checkboxSelections.push(footballVal);
                checkboxSelections.push(martialArtsVal);
                checkboxSelections.push(menVal);
                checkboxSelections.push(womenVal);
                checkboxSelections.push(kidsVal);

                // assign available shoes to an array
                tempShoes.forEach( function (shoe) {
                    switch (shoe.available) {
                        case true:
                            availableShoes.push(shoe);
                            break;
                    }
                });

                // compare checkbox selections against shoe values
                checkboxSelections.forEach( function (checkbox) {
                    switch (checkbox.val) {
                        case false:
                            matchBySport(checkbox);
                            matchByUser(checkbox);
                            break;
                    }
                });

                function matchBySport (checkbox) {
                    // remove every element matching the deselected sport from the available shoes array
                    for (var i = availableShoes.length - 1; i >= 0; i--) {
                        if (availableShoes[i].activity === checkbox.selector) {
                           availableShoes.splice(i, 1);
                        }
                    }
                };

                function matchByUser (checkbox) {
                    // remove every element matching the deselected user from the available shoes array
                    for (var i = availableShoes.length - 1; i >= 0; i--) {
                        if (availableShoes[i].user === checkbox.selector) {
                           availableShoes.splice(i, 1);
                        }
                    }
                };

                Array.prototype.contains = function ( needle ) {
                   for (var i in this) {
                       if (this[i] == needle) return true;
                   }
                   return false;
                };

                function matchBySize () {
                    // remove every element matching the deselected user from the available shoes array
                    for (var i = availableShoes.length - 1; i >= 0; i--) {
                        // console.log(sizeVal.val);
                        if (availableShoes[i].sizes.contains(JSON.parse(sizeVal.val))) {
                            matchedSizes.push(availableShoes[i]);
                        }
                    }
                    // if (matchedSizes.length > 0) {
                        availableShoes = matchedSizes;
                    // }

                };
                matchBySize();

                function updateProductQuantity () {
                    // remove every element matching the deselected user from the available shoes array
                    availableShoes.forEach( function (shoe) {
                        switch (shoe.activity) {
                            case "Running":
                                runningVal.updatedQty += 1;
                                break;
                            case "Training":
                                trainingVal.updatedQty += 1;
                                break;
                            case "Basketball":
                                basketballVal.updatedQty += 1;
                                break;
                            case "Football":
                                footballVal.updatedQty += 1;
                                break;
                            case "Martial Arts":
                                martialArtsVal.updatedQty += 1;
                                break;
                        }
                        switch (shoe.user) {
                            case "Men":
                                menVal.updatedQty += 1;
                                break;
                            case "Women":
                                womenVal.updatedQty += 1;
                                break;
                            case "Kids":
                                kidsVal.updatedQty += 1;
                                break;
                        }
                    });
                };
                updateProductQuantity();

                shoes.availableShoes = availableShoes;
                shoes.quantities.Running         = runningVal.updatedQty;
                shoes.quantities.Training        = trainingVal.updatedQty;
                shoes.quantities.Basketball      = basketballVal.updatedQty;
                shoes.quantities.Football        = footballVal.updatedQty;
                shoes.quantities["Martial Arts"] = martialArtsVal.updatedQty;
                shoes.quantities.Male            = menVal.updatedQty;
                shoes.quantities.Female          = womenVal.updatedQty;
                shoes.quantities.Kids            = kidsVal.updatedQty;

                return shoes;
            },

            processCheckbox : function(checkbox, currentValue) {
                /*
                 * store the checkbox value in localstorage
                 */

                switch (checkbox) {
                    case "Running":
                        // set the changed value of the checkbox on the in localStorage
                        localStorage.setItem('shoes.sidebar.sport.Running.unselected', currentValue);
                        break;
                    case "Training":
                        // set the changed value of the checkbox on the in localStorage
                        localStorage.setItem('shoes.sidebar.sport.Training.unselected', currentValue);
                        break;
                    case "Basketball":
                        // set the changed value of the checkbox on the in localStorage
                        localStorage.setItem('shoes.sidebar.sport.Basketball.unselected', currentValue);
                        break;
                    case "Football":
                        // set the changed value of the checkbox on the in localStorage
                        localStorage.setItem('shoes.sidebar.sport.Football.unselected', currentValue);
                        break;
                    case "Martial Arts":
                        // set the changed value of the checkbox on the in localStorage
                        localStorage.setItem('shoes.sidebar.sport.MartialArts.unselected', currentValue);
                        break;
                        case "Male":
                        // set the changed value of the checkbox on the in localStorage
                        localStorage.setItem('shoes.sidebar.user.Male.unselected', currentValue);
                        break;
                    case "Female":
                        // set the changed value of the checkbox on the in localStorage
                        localStorage.setItem('shoes.sidebar.user.Female.unselected', currentValue);
                        break;
                    case "Kids":
                        // set the changed value of the checkbox on the in localStorage
                        localStorage.setItem('shoes.sidebar.user.Kids.unselected', currentValue);
                        break;
                }
            }
        }
    }]);

'use strict';

/* Factories */
angular.module('factories')
    /*
        VIEWDATA FACTORY
    ----------------------------------------------------------------------------
    ============================================================================ */
    .factory("ViewData", ["Restangular", function (Restangular) {

        var baseUrl = "/api",

            // configure Restangular object with baseUrl
            viewDataCollection = Restangular.withConfig(function (configurer) {
                configurer.setBaseUrl(baseUrl)
            }),

            // api routes
            viewDataRoute        = "viewdata",
            headerRoute          = "viewdata/header",
            homemainRoute        = "viewdata/homemain",
            shoesmainRoute       = "viewdata/shoesmain",
            clothingmainRoute    = "viewdata/clothingmain",
            miscDataRoute        = "viewdata/miscdata",
            corporateInfoRoute   = "viewdata/corporateinfo",
            customServicesRoute  = "viewdata/customerservices",
            popularProductsRoute = "viewdata/popularproducts",

            // api get calls
            returnedData     = viewDataCollection.all(viewDataRoute).getList(),
            headerData       = viewDataCollection.one(headerRoute).get(),
            homeMainData     = viewDataCollection.one(homemainRoute).get(),
            shoesMainData    = viewDataCollection.one(shoesmainRoute).get(),
            clothingMainData = viewDataCollection.one(clothingmainRoute).get(),
            miscViewData     = viewDataCollection.one(miscDataRoute).get(),
            corporateInfo    = viewDataCollection.one(corporateInfoRoute).get(),
            customerServices = viewDataCollection.one(customServicesRoute).get(),
            popularProducts  = viewDataCollection.one(popularProductsRoute).get(),

            ieLt9            = (navigator.appName == 'Microsoft Internet Explorer' && !document.addEventListener);

        return {

            returnedData: returnedData,

            headerData: headerData,

            homeMainData: homeMainData,

            shoesMainData: shoesMainData,

            clothingMainData: clothingMainData,

            miscViewData: miscViewData,

            corporateInfo: corporateInfo,

            customerServices: customerServices,

            popularProducts: popularProducts,

            ieLt9: ieLt9,

            newsletterSignup: function (email) {

                console.log("Email: " + email + " received by ViewData newsletterSignup function")
            },

            page : function(data) {
                /*
                 * data[0] = currentPage
                 * data[1] = itemsPerPage
                 * data[1] = $scope.Members[]
                 */

                // when paginating, reset the beginning and end of the members array segment
                var sliceStart = (data[0] * data[1]) - data[1];
                var sliceEnd = data[0] * data[1];

                return data[2].slice(sliceStart, sliceEnd);
            }
        }
    }]);

'use strict';
/*globals angular, _*/

angular.module('filters')
	// Filter selections for use display in menu
	.filter('selections', function() {
		return function(input) {
			return _.isArray(input) ?
				_.pluck(input, 'label').join(' / ') :
				input && input.id || '';
		};
	});

'use strict';

/* Filters */

angular.module('directives')
.filter('limitToIf', function() {
	return function(input, limit, condition) {
		if (condition && input.length > limit) {
			var hasActive = false;
			for (var i = limit; i < input.length; i++) {
				if (input[i].active) {
					hasActive = true;
					break;
				}
			};
		}
		return condition && !hasActive ? input.slice(0, limit) : input;
	};
}).filter('increment', function() {
	return function(input, condition) {
		if (condition) {
			input++;
		}
		return input;
	};
});
