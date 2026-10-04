import { pythonTasks } from './python-tasks.js';
import { pythonNextLessons } from './python-next.js';

export const pythonReference = {
  title: "เขียนโปรแกรมภาษา Python สำหรับผู้เริ่มต้น.pdf",
  pages: 37,
  note: "บทพื้นฐานใช้เอกสารที่เจ้าของเว็บไซต์ให้ไว้ประกอบการจัดลำดับ เอกสารต้นฉบับระบุอ้างอิง KongRuksiam Tutorial ส่วนบทต่อยอดเรื่องสมาชิก identity และ copy เขียนคำอธิบาย ตัวอย่าง และภารกิจใหม่ โดยตรวจแนวคิดกับ Python Documentation ไม่ใช้ภาพต้นฉบับ",
};

export const pythonSections = [
  { id: "basics", title: "เริ่มต้นและพื้นฐาน", pages: "3–17" },
  { id: "control", title: "เงื่อนไขและการทำซ้ำ", pages: "18–23" },
  { id: "structures", title: "โครงสร้างข้อมูล", pages: "24–28" },
  { id: "functions", title: "ฟังก์ชันและขอบเขตตัวแปร", pages: "29–30" },
  { id: "exceptions", title: "จัดการข้อผิดพลาด", pages: "31, 34" },
  { id: "modules", title: "โมดูลและการ import", pages: "32–33" },
  { id: "practice", title: "แบบฝึกหัดท้ายบท 6 ข้อ", pages: "35–36" },
  { id: "next", title: "ต่อยอด: สมาชิก ค่า และการอ้างถึงข้อมูล" },
  { id: "extensions", title: "ต่อยอด: ข้อมูล ฟังก์ชัน OOP และไฟล์" },
];

const lesson = (
  id,
  section,
  pages,
  title,
  subtitle,
  explain,
  starter,
  solution,
  expected,
  extra = {},
) => ({
  id,
  track: "python",
  section,
  pages,
  title,
  subtitle,
  explain,
  starter,
  solution,
  expected,
  time: 15,
  visual: "python",
  tag: "PYTHON / " + section.toUpperCase(),
  scenario: subtitle,
  steps: [
    "อ่านแนวคิดและตัวอย่าง",
    "แก้โค้ดแล้วกดรันเพื่อดูผล",
    "ตรวจผลลัพธ์และลองเปลี่ยนข้อมูลด้วยตัวเอง",
  ],
  hint: "เทียบผลลัพธ์กับโจทย์ และเปิดตัวอย่างเฉลยเพื่อดูแนวทางเมื่อจำเป็น",
  work: "ลองเปลี่ยนค่าตัวแปรแล้วสังเกตว่าผลลัพธ์เปลี่ยนอย่างไร",
  source: "https://docs.python.org/3/tutorial/",
  ...extra,
  task: pythonTasks[id],
  steps: pythonTasks[id].actions,
  work: 'หลังผ่านภารกิจแล้ว: ' + pythonTasks[id].extension + ' (ผลอาจต่างจากตัวอย่างและไม่ผ่านโจทย์เดิม)',
});

