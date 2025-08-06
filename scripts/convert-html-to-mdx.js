#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG = {
  newArticlesDir: path.join(__dirname, '../newarticle'),
  articlesDir: path.join(__dirname, '../src/content/articles'),
  imagesDir: path.join(__dirname, '../src/assets/images/articles'),
  maxDescriptionLength: 300,
  defaultAuthor: 'sofia-martinez'
};

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function downloadImage(url, targetPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(targetPath);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

function extractContentFromHTML(htmlContent) {
  // 提取标题
  const titleMatch = htmlContent.match(/<title[^>]*>([^<]+)<\/title>/i) ||
    htmlContent.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  const title = titleMatch ? titleMatch[1].trim() : 'Untitled Article';

  // 提取描述
  const metaDescMatch = htmlContent.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
    htmlContent.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
  let description = metaDescMatch ? metaDescMatch[1].trim() : '';

  if (!description) {
    // 从内容中提取第一段作为描述
    const firstParagraphMatch = htmlContent.match(/<p[^>]*>([^<]+)<\/p>/i);
    description = firstParagraphMatch ? firstParagraphMatch[1].trim() : '';
  }

  // 限制描述长度
  if (description.length > CONFIG.maxDescriptionLength) {
    description = description.substring(0, CONFIG.maxDescriptionLength - 3) + '...';
  }

  // 提取第一张图片作为封面
  const imgMatch = htmlContent.match(/<img[^>]*src=["']([^"']+)["'][^>]*>/i);
  const coverImageUrl = imgMatch ? imgMatch[1] : null;

  // 提取正文内容
  let content = htmlContent;

  // 移除HTML文档结构标签
  content = content.replace(/<!DOCTYPE[^>]*>/gi, '');
  content = content.replace(/<html[^>]*>[\s\S]*?<\/html>/gi, (match) => {
    // 提取html标签内的内容
    const bodyMatch = match.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    return bodyMatch ? bodyMatch[1] : match;
  });
  content = content.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '');
  content = content.replace(/<body[^>]*>([\s\S]*)<\/body>/gi, '$1');
  content = content.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

  // 转换HTML标签为Markdown
  content = content.replace(/<h1[^>]*>([^<]+)<\/h1>/gi, '# $1\n\n');
  content = content.replace(/<h2[^>]*>([^<]+)<\/h2>/gi, '## $1\n\n');
  content = content.replace(/<h3[^>]*>([^<]+)<\/h3>/gi, '### $1\n\n');
  content = content.replace(/<h4[^>]*>([^<]+)<\/h4>/gi, '#### $1\n\n');
  content = content.replace(/<h5[^>]*>([^<]+)<\/h5>/gi, '##### $1\n\n');
  content = content.replace(/<h6[^>]*>([^<]+)<\/h6>/gi, '###### $1\n\n');

  content = content.replace(/<p[^>]*>([^<]+)<\/p>/gi, '$1\n\n');
  content = content.replace(/<br\s*\/?>/gi, '\n');
  content = content.replace(/<strong[^>]*>([^<]+)<\/strong>/gi, '**$1**');
  content = content.replace(/<b[^>]*>([^<]+)<\/b>/gi, '**$1**');
  content = content.replace(/<em[^>]*>([^<]+)<\/em>/gi, '*$1*');
  content = content.replace(/<i[^>]*>([^<]+)<\/i>/gi, '*$1*');

  // 处理列表
  content = content.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (match, listContent) => {
    return listContent.replace(/<li[^>]*>([^<]+)<\/li>/gi, '- $1\n') + '\n';
  });

  content = content.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (match, listContent) => {
    let counter = 1;
    return listContent.replace(/<li[^>]*>([^<]+)<\/li>/gi, () => `${counter++}. $1\n`) + '\n';
  });

  // 处理图片标签
  content = content.replace(/<img[^>]*src=["']([^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*>/gi, '![$2]($1)');
  content = content.replace(/<img[^>]*src=["']([^"']+)["'][^>]*>/gi, '![]($1)');

  // 处理表格标签 - 转换为Markdown表格
  content = content.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (match, tableContent) => {
    const rows = tableContent.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi);
    if (!rows) return '';

    let markdownTable = '';
    rows.forEach((row, index) => {
      const cells = row.match(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi);
      if (!cells) return;

      const cleanCells = cells.map(cell => {
        return cell.replace(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/i, '$1').trim();
      });

      markdownTable += '| ' + cleanCells.join(' | ') + ' |\n';

      // 添加表头分隔符
      if (index === 0) {
        markdownTable += '| ' + cleanCells.map(() => '---').join(' | ') + ' |\n';
      }
    });

    return markdownTable + '\n';
  });

  // 处理div和其他容器标签
  content = content.replace(/<div[^>]*class=["']styled-container["'][^>]*>/gi, '');
  content = content.replace(/<div[^>]*class=["']img-container["'][^>]*>/gi, '');
  content = content.replace(/<div[^>]*class=["']highlight-box["'][^>]*>/gi, '');
  content = content.replace(/<div[^>]*class=["']cta-block["'][^>]*>/gi, '');
  content = content.replace(/<div[^>]*>/gi, '');
  content = content.replace(/<\/div>/gi, '');

  // 处理section标签
  content = content.replace(/<section[^>]*>/gi, '');
  content = content.replace(/<\/section>/gi, '\n\n');

  // 处理blockquote标签
  content = content.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (match, quoteContent) => {
    const cleanQuote = quoteContent.replace(/<p[^>]*>([^<]+)<\/p>/gi, '$1').trim();
    return `> ${cleanQuote}\n\n`;
  });

  // 处理YouTube链接 - 转换为嵌入组件
  content = content.replace(/https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/gi, (match, videoId) => {
    return `\n<YouTubeEmbed videoId="${videoId}" title="YouTube video" />\n`;
  });
  
  // 处理链接
  content = content.replace(/<a[^>]*href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/gi, '[$2]($1)');

  // 处理剩余的HTML标签
  content = content.replace(/<p[^>]*>([^<]+)<\/p>/gi, '$1\n\n');
  content = content.replace(/<br\s*\/?>/gi, '\n');
  content = content.replace(/<strong[^>]*>([^<]+)<\/strong>/gi, '**$1**');
  content = content.replace(/<b[^>]*>([^<]+)<\/b>/gi, '**$1**');
  content = content.replace(/<em[^>]*>([^<]+)<\/em>/gi, '*$1*');
  content = content.replace(/<i[^>]*>([^<]+)<\/i>/gi, '*$1*');

  // 移除所有剩余的HTML标签
  content = content.replace(/<[^>]*>/g, '');

  // 清理多余的空白字符
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
  content = content.trim();

  return { title, description, content, coverImageUrl };
}

function createMdxContent(title, description, content, author, category = 'productivity') {
  const slug = slugify(title);
  const now = new Date().toISOString();
  
  // 检查内容是否包含YouTube嵌入组件
  const hasYouTubeEmbed = content.includes('<YouTubeEmbed');
  const importStatement = hasYouTubeEmbed ? 'import YouTubeEmbed from "@/components/YouTubeEmbed.astro";\n\n' : '';

  return `---
isDraft: false
isMainHeadline: false
isSubHeadline: false
description: "${description}"
title: "${title}"
category: ${category}
publishedTime: ${now}
authors:
  - ${author}
cover: '@assets/images/articles/${slug}/cover.png'
---

${importStatement}${content}
`;
}

function createDefaultCoverImage(targetPath) {
  // 创建一个简单的默认封面图片（base64编码的PNG）
  const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  const pngBuffer = Buffer.from(pngBase64, 'base64');
  fs.writeFileSync(targetPath, pngBuffer);
}

function setupHeadlines(articleSlugs) {
  // 设置一个主标题和四个副标题
  const headlines = {};
  articleSlugs.forEach((slug, index) => {
    if (index === 0) {
      headlines[slug] = { isMainHeadline: true, isSubHeadline: false };
    } else if (index < 5) {
      headlines[slug] = { isMainHeadline: false, isSubHeadline: true };
    } else {
      headlines[slug] = { isMainHeadline: false, isSubHeadline: false };
    }
  });
  return headlines;
}

async function processHtmlFile(htmlFilePath) {
  try {
    const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
    const { title, description, content, coverImageUrl } = extractContentFromHTML(htmlContent);
    const slug = slugify(title);

    // 检查文章是否已存在
    const articleDir = path.join(CONFIG.articlesDir, slug);
    if (fs.existsSync(articleDir)) {
      console.log(`⏭️  跳过已存在的文章: ${title}`);
      return null;
    }

    // 创建文章目录
    fs.mkdirSync(articleDir, { recursive: true });

    // 创建图片目录
    const imagesDir = path.join(CONFIG.imagesDir, slug);
    fs.mkdirSync(imagesDir, { recursive: true });

    // 处理封面图片
    const coverImagePath = path.join(imagesDir, 'cover.png');
    if (coverImageUrl && coverImageUrl.startsWith('http')) {
      try {
        await downloadImage(coverImageUrl, coverImagePath);
        console.log(`✅ 下载封面图片: ${coverImageUrl}`);
      } catch (error) {
        console.log(`⚠️  封面图片下载失败，使用默认图片: ${error.message}`);
        createDefaultCoverImage(coverImagePath);
      }
    } else {
      createDefaultCoverImage(coverImagePath);
      console.log(`📄 使用默认封面图片`);
    }

    // 创建MDX内容
    const mdxContent = createMdxContent(title, description, content, CONFIG.defaultAuthor);

    // 保存MDX文件
    const mdxPath = path.join(articleDir, 'index.mdx');
    fs.writeFileSync(mdxPath, mdxContent);

    console.log(`✅ 创建文章: ${title}`);
    return slug;
  } catch (error) {
    console.error(`❌ 处理文件失败 ${htmlFilePath}: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('🚀 HTML到MDX转换脚本启动');
  console.log(`📂 新文章目录: ${CONFIG.newArticlesDir}`);
  console.log(`📂 目标文章目录: ${CONFIG.articlesDir}`);

  if (!fs.existsSync(CONFIG.newArticlesDir)) {
    console.error(`❌ 新文章目录不存在: ${CONFIG.newArticlesDir}`);
    return;
  }

  const htmlFiles = fs.readdirSync(CONFIG.newArticlesDir)
    .filter(file => file.toLowerCase().endsWith('.html'));

  if (htmlFiles.length === 0) {
    console.log('📭 没有找到HTML文件');
    return;
  }

  console.log(`📄 找到 ${htmlFiles.length} 个HTML文件`);

  const createdSlugs = [];

  for (const htmlFile of htmlFiles) {
    const htmlFilePath = path.join(CONFIG.newArticlesDir, htmlFile);
    const slug = await processHtmlFile(htmlFilePath);
    if (slug) {
      createdSlugs.push(slug);
    }
  }

  // 设置标题
  if (createdSlugs.length > 0) {
    const headlines = setupHeadlines(createdSlugs);

    for (const [slug, settings] of Object.entries(headlines)) {
      const mdxPath = path.join(CONFIG.articlesDir, slug, 'index.mdx');
      if (fs.existsSync(mdxPath)) {
        let content = fs.readFileSync(mdxPath, 'utf8');
        content = content.replace(/isMainHeadline: (true|false)/, `isMainHeadline: ${settings.isMainHeadline}`);
        content = content.replace(/isSubHeadline: (true|false)/, `isSubHeadline: ${settings.isSubHeadline}`);
        fs.writeFileSync(mdxPath, content);
      }
    }
  }

  console.log(`\n🎉 转换完成！`);
  console.log(`📊 成功创建: ${createdSlugs.length} 篇文章`);

  if (createdSlugs.length > 0) {
    console.log('\n📝 建议运行以下命令修复格式问题:');
    console.log('npm run fix-all');
  }
}

main().catch(console.error);
