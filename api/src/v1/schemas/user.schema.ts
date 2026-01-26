import S from 'fluent-json-schema';

export const UserSchema = S.object()
    .prop('id', S.string().format('uuid'))
    .prop('name', S.string().minLength(2))
    .prop('age', S.integer().minimum(0))
    .prop('phonenumber', S.string().pattern('^[0-9+]{10,15}$'))
    .prop('gender', S.string().enum(['male', 'female', 'other']))
    .prop('healthMetadata', S.string())
    .prop('languagePreference', S.string().enum(['english', 'hindi', 'marathi']))
    .prop('locationConsent', S.boolean())
    .prop('latitude', S.number())
    .prop('longitude', S.number())
    .prop('createdAt', S.string());

export const CreateUserSchema = S.object()
    .prop('name', S.string().minLength(2).required())
    .prop('age', S.integer().minimum(0).required())
    .prop('phonenumber', S.string().pattern('^[0-9+]{10,15}$').required())
    .prop('gender', S.string().enum(['male', 'female', 'other']).required())
    .prop('healthMetadata', S.string())
    .prop('languagePreference', S.string().enum(['english', 'hindi', 'marathi']).default('english'))
    .prop('locationConsent', S.boolean())
    .prop('latitude', S.number())
    .prop('longitude', S.number())
    .prop('password', S.string().minLength(6));

export const UpdateUserSchema = S.object()
    .prop('name', S.string().minLength(2))
    .prop('age', S.integer().minimum(0))
    .prop('phonenumber', S.string().pattern('^[0-9+]{10,15}$'))
    .prop('gender', S.string().enum(['male', 'female', 'other']))
    .prop('healthMetadata', S.string())
    .prop('languagePreference', S.string().enum(['english', 'hindi', 'marathi']))
    .prop('locationConsent', S.boolean())
    .prop('latitude', S.number())
    .prop('longitude', S.number())
    .prop('password', S.string().minLength(6));

export const LoginSchema = S.object()
    .prop('phonenumber', S.string().pattern('^[0-9+]{10,15}$').required())
    .prop('password', S.string().minLength(6).required());

export const UserIdParamSchema = S.object()
    .prop('id', S.string().format('uuid').required());
