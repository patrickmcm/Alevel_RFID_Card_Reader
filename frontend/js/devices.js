$(document).ready(function(){
  $('#addDeviceForm').submit(function(e) {
      e.preventDefault();
      var form = $(this);
      var url = form.attr('action');
      $.ajax({
          type: "POST",
          dataType : "json",
          contentType: "application/json; charset=utf-8",
          url: url,
          data: JSON.stringify({
              data: {
                  name: $('#deviceName').val(),
                  location: $('#deviceLocation').val(),
                  otc: $('#otc').val()
              }
          }),
          success: function(data) {
              Swal.fire({
                  title:"Request Successful",
                  text: "Device added successfully.",
                  icon:"success",
                  padding:"30px",
              }).then(() => {
                  window.location.href = "/devices";
              });
          },
          error: function(data) {
              console.log(data.responseJSON)

              let errorMsg;
              switch (data.responseJSON.error) {
                  case "BAD_CODE":
                      errorMsg = "Invalid OTC.";
                      break;
                  case "NULL_PARAMS":
                      errorMsg = "Please fill in all the fields.";
                      break;
                  case "ALR_REG":
                      errorMsg = "This device is already registered.";
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