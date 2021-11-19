module.exports = {
    base:'/instruct-request-axios/',
    title: 'instruct request',
    description: '指令请求器',
    themeConfig: {
        // logo: '/assets/images/logo.png',
        nav: [
            { text: '教程', link: '/zh/' },
            { 
                text: '配置', 
                items: [
                    { text: '基本配置', link: '/api/default/' },
                    { text: 'Cache配置', link: '/api/cache/' },
                    { text: 'Verification配置', link: '/api/verification/' },
                    { text: 'Slice配置', link: '/api/slice/' }
                ] 
            },
            { text: 'External', link: 'https://google.com',
                items: [
                    { text: 'Chinese', link: '/language/chinese/' },
                    { text: 'Japanese', link: '/language/japanese/' }
                ]
            },
        ],
        sidebarDepth: 2,
        sidebar: {
            '/zh/':[
                {
                    title:'介绍',
                    collapsable: true,
                    path:'/zh/'
                },
                {
                    title:'基础',
                    collapsable: true,
                    children:[
                        {
                            title:'安装',
                            path:'/zh/basics/install/'
                        },
                        {
                            title:'入门',
                            path:'/zh/basics/introduction/'
                        },
                        {
                            title:'配置',
                            path:'/zh/basics/request/'
                        },
                        {
                            title:'结果',
                            path:'/zh/basics/response/'
                        }
                    ]
                },
                {
                    title:'插件',
                    collapsable: true,
                    children:[
                        {
                            title:'缓存(cache)',
                            path:'/zh/plugins/cache/'
                        },
                        {
                            title:'提示(tip)',
                            path:'/zh/plugins/tip/'
                        },
                        {
                            title:'校验(verification)',
                            path:'/zh/plugins/verification/'
                        },
                        {
                            title:'分片(slice)',
                            path:'/zh/plugins/slice/'
                        }
                    ]
                }
            ],
            '/api/':[
                {
                    title:'配置',
                    collapsable: true,
                    path:'/api/default/'
                },
                {
                    title:'cache配置',
                    collapsable: true,
                    path:'/api/cache/'
                },
                {
                    title:'verification配置',
                    collapsable: true,
                    path:'/api/verification/'
                },
                {
                    title:'slice配置',
                    collapsable: true,
                    path:'/api/slice/'
                }
            ]
        },
        smoothScroll: true,
        lastUpdated:'2021-10-27'
    }
}
