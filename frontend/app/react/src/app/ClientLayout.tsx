'use client';
import {ConfigProvider, Layout, BackTop} from 'antd';
import React from 'react';
import {Provider} from 'react-redux';
import {NextIntlClientProvider} from 'next-intl';

import store from '@/store';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const {Content} = Layout;

export default function ClientLayout({children, messages, locale}: {
    children: React.ReactNode;
    messages: never;
    locale: string;
}) {
    return (
        <NextIntlClientProvider messages={messages} locale={locale}>
            <Provider store={store}>
                <ConfigProvider
                    theme={{
                        token: {
                            colorPrimary: '#722ED1',
                            fontSize: 14,
                            colorBgContainer: 'transparent',  // ← 添加全局容器背景
                        },
                        components: {
                            Layout: {
                                headerBg: 'transparent',
                                bodyBg: 'transparent',
                                footerBg: 'transparent',
                            },
                            Menu: {  // ← 添加 Menu 组件配置
                                darkItemBg: 'transparent',
                                itemBg: 'transparent',
                                darkSubMenuItemBg: 'transparent',
                                subMenuItemBg: 'transparent',
                            }
                        }
                    }}
                >
                    <Layout style={{minHeight: '100vh', background: 'transparent'}}>
                        <Header/>
                        <Content style={{
                            padding: '0 24px',
                            maxWidth: 1200,
                            margin: '0 auto',
                            flex: 1,
                            background: 'transparent'
                        }}>
                            {children}
                        </Content>
                        <Footer/>
                    </Layout>
                </ConfigProvider>
            </Provider>
        </NextIntlClientProvider>
    );
}
