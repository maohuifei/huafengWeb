import { AppDataSource } from "../data-source";
import { Link } from "./entity/LinkEntity";

export class LinkDataService {
    async addLink(value: any) {
        const LinkRepository = AppDataSource.getRepository(Link)
        const newLink = LinkRepository.create(value)
        await LinkRepository.save(newLink)
    }

    async delLink(value: any) {
        const LinkRepository = AppDataSource.getRepository(Link)
        const waitDelLink = await LinkRepository.findOneBy({ id: value.id })
        if (waitDelLink) {
            await LinkRepository.remove(waitDelLink)
        } else {
            throw new Error('配置未找到');
        }

    }
    async getLink(value: any){  
        const LinkRepository = AppDataSource.getRepository(Link) 
        const link = await LinkRepository.find({
          where: { category: value.category }
      });
        if (link.length > 0) {  
          return link;  
        } else {  
          throw new Error('没有找到符合条件的系统');  
        }  
      }  
     //修改文章
     async putLink(value: any) {
      const LinkRepository = AppDataSource.getRepository(Link)
      const waitPutLink = await LinkRepository.findOneBy({ id: value.id })
      if (waitPutLink) {
          waitPutLink.name = value.name
          waitPutLink.category = value.category
          waitPutLink.icon = value.icon
          waitPutLink.summary = value.summary
          waitPutLink.url = value.url
          await LinkRepository.save(waitPutLink)
      } else {
          throw new Error('未找到');
      }
  }
}
