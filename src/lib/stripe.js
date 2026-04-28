import Stripe from "stripe";

let stripe = null;

export function getStripe() {
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
      appInfo: {
        name: "Amazon Product Studio",
      },
    });
  }
  return stripe;
}
