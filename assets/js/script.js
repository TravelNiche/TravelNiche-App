function activatePlacesSearch() {
    let datePickerEl = document.querySelector('#search');
    let autoComplete = new google.maps.places.Autocomplete(datePickerEl);
}

let dateRangePickerEl = document.querySelector(`[value="${moment().format('L')}"]`);


$(function() {
    $('input[name="daterange"]').daterangepicker({
      opens: 'left'
    }, function(start, end, label) {
      console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
    });
  });
