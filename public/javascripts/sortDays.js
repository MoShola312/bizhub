
const sorter = {
  // "sunday": 0, // << if sunday is first day of week
  "mon": 1,
  "tue": 2,
  "wed": 3,
  "thu": 4,
  "fri": 5,
  "sat": 6,
  "sun": 7
  }  
  
 let sortByDay = function (a, b) {
  // console.log("hhhhiiiiittttttt")
  let day1 = a.day.toLowerCase();
  let day2 = b.day.toLowerCase();
  return sorter[day1] - sorter[day2];


  }


  module.exports = sortByDay