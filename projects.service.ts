import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Project, Prisma } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; description?: string; userId: string }): Promise<Project> {
    return this.prisma.project.create({
      data,
    });
  }

  async findAll(userId: string): Promise<Project[]> {
    return this.prisma.project.findMany({
      where: { userId },
      include: {
        _count: {
          select: { generations: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string): Promise<Project | null> {
    return this.prisma.project.findFirst({
      where: { id, userId },
      include: {
        generations: {
          include: { assets: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async remove(id: string, userId: string): Promise<Project> {
    return this.prisma.project.delete({
      where: { id, userId },
    });
  }
}
