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
    languageISO: 'en',

    // Proxy for calls to Google Analytics
    googleAnalytics: (function() {

        // All calls are routed through queue
        var queue = function(arr) {
            // Only push if _gaq is defined
            if (window._gaq) {
                window._gaq.push(arr);
            }
        };

        return {

            trackEvent: function(category, action, label, value, noninteraction, href) {
                // console.log(category, action, label, value, noninteraction, href);
                queue(['_trackEvent', category, action, label, value, noninteraction]);
                // Delay optional redirect to ensure event is tracked before page updates
                if (href) { setTimeout(function() { document.location.href = href; }, 100); }
            },

            trackPageview: function(pageURL) {
                queue(['_trackPageview', pageURL]);
            },

            setCustomVar: function(slot, name, value, scope) {
                queue(['_setCustomVar', slot, name, value, scope]);
            }
        };

    })(),

    // Proxy for calls to mixpanel
    mixpanel: (function() {

        // All calls are routed through invoke
        var invoke = function(method, args, people) {
            // Only invoke if mixpanel is defined
            if (window.mixpanel) {
                // Mixpanel, strangely, has a separate API for people.
                // Need to target mixpanel.people if people specified in params.
                var target = people ? window.mixpanel.people : window.mixpanel;
                // console.log('%cmixpanel: ', 'background: red; color: #fff;', target, args);
                return target[method].apply(target, args);
            }
        };

        return {

            init: function(token, config, name) {
                return invoke('init', [token, config, name]);
            },

            identify: function(unique_id) {
                return invoke('identify', [unique_id]);
            },

            alias: function(alias) {
                return invoke('alias', [alias]);
            },

            register: function(properties) {
                return invoke('register', [properties]);
            },

            unregister: function(property_name) {
                return invoke('unregister', [property_name])
            },

            track: function(event_name, properties, callback) {
                return invoke('track', [event_name, properties, callback]);
            },

            track_links: function(css_selector, event_name, properties) {
                return invoke('track_links', [css_selector, event_name, properties]);
            },

            track_forms: function(css_selector, event_name, properties) {
                return invoke('track_forms', [css_selector, event_name, properties]);
            },

            getCartData: function() {
                return { promoCode: _promoCode };
            },

            people: {
                set: function(prop, to, callback) {
                    return invoke('set', [prop, to, callback], true);
                },

                track_charge: function(amount) {
                    return invoke('track_charge', [amount], true);
                }
            }
        };

    })()
};

// start Mixpanel
(function(e,b){if(!b.__SV){var a,f,i,g;window.mixpanel=b;a=e.createElement("script");a.type="text/javascript";a.async=!0;a.src=("https:"===e.location.protocol?"https:":"http:")+'//cdn.mxpnl.com/libs/mixpanel-2.2.min.js';f=e.getElementsByTagName("script")[0];f.parentNode.insertBefore(a,f);b._i=[];b.init=function(a,e,d){function f(b,h){var a=h.split(".");2==a.length&&(b=b[a[0]],h=a[1]);b[h]=function(){b.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var c=b;"undefined"!==
typeof d?c=b[d]=[]:d="mixpanel";c.people=c.people||[];c.toString=function(b){var a="mixpanel";"mixpanel"!==d&&(a+="."+d);b||(a+=" (stub)");return a};c.people.toString=function(){return c.toString(1)+".people (stub)"};i="disable track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.set_once people.increment people.append people.track_charge people.clear_charges people.delete_user".split(" ");for(g=0;g<i.length;g++)f(c,i[g]);
b._i.push([a,e,d])};b.__SV=1.2}})(document,window.mixpanel||[]);

(function() {

    // Initialise mixpanel with the appropriate id for this instance
    // We send all the calls through a proxy object to make debugging easier
    globals.mixpanel.init('047678cda9e238bf2a4d9466f9a06086');
    globals.mixpanel.register({ 'hostname': window.location.hostname });

    // Report current user type, Returning (logged in) or Visitor (not logged in)

        var captureGuestUserDetails = '', // true if guest user has entered email
            email = '',
            firstName = '',
            lastName = '';
        //console.log("captureGuestUserDetails = " + captureGuestUserDetails + ", email=" + email + ", firstName = " + firstName, ",lastName = " + lastName);

        if(null != email && '' != email ){
            globals.mixpanel.register({ '$email': email });
            globals.mixpanel.people.set({
                '$email': email,
                'First Name': firstName,
                'Last Name': lastName
            });
            if(captureGuestUserDetails){ // user given email first time, create alias
                globals.mixpanel.alias(email);
            }else{ // user details available via session, find the user
                globals.mixpanel.identify(email);
            }
        }
        globals.mixpanel.register({ 'User Type': 'Guest' });
})();
// end Mixpanel

// ga is conditionally written to page if tracking id is found. All tracking handled directly in page
// is also included within the conditional. Analytics not fired directly from this block should be routed through Sportif.
// GoogleAnalytics object to facilitate debugging and error handling
(function() {
    /* Google Analytics */
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA\x2D15248285\x2D1']);
    _gaq.push(['_setDomainName', 'www.sportif.com']);
    _gaq.push(['_setAllowLinker', true]);


    // 1EJS AGRA-488 track keyword ranking
    if (document.referrer.match(/google\./gi) && document.referrer.match(/cd/gi)) {
      var myString = document.referrer;
      var r        = myString.match(/cd=(.*?)&/);
      var rank     = parseInt(r[1]);
      var kw       = myString.match(/q=(.*?)&/);

      if (kw[1].length > 0) {
        var keyWord  = decodeURI(kw[1]);
      } else {
        keyWord = "(not provided)";
      }

      var p        = document.location.pathname;
      _gaq.push(['_trackEvent', 'RankTracker', keyWord, p, rank, true]);
    }

    // Report current user type, Member or Visitor

    _gaq.push(['_setCustomVar', 1, 'CurrentUserType', 'Visitor', 2]);

    _gaq.push(['_trackPageview']);

    (function () {
        var ga = document.createElement('script');
        ga.type = 'text/javascript';
        ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(ga, s);
    })();
        globals.mixpanel.register({ 'User Type': 'Guest' });
})();
