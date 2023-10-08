import os
import pandas as pd
import re
import time


def insert_index_info_in_readme(insert_info):



    # 获取README.md内容
    with open (os.path.join(os.getcwd(), "README.md"), 'r', encoding='utf-8') as f:
        readme_md_content = f.read()

    print(insert_info)

    new_readme_md_content = re.sub(r'---start---(.|\n)*---end---', insert_info, readme_md_content)

    with open (os.path.join(os.getcwd(), "README.md"), 'w', encoding='utf-8') as f:
        f.write(new_readme_md_content)

    print("==new_readme_md_content==>>", new_readme_md_content)

    return True


def main():
    print('---')
    current_path = os.getcwd()
    print(current_path)

    inspop_data_csv_path = os.path.join(current_path, 'next-inspop', 'public', 'inspop-data.csv')
    inspop_data_csv_data = pd.read_csv(inspop_data_csv_path)
    print(inspop_data_csv_data)
    print('len==', len(inspop_data_csv_data))

    insert_info = ''


    for index, row in inspop_data_csv_data.iloc[::-1].iterrows():
        insert_info = insert_info + row.en_content + '/' + row.cn_content + ' | ' + row.en_source + row.cn_source + '\n\n'

    insert_info = "---start---\n## 目录(" + f"目前收录{len(inspop_data_csv_data)}条，" + time.strftime('%Y年%m月%d日') + "更新)\n\n" + insert_info + "\n" + "---end---"
    insert_index_info_in_readme(insert_info)

main()