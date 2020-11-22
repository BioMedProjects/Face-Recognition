const app = require('./app');

const port = process.env.PORT || 3000

//start express server
app.listen(port, () => {
    console.log('Server started on port ' + port)
})