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
    })
    .state('accessories', {
      url: '/accessories',
      views: {
        '': {
          templateUrl: 'views/partials/accessories.html'
        },
        'header@accessories': {
          templateUrl: 'views/partials/header/header.html',
          controller: 'HeaderCtrl'
        },
        'accessoriesMain@accessories': {
          templateUrl: 'views/partials/accessories_main/accessoriesMain.html',
          controller: 'AccessoriesCtrl'
        },
        'footer@accessories': {
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
        ACCESORIES CONTROLLER
    ----------------------------------------------------------------------------
    ============================================================================ */
    .controller('AccessoriesCtrl', ['$scope', "$injector", function ($scope, $injector){

        var AccessoriesSidebarService = $injector.get("AccessoriesSidebarService"),
            ViewData                  = $injector.get("ViewData"),
            ProductsFactory           = $injector.get("ProductsFactory");

        $scope.accessories = {};

        ViewData.accessoriesMainData.then(function(accessoriesMainData){

            var promise = accessoriesMainData.data.values;

            $scope.sidebarData = promise.sidebarData;
        });

        // set the number of items per page
        localStorage.setItem("itemsPerPage", 6);
        $scope.itemsPerPage = localStorage.getItem("itemsPerPage");

        ProductsFactory.getAll.then(function(data){

            // temp array to hold all accessories
            var tempAccessories = [];

            // filter products and assign all accessories to tempAccessories
            data.forEach( function (product) {
                switch (product.category) {
                    case "Accessories":
                        tempAccessories.push(product);
                        break;
                }
            });

            // assign all products to localStorage variable
            localStorage.setItem('accessories.allAccessoriesProducts', JSON.stringify(tempAccessories));

            // temp array to hold available accessories
            var accessoriesProducts = [];

            // filter accessories and assign available accessories to $scope.accessoriesProducts
            tempAccessories.forEach( function (item) {
                switch (item.available) {
                    case true:
                        accessoriesProducts.push(item);
                        break;
                }
            });

            // assign all available products to localStorage variable
            localStorage.setItem('accessories.availableAccessoriesProducts', JSON.stringify(accessoriesProducts));
            updatePage();
        });

        // get the current page using local storage; if none exists, set it to 1
        $scope.accessories.currentPage = localStorage.getItem("accessories.pagination.page") && localStorage.getItem("accessories.pagination.page") != 'undefined' ? localStorage.getItem("accessories.pagination.page") : 1;

        // watch for the change in current page to update the products per page
        $scope.$watch("accessories.currentPage", function() {

            // set the current page using local storage
            localStorage.setItem("accessories.pagination.page", $scope.accessories.currentPage);

            updatePage();

        });

        /* default selected values for types checkboxes */
        $scope.types = AccessoriesSidebarService.typesCheckboxes;

        $scope.typeSelected = function(checkbox, currentValue) {

            // change the selected value of "this" checkbox
            // from the current value to its opposite
            $scope.types[checkbox].selected = !currentValue;

            // store the checkbox's value in localstorage
            AccessoriesSidebarService.processCheckbox(checkbox, currentValue);

            updatePage();
        };

        /* default selected values for sports checkboxes */
        $scope.sports = AccessoriesSidebarService.sportsCheckboxes;

        $scope.sportSelected = function(checkbox, currentValue) {

            // change the selected value of "this" checkbox
            // from the current value to its opposite
            $scope.sports[checkbox].selected = !currentValue;

            // store the checkbox's value in localstorage
            AccessoriesSidebarService.processCheckbox(checkbox, currentValue);

            updatePage();
        };

        /* default selected values for users checkboxes */
        $scope.users = AccessoriesSidebarService.usersCheckboxes;

        $scope.userSelected = function(checkbox, currentValue) {

            // change the selected value of "this" checkbox
            // from the current value to its opposite
            $scope.users[checkbox].selected = !currentValue;

            // store the checkbox's value in localstorage
            AccessoriesSidebarService.processCheckbox(checkbox, currentValue);

            updatePage();
        };

        $scope.size = {selected: localStorage.getItem('accessories.sidebar.size.selected') ? localStorage.getItem('accessories.sidebar.size.selected').replace(/(^\s+|\s+$)/g,'' /*remove blank spaces from size value*/) : false};

        $scope.sizeChange = function(selectedSize) {

            localStorage.setItem('accessories.sidebar.size.selected', selectedSize);

            updatePage();
        };

        $scope.sizeReset = function() {

            // set the size select value to false to show all sizes
            localStorage.setItem('accessories.sidebar.size.selected', false);

            // set the value to false to show the "select a size" option
            $scope.size.selected = false;

            updatePage();
        };

        function updatePage () {

            if ( localStorage.getItem('accessories.sidebar.size.selected') == null || localStorage.getItem('accessories.sidebar.size.selected') == 'false' ) {
                // set the size select value to false to show all sizes
                localStorage.setItem('accessories.sidebar.size.selected', false);

                // set the value to false to show the "select a size" option
                $scope.size.selected = false;
            }

            // get the selected size by which to filter available accessories
            var selectedSize = localStorage.getItem('accessories.sidebar.size.selected'),

                tempAccessories = JSON.parse(localStorage.getItem('accessories.allAccessoriesProducts')),

                itemsPerPage = localStorage.getItem("itemsPerPage"),

                currentPage = localStorage.getItem("accessories.pagination.page"),

                /*  Filter available accessories based on user's selections */
                accessoriesProducts = AccessoriesSidebarService.accessoriesFilter(tempAccessories, $scope.types, $scope.sports, $scope.users, selectedSize);

            localStorage.setItem('accessories.availableAccessoriesProducts', JSON.stringify(accessoriesProducts.availableAccessories));

            var availableAccessoriesProducts = JSON.parse(localStorage.getItem('accessories.availableAccessoriesProducts'));

            // assign the number of products to a variable for pagination purposes
            $scope.totalItems = availableAccessoriesProducts.length;

            // all available accessories to display on all pages
            $scope.accessoriesProducts = availableAccessoriesProducts;

            // quantities to show next to selector values
            $scope.quantities = accessoriesProducts.quantities;

            // data array to be passed into the ViewData.page() function
            var data = [currentPage, itemsPerPage, $scope.accessoriesProducts],
                // set the products segment array for the current page
                accessoriesProductsShow = ViewData.page(data);

            localStorage.setItem('accessories.accessoriesProductsShow', JSON.stringify(accessoriesProductsShow));

            $scope.accessoriesProductsShow = JSON.parse(localStorage.getItem('accessories.accessoriesProductsShow'));
        };
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

        $scope.clothing = {};

        ViewData.clothingMainData.then(function(clothingMainData){

            var promise = clothingMainData.data.values;

            $scope.sidebarData = promise.sidebarData;
        });

        // set the number of items per page
        localStorage.setItem("itemsPerPage", 6);
        $scope.itemsPerPage = localStorage.getItem("itemsPerPage");

        ProductsFactory.getAll.then(function(data){

            // temp array to hold all clothing
            var tempClothing = [];

            // filter products and assign all clothing to tempClothing
            data.forEach( function (product) {
                switch (product.category) {
                    case "Clothing":
                        tempClothing.push(product);
                        break;
                }
            });

            // assign all products to localStorage variable
            localStorage.setItem('clothing.allClothingProducts', JSON.stringify(tempClothing));

            // temp array to hold available clothing
            var clothingProducts = [];

            // filter clothing and assign available clothing to $scope.clothingProducts
            tempClothing.forEach( function (item) {
                switch (item.available) {
                    case true:
                        clothingProducts.push(item);
                        break;
                }
            });

            // assign all available products to localStorage variable
            localStorage.setItem('clothing.availableClothingProducts', JSON.stringify(clothingProducts));
            updatePage();
        });

        // get the current page using local storage; if none exists, set it to 1
        $scope.clothing.currentPage = localStorage.getItem("clothing.pagination.page") && localStorage.getItem("clothing.pagination.page") != 'undefined' ? localStorage.getItem("clothing.pagination.page") : 1;

        // watch for the change in current page to update the products per page
        $scope.$watch("clothing.currentPage", function() {

            // set the current page using local storage
            localStorage.setItem("clothing.pagination.page", $scope.clothing.currentPage);

            updatePage();

        });

        /* default selected values for types checkboxes */
        $scope.types = ClothingSidebarService.typesCheckboxes;

        $scope.typeSelected = function(checkbox, currentValue) {

            // change the selected value of "this" checkbox
            // from the current value to its opposite
            $scope.types[checkbox].selected = !currentValue;

            // store the checkbox's value in localstorage
            ClothingSidebarService.processCheckbox(checkbox, currentValue);

            updatePage();
        };

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

            // set the value to false to show the "select a size" option
            $scope.size.selected = false;

            updatePage();
        };

        function updatePage () {

            if ( localStorage.getItem('clothing.sidebar.size.selected') == null || localStorage.getItem('clothing.sidebar.size.selected') == 'false' ) {
                // set the size select value to false to show all sizes
                localStorage.setItem('clothing.sidebar.size.selected', false);

                // set the value to false to show the "select a size" option
                $scope.size.selected = false;
            }

            // get the selected size by which to filter available clothing
            var selectedSize = localStorage.getItem('clothing.sidebar.size.selected'),

                tempClothing = JSON.parse(localStorage.getItem('clothing.allClothingProducts')),

                itemsPerPage = localStorage.getItem("itemsPerPage"),

                currentPage = localStorage.getItem("clothing.pagination.page"),

                /*  Filter available clothing based on user's selections */
                clothingProducts = ClothingSidebarService.clothingFilter(tempClothing, $scope.types, $scope.sports, $scope.users, selectedSize);

            localStorage.setItem('clothing.availableClothingProducts', JSON.stringify(clothingProducts.availableClothing));

            var availableClothingProducts = JSON.parse(localStorage.getItem('clothing.availableClothingProducts'));

            // assign the number of products to a variable for pagination purposes
            $scope.totalItems = availableClothingProducts.length;

            // all available clothing to display on all pages
            $scope.clothingProducts = availableClothingProducts;

            // quantities to show next to selector values
            $scope.quantities = clothingProducts.quantities;

            // data array to be passed into the ViewData.page() function
            var data = [currentPage, itemsPerPage, $scope.clothingProducts],
                // set the products segment array for the current page
                clothingProductsShow = ViewData.page(data);

            localStorage.setItem('clothing.clothingProductsShow', JSON.stringify(clothingProductsShow));

            $scope.clothingProductsShow = JSON.parse(localStorage.getItem('clothing.clothingProductsShow'));
        };
    }]);

'use strict';

/* Controllers */
angular.module('controllers')
    /*
        FOOTER CONTROLLER
    ----------------------------------------------------------------------------
    ============================================================================ */
    .controller('FooterCtrl', ['$scope', '$injector', function ($scope, $injector) {

        var ViewData = $injector.get("ViewData"),
            // set the current date
            currentDate = new Date();

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
    }]);

'use strict';

/* Controllers */
angular.module('controllers')
    /*
        HEADER CONTROLLER
    ----------------------------------------------------------------------------
    ============================================================================ */
    .controller('HeaderCtrl', ['$scope', '$injector', function ($scope, $injector) {

        var ViewData = $injector.get("ViewData");

        $scope.search = {};

        $scope.ShopBarComponent = false;
        $scope.RunningBarComponent = false;
        $scope.FeaturedSportsBarComponent = false;
        $scope.MySportifBarComponent = false;

        ViewData.headerData.then(function(headerData){

            $scope.topNav            = headerData.data.values.topNav;
            $scope.shopBar           = headerData.data.values.mainNav.shopBar;
            $scope.runningBar        = headerData.data.values.mainNav.runningBar;
            $scope.featuredSportsBar = headerData.data.values.mainNav.featuredSportsBar;
            $scope.mySportifBar      = headerData.data.values.mainNav.mySportifBar;

        });

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
    .controller('HomeCtrl', ['$scope', '$injector', function ($scope, $injector){

        var ViewData = $injector.get("ViewData");

        ViewData.homeMainData.then(function(homeMainData){

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
    .controller('MainCtrl', ['$scope', '$injector', function ($scope, $injector) {

        var ViewData = $injector.get("ViewData");

        ViewData.miscViewData.then(function(miscViewData){

            var promise = miscViewData.data.values;

            $scope.company                 = promise.company.value;
            $scope.validEmailErrorMessage  = promise.emailErrorMessage.value;
            $scope.newsLetterSignupMessage = promise.newsletterSignupMessage.value;
            $scope.signUpButton            = promise.signupButtonText.value;
            $scope.signUpTitle             = promise.signupTite.value;

        });

        ViewData.corporateInfo.then(function(corporateInfo){

            var promise = corporateInfo.data;

            $scope.corporateInfo = promise;
        });

        ViewData.customerServices.then(function(customerServices){

            var promise = customerServices.data;

            $scope.customerServices = promise;
        });

        ViewData.popularProducts.then(function(popularProducts){

            var promise = popularProducts.data;

            $scope.popularProducts = promise;
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

        $scope.shoes = {};

        ViewData.shoesMainData.then(function(shoesMainData){

            var promise = shoesMainData.data.values;

            $scope.sidebarData = promise.sidebarData;
        });

        // set the number of items per page
        localStorage.setItem("itemsPerPage", 6);
        $scope.itemsPerPage = localStorage.getItem("itemsPerPage");

        ProductsFactory.getAll.then(function(data){

            // temp array to hold all shoes
            var tempShoes = [];

            // filter products and assign all shoes to tempShoes
            data.forEach( function (product) {
                switch (product.category) {
                    case "Shoes":
                        tempShoes.push(product);
                        break;
                }
            });

            // assign all products to localStorage variable
            localStorage.setItem('shoes.allShoesProducts', JSON.stringify(tempShoes));

            // temp array to hold available shoes
            var shoesProducts = [];

            // filter shoes and assign available shoes to $scope.shoesProducts
            tempShoes.forEach( function (shoe) {
                switch (shoe.available) {
                    case true:
                        shoesProducts.push(shoe);
                        break;
                }
            });

            // assign all available products to localStorage variable
            localStorage.setItem('shoes.availableShoesProducts', JSON.stringify(shoesProducts));
            updatePage();
        });

        // get the current page using local storage; if none exists, set it to 1
        $scope.shoes.currentPage = localStorage.getItem("shoes.pagination.page") && localStorage.getItem("shoes.pagination.page") != 'undefined' ? localStorage.getItem("shoes.pagination.page") : 1;

        // watch for the change in current page to update the products per page
        $scope.$watch("shoes.currentPage", function() {

            // set the current page using local storage
            localStorage.setItem("shoes.pagination.page", $scope.shoes.currentPage);

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

            if ( localStorage.getItem('shoes.sidebar.size.selected') == null || localStorage.getItem('shoes.sidebar.size.selected') == 'false' ) {
                // set the size select value to false to show all sizes
                localStorage.setItem('shoes.sidebar.size.selected', false);

                // set the value to false to show the "select a size" option
                $scope.size.selected = false;
            }

            // get the selected size by which to filter available shoes
            var selectedSize = localStorage.getItem('shoes.sidebar.size.selected'),

                tempShoes = JSON.parse(localStorage.getItem('shoes.allShoesProducts')),

                itemsPerPage = localStorage.getItem("itemsPerPage"),

                currentPage = localStorage.getItem("shoes.pagination.page"),

                /*  Filter available shoes based on user's selections */
                shoesProducts = ShoesSidebarService.shoesFilter(tempShoes, $scope.sports, $scope.users, selectedSize);

            localStorage.setItem('shoes.availableShoesProducts', JSON.stringify(shoesProducts.availableShoes));

            var availableShoesProducts = JSON.parse(localStorage.getItem('shoes.availableShoesProducts'));

            // assign the number of products to a variable for pagination purposes
            $scope.totalItems = availableShoesProducts.length;

            // all available shoes to display on all pages
            $scope.shoesProducts = availableShoesProducts;

            // quantities to show next to selector values
            $scope.quantities = shoesProducts.quantities;

            // data array to be passed into the ViewData.page() function
            var data = [currentPage, itemsPerPage, $scope.shoesProducts],
                // set the products segment array for the current page
                shoesProductsShow = ViewData.page(data);

            localStorage.setItem('shoes.shoesProductsShow', JSON.stringify(shoesProductsShow));

            $scope.shoesProductsShow = JSON.parse(localStorage.getItem('shoes.shoesProductsShow'));
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
        ACCESSORIES SIDEBAR SERVICE
    ----------------------------------------------------------------------------
    ============================================================================ */
    .factory("AccessoriesSidebarService", [function () {

            // set localStorage values to false if checkboxes are checked
        var typesCheckboxes = {
            Headbands: {
                selected: localStorage.getItem('accessories.sidebar.type.Headbands.unselected') == "true" ? false : true
            },
            Socks: {
                selected: localStorage.getItem('accessories.sidebar.type.Socks.unselected') == "true" ? false : true
            },
            Towels: {
                selected: localStorage.getItem('accessories.sidebar.type.Towels.unselected') == "true" ? false : true
            },
            Belts: {
                selected: localStorage.getItem('accessories.sidebar.type.Belts.unselected') == "true" ? false : true
            },
            Bags: {
                selected: localStorage.getItem('accessories.sidebar.type.Bags.unselected') == "true" ? false : true
            },
            Hats: {
                selected: localStorage.getItem('accessories.sidebar.type.Hats.unselected') == "true" ? false : true
            },
            Bottles: {
                selected: localStorage.getItem('accessories.sidebar.type.Bottles.unselected') == "true" ? false : true
            },
            Glasses: {
                selected: localStorage.getItem('accessories.sidebar.type.Glasses.unselected') == "true" ? false : true
            },
            Lamps: {
                selected: localStorage.getItem('accessories.sidebar.type.Lamps.unselected') == "true" ? false : true
            }
        };

            // set localStorage values to false if checkboxes are checked
        var sportsCheckboxes = {
            Running: {
                selected: localStorage.getItem('accessories.sidebar.sport.Running.unselected') == "true" ? false : true
            },
            Training: {
                selected: localStorage.getItem('accessories.sidebar.sport.Training.unselected') == "true" ? false : true
            },
            Basketball: {
                selected: localStorage.getItem('accessories.sidebar.sport.Basketball.unselected') == "true" ? false : true
            },
            Football: {
                selected: localStorage.getItem('accessories.sidebar.sport.Football.unselected') == "true" ? false : true
            },
            "Martial Arts": {
                selected: localStorage.getItem('accessories.sidebar.sport.MartialArts.unselected') == "true" ? false : true
            },
            "Any Sport": {
                selected: localStorage.getItem('accessories.sidebar.sport.Any.unselected') == "true" ? false : true
            }
   };

        var usersCheckboxes = {
            Male: {
                selected: localStorage.getItem('accessories.sidebar.user.Male.unselected') == "true" ? false : true
            },
            Female: {
                selected: localStorage.getItem('accessories.sidebar.user.Female.unselected') == "true" ? false : true
            },
            Kids: {
                selected: localStorage.getItem('accessories.sidebar.user.Kids.unselected') == "true" ? false : true
            },
            "Any User": {
                selected: localStorage.getItem('accessories.sidebar.user.Any.unselected') == "true" ? false : true
            }
        };

        var sizeSelections = {
            small: {
                selected: localStorage.getItem('accessories.sidebar.size.selected') == "small" ? true : false
            },
            medium: {
                selected: localStorage.getItem('accessories.sidebar.size.selected') == "medium" ? true : false
            },
            large: {
                selected: localStorage.getItem('accessories.sidebar.size.selected') == "large" ? true : false
            },
            "x-large": {
                selected: localStorage.getItem('accessories.sidebar.size.selected') == "x-large" ? true : false
            },
            "2x-large": {
                selected: localStorage.getItem('accessories.sidebar.size.selected') == "2x-large" ? true : false
            },
            "N/A": {
                selected: localStorage.getItem('accessories.sidebar.size.selected') == "N/A" ? true : false
            }
        };

        return {

            typesCheckboxes  : typesCheckboxes,

            sportsCheckboxes : sportsCheckboxes,

            usersCheckboxes  : usersCheckboxes,

            sizeSelections   : sizeSelections,

            accessoriesFilter : function(tempAccessories, types, sports, users, selectedSize) {

                var availableAccessories = [],
                    checkboxSelections   = [],
                    matchedSizes         = [],
                    accessories          = {availableAccessories: [], quantities: {}},

                    headbandsVal       = {
                            selector   : "Headbands",
                            category   : "Types",
                            val        : types.Headbands.selected,
                            updatedQty : 0
                    },
                    socksVal           = {
                            selector   : "Socks",
                            category   : "Types",
                            val        : types.Socks.selected,
                            updatedQty : 0
                    },
                    towelsVal          = {
                            selector   : "Towels",
                            category   : "Types",
                            val        : types.Towels.selected,
                            updatedQty : 0
                    },
                    beltsVal           = {
                            selector   : "Belts",
                            category   : "Types",
                            val        : types.Belts.selected,
                            updatedQty : 0
                    },
                    bagsVal            = {
                            selector   : "Bags",
                            category   : "Types",
                            val        : types.Bags.selected,
                            updatedQty : 0
                    },
                    hatsVal            = {
                            selector   : "Hats",
                            category   : "Types",
                            val        : types.Hats.selected,
                            updatedQty : 0
                    },
                    bottlesVal         = {
                            selector   : "Bottles",
                            category   : "Types",
                            val        : types.Bottles.selected,
                            updatedQty : 0
                    },
                    glassesVal         = {
                            selector   : "Glasses",
                            category   : "Types",
                            val        : types.Glasses.selected,
                            updatedQty : 0
                    },
                    lampsVal           = {
                            selector   : "Lamps",
                            category   : "Types",
                            val        : types.Lamps.selected,
                            updatedQty : 0
                    },
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
                    anySportVal       = {
                            selector   : "Any Sport",
                            category   : "Sports",
                            val        : sports["Any Sport"].selected,
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
                    anyUserVal        = {
                            selector   : "Any User",
                            category   : "User",
                            val        : users["Any User"].selected,
                            updatedQty : 0
                    },
                    sizeVal            = {
                            selector   : "Accessories Size",
                            category   : "Size",
                            val        : selectedSize.replace(/(^\s+|\s+$)/g,'') /*remove blank spaces from size value*/,
                            updatedQty : 0
                    };

                // build an array of checkbox selections to compare against accessories
                checkboxSelections.push(headbandsVal);
                checkboxSelections.push(socksVal);
                checkboxSelections.push(towelsVal);
                checkboxSelections.push(beltsVal);
                checkboxSelections.push(bagsVal);
                checkboxSelections.push(hatsVal);
                checkboxSelections.push(bottlesVal);
                checkboxSelections.push(glassesVal);
                checkboxSelections.push(lampsVal);
                checkboxSelections.push(runningVal);
                checkboxSelections.push(trainingVal);
                checkboxSelections.push(basketballVal);
                checkboxSelections.push(footballVal);
                checkboxSelections.push(martialArtsVal);
                checkboxSelections.push(anySportVal);
                checkboxSelections.push(menVal);
                checkboxSelections.push(womenVal);
                checkboxSelections.push(kidsVal);
                checkboxSelections.push(anyUserVal);

                // assign available accessories to an array
                tempAccessories.forEach( function (item) {
                    switch (item.available) {
                        case true:
                            availableAccessories.push(item);
                            break;
                    }
                });

                // compare checkbox selections against item values
                checkboxSelections.forEach( function (checkbox) {
                    switch (checkbox.val) {
                        case false:
                            matchByType(checkbox);
                            matchBySport(checkbox);
                            matchByUser(checkbox);
                            break;
                    }
                });

                function matchByType (checkbox) {
                    // remove every element matching the deselected sport from the available accessories array
                    for (var i = availableAccessories.length - 1; i >= 0; i--) {
                        if (availableAccessories[i].sub_category === checkbox.selector) {
                           availableAccessories.splice(i, 1);
                        }
                    }
                };

                function matchBySport (checkbox) {
                    // remove every element matching the deselected sport from the available accessories array
                    for (var i = availableAccessories.length - 1; i >= 0; i--) {
                        if (availableAccessories[i].activity === checkbox.selector) {
                           availableAccessories.splice(i, 1);
                        }
                    }
                };

                function matchByUser (checkbox) {
                    // remove every element matching the deselected user from the available accessories array
                    for (var i = availableAccessories.length - 1; i >= 0; i--) {
                        if (availableAccessories[i].user === checkbox.selector) {
                           availableAccessories.splice(i, 1);
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
                    // remove every element matching the deselected user from the available accessories array
                    for (var i = availableAccessories.length - 1; i >= 0; i--) {

                        if (availableAccessories[i].sizes.contains(sizeVal.val)) {
                            matchedSizes.push(availableAccessories[i]);
                        }
                    }

                    if (matchedSizes.length > 0) availableAccessories = matchedSizes;

                    else if (sizeVal.val == "false") return

                    else availableAccessories = [];

                };
                matchBySize();

                function updateProductQuantity () {
                    // remove every element matching the deselected user from the available accessories array
                    availableAccessories.forEach( function (item) {
                        switch (item.sub_category) {
                            case "Headbands":
                                headbandsVal.updatedQty += 1;
                                break;
                            case "Socks":
                                socksVal.updatedQty += 1;
                                break;
                            case "Towels":
                                towelsVal.updatedQty += 1;
                                break;
                            case "Belts":
                                beltsVal.updatedQty += 1;
                                break;
                            case "Bags":
                                bagsVal.updatedQty += 1;
                                break;
                            case "Hats":
                                hatsVal.updatedQty += 1;
                                break;
                            case "Bottles":
                                bottlesVal.updatedQty += 1;
                                break;
                            case "Glasses":
                                glassesVal.updatedQty += 1;
                                break;
                            case "Lamps":
                                lampsVal.updatedQty += 1;
                                break;
                        }
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
                            case "Any Sport":
                                anySportVal.updatedQty += 1;
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
                            case "Any User":
                                anyUserVal.updatedQty += 1;
                                break;
                        }
                    });
                };
                updateProductQuantity();

                accessories.availableAccessories        = availableAccessories;
                accessories.quantities.Headbands        = headbandsVal.updatedQty;
                accessories.quantities.Socks            = socksVal.updatedQty;
                accessories.quantities.Towels           = towelsVal.updatedQty;
                accessories.quantities.Belts            = beltsVal.updatedQty;
                accessories.quantities.Bags             = bagsVal.updatedQty;
                accessories.quantities.Hats             = hatsVal.updatedQty;
                accessories.quantities.Bottles          = bottlesVal.updatedQty;
                accessories.quantities.Glasses          = glassesVal.updatedQty;
                accessories.quantities.Lamps            = lampsVal.updatedQty;
                accessories.quantities.Running          = runningVal.updatedQty;
                accessories.quantities.Training         = trainingVal.updatedQty;
                accessories.quantities.Basketball       = basketballVal.updatedQty;
                accessories.quantities.Football         = footballVal.updatedQty;
                accessories.quantities["Martial Arts"]  = martialArtsVal.updatedQty;
                accessories.quantities["Any Sport"]     = anySportVal.updatedQty;
                accessories.quantities.Male             = menVal.updatedQty;
                accessories.quantities.Female           = womenVal.updatedQty;
                accessories.quantities.Kids             = kidsVal.updatedQty;
                accessories.quantities["Any User"]      = anyUserVal.updatedQty;

                return accessories;
            },

            processCheckbox : function(checkbox, currentValue) {
                /*
                 * store the checkbox value in localstorage
                 */

                switch (checkbox) {
                    // set the changed value of the checkbox on the in localStorage
                    case "Headbands":
                        localStorage.setItem('accessories.sidebar.type.Headbands.unselected', currentValue);
                        break;
                    case "Socks":
                        localStorage.setItem('accessories.sidebar.type.Socks.unselected', currentValue);
                        break;
                    case "Towels":
                        localStorage.setItem('accessories.sidebar.type.Towels.unselected', currentValue);
                        break;
                    case "Belts":
                        localStorage.setItem('accessories.sidebar.type.Belts.unselected', currentValue);
                        break;
                    case "Bags":
                        localStorage.setItem('accessories.sidebar.type.Bags.unselected', currentValue);
                        break;
                    case "Hats":
                        localStorage.setItem('accessories.sidebar.type.Hats.unselected', currentValue);
                        break;
                    case "Bottles":
                        localStorage.setItem('accessories.sidebar.type.Bottles.unselected', currentValue);
                        break;
                    case "Glasses":
                        localStorage.setItem('accessories.sidebar.type.Glasses.unselected', currentValue);
                        break;
                    case "Lamps":
                        localStorage.setItem('accessories.sidebar.type.Lamps.unselected', currentValue);
                        break;
                    case "Running":
                        localStorage.setItem('accessories.sidebar.sport.Running.unselected', currentValue);
                        break;
                    case "Training":
                        localStorage.setItem('accessories.sidebar.sport.Training.unselected', currentValue);
                        break;
                    case "Basketball":
                        localStorage.setItem('accessories.sidebar.sport.Basketball.unselected', currentValue);
                        break;
                    case "Football":
                        localStorage.setItem('accessories.sidebar.sport.Football.unselected', currentValue);
                        break;
                    case "Any Sport":
                        localStorage.setItem('accessories.sidebar.sport.Any.unselected', currentValue);
                        break;
                    case "Martial Arts":
                        localStorage.setItem('accessories.sidebar.sport.MartialArts.unselected', currentValue);
                        break;
                    case "Male":
                        localStorage.setItem('accessories.sidebar.user.Male.unselected', currentValue);
                        break;
                    case "Female":
                        localStorage.setItem('accessories.sidebar.user.Female.unselected', currentValue);
                        break;
                    case "Kids":
                        localStorage.setItem('accessories.sidebar.user.Kids.unselected', currentValue);
                        break;
                    case "Any User":
                        localStorage.setItem('accessories.sidebar.user.Any.unselected', currentValue);
                        break;
                }
            }
        }
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
        var typesCheckboxes = {
            "Jersey Shirts": {
                selected: localStorage.getItem('clothing.sidebar.type.JerseyShirts.unselected') == "true" ? false : true
            },
            "Jersey Shorts": {
                selected: localStorage.getItem('clothing.sidebar.type.JerseyShorts.unselected') == "true" ? false : true
            },
            Tights: {
                selected: localStorage.getItem('clothing.sidebar.type.Tights.unselected') == "true" ? false : true
            },
            Tees: {
                selected: localStorage.getItem('clothing.sidebar.type.Tees.unselected') == "true" ? false : true
            },
            "Tank Tops": {
                selected: localStorage.getItem('clothing.sidebar.type.TankTops.unselected') == "true" ? false : true
            }
        };

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

            typesCheckboxes  : typesCheckboxes,

            sportsCheckboxes : sportsCheckboxes,

            usersCheckboxes  : usersCheckboxes,

            sizeSelections   : sizeSelections,

            clothingFilter : function(tempClothing, types, sports, users, selectedSize) {

                var availableClothing  = [],
                    checkboxSelections = [],
                    matchedSizes       = [],
                    clothing           = {availableClothing: [], quantities: {}},

                    jerseyShirtsVal    = {
                            selector   : "Jersey Shirts",
                            category   : "Types",
                            val        : types["Jersey Shirts"].selected,
                            updatedQty : 0
                    },
                    jerseyShortsVal    = {
                            selector   : "Jersey Shorts",
                            category   : "Types",
                            val        : types["Jersey Shorts"].selected,
                            updatedQty : 0
                    },
                    tightsVal          = {
                            selector   : "Tights",
                            category   : "Types",
                            val        : types.Tights.selected,
                            updatedQty : 0
                    },
                    teesVal            = {
                            selector   : "Tees",
                            category   : "Types",
                            val        : types.Tees.selected,
                            updatedQty : 0
                    },
                    tankTopsVal        = {
                            selector   : "Tank Tops",
                            category   : "Types",
                            val        : types["Tank Tops"].selected,
                            updatedQty : 0
                    },
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
                checkboxSelections.push(jerseyShirtsVal);
                checkboxSelections.push(jerseyShortsVal);
                checkboxSelections.push(tightsVal);
                checkboxSelections.push(teesVal);
                checkboxSelections.push(tankTopsVal);
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
                            matchByType(checkbox);
                            matchBySport(checkbox);
                            matchByUser(checkbox);
                            break;
                    }
                });

                function matchByType (checkbox) {
                    // remove every element matching the deselected sport from the available clothing array
                    for (var i = availableClothing.length - 1; i >= 0; i--) {
                        if (availableClothing[i].sub_category === checkbox.selector) {
                           availableClothing.splice(i, 1);
                        }
                    }
                };

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

                    if (matchedSizes.length > 0) availableClothing = matchedSizes;

                    else if (sizeVal.val == "false") return

                    else availableClothing = [];

                };
                matchBySize();

                function updateProductQuantity () {
                    // remove every element matching the deselected user from the available clothing array
                    availableClothing.forEach( function (item) {
                        switch (item.sub_category) {
                            case "Jersey Shirts":
                                jerseyShirtsVal.updatedQty += 1;
                                break;
                            case "Jersey Shorts":
                                jerseyShortsVal.updatedQty += 1;
                                break;
                            case "Tights":
                                tightsVal.updatedQty += 1;
                                break;
                            case "Tees":
                                teesVal.updatedQty += 1;
                                break;
                            case "Tank Tops":
                                tankTopsVal.updatedQty += 1;
                                break;
                        }
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

                clothing.availableClothing           = availableClothing;
                clothing.quantities["Jersey Shirts"] = jerseyShirtsVal.updatedQty;
                clothing.quantities["Jersey Shorts"] = jerseyShortsVal.updatedQty;
                clothing.quantities.Tights           = tightsVal.updatedQty;
                clothing.quantities.Tees             = teesVal.updatedQty;
                clothing.quantities["Tank Tops"]     = tankTopsVal.updatedQty;
                clothing.quantities.Running          = runningVal.updatedQty;
                clothing.quantities.Training         = trainingVal.updatedQty;
                clothing.quantities.Basketball       = basketballVal.updatedQty;
                clothing.quantities.Football         = footballVal.updatedQty;
                clothing.quantities["Martial Arts"]  = martialArtsVal.updatedQty;
                clothing.quantities.Male             = menVal.updatedQty;
                clothing.quantities.Female           = womenVal.updatedQty;
                clothing.quantities.Kids             = kidsVal.updatedQty;

                return clothing;
            },

            processCheckbox : function(checkbox, currentValue) {
                /*
                 * store the checkbox value in localstorage
                 */

                switch (checkbox) {
                    // set the changed value of the checkbox on the in localStorage
                    case "Jersey Shirts":
                        localStorage.setItem('clothing.sidebar.type.JerseyShirts.unselected', currentValue);
                        break;
                    case "Jersey Shorts":
                        localStorage.setItem('clothing.sidebar.type.JerseyShorts.unselected', currentValue);
                        break;
                    case "Tights":
                        localStorage.setItem('clothing.sidebar.type.Tights.unselected', currentValue);
                        break;
                    case "Tees":
                        localStorage.setItem('clothing.sidebar.type.Tees.unselected', currentValue);
                        break;
                    case "Tank Tops":
                        localStorage.setItem('clothing.sidebar.type.TankTops.unselected', currentValue);
                        break;
                    case "Running":
                        localStorage.setItem('clothing.sidebar.sport.Running.unselected', currentValue);
                        break;
                    case "Training":
                        localStorage.setItem('clothing.sidebar.sport.Training.unselected', currentValue);
                        break;
                    case "Basketball":
                        localStorage.setItem('clothing.sidebar.sport.Basketball.unselected', currentValue);
                        break;
                    case "Football":
                        localStorage.setItem('clothing.sidebar.sport.Football.unselected', currentValue);
                        break;
                    case "Martial Arts":
                        localStorage.setItem('clothing.sidebar.sport.MartialArts.unselected', currentValue);
                        break;
                    case "Male":
                        localStorage.setItem('clothing.sidebar.user.Male.unselected', currentValue);
                        break;
                    case "Female":
                        localStorage.setItem('clothing.sidebar.user.Female.unselected', currentValue);
                        break;
                    case "Kids":
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

            shoesFilter : function(tempShoes, sports, users, selectedSize) {

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
                        if (availableShoes[i].sizes.contains(JSON.parse(sizeVal.val))) {
                            matchedSizes.push(availableShoes[i]);
                        }
                    }

                    if (matchedSizes.length > 0) availableShoes = matchedSizes;

                    else if (sizeVal.val == "false") return

                    else availableShoes = [];

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
            accessoriesmainRoute = "viewdata/accessoriesmain",
            miscDataRoute        = "viewdata/miscdata",
            corporateInfoRoute   = "viewdata/corporateinfo",
            customServicesRoute  = "viewdata/customerservices",
            popularProductsRoute = "viewdata/popularproducts",

            // api get calls
            returnedData        = viewDataCollection.all(viewDataRoute).getList(),
            headerData          = viewDataCollection.one(headerRoute).get(),
            homeMainData        = viewDataCollection.one(homemainRoute).get(),
            shoesMainData       = viewDataCollection.one(shoesmainRoute).get(),
            clothingMainData    = viewDataCollection.one(clothingmainRoute).get(),
            accessoriesMainData = viewDataCollection.one(accessoriesmainRoute).get(),
            miscViewData        = viewDataCollection.one(miscDataRoute).get(),
            corporateInfo       = viewDataCollection.one(corporateInfoRoute).get(),
            customerServices    = viewDataCollection.one(customServicesRoute).get(),
            popularProducts     = viewDataCollection.one(popularProductsRoute).get(),

            ieLt9               = (navigator.appName == 'Microsoft Internet Explorer' && !document.addEventListener);

        return {

            returnedData: returnedData,

            headerData: headerData,

            homeMainData: homeMainData,

            shoesMainData: shoesMainData,

            clothingMainData: clothingMainData,

            accessoriesMainData: accessoriesMainData,

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
