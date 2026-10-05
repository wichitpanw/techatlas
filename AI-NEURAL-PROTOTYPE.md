# AI Neural Lab · ต้นแบบ 2026-10-05

สถานะล่าสุด: รวมต้นแบบใหม่10บทแล้ว รอบ09–10ดู `AI-TRAINING-PROTOTYPE.md`; รายการ8บทและงานBatch/Epochที่ยังไม่ทำด้านล่างเป็นหลักฐานรอบก่อน ไม่ใช่สถานะล่าสุด

## รอบต่อ · Foundations 4 บท

เปิด `http://127.0.0.1:4174/prototypes/ai-foundations.html` รวมต้นแบบใหม่ **8 บท** โดยลำดับข้อมูล → Vector → Neuron → Activation → Forward → Loss → Gradient → Backprop ลิงก์ hash เข้า pane เดิม ไม่เพิ่ม AI Production

- ภาพ3×3 synthetic grayscale คลิก Pixel0/128/255, flatten row-major, normalize ÷255; Vectorแสดงแบ่ง3แถวเพื่ออ่านง่าย ไม่สื่อว่าเป็นMatrix inputของNeuronจริง
- Dot product2มิติ/Matrix2×2 แถวแรกปรับ Weight แถวสองคงที่; ไม่ใช้ภาพ Packet หรืออ้างเป็นการเรียน Embedding
- กราฟ Linear/ReLU/Sigmoid/tanh คำนวณจริงบนระนาบในฉาก3D; Sigmoidอย่างเดียวไม่ได้รับประกัน probability และไม่อ้าง ReLU มีอนุพันธ์ที่0
- MSE2outputs Target[1,−.5] แสดงError/square/mean; เมื่อError0ไม่แสดงสี่เหลี่ยมหลอกว่ามีพื้นที่ Errorบวก/ลบไม่หักล้างในMSE
- มีศัพท์16รายการใน4บท (ยังไม่เพิ่มพจนานุกรมProduction), ภารกิจระบุค่า/ขั้น/กรณีที่ต้องดู, keyboardผ่านnativebuttons/inputs, speed.5/1/2 และfallbackตารางเมื่อ3Dไม่พร้อม
- อ่านเอกสารหลักเพิ่มเติม https://numpy.org/doc/stable/reference/generated/numpy.dot.html และ PyTorch ReLU/MSELoss ตามลิงก์ในบท ไม่อ้างคัดลอกวิดีโอ/asset
- `node tests/ai-foundations.mjs` ผ่านโมเดลใหม่และinvalid inputs; Browser4บทใหม่ผ่านPixel255→1, Dot.6→1, ReLU−1/1 taskgate และMSE1→0 ไม่รันบทเดิมซ้ำ ตรวจเฉพาะลิงก์เข้าForwardที่แก้และนาฬิกา renderer ใหม่ การตรวจdesktopไม่ใช่ทุกมุม/มือถือ/WebGL failure

ยังไม่ผลิตวิดีโอ/สร้างBatch/Epoch/Validation หรือส่วนLLM และไม่commit/push/deploy

หลักฐานรอบ Foundations: Activationเล่น speed2 จบ3/3และหยุดเอง, speed.5 playheadเคลื่อนแล้วPauseค้าง208.3ms, ลิงก์05เปิดForwardจริง/กลับปูพื้นได้ ภาพ `/tmp/techatlas-ai-foundations.jpg`; clean release `/tmp/techatlas-release-c0bPnK/dist` ไม่รวมai-foundation/ai-neural assets ไม่ใช่deployment

เปิดในเครื่อง: http://127.0.0.1:4174/prototypes/ai-neural.html

ต้นแบบตาม `AI-PLAN-3B1B.md` ไม่แทนหลักสูตรครบ 20 บท ยังไม่เพิ่ม AI ใน Explore/route/glossary Production ไม่ commit/push/deploy

## ขอบเขตที่ทำ

