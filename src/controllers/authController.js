const User = require("../models/user");
const bcrypt = require("bcryptjs");

const authController = {
  async register(req, res) {
    const { username, password } = req.body;

    try {
      if(!username){
        return res.status(400).json({ message: "Please Enter a Valid Username" });
      }
      if (password.length < 6) {
        return res.status(400).json({ message: "Password should be at least 6 characters long" });
      }

      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({
        username,
        password: hash,
      });

      req.session.user = {
        id: user._id,
        username: user.username,
      };

      res.status(200).json({
        message: "User successfully created",
        user: req.session.user,
      });
    } catch (error) {
      res.status(400).json({
        message: "User not successfully created",
        error: error.message,
      });
    }
  },

  async login(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username or Password not present",
      });
    }

    try {
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(400).json({
          message: "Login not successful",
          error: "User not found",
        });
      }

      const result = await bcrypt.compare(password, user.password);

      if (result) {
        req.session.user = {
          id: user._id,
          username: user.username,
        };

        res.status(200).json({
          message: "Login successful",
          user: req.session.user,
        });
      } else {
        res.status(400).json({ message: "Login not successful" });
      }
    } catch (error) {
      res.status(400).json({
        message: "An error occurred",
        error: error.message,
      });
    }
  },

  async logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json({ message: 'Logout successful' });
      }
    });
  },

  async update(req, res) {
    const { role, id } = req.body;

    try {
      if (role && id) {
        const user = await User.findById(id);

        if (user.role !== "admin") {
          user.role = role;

          user.save((err) => {
            if (err) {
              res.status(400).json({ message: "An error occurred", error: err.message });
            } else {
              res.status(201).json({ message: "Update successful", user });
            }
          });
        } else {
          res.status(400).json({ message: "User is already an Admin" });
        }
      }
    } catch (error) {
      res.status(400).json({ message: "An error occurred", error: error.message });
    }
  },

  async deleteUser(req, res) {
    const { id } = req.body;

    try {
      const user = await User.findById(id);
      await user.remove();

      res.status(201).json({ message: "User successfully deleted", user });
    } catch (error) {
      res.status(400).json({ message: "An error occurred", error: error.message });
    }
  },
};

module.exports = authController;
