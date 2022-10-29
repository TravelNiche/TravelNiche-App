const searchEl = document.querySelector('#search');
const findButtonEl = document.querySelector('#find-button');
const searchResultEl = document.querySelector('#search-result');
const mainContainerEl = document.querySelector('#main-container');
const secondPageEl = document.querySelector('#second-page');
const barStatusEl = document.querySelector('#bar-status');
const backButtonEl = document.querySelector('#back-button');
const backgroundBeerEl = document.querySelector('#background-beer');



let barName = [];
let barPhoneNumber = [];
let barPrice = [];
let barRating = [];
let barURL = [];
let barIsClosed = [];
let barStatus;
let barImage = [];
let barAddress = [];
let businessCard;
let dropdown;




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
  let yelpAPI = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=${searchEl.value}`;
  

  fetch(yelpAPI, {
    headers: { Authorization: 'Bearer 3FBTNebxKSbfJxZAZHGeldEJJ4C2qbP1hcVru2evp3VpDMBukDxQQkShPia8JuYiJuu8aQk1bCuXBGPhscsgO0XjBW4jjMHO_x2lV3TiIqzxnTFxe1H1KGmrqx1XY3Yx' }
  })
    .then(function (response) { //then turns into JavaScript object
      return response.json();
    })
    .then(function (data) { //then lists the data to be used
      console.log(searchEl.value)
      console.log(data);
      backButtonEl.classList.remove('hide');


      for (let i = 0; i < data.businesses.length; i++) {
       
        for (let j = 0; j < data.businesses[i].categories.length; j++) {
          if (data.businesses[i].categories[j].title.includes('Bars')) {

            barName[j] = data.businesses[i].name;
            barPhoneNumber[j] = data.businesses[i].display_phone;
            barPrice[j] = data.businesses[i].price;
            barRating[j] = data.businesses[i].rating;
            barURL[j] = data.businesses[i].url;
            barIsClosed[j] = data.businesses[i].is_closed;
            barImage[j] = data.businesses[i].image_url;
            barAddress[j] = data.businesses[i].location.display_address[0] + ' ' + data.businesses[i].location.display_address[1];

            let listOfBusinesses = document.createElement('div');
            secondPageEl.appendChild(listOfBusinesses);
            listOfBusinesses.textContent = barName[j] + barPhoneNumber[j] + barPrice[j] + barRating[j] + barURL[j] + barIsClosed[j] + barImage[j] + barAddress[j]; //gets the name of the businesses

            if (barIsClosed) {
              barStatus = 'Open Now';
            }else{
              barStatus = 'Closed';
            }

            //Card creation using BootStrap
            businessCard = 
          `<div class="card" style="width: 18rem;">
            <img class="card-img-top" src="${barImage[j]}" alt="Business Image">
            <div class="card-body">
              <h5 class="card-title">${barName[j]}</h5>
              <p class="card-text">${barAddress[j]}</p>
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">${barPrice[j] + ' - ' + ' ' + getStars(barRating[j]) + barRating[j]}</li>
              <li id='bar-status' class="list-group-item">${barStatus}</li>
              <li class="list-group-item">${barPhoneNumber[j]}</li>
            </ul>
            <div class="card-body">
              <a style='text-decoration: none' href="${barURL[j]}" target="_blank" class="card-link">See in Yelp</a>
            </div>
          </div>`;
          
          listOfBusinesses.innerHTML = businessCard;
          secondPageEl.appendChild(listOfBusinesses);

          dropdown = 
          `<div class="dropdown">
          <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Dropdown
          </button>
          <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
            <button class="dropdown-item" type="button">Action</button>
            <button class="dropdown-item" type="button">Another action</button>
            <button class="dropdown-item" type="button">Something else here</button>
          </div>
        </div>`;
          }
        
          //function to get star symbols
          function getStars(rating) {
          
            // Round to nearest half
            rating = Math.round(rating * 2) / 2;
            let output = [];
          
            // Append all the filled whole stars
            for (var i = rating; i >= 1; i--)
              output.push('<i class="fa fa-star" aria-hidden="true" style="color: gold;"></i>&nbsp;');
          
            // If there is a half a star, append it
            if (i == .5) output.push('<i class="fa fa-star-half-o" aria-hidden="true" style="color: gold;"></i>&nbsp;');
          
            // Fill the empty stars
            for (let i = (5 - rating); i >= 1; i--)
              output.push('<i class="fa fa-star-o" aria-hidden="true" style="color: gold;"></i>&nbsp;');
          
            return output.join('');
          
          }
          
          
        }
      }

    }).catch(error => console.log('error', error));

  // window.location.replace("nextPage.html");
  mainContainerEl.classList.add('hide');
  backgroundBeerEl.classList.add('hide');
}

// //date picker
// let dateRangePickerEl = document.querySelector(`[value="${moment().format('L')}"]`);
// $(function () {
//   $('input[name="daterange"]').daterangepicker({
//     opens: 'left'
//   }, function (start, end, label) {
//     console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
//   });
// });

function goBack() {
  window.location.reload();
}


findButtonEl.addEventListener('click', searchLocation);
backButtonEl.addEventListener('click', goBack);

