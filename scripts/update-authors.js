#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 新的作者信息映射
const NEW_AUTHORS = {
  'rajesh-patel': {
    name: 'Alex Chen',
    job: 'Tech Strategist',
    bio: 'Passionate about emerging technologies and their impact on business transformation.',
    social: [
      { name: 'LinkedIn', url: 'https://linkedin.com/in/alexchen', icon: 'linkedin' },
      { name: 'Twitter', url: 'https://twitter.com/alexchen', icon: 'newTwitter' }
    ]
  },
  'sofia-martinez': {
    name: 'Maya Rodriguez',
    job: 'Product Innovation Lead',
    bio: 'Expert in user experience design and product strategy with a focus on human-centered solutions.',
    social: [
      { name: 'LinkedIn', url: 'https://linkedin.com/in/mayarodriguez', icon: 'linkedin' },
      { name: 'Twitter', url: 'https://twitter.com/mayarodriguez', icon: 'newTwitter' }
    ]
  },
  'maria-gonzalez': {
    name: 'Jordan Kim',
    job: 'Data Science Specialist',
    bio: 'Specializing in machine learning and data-driven decision making for business growth.',
    social: [
      { name: 'LinkedIn', url: 'https://linkedin.com/in/jordankim', icon: 'linkedin' },
      { name: 'Twitter', url: 'https://twitter.com/jordankim', icon: 'newTwitter' }
    ]
  },
  'olivier-brown': {
    name: 'Sam Taylor',
    job: 'Digital Marketing Expert',
    bio: 'Helping businesses grow through strategic digital marketing and content creation.',
    social: [
      { name: 'LinkedIn', url: 'https://linkedin.com/in/samtaylor', icon: 'linkedin' },
      { name: 'Twitter', url: 'https://twitter.com/samtaylor', icon: 'newTwitter' }
    ]
  },
  'john-smith': {
    name: 'Casey Williams',
    job: 'Business Development Manager',
    bio: 'Focused on building strategic partnerships and driving business growth initiatives.',
    social: [
      { name: 'LinkedIn', url: 'https://linkedin.com/in/caseywilliams', icon: 'linkedin' },
      { name: 'Twitter', url: 'https://twitter.com/caseywilliams', icon: 'newTwitter' }
    ]
  },
  'liam-leonard': {
    name: 'Riley Anderson',
    job: 'UX Research Lead',
    bio: 'Dedicated to understanding user needs and creating intuitive digital experiences.',
    social: [
      { name: 'LinkedIn', url: 'https://linkedin.com/in/rileyanderson', icon: 'linkedin' },
      { name: 'Dribbble', url: 'https://dribbble.com/rileyanderson', icon: 'dribbble' }
    ]
  },
  'ahmed-khan': {
    name: 'Zara Thompson',
    job: 'Content Strategy Director',
    bio: 'Creating compelling content strategies that engage audiences and drive results.',
    social: [
      { name: 'LinkedIn', url: 'https://linkedin.com/in/zarathompson', icon: 'linkedin' },
      { name: 'Medium', url: 'https://medium.com/@zarathompson', icon: 'medium' }
    ]
  },
  'chloe-nguyen': {
    name: 'Quinn Martinez',
    job: 'Growth Hacker',
    bio: 'Specializing in rapid business growth through innovative marketing and product strategies.',
    social: [
      { name: 'LinkedIn', url: 'https://linkedin.com/in/quinnmartinez', icon: 'linkedin' },
      { name: 'Twitter', url: 'https://twitter.com/quinnmartinez', icon: 'newTwitter' }
    ]
  },
  'emily-devis': {
    name: 'Parker Johnson',
    job: 'Operations Specialist',
    bio: 'Optimizing business processes and improving operational efficiency across organizations.',
    social: [
      { name: 'LinkedIn', url: 'https://linkedin.com/in/parkerjohnson', icon: 'linkedin' },
      { name: 'Twitter', url: 'https://twitter.com/parkerjohnson', icon: 'newTwitter' }
    ]
  },
  'jane-doe': {
    name: 'Avery Davis',
    job: 'Customer Success Manager',
    bio: 'Ensuring customer satisfaction and driving product adoption through strategic support.',
    social: [
      { name: 'LinkedIn', url: 'https://linkedin.com/in/averydavis', icon: 'linkedin' },
      { name: 'Twitter', url: 'https://twitter.com/averydavis', icon: 'newTwitter' }
    ]
  }
};

const AUTHORS_DIR = path.join(__dirname, '../src/content/authors');

async function updateAuthor(authorSlug) {
  const authorDir = path.join(AUTHORS_DIR, authorSlug);
  const authorFile = path.join(authorDir, 'index.mdx');

  if (!fs.existsSync(authorFile)) {
    console.log(`⚠️  作者文件不存在: ${authorFile}`);
    return false;
  }

  const newAuthor = NEW_AUTHORS[authorSlug];
  if (!newAuthor) {
    console.log(`⚠️  没有找到新作者信息: ${authorSlug}`);
    return false;
  }

  try {
    // 读取现有文件
    const content = fs.readFileSync(authorFile, 'utf8');

    // 更新frontmatter
    let updatedContent = content
      .replace(/name: .*/, `name: ${newAuthor.name}`)
      .replace(/job: .*/, `job: ${newAuthor.job}`)
      .replace(/bio: .*/, `bio: ${newAuthor.bio}`);

    // 更新社交链接
    const socialRegex = /social:\s*\[[\s\S]*?\]/;
    const newSocial = `social: ${JSON.stringify(newAuthor.social, null, 2)}`;
    updatedContent = updatedContent.replace(socialRegex, newSocial);

    // 写入更新后的文件
    fs.writeFileSync(authorFile, updatedContent);

    console.log(`✅ 更新作者: ${authorSlug} -> ${newAuthor.name}`);
    return true;

  } catch (error) {
    console.error(`❌ 更新作者失败 ${authorSlug}: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🔄 开始更新作者信息...');

  const authorSlugs = Object.keys(NEW_AUTHORS);
  let successCount = 0;
  let failCount = 0;

  for (const authorSlug of authorSlugs) {
    const success = await updateAuthor(authorSlug);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log('\n📊 更新结果:');
  console.log(`✅ 成功: ${successCount} 个作者`);
  console.log(`❌ 失败: ${failCount} 个作者`);

  console.log('\n📝 新的作者列表:');
  Object.entries(NEW_AUTHORS).forEach(([slug, author]) => {
    console.log(`  - ${author.name} (${author.job})`);
  });

  console.log('\n🎉 作者信息更新完成！');
}

main().catch(console.error); 