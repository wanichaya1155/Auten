
const mysql = require('mysql');
const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors());

router.use(express.static('public'));
router.use(express.json());
router.use(express.urlencoded({extended : true}));
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const host = process.env.DB_HOST;
const user = process.env.USER;
const passWord = process.env.PASSWORD;
const dataBase = process.env.DB_NAME;



  


//app.listen(3000, () => console.log("Start service on port 3000"));
router.use(express.json())
//middleware ใน Express ที่ใช้สำหรับการแปลงข้อมูล
router.use(express.urlencoded({ extended: true }))
//nosniff' ซึ่งมีไว้เพื่อป้องกันการทำงานของการทำอ่าน (sniffing) 
// Cross-Site Scripting (XSS) คืออะไร?
//Cross-Site Scripting (XSS) เป็นช่องโหว่ด้านความปลอดภัยบนเว็บแอปพลิเคชันที่อนุญาตให้ผู้โจมตีแทรกโค้ด JavaScript ที่เป็นอันตรายลงในหน้าเว็บที่ผู้ใช้รายอื่นดูไ
router.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
  });


const con = mysql.createConnection({
    host: host,
    user: user, 
    password: passWord, 
    database: dataBase,
  });
  
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

router.post("/register", async (req, res) => {
    const {custname = null, username, password, sex = null, address = null, tel = null ,email} = req.body;
    
    // const {username, password} = req.body;
    // const { sex = null, address = null, tel = null } = req.body; // กำหนดค่า default ให้กับฟิลด์อื่น ๆ
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    con.query("INSERT INTO customer (CustName, UserName ,Password, Sex, Address, Tel, Email) VALUES (?, ?, ?, ?, ?, ?, ?);", [custname, username, hashedPassword, sex, address, tel ,email],(error,result,fields) => {
            if(error){
                return res.status(401).json({message : "Unable to complete registration"});
            }
            console.log("hashedPassword"+hashedPassword);
            return res.status(201).json({ message: "Register successfully" });
        }
    )

})


router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  con.query("SELECT CustNo, UserName, Password FROM customer WHERE UserName = ?", [username], async function (err, result, fields) {
      if (err) {
          return res.status(401).json({ message: "Can't connect to database" });
      }
      // ตรวจสอบว่ามีผู้ใช้งานที่ตรงกับชื่อผู้ใช้ที่ใส่เข้ามาหรือไม่
      if (!result[0]) {
        return res.status(400).json({ message: "Username or Password incorrect" });
    }
      // เช็ครหัสผ่านว่าตรงกับที่เก็บในฐานข้อมูลหรือไม่
      const passwordMatch = await bcrypt.compare(password, result[0].Password);
      //const passwordMatch = password === result[0].Password;
      console.log("result"+result[0].Password);
      if (!passwordMatch) {
          return res.status(401).json({ message: "Username or Password incorrect2",test:result[0].Password ,pp:passwordMatch});
      } else {
          const token = jwt.sign({ CustNo: result[0].CustNo }, secretKey, { expiresIn: '3h' });
          return res.status(200).json({ token,message:"Login successfully" });
      }
  });
});


router.get('/protected', (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
  
    try {
      const decoded = jwt.verify(token, secretKey)
  
      res.json({
        message: 'Hello! You are authorized',
        decoded,
      })
    } catch (error) {
      res.status(401).json({
        message: 'Unauthorized',
        error: error.message,
      })
    }
})

router.get('/products', (req, res) => {
  // ดึงข้อมูลจากฐานข้อมูล
  let query = "SELECT * FROM product ORDER BY ProductNo";
  con.query(query, (err, result) => {
    if (err) throw err;
    res.json(result); // ส่งข้อมูลเป็น JSON กลับไปยัง client
  });
});
router.get('/product_item', (req, res) => {
  const { productNo } = req.query;
  let query = "SELECT * FROM product WHERE ProductNo = ? ORDER BY ProductNo";
  con.query(query, [productNo], (err, result) => {
    if (err) throw err;
    res.json(result); // ส่งข้อมูลเป็น JSON กลับไปยัง client
  });
});

const insertToCartRouter = require('./insert_to_cart');
router.use('/insert_to_cart', insertToCartRouter);


// สร้าง API สำหรับการค้นหาสินค้า
router.post('/search', (req, res) => {
  let search_input = req.body.search;
  let query = `SELECT * FROM product WHERE LOWER(ProductNo) LIKE LOWER('%${search_input}%') OR LOWER(ProductName) LIKE LOWER('%${search_input}%') OR LOWER(Category) LIKE LOWER('%${search_input}%') ORDER BY ProductNo`;
  con.query(query, (err, result) => {
    if (err) throw err;
    res.json(result); // ส่งข้อมูลเป็น JSON กลับไปยัง client
  });
});
const fs = require('fs');

router.get('/navbar', (req, res) => {
  fs.readFile('public/navbar.html', 'utf8', (err, data) => {
    if (err) throw err;
    res.send(data);
  });
});

router.get('/shoppingcart', (req,res) => {
  const token = req.headers.authorization.split(' ')[1];
  // ดึงค่า CustNo จาก JWT
  const decodedToken = jwt.verify(token, secretKey);
  const custNo = decodedToken.CustNo;
  let query = "SELECT shoppingcart.CartId, shoppingcart.ProductNo, shoppingcart.ProductQty, product.PricePerUnit ,product.ProductName FROM shoppingcart INNER JOIN product ON product.ProductNo = shoppingcart.ProductNo WHERE shoppingcart.CustNo = ? ORDER BY shoppingcart.ProductNo; ";
  con.query(query, [custNo], (err, result) => {
    if (err) throw err;
    res.json(result); // ส่งข้อมูลเป็น JSON กลับไปยัง client
  });
})
module.exports = router;