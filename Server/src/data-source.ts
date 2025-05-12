import { DataSource } from 'typeorm';
import { User } from './models/entity/userEntity';
import { Article } from './models/entity/articleEntity';
import { Categories } from './models/entity/categoriesEntity';
import { Link } from './models/entity/LinkEntity';

// 导入敏感数据,需修改敏感数据模版文件并重命名
import sensitiveData from './sensitiveData'

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: sensitiveData.db.host,
    port: sensitiveData.db.port,
    username: sensitiveData.db.username,
    password: sensitiveData.db.password,
    database: sensitiveData.db.database,//数据库名
    entities: [User,Article,Categories,Link],//一个数组，用于指定 TypeORM 应该加载哪些实体类
    //synchronize: true,
    synchronize: false,
    migrations: ['src/migrations/*.js'], // 迁移文件路径
    migrationsTableName: 'migrations', // 迁移记录表名
    // logging: true,
});

  