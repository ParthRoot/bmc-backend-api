import { AvailableRoleEnum } from './auth.guard';
import { RoleGuard } from './role.guard';

describe('Role Guard', () => {
    const request: any = {
        switchToHttp: () => ({
            getRequest: () => ({
                user: {
                    role: 'ADMIN',
                },
            }),
        }),
    };

    it('will check the role guard', () => {
        const role = new RoleGuard(AvailableRoleEnum.ADMIN);
        const is = role.canActivate(request);
        expect(typeof is === 'boolean').toBe(true);
        expect(is).toBe(true);
    });
});
