const {
  OrderModel,
  OrderdetailModel,
  PayModel,
  CartModel,
} = require("../models");
const sequelize = require("../models/config.model");
const sendMail = require("../services/email.service");

const stripe = require("stripe")(
  "sk_test_51LVQHSIIOheAIx48nIk6pYpsJUjrwzAhFGCYQxhPvctSA7v4EkgnAA07qddXh9NPNaHgJoraGwBGk5u5ILzfG09100EQXCswTr"
);

const createCheckout = async (req, res) => {
  const { userId } = req.body;
  const products = req.body.products.map((item) => {
    return {
      id: item.id,
      name: item.name,
      price: item.price,
      categoryId: item.categoryId,
      manufactureId: item.manufactureId,
      quantityProduct: item.quantityProduct,
    };
  });
  const customer = await stripe.customers.create({
    metadata: {
      userId: userId,
      cart: JSON.stringify(products),
    },
  });

  const line_items = products.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          metadata: {
            id: item.id,
          },
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantityProduct,
    };
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "VN"],
    },
    line_items,
    phone_number_collection: {
      enabled: true,
    },
    mode: "payment",
    customer: customer.id,
    success_url: `${process.env.CLIENT_URL}/checkout-success`,
    cancel_url: `${process.env.CLIENT_URL}/cart`,
  });

  // res.redirect(303, session.url);
  res.send({ url: session.url });
};
let endpointSecret;
endpointSecret =
  "whsec_2I0ptDP0Lp4v4w745hxv9Duboz5cVjRl";

const webhook = async (req, res) => {
  let data;
  let eventType;
  if (endpointSecret) {
    let event;
    let signature = req.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed:  ${err}`);
      return res.sendStatus(400);
    }
    // Extract the object from the event.
    data = event.data.object;
    eventType = event.type;
  } else {
    data = req.body.data.object;
    eventType = req.body.type;
  }
  
  // Handle the checkout.session.completed event
  if (eventType === "checkout.session.completed") {
    const t = await sequelize.transaction();
    try {
      const customer = await stripe.customers.retrieve(data.customer);
      const products = JSON.parse(customer.metadata.cart);
      const userId = customer.metadata.userId;
      const email = data.customer_details.email;
      const phone = data.customer_details.phone;
      const fullName = data.customer_details.name;
      const address =
        data.shipping_details.address.line1 +
        " " +
        data.shipping_details.address.line2 +
        " " +
        data.shipping_details.address.city +
        " " +
        data.shipping_details.address.state;
      const totalPrice = Number(data.amount_total.toString().slice(0, -2));
      const orderDetailBulkData = [];
      const removeCartIds = [];
      const newOrder = await OrderModel.create(
        {
          userId,
          fullName,
          phone,
          address,
        },
        { transaction: t }
      );

      products.forEach((item) => {
        orderDetailBulkData.push({
          orderId: newOrder.id,
          productId: item.id,
          quantityProduct: item.quantityProduct,
          VAT: 10,
        });
        removeCartIds.push(item.id);
      });
      await OrderdetailModel.bulkCreate(orderDetailBulkData, {
        transaction: t,
      });
      const newPayment = await PayModel.create(
        {
          method: "Visa/Master Cart",
          total: totalPrice,
          orderId: newOrder.id,
        },
        { transaction: t }
      );
      await CartModel.destroy(
        { where: { productId: removeCartIds } },
        { transaction: t }
      );
      await t.commit();

      await sendMail(
        `${email}`,
        `Successful Payment`,
        `Thanks for ordering at our BK store
              Payment Details:
              #####################################
              PaymentID: ${newPayment.id},
              Payment method: Visa/Master Cart ,
              Paid :$${totalPrice}
              #####################################
              Good luck and have fun!
            `
      );
    } catch (error) {
      await t.rollback();
      console.log(err.message);
    }
  }

  res.status(200).end();
};

module.exports = {
  createCheckout,
  webhook,
};
