# Stripe Setup Guide for InterviewReady AI

## Step 1: Create Stripe Account
1. Go to https://dashboard.stripe.com/register
2. Sign up with business email: Thoth.founder@gmail.com
3. Business name: "InterviewReady AI" or "Thoth Founder LLC"
4. Business type: Software/SaaS
5. Country: United States

## Step 2: Account Verification
- Add business details (can use personal info for sole proprietorship)
- Verify phone number
- Add bank account for payouts
- Complete tax information (W-9 for US)

## Step 3: Get API Keys
After account setup:
1. Go to Developers → API Keys
2. Copy these for landing page:
   - **Publishable Key** (starts with pk_test_...)
   - **Secret Key** (starts with sk_test_YOUR_SECRET_KEY_HERE...)

## Step 4: Create Products
In Stripe Dashboard:
1. Go to Products → Add Product
2. Create: "InterviewReady AI - Early Bird"
   - Price: $29.00 USD
   - Type: One-time payment
   - Product ID: interviewready-preorder

## Step 5: Configure Webhooks (Optional)
For order tracking:
1. Developers → Webhooks → Add endpoint
2. URL: your-landing-page.com/stripe-webhook
3. Events: checkout.session.completed

## Test Mode vs Live Mode
- Start in TEST mode for development
- Switch to LIVE mode when ready for real payments
- Test with card: 4242 4242 4242 4242

## Integration Code for Landing Page
```javascript
// Add to landing-page/script.js
const stripe = Stripe('pk_test_YOUR_PUBLISHABLE_KEY_HERE');

const createCheckout = async () => {
  const response = await fetch('/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      price_id: 'price_YOUR_PRICE_ID', // From Stripe product
      success_url: window.location.origin + '/success.html',
      cancel_url: window.location.origin + '/index.html',
    }),
  });
  
  const session = await response.json();
  await stripe.redirectToCheckout({ sessionId: session.id });
};
```

## Quick Start URLs
- Stripe Dashboard: https://dashboard.stripe.com/
- API Keys: https://dashboard.stripe.com/test/apikeys
- Products: https://dashboard.stripe.com/test/products
- Documentation: https://stripe.com/docs/payments/checkout