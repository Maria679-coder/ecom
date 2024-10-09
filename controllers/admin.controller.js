const nodemailer = require('nodemailer')
const adminModel = require('../models/admin.model');
const transporter = require('../middleware/transport');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, phone, image } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10)
    const existedUser = await adminModel.findOne({ email })
    if (existedUser) {
      return res.status(409).json({
        succes: false,
        msg: "Email already Exist,please use another email"
      })
    }
    const admin = await adminModel.create({
      name: name,
      email: email,
      phone: phone,
      password: hashedPassword,
      image: image
    })
    res.status(201).json({ message: 'Admin registered successfully', admin });
  } catch (error) {
    res.status(500).json({
      success: false,
      error
    })
  }
};
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        msg: "Email and password are required.",
      });
    }
    const existedUser = await adminModel.findOne({ email }).populate("expenses");
    if (!existedUser) {
      return res.status(404).json({
        success: false,
        msg: "Admin not found. Please check the credentials.",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, existedUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        msg: "Invalid credentials. Please try again.",
      });
    }
    const token = jwt.sign({
      email: existedUser.email,
      id: existedUser._id
    }, process.env.JWT_SECRET)
    return res.status(200).json({
      success: true,
      message: "User logged in successfully.",
      token,
      existedUser
    });
  } catch (error) {
    console.error("Error during admin login:", error);
    return res.status(500).json({
      success: false,
      msg: "An unexpected error occurred. Please try again later.",
    });
  }
};

const getAdmins = async (req, res) => {
  try {
    const admins = await adminModel.find();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
const getSingleAdmin = async (req, res) => {
  const { id } = req.params;
  console.log(id)
  try {
    const admin = await adminModel.findById(id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
const deleteAdmin = async (req, res) => {
  const { id } = req.params;
  console.log(id)
  try {
    const admin = await adminModel.findByIdAndDelete(id);
    if (!admin) return res.status(404).json({ msg: 'Admin not found' });
    res.status(200).json({
      message: `admin with this ${id} Deleted successfully`,
      admin
    });
  } catch (error) {
    res.status(500).json({ msg: 'server error', error })
  }
}

const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { updateAdmin, ...body } = req.body;
  try {
    if (updateAdmin) {
      body.password = await bcrypt.hash(updateAdmin, 10);
    }
    const admin = await adminModel.findByIdAndUpdate(id, body, { new: true })
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.status(200).json({ message: `Admin updated successfully with ${id}`, admin });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}

const updatePassword = async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;
  const hashedPassword = await bcrypt.hash(newPassword, 10)
  try {
    const admin = await adminModel.findByIdAndUpdate(id, { password: hashedPassword }, { new: true })
    if (!admin) return res.status(404).json({ msg: " admin not found" });
    res.status(200).json({ msg: "admin password updated successfully with new password" });
  } catch (error) {
    res.status(500).json({ msg: " server error: ", error });
  }
}
const sendResetEmail = async (email, resetToken, res) => {
  console.log(process.env.SMTP_EMAIL, process.env.SMTP_PASSWORD)
  try {
    const resetLink = `http://localhost:3000/auth/reset-password/${resetToken}`
    const info = await transporter.sendMail({
      from: '" ch Maria" <chmaria912@gmail.com>',
      to: email,
      subject: 'Password Reset Request',
      text: 'Hello, please click the link below to reset your password.',
      html: `<b>Click <a href=${resetLink}>here</a> to reset your password</b>`,
    });
    console.log(`reset password link send to ${email}`)
    console.log('Email sent: %s', info.messageId);
    res.status(200).json({
      success: true,
      msg: 'Check your email to reset your password.',
      info,
    });
  } catch (error) {
    console.log("error", error)
  }
}

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const isAdminExist = await adminModel.findOne({ email })
    if (!isAdminExist) {
      return res.status(404).json({
        message: "Email not Found"
      })
    }
    const resetToken = jwt.sign({
      email: isAdminExist.email,
      userId: isAdminExist._id
    }, process.env.JWT_SECRET, { expiresIn: '1h' })

    isAdminExist.resetPasswordtoken = resetToken;
    isAdminExist.resetPasswordTokenExpiry = Date.now() + 60 * 60 * 1000;
    await isAdminExist.save()

    console.log(isAdminExist)

    await sendResetEmail(email, resetToken, res)
    // res.status(200).json({
    //   success: true,
    //   msg: 'Check your email to reset your password.',
    // });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      msg: 'Failed to send email. Please try again later.',
      error,
    });
  }
}
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    //  const  decode = jwt.verify(token , process.env.JWT_SECRET)
    // console.log(decode)

    const user = await adminModel.findOne({ resetPasswordtoken: token, resetPasswordTokenExpiry: { $gt: Date.now() } })

    //  const user = await adminModel.findById(decode.userId)
    //  console.log("error", error)

    if (!user) {
      return res.status(404).json({
        msg: 'token not found',
      })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    user.resetPasswordtoken = null;
    user.resetPasswordTokenExpiry = null;
    user.password = hashedPassword;
    await user.save()

    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: user.email,
      subject: 'Success',
      text: 'Hello,testing Admin authentication',
      html: `<b> Your password has been reset Succesfully</b>`,
    }
    // const transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: process.env.SMTP_EMAIL,
    //     pass: process.env.SMTP_PASSWORD,
    //   },
    // });
    await transporter.sendMail(mailOptions),
      console.log('reset Token', token)
    res.status(200).json({
      success: true,
      msg: 'password reset Successfully'
    })
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      msg: 'Failed to reset Password. Please try again later.',
      error,
    });
  }
};

module.exports = { registerAdmin, loginAdmin, getAdmins, getSingleAdmin, deleteAdmin, updateAdmin, forgetPassword, resetPassword, updatePassword }