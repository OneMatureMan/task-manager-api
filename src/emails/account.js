const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'husseinbadawy@std.sehir.edu.tr',
        subject: `Welcome,  ${name}!`,
        text: `We are very happy to have you, ${name} on our side and have you use our FANTASTIC servisnations!`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'husseinbadawy@std.sehir.edu.tr',
        subject: `Why did you cancel, borther  ${name}..`,
        text: `We are very sad to see you, ${name}, leave
        behind our FANTASTIC servisnations! can you tell me why you left please
        you piece of **** so i can do better with my other clients? Thank you bro.`
    })
}


module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}