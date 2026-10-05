# AI Visual Lab — จาก Neural Network สู่ LLM

แผนใหม่ 2026-10-05 · ผู้จัดทำ Warapon Wichitpan

สถานะ: สร้างและเผยแพร่ AI รุ่นทดลอง 10 บทแล้ววันที่ 2026-10-05 บทที่เหลือยังอยู่ในแผน ผู้ใช้สั่งเลิกใช้ AI เก่า 4 บทและลบชุดเก่าออก ใช้เอกสารนี้เป็นแผนหลักเพียงฉบับเดียว

## 1. เป้าหมาย

ให้ผู้เริ่มต้นเห็นว่าโมเดลรับตัวเลข คำนวณคำตอบ วัดความผิดพลาด และเปลี่ยนพารามิเตอร์อย่างไร ก่อนตามข้อมูลจากข้อความผ่าน Transformer ไปเป็น token ถัดไป ไม่เริ่มจากการใช้ Chatbot หรือเรียก API ไม่ต้องผ่าน Network/Python มาก่อน

แกนหลัก: ข้อมูล → Neural Network → การเรียนรู้ → ตรวจโมเดล → ภาษาและเวกเตอร์ → Attention/Transformer → LLM และข้อจำกัด

จบแล้วต้องอธิบายได้ว่า inference ใช้พารามิเตอร์เดิม แต่ training อัปเดตพารามิเตอร์; ไล่ forward/backward ของโมเดลเล็กได้; อ่าน token/embedding/attention/MLP/output ได้; และไม่ตีความความน่าจะเป็นเป็นหลักฐานว่าคำตอบจริง

## 2. ขอบเขตที่ศึกษา reference

อ่านหน้า topic และบท Neural Network, Gradient Descent, Analyzing our Neural Network, Backpropagation, Backpropagation Calculus, Mini LLM, GPT/Transformer, Attention และ MLP ผ่านบทความบนเว็บไซต์ ตรวจหน้า Neural Network ใน browser และเปิดดูคลิปสั้น network-propagation; ตรวจพบคลิปย่อย pixels-to-neurons, sigmoid และ matrix operations ประกอบเนื้อหา ไม่ได้ชมวิดีโอเต็มทุกบทหรือทดสอบทุก interactive ของต้นทาง

สิ่งที่จะนำมาใช้เป็นหลักการสอน:

- แสดง input/ค่าระหว่างทาง/output ก่อนใช้สัญลักษณ์ย่อ
- Zoom จากทั้งระบบเข้าสู่การคำนวณเล็กหนึ่งจุด แล้วกลับออกมารวมภาพ
- แยกสี/ป้ายของข้อมูล พารามิเตอร์ และ gradient ให้ผู้เรียนไม่สับสน
- วิดีโอสั้นอยู่ใกล้คำอธิบายขั้นนั้น ไม่ใช่คลิปยาวที่แทนบทเรียนทั้งหมด
- ให้คาดการณ์ผลก่อนทดลอง มีคำถามและ feedback ใกล้ภาพ
- มีบททดลองความผิดพลาดและข้อจำกัด ไม่แสดงแต่ตัวอย่างสำเร็จ
- ใช้ 3D เป็นมุมมองโครงสร้าง ไม่แสร้งว่าทุกแกนใน embedding มีความหมายชัดเจนหรือโมเดลทำงานเหมือนสมองจริง

เนื้อหาของเราจะเป็นภาษาไทย โจทย์/ภาพ/สคริปต์ใหม่ ใช้ตัวอย่างข้อมูลจุดและรูปทรงที่สร้างเอง ไม่คัดลอกฉากเลขลายมือ ประโยคเฉพาะ ภาพ animation หรือบทบรรยายของต้นทางมาเปลี่ยนคำ

## 3. ลำดับหลักสูตรใหม่: 20 บท

### เฟส 0 · อ่านข้อมูลและภาพคณิตศาสตร์ให้เป็น

