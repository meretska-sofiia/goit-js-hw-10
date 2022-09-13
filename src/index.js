import './css/styles.css';
import Notiflix from 'notiflix';
import createCountryList from './templates/countries-list.hbs';
import createCountryCard from './templates/country-card.hbs';
import { fetchCountries } from '../src/js/fetchCountries';
const debounce = require('lodash.debounce');

const countryListEl = document.querySelector('.country-list');
const countryInfoBox = document.querySelector('.country-info')
const inputEl = document.querySelector('#search-box');
const DEBOUNCE_DELAY = 300;

const onSearchCountryInput = event => {
  const searchedCountry = event.target.value.trim();
    if (searchedCountry === '') {
        countryListEl.innerHTML = '';
        countryInfoBox.innerHTML = '';
    return;
  }
  fetchCountries(searchedCountry)
      .then(data => {
          if (data.length > 10) {
            Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
          } else if (data.length >= 2 && data.length <= 10) {
              countryListEl.innerHTML = createCountryList(data)
              countryInfoBox.innerHTML = '';
          } else {
              data[0].languages = Object.values(data[0].languages).join(', ');
              countryListEl.innerHTML = '';
              countryInfoBox.innerHTML = createCountryCard(data)
              console.log(Object.values(data[0].languages));
        }
      
    })
      .catch(err => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
    });
};

inputEl.addEventListener(
  'input',
  debounce(onSearchCountryInput, DEBOUNCE_DELAY)
);
