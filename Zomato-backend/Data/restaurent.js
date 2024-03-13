const demoData = [
    {
      name: 'Restaurant A',
      code: 'A001',
      location_codes: ['BLR', 'CHN'],
      timing_codes: ['LUNCH', 'DINNER'],
      cuisine: ['Italian', 'Mexican'],
      foodInfo:[{name:"dosa",img:"dosa.img",price:100}],
      overview: 'A great place for Italian and Mexican cuisine.',
      images: ["https://github.com/DivyashantKumar/assignment-first/blob/main/2image2x.png?raw=true", 
      'https://github.com/DivyashantKumar/assignment-first/blob/main/3image2x.png?raw=true'                                                                                       ],
      address: '123 Main Street'
    },
    {
      name: 'Restaurant B',
      code: 'B002',
      location_codes: ['BLR', 'CHN'],
      timing_codes: ['BREAKFAST', 'BRUNCH'],
      cuisine: ['American', 'French'],
      cost: 30,
      overview: 'Serving American and French dishes with style.',
      images: ['image3.jpg', 'image4.jpg'],
      address: '456 Elm Street'
    },
    {
        name: 'Restaurant B',
        code: 'B002',
        location_codes: ['HYD', 'CHN'],
        timing_codes: ['BREAKFAST', 'BRUNCH'],
        cuisine: ['American', 'French'],
        cost: 30,
        overview: 'Serving American and French dishes with style.',
        images: ['image3.jpg', 'image4.jpg'],
        address: '456 Elm Street'
      },
    // Add more demo data as needed
  ];

module.exports = demoData;