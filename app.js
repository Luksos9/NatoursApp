const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
  console.log('Hello from the middleware 😁');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Old way
/* app.get(`/api/v1/tours/:id`, getTour);
app.get('/api/v1/tours', getAllTours);
app.post('/api/v1/tours', createTour);
app.patch('/api/v1/tours/:id', updateTour);
app.delete('/api/v1/tours/:id', deleteTour); */

// 3) Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 4) Start Server
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
