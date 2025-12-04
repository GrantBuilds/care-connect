// index.js
const app = require('./src/app'); // <- must point to the correct path

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
