//Query elements are created
const searchEl = document.querySelector('#search');
const findButtonEl = document.querySelector('#find-button');
const searchResultEl = document.querySelector('#search-result');
const mainContainerEl = document.querySelector('#main-container');
const secondPageEl = document.querySelector('#second-page');
const barStatusEl = document.querySelector('#bar-status');
const backButtonEl = document.querySelector('#back-button');
const backgroundBeerEl = document.querySelector('#background-beer');
const cardContainerEl = document.querySelector('#card-container');
const checklistContainerEl = document.querySelector('#checklist-container');
const cityListEl = document.querySelector('#city-list');
const recentSearchEl = document.querySelector('#recent-search');

//Defining as Global Variables
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
let checklist;
let price;
let isPriceClicked = false;
let citiesLocal;
let cityNames;
let cityListLocal = [];
let dResult = [];


//Refreshes the results of autocomplete with every key action
$('#search').on('keyup', function () {
  let sVal = $(this).val();

  if (sVal.length > 2) {
    autoComplete(sVal);
  }
});


//Geoapify Autocomplete Location API
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

//Chooses the element from the dropdown and clears the dropdown after selected
$(document).on('click', '#search-result option', function () {
  $('#search').val($(this).text());
  $('#search-result').html();
  $('#search-result').removeClass('active');
})

//Searches the location and gets Yelp data using Yelp Fusion API - Follow the Heroku guide in the console to temporary access the API
function searchLocation() {

  let yelpAPI = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=${searchEl.value}`;

  if (isPriceClicked) {
    yelpAPI = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=${searchEl.value}&price=${price}`;
  }

  //If statement controls if the searchEl is empty or not to help creating buttons
  if (searchEl.value == '') {
    return;
  } else {
    cityListEl.innerHTML = '';
    citiesLocal = localStorage.setItem(searchEl.value, '');
    createButtons();

  }


  fetch(yelpAPI, {
    headers: { Authorization: 'Bearer 3FBTNebxKSbfJxZAZHGeldEJJ4C2qbP1hcVru2evp3VpDMBukDxQQkShPia8JuYiJuu8aQk1bCuXBGPhscsgO0XjBW4jjMHO_x2lV3TiIqzxnTFxe1H1KGmrqx1XY3Yx' }
  })
    .then(function (response) { //then turns into JavaScript object
      return response.json();
    })
    .then(function (data) { //then lists the data to be used
      console.log(searchEl.value)
      console.log(data);
      cardContainerEl.innerHTML = '';
      checklistContainerEl.innerHTML = '';

      //If the search box is not empty, prints go back button and checkboxes
      if (searchEl.value !== '') {

        backButtonEl.classList.remove('hide');

        //Checklist Creation Using Bulma
        let checklistContainer = document.createElement('div');
        secondPageEl.appendChild(checklistContainer);

        checklist =
          `<input id='1' class='check' type="checkbox">
        $

        <input id='2' class='check' type="checkbox">
       $$

        <input id='3' class='check' type="checkbox">
        $$$

        <input id='4' class='check' type="checkbox">
        $$$$
      `;

        checklistContainer.innerHTML = checklist;
        secondPageEl.appendChild(checklistContainer);
        checklistContainerEl.appendChild(checklistContainer);
      }

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


            // listOfBusinesses.textContent = barName[j] + barPhoneNumber[j] + barPrice[j] + barRating[j] + barURL[j] + barIsClosed[j] + barImage[j] + barAddress[j]; //gets the details of the businesses

            // if (barIsClosed) {
            //   barStatus = 'Open Now';
            // }else{
            //   barStatus = 'Closed';
            // }

            //Card creation using BootStrap 5.2.2 and Bulma
            businessCard =
              `<div class="card" style="width: 22rem;">
            <img class="card-img-top" src="${barImage[j]}" alt="Business Image">
            <div class="card-body">
              <h5 class="card-title">${barName[j]}</h5>
              <p class="card-text">${barAddress[j]}</p>
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">${barPrice[j] + ' - ' + ' ' + getStars(barRating[j]) + barRating[j]}</li>
              <li class="list-group-item">${barPhoneNumber[j]}</li>
            </ul>
            <div class="card-body">
              <a style='text-decoration: none' href="${barURL[j]}" target="_blank" class="card-link">See in Yelp</a>
            </div>
          </div>`;


            listOfBusinesses.innerHTML = businessCard;
            secondPageEl.appendChild(listOfBusinesses);
            cardContainerEl.appendChild(listOfBusinesses);

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
            if (i == .5) output.push('<i class="fa fa-star-half" aria-hidden="true" style="color: gold;"></i>&nbsp;');

            // Fill the empty stars
            for (let i = (5 - rating); i >= 1; i--)
              output.push('<i class="fa fa-star-o" aria-hidden="true" style="color: gold;"></i>&nbsp;');

            return output.join('');

          }

        }

      }
      //only one checkbox is selected
      $('input.check').on('change', function () {
        $('input.check').not(this).prop('checked', false);
      });

      mainContainerEl.classList.add('hide');
      backgroundBeerEl.classList.add('hide');

      //Gets the click data from checkboxes and refreshes the search again for each price range selector
      $(document).on('click', '#1', function () {
        isPriceClicked = true;
        price = 1;
        searchLocation();
      })
      $(document).on('click', '#2', function () {
        isPriceClicked = true;
        price = 2;
        searchLocation();
      })
      $(document).on('click', '#3', function () {
        isPriceClicked = true;
        price = 3;
        searchLocation();
      })
      $(document).on('click', '#4', function () {
        isPriceClicked = true;
        price = 4;
        searchLocation();
      })


    }).catch(error => console.log('error', error));


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

//Takes the user to the home page
function goBack() {
  window.location.reload();
}


//Modal Creation Using Bulma
document.addEventListener('DOMContentLoaded', () => {


  // Functions to open and close a modal
  function openModal($el) {
    if (searchEl.value !== '') {
      return;
    }
    $el.classList.add('is-active');

  }

  function closeModal($el) {
    $el.classList.remove('is-active');
  }

  function closeAllModals() {
    (document.querySelectorAll('.modal') || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener('click', () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
    const $target = $close.closest('.modal');

    $close.addEventListener('click', () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener('keydown', (event) => {
    const e = event || window.event;

    if (e.keyCode === 27) { // Escape key
      closeAllModals();
    }
  });

});

//Create city buttons from localStorage
function createButtons() {
  cityNames = Object.keys(localStorage);

  //Buttons are created dynamically and class 'button' are added dynamically
  for (let i = 0; i < localStorage.length; i++) {
    cityListLocal[i] = cityNames[i];
    cityButton = document.createElement('button');
    cityButtonEl = cityButton.classList.add('button');
    cityButton.onclick = function () { getButtonValue(this) }; //Runs the getButtonValue(), if a city is clicked
    cityButtonEl = cityListEl.appendChild(cityButton);
    cityButtonEl.textContent = cityListLocal[i];
  }
}

//Init function
createButtons();

//Gets the text data from the buttons and refreshes the search 
function getButtonValue(value) {
  var buttonValue = value.innerHTML;
  searchEl.value = buttonValue;
  console.log(buttonValue);
  searchLocation();
}


//Event listeners
findButtonEl.addEventListener('click', searchLocation);
backButtonEl.addEventListener('click', goBack);

