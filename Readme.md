.env file ka kaam??

-> jitni bhi sensitive information(api key, mongoUri, api secret key, email pass)
.env file kabhi bhi github par push nahi krte

//Model -> Schema ->
->username, email, mobile number
->type
->required
->

{
    "name":"name",
    "email":"email@email.com",
    "password":"*******",
    "contact":"9876543210",
}

new keyword ka matlab hai ki naya object create hoga

nodemailer - external library

install nodemailer

npm i nodemailer


app.post('\post',async(req,res)=>{
console.log(gk)
})

middleware 

jab bhi ham koi request bheje ge or request ka response milne se pehle ham koi specific task krwana chahte hai then kindly use middleware.

NOTE: Jab tak task ho nhi jayega tab tak ham baki bacha kaam ya response nhi paa skte.

app.post('\post',logger,(req,res)=>{   == logger is middleware there he ask for method and url which we want for now. we cant go further until the middleware work be done

console.log(gk)
})


CLOUD_NAME dwutyl2zg 
API_KEY 941721885931794
API-SECRET gKcdlugKwoNn4iPUgJVApD1t7Jo

git commands for update = git add .
git commit -m "any type of message"
git push origin main or git push --set-upstream origin main


git commands for new add 
git init
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
Then follow the normal add, commit, push steps above.
