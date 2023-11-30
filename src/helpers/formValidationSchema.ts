import * as Yup from 'yup';


export const validationSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    company: Yup.string().required('Required'),
    location: Yup.string().required('Required'),
    type: Yup.string().oneOf(['Remote', 'Hybrid', 'On site']).required('Required'),
    link: Yup.string().required('Required'),
    applicationDate: Yup.date().required('Required'),
    interviewDate: Yup.string(),
    decisionDate: Yup.string(),
    decision: Yup.string().oneOf(['positive', 'negative', 'in progress', 'expired', 'unknown']).required('Required'),
});

export const taskValidationSchema = Yup.object({
    description: Yup.string().required('Required'),
    status: Yup.string()
        .oneOf(['Backlog', 'In Progress', 'Done'])
        .required('Required'),
    priority: Yup.string()
        .oneOf(['Low', 'Medium', 'High'])
        .required('Required'),
    dueDate: Yup.string().required('Required'),
    jobId: Yup.number().required('Required'),
    userIds: Yup.array().of(Yup.string().required('Required')).required('Required'),
});

export const userValidationSchema = Yup.object({
    username: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email address'),
    password: Yup.string().required('Required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match'),
});