$(document).ready(function () {

    // init Isotope
    var $grid = $('.grid').isotope({
        // options
    });

    var filterValStart = $($('.filter-button-group').children('.btn')[1]).attr('data-filter');

    $grid.isotope({ filter: filterValStart });

    // filter items on button click
    $('.filter-button-group').on( 'click', 'button', function() {
        var filterValue = $(this).attr('data-filter');
        // console.log(this);

        $('.filter-button-group').children('.btn').removeClass('active');

        $(this).toggleClass('active');
        $grid.isotope({ filter: filterValue });
    });

});
