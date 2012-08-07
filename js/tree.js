$(function() {
	var $tree = $('.tree');

	$('.add_item').click(function(e) {
		e.preventDefault();

		var $dialog = open_dialog('Add Item', $(this).attr('href'));
	});

	$tree.delegate('.expand, .collapse', 'click', function(e) {
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

	$tree.delegate('.no_expand', 'click', function(e) {
		e.preventDefault();
	});

	$tree.delegate('.edit_item', 'click', function(e) {
		e.preventDefault();

		var $dialog = open_dialog('Edit Item', $(this).attr('href'));
	});

	$tree.delegate('.add_sub_item', 'click', function(e) {
		e.preventDefault();

		var $dialog = open_dialog('Add Sub Item', $(this).attr('href'));
	});

	$tree.delegate('.delete_item', 'click', function(e) {
		e.preventDefault();

		var $dialog = open_dialog('Delete Item');

		$.getJSON($(this).attr('href'), function(return_data) {
			if (cl4.process_ajax(return_data)) {
				$dialog.html(return_data.html)
					.find('input:visible:eq(0)').focus();
				$dialog.find('input[name="delete_confirm"][value="No"]').click(function() {
					$('#tree_dialog').dialog('close');
				});
				$dialog.dialog('option', {
					buttons : {
						Close : function() {
							$(this).dialog('close');
						}
					}
				});
			// validation error or html was returned
			} else if (return_data.status == 6 || typeof return_data.html != 'undefined') {
				$dialog.html(return_data.html);
			} else {
				$dialog.html('An error occurred. Please try again.');
			}
		});
	});

	$('.expand_all').click(function(e) {
		e.preventDefault();
		$('.tree .expand').click();
	});

	$('.collapse_all').click(function(e) {
		e.preventDefault();
		$('.tree .collapse').click();
	});
});

var open_dialog = function(title, href) {
	$dialog = $('#tree_dialog').dialog({
		title : title,
		autoOpen : true,
		height: 400,
		minHeight: 400,
		width: 450,
		minWidth: 450,
		buttons: {
			'Close': function() {
				$(this).dialog('close');
			}
		}
	}).html('<img src="/images/loading.gif"> Loading...');

	if (typeof href != 'undefined') {
		$.getJSON(href, function(return_data) {
			if (cl4.process_ajax(return_data)) {
				$dialog.html(return_data.html)
					.find('input:visible:eq(0)').focus();
				$dialog.dialog('option', {
					buttons : {
						Save : function() {
							$(this).find('form').submit();
						},
						Close : function() {
							$(this).dialog('close');
						}
					}
				});
			// validation error or html was returned
			} else if (return_data.status == 6 || typeof return_data.html != 'undefined') {
				$dialog.html(return_data.html);
			} else {
				$dialog.html('An error occurred. Please try again.');
			}
		});
	}

	return $dialog;
}