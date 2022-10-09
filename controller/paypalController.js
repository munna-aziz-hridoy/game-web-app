import paypal from "@paypal/checkout-server-sdk";
import paypalClient from "../config/paypal.js";

export const paypalController = async (req, res) => {
  const storeItems = req.body.products;

  const request = new paypal.orders.OrdersCreateRequest();
  const total = storeItems.reduce((a, b) => a + b, 0);

  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: total,
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: total,
            },
          },
        },
        items: storeItems.map((item) => {
          return {
            name: item.name,
            unit_amount: {
              currency_code: "USD",
              value: item.price,
            },
            quantity: 1,
          };
        }),
      },
    ],
  });

  try {
    const order = await paypalClient.execute(request);
    console.log(order);
    res.json({ id: order.result.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
