function activatePlacesSearch() {
    let datePickerEl = document.querySelector('#search');
    // let autoComplete = new google.maps.places.Autocomplete(datePickerEl);
}

let yelpAPI = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/autocomplete?text=bars`;


fetch(yelpAPI, {
    headers: {Authorization: 'Bearer 3FBTNebxKSbfJxZAZHGeldEJJ4C2qbP1hcVru2evp3VpDMBukDxQQkShPia8JuYiJuu8aQk1bCuXBGPhscsgO0XjBW4jjMHO_x2lV3TiIqzxnTFxe1H1KGmrqx1XY3Yx'}
})
    .then(function (response) { //then turns into JavaScript object
        return response.json();
    })
    .then(function (data) { //then lists the data to be used
        console.log(data);
})


let dateRangePickerEl = document.querySelector(`[value="${moment().format('L')}"]`);


$(function() {
    $('input[name="daterange"]').daterangepicker({
      opens: 'left'
    }, function(start, end, label) {
      console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
    });
  });
