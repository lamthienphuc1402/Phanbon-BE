import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { WareHouse } from './schema/warehouse.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ProductsService } from 'src/products/products.service';
import { Model, Types } from 'mongoose';
import { CreateWarehouseDto } from './dto/warehouse.dto';
@Injectable()
export class WarehouseService {
  constructor(
    @InjectModel(WareHouse.name)
    private readonly warehouseModel: Model<WareHouse>,
    @Inject(forwardRef(() => ProductsService))
    private readonly productService: ProductsService,
  ) {}

  // Tao kho
  async createWarehouse(
    createWarehouseDto: CreateWarehouseDto,
  ): Promise<WareHouse> {
    const { productId, wareHouseName } = createWarehouseDto;

    // Check if warehouse already exists for the product
    const existingWarehouse = await this.warehouseModel.findOne({
      productId: new Types.ObjectId(productId),
    });
    if (existingWarehouse) {
      throw new BadRequestException('Warehouse already exists for the product');
    }

    // Check if warehouse name already exists
    const existingWarehouseName = await this.warehouseModel.findOne({
      wareHouseName,
    });
    if (existingWarehouseName) {
      throw new BadRequestException('Warehouse name already exists');
    }

    // Check if product exists
    if (createWarehouseDto.productId) {
      const product = await this.productService.findProductByIdService(
        createWarehouseDto.productId,
      );
      if (!product) {
        throw new BadRequestException('Product not found');
      }

      const newWarehouse = new this.warehouseModel(createWarehouseDto);
      return await newWarehouse.save();
    }
  }

  // Cập nhật số lượng sản phẩm trong kho
  async updateProductQuantityService(product: { productId: string; quantity: number }): Promise<void> {
    const warehouse = await this.warehouseModel.findOne({
      productId: new Types.ObjectId(product.productId),
    });

    if (!warehouse) {
      throw new BadRequestException('Warehouse not found for the product');
    }

    await this.warehouseModel.updateOne(
      { productId: new Types.ObjectId(product.productId) },
      { $inc: { quantityNow: product.quantity } },
    );
  }

  //xem danh sach kho
  async getAllWarehouseService(): Promise<WareHouse[]> {
    return await this.warehouseModel.find().populate({
      path: 'productId',
      select: 'productId productName unit ',
    })
    .select({
      describeWareHouse: 0,
      quantityMin: 0,
      quantityMax: 0,
    })
    .lean()
    .exec();
  }

  //xem chi tiết kho theo id
  async getWarehouseByIdService(warehouseId: string): Promise<WareHouse> {
    const warehouse = await this.warehouseModel
      .findById(warehouseId)
      .populate({
        path: 'productId',
        select: 'productId productName unit ',
      });
    return warehouse;
  }




}
