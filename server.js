const mongoose = require("mongoose");
const express = require("express");

const app = new express();
//memanggil library
var bodyParser = require("body-parser");
//menggunakan library pada express
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const userSchema = new mongoose.Schema({
  nama: String,
  email: String,
  password: String,
  phone: String,
});

const productSchema = new mongoose.Schema({
  nama: String,
  harga: Number,
  daerah: String,
  rating: Number,
  diskon: Number,
  terjual: Number,
  kategori: String
});

const User = mongoose.model("User", userSchema);
const Product = mongoose.model('Product', productSchema)

function main() {
  mongoose
    .connect("mongodb://127.0.0.1:27017/ProyekDigistar")
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
}

app.get("/", (req, res) => {
  return res.json({ success: true });
});

app.get('/produk/:kategori', async(req,res)=>{
  const produkKategori = await Product.find({kategori: req.params.kategori})
  return res.json(produkKategori)
})

app.post("/register", async (req, res) => {
  try {
    const RegisterUser = new User(req.body);
    RegisterUser.save().then((user) => console.log("User saved:", user));
    return res.json({ status: "register success" });
  } catch (e) {
    return res.json({ status: "register failed", error: e });
  }
});

app.post("/login", async (req, res) => {
  const { nama, email, password, phone } = req.body;
  try {
    const LoggedUser = await User.findOne({ email });
    console.log(LoggedUser);
    if (!LoggedUser) {
      return res
        .status(401)
        .json({ status: "email and password not registered" });
    }
    if (LoggedUser.password == password) {
      return res.json({ status: "login success" });
    }
    return res.status(401).json({ status: "email and password doesn't match" });
    // res.session.user = LoggedUser;
  } catch (e) {}
});

const start = async () => {
  try {
    await main();
    app.listen(3000, () => console.log("server on port 3000 started"));
  } catch (e) {
    console.error(e);
  }
};
start();
