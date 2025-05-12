/**
 * 用户相关的数据库操作服务
 * 包含用户的增删改查等基本操作
 */
import { AppDataSource } from '../data-source'
import { User } from './entity/userEntity'

// 导入敏感数据,需修改敏感数据模版文件并重命名
import sensitiveData from '../sensitiveData'
/**
 * 用户数据服务类
 * 处理所有与用户相关的数据库操作
 */
export class UserDataService{
    /**
     * 初始化管理员账号
     * 如果数据库中没有用户，则创建默认管理员账号
     */
    async initAdmin() {
        const userRepository = AppDataSource.getRepository(User)
        const count = await userRepository.count()
        if (count === 0) {
            const admin = userRepository.create({
                username: sensitiveData.admin.username,
                password: sensitiveData.admin.password,
            })
            await userRepository.save(admin)
        }
    }

    /**
     * 用户登录验证
     * @param value 包含登录信息的对象（username, password）
     * @throws Error 当用户未找到或密码错误时抛出错误
     * @returns Promise<User> 返回用户信息
     */
    async potLogin(value:any){
        const userRepository = AppDataSource.getRepository(User)
        const waitPutUser = await userRepository.findOneBy({ username: value.username })
        if (waitPutUser) {
            if(waitPutUser.password==value.password){
                return waitPutUser
            }else{
                throw new Error('密码错误');
            }
        }else{
            throw new Error('用户未找到');
        }
    }
    //修改用户信息
    async reviseUser(value:any){
        const userRepository = AppDataSource.getRepository(User)
        const waitPutUser = await userRepository.findOneBy({ id: value.id })
        if (waitPutUser) {
            waitPutUser.username = value.username
            waitPutUser.password = value.password
            waitPutUser.nickname = value.nickname
            waitPutUser.avatar = value.avatar
            waitPutUser.declaration = value.declaration
            waitPutUser.address = value.address
            waitPutUser.position = value.position
            await userRepository.save(waitPutUser)
        } else {
            throw new Error('用户未找到');
        }
    }
    //查询用户信息
    async queryUser(value:any){
        const userRepository = AppDataSource.getRepository(User)
        const waitPutUser = await userRepository.findOneBy({ id: value.id })
        if (waitPutUser) {
            return waitPutUser
        } else {
            throw new Error('用户未找到');
        }
    }
}