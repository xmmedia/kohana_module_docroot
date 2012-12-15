var content_admin_edit = null;

$(function() {
	$('.content_admin_edit').on('click', function(e) {
		e.preventDefault();
		if (content_admin_edit == null || content_admin_edit.closed) {
			content_admin_edit = window.open($(this).attr('href'), 'content_admin_edit', 'width=900,height=750,location=yes,resizable=yes,scrollbars=yes,status=yes,dependent=yes');
			if (content_admin_edit == null) {
				alert('There was a problem opening the edit window. Please use the content admin page to change the content.');
			}
		} else {
			content_admin_edit.location.href = $(this).attr('href');
			content_admin_edit.focus();
		}
	});
});