$(function() {
	// on change of the compare to select, submit the form, refreshing the page
	$('.js_compare_to').on('change', function() {
		$(this).closest('form').submit();
	});

	// show hide the content changes in the content admin diff view
	$('.js_content_admin_hide_changes').on('click', function(e) {
		e.preventDefault();

		var bkg_colour,
			link = $(this);

		if ($('.diff-html-removed').css('display') == 'none') {
			bkg_colour = '#82ff6e';
			link.html('Hide Changes');
		} else {
			bkg_colour = '#fff';
			link.html('Show Changes');
		}

		$('.diff-html-added').css('background-color', '#fff');
		$('.diff-html-removed').toggle();
	});

	// show hide the full content area
	$('.js_content_admin_show_content').on('click', function(e) {
		e.preventDefault();

		var link = $(this),
			full_content = $('.js_content_diff_all[rel="' + link.attr('rel') + '"]');
		full_content.slideToggle(function() {
			if ($(this).is(':visible')) {
				link.html('Hide ' + link.data('name'));
			} else {
				link.html('Show ' + link.data('name'));
			}
		});
	});

	// view the content of the history item
	$('.js_content_history').on('click', '.js_history_view', function(e) {
		e.preventDefault();

		var dialog = $('#js_content_admin_dialog').dialog({
			title : 'View Version',
			modal : true,
			width : 750,
			height : 500,
			buttons : {
				Close : function() {
					$(this).dialog('close');
				}
			}
		}).html(xm.spinner + ' Loading...');

		$.getJSON($(this).attr('href'), function(return_data) {
			if (xm.process_ajax(return_data)) {
				dialog.html(return_data.html);
			} else {
				dialog.html(return_data.error_msg);
				setTimeout("$('#js_content_admin_dialog').dialog('close');", 2000);
			}
		});

	// restore a past history item
	}).on('click', '.js_restore', function(e) {
		if ( ! confirm('Are you sure you want to restore this version?')) {
			e.preventDefault();
		}
	});

	$('.js_show_style_guide').on('click', function(e) {
		e.preventDefault();

		var link = $(this),
			style_guide = $('.js_content_style_guide');

		if (style_guide.is(':visible')) {
			style_guide.slideUp();
			link.html('Show Style Guide');
		} else {
			style_guide.slideDown();
			link.html('Hide Style Guide');
		}
	});
});