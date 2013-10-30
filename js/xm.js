// create the xm object
var xm = {};

// stores the count of the number of records checked
xm.multiple_edit_count = 0;

/**
* Set the form action based on the source button input data-xm_form_action parameter.
* This is used when you click on the top row buttons in editable list (eg. Search, Add New, Edit Selected, etc.)
*/
xm.button_link_form = function() {
	var button_form_action = $(this).data('xm_form_action'),
		form,
		form_target;
	if (button_form_action) {
		form = $(this.form);
		form.attr('action', button_form_action);

		// check to see if we have a target
		// if we don't, "unset" the target on the form
		form_target = $(this).data('xm_form_target');
		if (form_target) {
			form.attr('target', form_target);
		} else {
			form.attr('target', '');
		}
	}
};

/**
* Go to another URL based on the data-xm_link parameter
*/
xm.button_link = function() {
	var link = $(this).data('xm_link');
	if (link) {
		window.location = link;
	}
};

xm.multiple_edit = function() {
	// do some checking to make sure records are checked
};

xm.export_selected = function() {
	// do some checking to make sure records are checked
};

/**
* For adding multiple records, uses xm_add_multiple_related_button on the select and xm_add_multiple_form_action_prefix on the button
*/
xm.add_multiple_form = function() {
	var count_select = $(this),
		// unfortunately we "have" to use an ID because there is the possibility of there being multiple buttons on the same page
		add_multiple_button = $('#' + count_select.data('xm_add_multiple_related_button')),
		add_multiple_form_action_prefix = add_multiple_button.data('xm_add_multiple_form_action_prefix');
	add_multiple_button.data('xm_form_action', add_multiple_form_action_prefix + '/' + count_select.val());
};

/**
* Determines if the multiple edit buttons should be disabled or not based on the checkboxes checked in the form.
*/
xm.multiple_edit_form = function() {
	if ($('.js_xm_multiple_edit_form_checkbox:checked').length > 0) {
		// checkboxes have been checked, so remove the disabled attributed
		$('.js_xm_multiple_edit, .js_xm_export_selected').removeAttr('disabled');
	} else {
		// no checkboxes have been checked, so add the disabled attribute
		$('.js_xm_multiple_edit, .js_xm_export_selected').attr('disabled', 'disabled');
	}
};

/**
* Checks all the checkboxes that have the class found in the data attribute data-xm_check_all_checkbox_class
*/
xm.check_all_checkbox = function() {
	var checkbox = $(this);
	if (checkbox.filter(':checked').length > 0) {
		// trigger change so that any functionality related to the checkbox changing value will be triggered
		$('.' + checkbox.data('xm_check_all_checkbox_class')).attr('checked', 'checked').change();
	} else {
		$('.' + checkbox.data('xm_check_all_checkbox_class')).removeAttr('checked').change();
	}
};

/**
* Adds the class selected to the row when the checkbox is checked
*/
xm.row_checked = function() {
	if ($(this).attr('checked')) {
		$(this).parents('tr').addClass('selected');
	} else {
		$(this).parents('tr').removeClass('selected');
	}
};

/**
* When the model is changed or the go button is clicked at the top of the page this will be triggered
* Redirects the user to the selected model
*/
xm.model_select_change = function() {
	window.location = '/dbadmin/' + $('#xm_model_select').val() + '/index';
};

if (typeof $.datepicker != 'undefined') {
	// defaults for the date picker; these are necessary so the date picker within xm work
	$.datepicker.setDefaults({
		dateFormat: 'yy-mm-dd',
		buttonImage: '/xm/images/calendar.gif',
		buttonImageOnly: true
	});
}

$(function() {
	if (typeof $.datepicker != 'undefined') {
		// adding the date picker to date fields
		$('.js_xm_date_field-date').datepicker();
	}

	// buttons and checkbox at the top of an editable list
	$('.js_xm_button_link_form').on('click', xm.button_link_form);
	$('.js_xm_button_link').on('click', xm.button_link);
	$('.js_xm_multiple_edit').on('click', xm.multiple_edit);
	$('.js_xm_export_selected').on('click', xm.export_selected);
	$('.js_xm_multiple_edit_form').on('change', xm.multiple_edit_form);
	$('.js_xm_check_all_checkbox').on('click', xm.check_all_checkbox);
	$('.xm_add_multiple_count').on('change', xm.add_multiple_form);

	// for checkboxes in tables to add .selected to the row
	$('.js_xm_row_checkbox').on('change', xm.row_checked);

	// found in views/xm/db_admin/header.php
	$('.js_xm_model_select_form').on('change', xm.model_select_change);
	$('.js_xm_model_select_go').on('click', xm.model_select_change);
});