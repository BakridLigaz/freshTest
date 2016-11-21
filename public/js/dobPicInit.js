$(document).ready(function() {
    $.dobPicker({
        daySelector: '#dobday', /* Required */
        monthSelector: '#dobmonth', /* Required */
        yearSelector: '#dobyear', /* Required */
        dayDefault: '', /* Optional */
        monthDefault: '', /* Optional */
        yearDefault: '', /* Optional */
        minimumAge: 18, /* Optional */
        maximumAge: 80 /* Optional */
    });
});
