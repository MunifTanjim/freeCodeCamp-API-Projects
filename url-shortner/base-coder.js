var characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
var base = characters.length

var decimalToBase = function(id) {
  var encoded_value = ''
  while(id) {
    var rem = id % base
    id = Math.floor(id / base)
    encoded_value = characters[rem].toString() + encoded_value
  }
  return encoded_value
}

var baseToDecimal = function(encoded_value) {
  var decoded_value = 0
  while(encoded_value) {
    var index = characters.indexOf(encoded_value[0])
    var power = encoded_value.length - 1
    decoded_value += index * Math.pow(base, power)
    encoded_value = encoded_value.substring(1)
  }
  return decoded_value
}

var publicAPI = {
  encode: decimalToBase,
  decode: baseToDecimal
}

module.exports = publicAPI
