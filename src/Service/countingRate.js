// Hàm đếm số lượng của mỗi rate theo số sao
const countingRate = (reivewsData) => {
  const countRate = {
    five: 0,
    four: 0,
    three: 0,
    two: 0,
    one: 0,
  };
  reivewsData.forEach((review) => {
    switch (review.rate) {
      case 5:
        countRate.five = countRate.five + 1;
        break;
      case 4:
        countRate.four = countRate.four + 1;
        break;
      case 3:
        countRate.three = countRate.three + 1;
        break;
      case 2:
        countRate.two = countRate.two + 1;
        break;
      case 1:
        countRate.one = countRate.one + 1;
        break;
      default:
    }
  });
  console.log(countRate);

  return countRate;
};

export default countingRate;
