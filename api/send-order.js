export default async function handler(req, res) {

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  try {

    const order = req.body;

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      return res.status(500).json({
        success: false,
        message: "Missing Telegram env variables"
      });
    }

    const message = `
🛒 NEW GOLD ORDER

📦 Product: ${order.product}
💰 Price: $${order.price}
🔢 Quantity: ${order.quantity}
💵 Total: $${order.total}

👤 CUSTOMER DETAILS
Name: ${order.customer.name}
Phone: ${order.customer.phone}
Address: ${order.customer.address}

📅 Date: ${order.date}
`;

    const telegramURL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    const response = await fetch(telegramURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message
      })
    });

    const data = await response.json();

    if (!data.ok) {
      return res.status(500).json({
        success: false,
        message: "Telegram API failed",
        error: data
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order sent to Telegram"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
}