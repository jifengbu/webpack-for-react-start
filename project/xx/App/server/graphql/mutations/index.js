import * as member from './common/member';
import * as personal from './common/personal';
import * as organization from './common/organization';
import * as role from './common/role';
import * as setting from './common/setting';

export default {
    ...member,
    ...personal,
    ...organization,
    ...role,
    ...setting,
};
