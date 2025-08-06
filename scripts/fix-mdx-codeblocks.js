#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, '../src/content/articles');

function fixMdxCodeblocks() {
  console.log('🔧 修复MDX代码块格式脚本启动');
  console.log(`📂 文章目录: ${articlesDir}`);

  if (!fs.existsSync(articlesDir)) {
    console.error(`❌ 文章目录不存在: ${articlesDir}`);
    return;
  }

  const items = fs.readdirSync(articlesDir);
  let filesFixed = 0;
  let totalFixes = 0;

  for (const item of items) {
    const fullPath = path.join(articlesDir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const mdxPath = path.join(fullPath, 'index.mdx');
      if (fs.existsSync(mdxPath)) {
        let content = fs.readFileSync(mdxPath, 'utf8');
        const originalContent = content;
        let contentChanged = false;
        let fixesInFile = 0;

        // 修复CSS代码块
        // 匹配 @media 查询
        content = content.replace(
          /@media\s*\([^)]+\)\s*\{[^}]+\}([^`\n]*)/g,
          (match, after) => {
            contentChanged = true;
            fixesInFile++;
            // 提取CSS内容并格式化
            const cssMatch = match.match(/@media\s*\([^)]+\)\s*\{([^}]+)\}/);
            if (cssMatch) {
              const cssContent = cssMatch[1].trim();
              const formattedCSS = cssContent.split(';').map(rule => rule.trim()).filter(rule => rule).join(';\n  ');
              return `\`\`\`css\n@media (min-width: 992px) {\n  ${formattedCSS};\n}\n\`\`\`\n\n${after}`;
            }
            return match;
          }
        );

        // 修复 .container 样式
        content = content.replace(
          /\.container\s*\{[^}]+\}([^`\n]*)/g,
          (match, after) => {
            contentChanged = true;
            fixesInFile++;
            const cssMatch = match.match(/\.container\s*\{([^}]+)\}/);
            if (cssMatch) {
              const cssContent = cssMatch[1].trim();
              const formattedCSS = cssContent.split(';').map(rule => rule.trim()).filter(rule => rule).join(';\n  ');
              return `\`\`\`css\n.container {\n  ${formattedCSS};\n}\n\`\`\`\n\n${after}`;
            }
            return match;
          }
        );

        // 修复HTML代码块
        content = content.replace(
          /&lt;([^&]+)&gt;([^`\n]*)/g,
          (match, tagContent, after) => {
            contentChanged = true;
            fixesInFile++;
            return `\`\`\`html\n<${tagContent}>\n\`\`\`\n\n${after}`;
          }
        );

        // 保存修改后的内容
        if (content !== originalContent) {
          fs.writeFileSync(mdxPath, content);
          console.log(`🔧 修复文件: ${item} (${fixesInFile} 个修复)`);
          filesFixed++;
          totalFixes += fixesInFile;
        }
      }
    }
  }

  console.log(`\n📊 修复完成！`);
  console.log(`📁 修复文件: ${filesFixed} 个`);
  console.log(`🔧 总修复数: ${totalFixes} 个`);
  console.log(`🎉 所有MDX代码块格式问题已修复！`);
}

fixMdxCodeblocks(); 