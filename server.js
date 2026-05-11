const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios'); 
const app = express();

app.use(express.json());
app.use(cors());

// Kết nối MongoDB (Quân giữ nguyên biến MONGO_URI đã cài trên Render nhé)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("--- Đã kết nối Database thành công! ---"))
  .catch(err => console.log("Lỗi kết nối:", err));

// 1. Bảng Người dùng
const User = mongoose.model('User', { username: String, email: String, school: String, role: String, pass: String });

// 2. Bảng Đề bài
const Problem = mongoose.model('Problem', {
    title: String,
    description: String,
    testCaseInput: String,
    testCaseOutput: String
});

// --- CÁC ĐƯỜNG DẪN XỬ LÝ ---

// Giáo viên thêm đề bài
app.post('/add-problem', async (req, res) => {
    try {
        const newProblem = new Problem(req.body);
        await newProblem.save();
        res.json({ message: "Đã thêm bài tập mới thành công!" });
    } catch (err) { res.status(500).json({ message: "Lỗi khi thêm bài!" }); }
});

// Lấy danh sách đề bài
app.get('/problems', async (req, res) => {
    const problems = await Problem.find();
    res.json(problems);
});

// Lấy chi tiết 1 bài tập
app.get('/problem/:id', async (req, res) => {
    const problem = await Problem.findById(req.params.id);
    res.json(problem);
});

// CHẤM BÀI TỰ ĐỘNG (Sử dụng Piston API)
app.post('/submit', async (req, res) => {
    const { code, language, problemId } = req.body;
    try {
        const problem = await Problem.findById(problemId);
        
        const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
            language: language, // 'cpp' hoặc 'python'
            version: '*',
            files: [{ content: code }],
            stdin: problem.testCaseInput 
        });

        const output = response.data.run.output.trim();
        const expected = problem.testCaseOutput.trim();

        if (output === expected) {
            res.json({ status: "AC", message: "Chính xác! 10/10 điểm", output });
        } else {
            res.json({ status: "WA", message: "Sai rồi! Thử lại nhé", output, expected });
        }
    } catch (err) {
        res.status(500).json({ message: "Lỗi hệ thống khi chấm bài!" });
    }
});

app.listen(process.env.PORT || 3000, () => console.log("Server Online!"));
