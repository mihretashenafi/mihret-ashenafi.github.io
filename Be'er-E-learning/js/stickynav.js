jQuery(document).ready(function () {
	 $("window").on ('scroll',function () {
        if($(window).scrollTop()) {
			$('.container>.menu').addclass;
		}
		else{
			$('.container>.menu').removeclass;
		}
    })
});