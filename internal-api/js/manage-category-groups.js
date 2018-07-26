var categoryGroups = [];

$(document).ready(function() {
    loadTable();
    /*bindEditModal();
    bindModalCancelCallback();*/
    bindFormSubmit();
    //bindDeleteButton();
    bindCreateModal();
    //bindSortButtons();
});


function loadTable() {
    $('#overlay').show();
    var heskUrl = $('p#hesk-path').text();
    var $tableBody = $('#table-body');

    $.ajax({
        method: 'GET',
        url: heskUrl + 'api/index.php/v1/category-groups',
        headers: { 'X-Internal-Call': true },
        success: function(data) {
            $tableBody.html('');

            if (data.length === 0) {
                $tableBody.append('<td colspan="4">' + mfhLang.text('no_category_groups_found') + '</td>');
            }

            var lastElement = undefined;
            var first = true;
            $.each(data, function() {
                var $template = $($('#category-group-row-template').html());

                $template.find('span[data-property="id"]').text(this.id).attr('data-value', this.id);
                var $nameField = $template.find('td[data-property="name"]');
                $nameField.text(this.names[$('input[name="hesk_lang"]').val()]);

                $tableBody.append($template);

                categoryGroups[this.id] = this;

                lastElement = this;

                if (first) {
                    $template.find('[data-direction="up"]').css('visibility', 'hidden');
                    first = false;
                }
            });

            if (lastElement) {
                //-- Hide the down arrow on the last element
                $('[data-value="' + lastElement.id + '"]').parent().parent()
                    .find('[data-direction="down"]').css('visibility', 'hidden');
            }

            $.each(categoryGroups, function() {
                var catId = this.id;
                var parentId = this.parentId;

                console.log(catId);
                console.info(parentId);
            });
        },
        error: function(data) {
            mfhAlert.errorWithLog(mfhLang.text('error_retrieving_category_groups'), data.responseJSON);
            console.error(data);
        },
        complete: function() {
            $('#overlay').hide();
        }
    });
}

function bindEditModal() {
    $(document).on('click', '[data-action="edit"]', function() {
        var element = categories[$(this).parent().parent().find('[data-property="id"]').text()];
        var $modal = $('#category-modal');

        $modal.find('#edit-label').show();
        $modal.find('#create-label').hide();

        $modal.find('input[name="name"]').val(element.name).end()
            .find('select[name="priority"]').val(element.priority).end()
            .find('select[name="manager"]').val(element.manager === null ? 0 : element.manager).end()
            .find('input[name="id"]').val(element.id).end()
            .find('select[name="usage"]').val(element.usage).end()
            .find('input[name="display-border"][value="' + (element.displayBorder ? 1 : 0) + '"]')
                .prop('checked', 'checked').end();

        var backgroundColor = element.backgroundColor;
        var foregroundColor = element.foregroundColor;
        var colorpickerOptions = {
            format: 'hex',
            color: backgroundColor
        };
        $modal.find('input[name="background-color"]')
            .colorpicker(colorpickerOptions).end().modal('show');

        colorpickerOptions = {
            format: 'hex'
        };
        if (foregroundColor !== '' && foregroundColor !== 'AUTO') {
            colorpickerOptions.color = foregroundColor;
        }

        $modal.find('input[name="foreground-color"]')
            .colorpicker(colorpickerOptions).end().modal('show');

        if (foregroundColor === '' || foregroundColor === 'AUTO') {
            $modal.find('input[name="foreground-color"]').colorpicker('setValue', '#fff');
            $modal.find('input[name="foreground-color"]').val('');
        }

        $modal.find('input[name="cat-order"]').val(element.catOrder);
        $modal.find('input[name="autoassign"][value="' + (element.autoAssign ? 1 : 0) + '"]')
            .prop('checked', 'checked');
        $modal.find('input[name="type"][value="' + (element.type ? 1 : 0) + '"]')
            .prop('checked', 'checked');
        $modal.find('textarea[name="description"]').val(element.description === null ? '' : element.description);

        $modal.modal('show');
    });
}

