(function (window) {
  window.extractData = function () {
    var ret = $.Deferred();

    function onError() {
      console.log("Loading error", arguments);
      ret.reject();
    }

    function onReady(smart) {
      if (!smart.tokenResponse) {
        smart_messaging_origin = "dummy";
      } else {
        if (!smart.tokenResponse.smart_messaging_origin) {
          smart_messaging_origin = smart.tokenResponse.smart_messaging_origin;
        }

        if (
          !smart_messaging_origin &&
          !smart.tokenResponse.cerner_smart_messaging_origin
        ) {
          smart_messaging_origin =
            smart.tokenResponse.cerner_smart_messaging_origin; // Cerner specific change for connectathon
        }
      }

      if (smart.hasOwnProperty("patient")) {
        var patient = smart.patient;
        var pt = patient.read();

        $.when(pt).fail(onError);

        $.when(pt).done(function (patient) {
          var gender = patient.gender;

          var fname = "";
          var lname = "";

          if (typeof patient.name[0] !== "undefined") {
            fname = patient.name[0].given.join(" ");
            lname = patient.name[0].family.join(" ");
          }

          var p = defaultPatient();
          p.birthdate = patient.birthDate;
          p.gender = gender;
          p.fname = fname;
          p.lname = lname;

          ret.resolve(p);
        });
      } else {
        onError();
      }
    }

    FHIR.oauth2.ready(onReady, onError);
    return ret.promise();
  };

  function defaultPatient() {
    return {
      fname: { value: "" },
      lname: { value: "" },
      gender: { value: "" },
      birthdate: { value: "" }
    };
  }

  window.drawVisualization = function (p) {
    $("#holder").show();
    $("#loading").hide();
    $("#fname").html(p.fname);
    $("#lname").html(p.lname);
    $("#gender").html(p.gender);
    $("#birthdate").html(p.birthdate);
  };
})(window);
