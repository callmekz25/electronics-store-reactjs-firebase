import emailjs from "emailjs-com";
// Hàm gửi mail cho user khi order sản phẩm
const SendOrderConfirmation = async (product, user, totalPrice) => {
  const generateProductDetails = () => {
    return `
                <div style="text-align: center; padding: 10px;">
    <div style="max-width: 600px; margin: 0 auto;">
        <p style="font-size: 30px; font-weight: bold;">Exclusive</p>
        <div style="font-size: 15px; font-weight: medium;">
            <p style="font-size: 25px; font-weight: medium; padding: 5px 0;">We're on it</p>
            <p>Hey ${user.name},</p>
            <p style="padding-top: 4px;">
                This is just a quick email to say we've received your order.
            </p>
            <p style="padding-top: 4px;">
                Once everything is confirmed and ready to ship, we'll send another email with the tracking details and any other information about your package.
            </p>
            <p style="padding-top: 4px;">
                Your shipping ETA applies from the time you receive that email which should be about one working day from now. We'll follow up as quickly as possible!
            </p>
            <div style="border-top: 2px solid #e5e5e5; margin: 5px 0;"></div>
            <p style="padding-top: 4px; font-size: 20px; text-align: start;">Order summary</p>
            ${product.map((product) => {
              return `<div style="padding: 10px; border-bottom: 2px solid #e5e5e5">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr style="border-bottom: 2px solid #e5e5e5;">
                        <td style="width: 80px;">
                            <img
                                style="width: 80px; height: 80px; object-fit: contain;"
                                src="${product.img}"
                                alt="Product Image"
                            />
                        </td>
                        <td style="text-align: left; width: 270px; overflow: hidden; text-overflow: ellipsis;">
                            <p style="font-size: 16px; margin-left: 10px; ">${
                              product.name
                            }</p>
                        </td>
                        <td style="text-align: left;">
                            <p style="font-size: 16px; ">${
                              product.color
                                ? product.color.charAt(0).toUpperCase() +
                                  product.color.slice(1)
                                : ""
                            }</p> 
                        </td>
                        <td style="text-align: left;">
                         <p style="margin: 0;">x ${product.quantity}</p>
                        </td>
                        <td style="text-align: right;">
                            <p style="font-size: 18px; font-weight: normal; margin: 0;">$${
                              Math.round(
                                product.quantity * product.price * 100
                              ) / 100
                            }</p>
                        </td>
                    </tr>
                </table>
            </div>`;
            })}
             <div style="padding: 10px; text-align: right;">
                        <p style="font-size: 18px;"><strong>Total Amount:</strong> $${
                          Math.round(totalPrice * 100) / 100
                        }</p>
                    </div>
            <div style="padding-top: 4px; padding-bottom: 14px; border-top: 2px solid #e5e5e5; border-bottom: 2px solid #e5e5e5;">
                <p style="font-size: 20px; padding: 4px 0; text-align: start;">Customer information</p>
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td style="padding: 5px 0; text-align: start;"><strong>Name:</strong></td>
                        <td style="padding: 5px 0; text-align: start;">${
                          user.name
                        }</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 0; text-align: start;"><strong>Phone number:</strong></td>
                        <td style="padding: 5px 0; text-align: start;">${
                          user.phone
                        }</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 0; text-align: start;"><strong>Address:</strong></td>
                        <td style="padding: 5px 0; text-align: start;">${
                          user.address
                        }</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 0; text-align: start;"><strong>Email:</strong></td>
                        <td style="padding: 5px 0; text-align: start;">${
                          user.email
                        }</td>
                    </tr>
                </table>
            </div>
            <div style="text-align: center; padding: 5px;">
                <p style="font-size: 20px;">Thank you for your order!</p>
            </div>
        </div>
    </div>
</div>
                        `;
  };

  const templateParams = {
    user_name: user.name,
    user_email: user.email,
    user_address: user.address,
    user_phone: user.phone,
    date: new Date().toLocaleDateString(),
    product_details: generateProductDetails(),
  };

  await emailjs
    .send(
      process.env.REACT_APP_SERVICE_ID,
      process.env.REACT_APP_TEMPLATE_ID,
      templateParams,
      process.env.REACT_APP_USER_ID
    )
    .then(
      (result) => {
        console.log(result.text);
      },
      (error) => {
        console.log(error.text);
      }
    );
};
// Hàm gửi mail khi user còn hỗ trợ
const sendMailSupport = async (name, phone, email, message) => {
  const templateParams = {
    user_name: name,
    user_email: email,
    user_phone: phone,
    user_message: message,
  };

  await emailjs
    .send(
      process.env.REACT_APP_SERVICE_ID,
      process.env.REACT_APP_TEMPLATE_CONTACT_ID,
      templateParams,
      process.env.REACT_APP_USER_ID
    )
    .then(
      (result) => {
        console.log(result.text);
      },
      (error) => {
        console.log(error.text);
      }
    );
};
const sendDiscount = async (email, discount) => {
  const genTemplate = () => {
    return ` <div
      style="
        width: 100%;
        padding: 20px;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        max-width: 600px;
        margin: 20px auto;
      "
    >
      <div
        style="
          text-align: center;
          background-color: black;
          color: white;
          padding: 20px;
          border-radius: 8px 8px 0 0;
        "
      >
        <h1 style="margin: 0; font-size: 24px">
          Special Discount Just for You!
        </h1>
      </div>
      <div style="padding: 20px; line-height: 1.6">
        <h2 style="color: black; font-size: 20px">Hello!</h2>
        <p>
          Thank you for being a valued customer. To show our appreciation, we're
          giving you a special discount code that you can use on your next
          purchase.
        </p>
        <p>Use the code below to enjoy your discount:</p>
        <div
          style="
            display: block;
            width: fit-content;
            margin: 20px auto;
            padding: 15px 20px;
            background-color: #333;
            color: #fff;
            font-size: 18px;
            font-weight: bold;
            border-radius: 5px;
            text-align: center;
            letter-spacing: 2px;
          "
        >
          ${discount}
        </div>
        <p>Click the button below to start shopping now!</p>
        <a
          href="http://localhost:3000/"
          style="
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: #ffffff;
            background-color: black;
            border: none;
            border-radius: 5px;
            text-align: center;
            text-decoration: none;
            margin: 20px 0;
            font-weight: 700;
            transition: background-color 0.3s;
          "
        >
          Shop Now
        </a>
      </div>
      <div
        style="
          text-align: center;
          font-size: 14px;
          color: #777;
          margin-top: 20px;
        "
      >
        <p>
          If you have any questions, feel free to.
          <a
            href="mailto:nguyenhongkhanhvinh2511@gmail.com"
            style="color: #4caf50"
          >
            contact us
          </a>
          .
        </p>
        <p>Thank you for choosing our store!</p>
      </div>
    </div>`;
  };
  const templateParams = {
    user_email: email,
    template: genTemplate(),
  };

  await emailjs
    .send(
      process.env.REACT_APP_SERVICE_ID_2,
      process.env.REACT_APP_TEMPLATE_ID_2,
      templateParams,
      process.env.REACT_APP_USER_ID_2
    )
    .then(
      (result) => {
        console.log(result.text);
      },
      (error) => {
        console.log(error.text);
      }
    );
};
export { SendOrderConfirmation, sendMailSupport, sendDiscount };
