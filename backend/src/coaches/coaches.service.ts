import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCoachDto } from './dto/update-coach.dto';
import { ListCoachesQueryDto } from './dto/list-coaches-query.dto';
import {
  CoachesRepository,
  type CoachOverviewRow,
  type CoachRow,
} from './coaches.repository';
import { UsersService } from '../users/users.service';
import type { AuthenticatedUser } from '../authorization/types/authenticated-user.type';

type PublicCoach = Omit<CoachRow, 'password'>;
type PublicCoachOverview = {
  coach: Omit<
    CoachOverviewRow,
    'password' | 'createdPlans' | 'missedTasks' | 'totalAssignedStudents'
  >;
  stats: {
    createdPlans: number;
    missedTasks: number;
    totalAssignedStudents: number;
  };
};

@Injectable()
export class CoachesService {
  constructor(
    private readonly coachesRepository: CoachesRepository,
    private readonly usersService: UsersService,
  ) {}

  async listCoaches(query: ListCoachesQueryDto) {
    const result = await this.coachesRepository.list(query);

    return {
      data: result.items.map((item) => this.toPublicCoach(item)),
      page: result.page,
      limit: result.limit,
      total: result.total,
    };
  }

  async getCoachById(id: number): Promise<PublicCoach> {
    const coach = await this.coachesRepository.findById(id);

    if (!coach) {
      throw new NotFoundException('Coach not found');
    }

    return this.toPublicCoach(coach);
  }

  async getCoachOverview(id: number): Promise<PublicCoachOverview> {
    const coach = await this.coachesRepository.findOverviewById(id);

    if (!coach) {
      throw new NotFoundException('Coach not found');
    }

    const {
      password,
      createdPlans,
      missedTasks,
      totalAssignedStudents,
      ...publicCoach
    } = coach;

    return {
      coach: publicCoach,
      stats: {
        createdPlans,
        missedTasks,
        totalAssignedStudents,
      },
    };
  }

  async updateCoach(
    id: number,
    dto: UpdateCoachDto,
    actor: AuthenticatedUser,
  ): Promise<PublicCoach> {
    const coach = await this.coachesRepository.findById(id);

    if (!coach) {
      throw new NotFoundException('Coach not found');
    }

    const updatedCoach = await this.usersService.updateUser(
      id,
      {
        fullName: dto.fullName,
        password: dto.password,
        phone: dto.phone,
      },
      actor,
    );

    return updatedCoach as PublicCoach;
  }

  private toPublicCoach(coach: CoachRow): PublicCoach {
    const { password, ...publicCoach } = coach;
    return publicCoach;
  }
}
