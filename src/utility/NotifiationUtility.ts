//Email

//Notifications

// OTP
export const GenerateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  let expiry = new Date();
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000);

  return { otp, expiry };
};

export const onRequestOTP = async (otp: number, toPhoneNumber: string) => {
  const accountSid = 'AC0f322823f2cb23a2399fa79354f6842d';
  const authToken = 'd23f279093cfce9fbf5936c1fff744c3';
  const client = require('twilio')(accountSid, authToken);

  const response = await client.messages.create({
    body: `Your OTP is ${otp}`,
    from: '+16185684554',
    to: `+91${toPhoneNumber}`,
  });

  return response;
};

//Payment notifiation or emails
