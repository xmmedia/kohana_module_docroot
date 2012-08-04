$(function() {
	$('.tree .expand, .tree .collapse').click(function(e) {
		e.preventDefault();

		var $link = $(this),
			expand = $link.hasClass('expand'),
			$ul = $link.closest('li').find('> ul');

		if (expand) {
			$ul.show();
			$link.removeClass('expand').addClass('collapse');
		} else {
			$ul.hide();
			$link.removeClass('collapse').addClass('expand');
		}
	});
});