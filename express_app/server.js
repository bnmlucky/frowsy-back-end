/*===========================
        DEPENDENCIES
=============================*/
const express = require("express");
const app = express();
const port = 3003;

/*===========================
           LISTEN
=============================*/
app.listen(port, () => {
  console.log("listening");
});
