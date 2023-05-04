import { ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { ValidationPipe } from './validation.pipe';

describe('Validation', () => {
    const validationsPipe = new ValidationPipe();

    it('[fail] : will test the dto', async () => {
        class TestDto {
            @IsString()
            path!: string;
        }
        const metadata: ArgumentMetadata = {
            type: 'body',
            metatype: TestDto,
            data: '',
        };

        validationsPipe.transform(<TestDto>{}, metadata).catch((er) => {
            expect(er).toBeInstanceOf(BadRequestException);
        });
    });

    it('[success] : will test the dto', async () => {
        class TestDto {
            @IsString()
            path!: string;
        }
        const metadata: ArgumentMetadata = {
            type: 'body',
            metatype: TestDto,
            data: '',
        };

        const data: TestDto = {
            path: 'path',
        };

        const re = await validationsPipe.transform(data, metadata);
        expect(re).toEqual(data);
    });

    it('[fail] : nested property', async () => {
        class NestTestDto {
            @IsNumber()
            value!: number;
        }

        class TestDto {
            @IsString()
            path!: string;

            @Type(() => NestTestDto)
            @IsArray()
            @ValidateNested({ each: true })
            child!: NestTestDto[];
        }

        const metadata: ArgumentMetadata = {
            type: 'body',
            metatype: TestDto,
            data: '',
        };

        const data = {
            path: 'path',
            child: {
                value: '',
            },
        };

        validationsPipe.transform(data, metadata).catch((e) => {
            expect(e).toBeInstanceOf(BadRequestException);
            if (e instanceof BadRequestException) {
                expect(e.message).toBe('child must be an array');
            }
        });
    });

    it('[fail] : nested property', async () => {
        class NestTestDto {
            @IsNumber()
            value!: number;
        }

        class TestDto {
            @IsString()
            path!: string;

            @Type(() => NestTestDto)
            @IsArray()
            @ValidateNested({ each: true })
            child!: NestTestDto[];
        }

        const metadata: ArgumentMetadata = {
            type: 'body',
            metatype: TestDto,
            data: '',
        };

        const data: TestDto = {
            path: 'path',
            child: [
                {
                    value: 1,
                },
            ],
        };

        const v = await validationsPipe.transform(data, metadata);
        expect(v).toEqual(data);
    });
});
