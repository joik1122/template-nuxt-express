const { Router } = require('express')

const router = Router()
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

const example = async (res) => {
  // 지연 api 테스트
  console.log('About to snooze without halting the event loop...');
  await snooze(2000);
  console.log('done!');
  res.json(users)
};

// Mock Users
const users = [
  { name: 'Alexandre' },
  { name: 'Pooya' },
  { name: 'Sébastien' }
]

/* GET users listing. */
router.get('/users', function (req, res, next) {
  example(res);
})

/* GET user by ID. */
router.get('/users/:id', function (req, res, next) {
  const id = parseInt(req.params.id)
  if (id >= 0 && id < users.length) {
    res.json(users[id])
  } else {
    res.sendStatus(404)
  }
})

module.exports = router
