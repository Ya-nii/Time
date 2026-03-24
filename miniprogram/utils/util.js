function formatDate(date) {
  let y = date.getFullYear()
  let m = date.getMonth() + 1
  let d = date.getDate()
  return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d)
}

function formatDay(date) {
  let m = date.getMonth() + 1
  let d = date.getDate()
  return m + '/' + d
}

module.exports = {
  formatDate,
  formatDay
}