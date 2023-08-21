(function($) {
    'use strict';
    $(function() {
        $("#addDeviceForm").submit(function(e) {
            e.preventDefault();
        });
      $("#submitDevice").on("click", function() {
        Swal.fire({
            title:"Request Successful",
            text: "Device Added",
            icon:"success",
            padding:"30px"
        })
      });
    });
  })(jQuery);