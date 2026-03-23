#!/bin/bash
# 启动 game-rogue 游戏服务器

echo "正在启动 game-rogue 游戏..."

# 检查Python版本并启动HTTP服务器
if command -v python3 &> /dev/null; then
    echo "使用 Python3 启动服务器..."
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "使用 Python 启动服务器..."
    python -m http.server 8000
else
    echo "错误: 未找到 Python 解释器"
    exit 1
fi