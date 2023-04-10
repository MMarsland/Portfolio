$(function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (urlParams.has('form') && urlParams.get('product') == "success") {
        $('#success').html("<div class='alert alert-success'>");
        $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                .append("</button>");
        $('#success > .alert-success')
                .append("<strong>Your message has been sent. Thank you for contacting me! </strong>");
        $('#success > .alert-success')
                .append('</div>');
        $('#contactForm').trigger("reset");
    }

    // error: function () {
    //     $('#success').html("<div class='alert alert-danger'>");
    //     $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
    //             .append("</button>");
    //     $('#success > .alert-danger').append($("<strong>").text("Sorry " + name + ", it seems that our mail server is not responding. Please try again later!"));
    //     $('#success > .alert-danger').append('</div>');
    //     $('#contactForm').trigger("reset");
    // }

    // idk what this does...
    $("a[data-toggle=\"tab\"]").click(function (e) {
        e.preventDefault();
        $(this).tab("show");
    });
});

$('#name').focus(function () {
    $('#success').html('');
});
