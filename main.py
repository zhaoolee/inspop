import os
import pandas as pd
import re
import time
import json
from urllib.parse import quote

def insert_index_info_in_readme(insert_info):

    # 获取README.md内容
    with open (os.path.join(os.getcwd(), "README.md"), 'r', encoding='utf-8') as f:
        readme_md_content = f.read()

    print(insert_info)

    new_readme_md_content = re.sub(r'---start---(.|\n)*---end---', insert_info, readme_md_content)

    with open (os.path.join(os.getcwd(), "README.md"), 'w', encoding='utf-8') as f:
        f.write(new_readme_md_content)


    return True


def main():

    current_path = os.getcwd()
    print(current_path)

    inspop_data_csv_path = os.path.join(current_path, 'next-inspop', 'public', 'inspop-data.csv')
    inspop_data_csv_data = pd.read_csv(inspop_data_csv_path)
    print(inspop_data_csv_data)


    insert_info = '| en_content | cn_content | 发音 | \n | --- | --- | --- |\n'

    av_info_json_path =  os.path.join(current_path, 'next-inspop', 'public', 'av-info.json')
    av_info_json = {}
    # 打开JSON文件
    with open(av_info_json_path, 'r') as f:
        # 读取并解析JSON数据
        av_info_json = json.load(f)
    print('==av_info_json', av_info_json)
    for index, row in inspop_data_csv_data.iloc[::-1].iterrows():
        https_audio_info =  ''
        if(pd.isnull(row.av_dir) == False):
            audio_name = av_info_json[row.av_dir]['audio']
            https_audio_info = 'https://inspop.fangyuanxiaozhan.com/av/' + row.av_dir + '/' + audio_name
            https_audio_info = quote(https_audio_info, safe=':/') 
            print('https_audio_info==', https_audio_info)

        if(len(https_audio_info) > 0):
            insert_info = insert_info + "| " + row.en_content + ' | ' + row.cn_content + ' | [🔊](' + https_audio_info +') | ' + '\n'
        else:
            insert_info = insert_info + "| " + row.en_content + ' | ' + row.cn_content + ' | 建造中... | ' + '\n'

    insert_info = "---start---\n## 目录(" + f"目前收录{len(inspop_data_csv_data)}条，" + time.strftime('%Y年%m月%d日') + "更新，点击🔊收听原音) \n\n" + insert_info + "\n" + "---end---"
    insert_index_info_in_readme(insert_info)

main()