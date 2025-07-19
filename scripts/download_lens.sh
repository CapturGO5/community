#!/bin/bash

# Create images directory if it doesn't exist
mkdir -p public/images

# Download lens images
curl -o public/images/lens-gold.png "https://raw.githubusercontent.com/privy-io/lens-images/main/gold.png"
curl -o public/images/lens-green.png "https://raw.githubusercontent.com/privy-io/lens-images/main/green.png"
curl -o public/images/lens-red.png "https://raw.githubusercontent.com/privy-io/lens-images/main/red.png"
curl -o public/images/lens-purple.png "https://raw.githubusercontent.com/privy-io/lens-images/main/purple.png"
curl -o public/images/lens-blue.png "https://raw.githubusercontent.com/privy-io/lens-images/main/blue.png"
