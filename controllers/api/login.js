const router = require("express").Router();
const { response } = require("express");
const { User } = require("../../models");
const withAuth = require("../../utils/auth");

//login create
router.post("/", withAuth, (req, res) => {
  console.log(req.body);
  User.create(req.body)
    .then((data) => {
      res.json(data);
      req.session.save(() => {
        req.session.user_id = data.id;
        req.session.logged_in = true;
        res.json({ user: userData, message: "You are now logged in!" });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

//Login check
router.post('/login', async (req, res) => {
try {
    const userData = await User.findOne({ where: { email: req.body.email } });
    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }
    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

//logout
router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
      req.session.destroy(() => {
        res.status(204).end();
        //res.render to go back to homepage after logout
      });
    } else {
      res.status(404).end();
    }
  });


module.exports = router;