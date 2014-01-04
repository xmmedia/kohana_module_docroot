$(function() {
	$('.js_error_groups').on('click', 'li', function() {
		window.location = $(this).data('view_url');
	});

	$('.js_tabs').on('click', 'a', function(e) {
		e.preventDefault();

		var rel = $(this).attr('rel');
		$('.js_details').hide();
		$('.js_details[rel="' + rel + '"]').show();
	});
});