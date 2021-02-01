/*--POP UP--*/
var popup = {
    el: {},

    data: {
        currentPopup: [],
    },

    init: function(settings) {
        var _this = this;

        _this.bindUIActions();
        if (settings) {
            _this.data.settings = settings;
        }

        //Check URL for poup id
        if (window.location.hash) {
            _this.open(window.location.hash.replace("#", ""));
        }
    },

    bindUIActions: function() {
        var _this = this;

        //When clicked on opener
        $(document).on("click", '[data-popup]', function() {
            if ($(this).data('popup')) {
                _this.open($(this).data('popup'));
            } else {
                alert('Please provide popup Id.');
            }
        });

        //When clicked on close
        $(document).on("click", '.popup__close', function(e) {
            var $if = $(e.delegateTarget).find('iframe');
            var src = $if.attr("src");
            $if.attr("src", '/empty.html');
            $if.attr("src", src);
            _this.close($(this).parents('.popup').attr('id'));
        });

        //Clicked outside popup
        $(document).mouseup(function(e) {
            if (_this.data.currentPopup.length > 0) {
                var container = $('.popup__wrap');
                if (!container.is(e.target) && container.has(e.target).length === 0) {
                    var $if = $(e.delegateTarget).find('iframe');
                    var src = $if.attr("src");
                    $if.attr("src", '/empty.html');
                    $if.attr("src", src);
                    _this.close();
                }
            }
        });

        //Key Up
        $(document).keyup(function(e) {
            if (_this.data.currentPopup.length > 0) {
                if (e.keyCode == 27) {
                    _this.close();
                }
            }
        });
    },

    open: function(popupID) {
        var _this = this;
        var popupObj = $('#' + popupID);
        if (popupObj.length > 0) {
            _this.data.currentPopup.push(popupID);
            popupObj.css('z-index', 99 + _this.data.currentPopup.length).addClass('open');
            popupObj.find('.popup_focus').focus();

            $('body').addClass('popup__is-open');

            if (_this.data.settings && _this.data.settings.afterOpen) {
                _this.data.settings.afterOpen(popupID);
            }
        }
    },

    close: function(popupID) {
        var _this = this;
        //If popupid is not defined set the last opened popup
        if (!popupID) {
            popupID = _this.data.currentPopup[_this.data.currentPopup.length - 1];
        }
        var popupObj = $('#' + popupID);
        if (popupObj.length > 0) {
            var popupIndex = _this.data.currentPopup.indexOf(popupID);
            _this.data.currentPopup.splice(popupIndex, 1);
            popupObj.removeClass('open');
            //popupObj.removeClass('open').css('z-index',-1);

            $('body').removeClass('popup__is-open');

            if (_this.data.settings && _this.data.settings.afterClose) {
                _this.data.settings.afterClose(popupID);
            }
        } else {
            alert('Popup Not Found!');
        }
    },
};
$(document).ready(function() {
    popup.init();

});

/*----------*/

//$(document).ready(function() {

    /*--SLIDER--*/
    /*---$('.feature-list').slick({
        slidesToShow: 3,
        arrows: true,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 5000,
        //speed: 9000,
        dots: false,
        //cssEase: 'linear'
        responsive: [{
                breakpoint: 800,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                }
            },
            {
                breakpoint: 580,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                }
            }
        ]
    });
});--*/

// YOUTUBE IFRAME DEFER JAVASCRIPT

function init() {
    var vidDefer = document.getElementsByTagName('iframe');
    for (var i = 0; i < vidDefer.length; i++) {
        if (vidDefer[i].getAttribute('data-src')) {
            vidDefer[i].setAttribute('src', vidDefer[i].getAttribute('data-src'));
        }
    }
}
window.onload = init;