1. Neuron: Input 2 ค่า, Weight, Bias และ weighted sum ก่อน Activation
2. Forward: 2 → 3 → 2, Hidden tanh, Output เชิงเส้นสำหรับ regression 2 ค่า ไม่ใช้ Softmax หรืออ้างเป็น probability
3. Gradient Descent: linear regression จากข้อมูลสังเคราะห์ 6 คู่ ใช้ MSE เฉลี่ย 6 ตัวอย่าง ผิว Loss จริงในช่วง w,b ∈ [−2,2] ย่อความสูงไว้สูงสุด 8 แต่ไม่ clamp ค่าฝึกหรือตาราง Loss
4. Backprop: MSE เฉลี่ยเอาต์พุต 2 ค่า, Chain rule ของ tanh, Gradient ทั้ง 17 พารามิเตอร์ และ Finite difference ของตัวอย่าง w₁[1,1]; การเล่น trace ไม่อัปเดตน้ำหนัก ต้องกดฝึก

โมเดล JavaScript รันจริงใน browser ไม่มี Worker ในต้นแบบนี้ (งานเล็ก 17 พารามิเตอร์) ไม่มี GPU training/API/LLM/video ที่ผลิตแล้ว ไม่มีการส่ง input ออกไปภายนอก; โหลด Three.js จาก CDN ตามเว็บเดิม

3D มี Orbit, flow ต่อเนื่อง, เล่น/หยุด/เดินขั้น/reset และ speed 0.5×–2× ใช้นาฬิกาเดียว ไม่เปลี่ยน learning rate; ป้าย DOM อ่านค่า ไม่ใช้ text texture ถ้า WebGL/CDN ล้มเหลวมีตารางคำนวณและเดินขั้นด้วยมือ ฟีเจอร์ fallback ยังไม่ได้บังคับ fail ใน Browser QA

ศัพท์แยกในแต่ละบทตามลำดับการพบ ยังไม่รวมพจนานุกรมเว็บจริงจนกว่าจะ integrate AI ตามแผน

## แหล่งและการเรียบเรียง

- https://www.3blue1brown.com/lessons/neural-networks/
- https://www.3blue1brown.com/lessons/gradient-descent/
- https://www.3blue1brown.com/lessons/backpropagation/
- https://www.3blue1brown.com/lessons/backpropagation-calculus/
- https://docs.pytorch.org/tutorials/beginner/basics/autogradqs_tutorial.html

อ่านบทความ/กลไกที่เกี่ยวข้องและดูคลิปย่อย propagation หนึ่งตัวอย่าง ไม่อ้างว่าชมวิดีโอทั้งหมด สร้างข้อมูล สูตร UI ภารกิจและภาพใหม่ ไม่ดาวน์โหลด/คัดลอก asset ของต้นทาง การให้เครดิตไม่ใช่รับประกันลิขสิทธิ์ทุกกรณี

## ตรวจรับต้นแบบ

- `node tests/ai-neural.mjs` ผ่าน: 17 analytic gradients × 4 inputs เทียบ finite difference tolerance 1e−7, immutable params, deterministic initial/reset, loss ลดด้วยก้าวตั้งต้น, learning rate2 เกิด overshoot จริง และ linear gradients เทียบ finite difference
- Browser จริงทั้ง 4 tabs: เปลี่ยน Input แล้วภาพ/ผลอัปเดต, Neuron z0.7→1.2, Forward x₁0→Outputใหม่/weightsเดิม, Gradient rate.15 10ก้าว Loss2.7697→.0911 / rate2 2ก้าว→79.3405, Backprop task เริ่มต้นไม่ผ่าน ดู gradientแล้วฝึก Loss.2437→.0783 ผ่าน
- Forward speed2 flow playhead เคลื่อนและ Pause ค้างที่866.6ms ผ่าน; ไม่อ้างว่าทุก speed/ทุกฉาก/ทุกมุม/มือถือผ่าน
- Syntax และ diff whitespace ผ่าน; prepare-release ตัด ai-neural-*.js ตามกฎเดิม ต้นแบบ HTML/CSS อยู่ `prototypes` นอก `dist` ไม่ไป production release
- หลักฐานภาพ `/tmp/techatlas-ai-neural.jpg`; เลขรอบต้นแบบ 01–04 ไม่ใช่เลขลำดับหลักสูตรสุดท้าย

## งานถัดไป

ปรับอ่านภาพบนมือถือ/ทดสอบ fallback และเติมคำอธิบายรายขั้นให้ลึกขึ้น ก่อน integrate; สร้างข้อมูล→เวกเตอร์→Activation/Loss เพื่อปูพื้น แล้ว Batch/Epoch/Validation ต่อ ไม่เริ่ม Attention/LLM ก่อนฐานคำนวณนี้พร้อม คลิปภาษาไทยยังไม่ผลิต
