import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class GenerateService {
    
     async generateId(modelName: Model<any>, dName: string, prefix: string): Promise<string> {
        // Lấy sản phẩm cuối cùng được sắp xếp theo productId trong thứ tự giảm dần
        const lastId = await modelName.findOne().sort({ [dName]: -1 });
    
        let id: string;
        if (lastId) {
            // Lấy phần số của productId và tăng nó lên
            const lastIdNumber = parseInt(lastId[dName].substring(prefix.length), 10);
            id = prefix + (lastIdNumber + 1).toString().padStart(4, '0');
        } else {
            // Nếu không có sản phẩm nào, bắt đầu với "P0001" hoặc prefix+"0001"
            id = prefix + '0001';
        }
    
        return id;
    }    

}
