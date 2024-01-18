(function ($) {
    "use strict";

    $('body').on('change', '.js-edit-content-locale', function (e) {
        const val = $(this).val();

        if (val) {
            var url = window.location.origin + window.location.pathname;

            url += (url.indexOf('?') > -1) ? '&' : '?';

            url += 'locale=' + val;

            window.location.href = url;
        }
    });

    $('body').on('click', '.sidebarNavToggle', function (e) {
        e.preventDefault();
        var sidebar = $('#panelSidebar');

        if (sidebar.hasClass('nav-show')) {
            sidebar.removeClass('nav-show');
        } else {
            sidebar.addClass('nav-show');
        }
    });

    // **************************
    // file manager conf

    $('body').on('click', '.panel-file-manager', function (e) {
        e.preventDefault();
        $(this).filemanager('file', {prefix: '/laravel-filemanager'})
    });

    // ********************************************
    // ********************************************
    // date & time piker
    window.resetDatePickers = () => {
        if (jQuery().daterangepicker) {
            const $dateRangePicker = $('.date-range-picker');
            const format1 = $dateRangePicker.attr('data-format') ?? 'YYYY-MM-DD';
            const timepicker1 = !!$dateRangePicker.attr('data-timepicker');
            const drops1 = $dateRangePicker.attr('data-drops') ?? 'down';

            $dateRangePicker.daterangepicker({
                locale: {
                    format: format1,
                    cancelLabel: 'Clear'
                },
                drops: drops1,
                autoUpdateInput: false,
                timePicker: timepicker1,
                timePicker24Hour: true,
                opens: 'right'
            });
            $dateRangePicker.on('apply.daterangepicker', function (ev, picker) {
                $(this).val(picker.startDate.format(format1) + ' - ' + picker.endDate.format(format1));
            });

            $dateRangePicker.on('cancel.daterangepicker', function (ev, picker) {
                $(this).val('');
            });


            const $datetimepicker = $('.datetimepicker');
            const format2 = $datetimepicker.attr('data-format') ?? 'YYYY-MM-DD HH:mm';
            const drops2 = $datetimepicker.attr('data-drops') ?? 'down';

            $datetimepicker.daterangepicker({
                locale: {
                    format: format2,
                    cancelLabel: 'Clear'
                },
                singleDatePicker: true,
                timePicker: true,
                timePicker24Hour: true,
                autoUpdateInput: false,
                drops: drops2,
            });
            $datetimepicker.on('apply.daterangepicker', function (ev, picker) {
                $(this).val(picker.startDate.format('YYYY-MM-DD HH:mm'));
            });

            $datetimepicker.on('cancel.daterangepicker', function (ev, picker) {
                $(this).val('');
            });

            const $datepicker = $('.datepicker');
            const drops3 = $datepicker.attr('data-drops') ?? 'down';

            $datepicker.daterangepicker({
                locale: {
                    format: 'YYYY-MM-DD',
                    cancelLabel: 'Clear'
                },
                singleDatePicker: true,
                timePicker: false,
                autoUpdateInput: false,
                drops: drops3,
            });
            $datepicker.on('apply.daterangepicker', function (ev, picker) {
                $(this).val(picker.startDate.format('YYYY-MM-DD'));
            });

            $datepicker.on('cancel.daterangepicker', function (ev, picker) {
                $(this).val('');
            });
        }
    };
    resetDatePickers();

    var datefilter = $('.datefilter');
    if (datefilter.length) {
        datefilter.daterangepicker({
            singleDatePicker: true,
            timePicker: false,
            autoUpdateInput: false,
            locale: {
                cancelLabel: 'Clear'
            }
        });
    }

    datefilter.on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('YYYY-MM-DD'));
    });

    datefilter.on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });

    // Timepicker
    if (jQuery().timepicker) {
        $(".setTimepicker").each(function (key, item) {
            $(item).timepicker({
                icons: {
                    up: 'chevron-up-icon',
                    down: 'chevron-down-icon'
                },
                showMeridian: false,
            });
        })
    }

    // ********************************************
    // ********************************************
    // inputtags
    if (jQuery().tagsinput) {
        var input_tags = $('.inputtags');
        input_tags.tagsinput({
            tagClass: 'badge badge-primary py-5',
            maxTags: (input_tags.data('max-tag') ? input_tags.data('max-tag') : 10),
        });
    }

    window.panelSearchWebinarSelect2 = () => {
        $('.panel-search-webinar-select2').select2({
            minimumInputLength: 3,
            ajax: {
                url: '/panel/webinars/search',
                dataType: 'json',
                type: "POST",
                quietMillis: 50,
                data: function (params) {
                    var queryParameters = {
                        term: params.term,
                        webinar_id: $(this).data('webinar-id'),
                        option: $(this).data('option')
                    }
                    return queryParameters;
                },
                processResults: function (data) {
                    return {
                        results: $.map(data, function (item) {
                            return {
                                text: item.title,
                                id: item.id
                            }
                        })
                    };
                }
            }
        });
    };
    if ($('.panel-search-webinar-select2').length) {
        panelSearchWebinarSelect2();
    }

    window.panelSearchUserSelect2 = () => {
        $('.panel-search-user-select2').select2({
            placeholder: $(this).data('placeholder'),
            minimumInputLength: 3,
            allowClear: true,
            ajax: {
                url: '/panel/users/search',
                dataType: 'json',
                type: "POST",
                quietMillis: 50,
                data: function (params) {
                    return {
                        term: params.term,
                        option: $('.panel-search-user-select2').attr('data-search-option'),
                    };
                },
                processResults: function (data) {
                    return {
                        results: $.map(data, function (item) {
                            return {
                                text: item.full_name,
                                id: item.id
                            }
                        })
                    };
                }
            }
        });
    };

    $(document).ready(function () {
        if ($('.panel-search-user-select2').length) {
            panelSearchUserSelect2();
        }

        const $sidebarScroll = new SimpleBar(document.getElementById('panel-sidebar-scroll'));
        const $sidebarActiveItem = $('.sidenav-item.sidenav-item-active');

        if ($sidebarScroll && $sidebarActiveItem.length) {
            $sidebarScroll.getScrollElement().scrollTo(0,$sidebarActiveItem.position().top);
        }
    });

    if (jQuery().select2) {
        $(".select2").select2({
            placeholder: $(this).data('placeholder'),
            allowClear: true,
            width: '100%',
        });
    }

    $('body').on('click', '.js-copy', function (e) {
        e.preventDefault();

        const $this = $(this);
        const inputName = $this.attr('data-input');
        const copyText = $this.attr('data-copy-text');
        const doneText = $this.attr('data-done-text');

        const input = $this.closest('.form-group').find('input[name="' + inputName + '"]');

        input.removeAttr('disabled');
        input.focus();
        input.select();
        document.execCommand("copy");

        $this.attr('data-original-title', doneText)
            .tooltip('show');
        $this.attr('data-original-title', copyText);
    });

    $('body').on('change', '.js-panel-list-switch-filter', function (e) {
        $(this).closest('form').trigger('submit');
    });

})(jQuery);
