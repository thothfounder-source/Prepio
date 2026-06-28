#!/bin/bash

# Deploy Prept.ai Landing Page to Netlify
echo "🚀 Deploying Prept.ai to Netlify..."

# Install Netlify CLI if not already installed
if ! command -v netlify &> /dev/null; then
    echo "Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Login to Netlify (this will open browser)
netlify login

# Deploy the site
cd landing-page
netlify deploy --prod --dir .

echo "✅ Deployment complete!"
echo "🌐 Your site will be live at the provided Netlify URL"
echo "💰 Ready to accept $29 pre-orders!"