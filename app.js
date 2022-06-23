const express = require('express');
const fs = require('fs');
const url = require('url');

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  console.log('Hello from the middleware 😁');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// We read file before route handler
// because top level code is executed once
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    requestedAt: req.requestTime,
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  const id = Number(req.params.id);
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID!',
    });
  }

  res.status(201).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  // console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  // we are in callback function so never use writeFileSync
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: { tour: newTour },
      }); // 201 stands for created
    }
  );
};

const updateTour = (req, res) => {
  const id = Number(req.params.id);
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID!',
    });
  }

  const updatedObj = { ...tour, ...req.body };
  const updatedAllObj = tours.map((el) =>
    el.id === updatedObj.id ? updatedObj : el
  );

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(updatedAllObj),
    (err) => res.status(200).json({ status: 'success', data: updatedAllObj })
  );
};

const deleteTour = (req, res) => {
  const id = Number(req.params.id);
  console.log(id);
  const tour = tours.find((el) => el.id === id);
  console.log(tour);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID!',
    });
  }

  const updatedAllObj = tours.filter((el) => el.id !== id);
  console.log(updatedAllObj);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(updatedAllObj),
    (err) =>
      res.status(204).json({
        status: 'success',
        message: `tour ${id} was successfully deleted`,
        data: null,
      })
  );
};

// Old way
/* app.get(`/api/v1/tours/:id`, getTour);
app.get('/api/v1/tours', getAllTours);
app.post('/api/v1/tours', createTour);
app.patch('/api/v1/tours/:id', updateTour);
app.delete('/api/v1/tours/:id', deleteTour); */

app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