| # | บท | ภาพ/การทดลอง | ภารกิจและเกณฑ์ผ่าน |
|---|---|---|---|
| 01 | จากภาพและข้อความ สู่ข้อมูลที่โมเดลใช้ | แก้กริดรูปทรง 6×6 ดูค่า pixel; ข้อความเป็นตัวอย่าง representation แยกกัน ปู AI/ML/DL/LLM แบบสั้น | เปลี่ยน 1 pixel และชี้ input index ที่เปลี่ยน แยกข้อมูลกับ label ได้ |
| 02 | Vector, Matrix และ Dot Product | ลากเวกเตอร์ 2D/3D ดูผลคูณและผลรวม คูณ matrix เล็กพร้อมแสดง shape | คำนวณ dot product ตัวอย่าง และเลือก matrix shape ที่คูณได้ ไม่มีตัวเลขจากการเดา |

### เฟส 1 · Neural Network คำนวณอย่างไร

| # | บท | ภาพ/การทดลอง | ภารกิจและเกณฑ์ผ่าน |
|---|---|---|---|
| 03 | Neuron: Weight, Bias และ Weighted Sum | ซูม neuron เดียว ค่าจากแต่ละ input ไหลเข้าสู่ผลรวม แยก contribution บวก/ลบ | ใช้ input เดิม เปลี่ยน weight หนึ่งค่าแล้วอธิบายส่วนที่ทำให้ผลเปลี่ยน |
| 04 | Activation: ทำไมต้องมีความไม่เป็นเส้นตรง | สลับ sigmoid/ReLU และไม่มี activation มีกราฟ 2D พร้อมโครงสร้าง 3D | แยกค่าก่อน/หลัง activation; ทดลอง XOR แล้วอธิบายข้อจำกัดของระบบเชิงเส้น |
| 05 | Layer และ Forward Pass | network จิ๋ว 2→3→2 ค่าคำนวณเคลื่อนผ่านชั้น เลือก neuron ดูสมการได้ | คาดการณ์ก่อนรัน แล้วตามค่า input→hidden→logits; softmax จะลงรายละเอียดภายหลัง |

### เฟส 2 · โมเดลเรียนรู้และพลาดอย่างไร

| # | บท | ภาพ/การทดลอง | ภารกิจและเกณฑ์ผ่าน |
|---|---|---|---|
| 06 | Loss: คำตอบห่างเป้าหมายเท่าไร | prediction เทียบ target; เริ่ม MSE สำหรับ regression แล้วแยก cross-entropy สำหรับ classification | เทียบคำตอบสองชุดและบอกว่าชุดใด loss ต่ำกว่า โดยไม่เหมารวม loss กับ accuracy |
| 07 | Gradient Descent และ Learning Rate | ผิว loss ของพารามิเตอร์เพียง 2 ค่า ทิศ gradient กับก้าว update คำนวณจริง | เทียบ learning rate เล็ก/พอดี/ใหญ่ พร้อมกราฟ loss; อธิบาย overshoot และไม่รับรอง global minimum |
| 08 | Backpropagation: ความผิดพลาดส่งผลต่อ Weight ใด | computational graph จิ๋ว แยก forward values กับ backward derivatives; chain rule เป็นส่วนขยายเลือกอ่าน | ตรวจ gradient ของ 1 weight เทียบ finite difference และอธิบายทิศ update; แยก backprop คำนวณ gradient จาก optimizer ที่ใช้ update |
| 09 | Training Loop: Batch, Epoch และการอัปเดต | เดิน sample→forward→loss→backward→update; batch gradient เฉลี่ยตามสูตร | ฝึกชุดเล็กจริง จด weight ก่อน/หลัง; รัน inference แล้วพิสูจน์ว่า weights ไม่เปลี่ยน |
| 10 | ตรวจโมเดล: Generalization และ Overfitting | จุด train/validation/test แยกสี ดู decision boundary/loss และตัวอย่างผิด; perturb input | เปรียบเทียบผล train กับ validation เลือกโมเดลโดยไม่ใช้ test จูน แล้ววัด test ตอนท้าย; หา input ที่โมเดลพลาด |

### เฟส 3 · จากภาษา สู่ Transformer และ LLM

