jQuery(function($){ 
  var FR = (function () {
    function FR(element, options) {
    	var _ = this,timer;
      _.settings = $.extend($.fn.fade_responsively.defaults, options);
      _.$e = $(element);
      if (_.settings.divArray !== null) {
        for (i = 0; i < _.settings.divArray.length; i++){
          _.$e.append(_.settings.divArray[i]);
        }
      }
      _.$pics = _.$e.children();
      _.count = _.$pics.length;
      _.$e.addClass('fr').append('<!--[if lt IE 9]><script type="text/javascript">fr_old_ie = true;</script><![endif]-->');
      if(typeof fr_old_ie != 'undefined' && fr_old_ie === true){
        _.$pics.each(function(){
          var url = $(this).css('background-image').replace(/^url|[\(\)]/g, '');
          $(this).css({
            'background-image':'',
            'filter':"progid:DXImageTransform.Microsoft.AlphaImageLoader(src="+url+",sizingMethod='scale')",
            '-ms-filter':"progid:DXImageTransform.Microsoft.AlphaImageLoader(src="+url+", sizingMethod='scale')"
          });
        })
      }
      _.previousSlide = _.count-1;
      _.currentSlide = 0;
      _.nextSlide = 1;
      _.width = _.$e.width();
      _.height = _.$e.height();
      _.transitionSetup();
      _.resize();
      _.initialAspectRatio = _.width/_.height;
      _.zindexCurrent = 10;
      _.zindexSiblings = 9;
      if(_.settings.backstretch){
        _.$e.css('z-index',-1);
        _.zindexCurrent = -9;
        _.zindexSiblings = -10;
      }
      if(_.settings.aspectRatio > 0 && _.settings.aspectRatio!==true) _.$e.height(_.width/_.settings.aspectRatio);
      if(_.settings.oneEm) _.$e.css('font-size',(_.width<_.settings.oneEm)?(_.width/_.settings.oneEm)+'em':'1em');
      if(_.settings.showNav) _.buildNav();
      if(_.settings.showArrows) _.buildArrows();
      if(_.settings.autoPlay){
        _.autoPlay();
        if(_.settings.pauseOnHover) _.autoPlayPause();
      }
    }
    FR.prototype.buildArrows = function(){
      var _ = this, nav='', leftArrow = '<nav class="fr-nav-item fr-previous" title="Previous Slide"><div class="fr-arrow">'+_.settings.leftArrowContent+'</div></nav>',
      rightArrow ='<nav class="fr-nav-item fr-next" title="Next Slide"><div class="fr-arrow">'+_.settings.rightArrowContent+'</div></nav>';
      _.$e.append(leftArrow+rightArrow);
      _.$e.find('.fr-previous').click(function(){
        _.change(_.previousSlide);
      });
      _.$e.find('.fr-next').click(function(){
        _.change(_.nextSlide);
      });
    }
    FR.prototype.buildNav = function(){
    	var _ = this, nav='';
      for (var i = 0; i < _.count; i++) {
    		nav +="<div class='fr-nav-item fr-nav-element "+(i==0?'active':'')+"' title='Slide "+(i+1)+"' data-slide='" + i + "'>"+(_.settings.navNumbers?i+1:'')+"</div>";
    	};
    	_.$e.append($('<nav class="fr-nav">'+nav+'</nav>'));
      _.$e.find('.fr-nav-element').click(function(){
        _.change($(this).data('slide'));
      });
    };
    FR.prototype.change = function(slideNumber) {
      var _ = this;
      if(slideNumber != _.currentSlide) {
        _.currentSlide = Number(slideNumber);
        _.$e.find(".fr-nav-element").eq(_.currentSlide).addClass('active').siblings().removeClass('active');
        _.nextSlide = (_.currentSlide == _.count-1 )? 0 : _.currentSlide + 1;
        _.previousSlide = (_.currentSlide == 0)? _.count-1 : _.currentSlide -1;
        _.transition();
      }
    };
    FR.prototype.transitionSetup = function() {
      this.$pics.eq(0).addClass('visible');
      this.$pics.not(":first-child").hide();
    }
    FR.prototype.transition = function() {
      var _ = this;
      _.$pics.eq(_.currentSlide).css('z-index', _.zindexCurrent).siblings('div').css('z-index', _.zindexSiblings);           
      _.$pics.eq(_.currentSlide).stop().fadeIn(_.settings.speed, function() {
          _.$e.find(".visible").stop().fadeOut('fast',function(){
              $(this).removeClass('visible');
              _.$pics.eq(_.currentSlide).addClass('visible');
          });
      });
    }
    FR.prototype.transitionResize = function() {
      //override me if needed
    }
    FR.prototype.autoPlay = function() {
      var _ = this;
      timer = setInterval(function(){
        _.change(_.nextSlide);
      },_.settings.duration);
    };
    FR.prototype.autoPlayPause = function() {
      var _ = this;
      _.$e.hover(function(){
        clearInterval(timer);
      }, function() {
        _.autoPlay();
      });
    };
    FR.prototype.resize = function() {
      var _ = this;
      $(window).resize(function(){
        _.width = _.$e.width()
        if(_.settings.aspectRatio != false){
          _.$e.height(_.width/ ((_.settings.aspectRatio===true)?_.initialAspectRatio:_.settings.aspectRatio) );
        }
        if(_.settings.oneEm !== false){ //
          _.$e.css('font-size',(_.width<_.settings.oneEm)?(_.width/_.settings.oneEm)+'em':'1em');
        }
        _.transitionResize();
      });
    };
    return FR;
  })(); //end FR
  $.fn.fade_responsively = function (options) {
    var instance;
    instance = this.data('fr');
    if (!instance) {
      return this.each(function(){
        return $(this).data('fr', new FR(this,options));
      });
    }
    if (options === true) return instance;
    if ($.type(options) === 'string') instance[options]();
    return this;
  };
  $.fn.fade_responsively.defaults = {
      autoPlay: true,
      speed: 100,
      duration: 5000,
      leftArrowContent: '&lsaquo;',
      rightArrowContent: '&rsaquo;',
      pauseOnHover: false,
      backgroundSize: false,
      aspectRatio: false,
      oneEm: false,
      showNav: false,
      showArrows: false,
      navNumbers: false,
      backstretch: false,
      divArray: null
  };
});
if (typeof FRCallback == 'function') { FRCallback(); }