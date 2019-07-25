// implement your API here
const express = require('express');
const db = require('./data/db');
const port = 4000;

const server = express();

//Middleware make sure to use
server.use(express.json());

server.get('/', (req, res) => {
  res.send('hello workd from express!!!');
});

server.post('/api/users', (req, res) => {
  const newUser = req.body;
  const name = req.body.name;
  const bio = req.body.bio;

  if (!name || !bio) {
    res
      .status(400)
      .json({ errorMessage: 'Please provide name and bio for the user.' });
  }
  db.insert(newUser)
    .then(newUser => {
      res.status(200).json({ newUser });
    })
    .catch(err => {
      res.status(500).json({
        error: 'There was an error while saving the user to the database'
      });
    });
});

//GET USERS
server.get('/api/users', (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: 'The user with the specific ID does not exist' })
        .end();
    });
});
//PUT USER
server.put('/api/users/:id', (req, res) => {
  const newUser = req.body;
  const name = req.body.name;
  const bio = req.body.bio;
  const { id } = req.params;

  if (!name || !bio) {
    res
      .status(400)
      .json({ errorMessage: 'Please provide name and bio for the user.' });
  }
  db.update(id, newUser)
    .then(updated => {
      if (updated) {
        res.status(200).json({ updated });
      } else {
        res.status(400).json({
          errorMessage: 'Please provide name and bio for the user.'
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: 'The user information could not be modified.'
      });
    });
});
//DELETE USERS
server.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  console.log(id);
  db.remove(id)
    .then(deleted => {
      if (deleted) {
        res.status(204).end();
      } else {
        res.status(404).json({
          message: 'The user with the specified ID does not exist.'
        });
      }
    })
    .catch(err => {
      res.status(500).json({ error: 'The user could not be removed' });
    });
});

server.listen(port, () => {
  console.log(`Server is live on ${port}`);
});