| # | บท | ภาพ/การทดลอง | ภารกิจและเกณฑ์ผ่าน |
|---|---|---|---|
| 11 | Language Model และ Token | ข้อความ→token IDs→ตัวเลือก token ถัดไป ใช้ tokenizer จิ๋วที่ระบุวิธีและ vocabulary; แยกตัวอย่างไทย/อังกฤษ | ทดลองคำใหม่ที่ไม่อยู่ใน vocabulary และอธิบายว่า token ไม่เท่ากับคำเสมอ; โมเดลจิ๋วไม่ใช่ LLM |
| 12 | Embedding: Token กลายเป็น Vector | lookup table จริงของโมเดลจิ๋ว; จุด 3D พร้อมรายการค่าจริง; ถ้าใช้ projection ต้องติดป้ายและคำนวณจากเวกเตอร์เดิม | เลือก token แล้วตรวจแถว lookup; แยก input embedding กับ contextual representation; ไม่ตั้งชื่อแกนว่าเป็นความหมายแน่นอน |
| 13 | Logits, Softmax และ Sampling | logits→probability bars→เลือก token; temperature และ seed มีค่าให้ตรวจ | เทียบ 0.5/1/2 ของ temperature โดยคง logits แล้วอธิบายว่ากระจายต่างกัน ไม่ใช่ปรับความจริงของคำตอบ |
| 14 | Attention ทีละขั้น: Query, Key, Value | token→Q/K/V→scaled dot product→causal mask→softmax→weighted sum; 3D flow คู่กับ matrix ที่อ่านได้ | ตรวจ attention หนึ่งแถวรวมได้ 1 หลัง mask ไม่มีการอ่าน token อนาคต และคำนวณ output จาก V ได้ |
| 15 | Multi-head และตำแหน่ง Token | แยก head ด้วยพารามิเตอร์คนละชุด concat แล้ว output projection; แสดง positional representation ของโมเดลที่เลือก | สลับลำดับ input แล้วเปรียบเทียบ เปิด/ปิด positional input; ไม่ติดป้ายว่าแต่ละ head ทำหน้าที่ภาษาหนึ่งอย่างเสมอ |
| 16 | MLP: อีกส่วนสำคัญนอกเหนือจาก Attention | FFN ต่อ token: linear→activation→linear แสดง input/output dimension และพารามิเตอร์; อภิปรายข้อจำกัดการตีความ neuron | ตรวจว่าใช้ FFN weights ร่วมกันทุก token; แยกการคำนวณที่เห็นจริงออกจากข้อสันนิษฐานว่าความรู้เก็บตรงไหน |
| 17 | รวม Transformer Block | decoder-only model ย่อที่กำหนด architecture ชัด: residual, normalization, attention, FFN แล้วต่อ blocks→output logits | ตาม token หนึ่งตัวจนถึง logits; ปิดส่วนที่โมเดลรองรับเพื่อเทียบผล ไม่ใช้ภาพ Attention อย่างเดียวแทน Transformer ทั้งหมด |
| 18 | LLM เรียนมาอย่างไร และสร้างคำตอบอย่างไร | แยก next-token training, instruction tuning, preference alignment เชิงแนวคิด กับ autoregressive inference; flow context→token→context ใหม่ | อธิบายว่าตอนไหนพารามิเตอร์อัปเดต; ทดลอง generation ของ tiny model ที่ระบุ training provenance ไม่อ้างว่าฝึก LLM ใหญ่ในเว็บ |

### เฟส 4 · เข้าใจความสามารถและข้อจำกัด

| # | บท | ภาพ/การทดลอง | ภารกิจและเกณฑ์ผ่าน |
|---|---|---|---|
| 19 | ทำไมโมเดลตอบผิดทั้งที่เลือก Token อย่างมั่นใจ | เปรียบเทียบ distribution กับหลักฐานจริง ใช้ข้อเท็จจริงสมมติที่ตรวจได้; context window แยกจาก weights | ชี้คำตอบที่ไม่มีหลักฐาน แยก likelihood จาก correctness และแยก context จากความจำถาวร |
| 20 | Mini-project: เปิดฝากระโปรงโมเดลของเรา | สองงาน: ฝึก tiny classifier จากข้อมูลเรา และตาม tiny language model ตั้งแต่ token ถึง sampling | ส่งสมุดผลก่อน/หลังฝึก, input ที่พลาด, ค่า intermediate และข้อจำกัด; ผ่านจากการทดลองไม่ใช่ดูคลิปครบอย่างเดียว |

