const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   PUT /api/user/settings
// @desc    Update user settings
// @access  Private
router.put('/settings', auth, async (req, res) => {
  try {
    const { emailNotifications } = req.body;
    
    const user = await User.findById(req.userId);
    
    if (emailNotifications !== undefined) {
      user.emailNotifications = emailNotifications;
    }

    await user.save();

    res.json({ 
      message: 'Settings updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        emailNotifications: user.emailNotifications
      }
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Error updating settings' });
  }
});

module.exports = router;
