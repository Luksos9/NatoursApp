const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail!',
      message: 'missing name or price',
    });
  }
  next();
};

exports.checkDuration = (req, res, next) => {
  if (!req.body.duration)
    return res.status(400).json({
      status: 'fail!',
      message: 'no duration!',
    });
  next();
};

exports.checkID = (req, res, next, val) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID!',
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
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

exports.getTour = (req, res) => {
  const id = Number(req.params.id);
  const tour = tours.find((el) => el.id === id);

  res.status(201).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
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

exports.updateTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((tour) => tour.id === id);

  const updatedTour = { ...tour, ...req.body };

  const updatedTours = tours.map((tour) =>
    tour.id === updatedTour.id ? updatedTour : tour
  );

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(updatedTours),
    (err) => {
      res.status(200).send({
        status: 'success',
        data: updatedTour,
      });
    }
  );
};

exports.deleteTour = (req, res) => {
  const id = Number(req.params.id);
  console.log(id);
  const tour = tours.find((el) => el.id === id);
  console.log(tour);

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
