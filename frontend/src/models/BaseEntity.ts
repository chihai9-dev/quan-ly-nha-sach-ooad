/**
 * Lớp trừu tượng cơ sở (Abstract Base Entity) cho tất cả các đối tượng nghiệp vụ.
 * Thể hiện tính Kế thừa (Inheritance) và Trừu tượng (Abstraction) trong OOP.
 */
export abstract class BaseEntity {
  protected readonly id: string;
  protected readonly createdAt: Date;
  protected updatedAt: Date;

  constructor(id: string, createdAt?: Date | string, updatedAt?: Date | string) {
    this.id = id;
    this.createdAt = createdAt ? new Date(createdAt) : new Date();
    this.updatedAt = updatedAt ? new Date(updatedAt) : new Date();
  }

  public getId(): string {
    return this.id;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  /**
   * Cập nhật thời điểm sửa đổi thực thể
   */
  protected touch(): void {
    this.updatedAt = new Date();
  }
}
