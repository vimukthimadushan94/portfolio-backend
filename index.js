require("dotenv").config();
const express = require('express')
const bodyParser = require("body-parser");
const sgMail = require('@sendgrid/mail');
const fs = require('fs');
const ejs = require('ejs');
const app = express()
const port = process.env.PORT
app.use(bodyParser.json());

app.post('/api/contact-us', (req, res) => {
  const data = req.body

  if(!data.from_email){
    res.status(404).json({message:"Email field is required!"})
  }

  if(!data.message){
    res.status(404).json({message:"Message field is required!"})
  }

  try{
    
    sgMail.setApiKey(process.env.MAIL_SECRET_KEY);

    const emailTemplate = fs.readFileSync('email/template.ejs','utf-8')
    const renderedHtml = ejs.render(emailTemplate, data);

    const msg = {
        to: process.env.TO_MAIL,
        from: process.env.FROM_MAIL,
        subject: 'Email From Portfolio Website',
        html: renderedHtml,
    };

    sgMail.send(msg)
        .then(() => console.log('Email sent'))
        .catch((error) => console.error(error));

    res.send({message:"Your request has sent.Thank You!"})
    
  }catch(error){
    res.status(500).json({message:error})
  }
  

})

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})