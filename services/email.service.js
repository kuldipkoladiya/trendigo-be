import nodemailer from 'nodemailer';
import config from 'config/config';
import { logger } from 'config/logger';

export const transport = nodemailer.createTransport(config.email.smtp);

/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}
/**
 * Send an email
 * @returns {Promise}
 * @param emailParams
 */
export const sendEmail = async (emailParams) => {
  const { to, subject, text, isHtml } = emailParams;
  const msg = { from: config.email.from, to, subject, text };
  if (isHtml) {
    delete msg.text;
    msg.html = text;
  }
  await transport.sendMail(msg);
};

/**
 * Send an email
 * @param {String} from
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendAdminEmail = async (from, to, subject, text) => {
  const msg = { from: from || config.email.from, to, subject, text };
  await transport.sendMail(msg);
};
/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
export const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  // const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
  const text = `Dear user,
  To reset your password, Copy this Code: ${token}
  If you did not request any password resets, then ignore this email.`;
  await sendEmail({ to, subject, text });
};

/**
 * Send Verification email
 * @param {Object} user
 * @param {string} token
 * @returns {Promise}
 */
export const sendEmailVerificationEmail = async (user, token, role) => {
  const { email: to, name } = user;
  const subject = 'Welcome to the Swaray Family!';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `${config.front.url}/v1/${role}/auth/verify-email?token=${token}`;
  const text = `
<html lang="en">
<head>
<style>
.btn {
  display: inline-block;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  color: #ffffff !important;
  background-color: #007bff;
  border: 1px solid #007bff;
  box-shadow: none;
  text-decoration: none;
}
.text-center {
text-align: center
}
</style>
</head>
<body>
<div>
<div>Dear ${name},</div>
<br>
  <div>We’re super excited that you’ve decided to join Swaray for Video Chat That’s Built to Party!</div><br>
  <div>You’re just one step away from getting access to fun, exciting, party and drinking games and Swaray’s legendary shared music experience.</div><br>
  <div>All you have to do is click the link below to confirm it’s you and you’re in!</div><br>
  <div><a   target="_blank" href="${resetPasswordUrl}" id="verifyButton" class="btn btn-primary" >Click here to Verify</a></div><br>
  <div>If for some reason you clicked the Sign-Up button in error or you didn’t Sign-Up with this email address</div>
  <div>in the first place, no need to worry.  You can completely ignore this email and we’ll delete the account for you.</div><br>
  <div>If you still have questions or concerns just shoot us a note at info@swarayallday.com and we’ll be sure to help you out.</div><br>
  <div>Thanks!</div><br/><br>
  <img src="${config.front.url}/images/logo.jpg"><br><br>
  <div class="text-center">Swaray LLC</div>
  <div class="text-center">627 Promontory Drive East</div>
  <div class="text-center">Newport Beach, CA 92660</div><br>
  <a class="text-center" target="_blank" href="https://www.google.com" >unsubscribe from this list</a><br><br>
  </div>
  </body>
  </html>
`;
  await sendEmail({ to, subject, text, isHtml: true });
};

/**
 * @param {Object} feedBack
 * @returns {Promise<void>}
 */
export const sendFeedBackEmail = async (feedBack) => {
  const { comment, user } = feedBack;
  const { name } = user;
  const subject = `Feedback received from ${name}`;
  const text = `Below is the feedback received from ${name} \n FeedBack: ${comment}`;
  await sendAdminEmail(config.email.from, config.email.from, subject, text);
};

/**
 * @returns {Promise<void>}
 * @param reporter
 * @param reportedUser
 * @param party
 * @param comment
 */