ทุกบทมีคำขยายศัพท์ตามลำดับที่พบและพจนานุกรมร่วม คณิตศาสตร์ละเอียดเปิดเพิ่มได้ ไม่บังคับแคลคูลัสเต็มหลักสูตรก่อนเริ่ม แต่ไม่ข้าม prerequisite เช่น dot product ไปหา Attention ทันที

## 4. ประสบการณ์หน้าบทและวิดีโอ

โครงบท: คำถามชวนสงสัย → คลิปสาธิตสั้น → คำอธิบายขั้นนั้น → Lab ให้ปรับเอง → ภารกิจ/feedback → ข้อจำกัด/แหล่งอ่านต่อ

- Lab เป็นเนื้อหาหลัก ไม่ใส่คลิปกับฉากซ้ำขนาดใหญ่พร้อมกัน ใช้แท็บ “ดูสาธิต” / “ทดลองเอง” และปุ่มกลับขั้นที่คลิปกำลังอธิบาย
- ผล/ตัวเลข/สมการเป็น DOM อ่านได้ มีเส้นชี้ถึงวัตถุ 3D; ไม่ฝังข้อความสำคัญใน texture เล็ก
- ฉากตามเวลาควบคุมเล่น/หยุด/ก่อน–ถัดไป/reset และความเร็ว 0.5×–2×; ตัวปรับความเร็วภาพแยกชัดจาก learning rate และ temperature
- สมการและ attention matrix เป็น 2D สนับสนุนการอ่าน ขณะที่ 3D แสดง computational graph/โครงสร้าง/การผสมข้อมูล ไม่ใช้ packet network เป็นภาพแทน neuron
- คลิปที่ผลิตเองเป้าหมาย 60–180 วินาทีต่อแนวคิด ใช้ renderer/ค่าคำนวณเดียวกับ Lab, script ภาษาไทย, caption และ transcript; scene preset ต้องมี seed และ scenario เพื่อทำซ้ำ
- ผลิตคลิปหลัง Lab ผ่านการตรวจ ไม่สร้างคลิปตัวเลขชุดหนึ่งกับ Lab อีกชุดหนึ่ง; หยุด Lab เมื่อเปิดคลิปเพื่อไม่แย่งทรัพยากร
- วิดีโอยาวของต้นทางเป็นสื่ออ่านต่อแบบ optional ผ่านลิงก์ทางการ หรือ official embed เมื่ออนุญาตและตรวจเงื่อนไขแล้ว ไม่ดาวน์โหลด/ตัดต่อ/rehost คลิปของผู้อื่น ไม่แปลบทบรรยายเต็มมาเป็นของเรา
- เริ่มจาก 4 คลิปที่จำเป็นที่สุด: neuron หนึ่งตัว, forward→backward→update, Q/K/V, token→logits→sampling; วิดีโอครบทุกบทเป็นงานหลังต้นแบบ ไม่อ้างว่าพร้อมแล้ว
- lazy-load วิดีโอเมื่อผู้ใช้เลือกดู poster ก่อนโหลด caption/fallback เมื่อเล่นไม่ได้ กำหนด encoding/asset budget และ hosting หลังวัดขนาดจริง ไม่ใส่ MP4 ใหญ่ทุกบทใน Pages dist โดยไม่ตรวจลิมิต

## 5. ขอบเขตการคำนวณและความถูกต้อง

