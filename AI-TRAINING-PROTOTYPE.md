# AI Training / Validation · 2026-10-05

Local http://127.0.0.1:4174/prototypes/ai-training.html · บท09–10 ตาม AI-PLAN-3B1B.md รวมต้นแบบใหม่10บท ยังไม่ integrate Production และไม่ commit/push/deploy

## กลไกและขอบเขต

- Batch/Epoch: linear regressionจริง2parameters/8ตัวอย่าง, Batch2/4/8, ลำดับคงที่ Learning rate.1; Gradientเฉลี่ยต่อBatch อัปเดตครั้งเดียว เมื่อใช้ครบ8ตัวอย่างเพิ่มEpoch ไม่shuffle/accumulate/distributed
- กดBatchถัดไปหรือฝึกครบEpochจึงคำนวณและอัปเดต ปุ่มเล่นภาพย้อนดูBatchล่าสุด ไม่เพิ่มUpdates; ทั้งEpochปุ่มเดียวคำนวณทุกBatchจริงแต่ภาพแสดงBatchสุดท้าย ไม่อ้างแสดงทุกBatchของEpochพร้อมกัน
- Validation/Overfitting: polynomial least-squaresด้วยQR reorthogonalization; degree1/3/7=2/4/8parameters ไม่ใช่Neural Network/gradient training/early stopping; Train8/Validation9/Test11 มีxแยกไม่ซ้ำกัน
- Trainอย่างเดียวกำหนดcoefficients; Validationเปรียบเทียบตัวเลือก; Testแสดงหลังคลิกสุดท้ายและล็อกDegree ผู้ใช้เริ่มการทดลองใหม่ได้เพื่อเรียน แต่ไม่อ้างผลTestที่ดูซ้ำเป็นการประเมินอิสระในงานจริง
- Model/points/prediction/errorจากสูตรเดียวกัน เส้นใน3Dเป็นกราฟ ไม่ใช่Packet ไม่มีModelAPI/LLM/วิดีโอที่ผลิตแล้ว งานคำนวณขนาดเล็กรันmain-thread JavaScript
- DOM labels/ศัพท์เฉพาะบท/nativecontrols/play-pause-step-reset/ภาพspeed.5–2; CDN/WebGLfallbackมีผลและเดินขั้นมือ แต่ยังไม่บังคับfailเพื่อทดสอบ และยังไม่ตรวจทุกมือถือ/มุม/ความเร็ว

## แหล่งและเรียบเรียง

อ่านส่วนHyperparameters/OptimizationLoop ของ https://docs.pytorch.org/tutorials/beginner/basics/optimization_tutorial.html และValidationcurve/generalization ของ https://scikit-learn.org/stable/modules/learning_curve.html

สังเคราะห์ชุดข้อมูล/เนื้อหา/ภาพใหม่ตามเป้าหมายTechAtlas ไม่คัดตัวอย่างMNIST/cosine/กราฟหรือassetต้นทาง ไม่อ้างว่าดูวิดีโอเพิ่มเติมครบ

## หลักฐานเฉพาะงานใหม่

- `node tests/ai-training.mjs`: Batch2/4/8 coverage/epoch/update count/immutable state, linear gradientsเทียบfinite difference, split counts8/9/11และไม่มีxซ้ำ, QR fitจริง/score/determinism/invalid bounds
- Degree1 Train.109058 / Validation.065015; Degree3 Train.020054 / Validation.000560; Degree7 Trainประมาณ6.34e−30 / Validation.200807 ไม่บังคับกราฟLossให้เป็นผลสำเร็จ ทุกค่าปัดทศนิยมในUI
- Browser2บท: taskเริ่มไม่ผ่าน, Batchถัดไป2ตัวอย่างเพิ่มUpdate1/Epoch0, ฝึกถึงEpoch1ขนาด2ได้4Updates, เปลี่ยนขนาด8reset/1Epoch1Updateแล้วtaskผ่าน
- BrowserFit: Degree1และ7เดินถึงขั้น3, Degree3เปิดTestและtaskผ่าน, Degree/Testbuttonล็อกจริง; splitTestปรับxให้แยกจากValidationหลังตรวจการทับและรันmodeltestsใหม่ ไม่เพิ่มบทเดิม
- rendererใหม่Batchspeed2 playheadเคลื่อน/Pauseค้าง866.6ms และUpdatesยัง1; Fitเล่นจบ3/3หยุดเอง แก้ป้ายTrain/Validationที่ซ้อนจากภาพตรวจครั้งแรก
- clean release `/tmp/techatlas-release-QpRmwf/dist` สร้างเพื่อเช็คแยกdraftเท่านั้น ไม่deploy; `prototypes`อยู่นอกdistและai-*.jsถูกตัดตามscriptเดิม

## ถัดไป

ภาพหลังแก้ป้ายที่มุมตั้งต้น `/tmp/techatlas-ai-training.jpg`; ลิงก์จากFoundationsไป09–10เปิดถูกหน้าแล้ว ไม่ตรวจเนื้อหาบทเดิมซ้ำ

Token/Language model → Embedding → Softmax/Sampling ตามแผน; IntegrateและวิดีโอยังรอฐานLabพร้อมและอนุมัติเผยแพร่แยก
