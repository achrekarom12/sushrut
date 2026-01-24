import S from 'fluent-json-schema';

export const UserSchema = S.object()
    .prop('id', S.string().format('uuid'))
    .prop('firstname', S.string().minLength(2))
    .prop('lastname', S.string().minLength(2))
    .prop('mobileNumber', S.string().pattern('^[0-9]{10,15}$'))
    .prop('email', S.string().format('email'));

export const CreateUserSchema = S.object()
    .prop('firstname', S.string().minLength(2).required())
    .prop('lastname', S.string().minLength(2).required())
    .prop('mobileNumber', S.string().pattern('^[0-9]{10,15}$').required())
    .prop('email', S.string().format('email').required());

export const UpdateUserSchema = S.object()
    .prop('firstname', S.string().minLength(2))
    .prop('lastname', S.string().minLength(2))
    .prop('mobileNumber', S.string().pattern('^[0-9]{10,15}$'))
    .prop('email', S.string().format('email'));

export const UserIdParamSchema = S.object()
    .prop('id', S.string().format('uuid').required());
