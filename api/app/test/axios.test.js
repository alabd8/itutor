const axios = require('axios');

function cb(response){
    console.log("Response: ", response.data);
}

(async () => {
    await axios({
        method: 'post',
        url: 'http://localhost:8080/menu',
        withCredentials: true,
        data: {
            firstName: 'alisher',
            lastName: 'abdullaev',
            role: 'student',
            email: 'alisshersulimov1@gmail.com',
            password: 'helloworld',
            phone: '+998909999999'
        },
        headers: { 
          "Content-Type": "application/x-www-form-urlencoded",
          "Cache-Control": "no-cache",
          "Postman-Token": "42e6c291-9a09-c29f-f28f-11872e2490a5"
        }
    }).then(cb);
})();