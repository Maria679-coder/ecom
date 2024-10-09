const accidentModel = require('../models/accident.model');
const driverModel = require('../models/driver.model');

const createAccident = async (req, res) => {
  try {
    const { date, numb_num, location, description, damage, injuries, expense,driver} = req.body;
    const accident = await accidentModel.create({
      date,
      numb_num,
      location,
      description,
      damage,
      injuries,
      expense,
      driver
    });
    const driverAccident = await driverModel.findById(driver)
    if (!driverAccident) {
      throw new Error('Driver not found');
    }
    driverAccident.accidents.push(accident._id);
    await driverAccident.save();

    // const driverAccidents =await driverModel.findById(driver)
    // driverAccidents.driver.push(accident._id)
    // driverAccidents.save()

    res.status(201).json({
      success: true,
      message: 'Accident created successfully',
      accident: accident,
      driverAccident
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error
    });
  }
};

const getAccidents = async (req, res) => {
  try {
    const accidents = await accidentModel.find().populate("driver");
    res.status(200).json(accidents)
  } catch (error) {
    res.status(500).json({
      message: "Server Error", error
    })
  }
}
const getSingleAccident = async (req, res) => {
  const { id } = req.params;
  console.log(id)
  try {
    const accident = await accidentModel.findById(id).populate("driver")
    if (!accident) return res.status(404).json({
      message: "Accident not found",
    })
    res.status(200).json(accident)
  } catch (error) {
    res.status(500).json({
      message: " server Error", error
    })
  }
}
const updateAccident = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  try {
  const accidents = await accidentModel.findByIdAndUpdate(id , body, { new: true })
  res.status(200).json(({
    mes: `Accident updated with this ${id} successfully`,
    accidents
  }))
    } catch (error) {
      res.status(500).json({
        msg: "Server Error", error
      })
    }
}
const deleteAccident = async (req, res) => {
  const { id } = req.params;
  try {
    const accident = await accidentModel.findByIdAndDelete(id)
    if (!accident) {
      return res.ststus(404).json({
        success: false,
        msg: "accident not found"
      })
    }
    await driverModel.updateOne(
        { accidents: id },
        { $pull: { accidents: id } }
      );
      
    res.status(200).json({
      success: true,
      msg: `accident with this ${id} deleted successfully`,
      accident
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Server error',
      error: error.msg
    })
  }
}

//  // Remove accident from the driver's accidents array
//  await driverModel.updateOne(
//     { accidents: id },
//     { $pull: { accidents: id } }
//   );

//   res.status(200).json({
//     success: true,
//     message: `Accident deleted successfully`,
//     accident
//   });
// } catch (error) {
//   res.status(500).json({
//     success: false,
//     message: 'Server error',
//     error: error.message
//   });
// }
// };

module.exports = { createAccident, getAccidents, getSingleAccident, updateAccident, deleteAccident }