function bindCreateModal() {
    $('#create-button').click(function() {
        var $modal = $('#category-modal');
        $modal.find('#edit-label').hide();
        $modal.find('#create-label').show();

        $modal.find('input[data-type="name"]').val('');
        $modal.find('select[name="parent-category-group"]').val('');
        $modal.find('input[name="id"]').val('-1');

        $modal.modal('show');
    });
}

function bindModalCancelCallback() {
    $('.cancel-callback').click();
}

function bindFormSubmit() {
    $('form#manage-category').submit(function(e) {
        e.preventDefault();
        var heskUrl = $('p#hesk-path').text();

        var $modal = $('#category-modal');
        var names = {};
        $.each($('input[data-type="name"]'), function() {
            names[$(this).attr('name')] = $(this).val();
        });

        var $parentCategoryGroupDropdown = $('select[name="parent-category-group"]');
        var data = {
            names: names,
            parentId: $parentCategoryGroupDropdown.val() !== '' ? parseInt($parentCategoryGroupDropdown.val()) : null
        };

        var url = heskUrl + 'api/index.php/v1/category-groups/';
        var method = 'POST';

        var categoryId = parseInt($modal.find('input[name="id"]').val());
        if (categoryId !== -1) {
            url += categoryId;
            method = 'PUT';
        }

        $modal.find('#action-buttons').find('.cancel-button').attr('disabled', 'disabled');
        $modal.find('#action-buttons').find('.save-button').attr('disabled', 'disabled');

        console.log(data);
        $.ajax({
            method: 'POST',
            url: url,
            headers: {
                'X-Internal-Call': true,
                'X-HTTP-Method-Override': method
            },
            data: JSON.stringify(data),
            success: function(data) {
                var format = undefined;
                if (categoryId === -1) {
                    mfhAlert.success(mfhLang.text('category_group_created'));
                } else {
                    mfhAlert.success(mfhLang.text('category_group_updated'));
                }
                resetModal();
                $modal.modal('hide');
                loadTable();
            },
            error: function(data) {
                mfhAlert.errorWithLog(mfhLang.text('error_saving_updating_category_group'), data.responseJSON);
                console.error(data);
            },
            complete: function(data) {
                $modal.find('#action-buttons').find('.cancel-button').removeAttr('disabled');
                $modal.find('#action-buttons').find('.save-button').removeAttr('disabled');
            }
        });
    });
}

function bindDeleteButton() {
    $(document).on('click', '[data-action="delete"]', function() {
        $('#overlay').show();

        var heskUrl = $('p#hesk-path').text();
        var element = categories[$(this).parent().parent().find('[data-property="id"]').text()];

        $.ajax({
            method: 'POST',
            url: heskUrl + 'api/index.php/v1/categories/' + element.id,
            headers: {
                'X-Internal-Call': true,
                'X-HTTP-Method-Override': 'DELETE'
            },
            success: function() {
                mfhAlert.success(mfhLang.text('cat_removed'));
                loadTable();
            },
            error: function(data) {
                $('#overlay').hide();
                mfhAlert.errorWithLog(mfhLang.text('error_deleting_category'), data.responseJSON);
                console.error(data);
            }
        });
    });
}

function bindSortButtons() {
    $(document).on('click', '[data-action="sort"]', function() {
        $('#overlay').show();
        var heskUrl = $('p#hesk-path').text();
        var direction = $(this).data('direction');
        var element = categories[$(this).parent().parent().parent().find('[data-property="id"]').text()];

        $.ajax({
            method: 'POST',
            url: heskUrl + 'api/index.php/v1-internal/categories/' + element.id + '/sort/' + direction,
            headers: { 'X-Internal-Call': true },
            success: function() {
                loadTable();
            },
            error: function(data) {
                mfhAlert.errorWithLog(mfhLang.text('error_sorting_categories'), data.responseJSON);
                console.error(data);
                $('#overlay').hide();
            }
        })
    });
}