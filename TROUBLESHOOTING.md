# Astro 项目故障排除指南

## 文件系统错误解决方案

如果遇到以下错误：
```
[ERROR] [UnknownFilesystemError] 
ENOENT: no such file or directory, rename 'E:\astro\astronews\.astro\content-assets.mjs.tmp' -> 'E:\astro\astronews\.astro\content-assets.mjs'
```

### 解决步骤

1. **清理缓存**
   ```bash
   node scripts/clear-astro-cache.js
   ```

2. **手动清理（备用方案）**
   ```bash
   rm -rf .astro
   rm -rf dist
   rm -rf node_modules/.astro
   rm -rf node_modules/.cache
   rm -rf node_modules/.vite
   ```

3. **重新安装依赖**
   ```bash
   npm install
   ```

4. **重新启动开发服务器**
   ```bash
   npm run dev
   ```

## 常见问题

### 1. 端口被占用
如果看到 "Port 4321 is in use"，Astro 会自动尝试其他端口。这是正常行为。

### 2. 图片路径错误
如果遇到图片导入错误，检查 `@assets/images/` 路径是否正确。

### 3. Google Analytics 在开发环境不工作
这是正常的，Google Analytics 只在生产环境 (`npm run build` 后) 才会加载。

## 预防措施

1. **定期清理缓存**
   ```bash
   # 每周运行一次
   node scripts/clear-astro-cache.js
   ```

2. **避免强制关闭开发服务器**
   使用 Ctrl+C 正常关闭

3. **保持依赖更新**
   ```bash
   npm audit fix
   ```

## 成功标志

开发服务器正常启动时会显示：
```
 astro  v5.12.8 ready in 2311 ms

┃ Local    http://localhost:4321/
┃ Network  use --host to expose

watching for file changes...
```

## 生产构建测试

在部署前测试构建：
```bash
npm run build
npm run preview
```