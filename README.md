# EntryEarns - Knowledge Platform

A modern knowledge platform built with Astro, featuring curated insights and practical playbooks for career growth.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:4321` (or the port shown in terminal)

## 📝 Adding New Articles

### Automated Workflow (Recommended)

To add new HTML articles from the `newarticle` folder:

```bash
npm run add-articles
```

This command will:
1. Convert HTML files to MDX format
2. Extract cover images from HTML content
3. Fix all formatting issues
4. Validate article integrity

### Manual Workflow

If you prefer to run steps individually:

1. **Convert HTML to MDX:**
   ```bash
   npm run convert-html
   ```

2. **Fix image paths:**
   ```bash
   npm run fix-images
   ```

3. **Fix all formatting issues:**
   ```bash
   npm run fix-all
   ```

4. **Test workflow:**
   ```bash
   npm run test-workflow
   ```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run convert-html` - Convert HTML articles to MDX
- `npm run fix-images` - Fix image path formats
- `npm run fix-all` - Fix all article formatting issues
- `npm run test-workflow` - Validate article integrity
- `npm run add-articles` - Complete automated article addition workflow

## 📁 Project Structure

```
src/
├── content/
│   ├── articles/     # Article MDX files
│   ├── authors/      # Author profiles
│   ├── categories/   # Category definitions
│   └── views/        # Page metadata
├── components/       # Astro components
├── layouts/         # Page layouts
├── pages/           # Route pages
└── assets/
    └── images/
        └── articles/ # Article cover images
```

## 🎯 Features

- **Modern Design**: Clean, professional interface
- **Content Collections**: Structured content management
- **Image Optimization**: Automatic image processing
- **SEO Optimized**: Built-in SEO features
- **Responsive**: Mobile-first design
- **Fast**: Static site generation

## 🔧 Configuration

Key configuration files:
- `src/lib/config/index.ts` - Site configuration
- `src/lib/schema/index.ts` - Content validation schemas
- `astro.config.mjs` - Astro configuration

## 📄 License

This project is licensed under the MIT License.