- neuron/forward/loss/gradient/update/attention/softmax ของ tiny models คำนวณจริงใน browser worker พร้อม trace ที่ renderer อ่าน ไม่แต่งค่าระหว่างทาง
- ใช้ weights ที่ปรับมือเพื่อสอนต้องติดป้าย; weights ที่ฝึกต้องมี seed/dataset/objective/รุ่น และผลตรวจ ไม่ทำ hand-crafted embedding แล้วอ้างว่าโมเดลค้นพบความหมายเอง
- เริ่มจากโมเดลข้อมูลจุด 2 features และกริดรูปทรงที่สร้างเอง; ผล fit และความสำเร็จขึ้นกับข้อมูล/seed ไม่กำหนด animation loss ลดทุกครั้งโดยไม่คำนวณ
- Surface 3D ของ loss ใช้ 2 พารามิเตอร์เท่านั้นหรือ slice ที่ตรึงค่าอื่น ไม่ใช่ loss landscape ของทุกพารามิเตอร์จริงทั้งหมด
- Tiny Transformer เลือก vocabulary/context/block/head dimensions ให้จออ่านได้ อาจเป็น checkpoint ฝึกไว้ที่มี provenance; การฝึกเต็มใน browser ไม่เป็นเงื่อนไขขั้นต่ำของต้นแบบ Attention
- ค่าที่ตัดออกจากโมเดลมาตรฐาน เช่น dropout/KV cache ต้องบอกว่าไม่จำลอง; ภาพค่อยไหลเป็นการสอน ไม่ใช่แสดงว่าคอมพิวเตอร์จริงคำนวณทีละเส้นด้วยความเร็วนั้น
- ไม่สรุปว่า MLP เก็บข้อเท็จจริงทั้งหมด, neuron หนึ่งตัวแทนแนวคิดเดียว หรือ attention map เป็นคำอธิบายเหตุผลที่สมบูรณ์
- ชุดนี้ไม่มี paid Model API, บัญชีผู้เรียน, secret หรือการส่ง input ไปโมเดลภายนอกโดยปริยาย

## 6. ลำดับลงมือและส่งมอบ

1. ออกแบบระบบค่าร่วม/สี/ป้าย/trace และสร้าง vertical slice บท 03, 05, 07, 08 เพื่อพิสูจน์ว่า forward/backward/update และ 3D ตรงกันก่อน
2. เติมเฟส 0–2 ครบ 10 บท มี train/validation/test และความผิดพลาดจริง บท 08 มี math appendix ไม่สร้างบทสูตรยาวซ้ำ
3. สร้างชุดภาษาเล็กที่เราเขียนเอง กำหนด tokenizer/vocabulary/weights แล้วทำบท 11–14 ให้ตาม Q/K/V และ sampling ได้
4. เติมบท 15–18 ด้วย architecture เดียวกันต่อเนื่อง ไม่ใช้ tiny bigram แทน Transformer โดยไม่แจ้ง
5. เติมบท 19–20 และผลิตคลิปของเรา 4 ชิ้นแรกจาก Lab ที่ตรวจแล้ว ตรวจ caption/อ่านตัวเลข/หยุด–เล่น/อัตราความเร็ว และขนาด asset
6. ทดสอบเฉพาะบท/กลไกใหม่ ให้ผู้เริ่มต้นทำภารกิจได้โดยไม่ฟังผู้สอนช่วย แล้วจึงเสนอเปิดหมวด AI พร้อม release ที่ตัด draft อื่นออก ต้องขออนุมัติ commit/push/deploy แยกจากการอนุมัติแผน

ต้นแบบผ่านเมื่อผู้เรียนตามตัวเลขผ่าน neuron ได้ แยก forward/backward/update ได้ และทดลอง learning rate แล้วอธิบายผลจริง ไม่ใช่เห็นโครงข่ายสว่างแต่ไม่รู้ว่าสว่างเพราะค่าอะไร

## 7. เกณฑ์ตรวจรับ

