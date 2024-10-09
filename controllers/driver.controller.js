const Driver = require('../models/driver.model');

const createDriver = async (req, res) => {
  try {
    const { name, email, licence_num, phone_num, address, dob, employStatus, hiredate, image, additionalNotes } = req.body;

    const newDriver = new Driver({ name, email, licence_num, phone_num, address, dob, employStatus, hiredate, image, additionalNotes, });
    await newDriver.save();
    res.status(201).json({ success: true, data: newDriver });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

const getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.status(200).json({ success: true, data: drivers, });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id)
    // .populate("accidents");
    if (!driver) {
      return res.status(404).json({ success: false, msg: 'Driver not found' });
    }
    res.status(200).json({ success: true, data: driver });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateDriver = async (req, res) => {
  try {
    const { name, email, licence_num, phone_num, address, dob, employStatus, hiredate, image, additionalNotes } = req.body;

    const updatedDriver = await Driver.findByIdAndUpdate(
      req.params.id,
      { name, email, licence_num, phone_num, address, dob, employStatus, hiredate, image, additionalNotes },
      { new: true, runValidators: true }
    );

    if (!updatedDriver) {
      return res.status(404).json({ success: false, msg: 'Driver not found' });
    }

    res.status(200).json({ success: true, data: updatedDriver });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


const deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) {
      return res.status(404).json({ success: false, msg: 'Driver not found' });
    }

    res.status(200).json({ success: true, msg: 'Driver deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { createDriver, getDrivers, getDriverById, updateDriver, deleteDriver, };
