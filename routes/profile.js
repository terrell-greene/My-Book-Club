const express = require("express");
const router = express.Router();
const passport = require("passport");

// Load Profile model
const Profile = require("../models/Profile");
// Load Club model
const Club = require("../models/Club");

// Load Validation
const validateProfileInput = require("../validation/profile");

// @route   Post /api/profile
// @desc    Create or update user's profile
// access   Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    if (!isValid) {
      // If not valid return errors object
      return res.status(400).json(errors);
    }

    const profileFields = { location: "", bio: "" };

    // Genres - Split into an Array
    if (typeof req.body.genres != "undefined") {
      profileFields.genres = req.body.genres.split(",");
    }

    profileFields.user = req.user.id;

    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    try {
      const profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // Update

        const updatedProfile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        res.json(updatedProfile);
      } else {
        // Create
        const newProfile = await new Profile(profileFields).save();

        res.json(newProfile);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// @route   GET /api/profile
// @desc    Get current user's profile
// access   Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      res.json(profile);
    } catch (error) {
      console.log(error);
    }
  }
);

// @route   GET /api/profile/id
// @desc    Get user's profile by Id
// access   Private
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      res.json(profile);
    } catch (error) {
      console.log(error);
    }
  }
);

// @route   POST /api/profile/club/
// @desc    Add club to user's profile
// access   Private
router.post(
  "/club",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const errors = {};
      const club = await Club.findById(req.body.clubId);

      // Check to see if club exists
      if (!club) {
        errors.club = "Club doesn't exists";
        return res.status(400).json(errors);
      }

      const members = club.members.map(member => member.toString());

      // Check to see if user is a admin or member of club
      if (members.includes(req.user.id) || club.admin === req.user.id) {
        errors.club = "Already a member of this club.";
        return res.status(400).json(errors);
      }

      // Find user  profile
      const profile = await Profile.findOne({ user: req.user.id });

      if (!profile) {
        errors.club = "Must create profile first";
        return res.status(400).json(errors);
      }

      // Add club to user's profile
      profile.clubs.push(club.id);

      const updatedProfile = await profile.save();

      // Add user to club's members
      club.members.push(req.user.id);
      club.save();

      res.json(updatedProfile);
    } catch (error) {
      console.log(error);
    }
  }
);

// @route   DELETE /api/profile/club/clubId
// @desc    Remove user from club
// access   Private
router.delete(
  "/club/:clubId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id });

      const club = await Club.findById(req.params.clubId);

      // Get remove index
      const clubRemoveIndex = profile.clubs
        .map(club => club.id)
        .indexOf(req.params.clubId);

      // Splice out of array
      profile.clubs.splice(clubRemoveIndex, 1);
      const updatedProfile = await profile.save();

      // Get remove index
      const profileRemoveIndex = club.members
        .map(member => member.id)
        .indexOf(req.user.id);

      // Splice out of array
      club.members.splice(profileRemoveIndex, 1);
      club.save();

      res.json(updatedProfile);
    } catch (error) {
      res.status(500).json(error);
      console.log(error);
    }
  }
);

module.exports = router;