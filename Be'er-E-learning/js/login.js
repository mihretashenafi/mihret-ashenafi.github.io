jQuery(document).ready(function () {
    var panels = $('.Login>.container').hide();
    $('#pop-upbtn').click(function () {
        var $this = $(this);

        $this.slideDown();
        panels.show();
            
        });
// commented 4 a reason, A justIncase function for the close button on the login panel
   //$('.Login>.pop-up>#pop-upbtn').on('click', function () {
        //if ($(event.target).is("#pop-upbtn")) {
           // panels.hide(300);
		 

       // }

    //})
     

    });