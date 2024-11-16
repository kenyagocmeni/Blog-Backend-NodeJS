const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const upload = require('../config/multerConfig');

//Kullanıcı kayıt:
const registerUser = async(req,res)=>{
    const {username, email, password} = req.body;

    try {
        
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(409).json({message:"Bu e-posta adresi zaten kullanımda."});
        }

        //Şifrenin hashlenmesi
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();

        res.status(201).json({message:"Kullanıcı başarıyla kaydedildi.", user:savedUser})
    } catch (error) {
        res.status(500).json({message:"Kayıt sırasında bir hata oluştu", error: error.message});
    }
};

//Kullanıcı giriş:
const loginUser = async(req,res)=>{
    const {email, password} = req.body;

    try {
        
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"Böyle bir kullanıcı bulunamadı."});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message:"Geçersiz şifre"});
        }

        //JWT oluşturma:
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn:"1h"});

        res.status(200).json({
            message:"Giriş başarılı",
            user:{
                id:user._id,
                username: user.username,
                email : user.email
            },
            token
        });

    } catch (error) {
        res.status(500).json({message:"Giriş sırasında bir hata oluştu", error: error.message});
    }
};

//Bilgileri güncelle:
const updateUserProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }
  
      const updatedUser = await user.save();
  
      res.status(200).json({
        message: 'User updated successfully',
        user: {
          id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

//Profil resmi ekle:
const uploadProfilePicture = async(req,res)=>{
    if(!req.file){
        return res.status(400).send({message:"Dosya yüklenmedi."});
    }

    try {
        
        const user = await User.findById(req.user._id);
        if(!user){
            return res.status(404).send({message:"Kullanıcı bulunamadı"});
        }

        user.profilePicture = `/uploads/${req.file.filename}`;//dosya yolunun veritabanında kaydedilmesi
        await user.save();

        res.status(200).send({
            message:"Profil fotoğrafı başarıyla eklendi.",
            profilePicture: user.profilePicture
        })

    } catch (error) {
        res.status(500).send({message:"Profil fotoğrafı eklenemedi.", error:error.message});
    }
}

//Profil resmini sil:
const deleteProfilePicture = async(req,res)=>{
    try {
        
        const user = await User.findById(req.user._id);

        if(!user){
            return res.status(404).json({message:"Kullanıcı bulunamadı"});
        }

        user.profilePicture = undefined;
        await user.save();

        res.status(200).json({message:"Profil fotoğrafı silindi."});
    } catch (error) {
        return res.status(500).json({message:"Profil fotoğrafı silinirken bir hata oluştu", error:error.message});
    }
};

module.exports = {registerUser, loginUser, updateUserProfile, uploadProfilePicture, deleteProfilePicture};