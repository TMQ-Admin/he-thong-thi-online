const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios'); 
const app = express();

app.use(express.json());
app.use(cors());

// Kết nối MongoDB (Quân kiểm tra xem đã có MONGO_URI trong Environment bên Render chưa nhé)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("--- Đã kết nối MongoDB thành công! ---"))
  .catch(err => console.log("Lỗi kết nối:", err));

// Định nghĩa bảng Đề bài
const Problem = mongoose.model('Problem', {
    title: String,
    description: String,
    testCaseInput: String,
    testCaseOutput: String
});

// API nhận đề bài từ mẹ Quân
app.post('/add-problem', async (req, res) => {
    console.log("Dữ liệu nhận được:", req.body); // Dòng này để kiểm tra lỗi
    try {
        const newProblem = new Problem(req.body);
        await newProblem.save();
        res.json({ message: "Đã đăng bài thành công lên hệ thống!" });
    } catch (err) {
        res.status(500).json({ message: "Lỗi lưu vào Database!" });
    }
});

// API lấy danh sách bài cho học sinh
app.get('/get-problems', async (req, res) => {
    const problems = await Problem.find();
    res.json(problems);
});

app.listen(process.env.PORT || 3000, () => console.log("Hệ thống chấm bài sẵn sàng!"));
