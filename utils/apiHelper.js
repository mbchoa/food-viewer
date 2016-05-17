import 'whatwg-fetch';

const ApiHelper = () => {
  const API_KEY = '&api_key=yMnnXJEO6hupDFQv8rupTPYzNdM5vFf7z2E1GbEc'
  const SEARCH = 'http://api.nal.usda.gov/ndb/search/?format=json' + API_KEY;
  const REPORT = 'http://api.nal.usda.gov/ndb/reports/?format=json' + API_KEY;

  const searchFood = (searchTerm) => {
    return fetch(SEARCH + '&q=' + searchTerm);
  }

  const getFoodInfo = (id) => {
    return fetch(REPORT + '&ndbno=' + id);
  }

  return {
    searchFood: searchFood,
    getFoodInfo: getFoodInfo,
  }
}

module.exports = ApiHelper();
