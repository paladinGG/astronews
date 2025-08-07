# 脚本使用说明

## 🚀 新文章添加脚本

### 基础版本
```bash
npm run add-articles
```
- 转换HTML到MDX
- 修复图片路径
- 修复格式问题
- 测试工作流程

### 增强版本（推荐）
```bash
npm run add-articles-enhanced
```
- 包含基础版本的所有功能
- 全面检查和修复图片问题
- 验证图片状态
- 更详细的错误处理和提示

## 🔧 图片问题修复脚本

### 检查图片状态
```bash
npm run check-images
```
- 检查所有文章的封面图片状态
- 显示缺失、损坏、正常的图片统计
- 提供修复建议

### 基础图片修复
```bash
npm run fix-all-images
```
- 修复@assets路径到相对路径
- 修复.svg到.png
- 确保图片文件存在

### 全面图片修复（推荐）
```bash
npm run fix-images-comprehensive
```
- 包含基础修复的所有功能
- 检测并修复损坏的图片文件
- 自动添加缺失的cover字段
- 验证图片文件有效性

### 修复封面路径为@assets别名
```bash
npm run fix-cover-paths
```
- 将所有文章的cover路径从相对路径改为@assets别名
- 解决Astro缓存导致的ImageNotFound问题
- 确保图片路径格式正确

### 修复MDX代码块格式
```bash
npm run fix-mdx-codeblocks
```
- 修复重复的代码块标记（如 ```css\n```css）
- 清理代码块内部的嵌套问题
- 确保代码块格式正确显示
- 修复CSS、JavaScript、HTML代码块的格式问题
- 解决"Could not parse expression with acorn"错误

### 修复YouTube链接为嵌入组件
```bash
npm run fix-youtube-links
```
- 自动检测文章中的YouTube链接
- 将YouTube链接转换为嵌入播放器组件
- 自动添加必要的导入语句
- 提供更好的用户体验

### 修复列表项格式问题
```bash
npm run fix-list-items
```
- 修复列表项中的$200、$1等错误内容
- 根据上下文智能推断正确的列表内容
- 修复HTML到MDX转换过程中的列表截断问题
- 确保列表项显示正确的内容

### 更新文章发布时间
```bash
npm run update-publish-times
```
- 将集中发布的文章时间重新分布
- 在3周时间范围内随机分配发布时间
- 确保时间在合理的工作时间内（9:00-18:00）
- 让文章发布时间看起来更自然和真实

### 图片本地化
```bash
npm run localize-images
```
- 下载所有文章中的外部图片到本地
- 自动替换文章中的外部图片链接为本地路径
- 使用 @assets 别名路径，提高加载速度
- 减少对外部CDN服务的依赖
- 适用于现有文章和新上传的文章

### 修复缺失图片
```bash
npm run fix-missing-images
```
- 为无法下载的外部图片创建本地占位图片
- 确保所有图片链接都指向本地文件
- 避免因外部图片失效导致的显示问题
- 自动处理404和403等下载错误

### 测试图片本地化状态
```bash
npm run test-image-localization
```
- 检查所有文章的图片本地化状态
- 统计外部图片和本地图片数量
- 验证本地图片文件是否存在
- 提供详细的本地化报告

### 清理损坏的图片文件
```bash
npm run clean-corrupted-images
```
- 检测并删除损坏的图片文件
- 自动重新创建有效的占位图片
- 解决 "NoImageMetadata" 错误
- 确保所有图片文件格式正确

## 🛠️ 其他维护脚本

### 修复所有格式问题
```bash
npm run fix-all
```
- 修复MDX代码块格式
- 确保cover字段存在
- 创建默认封面图片

### 测试工作流程
```bash
npm run test-workflow
```
- 验证所有文章的完整性
- 检查frontmatter格式
- 验证图片文件存在

## 📝 使用建议

1. **添加新文章时**：使用 `npm run add-articles-enhanced`
2. **遇到ImageNotFound错误时**：运行 `npm run fix-images-comprehensive`
3. **定期检查图片状态**：运行 `npm run check-images`
4. **修复格式问题**：运行 `npm run fix-all`

## 🔍 常见问题解决

### ImageNotFound 错误
```bash
# 1. 检查图片状态
npm run check-images

# 2. 全面修复图片问题
npm run fix-images-comprehensive

# 3. 修复封面路径为@assets别名（解决Astro缓存问题）
npm run fix-cover-paths

# 4. 清除Astro缓存
Remove-Item -Recurse -Force ".astro" -ErrorAction SilentlyContinue

# 5. 再次检查确认修复
npm run check-images
```

### 格式错误
```bash
# 修复所有格式问题
npm run fix-all

# 修复MDX代码块格式
npm run fix-mdx-codeblocks
```

### 工作流程验证
```bash
# 测试所有文章完整性
npm run test-workflow
```

## 📊 脚本功能对比

| 脚本 | 图片检查 | 图片修复 | 路径修复 | 格式修复 | 完整性验证 |
|------|----------|----------|----------|----------|------------|
| `add-articles` | ❌ | ✅ | ✅ | ✅ | ✅ |
| `add-articles-enhanced` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `check-images` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `fix-all-images` | ❌ | ✅ | ✅ | ❌ | ❌ |
| `fix-images-comprehensive` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `fix-cover-paths` | ❌ | ❌ | ✅ | ❌ | ❌ |
| `fix-mdx-codeblocks` | ❌ | ❌ | ❌ | ✅ | ❌ |
| `fix-all` | ❌ | ✅ | ❌ | ✅ | ❌ |
| `test-workflow` | ✅ | ❌ | ❌ | ❌ | ✅ | 