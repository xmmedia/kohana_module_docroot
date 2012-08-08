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
			node_id = $link.attr('rel'),
			$ul = $link.closest('li').find('> ul'),
			open_nodes,
			_open_nodes = $.jStorage.get('tree_open_nodes', null);

		if (_open_nodes != null) {
			open_nodes = _open_nodes.split(',');
		} else {
			open_nodes = [];
		}

		if (expand) {
			$ul.show();
			$link.removeClass('expand').addClass('collapse');
			if ($.inArray(node_id, open_nodes) === -1) {
				open_nodes.push(node_id);
			}
		} else {
			$ul.hide();
			$link.removeClass('collapse').addClass('expand');
			open_nodes.splice($.inArray(node_id, open_nodes), 1);
		}

		$.jStorage.set('tree_open_nodes', open_nodes.join(','));
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
		$.jStorage.deleteKey('tree_open_nodes');
		$('.tree .collapse').click();
	});

	// open the tree to the node id in the hash
	// time to 500ms so the expand/collapse icons show correctly
	setTimeout(function() {
		var open_to_node_id = window.location.hash.substring(1);
		if (open_to_node_id != '') {
			var open_node = $('.tree li[rel="' + open_to_node_id + '"]'),
				parents_found = open_node;
			if (open_node.hasClass('has_children')) {
				open_node.find('.expand:eq(0)').click();
			}
			do {
				parents_found = parents_found.parents('.has_children');
				parents_found.find('.expand:eq(0)').click();
			} while (parents_found.length > 0);
		}

		var open_nodes = $.jStorage.get('tree_open_nodes', null);
		if (open_nodes != null) {
			$.each(open_nodes.split(','), function(i, node_id) {
				if (node_id != '') {
					$('.tree li.has_children[rel="' + node_id + '"] .expand:eq(0)').click();
				}
			});
		}
	}, 10);
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