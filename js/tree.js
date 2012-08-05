$(function() {
	var $tree = $('.tree');

	$('.add_item').click(function(e) {
		e.preventDefault();

		var $dialog = open_dialog('Add Item');
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

		var $dialog = open_dialog('Edit Item');
	});

	$tree.delegate('.delete_item', 'click', function(e) {
		e.preventDefault();

		var $dialog = open_dialog('Delete Item');
	});

	$tree.delegate('.add_sub_item', 'click', function(e) {
		e.preventDefault();

		var $dialog = open_dialog('Add Sub Item');
	});
});

var open_dialog = function(title) {
	return $('#tree_dialog').dialog({
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
}