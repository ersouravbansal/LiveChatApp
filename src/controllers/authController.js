const User = require("../models/user");
const authController = {
  async register(req, res) {
    const { username, password } = req.body;
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password less than 6 characters" });
    }
    try {
      await User.create({
        username,
        password,
      }).then((user) =>
        res.status(200).json({
          message: "User successfully created",
          user,
        })
      );
    } catch (err) {
      res.status(401).json({
        message: "User not successful created",
        error: error.mesage,
      });
    }
  },
  async login(req, res) {
    const { username, password } = req.body;
    // Check if username and password is provided
    if (!username || !password) {
      return res.status(400).json({
        message: "Username or Password not present",
      });
    }
    try {
      const user = await User.findOne({ username, password });
      if (!user) {
        res.status(401).json({
          message: "Login not successful",
          error: "User not found",
        });
      } else {
        res.status(200).json({
          message: "Login successful",
          user,
        });
      }
    } catch (error) {
      res.status(400).json({
        message: "An error occurred during login process",
        error: error.message,
      });
    }
  },
  async update(req, res) {
    const { role, id } = req.body;
    if (role && id) {
      // Second - Verifying if the value of role is admin
      if (role === "admin") {
        // Finds the user with the id
        await User.findById(id)
          .then((user) => {
            // Third - Verifies the user is not an admin
            if (user.role !== "admin") {
              user.role = role;
              user.save((err) => {
                //Monogodb error checker
                if (err) {
                  res
                    .status("400")
                    .json({ message: "An error occurred", error: err.message });
                  process.exit(1);
                }
                res.status("201").json({ message: "Update successful", user });
              });
            } else {
              res.status(400).json({ message: "User is already an Admin" });
            }
          })
          .catch((error) => {
            res
              .status(400)
              .json({ message: "An error occurred", error: error.message });
          });
      }
    }
  },
  async deleteUser(req, res) {
    const { id } = req.body;
    await User.findById(id)
      .then((user) => user.remove())
      .then((user) =>
        res.status(201).json({ message: "User successfully deleted", user })
      )
      .catch((error) =>
        res
          .status(400)
          .json({ message: "An error occurred", error: error.message })
      );
  },
};
module.exports = authController;
