#!/usr/bin/python
# coding:utf-8

from baiduspider import BaiduSpider  # 导入BaiduSpider
from pprint import pprint  # 导入pretty-print
import pandas as pd


# 获取百度的搜索结果，搜索关键词是'爬虫'
# pprint(BaiduSpider().search_web('博士 自杀', pn=4))
new_result = []
for i in range(1, 1010):
    length = len(BaiduSpider().search_web('博士 自杀', pn=i)["results"])
    print(length)
    for j in range(1, length - 1):
        new_result.append(BaiduSpider().search_web('博士 自杀', pn=i)["results"][j])

df = pd.DataFrame(new_result)
order = ['time', 'title', 'des', 'origin', 'url', 'type']
print(df)
df = df[order]
columns_map = {
    'time': '时间',
    'title': "标题",
    'des': "描述", 'origin': "来源", 'url': "链接", 'type': "种类"
}
df.rename(columns=columns_map, inplace=True)
df.fillna(' ', inplace=True)
print(df)
df.to_excel("../result.xlsx")
