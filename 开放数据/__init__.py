import json
import os
import re
from html import unescape
from pprint import pprint
from urllib.parse import quote, urlparse
import pandas as pd
import requests
from bs4 import BeautifulSoup

from baiduspider._spider import BaseSpider
from baiduspider.parser import Parser
from baiduspider.errors import ParseError, UnknownError

__all__ = ['BaiduSpider']


class BaiduSpider(BaseSpider):
    def __init__(self) -> None:
        """爬取百度的搜索结果

        本类的所有成员方法都遵循下列格式：

            {
                'results': <一个列表，表示搜索结果，内部的字典会因为不同的成员方法而改变>,
                'total': <一个正整数，表示搜索结果的最大页数，可能会因为搜索结果页码的变化而变化，因为百度不提供总共的搜索结果页数>
            }

        目前支持百度搜索，百度图片，百度知道，百度视频，百度资讯，百度文库，百度经验和百度百科，并且返回的搜索结果无广告。继承自``BaseSpider``。

        BaiduSpider.`search_web(self: BaiduSpider, query: str, pn: int = 1) -> dict`: 百度网页搜索

        BaiduSpider.`search_pic(self: BaiduSpider, query: str, pn: int = 1) -> dict`: 百度图片搜索

        BaiduSpider.`search_zhidao(self: BaiduSpider, query: str, pn: int = 1) -> dict`: 百度知道搜索

        BaiduSpider.`search_video(self: BaiduSpider, query: str, pn: int = 1) -> dict`: 百度视频搜索

        BaiduSpider.`search_news(self: BaiduSpider, query: str, pn: int = 1) -> dict`: 百度资讯搜索

        BaiduSpider.`search_wenku(self: BaiduSpider, query: str, pn: int = 1) -> dict`: 百度文库搜索

        BaiduSpider.`search_jingyan(self: BaiduSpider, query: str, pn: int = 1) -> dict`: 百度经验搜索

        BaiduSpider.`search_baike(self: BaiduSpider, query: str) -> dict`: 百度百科搜索
        """
        super().__init__()
        # 爬虫名称（不是请求的，只是用来表识）
        self.spider_name = 'BaiduSpider'
        # 设置请求头
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
            'Referer': 'https://www.baidu.com',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
            'Cookie': 'BAIDUID=BB66E815C068DD2911DB67F3F84E9AA5:FG=1; BIDUPSID=BB66E815C068DD2911DB67F3F84E9AA5; PSTM=1592390872; BD_UPN=123253; BDUSS=RQa2c4eEdKMkIySjJ0dng1ZDBLTDZEbVNHbmpBLU1rcFJkcVViaTM5NUdNaDFmRVFBQUFBJCQAAAAAAAAAAAEAAAAPCkwAZGF5ZGF5dXAwNgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEal9V5GpfVebD; BDORZ=B490B5EBF6F3CD402E515D22BCDA1598; BD_HOME=1; delPer=0; BD_CK_SAM=1; PSINO=2; COOKIE_SESSION=99799_0_5_2_8_0_1_0_5_0_0_0_99652_0_3_0_1593609921_0_1593609918%7C9%230_0_1593609918%7C1; H_PS_PSSID=1457_31326_32139_31660_32046_32231_32091_32109_31640; sug=3; sugstore=0; ORIGIN=0; bdime=0; BDRCVFR[feWj1Vr5u3D]=I67x6TjHwwYf0; H_PS_645EC=1375sSQTgv84OSzYM3CN5w5Whp9Oy7MkdGdBcw5umqOIFr%2FeFZO4D952XrS0pC1kVwPI; BDSVRTM=223'
        }
        self.parser = Parser()

    def search_web(self, query: str, pn: int = 1) -> dict:
        """百度网页搜索

        - 简单搜索：
            >>> BaiduSpider().search_web('搜索词')
            {
                'results': [
                    {
                        'result': int, 总计搜索结果数,
                        'type': 'total'  # type用来区分不同类别的搜索结果
                    },
                    {
                        'results': [
                            'str, 相关搜索建议',
                            '...',
                            '...',
                            '...',
                            ...
                        ],
                        'type': 'related'
                    },
                    {
                        'process': 'str, 算数过程',
                        'result': 'str, 运算结果',
                        'type': 'calc'
                        # 这类搜索结果仅会在搜索词涉及运算时出现，不一定每个搜索结果都会出现的
                    },
                    {
                        'results': [
                            {
                                'author': 'str, 新闻来源',
                                'time': 'str, 新闻发布时间',
                                'title': 'str, 新闻标题',
                                'url': 'str, 新闻链接',
                                'des': 'str, 新闻简介，大部分情况为None'
                            },
                            { ... },
                            { ... },
                            { ... },
                            ...
                        ],
                        'type': 'news'
                        # 这类搜索结果仅会在搜索词有相关新闻时出现，不一定每个搜索结果都会出现的
                    },
                    {
                        'results': [
                            {
                                'cover': 'str, 视频封面图片链接',
                                'origin': 'str, 视频来源',
                                'length': 'str, 视频时长',
                                'title': 'str, 视频标题',
                                'url': 'str, 视频链接'
                            },
                            { ... },
                            { ... },
                            { ... },
                            ...
                        ],
                        'type': 'video'
                        # 这类搜索结果仅会在搜索词有相关视频时出现，不一定每个搜索结果都会出现的
                    },
                    {
                        'result': {
                                'cover': 'str, 百科封面图片/视频链接',
                                'cover-type': 'str, 百科封面类别，图片是image，视频是video',
                                'des': 'str, 百科简介',
                                'title': 'str, 百科标题',
                                'url': 'str, 百科链接'
                        },
                        'type': 'baike'
                        # 这类搜索结果仅会在搜索词有相关百科时出现，不一定每个搜索结果都会出现的
                    },
                    {
                        'des': 'str, 搜索结果简介',
                        'origin': 'str, 搜索结果的来源，可能是域名，也可能是名称',
                        'time': 'str, 搜索结果的发布时间',
                        'title': 'str, 搜索结果标题',
                        'type': 'result',  # 正经的搜索结果
                        'url': 'str, 搜索结果链接'
                    },
                    { ... },
                    { ... },
                    { ... },
                    ...
                ],
                'total': int, 总计的搜索结果页数，可能会因为当前页数的变化而随之变化
            }

        - 带页码：
            >>> BaiduSpider().search_web('搜索词', pn=2)
            {
                'results': [ ... ],
                'total': ...
            }

        Args:
            query (str): 要爬取的query
            pn (int, optional): 爬取的页码. Defaults to 1.

        Returns:
            dict: 爬取的返回值和搜索结果
        """
        error = None
        try:
            text = quote(query, 'utf-8')
            url = 'https://www.baidu.com/s?wd=%s&pn=%d' % (text, (pn - 1) * 10)
            content = self._get_response(url)
            results = self.parser.parse_web(content)
        except Exception as err:
            error = err
        finally:
            self._handle_error(error)
        return {
            'results': results['results'],
            'total': results['pages']
        }

    
