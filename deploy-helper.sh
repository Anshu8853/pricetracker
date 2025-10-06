#!/bin/bash

# Deployment Helper Script for Price Tracker

echo "🚀 Price Tracker Deployment Helper"
echo "===================================="
echo ""

echo "📋 Pre-Deployment Checklist:"
echo ""
echo "□ MongoDB Atlas account created"
echo "□ Database user and connection string ready"
echo "□ Gmail App Password generated"
echo "□ GitHub account ready"
echo "□ Code committed to GitHub"
echo ""
echo "Press Enter to continue..."
read

echo ""
echo "🔗 Opening deployment platforms..."
echo ""

# Open deployment platforms
start https://cloud.mongodb.com
start https://render.com
start https://vercel.com

echo ""
echo "✅ Opened in browser:"
echo "   - MongoDB Atlas (database)"
echo "   - Render.com (backend)"
echo "   - Vercel.com (frontend)"
echo ""
echo "📖 Follow DEPLOY_NOW.md for step-by-step instructions!"
echo ""
echo "Your app will be PUBLIC in ~20 minutes! 🎉"
