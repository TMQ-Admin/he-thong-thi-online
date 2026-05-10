const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// KẾT NỐI DATABASE 
// Quân lưu ý: Thay MAT_KHAU_CUA_QUAN bằng mật khẩu thật của bạn nhé
const mongoURI = 'mongodb+srv://admin:MAT_KHAU_CUA_QUAN@cluster0.wzicaqf.mongodb.net/?appName=Cluster0';

mongoose.connect(mongoURI)
  .then(() => console.log("--- Đã kết nối Database thành công! ---"))
  .catch(err => console.error("Lỗi kết nối Database:", err));

// Định nghĩa cấu trúc dữ liệu Thành viên
const User = mongoose.model('User', {
    username: String,
    email: String,
    school: String,
    role: String,
    pass: String
});

// 1. API ĐĂNG KÝ
app.post('/register', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).send({ message: "Chúc mừng Quân! Đăng ký thành công rồi." });
    } catch (error) {
        res.status(400).send({ message: "Lỗi rồi, không lưu được dữ liệu!" });
    }
});

// 2. API ĐĂNG NHẬP
app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.user, pass: req.body.pass });
        if (user) {
            res.send({ message: "Đăng nhập thành công!", role: user.role });
        } else {
            res.status(401).send({ message: "Sai tài khoản hoặc mật khẩu!" });
        }
    } catch (error) {
        res.status(500).send({ message: "Lỗi hệ thống!" });
    }
});

// Cổng chạy ứng dụng
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại: http://localhost:${PORT}`);
    console.log("Sẵn sàng nhận dữ liệu từ website của bạn!");
});
