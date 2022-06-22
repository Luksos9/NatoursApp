const express = require('express');
const fs = require('fs');

const app = express();

/* app.get('/', (req, res) => {
  // handlujemy request get głownej strony
  res
    .status(200)
    .json({ message: 'hello from the server side!', app: 'Natours' });
});

app.post('/', (req, res) => {
  res.send('You can post to this endpoint...');
}); */

// We read file before route handler
// because top level code is executed once
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
console.log(tours);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
});

const port = 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
