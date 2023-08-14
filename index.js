const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dbConfig = require("./Config/dbConfig");

const auth = require("./Middlewares/auth.js");
const errors = require("./Middlewares/error.js");
const unless = require("express-unless");


mongoose.Promise = global.Promise;
mongoose
  .connect(dbConfig.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () => {
      console.log("Database connected");
    },
    (error) => {
      console.log("Database can't be connected: " + error);
    }
  );


auth.authenticateToken.unless = unless;



app.use(
  auth.authenticateToken.unless({
    path: [
      { url: "/users/login", methods: ["POST"] },
      { url: "/users/register", methods: ["POST"] },
      // { url: "/coupons/create-coupon", methods: ["POST"] },
      // { url: /^\/coupons\/\w+$/, methods: ["PUT", "GET", "DELETE"] },
    ],
  })
);

app.use(express.json());


app.use("/users", require("./Routes/userRoutes"));
app.use("/coupons", require("./Routes/couponRoutes"));
app.use('/uploads', express.static('./uploads'));

app.use(errors.errorHandler);

app.listen(process.env.port || 3000, function () {
  console.log("Server started successfully!");
});
