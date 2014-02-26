var tree = {};

$(function() {
	var $tree = $('.js_tree');

	$('.js_add_item').click(function(e) {
		e.preventDefault();

		var $dialog = tree.open_dialog('Add Item', $(this).attr('href'));
	});

	$tree.on('click', '.js_expand, .js_collapse', function(e) {
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
			$link.removeClass('expand js_expand').addClass('collapse js_collapse');
			if ($.inArray(node_id, open_nodes) === -1) {
				open_nodes.push(node_id);
			}
		} else {
			$ul.hide();
			$link.removeClass('collapse js_collapse').addClass('expand js_expand');
			open_nodes.splice($.inArray(node_id, open_nodes), 1);
		}

		$.jStorage.set('tree_open_nodes', open_nodes.join(','));
	});

	$tree.on('click', '.js_no_expand', function(e) {
		e.preventDefault();
	});

	$tree.on('click', '.js_edit_item', function(e) {
		e.preventDefault();

		var $dialog = tree.open_dialog('Edit Item', $(this).attr('href'));
	});

	$tree.on('click', '.js_add_sub_item', function(e) {
		e.preventDefault();

		var $dialog = tree.open_dialog('Add Sub Item', $(this).attr('href'));
	});

	$tree.on('click', '.js_delete_item', function(e) {
		e.preventDefault();

		var $dialog = tree.open_dialog('Delete Item');

		$.getJSON($(this).attr('href'), function(return_data) {
			if (xm.process_ajax(return_data)) {
				$dialog.html(return_data.html)
					.find('input:visible:eq(0)').focus();
				$dialog.find('input[name="delete_confirm"][value="No"]').click(function() {
					$('#js_tree_dialog').dialog('close');
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

	$('.js_expand_all').on('click', function(e) {
		e.preventDefault();
		$('.js_tree .js_expand').click();
	});

	$('.js_collapse_all').on('click', function(e) {
		e.preventDefault();
		$.jStorage.deleteKey('tree_open_nodes');
		$('.js_tree .js_collapse').click();
	});

	// open the tree to the node id in the hash
	// time to 500ms so the expand/collapse icons show correctly
	setTimeout(function() {
		var open_to_node_id = window.location.hash.substring(1);
		if (open_to_node_id != '') {
			var open_node = $('.js_tree li[rel="' + open_to_node_id + '"]'),
				parents_found = open_node;
			if (open_node.hasClass('js_has_children')) {
				open_node.find('.js_expand:eq(0)').click();
			}
			do {
				parents_found = parents_found.parents('.js_has_children');
				parents_found.find('.expand:eq(0)').click();
			} while (parents_found.length > 0);
		}

		var open_nodes = $.jStorage.get('tree_open_nodes', null);
		if (open_nodes != null) {
			$.each(open_nodes.split(','), function(i, node_id) {
				if (node_id != '') {
					$('.js_tree li.js_has_children[rel="' + node_id + '"] .js_expand:eq(0)').click();
				}
			});
		}
	}, 10);
});

tree.open_dialog = function(title, href) {
	$dialog = $('#tree_dialog').dialog({
		title : title,
		autoOpen : true,
		modal : true,
		height : 300,
		minHeight : 300,
		width : 450,
		minWidth : 450,
		buttons: {
			'Close': function() {
				$(this).dialog('close');
			}
		}
	}).html('<span class="glyphicons refresh spin"></span> Loading...');

	if (typeof href != 'undefined') {
		$.getJSON(href, function(return_data) {
			if (xm.process_ajax(return_data)) {
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