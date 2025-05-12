/**
 * JWT（JSON Web Token）工具模块
 * 用于生成和验证用户认证令牌
 */
import * as jwt from "jsonwebtoken"
import * as dotenv from "dotenv"

// 加载环境变量
dotenv.config();

/**
 * JWT密钥
 * 用于签名和验证token
 * 注意：在实际生产环境中，这个密钥应该存储在环境变量中
 */
const secret = 'JWThuafeng991((!';

/**
 * JWT配置选项
 * - expiresIn: token的有效期
 */
const options = {
    expiresIn: '7d' // token有效期为1小时
};

/**
 * 生成JWT token
 * @param id 用户ID
 * @param username 用户名
 * @param password 用户密码
 * @returns 生成的JWT token字符串
 */
export function signToken(id: number, username: string, password: string) {
    // 创建token的负载（payload）
    const payload = { id: id, username: username, password: password };
    // 使用密钥和选项生成token
    return jwt.sign(payload, secret, options);
}

/**
 * 验证JWT token
 * @param token 要验证的token字符串
 * @returns 如果验证成功返回解码后的payload，失败返回null
 */
export function verifyToken(token: string): any {
    try {
        return jwt.verify(token, secret);
    } catch (err) {
        return null;
    }
}