export const sendReportUserEmail = async (reporter, reportedUser, party, comment) => {
  const { name: reporterName, _id: reportedId } = reporter;
  const { name, _id: reportedUserId } = reportedUser;
  const subject = `Regarding Report of user ${name}`;
  const text = `${name}, ${reportedUserId} is blocked by ${reporterName}, ${reportedId} \n  The reason is : ${comment} \n partyId: ${party._id}`;
  await sendAdminEmail(config.email.from, config.email.from, subject, text);
};
export const sendCongratulationEmail = async (user) => {
  const { email: to, name } = user;
  const subject = 'Congratulation email!';
  const currentDate = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  const formattedDate = currentDate.toLocaleDateString('en-US', options);
  const text = `
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Congratulation Email</title>
    <style type="text/css">
        body {
            font-family: 'Poppins', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f0f4f9;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            box-sizing: border-box;
        }
        #main {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 90%;
        }
        #container {
            width: 70%;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
            margin: auto;
        }
        #text-1{
        color: black;
        }
         #text-4{
        color: black;
         font-weight: 600;
      }
        #mar-top{
        margin-top: 20px;
        }
        #perrent{
         justify-content: center;
        }
      #logo-div{
       display: flex;
       position: relative;
      
      }
        #logo-img {
            width: 150px;
            height: auto;
           
            
        }
        #demo{
        width: 100%;
        }
        #date {
            font-size: 12px;
            color: #838383;
           
            position: absolute;
            margin-left: 500px;
        }
        #text-2{
        color: black;
        text-align: center; 
        }
        #content {
            margin-top: 20px;
            font-size: 14px;
            line-height: 1.6;
        }
        #bold-text {
           
            font-weight: 600;
            margin-top: 10px;
        }
       #socialmedia-div{
            width: 35%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-left: 35%;
            margin-top: 30px;
            margin-bottom: 10px;
        }
        #socialmedia-1{
            width:29px ;
            height: 20px;
            margin-right: 30px;
            
        }
        #socialmedia-2{
            width:10px ;
            height: 20px;
            margin-right: 30px;
        }
        #socialmedia-3{
            width: 20px;
            height: 20px;
            margin-right: 30px;
        }
        #socialmedia-4{
            width:25px ;
            height:20px ;
        }
        #unsubscribe {
            text-align: center;
            margin-top: 40px;
            font-size: 12px;
            color: black;
        }
        #border{
            margin-top: 30px;
            margin-bottom: 5px;
            width: 100%;
            height:0.1px;
            background: black;
        }
        @media screen and (max-width: 768px) {
        #logo-img{
           width: 100px;
           height: 25px;
          
        }
         #logo-div{
      display: flex;
       position: relative;
      
      }
        #text-1{
            font-size: 8px; 
            font-weight: 400; 
            color: black;
        }
        #text-2{
            font-size: 10px;
            font-weight: 400;
            margin-top: 15px;
        }
        #text-3{
            font-size: 7px;
            font-weight: 400;
            text-align: center;
            width: 75%;
        }
        #otp-text{
            font-size: 10px;
            font-weight: 600;
            margin-top: 15px;
        }
        #socialmedia-1{
            width:25px ;
            height: 16px;
        }
        #socialmedia-2{
            width:8px ;
            height: 16px;
        }
        #socialmedia-3{
            width: 16px;
            height: 16px;
        }
        #socialmedia-4{
            width:21px ;
            height:16px ;
        }
        #content{
            margin-top: 20px;
        }
       
            #main {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 90%;
            padding: 0px;
        }
        #container {
            width: 90%;
            max-width: 600px;
            background-color: #ffffff;
            border-radius: 10px;
           box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
            margin: auto;
            padding: 0px;
        }
        #logo-div {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
        }
        
        #date {
            font-size: 12px;
            margin-left: 0%;
            width: 150px;
            
        }
        }
        /*xl*/
        @media screen and (max-width: 1536px) {
        #date {
            font-size: 12px;
            color: #838383;
            position: absolute;
           text-align: right;
           margin-left: 360px;
        }
 }
        @media screen and (max-width: 1280px) {
            #logo-img{
           width: 130px;
           height: 35px;
        }
        #date {
            font-size: 10px;
            color: #838383;
            position: absolute;
           text-align: right;
           margin-left: 280px;
        }
        #container {
            width: 80%;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
            margin: auto;
        }
       
        #socialmedia-div{
            width: 35%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-left: 35%;
            margin-top: 30px;
            margin-bottom: 10px;
        }
       
       
        #socialmedia-1{
            width:27px ;
            height: 18px;
        }
        #socialmedia-2{
            width:8px ;
            height: 18px;
        }
        #socialmedia-3{
            width: 18px;
            height: 18px;
        }
        #socialmedia-4{
            width:23px ;
            height:18px ;
        }
        #content{
            margin-top: 25px;
        }
            
        } 
        
        @media screen and (max-width: 1024px) {
            #logo-img{
           width: 100px;
           height: 25px;
        }
        #date {
            font-size: 8px;
            color: #838383;
            position: absolute;
           text-align: right;
           margin-left: -100px;
          
        }
        #main {
            
            align-items: center;
            width: 100%;
        }
        #text-1{
        color: black;
        font-size: 10px;
        }
            #container {
               
                width: 100%;
            }
            #content {
                font-size: 10px;
            }
           #socialmedia-div{
            width: 35%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-left: 30%;
            margin-top: 25px;
            margin-bottom: 10px;
        }
        
        #socialmedia-1{
            width:25px ;
            height: 16px;
        }
        #socialmedia-2{
            width:8px ;
            height: 16px;
        }
        #socialmedia-3{
            width: 16px;
            height: 16px;
        }
        #socialmedia-4{
            width:21px ;
            height:16px ;
        }
        
       
        } 
    </style>
</head>
<body>
    <div id="main">
        <div id="container">
        <div id="perrent">
        <div id="logo-div">
            
                <img id="logo-img" src="https://happymilan-user-images.s3.ap-south-1.amazonaws.com/users/65e991ad15835e46f0861b8b/65eff3406145b642700c32ba/logo.jpg" alt="Logo"/>
               <p id="date">${formattedDate}</p>
               </div>
            <div id="content">
                <p id="text-1">Hi ${name},</p>
                <p id="text-1">Welcome to HappyMilan! We're excited to have you with us. Congrats on registering your account!</p>
                <p id="text-1">To get started, log in to your account using the following credentials:</p>
                <p id="text-4">Email: ${to} <br> Password: ******</p>
                <div id="mar-top">
                    <img id="demo" src="https://happymilan-user-images.s3.ap-south-1.amazonaws.com/name/Img/672221cd16359520d1b37284/search.jpg" alt="Feature Image"/>
                </div>  
                <div>
                    <img id="demo" src="https://happymilan-user-images.s3.ap-south-1.amazonaws.com/name/Img/672221fb16359520d1b372ae/secure.jpg" alt="Feature Image"/>
                </div>  
                <div>
                    <img id="demo" src="https://happymilan-user-images.s3.ap-south-1.amazonaws.com/name/Img/6722215c16359520d1b3727c/chat.jpg" alt="Feature Image"/>
                </div> 
                <div>
                    <img id="demo" src="https://happymilan-user-images.s3.ap-south-1.amazonaws.com/name/Img/6722219c16359520d1b37280/plan.jpg" alt="Feature Image"/>
                </div> 
                <p id="text-2">Welcome to HappyMilan, your hub for finding a life partner, exploring dating opportunities, and making new friends. Join us to connect with a vibrant community and discover meaningful relationships.</p>
            </div>
            <div id="content">
        <div id="div-center">
        <div id="socialmedia-div" >
           <div>
           <img id="socialmedia-1" src="https://happymilan-user-images.s3.ap-south-1.amazonaws.com/name/yticone/671777d63e6cb9ad5f202b0d/yt.jpg" alt="youtube"/>
           </div>
           <div>
            <img id="socialmedia-2" src="https://happymilan-user-images.s3.ap-south-1.amazonaws.com/name/fbicone/671776dc3e6cb9ad5f202b01/fb.jpg" alt="fb"/>
           </div>
           <div>
            <img id="socialmedia-3" src="https://happymilan-user-images.s3.ap-south-1.amazonaws.com/name/instagramicone/671777513e6cb9ad5f202b05/insta.jpg" alt="insta"/>
           </div>
           <div>
            <img id="socialmedia-4" src="https://happymilan-user-images.s3.ap-south-1.amazonaws.com/name/twittericone/6717779d3e6cb9ad5f202b09/Twitter.jpg" alt="twitter"/>
           </div>
        </div>
     
        </div>
      <hr id="border"/>
    </div>
            <p id="unsubscribe">If you prefer not to receive these emails in the future, please <a href="#" style="color: #0F52BA; text-decoration: none;">unsubscribe</a> here.</p>
        </div>
        </div>
        
    </div>
</body>
</html>`;

  await sendEmail({ to, subject, text, isHtml: true })
    .then(() => logger.info('email sent successfully'))
    .catch((error) => logger.warn(`Unable to send mail ${error}`));
};
/**
 * Send Verification email
 * @param {Object} user
 * @param otp
 * @returns {Promise}
 */
export const sendOtpVerificationEmail = async (user, otp) => {
  const { email: to } = user;
  const subject = 'Otp verification email!';
  const text = `Dear user,
  Your email verification Code, Copy this Code: ${otp}
  If you did not request any password resets, then ignore this email.`;
  await sendEmail({ to, subject, text, isHtml: false })
    .then(() => logger.info('email sent successfully'))
    .catch((error) => logger.warn(`Unable to send mail ${error}`));
};
