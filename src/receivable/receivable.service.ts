import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { addReceivableDto, updateReceivableDto } from './dto/receivable.dto';
import { Receivable } from './schema/receivable.schema';
import { GenerateService } from 'src/generate/generate.service';
import { InjectModel } from '@nestjs/mongoose';
import { Salesinvoice } from 'src/salesinvoice/schema/salesinvoice.schema';
import { Model } from 'mongoose';
import { SalesinvoiceModule } from 'src/salesinvoice/salesinvoice.module';
//Dùng để populate, nếu muốn lấy thêm trường dữ liệu gì cứ thêm ở select
const populatedItems = [{
    path: "salesInvoiceId",
    model: "Salesinvoice",
    select: "salesInvoiceId saleProduct sumBill"
}, {
    path: "userId",
    model: "User",
    select: "userName userId userPhone"
}]

@Injectable()
export class ReceivableService {
    constructor(
        @InjectModel(Receivable.name) private receivableModel: Model<Receivable>,
        @InjectModel(Salesinvoice.name) private saleInvoiceModel: Model<Salesinvoice>,
        private readonly generateService: GenerateService,

    ) { }

    //get all bill
    async getAllReceivable(): Promise<Receivable[]> {
        const invoices = await this.receivableModel.find().populate(populatedItems).exec()

        return invoices;
    }

    //thêm bill mới
    async addReceivable(data: addReceivableDto): Promise<Receivable> {
        const newReceivable = new this.receivableModel({ ...data });

        newReceivable.ReceivableId = await this.generateService.generateId(this.receivableModel, 'ReceivableId', 'R');

        //Find sale invoice and calculate the debt
        const foundInvoice = await this.saleInvoiceModel.findById(newReceivable.salesInvoiceId);
        newReceivable.debt = foundInvoice.sumBill - newReceivable.paid;
        foundInvoice.statusSalesInvoice = "inactive";
        const tempDate = foundInvoice.createdAt;
        newReceivable.dueDate = new Date(tempDate.setDate(tempDate.getDate() + parseInt(newReceivable.paymentTerm.split(" ")[0])));
        foundInvoice.save();

        try {
            return await newReceivable.save();
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Failed to create receivable'); // Lỗi chung
        }
    }
    //update hdon
    async updateReceivable(id: string, data: updateReceivableDto): Promise<Receivable> {
        const existingReceivable = await this.receivableModel.findById(id).exec();
        if (!existingReceivable) {
            throw new BadRequestException('Saleinvoice not found');
        }

        // Check for existing saleinvoice with the same name, phone, or email
        const updateReceivable = await this.receivableModel.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true }
        ).exec();
        const foundInvoice = await this.saleInvoiceModel.findById(updateReceivable.salesInvoiceId);
        updateReceivable.debt = foundInvoice.sumBill - updateReceivable.paid
        
        const tempDate = foundInvoice.createdAt;
        updateReceivable.dueDate = new Date(tempDate.setDate(tempDate.getDate() + parseInt(updateReceivable.paymentTerm.split(" ")[0])));
        if (!updateReceivable) {
            throw new BadRequestException('Failed to update saleinvoice');
        }
        updateReceivable.save()
        return updateReceivable;
    }
    //tìm kiếm hdon theo id
    async findReceivableByIdService(id: string): Promise<Receivable> {
        const receivable = await this.receivableModel.findById(id).populate(populatedItems).exec();
        if (!receivable) {
            throw new NotFoundException('Receivable not found');
        }
        return receivable;
    }
    //lấy chi tiết hdon theo ID
    async getDetailReceivableByIdService(id: string): Promise<Receivable> {
        const existingReceivable = await this.receivableModel.findById(id).populate(populatedItems).exec();
        if (!existingReceivable) {
            throw new BadRequestException('Receivable not found');
        }
        return existingReceivable;
    }
    //tìm kiếm hdon 
    async searchReceivableService(searchKey: string): Promise<{ message: string; receivable: Receivable[] }> {
        
         // Create a regex pattern based on user input
         const regexPattern = new RegExp(searchKey, 'i'); // 'i' for case-insensitive
        try {
            const allReceivable = await this.receivableModel.find({ReceivableId: { $regex: regexPattern}}).populate(populatedItems).exec();
           
            // console.log("check")
            // console.log(allReceivable)
            return { message: "Found", receivable: allReceivable };

        } catch (error) {
            console.error('Error occurred while searching Receivables:', error);
            throw new InternalServerErrorException('aaaaaaaaaaa');
        }
    }
}
