#!/bin/bash

# 获取输入参数 bash ./get_voice_video.sh /Users/zhaoolee/jellyfin/Movies/Iron\ Man\ 2\ \(2010\)\ \[imdbid-tt1228705\]/Iron\ Man\ 2\ \(2010\)\ \[imdbid-tt1228705\]\ -\ 1080p.mp4 00:39:35,216 00:39:48,521
input=$1
start_time=$2
end_time=$3

# 如果 start_time 或 end_time 包含 ","，则将其替换为 "."
start_time=${start_time//,/\.}
end_time=${end_time//,/\.}

# 获取输入文件的目录和文件名（不包括扩展名）
dir=$(dirname "$input")
base=$(basename "$input")
filename="${base%.*}"

# 在文件名中替换 ":" 和 "." 为 "_"
start_time_filename=${start_time//[:.]/_}
end_time_filename=${end_time//[:.]/_}

# 生成输出文件的路径
output_video="$dir/${filename}_${start_time_filename}-${end_time_filename}.mp4"
output_audio="$dir/${filename}_${start_time_filename}-${end_time_filename}.mp3"

# 使用ffmpeg提取带有音频的视频片段和纯音频
ffmpeg -y -i "$input" -ss "$start_time" -to "$end_time" -c:v libx264 -c:a aac "$output_video"
ffmpeg -y -i "$input" -ss "$start_time" -to "$end_time" -vn -ab 128k -ar 44100 -y "$output_audio"

# 创建新的文件夹
new_dir="$dir/${filename}_${start_time_filename}-${end_time_filename}"
mkdir -p "$new_dir"

# 将音视频文件移动到新的文件夹
mv "$output_video" "$new_dir"
mv "$output_audio" "$new_dir"
