jQuery(document).ready(function () {
	 $(".container>.sidebar>.SideBarBtn").click(function () {
        $('.container>.sidebar').toggleClass('active');
        $('.container>.sidebar.active>.SideBarBtn').toggleClass('toogle');
    })
});