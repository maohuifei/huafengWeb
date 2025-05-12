/**
 * 工具类集合
 * 功能：提供常用的工具方法
 */
export class Utils{
    /**
     * 日期格式化方法
     * 功能：将ISO格式日期字符串格式化为YYYY/MM/DD格式
     * @param {string} dateString - ISO格式的日期字符串
     * @returns {string} 格式化后的日期字符串(YYYY/MM/DD)
     * 使用示例：
     *   const utils = new Utils();
     *   const formatted = utils.formatDate('2023-01-01T00:00:00.000Z');
     *   // 返回 '2023/01/01'
     */
    formatDate(dateString: string): string {  
        const date = new Date(dateString);  // 创建Date对象

        // 格式化为YYYY/MM/DD
        const formattedDate = `${date.getFullYear()}/${
            (date.getMonth() + 1).toString().padStart(2, '0')}/${  // 月份补零
            date.getDate().toString().padStart(2, '0')}`;  // 日期补零
        
        return formattedDate;  
    } 
}

  