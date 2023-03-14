"use strict";

// https://nodemailer.com/about/
const nodemailer = require("nodemailer");
const renderTemplate = require('../../utils/renderEjsTemplate')


const adminMail = 'Kostas Galanis'



const emailServerConf = {
    host: "smtp.gmail.com",
    service:'Gmail',
    port: 587,
    secure: true, // true for 465, false for other ports
    // ignoreTLS:true,
    auth: {
        user: 'indubuild.a', // generated ethereal user
        pass: 'tafkuqstdbtsaiwd', // generated ethereal password
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      }
}


class eMailer {

    constructor(config) {
        this.config = config
        this.transporter = nodemailer.createTransport(this.config);
        this.transporter.verify(function (error, success) {
            if (error) {
              console.log('Mailer verification',error);
            } else {
              console.log("Mail Server is ready to take our messages");
            }
          });
    }

    /**
 * @name sendMail
 * @param {String} to ema il address to be send 
 * @param {String | Array<String> } cc email address to be send as cc
 * @param {string} subject emai Subject
 * @param {String} text email Plain text message
 * @param {HTML} html email HTML message
 * @returns 
 */
    async sendMail({from, to, subject, text, html, attachemnts}) {

        from = from || adminMail;
        let mail = {
            from, to, subject, text, html, attachemnts
        }

        try {
            let emailInfo = await this.transporter.sendMail({ ...mail })
            return emailInfo;
        } catch (error) {
            throw new Error(error)
        }

    }

    /**
     * 
     * @param {Object} client Object mongoose schema
     * @param {String} subject Mail subject
     * @param {String} template path to template to bee rendered
     */
    async testMail({ to, subject, template,data}) {
        console.log(`Test mail has been send to: ${to}`)
        let body = await renderTemplate(template,{user:data})
        this.sendMail({
            from:adminMail, 
            to: to, 
            text:'', 
            subject,
            html:body})
        return;
    }
    /**
     * 
     * @param {Object} client Object mongoose schema
     * @param {String} subject Mail subject
     * @param {String} text Mail body text
     */
    async clientInformViaMail(client, subject, text) {
        let body = text
        // logger.info(`Email sended to ${client.fullname}[${client.contact.email}]`)
        this.sendMail(adminMail, client.contact.email, '', subject, body)
        return;
    }

    /**
     * 
     * @param {Object} client Object mongoose schema
     * @param {String} subject Mail subject
     * @param {String} text Mail body text
     */
    async resetPasswordInform(client, subject, text) {

        this.sendMail(adminMail, client.contact.email, '', subject, body)
        return;
    }
}

module.exports = new eMailer(emailServerConf)


 

