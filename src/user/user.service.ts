import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenerateService } from 'src/generate/generate.service';
import { ProductsService } from 'src/products/products.service';
import { WarehouseService } from 'src/warehouse/warehouse.service';
import { User } from './schema/user.schema';
import { addUserDto, updateUserDto } from './dto/user.dto';
//Dùng để populate, nếu muốn lấy thêm trường dữ liệu gì cứ thêm ở select
const populatedItems = [{ 
    path: 'listSaleinvoice',
    model: 'Salesinvoice',
    select: "salesInvoiceId saleProduct sumBill"
 }
 ]

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private userModel: Model<User>,
        private readonly generateService: GenerateService,
        @Inject(forwardRef(() => ProductsService))
        private readonly productService: ProductsService,
        @Inject(forwardRef(() => WarehouseService))
        private readonly warehouseService: WarehouseService,
    ) { }

    //tạo nhà cung cấp mới
    async createUserService({ userName, userPhone, userEmail, ...rest }: addUserDto): Promise<User> {
        // Loại bỏ listSaleinvoice nếu có trong rest
        const { listSaleinvoice, ...cleanRest } = rest;

        // Check for existing user with the same name, phone, or email
        const existingUser = await this.userModel.findOne({
            $or: [
                { userName },
                { userPhone },
                { userEmail }
            ]
        });

        if (existingUser) {
            throw new BadRequestException('User with this name, phone, or email already exists');
        }

        const newUser = new this.userModel({
            userName,
            userPhone,
            userEmail,
            ...cleanRest,
        });
        newUser.userId = await this.generateService.generateId(this.userModel, 'userId', 'U');

        console.log('Dữ liệu user mới:', newUser);

        try {
            const savedUser = await newUser.save();
            console.log('User đã lưu:', savedUser);
            return savedUser;
        } catch (error) {
            console.error('Lỗi khi lưu user:', error);
            throw new InternalServerErrorException('Không thể tạo user mới');
        }
    }
    //update nhà cung cấp
    async updateUserService(userId: string, { userName, userPhone, userEmail, userAddress, ...rest }: updateUserDto): Promise<User> {
        // Check if the supplier exists
        const existingUser = await this.userModel.findById(userId);
        if (!existingUser) {
            throw new BadRequestException('User not found');
        }

        // Check for existing supplier with the same name, phone, or email (excluding the current supplier)
        const duplicateUser = await this.userModel.findOne({
            _id: { $ne: userId },
            $or: [
                { userName },
                { userPhone },
                { userEmail },
                {userAddress}
            ]
        });

        if (duplicateUser) {
            throw new BadRequestException('Another supplier with this name, phone, or email already exists');
        }

        // Update supplier details
        existingUser.userName = userName;
        existingUser.userPhone = userPhone;
        existingUser.userEmail = userEmail;
        existingUser.userAddress = userAddress;
        Object.assign(existingUser, rest);

        return await existingUser.save();
    }
    //lấy tất cả nhà cung cấp
    async getAllUserService(): Promise<any[]> {
        try {
            return await this.userModel.find().populate(populatedItems).exec();
        } catch (error) {
            console.error('Error occurred while retrieving users:', error);
            throw new InternalServerErrorException('Failed to retrieve users');
        }
    }
    //lấy chi tiết nhà cung cấp theo ID
    async getDetailUserByIdService(id: string): Promise<User> {
        const existingUser = await this.userModel.findById(id).populate(populatedItems).exec();
        if (!existingUser) {
            throw new BadRequestException('User not found');
        }
        return existingUser;
    }

    //tìm kiếm nhà cung cấp theo id
    async findUserByIdService(id: string): Promise<User> {
        const user = await this.userModel.findById(id).populate(populatedItems).exec();
        if (!user) {
            throw new NotFoundException('user not found');
        }
        return user;
    }

    //tìm kiếm hdon 
    async searchUserService(searchKey: string): Promise<{ message: string; user: User[] }> {
        
        // Create a regex pattern based on user input
        const regexPattern = new RegExp(searchKey, 'i'); // 'i' for case-insensitive
       try {
           const allUser = await this.userModel.find({$or: [{userId: { $regex: regexPattern}}, {userName: { $regex: regexPattern}},{userPhone: { $regex: regexPattern}}]}).populate(populatedItems).exec();
          
        //    console.log("check")
        //    console.log(allUser)
           return { message: "Found", user: allUser };

       } catch (error) {
           console.error('Error occurred while searching Users:', error);
           throw new InternalServerErrorException('aaaaaaaaaaa');
       }
   }

   // async removeUniqueIndex() {
   //     await this.userModel.collection.dropIndex('listSaleinvoice.salesInvoiceId_1');
   // }

   // onModuleInit() {
   //     this.removeUniqueIndex();
   // }
}
