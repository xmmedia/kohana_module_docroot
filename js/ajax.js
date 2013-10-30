/**
* AJAX methods to deal with the results of AJAX calls
* Helps dealing with errors that may result from an AJAX call, like auth or PHP errors
* Include after xm.js
*/

/**
* Default error messages
*/
xm.ajax_error_msgs = {
	default_msg : 'There was a error loading some of the content on this page.<br>Try reloading the page or contacting an administrator.',
	not_logged_in : 'You are no longer logged in. <a href="/login">Click here to login.</a>',
	timed_out : 'Your login has timed out. To continue using your current login, <a href="/login/timedout">click here to enter your password.</a>',
	not_allowed : 'You do not have the necessary permissions to access some of the functionality on this page.',
	not_found_404 : 'The requested URL was not found.'
};

/**
* ajax error function, will show a red div at the top of the page if there is a problem with any of the ajax on the page
*/
xm.add_ajax_error = function(error) {
	xm.add_message_div(error);
};

/**
* Adds an ajax validation message at the top of the page and hides and existing validation messages
*/
xm.add_ajax_validation_msg = function(return_data) {
	xm.hide_ajax_validation_msgs();
	if (return_data !== null && typeof return_data == 'object' && typeof return_data.validation_msg != 'undefined' && return_data.validation_msg !== '') {
		xm.add_message_div(return_data.validation_msg, 'xm_ajax_validation_msg');
	}
};

/**
 * Creates the div and adds the necessary click functions and body margin-top adjustment.
 */
xm.add_message_div = function(msg, div_class) {
	if (arguments.length == 2) {
		div_class = ' class="' + div_class + '"';
	} else {
		div_class = '';
	}

	var $msg_div = $('<div' + div_class + '><span class="dismiss js_dismiss"><a href="">X</a></span>' + msg + '</div>');

	$('#xm_ajax_errors').append($msg_div);
	$msg_div.slideDown(xm.animate_ajax_body_margin)
		.find('.js_dismiss').on('click', function(e) {
			e.preventDefault();
			$(this).parent().parent().slideUp(function() {
				$(this).remove();
				xm.animate_ajax_body_margin();
			});
		});
};

/**
* Hides existing validation messages within the xm_ajax_errors container
*/
xm.hide_ajax_validation_msgs = function() {
	$('#xm_ajax_errors div.xm_ajax_validation_msg').slideUp(function() {
		$(this).remove();
	});
};

/**
 * Animates the body so it slides up after the removal of a message.
 */
xm.animate_ajax_body_margin = function() {
	$('body').animate({
		marginTop: $('#xm_ajax_errors').height() + 'px'
	}, 'fast', 'linear');
};

/**
* Adds a default message if there is no error_msg in the return_data object
*/
xm.add_default_ajax_error = function(return_data, default_msg) {
	if (arguments.length === 0) {
		return_data = null;
		default_msg = xm.ajax_error_msgs.default_msg;
	} else if (arguments.length == 1) {
		default_msg = xm.ajax_error_msgs.default_msg;
	}

	if (return_data !== null && typeof return_data == 'object' && typeof return_data.error_msg != 'undefined' && return_data.error_msg !== '') {
		xm.add_ajax_error(return_data.error_msg);
	} else {
		xm.add_ajax_error(default_msg);
	}
};

/**
* attach an AJAX error hander to the ajax_error element
*/
$('#xm_ajax_errors').ajaxError(function(event, jqXHR, ajaxSettings, thrownError) {
	if (typeof ajaxSettings.xm_ajax_error_display == 'undefined' || ajaxSettings.xm_ajax_error_display) {
		xm.add_ajax_error(xm.ajax_error_msgs.default_msg);
		if (xm_in_debug) {
			xm.ajax_log_msg('AJAX Error: ' + thrownError);
		}
	}
});

/**
* Call within a ajax success function to deal with the response of an ajax call
*/
xm.process_ajax = function(return_data) {
	if (typeof return_data != 'object' || jQuery.isEmptyObject(return_data)) {
		xm.add_default_ajax_error();
		if (xm_in_debug) {
			xm.ajax_log_msg('JSON data is not parsable');
		}
		return false;
	}

	if (xm_in_debug && typeof return_data.debug_msg != 'undefined' && return_data.debug_msg !== '') {
		xm.add_ajax_error(return_data.debug_msg);
	}

	// check to see if we've received the status, because we need it for the rest
	if (typeof return_data.status == 'undefined') {
		if (xm_in_debug) {
			xm.ajax_log_msg('No status property in JSON data');
		}
		return;
	}

	switch (return_data.status) {
		// successful
		case 1 :
			if (xm_in_debug) {
				xm.ajax_log_msg('AJAX all good');
			}
			return true;
		// not logged in
		case 2 :
			xm.add_default_ajax_error(return_data, xm.ajax_error_msgs.not_logged_in);
			if (xm_in_debug) {
				xm.ajax_log_msg('The user is not logged in');
			}
			return false;
		// timed out
		case 3 :
			xm.add_default_ajax_error(return_data, xm.ajax_error_msgs.timed_out);
			if (xm_in_debug) {
				xm.ajax_log_msg('The user has timed out');
			}
			return false;
		// not allowed (permissions)
		case 4 :
			xm.add_default_ajax_error(return_data, xm.ajax_error_msgs.not_allowed);
			if (xm_in_debug) {
				xm.ajax_log_msg('The user does not have permissions');
			}
			return false;
		// not found 404
		case 5 :
			xm.add_default_ajax_error(return_data, xm.ajax_error_msgs.not_found_404);
			if (xm_in_debug) {
				xm.ajax_log_msg('The page/path could not be found');
			}
			return false;
		// validation error
		case 6 :
			xm.add_ajax_validation_msg(return_data);
			if (xm_in_debug) {
				xm.ajax_log_msg('There was a validation error');
			}
			return false;
		// unknown error
		case 0 :
		default :
			xm.add_default_ajax_error(return_data);
			if (xm_in_debug) {
				if (typeof return_data.debug_msg != 'undefined' && return_data.debug_msg !== '') {
					xm.ajax_log_msg('AJAX Error: ' + return_data.debug_msg);
				} else {
					xm.ajax_log_msg('An unknown error occurred');
				}
			}
			return false;
	} // switch
};

xm.ajax_log_msg = function(msg) {
	try {
		console.log(msg);
	} catch (e) {
		// don't do anything
	}
};