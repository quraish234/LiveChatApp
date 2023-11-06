
const express = require('express')

const app = express()

const http = require('http').createServer(app)
const PORT = process.env.PORT || 3000

http.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`)
})

app.use(express.static(__dirname +'/public'))
app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html')
})

//Socket

const io = require('socket.io')(http);

io.on('connection', (socket) => {
    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg);
    });

    socket.on('saveMessage', (data) => {
        // Save the message to the MySQL database
        insertMessage(data.user, data.message);
    });
});
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: '192.168.19.160',
  user: 'usher',
  password: 'Um@ir65048420',
  database: 'rasa',
});


db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// Create a function to insert a new message into the database
function insertMessage(user, message) {
  const sql = 'INSERT INTO chat_messages (user, message) VALUES (?, ?)';
  const values = [user, message];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting message:', err);
    } else {
      console.log('Message inserted into the database');
    }
  });
}