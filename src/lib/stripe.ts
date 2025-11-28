import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  console.warn("STRIPE_SECRET_KEY not configured. Stripe actions will fail.");
}

export const stripe = secretKey
  ? new Stripe(secretKey, {
  apiVersion: "2025-10-29.clover",
    })
  : null;

