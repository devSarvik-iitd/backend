const express = require('express');
require("dotenv").config();
const OTP = require('../models/otp-model');
const nodemailer = require('nodemailer');
const generatedOTP = ()=> Math.floor(100000 + Math.random()*900000).toString();
const jwt = require('jsonwebtoken');

const generateOTP = async (req, res)=>{
    const {email} = req.body;
    console.log(req.body);
    if(!email) return res.status(400).json({message: "Email is required"});
    const otp = generatedOTP();
    console.log("OTP GENERATED")
    const expiresAt = new Date(Date.now()+5*60*1000);
    try {
        await OTP.findOneAndUpdate(
            {email}, {otp,expiresAt}, {upsert:true, new:true}
        );
        console.log("USER FOUND");
        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS,
            },
        });
        console.log("MAIL TRANSPORTER INITIALIZED")
        await transporter.sendMail({
            from:process.env.EMAIL_USER,
            to:email,
            subject:"OTP for EMail Verification | TheNexStep.in",
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px; background: #f9f9f9;">
                <h2 style="text-align: center; color: #333;">Verify Your Email</h2>
                <p style="color: #555;">Hello,</p>
                <p style="color: #555;">We have received a request to verify your email on <strong>TheNexStep.in</strong>.</p>
                <p style="color: #555;">To complete the verification process, use the following OTP:</p>
                <div style="text-align: center; margin: 20px 0;">
                    <span style="font-size: 24px; font-weight: bold; background: #333; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block;">
                        ${otp}
                    </span>
                </div>
                <p style="color: #555;">This OTP will expire in <strong>5 minutes</strong>. If you did not request this, please ignore this email.</p>
                <p style="color: #555; text-align: center;">TheNexStep.in Team</p>
            </div>
        `,
        });
        console.log("MAIL SENT");

        res.json({message:"OTP sent successful"});
    } catch (error) {
        console.error("❌ Error sending OTP:", error);
        res.status(500).json({message:"Error sending OTP"});
    }
};
const verifyOTP = async (req, res)=>{
    const {email, otp} = req.body;

    if(!email || !otp) return res.status(400).json({message : "Email and OTP are required for verification"});
    try {
        const otpRecord = await OTP.findOne({email});

        if(!otpRecord || otpRecord.otp !== otp || otpRecord.expiresAt< new Date()){
            return res.status(400).json({
                message:"Invalid or expired OTP"
            });
        }

        await OTP.deleteOne({email});

        const tempToken = jwt.sign(
            {email},
            process.env.JWT_SECRET,
            {expiresIn:"10m"}
        );

        res.json({message:"OTP verified successfully", email:email, tempToken});
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Error verifying OTP"});
    }
}
module.exports = {generateOTP, verifyOTP};