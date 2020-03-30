const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();
const socketIO = require('socket.io');

const http = require('http');
const server = http.Server(app);

const io = socketIO(server);

// const {getHomePage} = require('./routes/index');
// const {addPlayerPage, addPlayer, deletePlayer, editPlayer, editPlayerPage} = require('./routes/player');
const port = process.env.PORT || 8080; 

// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
//mysql://ba9565c7d6951a:5230e113@us-cdbr-iron-east-02.cleardb.net/heroku_f254459ae2fc71b?reconnect=true 
const db_config = {
    host: 'localhost',
    user: 'root', // your database username
    password: 'root', // your database password
    database: 'eComm',  // FYI export the tshirtshop.sql to this database
    multipleStatements: true
}

var connection;

function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000);                                               
    }    
    /*
        We introduce a delay before attempting to reconnect,
        to avoid a hot loop, and to allow our node script to
        process asynchronous requests in the meantime.
        If you're also serving http, display a 503 error.
    */                                                                            
    global.db = connection;
    console.log(`Connected to database ${db_config.host} >> ${db_config.database}`);    
  });                                                                                   
           
 
  

  /*
    Connection to the MySQL server is usually
    lost due to either server restart, or a
    connnection idle timeout (the wait_timeout
    server variable configures this)
  */
  connection.on('error', function(err) {
    console.log('db error', err);
    handleDisconnect();    
  });
}


 
io.on('connection', (socket) => {
  console.log('user connected');
  socket.on('new-message', (message) => {
    console.log("Message ",message)

    productDetail = JSON.parse(message)

    var sizeIds = productDetail.map((item)=>{
      return item.sizeId
    })

    var productIds = productDetail.map((item)=>{
      return item.productId
    })

    var colorIds = productDetail.map((item)=>{
      return item.colorId
    })

    console.log(sizeIds)

var updateQuery = `update product_attribute PA 
SET PA.product_quantity=PA.product_quantity-1 
where product_id in ( ${productIds})  and (attribute_value_id in (${sizeIds}) or attribute_value_id in (${colorIds}))`;

console.log(updateQuery)

db.query(updateQuery, (err, results) => {
  if (err != null){
    io.sockets.emit('new-message',"Error");
  }

  var selectQuery = `select distinct(PA.product_id),PA.product_quantity from product_attribute PA
  where product_id in ( ${productIds})   and (attribute_value_id in (${sizeIds}) or attribute_value_id in (${colorIds}))`

  db.query(selectQuery, (err, results) => {
    if (err != null){
      io.sockets.emit('new-message',"Error");
    }

console.log("Result ",JSON.stringify(results))

io.sockets.emit('new-message',JSON.stringify(results));
  })
})
})
});



handleDisconnect();



// configure middleware
app.set('port', process.env.port || port); // set express to use this port
// app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
// app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload

app.use(function (request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// import routes
const departmentRoutes = require('./routes/department');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const shippingRoutes = require('./routes/shipping');
const customerRoutes = require('./routes/customer');
const orderRoutes = require('./routes/order');

app.get('/', function (request, response, next) {
    db.query("SELECT * FROM category", function (error, rows) {
        return response.json(rows);
    });
});

// set routes to api
app.use('/api/department', departmentRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/product', productRoutes);
app.use('/api/shipping', shippingRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/order', orderRoutes);

// set the app to listen on the port
// app.listen(port, () => {
//     console.log(`Server running on port: ${port}`);
// });

// set the app to listen on the port
server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});