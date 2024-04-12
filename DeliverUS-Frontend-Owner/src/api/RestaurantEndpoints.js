import { get } from './helpers/ApiRequestsHelper'
function getAll () {
  return get('users/myrestaurants')
}

function getDetail (id) {
  return get(`restaurants/${id}`)
}

function getRestaurantCategories () {
  return get('restaurantCategories')
}

function getProductCategories () {
  return get('productCategories')
}

export { getAll, getDetail, getRestaurantCategories, getProductCategories }
