import mongoose from"mongoose";
import {DB_URL} from'../config.js';
mongoose
  .connect(DB_URL?.toString() || "")
  .then(() => {
    // console.log("DB Connected mongoose ✅");
    console.log( "\x1b[32m Connected mongoose ✅ ");
  })
  .catch((err) => console.error("DB Connection Error ❌", err));

  export default mongoose;
