$(function() {
	$('.js_error_groups').on('click', 'li', function(e) {
		e.preventDefault();

		window.location = $(this).data('view_url');
	});

	$('.js_tabs').on('click', 'a', function(e) {
		e.preventDefault();

		var a = $(this),
			rel = a.attr('rel');
		$('.js_details').hide();
		$('.js_details[rel="' + rel + '"]').show();

		$('.js_tabs a.current').removeClass('current');
		a.addClass('current');
	});
});

function koggle(elem) {
	elem = document.getElementById(elem);

	if (elem.style && elem.style['display'])
		// Only works with the "style" attr
		var disp = elem.style['display'];
	else if (elem.currentStyle)
		// For MSIE, naturally
		var disp = elem.currentStyle['display'];
	else if (window.getComputedStyle)
		// For most other browsers
		var disp = document.defaultView.getComputedStyle(elem, null).getPropertyValue('display');

	// Toggle the state of the "display" style
	elem.style.display = disp == 'block' ? 'none' : 'block';
	return false;
}