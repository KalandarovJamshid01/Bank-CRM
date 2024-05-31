const dotenv = require('dotenv');
dotenv.config();
const app = require('./middleware/app');
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port:${process.env.PORT || 5000}`);
});
