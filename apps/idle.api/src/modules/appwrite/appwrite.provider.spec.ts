import { Test, TestingModule } from '@nestjs/testing';
import { AppWriteProvider } from './appwrite.provider';

describe('Appwrite', () => {
  let provider: AppWriteProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppWriteProvider],
    }).compile();

    provider = module.get<AppWriteProvider>(AppWriteProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
