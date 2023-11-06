#!/bin/bash

# 定义GIF的参数
duration=5
fps=5
height=100

# 获取输入参数
input=$1

# 获取输入文件的目录和文件名（不包括扩展名）
dir=$(dirname "$input")
base=$(basename "$input")
filename="${base%.*}"

# 生成输出文件的路径
output_gif="$dir/${filename}.gif"

# 获取视频的总帧数
total_frames=$(ffprobe -v error -select_streams v:0 -show_entries stream=nb_frames -of default=nokey=1:noprint_wrappers=1 "$input")

# 计算需要跳过的帧数，以便在整个视频长度内均匀地选择25帧
skip_frames=$((total_frames / (duration * fps)))

# 使用ffmpeg生成GIF，每秒5帧，高度为100px，宽度自适应
ffmpeg -y -i "$input" -vf "select='not(mod(n,${skip_frames}))',setpts=N/(5*TB),scale=-1:${height},fps=${fps},loop=-1:0" -y "$output_gif"
