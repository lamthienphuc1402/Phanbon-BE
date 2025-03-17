import { BadRequestException, Injectable } from '@nestjs/common';
import { Admin } from './schema/admin.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from '../role/schema/role.schema';
import * as bcrypt from 'bcrypt';
import { GenerateService } from 'src/generate/generate.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    @InjectModel(Role.name) private roleModel: Model<Role>,
    private readonly generateService: GenerateService,
  ) {}

  async createAdminService(
    nameAdmin: string,
    userName: string,
    password: string,
    roleId: string[],
  ): Promise<Admin> {
    const duplicate = await this.adminModel.findOne({ userName }).exec();
    const findRole = await this.roleModel.find({ _id: { $in: roleId } }).exec();
    if (!findRole.length) {
      throw new BadRequestException('Role not exists');
    }
    if (duplicate) {
      throw new BadRequestException('Admin already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const adminId = await this.generateService.generateId(
      this.adminModel,
      'adminId',
      'AD',
    );
    const admin = new this.adminModel({
      nameAdmin,
      userName,
      adminId,
      password: hashedPassword,
      role: roleId,
    });
    return admin.save();
  }

  async updateAdminService(
    id: string,
    nameAdmin?: string,
    userName?: string,
    password?: string,
    roleId?: string[],
  ): Promise<Admin> {
    if (userName) {
      const duplicate = await this.adminModel
        .findOne({ userName, _id: { $ne: id } })
        .exec();
      if (duplicate) {
        throw new BadRequestException('Admin already exists');
      }
    }
    if (password) {
      password = await bcrypt.hash(password, 10);
    }
    if (roleId) {
      const findRole = await this.roleModel
        .find({ _id: { $in: roleId } })
        .exec();
      if (findRole.length !== roleId.length) {
        throw new BadRequestException('Some roles were not found');
      }
      roleId = findRole
        .map((role) => new mongoose.Types.ObjectId(role._id.toString()))
        .map((id) => id.toString());
    }
    return this.adminModel
      .findByIdAndUpdate(
        id,
        { $set: { nameAdmin, userName, password, role: roleId } },
        { new: true, runValidators: true },
      )
      .orFail(new BadRequestException('Admin not exists'))
      .exec();
  }

  async findOneAdminUserNameService(userName: string): Promise<Admin> {
    return this.adminModel.findOne({ userName }).exec();
  }

  async updateRefreshTokenService(
    userName: string,
    refreshToken: string,
  ): Promise<Admin> {
    const load = await this.adminModel
      .findOneAndUpdate({ userName }, { $set: { refreshToken } }, { new: true })
      .exec();
    return load;
  }

  async findOneAdminRefreshTokenService(refreshToken: string): Promise<Admin> {
    return this.adminModel.findOne({ refreshToken }).exec();
  }

  async deleteAdminService(id: string): Promise<{ message: string }> {
    const admin = await this.adminModel.findById(id).exec();
    if (!admin) {
      throw new BadRequestException('Admin not exists');
    }
    if (admin.userName === 'MasterAdmin') {
      throw new BadRequestException('Cannot delete master admin');
    }
    await this.adminModel.findByIdAndDelete(id).exec();
    return { message: 'Admin deleted successfully' };
  }

  async listAdminService(): Promise<(Admin & { role: Role[] })[]> {
    const admins = await this.adminModel
      .find()
      .select('-password -createdAt -updatedAt -refreshToken')
      .exec();
    const roleIds = admins.reduce((ids, admin) => [...ids, ...admin.role], []);
    const roles = await this.roleModel
      .find({ _id: { $in: roleIds } })
      .select('-permissionID')
      .exec();
    return admins.map((admin) => {
      const role = roles.filter((role) =>
        admin.role.map(String).includes(role._id.toString()),
      );
      return {
        ...admin.toObject(),
        role,
      } as Admin & { role: Role[] };
    });
  }

  async blockAdminService(id: string, isBlock: boolean): Promise<any> {
    await this.adminModel
      .findByIdAndUpdate(
        id,
        { $set: { isBlock } },
        { new: true, runValidators: true },
      )
      .exec();
    return { message: 'Block admin success' };
  }

  async findOneAdminService(id: string): Promise<Admin> {
    return this.adminModel.findById(id).exec();
  }

  async findOneAdminByIdRoleService(id: string): Promise<Admin> {
    return this.adminModel.findOne({ role: id }).exec();
  }
}
