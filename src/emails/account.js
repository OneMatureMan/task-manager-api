const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = async (email, name) => {
    try {
        await sgMail.send({
            to: email,
            from: 'husseinbadawy@std.sehir.edu.tr',
            subject: `Welcome,  ${name}!`,
            text: `We are very happy to have you, ${name}, using our application!`
        })
    } catch(e) {
        throw new Error('API unauthorized')
    }
   
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'husseinbadawy@std.sehir.edu.tr',
        subject: `Why did you cancel, borther  ${name}..`,
        text: `We are very sad to see you leave ${name}, we really hope to see you again soon.`
    })
}


module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}