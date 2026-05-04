function sendMail() {
    $("#result").hide();
    console.log($("#name").val() + "|"  + $("#email").val() + "|" +  $("#locale").val() + "|" + $("#message").val());

    $.post("https://api.yolobook.app/web/send-mail",
        {
            name: $("#name").val(),
            email: $("#email").val(),
            message: $("#message").val(),
            locale: $("#locale").val()
        },
        function(data, status){
            console.log(status + "|" + data);

            if(status === "success"){
                $("#result").show();
                $("#result").text(data);
                $("#send").hide();
                $("#name").val("");
                $("#email").val("");
                $("#message").val("");
            } else {
                console.log("error");
            }



        }).fail(function(response) {
        //$("#result").show().text(response.responseText);
    });
}

