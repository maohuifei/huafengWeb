import { AppDataSource } from "../data-source";
import { Categories } from "./entity/categoriesEntity";

export class CategoriesDataService {
    async addCategories(value: any) {
        const categoriesRepository = AppDataSource.getRepository(Categories)
        const newCategories = categoriesRepository.create(value)
        await categoriesRepository.save(newCategories)
    }

    async delCategories(value: any) {
        const categoriesRepository = AppDataSource.getRepository(Categories)
        const waitDelCategories = await categoriesRepository.findOneBy({ id: value.id })
        if (waitDelCategories) {
            await categoriesRepository.remove(waitDelCategories)
        } else {
            throw new Error('配置未找到');
        }

    }
    async getCategories(value: any){  
        const categoriesRepository = AppDataSource.getRepository(Categories) 
        const categories = await categoriesRepository.find({
          where: { type: value.type }
      });
        if (categories.length > 0) {  
          return categories;  
        } else {  
          throw new Error('没有找到符合条件的系统');  
        }  
      }  
}
