#!/usr/bin/python
# coding:utf-8
import pandas as pd
import jieba

zisha_data = pd.read_excel("../result.xlsx")
print(zisha_data.head())

des = zisha_data['描述']
print(des.head())

sentence_seged = []
fenci = []
for i in des:
    seged = []
    sentence_seged = jieba.cut(i)
    for j in sentence_seged:
        if len(j) > 1:
            seged.append(j)
    fenci.append(seged)

print(fenci[2])
print(len(des), len(fenci))
zisha_data['分词'] = fenci
zisha_data.to_excel("../result1.xlsx")