- Numerical: forward/softmax/loss ผ่าน known cases; gradient เทียบ finite difference ภายใน tolerance ที่ระบุ; masked future attention เป็นศูนย์; tensor shapes/head concat/residual ถูกต้อง
- State: inference ไม่เปลี่ยน weights; reset seed/model คืน baseline; batch/update counter ตรงกับ training; trace ของภาพตรงกับผลและสถานการณ์ล่าสุด
- Pedagogy: เป้าหมาย/action/input/สิ่งสังเกต/เกณฑ์ผ่านเฉพาะบท ไม่ใช้ “ลองเปลี่ยนดู” ทุกหน้า; มี success/failure และคำใบ้จากสิ่งที่ผู้เรียนทำจริง
- UI: motion ไหลต่อเนื่องไม่ตัดวาบ; pause ตำแหน่งจริง; speed ไม่เปลี่ยน numeric result; ป้ายไม่ทับ อ่านไทยและสมการได้บน desktop/mobile; WebGL failure ยังอ่านค่าคำนวณได้
- Video: caption/transcript ตรง script, มีชื่อผู้สร้าง/แหล่งอ่านต่อ, ดูได้โดยไม่ autoplay เสียง, Lab กับวิดีโอไม่เล่นพร้อมกันโดยไม่จำเป็น
- Content: ตรวจ paper/เอกสารหลักก่อนแต่ละ release ไม่ยกข้อสรุปเชิงอุปมาเป็นข้อเท็จจริง ไม่ผูกตัวอย่างความเสียหายกับองค์กรจริง

## 8. ยังไม่รวมในชุดนี้

RAG, Tool Calling, Agent, การใช้ Model API, deployment backend, CNN/RNN เชิงลึก, diffusion/image generation และการฝึก LLM ขนาดใหญ่ เป็นเส้นทางต่อยอดภายหลัง ไม่แทรกให้ชุด Neural Network→LLM แตกประเด็น

## 9. แหล่งหลัก

- [หัวข้อ Neural Networks](https://www.3blue1brown.com/?topic=neural-networks)
- [Neural Network](https://www.3blue1brown.com/lessons/neural-networks/)
- [Gradient Descent](https://www.3blue1brown.com/lessons/gradient-descent/)
- [Analyzing our Neural Network](https://www.3blue1brown.com/lessons/neural-network-analysis/)
- [Backpropagation](https://www.3blue1brown.com/lessons/backpropagation/) และ [Calculus](https://www.3blue1brown.com/lessons/backpropagation-calculus/)
- [Mini LLM](https://www.3blue1brown.com/lessons/mini-llm/)
- [Transformer / Embedding](https://www.3blue1brown.com/lessons/gpt/)
- [Attention](https://www.3blue1brown.com/lessons/attention/)
- [MLP และข้อจำกัดการตีความ](https://www.3blue1brown.com/lessons/mlp/)
- [Attention Is All You Need — งานวิจัยต้นฉบับ](https://research.google/pubs/attention-is-all-you-need/)

แหล่งเหล่านี้เป็น reference การวางแผน ไม่ใช่การอนุญาตนำ assets มาเผยแพร่ การให้เครดิตและเรียบเรียงใหม่ไม่รับประกันสิทธิ์ทุกกรณี
# ความคืบหน้า 2026-10-05

รอบถัดมาเพิ่ม09Batch/Epochและ10Validation/Overfitting ใน `prototypes/ai-training.html` รวมต้นแบบใหม่10บท ขอบเขต/หลักฐาน `AI-TRAINING-PROTOTYPE.md`; ยังไม่ทำToken/Embedding/Transformer/วิดีโอ หรือเปิดProduction

รอบต่อเพิ่มต้นแบบ4บทปูพื้น ข้อมูล→Vector/Dot→Activation→Loss ใน `prototypes/ai-foundations.html` รวม8บทใหม่ เชื่อม4บทเดิมตามลำดับแผน ยังคง Local prototype; Batch/Epoch/Validation และฝั่ง LLM ยังไม่ทำ คลิปยังไม่ผลิต

เริ่ม vertical slice Neuron / Forward / Gradient Descent / Backpropagation ใน `prototypes/ai-neural.html` แล้ว ใช้ regression 2→3→2 และตรวจ Gradient 17 พารามิเตอร์จริง รายละเอียด/ข้อจำกัด/หลักฐาน `AI-NEURAL-PROTOTYPE.md` ยังไม่ใช่หลักสูตรเต็ม ไม่เปิด AI Production หรือผลิตวิดีโอ และยังไม่ commit/push/deploy
