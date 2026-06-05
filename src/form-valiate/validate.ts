import {toTypedSchema} from "@vee-validate/zod";
import z from "zod";

export const registerSchema = toTypedSchema(
    z.object({
        fullName: z
            .string()
            .min(3, 'Họ và tên tối thiểu 3 ký tự'),
        userName: z.string().nonempty('Tên đăng nhập không được bỏ trống'),
        email: z.string().email('Bạn đang nhập email không đúng định dạng'),
        phoneNumber: z.string().length(10,"Số điện thoại phải là 10 kí tự"),
        schoolName: z.string(),
        schoolGrade :z.string().default('1'),

        password: z.string().min(6,'Mật khẩu phải ít nhất 6 ký tự'),

        repeatPassword: z.string().min(6,'Mật khẩu phải ít nhất 6 ký tự')
    })
        .refine(
            (data) => data.password === data.repeatPassword,
            {
                message: 'Mật khẩu nhập lại không khớp',
                path: ['repeatPassword'],
            }),
)