export const pythonLessons = [
  // Original exercises addressing gaps found in the supplied playlist inventory.
  lesson(
    "python-start",
    "basics",
    "3–9",
    "เริ่มต้น Python และโปรแกรมแรก",
    "รู้จักภาษา โปรแกรม ตัวแปลภาษา และทดลอง Hello, Python!",
    "โปรแกรมคือชุดคำสั่งที่บอกให้คอมพิวเตอร์ทำงาน ส่วนโค้ดคือข้อความคำสั่งที่เราเขียน Python เป็นภาษาที่อ่านง่ายและใช้ได้หลายระบบ บทนี้รันในเบราว์เซอร์ได้ทันทีโดยยังไม่ต้องติดตั้งเครื่องมือ เมื่อพร้อมฝึกในเครื่อง ให้ติดตั้งจาก python.org เลือก IDLE หรือ VS Code สร้างไฟล์ hello.py แล้วใช้ python hello.py (บางระบบใช้ python3) ตรวจรุ่นด้วย python --version ตามสภาพแวดล้อมของคุณ CPython แปลงโค้ดเป็น bytecode ก่อนให้เครื่องเสมือนทำงาน จึงไม่ควรตีความว่า Interpreter อ่านเพียงทีละบรรทัดโดยไม่มีการแปลใด ๆ",
    '# โปรแกรมแรกของคุณ\nprint("Hello!")\n',
    'print("Hello, Python!")',
    "Hello, Python!",
    {
      hint: "เปลี่ยนข้อความในเครื่องหมายคำพูดเป็น Hello, Python!",
      work: "หลังผ่านภารกิจ ลองเปลี่ยนข้อความเป็นคำทักทายของคุณเอง",
    },
  ),

  lesson(
    "indentation",
    "basics",
    "10",
    "ย่อหน้าให้ Python เข้าใจ",
    "จัดบล็อกคำสั่งด้วย Indentation และทดลองอ่านข้อผิดพลาด",
    "Python ใช้การย่อหน้าเพื่อกำหนดกลุ่มคำสั่ง หลัง if และ else ต้องมี : และคำสั่งภายในต้องเยื้องเท่ากัน ปกติใช้ 4 ช่องว่าง ปุ่ม Tab ในห้องทดลองนี้จะใส่ช่องว่าง 4 ช่องให้ หากไม่เยื้อง Python จะแจ้ง IndentationError",
    'username = "admin"\nif username == "admin":\nprint("Welcome")\nelse:\n    print("Wrong")\n',
    'username = "admin"\nif username == "admin":\n    print("Welcome")\nelse:\n    print("Wrong")',
    "Welcome",
    { hint: 'เยื้อง print("Welcome") ให้เข้าไป 4 ช่องใต้ if' },
  ),

  lesson(
    "print-comments",
    "basics",
    "11",
    "แสดงผลและเขียนหมายเหตุ",
    "แยกข้อความ การคำนวณ และ Comment ด้วย print() และ #",
    "print() แสดงผล ข้อความในเครื่องหมายคำพูดจะแสดงตามที่เขียน นิพจน์ตัวเลขจะถูกคำนวณก่อนแสดง ส่วน # เริ่มหมายเหตุที่ Python ข้ามไปในบรรทัดนั้น",
    '# แสดงข้อความและผลการคำนวณ\nprint("สวัสดี Python")\nprint("10 + 5")\n# เพิ่มคำสั่งแสดงผล 10 + 5 เป็นตัวเลข\n',
    'print("สวัสดี Python")\nprint("10 + 5")\nprint(10 + 5)',
    "สวัสดี Python\n10 + 5\n15",
    { hint: "เพิ่ม print(10 + 5) โดยไม่ใส่เครื่องหมายคำพูด" },
  ),

  lesson(
    "data-types",
    "basics",
    "12, 17",
    "ชนิดข้อมูลพื้นฐาน",
    "รู้จัก int, float, bool, str และ None พร้อมตรวจด้วย type()",
    'int เก็บจำนวนเต็ม float เก็บเลขทศนิยม bool เก็บ True หรือ False str เก็บข้อความ และ None หมายถึงไม่มีค่าที่ระบุ ใช้ type() ตรวจชนิดของค่าได้ ชนิดข้อมูลต่างกันอาจทำงานร่วมกันไม่ได้ เช่น "5" + 1',
    'print(type(10).__name__)\nprint(type(3.14).__name__)\n# เพิ่มการตรวจชนิด "Python", True และ None\n',
    'print(type(10).__name__)\nprint(type(3.14).__name__)\nprint(type("Python").__name__)\nprint(type(True).__name__)\nprint(type(None).__name__)',
    "int\nfloat\nstr\nbool\nNoneType",
    {
      hint: 'ใช้ print(type(ค่า).__name__) อีก 3 บรรทัดกับ "Python", True และ None',
    },
  ),

  lesson(
    "variables",
    "basics",
    "13",
    "ตัวแปร: ตั้งชื่อให้ข้อมูล",
    "เก็บชื่อ อายุ ส่วนสูง และสถานะนักเรียน แล้วอ่านค่ากลับมา",
    "ตัวแปรคือชื่อที่ผูกกับค่า เครื่องหมาย = กำหนดค่าทางขวาให้ชื่อทางซ้าย ชื่อแต่ละตัวอาจอ้างถึงข้อมูลต่างชนิดกัน ใช้ชื่อตัวแปรใน print() เพื่อแสดงค่าที่เก็บไว้",
    'name = "Somchai"\nage = 20\nheight = 1.75\nis_student = True\n\n# แสดง name และ age ในบรรทัดเดียว\n',
    'name = "Somchai"\nage = 20\nheight = 1.75\nis_student = True\nprint(name, age)',
    "Somchai 20",
    {
      hint: "เพิ่ม print(name, age) โดยไม่ใส่เครื่องหมายคำพูดรอบชื่อของตัวแปร",
    },
  ),

  lesson(
    "variable-names",
    "basics",
    "14",
    "ตั้งชื่อตัวแปรให้ถูกต้อง",
    "แก้ชื่อที่ขึ้นต้นด้วยตัวเลข และแยกตัวพิมพ์เล็กกับตัวพิมพ์ใหญ่",
    "สำหรับชื่อภาษาอังกฤษในบทนี้ ให้เริ่มด้วยตัวอักษรหรือ _ แล้วตามด้วยตัวอักษร ตัวเลข หรือ _ ห้ามเว้นวรรค ใช้ - หรือซ้ำคำสงวน เช่น for ชื่อ age กับ Age เป็นคนละชื่อ Python ยังรองรับอักษร Unicode บางกลุ่ม แต่ตัวอย่างนี้ใช้ชื่อภาษาอังกฤษเพื่อฝึกอ่านโค้ดทั่วไป",
    '2name = "Somchai"\nprint(2name)\n',
    'name2 = "Somchai"\nprint(name2)',
    "Somchai",
    { hint: "เปลี่ยน 2name เป็น name2 ทั้งบรรทัดกำหนดค่าและบรรทัด print" },
  ),

  lesson(
    "input-conversion",
    "basics",
    "15, 17",
    "รับข้อมูลด้วย input()",
    "รับชื่อและอายุ แล้วแปลงข้อความก่อนนำไปคำนวณ",
    "input() คืนค่าเป็น str แม้ผู้ใช้พิมพ์ตัวเลข ใช้ int() แปลงเป็นจำนวนเต็มก่อนบวก หรือ float() เมื่อต้องการเลขทศนิยม ในห้องทดลอง ให้เตรียมข้อมูลในช่องข้อมูลนำเข้าทีละบรรทัดก่อนรัน แต่ละ input() จะอ่านหนึ่งบรรทัดตามลำดับ",
    'name = input("ชื่อ: ")\nage = input("อายุ: ")\nprint(name, age + 1)\n',
    'name = input("ชื่อ: ")\nage = int(input("อายุ: "))\nprint(name, age + 1)',
    "สมชาย 21",
    {
      inputs: "สมชาย\n20",
      hint: 'ครอบ input("อายุ: ") ด้วย int() เพื่อให้ age เป็นจำนวนเต็ม',
      tests: [
        {
          name: "ชื่อและอายุชุดแรก",
          inputs: ["สมชาย", "20"],
          expected: "สมชาย 21",
        },
        {
          name: "เปลี่ยนชื่อและอายุ",
          inputs: ["Mali", "30"],
          expected: "Mali 31",
        },
      ],
    },
  ),

  lesson(
    "operators",
    "basics",
    "16–17",
    "ตัวดำเนินการและการคำนวณ",
    "ทดลอง //, %, **, += และการเปรียบเทียบ",
    "+ - * / ใช้คำนวณทั่วไป // หารแล้วปัดลง % หาเศษ และ ** ยกกำลัง += เพิ่มค่าให้ตัวแปรเดิม == ใช้เปรียบเทียบ ส่วน > และ < คืนค่า bool ตัวอย่างนี้ใช้ตัวเลขบวก",
    "print(7 // 2, 7 % 2, 2 ** 3)\nx = 5\n# เพิ่ม x อีก 3 แล้วตรวจว่า x > 6 หรือไม่\n",
    "print(7 // 2, 7 % 2, 2 ** 3)\nx = 5\nx += 3\nprint(x > 6)",
    "3 1 8\nTrue",
    { hint: "เพิ่ม x += 3 แล้วใช้ print(x > 6)" },
  ),

  lesson(
    "conditions",
    "control",
    "18",
    "ตัดสินใจด้วย if / elif / else",
    "รับคะแนนและเลือกเกรด A, B หรือ C ตามเงื่อนไข",
    "if ตรวจเงื่อนไขแรก elif ตรวจเมื่อเงื่อนไขก่อนหน้าไม่ผ่าน และ else ทำเมื่อทุกเงื่อนไขก่อนหน้าไม่ผ่าน เมื่อเลือกบล็อกหนึ่งแล้วจะข้ามส่วนที่เหลือ กำหนด A ตั้งแต่ 80, B ตั้งแต่ 70 และ C สำหรับคะแนนต่ำกว่า 70",
    'score = int(input())\nif score >= 80:\n    grade = "A"\nelse:\n    grade = "C"\nprint("เกรด", grade)\n',
    'score = int(input())\nif score >= 80:\n    grade = "A"\nelif score >= 70:\n    grade = "B"\nelse:\n    grade = "C"\nprint("เกรด", grade)',
    "เกรด B",
    {
      inputs: "75",
      hint: 'เพิ่ม elif score >= 70: และ grade = "B" ก่อน else',
      tests: [
        { name: "คะแนน 75", inputs: ["75"], expected: "เกรด B" },
        { name: "ขอบเขต 80", inputs: ["80"], expected: "เกรด A" },
        { name: "คะแนน 69", inputs: ["69"], expected: "เกรด C" },
      ],
    },
  ),

  lesson(
    "logic",
    "control",
    "19, 23",
    "ตรรกะ and / or / not",
    "รวมเงื่อนไขอายุและบัตรประจำตัว แล้วดู True / False",
    "and ต้องให้เงื่อนไขทั้งสองเป็นจริง or ต้องมีอย่างน้อยหนึ่งเงื่อนไขเป็นจริง not กลับค่าความจริง ตัวอย่างนี้ใช้อายุ 20 และมีบัตร จึงผ่านเงื่อนไข age >= 18 and has_id",
    "age = 20\nhas_id = True\nprint(age >= 18 and has_id)\n# แสดงเงื่อนไข age < 18 or not has_id\n",
    "age = 20\nhas_id = True\nprint(age >= 18 and has_id)\nprint(age < 18 or not has_id)",
    "True\nFalse",
    { hint: "เพิ่ม print(age < 18 or not has_id)" },
  ),

  lesson(
    "loops",
    "control",
    "20, 23",
    "ทำซ้ำด้วย while และ for",
    "นับ 1 ถึง 3 และสังเกตว่าทำไม range ไม่รวมเลขท้าย",
    "while ตรวจเงื่อนไขก่อนทุกรอบ ต้องเปลี่ยนค่าที่ทำให้ลูปหยุดได้ ส่วน for อ่านสมาชิกทีละตัว range(1, 4) ให้ค่า 1, 2, 3 โดยไม่รวม 4 ภารกิจนี้ให้ใช้ทั้งสองแบบแสดงตัวเลขเดียวกัน",
    "i = 1\nwhile i <= 3:\n    print(i)\n    i += 1\n\nfor i in range(1, 3):\n    print(i)\n",
    "i = 1\nwhile i <= 3:\n    print(i)\n    i += 1\nfor i in range(1, 4):\n    print(i)",
    "1\n2\n3\n1\n2\n3",
    { hint: "เปลี่ยน range(1, 3) เป็น range(1, 4) เพื่อรวมเลข 3" },
  ),

  lesson(
    "loop-control",
    "control",
    "21, 23",
    "ข้ามรอบและหยุดลูป",
    "ใช้ continue ข้ามเลข 3 และ break หยุดเมื่อถึงเลข 6",
    "continue ข้ามคำสั่งที่เหลือของรอบปัจจุบันแล้วไปยังรอบถัดไป break ออกจากลูปทันที ตำแหน่งของสองคำสั่งนี้ต้องอยู่ในบล็อกเงื่อนไขที่ต้องการ",
    "for i in range(1, 8):\n    if i == 3:\n        pass  # ข้ามรอบนี้\n    if i == 6:\n        pass  # หยุดลูป\n    print(i)\n",
    "for i in range(1, 8):\n    if i == 3:\n        continue\n    if i == 6:\n        break\n    print(i)",
    "1\n2\n4\n5",
    { hint: "แทน pass แรกด้วย continue และ pass ที่สองด้วย break" },
  ),

  lesson(
    "nested-loops",
    "control",
    "22",
    "ลูปซ้อนลูป",
    "สร้างตารางคูณ 3 × 3 แล้วดูการทำงานของลูปนอกและลูปใน",
    'ลูปในจะทำงานครบทุกค่าก่อนลูปนอกเปลี่ยนค่า รอบแรก i เป็น 1 และ j เปลี่ยนจาก 1 ถึง 3 print(..., end=" ") แสดงต่อกัน ส่วน print() เปล่าขึ้นบรรทัดใหม่เมื่อจบแถว',
    'for i in range(1, 4):\n    for j in range(1, 4):\n        print(i + j, end=" ")\n    print()\n',
    'for i in range(1, 4):\n    for j in range(1, 4):\n        print(i * j, end=" ")\n    print()',
    "1 2 3\n2 4 6\n3 6 9",
    { hint: "ใช้ i * j แทน i + j เพื่อหาผลคูณในแต่ละช่อง" },
  ),

  lesson(
    "strings",
    "structures",
    "24, 28",
    "String: จัดรูปแบบและตัดข้อความ",
    "ใช้ f-string, index, slicing และ upper() กับข้อความ",
    "f-string แทรกค่าตัวแปรใน {} ได้ String เริ่ม index ที่ 0 เช่น s[0] และ slice s[1:4] เลือกตำแหน่ง 1 ถึง 3 โดยไม่รวม 4 len() นับความยาว และ upper() คืนข้อความตัวพิมพ์ใหญ่",
    'name = "Somchai"\ns = "Python"\nprint(f"Hi {name}")\n# แสดงตัวแรก, slice [1:4] และความยาวในบรรทัดเดียว\n# จากนั้นแสดง s เป็นตัวพิมพ์ใหญ่\n',
    'name = "Somchai"\ns = "Python"\nprint(f"Hi {name}")\nprint(s[0], s[1:4], len(s))\nprint(s.upper())',
    "Hi Somchai\nP yth 6\nPYTHON",
    { hint: "เพิ่ม print(s[0], s[1:4], len(s)) และ print(s.upper())" },
  ),

  lesson(
    "lists",
    "structures",
    "25, 28",
    "List: เก็บและแก้หลายค่า",
    "เพิ่มผลไม้ เปลี่ยนสมาชิก และอ่านบางส่วนของรายการ",
    "List สร้างด้วย [] เก็บสมาชิกตามลำดับ อนุญาตค่าซ้ำและแก้สมาชิกได้ append() เพิ่มท้ายรายการ index เริ่มที่ 0 และ slice [1:] อ่านตั้งแต่ตำแหน่ง 1 จนจบ",
    'fruits = ["apple", "kiwi"]\n# เพิ่ม mango และเปลี่ยน apple เป็น banana\nprint(fruits)\nprint(len(fruits))\nprint(fruits[1:])\n',
    'fruits = ["apple", "kiwi"]\nfruits.append("mango")\nfruits[0] = "banana"\nprint(fruits)\nprint(len(fruits))\nprint(fruits[1:])',
    "['banana', 'kiwi', 'mango']\n3\n['kiwi', 'mango']",
    {
      hint: 'ใช้ fruits.append("mango") แล้วกำหนด fruits[0] = "banana" ก่อน print',
    },
  ),

  lesson(
    "tuples-sets",
    "structures",
    "26, 28",
    "Tuple และ Set ต่างจาก List อย่างไร",
    "อ่าน Tuple และรวมค่าที่ไม่ซ้ำกันด้วย Set",
    "Tuple สร้างด้วย () เก็บลำดับและค่าซ้ำได้ แต่เปลี่ยนสมาชิกโดยตรงไม่ได้ Set เก็บสมาชิกไม่ซ้ำ ไม่มี index ใช้ | รวมเซตและ & หาสมาชิกร่วมกัน Set ว่างต้องเขียน set() เพราะ {} เป็น Dictionary ในตัวอย่างใช้ sorted() เพื่อให้ผลแสดงตามลำดับที่แน่นอน",
    "values = (1, 2, 3)\na = {1, 2, 2}\nb = {2, 3}\nprint(values[0])\n# แสดง union และ intersection โดยครอบด้วย sorted()\n",
    "values = (1, 2, 3)\na = {1, 2, 2}\nb = {2, 3}\nprint(values[0])\nprint(sorted(a | b))\nprint(sorted(a & b))",
    "1\n[1, 2, 3]\n[2]",
    {
      hint: "เพิ่ม print(sorted(a | b)) และ print(sorted(a & b))",
      work: "หลังผ่านภารกิจ ลอง values[0] = 9 เพื่อดู TypeError จากการแก้ Tuple",
    },
  ),

  lesson(
    "collections",
    "structures",
    "27–28",
    "Dictionary: ข้อมูลแบบ key : value",
    "เก็บข้อมูลนักเรียน เพิ่ม GPA และดึงชื่อด้วย key",
    "Dictionary ใช้ key อ้างอิงค่าแทนตำแหน่ง index การกำหนด key ใหม่เพิ่มข้อมูล หาก key เดิมมีอยู่จะเปลี่ยนค่า ใช้ items() เมื่อต้องการวนอ่าน key และ value และ get() เมื่อต้องการค่าเริ่มต้นสำหรับ key ที่อาจไม่มี",
    'student = {"name": "Somchai", "age": 20}\n# เพิ่ม gpa = 3.5\nprint(student)\nprint(student["name"])\n',
    'student = {"name": "Somchai", "age": 20}\nstudent["gpa"] = 3.5\nprint(student)\nprint(student["name"])',
    "{'name': 'Somchai', 'age': 20, 'gpa': 3.5}\nSomchai",
    { hint: 'เพิ่ม student["gpa"] = 3.5 ก่อนแสดงข้อมูล' },
  ),

  lesson(
    "functions",
    "functions",
    "29, 33",
    "สร้างและเรียกใช้ฟังก์ชัน",
    "ใช้ def, parameter, ค่าเริ่มต้น และ return กับฟังก์ชันบวกเลข",
    "Function รวมคำสั่งที่เรียกซ้ำได้ Parameter รับค่าจากผู้เรียก return ส่งผลลัพธ์กลับ ฟังก์ชัน add(a, b=0) กำหนดค่าเริ่มต้นของ b จึงเรียกได้ทั้ง add(2, 3) และ add(5)",
    "def add(a, b=0):\n    return a - b\n\nprint(add(2, 3))\nprint(add(5))\n",
    "def add(a, b=0):\n    return a + b\nprint(add(2, 3))\nprint(add(5))",
    "5\n5",
    {
      hint: "เปลี่ยน a - b เป็น a + b ใน return",
      tests: [
        { name: "ผลลัพธ์ตัวอย่าง", expected: "5\n5" },
        {
          name: "เรียกด้วยค่าใหม่",
          append: "print(add(8, 2))",
          expected: "5\n5\n10",
        },
      ],
    },
  ),

  lesson(
    "lambda-scope",
    "functions",
    "30, 33",
    "Lambda และขอบเขตตัวแปร",
    "สร้างฟังก์ชันยกกำลังสองและทดลอง Local / Global",
    "lambda สร้างฟังก์ชันนิพจน์สั้น ๆ เช่น lambda x: x * x ตัวแปรภายในฟังก์ชันเป็น Local ส่วนตัวแปรนอกฟังก์ชันเป็น Global หากจะกำหนดค่า Global ภายในฟังก์ชันต้องประกาศ global ก่อน ตัวอย่างนี้ใช้เพื่อเรียนขอบเขต แต่ในงานทั่วไปควรส่งค่าเข้าและ return เมื่อทำได้",
    "square = lambda x: x + x\nprint(square(4))\ncount = 0\ndef inc():\n    global count\n    count += 1\ninc()\ninc()\nprint(count)\n",
    "square = lambda x: x * x\nprint(square(4))\ncount = 0\ndef inc():\n    global count\n    count += 1\ninc()\ninc()\nprint(count)",
    "16\n2",
    {
      hint: "แก้ Lambda ให้คูณ x ด้วยตัวเอง",
      tests: [
        { name: "ตัวอย่าง", expected: "16\n2" },
        { name: "ค่าใหม่", append: "print(square(5))", expected: "16\n2\n25" },
      ],
    },
  ),

  lesson(
    "exceptions",
    "exceptions",
    "31, 33–34",
    "จัดการข้อผิดพลาดด้วย try / except",
    "รับตัวหาร แล้วรองรับเลขศูนย์และข้อความที่แปลงเป็นเลขไม่ได้",
    "try ลองทำคำสั่ง except รับข้อผิดพลาดชนิดที่ระบุ และ finally ทำเสมอแม้เกิดข้อผิดพลาด ZeroDivisionError เกิดเมื่อหารด้วยศูนย์ ValueError เกิดเมื่อ int() แปลงข้อความที่ไม่ใช่เลขไม่ได้ ลองข้อมูล 5, 0 และ abc เพื่อดูแต่ละเส้นทาง",
    'try:\n    n = int(input())\n    print(10 / n)\nexcept ValueError:\n    print("กรุณาใส่จำนวนเต็ม")\nfinally:\n    print("จบการทำงาน")\n',
    'try:\n    n = int(input())\n    print(10 / n)\nexcept ZeroDivisionError:\n    print("หารด้วย 0 ไม่ได้")\nexcept ValueError:\n    print("กรุณาใส่จำนวนเต็ม")\nfinally:\n    print("จบการทำงาน")',
    "หารด้วย 0 ไม่ได้\nจบการทำงาน",
    {
      inputs: "0",
      hint: 'เพิ่ม except ZeroDivisionError: และคำสั่งแสดงข้อความ "หารด้วย 0 ไม่ได้" ก่อน except ValueError',
      tests: [
        { name: "หารปกติ", inputs: ["5"], expected: "2.0\nจบการทำงาน" },
        {
          name: "หารด้วยศูนย์",
          inputs: ["0"],
          expected: "หารด้วย 0 ไม่ได้\nจบการทำงาน",
        },
        {
          name: "ข้อความที่ไม่ใช่เลข",
          inputs: ["abc"],
          expected: "กรุณาใส่จำนวนเต็ม\nจบการทำงาน",
        },
      ],
    },
  ),

  lesson(
    "modules",
    "modules",
    "32–33",
    "แยกไฟล์และ import โมดูล",
    "แก้ mymath.py แล้วเรียกจาก main.py ด้วย import และ from",
    "Module คือไฟล์ที่รวมตัวแปรหรือฟังก์ชัน import mymath เรียกผ่าน mymath.add() ส่วน from mymath import add เรียกชื่อ add() ได้ตรง ๆ math เป็นโมดูลมาตรฐานที่มาพร้อม Python ห้องทดลองนี้มีสองไฟล์ แก้ mymath.py ก่อน แล้วรัน main.py",
    "import mymath\nprint(mymath.add(1, 2))\nfrom mymath import add\nprint(add(1, 2))\nimport math\nprint(math.sqrt(16))\n",
    "import mymath\nprint(mymath.add(1, 2))\nfrom mymath import add\nprint(add(1, 2))\nimport math\nprint(math.sqrt(16))",
    "3\n3\n4.0",
    {
      files: { "mymath.py": "def add(a, b):\n    return a - b\n" },
      fileSolutions: { "mymath.py": "def add(a, b):\n    return a + b\n" },
      hint: "แก้ mymath.py ให้ return a + b แล้วรัน main.py",
      tests: [
        { name: "เรียกจากไฟล์หลัก", expected: "3\n3\n4.0" },
        {
          name: "ส่งค่าใหม่ให้โมดูล",
          append: "print(mymath.add(10, 5))",
          expected: "3\n3\n4.0\n15",
        },
      ],
    },
  ),

  lesson(
    "common-errors",
    "exceptions",
    "34",
    "อ่าน Error ให้แก้ถูกจุด",
    "อ่านบรรทัดท้าย แยก SyntaxError, NameError, TypeError และ ValueError",
    "เริ่มอ่าน Error จากบรรทัดสุดท้ายที่บอกชนิดและสาเหตุ แล้วดูเลขบรรทัด SyntaxError คือไวยากรณ์ผิด IndentationError คือย่อหน้าผิด NameError คือใช้ชื่อที่ยังไม่มี TypeError คือชนิดข้อมูลไม่เข้ากัน และ ValueError คือค่าที่แปลงไม่ได้ ภารกิจนี้ให้แก้ชื่อที่สะกดไม่ตรงกัน",
    'name = "Somchai"\nprint(nmae)\n',
    'name = "Somchai"\nprint(name)',
    "Somchai",
    { hint: "เปลี่ยน nmae ใน print ให้เป็น name ที่ประกาศไว้" },
  ),

  lesson(
    "practice-hello",
    "practice",
    "35–36",
    "แบบฝึก 1: ทักทายจากชื่อที่รับมา",
    "รับชื่อแล้วแสดงคำว่า สวัสดี ตามด้วยชื่อ",
    "ใช้ input() รับชื่อ และ print() แสดงคำทักทาย โปรแกรมต้องทำงานกับชื่อใหม่ได้ด้วย ระบบจะลองชื่อสองชุดให้หลังรัน",
    "name = input()\n# แสดงคำทักทายและ name\n",
    'name = input()\nprint("สวัสดี", name)',
    "สวัสดี สมชาย",
    {
      inputs: "สมชาย",
      hint: 'ใช้ print("สวัสดี", name)',
      tests: [
        { name: "สมชาย", inputs: ["สมชาย"], expected: "สวัสดี สมชาย" },
        { name: "Mali", inputs: ["Mali"], expected: "สวัสดี Mali" },
      ],
    },
  ),

  lesson(
    "practice-sum",
    "practice",
    "35–36",
    "แบบฝึก 2: บวกจำนวนเต็มสองตัว",
    "รับจำนวนเต็มสองบรรทัด แล้วแสดงผลรวม",
    "input() อ่านข้อความทีละบรรทัด ต้องแปลงทั้งสองค่าเป็น int ก่อนบวก ลองทั้งตัวเลขบวก ตัวเลขลบ และศูนย์",
    "a = int(input())\nb = int(input())\n# แสดงผลบวกของ a และ b\n",
    "a = int(input())\nb = int(input())\nprint(a + b)",
    "12",
    {
      inputs: "5\n7",
      hint: "เพิ่ม print(a + b)",
      tests: [
        { name: "5 + 7", inputs: ["5", "7"], expected: "12" },
        { name: "จำนวนลบ", inputs: ["-3", "2"], expected: "-1" },
        { name: "เลขศูนย์", inputs: ["0", "0"], expected: "0" },
      ],
    },
  ),

  lesson(
    "practice-grade",
    "practice",
    "35–36",
    "แบบฝึก 3: โปรแกรมตัดเกรด",
    "รับคะแนนแล้วแสดง A ตั้งแต่ 80, B ตั้งแต่ 70 และ C สำหรับคะแนนต่ำกว่า 70",
    "ใช้ if / elif / else ให้ครอบคลุมทุกช่วงคะแนน ตรวจค่าบริเวณรอยต่อ เช่น 69, 70, 79 และ 80 เพื่อไม่ให้จัดเกรดผิด",
    "score = int(input())\n# เขียนเงื่อนไขแล้วแสดง A, B หรือ C\n",
    'score = int(input())\nif score >= 80:\n    print("A")\nelif score >= 70:\n    print("B")\nelse:\n    print("C")',
    "B",
    {
      inputs: "75",
      hint: "เริ่มตรวจ score >= 80 แล้ว elif score >= 70 ก่อน else",
      tests: [
        { name: "69", inputs: ["69"], expected: "C" },
        { name: "70", inputs: ["70"], expected: "B" },
        { name: "79", inputs: ["79"], expected: "B" },
        { name: "80", inputs: ["80"], expected: "A" },
      ],
    },
  ),

  lesson(
    "practice-table",
    "practice",
    "35–36",
    "แบบฝึก 4: สูตรคูณแม่ 2",
    "ใช้ for แสดงสูตรคูณแม่ 2 ตั้งแต่ 1 ถึง 12",
    "range(1, 13) ให้ค่า 1 ถึง 12 ใช้แต่ละค่าเป็นตัวคูณ แล้วแสดงรูปแบบ 2 x i = ผลคูณ การใช้ Loop ทำให้ไม่ต้องเขียนคำสั่ง 12 ชุด",
    "for i in range(1, 13):\n    pass  # แสดงสูตรคูณหนึ่งบรรทัด\n",
    'for i in range(1, 13):\n    print("2 x", i, "=", 2 * i)',
    Array.from({ length: 12 }, (_, i) => `2 x ${i + 1} = ${2 * (i + 1)}`).join(
      "\n",
    ),
    { hint: 'แทน pass ด้วย print("2 x", i, "=", 2 * i)' },
  ),

  lesson(
    "practice-even",
    "practice",
    "35–36",
    "แบบฝึก 5: ฟังก์ชันตรวจเลขคู่",
    "เขียน is_even(n) ให้คืน True เมื่อ n เป็นเลขคู่",
    "จำนวนเต็มเป็นเลขคู่เมื่อหารด้วย 2 แล้วเหลือเศษ 0 ใช้ % หาเศษและ == เปรียบเทียบ ฟังก์ชันต้อง return ค่า bool เพื่อให้ผู้เรียกใช้ผลต่อได้",
    "def is_even(n):\n    return False\n\nprint(is_even(4))\n",
    "def is_even(n):\n    return n % 2 == 0\nprint(is_even(4))",
    "True",
    {
      hint: "ใช้ return n % 2 == 0",
      tests: [
        { name: "ตัวอย่างเลขคู่", expected: "True" },
        {
          name: "เลขคี่",
          append: "print(is_even(7))",
          expected: "True\nFalse",
        },
        {
          name: "ศูนย์และจำนวนลบ",
          append: "print(is_even(0))\nprint(is_even(-2))",
          expected: "True\nTrue\nTrue",
        },
      ],
    },
  ),

  lesson(
    "practice-list",
    "practice",
    "35–36",
    "แบบฝึก 6: จำนวนสมาชิกและผลรวม",
    "หาจำนวนสมาชิกและผลรวมของ List [3, 5, 7]",
    "len() นับจำนวนสมาชิก sum() รวมค่าตัวเลข แสดงสองบรรทัดตามลำดับ ลองเปลี่ยนรายการเป็น [] แล้วสังเกตว่าได้จำนวนสมาชิกและผลรวมเป็น 0",
    "nums = [3, 5, 7]\n# แสดงจำนวนสมาชิกและผลรวม\n",
    "nums = [3, 5, 7]\nprint(len(nums))\nprint(sum(nums))",
    "3\n15",
    { hint: "เพิ่ม print(len(nums)) และ print(sum(nums))" },
  ),
  lesson('membership', 'next', '', 'มีข้อมูลนี้อยู่หรือไม่: in และ not in',
    'ตรวจสมาชิกใน List และตรวจชื่อ key ใน Dictionary',
    'in ตรวจว่ามีสมาชิกอยู่ในกลุ่มหรือไม่ ส่วน not in ตรวจว่าไม่มี สำหรับ Dictionary การใช้ in ตรวจ key ไม่ใช่ value เช่น "title" in book ตรวจชื่อช่องข้อมูล ไม่ได้ค้นข้อความในค่าของช่องนั้น',
    'items = ["สมุด", "ปากกา"]\nbook = {"title": "Python", "pages": 120}\n# แสดงว่ามีสมุด ไม่มีไม้บรรทัด มี key title และมี key Python หรือไม่\n',
    'items = ["สมุด", "ปากกา"]\nbook = {"title": "Python", "pages": 120}\nprint("สมุด" in items)\nprint("ไม้บรรทัด" not in items)\nprint("title" in book)\nprint("Python" in book)',
    'True\nTrue\nTrue\nFalse', {hint:'ใช้ in กับสมาชิกหรือ key และใช้ not in สำหรับสิ่งที่ไม่มี', tests:[{name:'ตรวจข้อมูลตั้งต้นไม่ได้ถูกเปลี่ยน', append:'assert items == ["สมุด", "ปากกา"]\nassert book == {"title": "Python", "pages": 120}', expected:'True\nTrue\nTrue\nFalse'}]}),
  lesson('identity', 'next', '', 'ค่าเท่ากัน กับออบเจ็กต์เดียวกัน',
    'เปรียบเทียบ == กับ is โดยใช้ List ไม่ใช้เลขที่อาจมี caching',
    '== ตรวจค่าที่เท่ากัน ส่วน is ตรวจว่าเป็นออบเจ็กต์เดียวกัน การกำหนด alias = original ไม่สร้าง List ใหม่ แต่สร้างอีกชื่อที่อ้างถึง List เดิม ส่วนรายการอีกชุดที่มีสมาชิกเหมือนกันอาจมีค่าเท่ากันแต่ไม่ใช่ออบเจ็กต์เดียวกัน เส้นเชื่อมในภาพมาจาก identity ของ Python จริง รหัส object เป็นป้ายสำหรับอธิบายในแต่ละการรัน ไม่ใช่ address หน่วยความจำ',
    'original = ["สมุด", "ปากกา"]\nalias = original\nseparate = ["สมุด", "ปากกา"]\n# แสดง original == separate, original is separate และ original is alias คนละบรรทัด\n',
    'original = ["สมุด", "ปากกา"]\nalias = original\nseparate = ["สมุด", "ปากกา"]\nprint(original == separate)\nprint(original is separate)\nprint(original is alias)',
    'True\nFalse\nTrue', {hint:'ใช้ == ถามเรื่องค่า ใช้ is ถามว่าอ้างถึงสิ่งเดียวกันหรือไม่', tests:[{name:'ตรวจ alias และรายการแยกจริง', append:'assert original is alias\nassert original is not separate\nassert original == separate\nalias.append("แฟ้ม")\nassert "แฟ้ม" in original\nassert "แฟ้ม" not in separate', expected:'True\nFalse\nTrue'}]}),
  lesson('list-copy', 'next', '', 'คัดลอก List โดยไม่แก้ต้นฉบับ',
    'สร้างรายการร่างเพื่อเพิ่มของ โดยรายการต้นฉบับต้องไม่เปลี่ยน',
    'draft = original ทำให้สองชื่ออ้างถึง List เดียวกัน การ append ผ่านชื่อหนึ่งจึงเปลี่ยนรายการที่ทั้งสองชื่อเห็น ใช้ original.copy() เพื่อสร้าง List ใหม่ที่เริ่มด้วยสมาชิกเหมือนกัน นี่คือ shallow copy: หากสมาชิกเป็น List ซ้อน สมาชิกนั้นยังอาจใช้ร่วมกันได้ ไม่ใช่สำเนาทุกระดับ',
    'original = ["สมุด", "ปากกา"]\ndraft = original\nprint(original == draft, original is draft)\ndraft.append("ยางลบ")\nprint(original)\nprint(draft)',
    'original = ["สมุด", "ปากกา"]\ndraft = original.copy()\nprint(original == draft, original is draft)\ndraft.append("ยางลบ")\nprint(original)\nprint(draft)',
    "True False\n['สมุด', 'ปากกา']\n['สมุด', 'ปากกา', 'ยางลบ']", {
      hint:'แก้เฉพาะ draft = original ให้สร้างสำเนา List ด้วย .copy()',
      tests:[{name:'ตรวจต้นฉบับและรายการร่างจริง', append:'assert original == ["สมุด", "ปากกา"]\nassert draft == ["สมุด", "ปากกา", "ยางลบ"]\nassert original is not draft\ndraft.append("แฟ้ม")\nassert "แฟ้ม" not in original', expected:"True False\n['สมุด', 'ปากกา']\n['สมุด', 'ปากกา', 'ยางลบ']"}],
    }),
];
pythonLessons.push(
  lesson('number-conversion', 'basics', '', 'เลขฐานใน Python: ค่าเดิม รูปแบบใหม่', 'แสดงค่า 26 ในหลายฐาน แล้วอ่านฐานสองกลับเป็น int',
    'เลขฐานเป็นวิธีเขียนค่า ไม่ใช่ชนิดข้อมูลใหม่ bin(), oct(), hex() รับจำนวนเต็มแล้วคืนข้อความพร้อม prefix 0b, 0o, 0x ส่วน int("11010", 2) อ่านข้อความตามฐานที่ระบุและคืน int ห้ามใช้ eval() อ่านข้อความจากผู้ใช้',
    'n = 26\n# แสดงสามฐาน แล้วแปลง "11010" กลับเป็นจำนวนเต็ม\n',
    'n = 26\nprint(bin(n))\nprint(oct(n))\nprint(hex(n))\nprint(int("11010", 2))', '0b11010\n0o32\n0x1a\n26',
    {source:'https://docs.python.org/3/library/functions.html#bin', tests:[{name:'n ยังเป็นจำนวนเต็มเดิม',append:'assert n == 26 and isinstance(n, int)',expected:'0b11010\n0o32\n0x1a\n26'}]}),
  lesson('for-else', 'control', '', 'for … else: ค้นจนจบโดยไม่มี break', 'แยกกรณีเจอสินค้าออกจากค้นครบแล้วไม่เจอ',
    'else ของ for ทำงานเมื่อวนครบโดยไม่มี break ไม่ได้ทำงานเพราะ if เป็น False ครั้งใดครั้งหนึ่ง เมื่อเจอสินค้าให้ break ทันทีเพื่อไม่แสดงไม่พบซ้ำ return หรือ exception ที่ออกจากลูปก็ข้าม else ได้เช่นกัน',
    'items = ["น้ำ", "ชา", "นม"]\ntarget = "ชา"\nfor item in items:\n    pass\n# เติม else ของ for\n',
    'items = ["น้ำ", "ชา", "นม"]\ntarget = "ชา"\nfor item in items:\n    if item == target:\n        print("พบ:", item)\n        break\nelse:\n    print("ไม่พบ")', 'พบ: ชา', {source:'https://docs.python.org/3/tutorial/controlflow.html#else-clauses-on-loops'}),
  lesson('function-arguments', 'functions', '', 'Argument, Parameter และค่าเริ่มต้น', 'รับราคาและส่วนลดผ่านฟังก์ชันเดียว',
    'Parameter คือชื่อที่ประกาศใน def ส่วน Argument คือค่าที่ส่งตอนเรียก discount=0 เป็นค่าเริ่มต้นเมื่อผู้เรียกไม่ได้ส่งค่า การเรียกแบบ keyword ระบุชื่อพารามิเตอร์ได้ return ส่งค่ากลับ ไม่ได้พิมพ์เอง หลีกเลี่ยงใช้ List ที่แก้ได้เป็นค่าเริ่มต้น เพราะจะใช้ก้อนเดิมร่วมกันระหว่าง call',
    'def net_price(price, discount):\n    return price\n\nprint(net_price(120))\nprint(net_price(120, discount=20))',
    'def net_price(price, discount=0):\n    return price - discount\n\nprint(net_price(120))\nprint(net_price(120, discount=20))', '120\n100',
    {tests:[{name:'ค่าอื่นและค่าเริ่มต้น',append:'assert net_price(200) == 200\nassert net_price(discount=30, price=200) == 170',expected:'120\n100'}]}),
  lesson('recursion', 'functions', '', 'Recursion: จุดหยุดและ Call Stack', 'รวม 1 ถึง 4 โดยลดปัญหาลงทีละหนึ่ง',
    'Recursion คือฟังก์ชันเรียกตัวเอง total(4) รอค่า total(3) ไปจนถึง total(0) ที่คืน 0 จากนั้นแต่ละ frame คืนผลรวมให้ผู้เรียก ต้องมี base case และเข้าใกล้มันทุกครั้ง ตัวอย่างรองรับจำนวนเต็มไม่ติดลบ ไม่เหมาะกับ n ใหญ่มากเพราะ Python จำกัดความลึก ไม่ใช่การประมวลผลขนาน',
    'def total(n):\n    # เติมจุดหยุด และกรณีเรียกตัวเอง\n    return 0\n\nprint(total(4))',
    'def total(n):\n    if n <= 0:\n        return 0\n    return n + total(n - 1)\n\nprint(total(4))', '10',
    {tests:[{name:'จุดหยุดและค่าอื่น',append:'assert total(0) == 0\nassert total(3) == 6',expected:'10'}]})
);
// Preserve IDs/drafts while placing prerequisites before their applications.
const placeAfter = (id, anchor) => {
  const index = pythonLessons.findIndex(l => l.id === id);
  const [item] = pythonLessons.splice(index, 1);
  pythonLessons.splice(pythonLessons.findIndex(l => l.id === anchor) + 1, 0, item);
};
placeAfter('number-conversion', 'operators');
placeAfter('for-else', 'loop-control');
placeAfter('function-arguments', 'functions');
placeAfter('recursion', 'lambda-scope');
pythonLessons.push(...pythonNextLessons);
