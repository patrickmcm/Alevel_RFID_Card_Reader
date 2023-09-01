$(document).ready(function(){
    $('#login-form').submit(function(e) {
        e.preventDefault();
        var form = $(this);
        var url = form.attr('action');
        // serialize() encodes the form data into a query string format
        $.ajax({
            type: "POST",
            dataType : "json",
            contentType: "application/json; charset=utf-8",
            url: url,
            data: JSON.stringify({
                data: {
                    email: $('#InputEmail').val(),
                    password: $('#InputPassword').val()
                }
            }),
            success: function(data) {
                // if the data is true, then redirect to the home page
                window.location.href = "/";
            },
            error: function(data) {
                console.log(data.responseJSON)

                let errorMsg;
                switch (data.responseJSON.error) {
                    case "LOGGED_IN":
                        errorMsg = "You are already logged in.";
                        break;
                    case "NULL_PARAMS":
                        errorMsg = "Please fill in all the fields.";
                        break;
                    case "USER_NOT_FOUND":
                        errorMsg = "This email is not registered.";
                        break;
                    case "BAD_PASS":
                        errorMsg = "Incorrect password.";
                        break;
                    default:
                        errorMsg = "An unknown error has occurred.";
                        break;
                }
                Swal.fire({
                    title:"Request Unsuccessful",
                    text: errorMsg,
                    icon:"error",
                    padding:"30px",
                    
                })
            }
        });
    });
});  