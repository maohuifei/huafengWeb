// 真实配置文件 - 不要提交到Git
export default {
    db: {
        host: 'localhost',
        port: 3306,
        username: 'huafeng',
        password: 'HFhf991((!',
        database: 'huafengSQL'
    },
    admin: {
        username: 'huafengAdmin',
        password: 'ooo000---'
    },
    whitelist:[
        'http://localhost:5173',
        'http://localhost:5174',
        'http://140.143.143.80',
        'http://huafeng.website',
        'http://www.huafeng.website',
        'http://huafeng.website:80',
        'http://www.huafeng.website:80'
    ]
}