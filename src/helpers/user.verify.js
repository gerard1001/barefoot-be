import dotenv from 'dotenv';

dotenv.config();
// eslint-disable-next-line import/prefer-default-export
export const verifyEmail = (emailData) => {
  const SendEmail = `<!doctype html>
    <html lang="en-US">
    <head>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <title>Email Verification</title>
        <meta name="description" content="Reset Password Email">
        <style type="text/css">
            a:hover {
                text-decoration: underline !important;
            }
        </style>
    </head>
    <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #F2F3F8;" leftmargin="0">
        <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#F2F3F8" style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700%7COpen+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
            <tr>
                <td>
                    <table style="background-color: #F2F3F8; max-width:670px;  margin:0 auto;" width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="height:80px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td style="text-align:center;">
                                <a href="#" title="logo" target="_blank">
                                    <img width="100" src="https://quanam.com/wp-content/uploads/2019/06/cabal_gde.jpg" title="logo" alt="logo">
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td style="height:20px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td>
                                <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="padding:0 35px;">
                                            <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Account created require verification.</h1>
                                            <span style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #CECECE; width:100px;"></span>
                                            <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                Thank you for registering on Barefoot Nomad. Click the link below to verify and activate your account.
                                            </p>
                                            <a href="${process.env.BASE_URL}/api/v1/users/verify-email/${emailData}" style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Verify Email</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                </table>
                            </td>
                            <tr>
                                <td style="height:20px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td style="height:80px;">&nbsp;</td>
                            </tr>
                    </table>
                </td>
                </tr>
        </table>
    </body>
    </html>`;
  return SendEmail;
};
