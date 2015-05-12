//-- Activate anything Mods for HESK needs, such as tooltips.
var loadJquery = function()
{
    //-- Activate tooltips
    $('[data-toggle="tooltip"]').tooltip({
        container: 'body'
    });

    //-- Activate popovers
    $('[data-toggle="popover"]').popover({
        trigger: 'hover',
        container: 'body'
    });

    //-- Activate HTML popovers
    $('[data-toggle="htmlpopover"]').popover({
        trigger: 'hover',
        container: 'body',
        html: 'true'
    });

    //-- Activate jQuery's date picker
    $(function() {
        $('.datepicker').datepicker({
            todayBtn: "linked",
            clearBtn: true,
            autoclose: true,
            autoclose: true,
            todayHighlight: true,
            format: "yyyy-mm-dd"
        });
    });

    $('[data-toggle="iconpicker"]').iconpicker({
        iconset: ['fontawesome', 'octicon'],
        selectedClass: "btn-warning",
        labelNoIcon: $('#no-icon').text(),
        searchText: $('#search-icon').text(),
        labelFooter: $('#footer-icon').text()
    });
};

var setIcon = function(icon) {
    $('[data-toggle="iconpicker"]').iconpicker('setIcon', icon);
}

function selectAll(id) {
    $('#' + id + ' option').prop('selected', true);
}

function deselectAll(id) {
    $('#' + id + ' option').prop('selected', false);
}

function toggleRow(id) {
    if ($('#' + id).hasClass('danger'))
    {
        $('#' + id).removeClass('danger');
    } else
    {
        $('#' + id).addClass('danger');
    }
}

function toggleChildrenForm(show) {
    if (show) {
        $('#childrenForm').show();
        $('#addChildText').hide();
    } else {
        $('#childrenForm').hide();
        $('#addChildText').show();
    }
}

function toggleContainers(showIds, hideIds) {
    showIds.forEach(function (entry) {
        $('#' + entry).show();
    });
    hideIds.forEach(function (entry) {
        $('#' + entry).hide();
    });
}

function disableIfEmpty(sourceId, destinationId) {
    if ($('#' + sourceId).val().length > 0) {
        $('#' + destinationId).attr('disabled', false);
    } else {
        if ($('#' + destinationId).is(':checkbox')) {
            $('#' + destinationId).attr('checked', false);
        }
        $('#' + destinationId).attr('disabled', true);
    }
}

function changeText(id, checkedValue, uncheckedValue, object) {
    if (object.checked) {
        $('#'+id).text(checkedValue);
    } else {
        $('#'+id).text(uncheckedValue);
    }
}

jQuery(document).ready(loadJquery);
