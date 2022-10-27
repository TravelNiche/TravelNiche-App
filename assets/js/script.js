const searchEl = document.querySelector('#search');
const findButtonEl = document.querySelector('#find-button');
const searchResultEl = document.querySelector('#search-result');
const mainContainerEl = document.querySelector('#main-container');
const secondPageEl = document.querySelector('#second-page');


//refreshes the results of autocomplete with every key action
$('#search').on('keyup', function () {
  let sVal = $(this).val();

  if (sVal.length > 2) {
    autoComplete(sVal);
  }
});

let dResult = [];

//autocomplete API
function autoComplete() {
  var requestOptions = {
    method: 'GET',
  };
  fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${searchEl.value}&apiKey=b2c2f48dafc34a22a5defd00c7bf88ff`, requestOptions)
    .then(response => response.json())
    .then(function (data) { //then lists the data to be used
      let dResult = [];
      $('#search-result').html(''); //clears the search result with every key action
      for (let i = 0; i < data.features.length; i++) {
        dResult.push(data.features[i].properties.address_line1 + ', ' + data.features[i].properties.address_line2)
        $('#search-result').append('<option value=' + dResult[i] + '>' + dResult[i] + '</option>');
      }
      $('#search-result').addClass('active');
      console.log(data);
      console.log(dResult);
      console.log(searchEl.value);
    })

    .catch(error => console.log('error', error));
}

//chooses the element from the dropdown and clears the dropdown after selected
$(document).on('click', '#search-result option', function () {
  $('#search').val($(this).text());
  $('#search-result').html();
  $('#search-result').removeClass('active');
})

//searches the location and gets Yelp data
function searchLocation() {
  let yelpAPI = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=${searchEl.value}&attrs=bar`;

  fetch(yelpAPI, {
    headers: { Authorization: 'Bearer 3FBTNebxKSbfJxZAZHGeldEJJ4C2qbP1hcVru2evp3VpDMBukDxQQkShPia8JuYiJuu8aQk1bCuXBGPhscsgO0XjBW4jjMHO_x2lV3TiIqzxnTFxe1H1KGmrqx1XY3Yx' }
  })
    .then(function (response) { //then turns into JavaScript object
      return response.json();
    })
    .then(function (data) { //then lists the data to be used
      console.log(searchEl.value)
      console.log(data);

      for (let i = 0; i < data.businesses.length; i++) {
        let listOfBusinesses = document.createElement('ol');
        secondPageEl.appendChild(listOfBusinesses);
        listOfBusinesses.textContent = data.businesses[i].name; //gets the name of the businesses
        // listOfBusinesses.textContent = data.businesses[i].location.display_address;
      }

    }).catch(error => console.log('error', error));

  // window.location.replace("nextPage.html");
  mainContainerEl.classList.add('hide');
}

let dateRangePickerEl = document.querySelector(`[value="${moment().format('L')}"]`);

$(function () {
  $('input[name="daterange"]').daterangepicker({
    opens: 'left'
  }, function (start, end, label) {
    console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
  });
});


findButtonEl.addEventListener('click', searchLocation);
