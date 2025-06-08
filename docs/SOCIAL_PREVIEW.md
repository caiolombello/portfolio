# 🖼️ Dynamic Social Media Preview

This portfolio automatically generates professional Open Graph images that appear when you share links on social media platforms like Facebook, Twitter, LinkedIn, and WhatsApp.

## 🎯 How It Works

The system creates two types of preview images:

### 1. **Portfolio Homepage Preview**
When someone shares your main portfolio URL, they see:
- ✅ **Your profile photo** (from `config/site.json`)
- ✅ **Your name** (from configuration)
- ✅ **Your professional title/description**
- ✅ **"PROFESSIONAL PORTFOLIO" badge**
- ✅ **Your domain URL**
- ✅ **Professional dark theme with gold accents**

### 2. **Specific Page Preview**
When sharing specific pages (blog posts, projects, etc.), they see:
- ✅ **Page-specific title**
- ✅ **Page description**
- ✅ **Clean, professional layout**
- ✅ **Consistent branding**

## 🛠️ Configuration

The preview images are automatically generated using your `config/site.json` settings:

```json
{
  "site": {
    "shortName": "Your Name",
    "description": "Your Professional Title",
    "url": "https://yourdomain.com",
    "profileImage": "/images/profile/your-photo.jpg"
  }
}
```

For best results, use a high-quality, professional profile photo in square format (400x400px minimum).

## 🌍 Social Media Support

Your dynamic preview image will show up when sharing on:
- **Facebook** - Link previews in posts and messages
- **Twitter** - Twitter Cards with image
- **LinkedIn** - Rich link previews in posts
- **WhatsApp** - Link preview thumbnails
- **Discord** - Embedded link previews
- **Slack** - Link unfurling with image

## 🎨 Professional Design

- **Modern gradient background** with dark theme
- **Gold accent colors** matching your portfolio
- **Your profile photo** in a circular frame
- **Professional typography** with clear hierarchy
- **"PROFESSIONAL PORTFOLIO" badge** for credibility

## 📱 Testing

Test your previews using:
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

Your professional portfolio now makes a great first impression when shared! 🌟 